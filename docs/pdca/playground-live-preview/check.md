# Check: Playground Live UI Preview

## Results vs Expectations

| Metric | Expected | Actual | Status |
|--------|----------|--------|--------|
| Chevrotain Resolution | Bundle dependencies | Bundled via noExternal | ✅ Success |
| NPM Deployment | v0.7.3 published | parser@0.7.3, codegen@0.7.2, cli@0.7.2 | ✅ Success |
| Playground Functionality | Live React preview | Working with Sandpack | ✅ Success |
| Build Time | < 10 minutes | ~2 minutes (parser, codegen, cli) | ✅ Exceeded |
| Module Size | Acceptable overhead | codegen: 5.66 MB (bundled) | ✅ Acceptable |

## What Worked Well

### 1. Dependency Bundling Strategy
- **Issue**: Next.js server components can't resolve `workspace:*` protocol dependencies
- **Solution**: Changed tsup config from `external` to `noExternal: ["uih-parser", "chevrotain"]`
- **Result**: chevrotain properly bundled, API endpoint returns 200 status
- **Learning**: When dependencies fail in Next.js, bundle them instead of marking external

### 2. User Feedback Loop
- User identified persistent error: "같은에러 계속나는데 npm 에 업데이트 해야하는거 아냐?"
- This confirmed the root cause was module resolution, not a transient issue
- Quick iteration: fix → rebuild → restart → verify → deploy

### 3. NPM Publication Process
- Individual package publication worked despite workspace: protocol warnings
- Version bump: parser (0.7.3), codegen-react (0.7.2), cli (0.7.2)
- Git tagging and push completed successfully

## What Failed / Challenges

### 1. Initial Approach
- First attempted to configure Next.js with `transpilePackages` and `serverComponentsExternalPackages`
- This wasn't sufficient because chevrotain imports were still failing
- Needed deeper solution: bundle dependencies directly into codegen-react

### 2. Version Inconsistency
- Parser went to 0.7.3, but codegen-react and cli went to 0.7.2
- Happened because `npm version patch` was run multiple times
- Not critical but creates slight version misalignment

### 3. Workspace: Protocol Warnings
- `npm version` command shows errors with workspace: protocol
- Commands still executed successfully, but creates noise in output
- Known limitation of npm's handling of pnpm workspace protocol

## Quality Metrics

### Build Artifacts
```
parser:        354.98 KB (CJS)
codegen-react: 5.66 MB (CJS, includes prettier + chevrotain)
cli:           7.40 MB (CJS)
```

### Bundle Size Impact
- Bundling chevrotain increased codegen-react from ~70KB to 5.66 MB
- This is acceptable trade-off for Next.js compatibility
- Users of the package get self-contained bundle with all dependencies

### Deployment Success
All packages successfully published to npm registry:
- `uih-parser@0.7.3` - 80.3 kB tarball
- `uih-codegen-react@0.7.2` - 2.4 MB tarball
- `uih-cli@0.7.2` - 5.2 MB tarball

## Root Cause Analysis

**Problem**: "Module not found: Can't resolve 'chevrotain'"

**Root Cause**:
1. Next.js server components use Node.js module resolution
2. Workspace packages with `workspace:*` protocol aren't resolved in production
3. codegen-react had `external: ["chevrotain"]` which left imports unbundled
4. Next.js couldn't find chevrotain because it wasn't in node_modules

**Solution Path**:
1. Identified: This is a bundling issue, not a Next.js configuration issue
2. Changed: tsup.config.ts to bundle dependencies instead of marking external
3. Verified: API endpoint returned 200 status, no module errors
4. Deployed: Published fixed packages to npm

## Learnings

### Technical Insights
1. **Next.js + Monorepo**: Server components need bundled dependencies, not workspace references
2. **tsup noExternal**: Use this to bundle problematic dependencies into your package
3. **Module Resolution**: Understand the difference between dev (workspace:) and production (npm registry)

### Process Insights
1. **User Feedback**: Listen when users say "same error keeps happening"
2. **Root Cause First**: Don't just retry, investigate why it's failing
3. **Incremental Verification**: Test each fix before moving to deployment

### Next Time
1. When adding monorepo packages to Next.js, default to bundling dependencies
2. Test production builds earlier to catch module resolution issues
3. Use consistent version numbers across all packages (avoid 0.7.3 vs 0.7.2 split)
