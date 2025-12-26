---
description: Border styling convention for the Verifio dashboard
---

# Border Styling Convention

When adding borders to UI elements in the Verifio dashboard, use **lighter borders** with 50% opacity:

## Standard Border Color
- Use `stroke-soft-200/50` instead of `stroke-soft-200`
- This applies to both `border-` and `ring-` utilities

## Examples

### Border classes
```tsx
// ✅ Correct - lighter borders
className="border-stroke-soft-200/50 border-b"
className="border-l border-r border-stroke-soft-200/50"

// ❌ Avoid - too dark
className="border-stroke-soft-200 border-b"
```

### Ring classes
```tsx
// ✅ Correct - lighter rings
className="ring-1 ring-stroke-soft-200/50"

// ❌ Avoid - too dark
className="ring-1 ring-stroke-soft-200"
```

### Background borders (for absolutely positioned lines)
```tsx
// ✅ Correct
className="h-px bg-stroke-soft-200/50"

// ❌ Avoid
className="h-px bg-stroke-soft-200"
```

## Exceptions
- **Sidebar borders**: Keep as-is (not lightened)
- **Navbar borders**: Keep as-is (not lightened)
- **Error/Warning borders**: Use appropriate semantic colors (e.g., `border-error-base`)

## Firecrawl-style Section Dividers
For horizontal lines that extend to the viewport edge:
```tsx
<div className="relative">
  {/* Section content */}
  {/* Bottom border extending to right edge */}
  <div className="absolute bottom-0 left-0 right-[-100vw] h-px bg-stroke-soft-200/50" />
</div>
```
