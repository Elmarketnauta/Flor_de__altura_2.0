# Next.js 14.2.30 → 16.2.9 Upgrade Checklist

**Start Date**: ___________  
**Completion Date**: ___________  
**Assigned To**: ___________

---

## ✅ PHASE 1: PREPARATION (Week 1 - 2 days)

### 1.1 Environment Setup
- [ ] Clone latest main branch: `git checkout main && git pull`
- [ ] Verify Node.js version: `node --version` (must be 18.17+)
  - Current version: _________
  - If < 18.17: Run `nvm install 20` and activate
- [ ] Create upgrade branch: `git checkout -b feat/nextjs-16-upgrade`
- [ ] Document baseline metrics:

### 1.2 Baseline Metrics (Run before upgrade)
```bash
# Run these commands and record results
npm test:ci  
npm run build
npm run lint
```

- [ ] Test Coverage ____%
- [ ] Build Size (du -sh .next): _____ MB
- [ ] Lint Warnings: _____ 
- [ ] Build Time: _____ seconds
- [ ] TypeScript Errors: _____

### 1.3 Verification in Staging
- [ ] Deploy current main to staging
- [ ] Test OAuth login (Google): ✓ / ✗
- [ ] Test OAuth login (GitHub): ✓ / ✗
- [ ] Test product detail page: ✓ / ✗
- [ ] Test payment flow (test mode): ✓ / ✗
- [ ] Check rate limiting endpoints: ✓ / ✗
- [ ] Verify email sending works: ✓ / ✗

**Notes**: ___________________________________________________________

---

## ✅ PHASE 2: DEPENDENCY UPDATES (Week 1 - 1 day)

### 2.1 Update package.json

```bash
# Remove lock file
rm package-lock.json

# Edit package.json with these versions:
# "next": "16.2.9"
# "react": "19.0.0"
# "react-dom": "19.0.0"
# "next-auth": "5.0.0"
# "typescript": "5.7.0"
# "@supabase/ssr": "^0.17.0"
# "eslint-config-next": "16.2.9"
```

- [ ] Updated package.json (record changes below)

**Changes Made**:
- Next.js: 14.2.30 → 16.2.9
- React: 18.3.1 → 19.0.0
- next-auth: 4.24.14 → 5.0.0
- TypeScript: 5.6.2 → 5.7.0
- Other: ___________________________________

### 2.2 Install & Verify Dependencies
- [ ] Run `npm install` (should take 3-5 min)
- [ ] Run `npm audit fix` (address vulnerabilities)
- [ ] Verify versions: `npm ls next react next-auth`
  - next: 16.2.9 ✓
  - react: 19.0.0 ✓
  - next-auth: 5.0.0 ✓
- [ ] Commit lock file: `git add package*.json && git commit -m "deps: upgrade to Next.js 16.2.9"`

**Issues Encountered**: ___________________________________________________________

---

## ✅ PHASE 3: CODE UPDATES (Week 1-2 - 3-4 days)

### 3.1 Authentication System (`src/auth/auth.config.ts`)

**File**: `src/auth/auth.config.ts`  
**Complexity**: HIGH (80% rewrite expected)  
**Estimated Time**: 2-3 hours

#### Pre-Migration Analysis
- [ ] Read current auth.config.ts structure
- [ ] List current providers being used:
  - [ ] Google OAuth
  - [ ] GitHub OAuth
  - [ ] Email/credentials (if any)
- [ ] Document current callbacks:
  - signIn: _________________________
  - session: _________________________
  - jwt: _________________________

#### Migration Steps
- [ ] Update NextAuth import: `import NextAuth from "next-auth"`
- [ ] Remove `NextAuthOptions` type
- [ ] Convert GoogleProvider → `google()`
- [ ] Convert GithubProvider → `github()`
- [ ] Update provider configuration:
  ```typescript
  // OLD: GoogleProvider({ clientId: ..., clientSecret: ... })
  // NEW: google({ clientId: ..., clientSecret: ... })
  ```
- [ ] Update callback signatures (v5 uses different parameters)
- [ ] Update session configuration (JWT changes)
- [ ] Verify `allowDangerousEmailAccountLinking: false` is set
- [ ] Verify `session.maxAge: 24 * 60 * 60` is set

**Testing After Update**:
- [ ] No TypeScript errors: `npm run typecheck`
- [ ] Lint passes: `npm run lint`
- [ ] Dev server starts: `npm run dev` (should be no errors)
- [ ] Manual test: OAuth Google redirect works
- [ ] Manual test: OAuth GitHub redirect works

