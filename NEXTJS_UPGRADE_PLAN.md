# Next.js 14.2.30 → 16.2.9 Upgrade Plan

**Status**: Planning  
**Priority**: CRITICAL (8+ CVEs in current version)  
**Estimated Effort**: 2-3 sprints (40-60 hours)  
**Timeline**: Start 2026-07-01, Complete 2026-07-31  
**Owner**: Engineering Lead  
**Escalation**: VP Engineering

---

## 📊 Executive Summary

Current Next.js 14.2.30 contains **8+ known critical CVEs**:
- Cache poisoning vulnerabilities
- Server-Side Request Forgery (SSRF) via middleware
- Denial of Service (DoS) attacks
- XSS injection in image optimization
- Route pattern matching issues

**Target**: Next.js 16.2.9 (LTS release, stable API)

**Breaking Changes Expected**: 3-5 major API changes requiring code updates

---

## 🔍 Pre-Upgrade Analysis

### Current Stack
```
Next.js: 14.2.30
React: 18.3.1
Node.js: ?  (recommended: 18.17+ or 20.9+)
Auth: next-auth 4.24.14
ORM: Supabase (@supabase/supabase-js ^2.108.2)
Payments: Stripe 22.2.2, PayPal SDK
```

### Breaking Changes Assessment (14.2.30 → 16.2.9)

| Area | Change | Impact | Action |
|------|--------|--------|--------|
| **App Router** | ESM-only requirement | Medium | Update imports, remove CJS |
| **API Routes** | Response.body streaming API | High | Test payment/email endpoints |
| **Middleware** | Runtime detection stricter | Medium | Verify edge cases |
| **Image Optimization** | New `next/image` internals | Low | Run visual tests |
| **getServerSideProps** | Deprecated (Pages Router) | None | Using App Router already |
| **Redirect/NotFound** | API changes | Low | Search and update imports |
| **Dynamic Segments** | generateStaticParams signature | Low | Check product/finca routes |
| **CSS Modules** | No changes | None | Keep as-is |

---

## 📋 Step-by-Step Upgrade Plan

### Phase 1: Preparation & Testing (Week 1)

#### Step 1.1: Create Upgrade Branch
```bash
git checkout main
git pull origin main
git checkout -b feat/nextjs-16-upgrade
```

#### Step 1.2: Node.js Version Check
```bash
node --version
# Current minimum: 18.17.0 or 20.9+
# If < 18.17, upgrade before proceeding
# Install latest LTS: nvm install 20
```

#### Step 1.3: Backup Current State
```bash
# Document current behavior
npm test:ci  # Get baseline coverage %
npm run build  # Note build output size
npm run lint  # Get current lint warnings
```

**Success Criteria**:
- [ ] Baseline test coverage recorded
- [ ] Baseline build size recorded  
- [ ] Baseline lint warnings recorded
- [ ] Current functionality verified in staging

---

### Phase 2: Dependency Updates (Week 1)

#### Step 2.1: Update package.json
Update these critical dependencies:

```json
{
  "dependencies": {
    "next": "16.2.9",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "next-auth": "5.0.0",
    "@supabase/ssr": "^0.17.0",
    "@supabase/supabase-js": "^2.114.0"
  },
  "devDependencies": {
    "eslint-config-next": "16.2.9",
    "typescript": "5.7.0"
  }
}
```

**Rationale**:
- **Next.js 16.2.9**: Stable LTS with all CVE patches
- **React 19.0.0**: Aligned with Next.js 16 (new Server Components)
- **next-auth 5.0.0**: NextAuth v5 required for Next.js 16 (major rewrite)
- **Supabase packages**: Updated for React 19 compatibility
- **TypeScript 5.7.0**: Latest stable version

#### Step 2.2: Install Dependencies
```bash
rm package-lock.json
npm install  # ~3-5 minutes
npm audit fix  # Address any new vulnerabilities
```

#### Step 2.3: Verify Dependencies
```bash
npm ls next react next-auth
# Verify exact versions installed
```

**Success Criteria**:
- [ ] All dependencies installed without errors
- [ ] No npm audit vulnerabilities (medium or higher)
- [ ] Lock file committed to git

---

### Phase 3: Code Updates - Core Files (Week 1-2)

#### Step 3.1: Update Authentication (`src/auth/auth.config.ts`)

**CRITICAL**: NextAuth v5 has major API changes.

```typescript
// OLD (v4):
import { NextAuthOptions } from "next-auth";

// NEW (v5):
import NextAuth from "next-auth";

// Migration: Functions to async callbacks
// OLD: providers: [ GoogleProvider(...) ]
// NEW: providers: [ google({ ... }) ]
```

**Changes Required**:
1. Remove `NextAuthOptions` type
2. Update provider imports (use `google()`, `github()` functions)
3. Update callback signatures
4. Update session/JWT configuration

**Files to Update**:
- `src/auth/auth.config.ts` (80% rewrite)
- `src/auth/auth.ts` (middleware wrapper)
- Any components using `useSession()` (API compatible)

