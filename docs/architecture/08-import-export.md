# 9. Import / Export Schema & Validation

## Export format (single profile — JSON Preview)

```json
{
  "profile": { "id": "uuid", "name": "string" },
  "categories": [ { "id": "uuid", "profileId": "uuid", "name": "string", "description": "string", "parentId": "uuid|null" } ],
  "budgetItems": [ { "id": "uuid", "profileId": "uuid", "categoryId": "uuid", "name": "string", "amount": 0.00, "description": "string", "frequency": "Monthly", "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD|null" } ],
  "transactions": [ { "id": "uuid", "budgetItemId": "uuid", "profileId": "uuid", "date": "YYYY-MM-DD", "status": "Pending|Paid", "snapshotAmount": 0.00, "snapshotName": "string" } ]
}
```

## Export format (all data — Download JSON)

```json
{
  "profiles": [ ... ],
  "categories": [ ... ],
  "budgetItems": [ ... ],
  "transactions": [ ... ]
}
```

## Export format (CSV — current profile budget items)

```csv
Name,Amount,Category,Frequency,Start Date,End Date,Description
Netflix,15.99,Subscriptions,Monthly,2026-01-01,,Standard plan
```

## Import validation rules (`importData()`)

The import function accepts both formats (single `profile` key or plural `profiles` key).

| Entity      | Required fields                                   | Validation                   |
|-------------|---------------------------------------------------|------------------------------|
| Profile     | `id`, `name`                                      | Both must be truthy          |
| Category    | `id`, `profileId`, `name`                         | All must be truthy           |
| Budget Item | `id`, `profileId`, `categoryId`, `name`, `amount` | All truthy; `amount != null` |
| Transaction | `id`, `budgetItemId`, `profileId`, `date`         | All must be truthy           |

Import uses `dbPut()` (upsert) — existing records with the same `id` are overwritten.

On validation failure: throws `Error` with descriptive message → caught by caller → displayed as error toast.
