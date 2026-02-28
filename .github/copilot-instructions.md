# Copilot Instructions for tickyourbudget

## Documentation maintenance — MANDATORY

Whenever you modify **any source file** (HTML, CSS, JS, manifest, service worker, or workflow), you **must** also update the relevant documentation:

1. **`docs/architecture/`** — The split architecture specification. Update **only the specific file(s)** affected by your changes. See `docs/ARCHITECTURE.md` for the index. Do **not** rewrite files that haven't changed.

2. **`README.md`** — The user-facing project overview. If your changes add, remove, or modify a feature, update the features list, tech stack, or any other affected section.

Do **not** skip documentation updates. Every code change that alters behaviour, adds features, changes data models, or modifies UI must be reflected in the relevant docs.

## Efficiency rules

- **Do not re-read files you already read** in the current session. Use the information you gathered earlier.
- **Use `mv` (move/rename)** in the terminal instead of reading a file and rewriting it when only the path or filename needs to change.
- **Update only the affected doc file(s)** — e.g., if you change a keyboard shortcut, update `docs/architecture/10-keyboard-shortcuts.md` only, not the entire architecture.
- **Batch independent edits** into a single multi-replace call instead of sequential single replacements.

## Project context

- **Stack:** Vanilla JS (ES6 modules), HTML5, CSS3, PWA — no framework, no bundler
- **Storage:** IndexedDB (`tickyourbudget` DB, 4 stores) + localStorage for settings
- **Architecture:** Single-page app with 5 views toggled via bottom nav (Home, Items, Categories, Profiles, Config)
- **Hosting:** GitHub Pages (static files, no build step)
- **Entry point:** `js/app.js` loaded as `<script type="module">` from `index.html`

## Code conventions

- All JS files use ES6 module `import`/`export` syntax
- No external dependencies — everything is vanilla
- CSS uses custom properties for theming (`:root` for light, `[data-theme='dark']` for dark)
- Data model factories are in `js/models.js`
- All DB operations go through `js/db.js` helpers
- Views are in `js/views/`, components in `js/components/`
