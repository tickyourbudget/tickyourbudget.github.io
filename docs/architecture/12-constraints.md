# 14. Known Constraints & Edge Cases

## Functional

| Constraint                      | Detail                                                                                                                                                                 |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| No server/auth                  | All data is local to the browser. Clearing browser data deletes everything.                                                                                            |
| No multi-device sync            | Data lives only in IndexedDB on the device where it was created.                                                                                                       |
| Category deletion orphans items | Budget items referencing a deleted category show as "Uncategorized" but the `categoryId` pointer is stale.                                                             |
| No undo                         | Delete operations (profile, category, item, clear) are permanent.                                                                                                      |
| Weekly/Bi-Weekly anchoring      | Weekly items are anchored to the exact `startDate` weekday and interval — they don't align to calendar weeks.                                                          |
| Monthly day clamping            | A monthly item starting on the 31st will appear on the 28th/29th/30th in shorter months.                                                                               |
| Orphan transactions preserved   | Deleting a budget item with "keep transactions" leaves transactions whose `budgetItemId` points to a deleted record. These still render their snapshot data correctly. |
| End date is inclusive           | An item with endDate of "2026-06-15" will still generate its occurrence on that date.                                                                                  |

## Technical

| Constraint                          | Detail                                                                                                                   |
|-------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| No URL routing                      | The app is a single page with view toggling. The URL never changes. Browser back button does not navigate between views. |
| Module script required              | Must be served over HTTP(S), not `file://` protocol (ES6 modules require same-origin).                                   |
| IndexedDB required                  | Private/incognito mode in some browsers restricts IndexedDB.                                                             |
| No input validation beyond required | Amount field allows any number ≥ 0; no max limit.                                                                        |

## Sample Data

The "Load Sample Data" feature creates:
- **1 profile:** "Sample Budget"
- **7 categories:** Housing, Utilities (sub of Housing), Transportation, Food & Dining, Entertainment, Subscriptions (sub of Entertainment), Insurance
- **11 budget items:** Rent ($1500/mo), Electric ($85/mo), Internet ($65/mo), Water ($40/mo), Car Payment ($350/mo), Gas ($50/wk), Grocery Run ($120/wk), Netflix ($15.99/mo), Spotify ($9.99/mo), Health Insurance ($320/mo), Car Insurance ($180/quarterly)
- **0 transactions** — generated on first view of a month
