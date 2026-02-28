# Copilot Instructions for tickyourbudget

## Documentation maintenance — MANDATORY

Whenever you modify **any source file** (HTML, CSS, JS, manifest, service worker, or workflow), you **must** also update the relevant documentation:

1. **`docs/ARCHITECTURE.md`** — The complete application specification. Update any sections affected by your changes (data models, view behaviour, business rules, file map, UI layout, etc.). This is the single source of truth for how the app works.

2. **`README.md`** — The user-facing project overview. If your changes add, remove, or modify a feature, update the features list, tech stack, or any other affected section.

Do **not** skip documentation updates. Every code change that alters behaviour, adds features, changes data models, or modifies UI must be reflected in both documents.

## Project context

- **Stack:** Vanilla JS (ES6 modules), HTML5, CSS3, PWA — no framework, no bundler
- **Storage:** IndexedDB (`tickyourbudget` DB, 4 stores) + localStorage for settings
- **Architecture:** Single-page app with 5 views toggled via bottom nav (Home, Items, Categories, Data, Profiles)
- **Hosting:** GitHub Pages (static files, no build step)
- **Entry point:** `js/app.js` loaded as `<script type="module">` from `index.html`

## Code conventions

- All JS files use ES6 module `import`/`export` syntax
- No external dependencies — everything is vanilla
- CSS uses custom properties for theming (`:root` for light, `[data-theme='dark']` for dark)
- Data model factories are in `js/models.js`
- All DB operations go through `js/db.js` helpers
- Views are in `js/views/`, components in `js/components/`