**Issues Encountered**: ___________________________________________________________

**Modified Files**:
- [ ] `src/auth/auth.config.ts`
- [ ] `src/auth/auth.ts` (if wrapper needs updates)
- [ ] Components using `useSession()` (test)

### 3.2 API Routes - Response Handling

**Files to Review**:
- `src/app/api/payments/create-intent/route.ts`
- `src/app/api/orders/create/route.ts`
- `src/app/api/email/send/route.ts`
- `src/app/api/errors/route.ts`

#### Check Each Endpoint
- [ ] **Payments endpoint**: Uses NextResponse ✓ / Update needed
- [ ] **Orders endpoint**: Uses NextResponse ✓ / Update needed
- [ ] **Email endpoint**: Uses NextResponse ✓ / Update needed
- [ ] **Error endpoint**: Uses NextResponse ✓ / Update needed

**If Issues Found**: ___________________________________________________________

### 3.3 Dynamic Routes

**Files to Review**:
- `src/app/products/[id]/page.tsx`
- `src/app/fincas/[id]/page.tsx`
- `src/app/club/[level]/page.tsx`

- [ ] Check `generateStaticParams` exists and correct format
- [ ] Verify `generateMetadata` is using correct signature
- [ ] Test product detail page loads (e.g., /products/espresso-blend)
- [ ] Test finca detail page loads (e.g., /fincas/finca-1)

**Issues Found**: ___________________________________________________________

### 3.4 Middleware (if applicable)
- [ ] Check `src/middleware.ts` exists ✓ / ✗ N/A
  - If exists: Review for v16 compatibility
  - Verify runtime: `edge` or `nodejs`

---

## ✅ PHASE 4: TESTING (Week 2 - 2-3 days)

### 4.1 Unit Tests
```bash
npm test:ci
```

- [ ] All tests pass without new failures
- [ ] Coverage >= baseline (____%)
  - Baseline: ____%
  - After upgrade: ____%
- [ ] No TypeScript errors in test output
- [ ] Document any test failures:

**Test Failures** (if any):
```
1. ______________________________________
   Fix: __________________________________

2. ______________________________________
   Fix: __________________________________
```

### 4.2 Build Verification
```bash
npm run build
```

- [ ] Build completes without errors
- [ ] No TypeScript strict errors
- [ ] Check bundle size: `du -sh .next`
  - Baseline: _____ MB
  - After upgrade: _____ MB
  - Acceptable if < _____ MB
- [ ] Build time acceptable: _____ seconds

**Build Issues** (if any):
```
Error 1: ___________________________________________________________
Resolution: _________________________________________________________

Error 2: ___________________________________________________________
Resolution: _________________________________________________________
```

### 4.3 Lint Check
```bash
npm run lint
```

- [ ] No new errors introduced
- [ ] Warnings count acceptable: _____
- [ ] ESLint config updated if needed for v16

### 4.4 Type Checking
```bash
npm run typecheck
```

- [ ] No type errors: ✓ / ✗
- [ ] If errors, list them:
  - [ ] Error 1: ___________________________________
  - [ ] Error 2: ___________________________________

---

## ✅ PHASE 5: STAGING DEPLOYMENT (Week 2 - 2-3 days)

### 5.1 Deploy to Staging
- [ ] Push branch to remote: `git push origin feat/nextjs-16-upgrade`
- [ ] Trigger CI/CD pipeline
- [ ] Wait for staging deployment (estimated _____ minutes)
- [ ] Verify deployment successful in staging environment

### 5.2 Automated Smoke Tests
- [ ] CI/CD tests pass: ✓ / ✗
- [ ] Build step passed
- [ ] Linting passed
- [ ] Unit tests passed

### 5.3 Manual Functional Testing in Staging

#### Homepage & Navigation
- [ ] Homepage loads without errors
- [ ] Navigation header displays correctly
- [ ] Footer displays correctly
- [ ] Mobile responsive (test on small screen)
- [ ] All links functional (no 404s)

#### Authentication
- [ ] Google OAuth login works (redirects correctly)
  - Test email: ________________
  - Result: ✓ / ✗
- [ ] GitHub OAuth login works
  - Test email: ________________
  - Result: ✓ / ✗
- [ ] Session persists across page reload
- [ ] Logout works and clears session

