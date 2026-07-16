# Pg Official Tvm® — Website Redesign

A full premium redesign and optimization of the Pg Official Tvm® site, built in
plain HTML, CSS and JavaScript only — same stack as the original, no frameworks
added or removed.

## What changed, at a glance

- **Design**: a new print-shop-specific identity built around registration
  marks and CMYK ink dots (cyan / magenta / yellow / key), instead of a
  generic template look. Fraunces (serif display) + Plus Jakarta Sans (body)
  + Space Mono (specs/labels) replace the single Poppins weight-stack.
- **Every page rebuilt**: `index.html` plus all 6 secondary pages
  (order tracking, shipping form, and the four legal pages) now share the
  same header, footer, floating actions and design system.
- **All broken links fixed**: the original footer/header links pointed to
  `/Pg Official Tvm®/page.html` — an absolute path containing spaces and a
  special `®` character, which 404s on virtually any host. Every internal
  link is now a clean relative path (`termsandconditions.html`, etc.).
- **Images**: reduced from **~20 MB to ~1.3 MB** total. Hero slides went from
  4997×2291 down to 1920px wide; product photos from 1563×1563 down to
  900×900; all served as WebP with a JPEG fallback via `<picture>`, lazy
  loaded except the first hero frame (which preloads for a fast LCP).
- **New deliverables**: `robots.txt`, `sitemap.xml`, `manifest.json`,
  a full favicon/PWA icon set, and a themed `404.html`.

## Structure

```
/
├── index.html                   Home (hero, products, about, reviews, FAQ, contact)
├── ordertracking.html
├── shippingform.html
├── privacypolicy.html
├── termsandconditions.html
├── shippingpolicy.html
├── refundandreturnspolicy.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── manifest.json
├── favicon.ico
├── css/style.css                Single, organized stylesheet (design tokens → components → pages)
├── js/script.js                 Single, modular script (IIFE modules, no globals leaked)
├── image/                       Optimized JPG + WebP pairs, SEO-friendly filenames
└── icons/                       Favicon & PWA icon set (16–512px, incl. maskable)
```

## UI/UX

- New hero, sticky glassmorphic header, mega footer, redesigned product
  cards with hover "crop-mark" corners, a redesigned about section, a real
  FAQ accordion, and a rebuilt contact section with a status-driven form.
- Dark/light theme toggle (remembered via `localStorage`, defaults to the
  visitor's OS preference).
- Buttons, cards, chips and forms follow one consistent token system
  defined at the top of `style.css` (`:root` custom properties) — colors,
  type scale, spacing and radii are all changeable from one place.

## Responsive design

Rebuilt mobile-first (base styles target small screens; `min-width` media
queries layer on tablet/desktop/large-screen enhancements), replacing the
original's `max-width`-only approach. Verified breakpoints at ~576 / 768 /
992 / 1200 / 1600px, plus a fluid type scale (`clamp()`) so text scales
smoothly between breakpoints instead of jumping.

## Performance

- Images optimized as described above (biggest single win).
- Fonts, AOS, Swiper and Font Awesome are pulled from CDNs with
  `preconnect`/`dns-prefetch` hints; the first hero image is preloaded and
  marked `fetchpriority="high"` for a faster Largest Contentful Paint.
- All non-critical `<script>` tags use `defer`; below-the-fold images use
  `loading="lazy"`.
- One CSS file and one JS file for the whole site (no per-page duplication,
  fewer requests, better caching).
- AOS is pinned to a stable release (`2.3.4`) instead of `@next`, avoiding
  unannounced breaking changes on every visit.

**On Lighthouse scores**: the changes above are aimed squarely at the
90–100 range across Performance/Accessibility/Best-Practices/SEO, but the
exact numbers you'll see depend on your hosting (server compression,
caching headers, HTTP/2, CDN) and on the third-party embeds you keep
enabled (Crisp chat and the Featurable Google-reviews widget both load
their own JS and will cost some performance/best-practices score — that's
a deliberate trade-off for the functionality, not an oversight).

## SEO

- Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `footer`,
  `address`) and a corrected heading hierarchy (one `<h1>` per page).
