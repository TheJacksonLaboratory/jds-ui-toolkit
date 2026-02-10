# Tailwind CSS Setup Documentation

## Current Architecture

This project uses a **hybrid approach** for Tailwind CSS in the component library, which is unconventional but functional.

## How It Works

### Components Library (`libs/components`)

The components library uses a pre-compilation approach:

1. **Build Process** (defined in `libs/components/compile-styles.js`):
   ```javascript
   // Scans all component files
   npx tailwindcss -i ./src/styles/tailwind.css -o ./src/styles/components-tailwind.css
   ```

2. **Output**: Generates `components-tailwind.css` containing all Tailwind classes used in components

3. **Purpose**: Ships pre-compiled Tailwind CSS with the component library

### Themes Library (`libs/themes`)

Recently added Echo theme utility class generation:

1. **Script**: `libs/themes/scripts/generate-utilities.ts`
2. **Output**: `libs/themes/src/utilities.css`
3. **Purpose**: Provides Tailwind-style utility classes for Echo theme colors
4. **Classes**: `echo-text-*`, `echo-bg-*`, `echo-border-*`, `echo-fill-*`, `echo-stroke-*`
5. **Variables**: References `--echo-{color}-{shade}` CSS variables from the theme

### Demo App (`apps/demo`)

The demo app has its own Tailwind configuration:

1. **Config**: `tailwind.config.js` at root with `tw-` prefix
2. **Imports**:
   - PrimeIcons
   - Echo theme utilities (`@jax-data-science/themes/utilities.css`)
3. **Layers**: Uses CSS layers to control specificity

## Standard vs Current Approach

### Standard Angular + Tailwind Library Pattern

Most Angular component libraries follow this approach:

```javascript
// Recommended tailwind.config.js for consumers
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './node_modules/@jax-data-science/components/**/*.{html,ts}' // Include library
  ],
  // ... rest of config
}
```

**Benefits**:
- Tree-shaking: Only classes actually used get included
- No duplicate CSS
- Smaller bundle sizes
- Consumer controls Tailwind version
- Standard pattern, well-documented

### Current Hybrid Approach

**What we do**:
- Pre-compile Tailwind classes used in components
- Ship compiled CSS file with the library
- Consumers import the pre-compiled CSS

**Potential Issues**:
1. **Duplication**: Consumers using Tailwind will have duplicate styles
2. **Bundle Size**: All component styles included, even if not used
3. **No Tree-shaking**: Can't eliminate unused styles
4. **Version Lock**: Consumers can't easily update Tailwind
5. **Maintenance**: Must regenerate CSS on every component change

**Potential Benefits**:
1. **Simpler for consumers**: No Tailwind setup required
2. **Guaranteed styles**: Components always have their styles
3. **Framework agnostic**: Could use components without Tailwind

## Recommendations

### Option 1: Move to Standard Pattern (Recommended)

**Steps**:
1. Remove `compile-styles.js` and related build steps
2. Document that consumers must:
   - Install Tailwind CSS
   - Add library paths to their Tailwind config
3. Keep Echo theme utilities (they're theme-specific, not Tailwind)

**Migration for consumers**:
```javascript
// Consumer's tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './node_modules/@jax-data-science/components/**/*.{html,ts}'
  ],
  prefix: 'tw-', // Match library prefix
  // ... rest of config
}
```

### Option 2: Keep Current Approach

If there's a specific reason to ship pre-compiled CSS:

**Document why** (e.g., "We support non-Tailwind projects")

**Improve the approach**:
1. Offer both options: pre-compiled CSS AND peer dependency pattern
2. Document trade-offs clearly
3. Consider PostCSS plugins for better optimization
4. Version the compiled CSS with Tailwind version

## Echo Theme Utilities

The Echo theme utilities are **separate and should stay**:

- **Purpose**: Provide theme-specific color utilities
- **Not Tailwind duplication**: These reference theme CSS variables
- **Framework agnostic**: Can be used with or without Tailwind
- **Pattern**: `echo-text-{color}-{shade}` → `var(--echo-{color}-{shade})`

### Usage

```typescript
// In styles.css
@import "@jax-data-science/themes/utilities.css";
```

```html
<!-- Use Echo theme colors -->
<div class="echo-text-slate-900 echo-bg-grey-100">
  Styled with Echo theme colors
</div>
```

## Files Reference

### Components Library
- `libs/components/compile-styles.js` - Tailwind compilation script
- `libs/components/copy-styles.js` - Style copying script
- `libs/components/src/styles/components-tailwind.css` - Generated output
- `libs/components/src/styles/tailwind.css` - Input file

### Themes Library
- `libs/themes/scripts/generate-utilities.ts` - Utility generation script
- `libs/themes/src/utilities.css` - Generated Echo utilities
- `libs/themes/src/lib/echo/primitive.ts` - Color definitions
- `libs/themes/src/lib/echo/theme.ts` - Theme preset

### Demo App
- `apps/demo/src/styles.css` - Global styles with imports
- `tailwind.config.js` - Root Tailwind config (tw- prefix)

## Path Mapping

The `tsconfig.base.json` includes a path mapping for development:

```json
{
  "paths": {
    "@jax-data-science/themes/utilities.css": ["libs/themes/src/utilities.css"]
  }
}
```

This allows the demo app to import utilities during development. In production, the path resolves to `node_modules/@jax-data-science/themes/utilities.css`.

## Build Commands

### Generate Echo Theme Utilities
```bash
npx nx generate-utilities themes
```

### Build Themes Package (includes utilities)
```bash
npx nx build themes
```

### Build Components (includes Tailwind compilation)
```bash
npx nx build components
```

## Questions to Consider

1. **Who are the consumers?**
   - Internal teams (can mandate Tailwind setup)
   - External users (might prefer pre-compiled CSS)

2. **Bundle size concerns?**
   - Pre-compiled CSS: ~50-200KB depending on components
   - Consumer-compiled: Only what's used

3. **Maintenance burden?**
   - Current approach requires CI/CD to run compilation
   - Standard approach is zero-maintenance for library

4. **Documentation effort?**
   - Current approach: Simple ("just import the CSS")
   - Standard approach: Requires setup docs

## Next Steps

1. **Decide on approach**: Standard vs Hybrid
2. **Document decision**: Add reasoning to this file
3. **Update consumer docs**: Clear setup instructions
4. **Consider migration path**: If changing approaches

---

**Last Updated**: 2026-02-10
**Decision Status**: Under Review
