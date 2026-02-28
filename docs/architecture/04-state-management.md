# 5. Application State Management

There is **no central state store**. State is managed through:

| State               | Storage                                        | Accessed Via                                      |
|---------------------|------------------------------------------------|---------------------------------------------------|
| Active Profile ID   | `localStorage` key `tyb_active_profile`        | `getActiveProfileId()` / `setActiveProfileId(id)` |
| Currency Code       | `localStorage` key `tyb_currency`              | `getCurrency()` / `setCurrency(code)`             |
| Theme (dark/light)  | `localStorage` key `tyb_theme`                 | `initTheme()` / `toggleTheme()`                   |
| Current View        | In-memory variable `currentView` in `app.js`   | Set by navigation click handler                   |
| Current Month/Year  | In-memory variables in `home.js`               | `currentYear`, `currentMonth`                     |
| Chart Visibility    | In-memory variable `chartVisible` in `home.js` | Toggled by chart toggle button                    |
| All persistent data | IndexedDB `tickyourbudget` DB                  | `db.js` async functions                           |

## Callback system

Two callback functions enable cross-module reactivity:

1. **`onProfileChange`** (set via `setProfileChangeCallback`): Called when the profile dropdown changes. Triggers `renderCurrentView()`.
2. **`onDataChange`** (set via `setDataChangeCallback`): Called after import, sample load, or clear. Triggers `renderCurrentView()`.

## Currency system

Currency is stored as an ISO 4217 code in `localStorage` key `tyb_currency`. On first load, the system auto-detects the user's likely currency from `navigator.language` region code (e.g., `en-US` → `USD`, `en-IN` → `INR`). Defaults to `INR` if detection fails. The `formatCurrency()` helper in `models.js` reads this key directly from localStorage (avoiding circular imports) and uses `Intl.NumberFormat` for locale-aware formatting. The currency selector is displayed in the **Config view** (not the Profiles view).

**Supported currencies (20):** INR, USD, EUR, GBP, JPY, CNY, AUD, CAD, SGD, AED, SAR, BRL, KRW, THB, MYR, IDR, PHP, ZAR, CHF, SEK.
