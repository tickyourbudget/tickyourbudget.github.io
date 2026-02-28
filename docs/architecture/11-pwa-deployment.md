# 12. PWA & Offline Strategy

## manifest.json

| Property           | Value                                               |
|--------------------|-----------------------------------------------------|
| `name`             | `"tickyourbudget"`                                  |
| `short_name`       | `"tickyourbudget"`                                  |
| `display`          | `"standalone"`                                      |
| `background_color` | `"#faf5ff"`                                         |
| `theme_color`      | `"#a78bfa"`                                         |
| `start_url`        | `"/"`                                               |
| `orientation`      | `"portrait-primary"`                                |
| `icons`            | 192×192 and 512×512 PNGs, `purpose: "any maskable"` |

## Service Worker (`sw.js`)

**Strategy:** Cache-first.

**Install event:**
- Opens cache `tyb-cache-v1`.
- Pre-caches all application assets (HTML, CSS, JS modules, manifest, icons).

**Activate event:**
- Deletes any caches with names other than the current version.
- Claims all clients immediately (`self.clients.claim()`).

**Fetch event:**
- Returns cached response if available.
- Otherwise fetches from network, caches successful same-origin responses, returns to page.
- Non-GET requests pass through without caching.

**Registration:** In `app.js` init, `navigator.serviceWorker.register('sw.js')` with error suppression.

---

# 13. Deployment (GitHub Pages)

## GitHub Actions workflow (`.github/workflows/deploy.yml`)

**Trigger:** Push to `main` branch, or manual dispatch.

**Steps:**
1. Checkout repository
2. Configure GitHub Pages
3. Upload entire repository root as pages artifact
4. Deploy via `actions/deploy-pages@v4`

**Required repo settings:**
- Settings → Pages → Source: **GitHub Actions**

**Output URL:** `https://<username>.github.io/` (or custom domain).

**No build step** — files are served as-is since there's no build process.
