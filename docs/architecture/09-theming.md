# 10. Theming System

## CSS custom properties approach

All colors, shadows, radii, and transitions are defined as CSS custom properties on `:root` (light) and `[data-theme='dark']`.

## Toggle mechanism

1. `<html data-theme="light|dark">` attribute controls the theme.
2. `initTheme()`: reads `localStorage` → falls back to `prefers-color-scheme` media query → applies.
3. `toggleTheme()`: flips attribute → saves to `localStorage` → swaps sun/moon icons → updates `<meta name="theme-color">`.

## Color palette

| Token            | Light                      | Dark                          |
|------------------|----------------------------|-------------------------------|
| `--bg-primary`   | `#faf5ff` (lavender white) | `#1a1625` (deep purple-black) |
| `--bg-card`      | `#ffffff`                  | `#2a2438`                     |
| `--accent`       | `#a78bfa` (violet)         | `#a78bfa` (same)              |
| `--accent-hover` | `#8b5cf6`                  | `#c4b5fd`                     |
| `--text-primary` | `#1e1b2e`                  | `#f0ecf5`                     |
| `--success`      | `#86efac`                  | `#86efac`                     |
| `--danger`       | `#fca5a5`                  | `#fca5a5`                     |

Design language: **Pastel/friendly** — soft colors, rounded corners (`8px` to `9999px`), subtle shadows with purple tint, smooth 0.2s transitions.
