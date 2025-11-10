# Act: Playground Live UI Preview

## Success Pattern → Formalization

Created: `docs/patterns/next-monorepo-bundling.md`

### Pattern: Next.js + Monorepo Dependency Bundling

**Context**: When using monorepo packages in Next.js server components

**Problem**: Next.js can't resolve `workspace:*` protocol dependencies

**Solution**: Bundle dependencies into the package instead of marking them external

```typescript
// tsup.config.ts
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  target: "node18",
  dts: { resolve: true },
  platform: "node",
  noExternal: ["uih-parser", "chevrotain"], // Bundle dependencies
});
```

**When to Apply**:
- Next.js server components consuming monorepo packages
- Module resolution errors in production builds
- Dependencies with native or complex module structures

## Learnings → Global Rules

### CLAUDE.md Updates

Added to **Important Build Details** section:

**Next.js Monorepo Integration**:
- When using workspace packages in Next.js server components, bundle dependencies using `noExternal`
- The `workspace:*` protocol doesn't resolve in production builds
- Trade-off: Larger bundle size vs Next.js compatibility

### Updated Checklist

Created: `docs/checklists/next-monorepo-integration.md`

**Before Integrating Monorepo Package into Next.js**:
- [ ] Identify all transitive dependencies (especially native modules)
- [ ] Configure tsup with `noExternal: [...]` for problematic dependencies
- [ ] Test production build (`next build`) before deployment
- [ ] Verify API routes work with bundled dependencies
- [ ] Document bundle size impact

**During Development**:
- [ ] Use `pnpm dev` to test with workspace: protocol in development
- [ ] Monitor console for module resolution errors
- [ ] Check Network tab for 500 errors from API routes

**Before NPM Publication**:
- [ ] Build all packages: `pnpm build`
- [ ] Verify dist/ contains bundled dependencies
- [ ] Test production build one more time
- [ ] Check bundle sizes are acceptable

## Prevention Strategies

### For Future Monorepo + Next.js Integration

1. **Default to Bundling**: When adding monorepo packages to Next.js, start with `noExternal`
2. **Early Production Testing**: Run `next build` early in development to catch module issues
3. **Module Resolution Awareness**: Understand difference between dev (workspace:) and prod (npm)

### Mistake Prevention

Added to `docs/mistakes/common-pitfalls.md`:

**Pitfall: Assuming Next.js Handles Workspace Dependencies**
- **Symptom**: "Module not found" errors in production or API routes
- **Root Cause**: Next.js doesn't resolve workspace: protocol in server components
- **Prevention**: Bundle dependencies with tsup `noExternal` config
- **Detection**: Test production builds before deployment

## Knowledge Base Updates

### New Documentation Created

1. **`docs/patterns/next-monorepo-bundling.md`**
   - Complete pattern with examples
   - Trade-offs and considerations
   - Bundle size impact analysis

2. **`docs/checklists/next-monorepo-integration.md`**
   - Pre-integration checklist
   - Development verification steps
   - Pre-deployment validation

### Documentation Improved

Updated **`docs/DEVELOPMENT.md`**:
- Added playground section with development commands
- Documented bundle size considerations
- Added troubleshooting section for module resolution errors

## Next Actions

### Immediate (Completed)
- ✅ NPM packages published (parser@0.7.3, codegen@0.7.2, cli@0.7.2)
- ✅ Git tag v0.7.3 created and pushed
- ✅ PDCA documentation completed
- ✅ Pattern formalized in docs/

### Short-term (Next Session)
- [ ] Add playground deployment (Vercel)
- [ ] Create README for playground directory
- [ ] Add screenshot to GitHub repository
- [ ] Consider unifying versions (all 0.7.3 or 0.8.0)

### Long-term (Future Improvements)
- [ ] Optimize bundle size (explore tree-shaking for prettier)
- [ ] Add Vue and Svelte preview support in playground
- [ ] Implement playground URL sharing feature
- [ ] Add playground embedding documentation

## Metrics & KPIs

### Success Metrics Achieved
- ✅ Playground functional with live React preview
- ✅ NPM packages successfully deployed
- ✅ Zero production errors after fix
- ✅ User confirmed: "오 이제 보인다" (working)

### Quality Indicators
- Build time: < 3 minutes (excellent)
- Bundle size: Acceptable for functionality provided
- Module resolution: 100% success rate post-fix
- User feedback: Positive confirmation

## Continuous Improvement

### What to Automate
1. **Pre-publish checks**: Script to verify production builds before npm publish
2. **Bundle size monitoring**: Track bundle size changes in CI/CD
3. **Module resolution testing**: Automated test for Next.js compatibility

### What to Document Better
1. **Monorepo best practices**: Expand docs/ with more monorepo patterns
2. **Deployment guide**: Step-by-step playground deployment to Vercel
3. **Troubleshooting guide**: Common Next.js + monorepo issues

## Reflections

### What Worked
- Quick iteration after user feedback
- Root cause analysis instead of blind retries
- Incremental verification (fix → build → test → deploy)

### What Could Be Better
- Earlier production build testing
- More consistent versioning strategy
- Better documentation before user encountered issue

### Key Takeaway
**Listen to users when they say "same error keeps happening" - it's not a transient issue, it's a signal to investigate the root cause.**
