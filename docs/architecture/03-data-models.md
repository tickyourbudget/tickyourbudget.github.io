# 4. Data Models & IndexedDB Schema

## Database: `tickyourbudget`, Version: `1`

Four object stores, all using `id` as `keyPath`.

## 4.1 Profile

Represents a distinct budget context (e.g., "Personal", "Family").

| Field  | Type          | Required | Description  |
|--------|---------------|----------|--------------|
| `id`   | String (UUID) | Yes      | Primary key  |
| `name` | String        | Yes      | Display name |

**Indexes:** None (queried by `id` or `getAll`).

**Factory:** `createProfile(name)` → `{ id, name }`

## 4.2 Category

Hierarchical taxonomy for budget items. Supports **one level** of nesting (parent → children).

| Field         | Type                  | Required | Description                                |
|---------------|-----------------------|----------|--------------------------------------------|
| `id`          | String (UUID)         | Yes      | Primary key                                |
| `profileId`   | String (UUID)         | Yes      | FK → Profile                               |
| `name`        | String                | Yes      | Display name (max 50 chars in UI)          |
| `description` | String                | No       | Optional description (max 200 chars in UI) |
| `parentId`    | String (UUID) \| null | No       | FK → Category (parent). `null` = top-level |

**Indexes:**
- `profileId` → non-unique
- `parentId` → non-unique

**Factory:** `createCategory({ profileId, name, description, parentId })`

**Nesting rule:** A category with `parentId = null` is a parent. A category with a `parentId` pointing to another category is a child. Children cannot have children (max 1 level deep). The UI enforces this by only showing the "Add sub-category" button on parent nodes.

## 4.3 Budget Item (The Template / Rule)

Defines a recurring or one-time expense/income with a frequency, start date, and optional end date.

| Field         | Type                        | Required | Description                                              |
|---------------|-----------------------------|----------|----------------------------------------------------------|
| `id`          | String (UUID)               | Yes      | Primary key                                              |
| `profileId`   | String (UUID)               | Yes      | FK → Profile                                             |
| `categoryId`  | String (UUID)               | Yes      | FK → Category                                            |
| `name`        | String                      | Yes      | Display name (max 100 chars in UI)                       |
| `amount`      | Number (float)              | Yes      | Default amount                                           |
| `description` | String                      | No       | Optional notes (max 200 chars in UI)                     |
| `frequency`   | String (Enum)               | Yes      | One of the FREQUENCY values (see below)                  |
| `startDate`   | String (YYYY-MM-DD)         | Yes      | When occurrences begin                                   |
| `endDate`     | String (YYYY-MM-DD) \| null | No       | When occurrences stop (inclusive). `null` = no end date. |

**Indexes:**
- `profileId` → non-unique
- `categoryId` → non-unique

**Factory:** `createBudgetItem({ profileId, categoryId, name, amount, description, frequency, startDate, endDate })`

**FREQUENCY Enum values:**

| Value       | String        | Meaning                                       |
|-------------|---------------|-----------------------------------------------|
| `ONE_TIME`  | `"One Time"`  | Occurs only in the month of `startDate`       |
| `WEEKLY`    | `"Weekly"`    | Every 7 days from `startDate`                 |
| `BI_WEEKLY` | `"Bi-Weekly"` | Every 14 days from `startDate`                |
| `MONTHLY`   | `"Monthly"`   | Same day each month (clamped to month length) |
| `QUARTERLY` | `"Quarterly"` | Every 3 months from `startDate` month         |
| `YEARLY`    | `"Yearly"`    | Same month and day each year                  |

## 4.4 Transaction (The Occurrence / Snapshot)

A concrete instance of a budget item for a specific date. Created by the transaction engine and persisted in IndexedDB.

| Field            | Type                | Required | Description                  |
|------------------|---------------------|----------|------------------------------|
| `id`             | String (UUID)       | Yes      | Primary key                  |
| `budgetItemId`   | String (UUID)       | Yes      | FK → Budget Item             |
| `profileId`      | String (UUID)       | Yes      | FK → Profile                 |
| `date`           | String (YYYY-MM-DD) | Yes      | The specific occurrence date |
| `status`         | String (Enum)       | Yes      | `"Pending"` or `"Paid"`      |
| `snapshotAmount` | Number (float)      | Yes      | Amount at time of creation   |
| `snapshotName`   | String              | Yes      | Name at time of creation     |

**Indexes:**
- `profileId` → non-unique
- `budgetItemId` → non-unique
- `date` → non-unique
- `profileId_date` → compound index `[profileId, date]` (used for month range queries)

**Factory:** `createTransaction({ budgetItemId, profileId, date, amount, name })`

**TX_STATUS Enum:**

| Value     | String      |
|-----------|-------------|
| `PENDING` | `"Pending"` |
| `PAID`    | `"Paid"`    |

## 4.5 UUID Generation

Uses `crypto.randomUUID()` in secure contexts (HTTPS / localhost). Falls back to a Math.random-based UUID v4 implementation otherwise.