**Estimated Time**: 2-3 hours

**Testing**:
```bash
# After update:
npm run dev  # Test login flow
# Expected: OAuth redirects work, sessions persist
```

#### Step 3.2: Update API Route Responses

**Issue**: Response streaming API changed

```typescript
// OLD (v14):
const stream = response.body;
stream.pipe(res);

// NEW (v16):
const reader = response.body.getReader();
// or use Response.json() directly
```

**Files to Check**:
- `src/app/api/payments/create-intent/route.ts`
- `src/app/api/orders/create/route.ts`
- `src/app/api/email/send/route.ts`
- Any endpoint returning streams

**Testing**:
```bash
# Payment flow test
curl -X POST http://localhost:3000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000}'
# Expected: Valid Stripe ClientSecret
```

**Estimated Time**: 1-2 hours (likely no changes needed if using NextResponse)

#### Step 3.3: Update Dynamic Routes

**Issue**: `generateStaticParams` signature changed slightly

```typescript
// Check these files:
// src/app/products/[id]/page.tsx
// src/app/fincas/[id]/page.tsx

// Should already be compatible, but verify
// NextAuth v5 may affect auth checks in getServerSideProps
```

**Files to Check**:
- `src/app/products/[id]/page.tsx`
- `src/app/fincas/[id]/page.tsx`
- `src/app/club/[level]/page.tsx`

**Estimated Time**: 30 minutes

---

### Phase 4: Testing (Week 2)

#### Step 4.1: Unit Tests
```bash
npm test:ci
# Expected: Same or better coverage than baseline
# Baseline: [check from Phase 1]
```

**Required Coverage**:
- [ ] Auth flows (Google, GitHub OAuth)
- [ ] API endpoints (payments, orders, email)
- [ ] Rate limiting (all 6 endpoints)
- [ ] Email sanitization
- [ ] Product/Finca detail pages

**Estimated Time**: 2-4 hours (fixing test failures)

#### Step 4.2: Build Verification
```bash
npm run build
# Expected: No errors, similar or smaller bundle size
# Baseline size: [check from Phase 1]

# Check build output
du -sh .next  # Should be ~100-150MB
```

**Build Tests**:
- [ ] Build completes without errors
- [ ] No TypeScript errors (npm run typecheck)
- [ ] No ESLint warnings in critical paths
- [ ] Asset sizes reasonable

**Estimated Time**: 1-2 hours

#### Step 4.3: Staging Deployment
```bash
# Deploy to staging environment
git push origin feat/nextjs-16-upgrade
# Trigger CI/CD pipeline
# Wait for staging deploy to complete
```

**Staging Tests** (Manual + Automated):
- [ ] Homepage loads
- [ ] OAuth login flow (Google + GitHub)
- [ ] Product detail page rendering
- [ ] Cart functionality
- [ ] Payment flow (test mode)
- [ ] Admin dashboard
- [ ] Email sending (tracked + verified)
- [ ] Rate limiting (verify 429 responses)
- [ ] Security headers present (HSTS, CSP)

**Success Criteria**: All above pass without errors

**Estimated Time**: 2-3 hours

---

### Phase 5: Performance Validation (Week 2-3)

#### Step 5.1: Bundle Size Analysis
```bash
npm run build
# Compare to baseline

# Detailed analysis
npm install -g webpack-bundle-analyzer
# (if needed for detailed insights)
```

**Benchmarks**:
- Bundle size increase: < 5%
- Build time: < 120 seconds
- First Contentful Paint (FCP): < 2.5s (measure in staging)

#### Step 5.2: Load Testing
```bash
# Use ApacheBench or k6 for staging load test
ab -n 100 -c 10 https://staging.flordealtura.com/

# Test rate limiting under load
for i in {1..50}; do
  curl -X POST https://staging.flordealtura.com/api/auth/signup \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"test$i@example.com\",\"password\":\"Test@1234567\"}" &
done
# Expected: Some requests get 429 (rate limited)
```

**Success Criteria**:
- [ ] No 5xx errors under normal load
- [ ] Rate limiting works as expected
- [ ] Response times < 500ms median

#### Step 5.3: Security Headers Verification
```bash
curl -I https://staging.flordealtura.com
# Expected headers:
# - Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# - Content-Security-Policy: ...
# - Permissions-Policy: geolocation=(), ...
```

---

### Phase 6: Documentation & Knowledge Transfer (Week 3)

#### Step 6.1: Update Internal Docs
- [ ] Update developer onboarding guide
- [ ] Document new Next.js 16 patterns
- [ ] Update API documentation (if any response changes)
- [ ] Create troubleshooting guide

#### Step 6.2: Create Migration Notes
```markdown
# NextAuth v4 → v5 Migration Notes

## Breaking Changes Encountered
1. Provider API changed (e.g., GoogleProvider → google())
2. Callback signatures updated
3. Session type definitions changed

## Files Modified
- src/auth/auth.config.ts
- src/middleware.ts (if used)
- Components using useSession()

## Testing Checklist
- OAuth login flow
- Session persistence
- CSRF protection
```

