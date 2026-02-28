# 11. Keyboard Shortcuts

All shortcuts are handled in `app.js` via a global `keydown` listener. Shortcuts are suppressed when:
- Focus is in an `<input>`, `<textarea>`, or `<select>` (except Escape to blur)
- A modal or confirm dialog is open

| Key   | Action                                 | Context                            |
|-------|----------------------------------------|------------------------------------|
| `1`   | Navigate to Home                       | Global                             |
| `2`   | Navigate to Items                      | Global                             |
| `3`   | Navigate to Categories                 | Global                             |
| `4`   | Navigate to Profiles                   | Global                             |
| `5`   | Navigate to Config                     | Global                             |
| `←`   | Previous month                         | Home view                          |
| `→`   | Next month                             | Home view                          |
| `T`   | Go to current month (today)            | Home view                          |
| `N`   | Add new item / category / profile      | Items, Categories, or Profiles view |
| `/`   | Focus search bar                       | Home or Items view                 |
| `?`   | Toggle shortcuts overlay               | Global                             |
| `Esc` | Dismiss shortcuts overlay / blur input | Global                             |

The shortcuts overlay is a hidden panel (`#shortcutsOverlay`) that can be shown/dismissed with `?` or by clicking outside it.
