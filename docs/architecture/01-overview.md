# 1. Overview

**tickyourbudget** is a lightweight, offline-first Progressive Web App (PWA) for tracking recurring monthly expenses as a checklist. Users define budget items (templates) with a frequency (one-time, weekly, bi-weekly, monthly, quarterly, yearly) and the app automatically generates concrete transactions for each month. Users then check items off as they are paid.

## Core concepts

| Concept         | Description                                                                                                               |
|-----------------|---------------------------------------------------------------------------------------------------------------------------|
| **Profile**     | An isolated budget context (e.g., "Personal", "Family"). All data is profile-scoped.                                      |
| **Category**    | A grouping label for budget items. Supports one level of parent → child nesting.                                          |
| **Budget Item** | A template/rule defining a recurring or one-time expense with name, amount, frequency, start date, and optional end date. |
| **Transaction** | A concrete instance of a budget item on a specific date. Stores a snapshot of the name and amount at creation time.       |

## Tech stack

| Layer        | Technology                                                |
|--------------|-----------------------------------------------------------|
| **Frontend** | Vanilla JavaScript (ES6 modules, no framework or bundler) |
| **Storage**  | IndexedDB for persistent data; localStorage for settings  |
| **Styling**  | CSS3 with custom properties for theming                   |
| **Offline**  | Service Worker with cache-first strategy                  |
| **Hosting**  | GitHub Pages (static, no server-side logic)               |

---

# 2. Technical Architecture

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
├──────────────┬────────────────────────┬──────────────────┤
│  index.html  │  ES6 Module Graph      │  Service Worker  │
│  (SPA shell) │                        │  (sw.js)         │
│              │  app.js ──────────┐    │                  │
│              │    ├── db.js      │    │  Cache-first     │
│              │    ├── models.js  │    │  offline proxy   │
│              │    ├── txn-eng.js │    │                  │
│              │    ├── theme.js   │    ├──────────────────┤
│              │    ├── profile.js │    │  manifest.json   │
│              │    ├── home.js    │    │  (PWA metadata)  │
│              │    ├── items.js   │    │                  │
│              │    ├── cats.js    │    │                  │
│              │    └── config.js  │    │                  │
├──────────────┴────────────────────────┴──────────────────┤
│         IndexedDB (tickyourbudget)        localStorage   │
│  ┌──────────┬──────────┬──────────┬──────────┐   ┌────┐ │
│  │ profiles │categories│budgetItem│transact- │   │tyb_│ │
│  │          │          │s         │ions      │   │keys│ │
│  └──────────┴──────────┴──────────┴──────────┘   └────┘ │
└──────────────────────────────────────────────────────────┘
```

## How modules load

`index.html` loads a single `<script type="module" src="js/app.js">`. The browser resolves static `import` statements, building the module graph. No bundler, no transpile step — the source files **are** the production files.