---

### Phase 7: Production Deployment (Week 3-4)

#### Step 7.1: Create Release Branch
```bash
git checkout -b release/nextjs-16
git merge feat/nextjs-16-upgrade
```

#### Step 7.2: Pre-Deployment Checklist
- [ ] All staging tests passed
- [ ] Load testing successful
- [ ] Security validation complete
- [ ] Rollback plan documented
- [ ] Team notification sent
- [ ] Incident response plan reviewed

#### Step 7.3: Production Deployment Strategy

**Option A: Blue-Green Deployment** (Recommended)
```bash
# 1. Deploy new version to "green" environment
# 2. Run smoke tests on green
# 3. Switch load balancer to green
# 4. Keep blue running for 1 hour (rollback ready)
# 5. Decommission blue after no issues
```

**Option B: Gradual Rollout** (If using feature flags)
```bash
# 1. Deploy new version
# 2. Route 5% traffic to new version
# 3. Monitor error rates (1 hour)
# 4. Increase to 25% (1 hour)
# 5. Increase to 50% (1 hour)
# 6. Increase to 100%
```

**Recommended**: Blue-green (safer, faster to rollback)

#### Step 7.4: Rollback Plan
If critical issues occur (>5% error rate, payment failures):

```bash
# Immediate rollback:
git revert <commit-hash>
npm run build
# Re-deploy to production

# Notify:
- Support team (for customer communication)
- Engineering team (incident postmortem)
- Security team (if CVE-related)
```

---

## 🚨 Known Risks & Mitigation

| Risk | Severity | Mitigation | Owner |
|------|----------|-----------|-------|
| NextAuth v5 API breaking | HIGH | 2-3 hour review + staging test | Backend |
| Payment endpoint failures | CRITICAL | Load test + transaction simulation | Backend + Payment Team |
| OAuth provider changes | HIGH | Test both Google + GitHub | Backend |
| Session invalidation | MEDIUM | Notify users, expect re-login | Product + Support |
| Build failures in prod | HIGH | CI/CD gate: must pass all tests | DevOps |
| Performance regression | MEDIUM | Bundle size + FCP benchmarking | Frontend + DevOps |

---

## 📊 Success Criteria (Definition of Done)

### Before Production
- [ ] All unit tests pass (npm test:ci)
- [ ] Build completes without errors
- [ ] TypeScript strict mode: 0 errors
- [ ] ESLint warnings: < 5 in critical paths
- [ ] Staging tests: 100% pass
- [ ] Performance benchmarks: Within 5% of baseline
- [ ] Security headers: All present and correct
- [ ] OAuth flows: Both providers working
- [ ] Rate limiting: All 6 endpoints validated
- [ ] Email sanitization: Verified with invalid inputs

### After Production (48 hours)
- [ ] Error rate < 0.5%
- [ ] No spike in 5xx responses
- [ ] Payment transactions: 100% success rate (test)
- [ ] User complaints: < 5 related to the upgrade
- [ ] Support escalations: None critical
- [ ] Performance metrics: Within baseline ±5%

---

## 📅 Timeline Summary

| Phase | Duration | Start | End | Owner |
|-------|----------|-------|-----|-------|
| Preparation | 2 days | 2026-07-01 | 2026-07-02 | Eng Lead |
| Dependency Updates | 1 day | 2026-07-03 | 2026-07-03 | Backend |
| Core Code Updates | 3-4 days | 2026-07-04 | 2026-07-07 | Backend + Frontend |
| Testing | 2-3 days | 2026-07-08 | 2026-07-10 | QA + Backend |
| Performance Validation | 2 days | 2026-07-11 | 2026-07-12 | DevOps |
| Documentation | 1 day | 2026-07-13 | 2026-07-13 | Tech Lead |
| Production Deployment | 1 day | 2026-07-14 | 2026-07-14 | DevOps |
| Post-Deploy Monitoring | 2 days | 2026-07-15 | 2026-07-16 | DevOps + Backend |

**Total**: 14-16 days (2-2.5 weeks actual, with buffer)

---

## 🔗 Related Documents

- [SECURITY_ACTION_PLAN.md](SECURITY_ACTION_PLAN.md) - Why this upgrade is critical
- [SECURITY_AUDIT_FINDINGS.md](SECURITY_AUDIT_FINDINGS.md) - CVEs being fixed
- Package.json - Current dependencies
- [Next.js 16 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-16) (external link)

---

## 📝 Tracking

**Checklist Items to Track**:
- Preparation: 5 items
- Dependency Updates: 3 items
- Code Updates: 8 items
- Testing: 12 items
- Performance: 6 items
- Deployment: 8 items
- **Total: 42 checkboxes**

Use GitHub Issues or Jira to track each checkbox item.

---

**Document Created**: 2026-06-23  
**Last Updated**: 2026-06-23  
**Review Cycle**: Weekly during upgrade phase
