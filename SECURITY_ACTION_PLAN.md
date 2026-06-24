# Security Action Plan - Flor de Altura Café

**Fecha**: 2026-06-23  
**Estado**: Auditoría completada, correcciones en progreso  
**Responsable**: DevSecOps Team

---

## 🚨 PRIORIDAD 0 - EMERGENCIA (Hacer hoy/mañana)

### 1. Secreto INTERNAL_API_SECRET
- **Status**: ✅ Rotado (ya hecho)
- **Verificación**: 
  ```bash
  # Confirmar que es diferente en .env.local
  grep INTERNAL_API_SECRET .env.local
  # NO debe ser: 288ff22d9e351591e6c6ef63cfc8e58b125eb0b3191a05cbbc5e93ca06f52897
  ```
- **En Staging/Prod**: Actualizar via secrets manager (no versionado)
- **Timeline**: Hoy antes de deploy

### 2. NEXTAUTH_SECRET
- **Status**: ✅ Rotado (ya hecho)
- **Verificación**:
  ```bash
  # Confirmar que es base64 seguro
  grep NEXTAUTH_SECRET .env.local
  # Debe ser algo como: MVC3ZI4NBPEpg2tK+jbAXZ5POSKSAH8x2jB5iUD73A4=
  ```
- **Nota**: Esto invalida todas las sesiones actuales (usuarios deben re-login)
- **Timeline**: Coordinar con equipo antes de deploy

### 3. Verificar RLS en Supabase
- **Status**: ⏳ Pendiente
- **Comando**:
  ```sql
  -- Check RLS enabled on critical tables
  SELECT tablename, rowsecurity FROM pg_tables 
  WHERE tablename IN ('orders', 'users', 'loyalty_accounts', 'points_transactions')
  AND rowsecurity = false;
  
  -- Should return EMPTY (all should have rowsecurity = true)
  ```
- **Action**: Si alguna tabla tiene `false`, habilitar RLS inmediatamente
- **Timeline**: Hoy

---

## 📅 PRIORIDAD 1 - CRÍTICA (This week)

### 1. Deploy Security Fixes
- **Status**: ✅ Commits ready
- **Deploy Path**: 
  1. Merge PR to staging
  2. Test all endpoints in staging
  3. Verify rate limiting works
  4. Email sanitization tested
  5. Merge to production

### 2. Next.js Upgrade Planning
- **Status**: ⏳ Planning phase
- **Current**: 14.2.30 (8+ known CVEs)
- **Target**: 16.2.9 or latest
- **Effort**: 2-3 sprints (testing required)
- **Risk**: Breaking changes in API routes
- **Checklist**:
  - [ ] Create upgrade branch
  - [ ] Update package.json
  - [ ] Run full test suite
  - [ ] Test image optimization endpoints
  - [ ] Verify middleware behavior
  - [ ] Test rewrites/redirects
  - [ ] Stage testing
  - [ ] Production deployment

### 3. Email Service Audit
- **Status**: ⏳ Pending
- **Check**:
  - [ ] Verify Resend integration (not direct Nodemailer)
  - [ ] Confirm all email addresses validated before send
  - [ ] Verify tracking URLs sanitized
  - [ ] Review email templates in production
- **Action**: If direct Nodemailer used, migrate to Resend/alternative

---

## 🔄 PRIORIDAD 2 - ALTA (Next 2 weeks)

### 1. Implement Email Verification Callback
**File**: `src/auth/auth.config.ts`
```typescript
callbacks: {
  async signIn({ user, account }) {
    if (!user.email) return false;
    
    // New: Verify email is actually verified if OAuth
    if (account?.provider !== "credentials") {
      const { data: existingUser } = await supabaseAdmin
        .from("users")
        .select("email_verified_at")
        .eq("email", user.email)
        .single();
      
      // Only link if email already verified OR verify first
      if (!existingUser?.email_verified_at) {
        // Send verification email
        // OR return false to require verification
      }
    }
    return true;
  }
}
```
- **Timeline**: 1 week
- **Testing**: Unit + integration tests

### 2. Admin IP Whitelisting
**File**: Create `src/middleware/admin-auth.ts`
```typescript
const ADMIN_IP_WHITELIST = [
  process.env.ADMIN_IP_1,
  process.env.ADMIN_IP_2,
];

export function checkAdminIp(request: NextRequest): boolean {
  const clientIp = getClientIp(request);
  return ADMIN_IP_WHITELIST.includes(clientIp);
}
```
- **Timeline**: 1 week
- **Env Vars Needed**: ADMIN_IP_1, ADMIN_IP_2, etc.
- **Fallback**: Log attempts from unknown IPs

