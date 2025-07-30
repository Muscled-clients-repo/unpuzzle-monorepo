# ESLint Fixes TODO

This file tracks the ESLint errors that need to be fixed after deployment. The build is currently configured to ignore these errors for deployment purposes.

## Priority 1: Critical Errors (Fix immediately after deployment)

### 1. Unused Variables and Imports
- [ ] Fix all unused variable errors (prefix with _ for intentionally unused params)
- [ ] Remove unused imports across all files
- [ ] Remove commented out code that's no longer needed

### 2. React Hook Dependencies
- [ ] Add missing dependencies to useEffect and useCallback hooks
- [ ] Use useCallback for functions passed as dependencies
- [ ] Fix conditional hook calls

### 3. Security Issues
- [ ] Replace all `alert()` and `confirm()` with proper modal components
- [ ] Remove console.log statements (keep only console.warn and console.error)

## Priority 2: Type Safety (Fix within first week)

### 1. Replace 'any' Types
- [ ] Define proper interfaces for all API responses
- [ ] Create type definitions for complex objects
- [ ] Use generics where appropriate

### 2. Fix Type Errors
- [ ] Change `Boolean` to `boolean` primitive type
- [ ] Add proper type annotations to all functions

## Priority 3: Code Quality (Fix within two weeks)

### 1. Code Style
- [ ] Use `const` instead of `let` where variables aren't reassigned
- [ ] Fix unescaped entities (use &apos; for apostrophes)
- [ ] Remove unused function parameters or prefix with _

### 2. Component Optimization
- [ ] Review and optimize React.memo usage
- [ ] Fix unnecessary re-renders
- [ ] Optimize bundle size

## How to Fix

1. **Development Mode**: Run `npm run lint` to see all errors
2. **Fix File by File**: Start with components that have the most errors
3. **Test Thoroughly**: Ensure functionality isn't broken after fixes
4. **Gradual Migration**: Fix errors in batches and test before deploying

## Configuration Files

- `.eslintrc.json` - Main ESLint configuration (strict for development)
- `.eslintrc.production.json` - Production ESLint configuration (more lenient)
- `next.config.ts` - Currently has `ignoreDuringBuilds: true` for both ESLint and TypeScript

## Notes

- The `ignoreDuringBuilds` settings in `next.config.ts` should be removed once all errors are fixed
- Consider setting up pre-commit hooks to prevent new ESLint errors
- Use `npm run lint:fix` to auto-fix some errors