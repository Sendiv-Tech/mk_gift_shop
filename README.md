# MK Gift Shop

A single-page, installable (PWA) storefront for MK Gift Shop — a gift retailer in Thiruppathur, Tamil Nadu. Built as static HTML/CSS/JS with no backend, no build step, and no framework. Orders are captured via WhatsApp deep links rather than a checkout/payment flow.

## File structure

```
.
├── index.html          # All pages/sections (home, offerings, categories, products, reviews, contact, admin)
├── styles.css           # All styling
├── script.js             # All behavior, data, and rendering logic
├── manifest.json         # PWA manifest (name, icons, theme colors)
├── service-worker.js     # Offline caching (note: rename — see "Known issues")
└── icons/                 # Referenced but not included in this upload — see "Known issues"
```

There is no build tooling. Deploy by uploading these files as-is to any static host.

## How it works

**Single page, section-based routing.** `index.html` contains one `<main>` with several `.site-section` divs (`page-home`, `page-offerings`, `page-categories`, `page-products`, `page-reviews`, `page-contact`, `page-admin`). Nav links are anchor hashes; `script.js` handles scroll-spy (highlighting the active nav item) and smooth scrolling — there's no router and no page reloads.

**Data lives in memory only.** Products, offers, and reviews are hardcoded JS arrays at the top of `script.js` (`products`, `offers`, `reviews`). There is no `localStorage`, database, or API call anywhere in the codebase. This means:
- Anything added/edited/deleted through the Admin panel (products, offers, reviews, expenses) **only persists until the page is refreshed.** It is not saved anywhere.
- To make catalog changes permanent, you currently have to hand-edit the arrays in `script.js` and redeploy.

**Cart → WhatsApp checkout.** There's no payment gateway. `addToCart()` builds a cart in memory; `sendWhatsAppOrder()` formats the cart contents into a pre-filled message and opens `wa.me/916383204742` (see `WHATSAPP_NUMBER` in `script.js`) so the customer completes the order by chatting with the shop directly.

**Admin panel.** Reachable via the "⚙ Admin" nav link → login modal → OTP step → `page-admin`. Covers products, offers (homepage banner slider), analytics (fake/simulated bar charts), finance (static demo figures), reviews moderation, and account settings.

⚠️ **This "admin panel" is not secure and should not be treated as one.** The credentials are hardcoded in plaintext in the shipped client-side file:
```js
const ADMIN_CREDS = { user: 'admin', pass: 'mk2025', otp: '123456' };
```
Anyone who views page source has full access to the login. There is no server-side auth, and even a successful login doesn't unlock anything meaningful since none of the admin actions persist (see above). Treat this as a UI prototype/demo of what an admin dashboard could look like, not a real access-controlled system.

**Offline support (service worker).** `service-worker.js` precaches the app shell (`index.html`, `styles.css`, `script.js`, `manifest.json`) and serves it network-first (falls back to cache when offline). Non-shell assets (images, fonts) are cache-first. The `CACHE_VERSION` constant **must be bumped on every deploy** that touches HTML/CSS/JS — otherwise returning visitors keep getting the stale cached version. This was already the root cause of one shipped bug (mobile menu appearing fixed in testing but broken on real devices) per the comments in that file.

## Known issues to fix before/at next deploy

1. **`Service_worker.js` filename mismatch.** `index.html` doesn't reference the service worker directly, but if registration code exists elsewhere (or is added), it must point to the exact filename on disk. Standard convention is `service-worker.js` (lowercase, hyphenated) — the uploaded file is capitalized (`Service worker.js` / `Service_worker.js`), which will 404 on case-sensitive hosts (most static hosts, including GitHub Pages and Netlify, are case-sensitive even though your local dev server might not be). Rename it and make sure the registration path matches exactly.
2. **No service worker registration found in `index.html`.** For the caching behavior in `service-worker.js` to do anything, `index.html` needs a registration script, e.g.:
   ```html
   <script>
     if ('serviceWorker' in navigator) {
       window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
     }
   </script>
   ```
3. **`icons/` directory is referenced but not included** in this upload (`icons/icon.svg`, `icons/icon-512.png`, `icons/favicon-32.png`, `icons/favicon-16.png`, `icons/apple-touch-icon.png`). Without these, the manifest, favicons, and "Add to Home Screen" icon will all be broken. Confirm this folder exists on the actual server.
4. **Admin data doesn't persist** (see above) — confirm this is intentional (demo/prototype) before launch. If real admin editing is a requirement, this needs a backend or at minimum `localStorage` persistence.
5. **Admin credentials are exposed client-side** — fine for a prototype, not fine if this admin panel is ever pointed at real business data or exposed on the live public domain.

## Deployment checklist

- [ ] Rename service worker file to match its registration path exactly (case-sensitive)
- [ ] Add service worker registration to `index.html` if offline support is desired
- [ ] Confirm `icons/` assets are present on the server
- [ ] Bump `CACHE_VERSION` in the service worker on every deploy
- [ ] Decide whether admin-panel changes need real persistence before go-live
