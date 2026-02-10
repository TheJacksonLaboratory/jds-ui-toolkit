# Echo Theme Utility Classes

The Echo theme package provides auto-generated CSS utility classes that match Tailwind's naming conventions while using the Echo theme's CSS variables.

## Installation

The utilities are automatically generated when the theme package is built. To use them in your application:

### Option 1: Import in your global styles

```css
/* In your global styles.css or styles.scss */
@import '@jax-data-science/themes/utilities.css';
```

### Option 2: Import in your Angular app config

```typescript
// In your main.ts or app.config.ts
import '@jax-data-science/themes/utilities.css';
```

## Available Utilities

The following utility classes are generated for all Echo theme colors:

### Text Colors
```html
<span class="echo-text-slate-900">Dark slate text</span>
<span class="echo-text-grey-700">Grey text</span>
<span class="echo-text-cyan-700">Cyan text</span>
```

### Background Colors
```html
<div class="echo-bg-grey-100">Light grey background</div>
<div class="echo-bg-cyan-700">Cyan background</div>
```

### Border Colors
```html
<div class="echo-border-grey-200">Grey border</div>
<div class="echo-border-cyan-700">Cyan border</div>
```

### Fill Colors (for SVGs)
```html
<svg class="echo-fill-cyan-700">...</svg>
```

### Stroke Colors (for SVGs)
```html
<svg class="echo-stroke-grey-700">...</svg>
```

## Available Colors

All Echo primitive colors are available in the utility classes:
- `green` (50-900)
- `grey` (0, 100-1000)
- `navy` (50-900)
- `cyan` (50-900)
- `red` (50-900)
- `orange` (50-900)
- `yellow` (50-900)
- `slate` (50-900)
- `indigo` (50-900)
- `teal` (50-900)
- `pear` (50-900)
- `pink` (50-900)
- `purple` (50-900)

## Class Naming Convention

Classes follow this pattern:
- `echo-{property}-{color}-{shade}`

Examples:
- `echo-text-slate-900`
- `echo-bg-grey-100`
- `echo-border-cyan-700`
- `echo-fill-green-500`
- `echo-stroke-red-700`

## Using with Tailwind

These utility classes are designed to work alongside Tailwind CSS. The `echo-` prefix prevents conflicts with Tailwind's default color utilities.

```html
<!-- Mix Echo and Tailwind classes -->
<div class="tw-flex tw-items-center echo-bg-grey-100 echo-text-slate-900">
  Content using both Echo theme colors and Tailwind utilities
</div>
```

## Inline Styles Alternative

If you prefer not to import the utilities file, you can still use Echo theme colors via CSS variables:

```html
<div style="color: var(--slate-900);">Dark slate text</div>
<div style="background-color: var(--grey-100);">Light grey background</div>
```

## Regenerating Utilities

If you modify the Echo primitive colors, regenerate the utilities:

```bash
npx nx generate-utilities themes
```

This will update the `utilities.css` file with the latest colors.
