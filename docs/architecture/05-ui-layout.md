# 6. UI Layout & Component Hierarchy

## 6.1 Page layout

```
┌─────────────────────────────────┐
│         App Header (fixed)      │  56px height
│  [tickyourbudget]    [Profile▾] [☀]
├─────────────────────────────────┤
│                                 │
│         Toast Container         │  Floating, z-index: 300
│                                 │
├─────────────────────────────────┤
│                                 │
│       Main Content Area         │  padding-top: 68px
│       (max-width: 600px)        │  padding-bottom: 84px
│       (centered)                │
│                                 │
│   ┌───────────────────────┐     │
│   │   Active View Section │     │  Only one visible at a time
│   │   (Home/Items/Cats/   │     │
│   │    Profiles/Config)   │     │
│   └───────────────────────┘     │
│                                 │
│              [FAB +]            │  Floating, bottom-right
│                                 │  On Items, Categories & Profiles views
├─────────────────────────────────┤
│       Bottom Navigation (fixed) │  64px height
│ [✓Home][📄Items][📁Cats][👤Prof][⚙Config]
└─────────────────────────────────┘
```

## 6.2 App Header elements

| Position | Element                     | Behaviour                                             |
|----------|-----------------------------|-------------------------------------------------------|
| Left     | App title "tickyourbudget"  | Static text, purple accent color                      |
| Right    | Profile `<select>` dropdown | Shows all profiles, changes trigger `onProfileChange` |
| Right    | Theme toggle (☀/🌙)         | Toggles `data-theme` attribute on `<html>`            |

## 6.3 Bottom Navigation

5 tabs implemented as `<button class="nav-item">` with `data-view` attribute:

| Tab        | data-view        | Icon            | Keyboard | Active by default |
|------------|------------------|-----------------|----------|-------------------|
| Home       | `viewHome`       | Checkmark box   | `1`      | Yes               |
| Items      | `viewItems`      | Card/document   | `2`      | No                |
| Categories | `viewCategories` | Folder          | `3`      | No                |
| Profiles   | `viewProfiles`   | Person          | `4`      | No                |
| Config     | `viewConfig`     | Gear / Settings | `5`      | No                |

**Behaviour:**
- Click → remove `active` class from all nav items and views → add `active` to clicked tab and corresponding `<section>` → hide all FABs → show relevant FAB if Items, Categories, or Profiles → call view renderer.
- CSS: `.view { display: none }` + `.view.active { display: block }` with fade-in animation.

## 6.4 Modal system (`components/modal.js`)

**`openModal(title, contentHTML, options)`**
- Creates a bottom-sheet overlay (`modal-overlay`)
- On desktop (≥500px), centers vertically instead
- Returns `{ overlay, close }` object
- Closes on: close button click, overlay click, Escape key

**`showConfirm(title, message, options)`**
- Creates a centered confirmation dialog
- Returns a `Promise<boolean>` (`true` = confirm, `false` = cancel)
- Options: `{ okText, cancelText, danger }` — `danger: true` uses red styling for the confirm button

## 6.5 Toast system (`components/toast.js`)

**`showToast(message, type)`**
- `type`: `"success"` | `"error"` | `"info"` (default)
- Appended to `#toastContainer` (fixed, top-center, z-index 300)
- Auto-removes after 3 seconds
- CSS animation: slide-in + fade-out at 2.5s