#### Product & Content Pages
- [ ] Product listing page loads
- [ ] Product detail page loads (e.g., /products/test-product)
- [ ] Finca detail page loads (e.g., /fincas/finca-1)
- [ ] Club subscription page loads
- [ ] Images load correctly (next/image optimization)

#### Shopping Flow
- [ ] Add product to cart: ✓ / ✗
- [ ] Cart displays correct items and prices
- [ ] Proceed to checkout: ✓ / ✗
- [ ] Stripe payment form loads: ✓ / ✗
- [ ] Complete payment in test mode: ✓ / ✗
- [ ] Order confirmation email received: ✓ / ✗

#### API Endpoints
```bash
# Test rate limiting
for i in {1..35}; do
  curl -X GET https://staging.flordealtura.com/api/auth/profile \
    -H "Authorization: Bearer test-token" 2>/dev/null | grep -o '"status":[0-9]*' || echo "Error $i"
done
# Expected: First 30 succeed, then 429 (Too Many Requests)
```
- [ ] Rate limiting works correctly on endpoints

#### Email Functionality
- [ ] Test email with invalid URL parameter (should sanitize)
- [ ] Test tracking URL with valid carrier
- [ ] Test tracking URL with invalid carrier (should reject)
- [ ] Verify no sensitive data in error logs

#### Security Headers
```bash
curl -I https://staging.flordealtura.com | grep -E "Strict-Transport-Security|Content-Security-Policy|Permissions-Policy"
```
- [ ] HSTS header present: ✓ / ✗
- [ ] CSP header present: ✓ / ✗
- [ ] Permissions-Policy header present: ✓ / ✗

#### Admin Dashboard (if applicable)
- [ ] Admin login works
- [ ] Order management page loads
- [ ] Can update order status
- [ ] Admin email sending works

### 5.4 Issue Resolution
If issues found during testing, document and fix:

**Issue 1**:
- Description: ___________________________________________________________
- Severity: CRITICAL / HIGH / MEDIUM / LOW
- Fix Applied: ___________________________________________________________
- Testing Result: ✓ / ✗

**Issue 2**:
- Description: ___________________________________________________________
- Severity: CRITICAL / HIGH / MEDIUM / LOW
- Fix Applied: ___________________________________________________________
- Testing Result: ✓ / ✗

**Issue 3**:
- Description: ___________________________________________________________
- Severity: CRITICAL / HIGH / MEDIUM / LOW
- Fix Applied: ___________________________________________________________
- Testing Result: ✓ / ✗

---

## ✅ PHASE 6: PERFORMANCE VALIDATION (Week 2-3 - 2 days)

### 6.1 Bundle Size Analysis
```bash
npm run build
du -sh .next
```

- [ ] Build size: _____ MB (vs baseline _____ MB)
- [ ] Size increase < 5%: ✓ / ✗
- [ ] Build time: _____ seconds
- [ ] Acceptable performance: ✓ / ✗

### 6.2 Core Web Vitals (in staging)
Using Chrome DevTools or Lighthouse:
- [ ] Largest Contentful Paint (LCP): _____ ms (target < 2500ms)
- [ ] Cumulative Layout Shift (CLS): _____ (target < 0.1)
- [ ] First Input Delay (FID): _____ ms (target < 100ms)

### 6.3 Load Testing
```bash
# Simple load test with ApacheBench (if installed)
ab -n 100 -c 10 https://staging.flordealtura.com/
```

- [ ] Request success rate > 95%: ✓ / ✗
- [ ] Mean response time: _____ ms
- [ ] 95th percentile response time: _____ ms
- [ ] No 5xx errors: ✓ / ✗

### 6.4 Payment Processing Under Load
- [ ] Test 5 concurrent payment requests
- [ ] All succeed without errors: ✓ / ✗
- [ ] Rate limiting correctly applied: ✓ / ✗

---

## ✅ PHASE 7: DOCUMENTATION (Week 3 - 1 day)

### 7.1 Update Developer Docs
- [ ] Create migration summary document
- [ ] Document breaking changes encountered
- [ ] Update onboarding guide if needed
- [ ] Add troubleshooting section

### 7.2 Create Migration Notes

**Template**: 
```markdown
# NextAuth v4 → v5 Migration Summary

## Key Changes Made
1. Provider API: GoogleProvider() → google()
2. Callbacks: Updated signatures for v5
3. Sessions: Updated JWT/session config

## Files Modified
- src/auth/auth.config.ts
- (others)

## Testing Validation
- OAuth Google: ✓
- OAuth GitHub: ✓
- (others)

## Performance Impact
- Bundle size increase: X%
- Build time change: Y%

## Known Limitations/Future Work
- (if any)
```