### 3. Audit Log for Profile Changes
**File**: `src/app/api/auth/profile/route.ts` (PUT)
```typescript
// Log before/after for critical fields
const oldProfile = /* existing */;
const newProfile = /* after update */;

const changes = {
  email_changed: oldProfile.email !== newProfile.email,
  phone_changed: oldProfile.phone !== newProfile.phone,
};

if (Object.values(changes).some(c => c)) {
  await supabaseAdmin.from("audit_logs").insert({
    user_id,
    event_type: "profile_updated",
    before: oldProfile,
    after: newProfile,
    details: changes
  });
  
  // Optional: Email user about the change
  // sendEmail({ to: user.email, subject: "Profile Changed", ... })
}
```
- **Timeline**: 1 week
- **Testing**: Verify audit trail completeness

---

## 📊 PRIORIDAD 3 - MEDIA (Next sprint)

### 1. Dependency Scanning in CI/CD
**Add to GitHub Actions**:
```yaml
- name: npm audit
  run: npm audit --audit-level=moderate
  # Fails if moderate or higher vulnerabilities
```
- **Timeline**: 3 days
- **Tool**: npm audit (built-in) or Dependabot (GitHub)

### 2. Remove/Isolate crypto-js
- **Status**: Currently in `package.json` but unused
- **Decision**:
  - Option A: `npm uninstall crypto-js` (if truly unused)
  - Option B: Document why it's needed
- **Timeline**: 1 week
- **Verification**: 
  ```bash
  grep -r "crypto-js" src/ --include="*.ts" --include="*.tsx"
  # Should return nothing or document reason
  ```

### 3. localStorage Migration
**Current**: Cart data in localStorage  
**Target**: sessionStorage or server-side session
```typescript
// Option 1: Use sessionStorage (cleared on browser close)
storage: createJSONStorage(() => sessionStorage)

// Option 2: Server-side cart (best security)
// Store in Supabase, sync on actions
```
- **Timeline**: 1 sprint (backlog, low risk)
- **Testing**: Verify cart persistence across page reloads

### 4. CSRF Token Implementation (Defense in Depth)
**Not strictly required** (SameSite cookies protect), but recommended for:
- Mobile app integrations
- Third-party API calls
- Extra defense layer

```typescript
// Middleware: Generate CSRF token
export function setupCsrfToken(response: NextResponse) {
  const token = crypto.randomUUID();
  response.cookies.set('csrf-token', token, {
    httpOnly: false,
    sameSite: 'strict',
    secure: true,
  });
  return response;
}

// Use in forms: Include x-csrf-token header
```
- **Timeline**: 2 weeks (lower priority)
- **Compatibility**: Requires client-side changes

---

## 📋 VERIFICATION CHECKLIST

### Before Production Deploy
- [ ] All 5 security commits merged to main
- [ ] INTERNAL_API_SECRET rotated in production
- [ ] NEXTAUTH_SECRET rotated (users notified of re-login)
- [ ] Rate limiting tested in staging
- [ ] Email sanitization tested with invalid URLs
- [ ] Bearer token validation tested with malformed headers
- [ ] Error logs tested with sensitive data (verify redaction)
- [ ] HSTS/CSP headers verified with `curl -I`
- [ ] RLS policies verified on all tables
- [ ] Monitoring/alerting configured for rate limit violations

### Post-Deploy (24-48 hours)
- [ ] Monitor error logs for issues
- [ ] Check rate limiting metrics
- [ ] Verify no legitimate requests blocked
- [ ] Monitor failed auth attempts
- [ ] Check email delivery (none should fail validation)

### Pre-Next.js Upgrade
- [ ] Create detailed upgrade plan
- [ ] Test suite passing 100%
- [ ] Breaking change assessment
- [ ] Staging environment ready
- [ ] Rollback plan documented

---

## 📞 Escalation Path

| Issue | Owner | Timeline | Escalate To |
|-------|-------|----------|------------|
| Secrets rotation | DevOps | 24h | CTO |
| RLS verification | DBA | 24h | CTO |
| Next.js CVE | Eng Lead | 1 week | VP Eng |
| Email service | Backend | 1 week | VP Eng |
| Admin IP whitelist | Security | 1 week | CTO |

---

## 🔗 Related Documents

- [SECURITY_FIXES.md](SECURITY_FIXES.md) - Initial critical fixes
- [SECURITY_AUDIT_FINDINGS.md](SECURITY_AUDIT_FINDINGS.md) - Full audit report
- [SECURITY_VALIDATION_SUMMARY.md](SECURITY_VALIDATION_SUMMARY.md) - Summary stats

---

## 📊 Success Metrics

**Target Date**: 2026-07-31 (4 weeks for Priority 1-2)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Critical vulns fixed | 100% | 100% | ✅ |
| High vulns fixed | 75% | 75% | ✅ |
| Rate limiting endpoints | 6+ | 6 | ✅ |
| RLS policies verified | 100% | ? | ⏳ |
| Next.js upgraded | Yes | No | ⏳ |
| Email validation | 100% | 100% | ✅ |
| Security headers | 3+ | 3 | ✅ |

---

**Document Created**: 2026-06-23  
**Last Updated**: 2026-06-23  
**Review Cycle**: Monthly or after incidents