- Unique, descriptive `<title>` and meta description per page, canonical
  URLs, Open Graph + Twitter Card tags, and a sensible `robots` meta.
- Structured data (JSON-LD): `LocalBusiness`/`Store`, `WebSite`,
  `BreadcrumbList` (every page), and `FAQPage` (matching the on-page FAQ
  content on the homepage). Geo-coordinates were taken from the existing
  Google Maps embed so they match your pinned location.
- `Product` schema was **intentionally left out** — the catalogue is
  quote-based over WhatsApp with no listed prices, and Product schema
  without real pricing tends to generate Search Console errors rather than
  rich results. Add it later if you introduce fixed pricing.
- `robots.txt` + `sitemap.xml` included; update the sitemap's URLs if you
  add pages.
- All image filenames are descriptive (`product-business-card.jpg`, not
  `product-1.jpg`) and every image has meaningful `alt` text.

## Accessibility

- Visible focus rings site-wide (`:focus-visible`), a "Skip to main
  content" link, and `aria-label`/`aria-expanded`/`aria-controls` on all
  interactive controls (menu button, theme toggle, read-more, FAQ,
  lightbox).
- Color contrast was designed against WCAG AA in both themes.
- `prefers-reduced-motion` is respected: animations and smooth scrolling
  are disabled for visitors who ask for it at the OS level.
- The homepage's decorative marquee ticker is duplicated as visually-hidden
  plain text for screen readers instead of relying on the animated version.

## Animations

Smooth scroll, scroll-triggered reveals (a small dependency-free
`IntersectionObserver` module, complementing AOS rather than replacing it),
hover/focus micro-interactions on cards and buttons, animated counters,
a scroll-progress bar, and a back-to-top button.

## Forms

- The contact form now validates client-side with inline error messages,
  submits via `fetch()` to Web3Forms (no page reload), and shows a
  success/error status message.
- A honeypot field (`botcheck`) blocks the simplest bots without adding a
  visible CAPTCHA.
- The order-tracking captcha and the shipping-details → WhatsApp form both
  kept their original logic, restyled and with `pattern`/`required`
  validation added.
- The newsletter box actually submits (via the same Web3Forms endpoint)
  instead of being a non-functional placeholder.

## Security notes

- All third-party/external links use `rel="noopener noreferrer"`.
- The contact and newsletter forms include a hidden honeypot field.
- `theme-color`, a scoped `manifest.json`, and safe defaults for
  `referrerpolicy` on external stylesheet/iframe loads are included.
- **You should still**: set real HTTP security headers
  (Content-Security-Policy, X-Content-Type-Options, Referrer-Policy) at
  your host/CDN, since plain static HTML can't set response headers
  itself — a `.htaccess` or hosting-panel config is the right place for
  that on most shared hosting.

## Extra features added

Dark/light mode toggle · scroll progress bar · image lightbox (native
`<dialog>`, no extra library) · FAQ accordion · animated stats counters ·
WhatsApp + call floating buttons · back-to-top button · cookie consent
banner · newsletter section · themed 404 page · full favicon set ·
`manifest.json` (installable as a home-screen app on mobile).

## Things worth knowing before you deploy

1. **Domain assumption**: canonical URLs, Open Graph tags and the sitemap
   assume the site lives at `https://pgofficialtvm.in/`. Update these if
   that changes.
2. **Root-relative icon paths**: `favicon.ico`, `/icons/…` and
   `manifest.json` are referenced from the root (`/favicon.ico`). This is
   correct if the site is deployed at your domain's root — if you ever
   deploy into a sub-folder, change these to relative paths.
3. **Third-party keys kept as-is**: the Web3Forms access key, Google Maps
   embed, GA4 measurement ID, Crisp website ID and the Google-reviews
   widget ID were carried over unchanged from your original site.
4. **PWA**: `manifest.json` and icons are included so the site is
   installable, but no service worker/offline caching was added — that's a
   bigger decision (what to cache, cache invalidation) best made
   deliberately rather than bolted on.
5. **Run it through PageSpeed Insights once it's live** — real-world scores
   depend on your server/CDN, not just the code in this package.