---

## ✅ PHASE 8: PRODUCTION DEPLOYMENT (Week 3-4 - 1 day)

### 8.1 Pre-Deployment Checklist
- [ ] All staging tests passed
- [ ] Load testing successful
- [ ] Security validation passed
- [ ] Team notification sent
- [ ] Rollback plan documented and tested
- [ ] Deployment window scheduled
- [ ] On-call team notified
- [ ] Post-deploy monitoring configured

**Deployment Window**: _________________  
**On-Call Contact**: _________________  
**Backup Contact**: _________________

### 8.2 Deployment Execution

**Selected Strategy**: 
- [ ] Blue-Green Deployment
- [ ] Gradual Rollout (5% → 25% → 50% → 100%)
- [ ] Other: ___________________________

**Deployment Steps**:
```
1. [ ] Create release branch: git checkout -b release/nextjs-16
2. [ ] Merge feat/nextjs-16-upgrade into release branch
3. [ ] Deploy to production
4. [ ] Run smoke tests
5. [ ] Monitor error rates
6. [ ] Gradually increase traffic (if gradual rollout)
7. [ ] Verify all critical paths working
```

- [ ] Deployment started: _________ (time)
- [ ] Deployment completed: _________ (time)
- [ ] Initial health checks passed: ✓ / ✗

**Deployment Issues** (if any):
```
Issue: ___________________________________________________________
Action: ___________________________________________________________
Result: ✓ / ✗
```

### 8.3 Immediate Post-Deploy Checks (First 30 minutes)
```bash
# Check error logs
# Monitor dashboard metrics
# Verify payment processing
```

- [ ] Error rate < 0.5%: ✓ / ✗
- [ ] No spike in 5xx errors: ✓ / ✗
- [ ] Payment transactions succeeding: ✓ / ✗
- [ ] OAuth flows working: ✓ / ✗
- [ ] Email sending functional: ✓ / ✗
- [ ] Security headers present: ✓ / ✗

**Error Logs** (if any): ___________________________________________________________

### 8.4 Rollback Plan (if needed)
If critical issues occur:

```bash
# Emergency rollback procedure
git revert <commit-hash>
npm run build
# Re-deploy to production
```

- [ ] Rollback needed: YES / NO
  - If yes, executed at: _________ (time)
  - Issues that triggered rollback: ___________________
  - Rollback time: _________ minutes
  - Post-rollback error rate: ____%

---

## ✅ PHASE 9: POST-DEPLOYMENT MONITORING (48 hours)

### 9.1 Monitor Metrics (First 24 hours)
- [ ] Check error logs hourly
- [ ] Monitor response times
- [ ] Track payment success rate
- [ ] Monitor user complaints (support channel)

**Metrics Dashboard**: _________________

### 9.2 Test Critical Paths Daily
- [ ] OAuth login (both providers)
- [ ] Product browsing
- [ ] Payment processing (test mode)
- [ ] Email sending
- [ ] Admin dashboard

### 9.3 Customer Communication
- [ ] Notify users of new version (if any UX changes)
- [ ] Address support tickets related to upgrade
- [ ] Monitor social media for issues

### 9.4 Final Sign-Off
- [ ] All critical systems stable
- [ ] Error rates back to normal
- [ ] Customer feedback positive or neutral
- [ ] Engineering team sign-off: ✓ / ✗

**Sign-Off Date**: _________________  
**Signed By**: _________________

---

## 📊 Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Preparation | ✓ / ✗ | _________________ |
| Dependencies | ✓ / ✗ | _________________ |
| Code Updates | ✓ / ✗ | _________________ |
| Testing | ✓ / ✗ | _________________ |
| Performance | ✓ / ✗ | _________________ |
| Documentation | ✓ / ✗ | _________________ |
| Staging Deploy | ✓ / ✗ | _________________ |
| Production Deploy | ✓ / ✗ | _________________ |
| Post-Deploy | ✓ / ✗ | _________________ |

**Overall Status**: ✓ COMPLETE / ✗ IN PROGRESS / ⚠ BLOCKED

**Blocking Issues** (if any): ___________________________________________________________

---

**Checklist Created**: 2026-06-23  
**Started By**: _________________  
**Completed By**: _________________  
**Total Time Spent**: _____ hours
