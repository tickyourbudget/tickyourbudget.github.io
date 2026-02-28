# 3. File Map & Module Responsibilities

```
tickyourbudget.github.io/
├── index.html                     → SPA shell: header, 5 views, bottom nav, modal container, shortcuts overlay
├── manifest.json                  → PWA manifest (name, icons, display, theme_color)
├── sw.js                          → Service Worker: cache-first offline strategy
├── css/
│   └── styles.css                 → All styles: layout, components, theming, animations, responsive
├── docs/
│   ├── ARCHITECTURE.md            → Index linking to architecture sub-documents
│   └── architecture/              → Split architecture specification files
├── js/
│   ├── app.js                     → Entry point: init DB, theme, profiles, views, router, keyboard shortcuts
│   ├── db.js                      → IndexedDB wrapper (CRUD, indexes, import/export)
│   ├── models.js                  → Factory functions, enums (FREQUENCY, TX_STATUS), formatters
│   ├── transaction-engine.js      → Occurrence calculation + transaction generation/reconciliation
│   ├── components/
│   │   ├── modal.js               → openModal() + showConfirm() — bottom-sheet modal system
│   │   ├── toast.js               → showToast(message, type) — auto-dismiss notifications
│   │   ├── theme.js               → Dark/light toggle, localStorage persistence, system detection
│   │   └── profile.js             → Profile CRUD, selector dropdown, cascade delete, auto-default, FAB-based creation
│   └── views/
│       ├── home.js                → Checklist view: month nav, summary, progress bar, donut chart, month comparison, search, grouped transactions
│       ├── items.js               → Budget items: card list with search, add/edit/delete with modal forms (includes endDate)
│       ├── categories.js          → Category tree: parent/child with move-to-root/subcategory, add/edit/delete
│       └── data.js                → Config view: currency selector, JSON preview, export (JSON + CSV), import, sample data, clear
├── icons/
│   ├── icon-192.png               → PWA icon 192×192
│   ├── icon-192.svg               → Source SVG
│   ├── icon-512.png               → PWA icon 512×512
│   └── icon-512.svg               → Source SVG
└── .github/
    └── workflows/
        └── deploy.yml             → GitHub Actions: deploy static files to GitHub Pages
```

## Module dependency graph

```
app.js
├── db.js
├── components/theme.js
├── components/profile.js
│   ├── db.js
│   ├── models.js
│   ├── components/modal.js
│   └── components/toast.js
├── views/home.js
│   ├── db.js
│   ├── transaction-engine.js
│   │   ├── models.js
│   │   └── db.js
│   ├── models.js
│   └── components/profile.js
├── views/items.js
│   ├── db.js
│   ├── models.js
│   ├── components/profile.js
│   ├── components/modal.js
│   └── components/toast.js
├── views/categories.js
│   ├── db.js
│   ├── models.js
│   ├── components/profile.js
│   ├── components/modal.js
│   └── components/toast.js
└── views/data.js (Config view)
    ├── db.js
    ├── models.js
    ├── components/profile.js  (getCurrency, setCurrency, CURRENCY_OPTIONS)
    ├── components/modal.js
    └── components/toast.js
```
