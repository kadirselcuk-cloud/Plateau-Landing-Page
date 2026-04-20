# Plateau Landing Page — Claude Context

## Environment constraints

- **Node.js 14.17.1** / npm 6.14.13 — this is hard. Do not upgrade.
- **Vite 2.9.18** + **@vitejs/plugin-react 1.3.2** (Babel-based). Vite 3+ requires Node ≥ 14.18; Vite 4+ requires `base64url` (Node 15.13+). Do not touch versions.
- npm installs must use the public registry: `npm install --registry https://registry.npmjs.org` — the internal Nexus proxy (`nexus.rally.softtech`) is offline.
- Build command: `npm run build`. Always verify with a build after edits.

## Project structure

```
index.html              Vite entry (replaces old CDN-based HTML files)
src/
  main.jsx              React root — imports all 3 CSS files
  App.jsx               BrowserRouter + HashScroller + 7 routes
  i18n.js               Bilingual dictionary (TR default / EN) — named exports
  pages/
    LandingPage.jsx     All landing-page sections in one file
    ProductPage.jsx     Single component for all 6 product pages (slug prop)
  components/
    Nav.jsx             Top navigation (uses Link, reads i18n)
    Footer.jsx          Footer (uses Link)
    Brand.jsx           Logo mark (links to /)
    LangToggle.jsx      TR/EN toggle
    visuals/
      HeroAnimation.jsx       Canvas animation in the landing hero (5 scenes)
      SecurityHeroAnimation.jsx  Canvas animation for the Security product page
      ProductHeroVisual.jsx   Dispatcher — picks visual by slug
      StudioVisual.jsx
      WorkflowVisual.jsx
      SuperAppVisual.jsx
      FrameworkVisual.jsx
      SecurityDiagrams.jsx    4 named SVG exports: EdgeDiagram, IAMDiagram, ...
  hooks/
    useI18n.js          Language state (localStorage key: plateau_lang)
    useReveal.js        IntersectionObserver scroll-reveal (.reveal → .in)
    useCounter.js       Animated counter (rAF, cubic ease-out)
  styles/
    style.css           Global tokens, typography, utilities
    landing.css         Landing-page-specific styles
    product.css         Product-page-specific styles
assets/                 Legacy CDN-based files (still used by *.html files)
  i18n.js               window.PLATEAU_I18N — keep in sync with src/i18n.js
  landing.jsx           CDN-based landing page
  chrome.jsx            CDN-based nav/footer
  product.jsx           CDN-based product page
dist/                   Build output — do not edit manually
```

Old CDN-based HTML files (`horizontal.html`, `studio.html`, etc.) still exist in the root and reference `assets/`. Keep `assets/i18n.js` in sync with `src/i18n.js` when changing copy.

## Routing

| Path | Page |
|------|------|
| `/` | LandingPage |
| `/studio` | ProductPage slug="studio" |
| `/workflow` | ProductPage slug="workflow" |
| `/superapp` | ProductPage slug="superapp" |
| `/security` | ProductPage slug="security" |
| `/framework` | ProductPage slug="framework" |
| `/horizontal` | ProductPage slug="horizontal" |

Hash anchors (`/#platform`) are handled by `HashScroller` in `App.jsx`.

## i18n

- Default language: `tr`. Toggle persisted to `localStorage` key `plateau_lang`.
- Both `src/i18n.js` and `assets/i18n.js` must be kept in sync for copy changes.
- Text keys used in `LandingPage.jsx`: `t.hero.*`, `t.intro.*`, `t.products.*`, `t.numbers.*`, `t.refs.*`, `t.testimonials.*`, `t.cta.*`, `t.footer.*`.
- Text keys used in `ProductPage.jsx`: `t.nav.*`, `t.pages[slug].*`.

### Copy decisions made so far

| Location | TR | EN |
|----------|----|----|
| Hero title | "Plateau ile / **yükselin**" | "Rise on / **Plateau**" |
| Horizontal product name | "Plateau Servisleri" | "Plateau Services" |
| Platform stack label | `t.intro.platform_horizontal` | same key |

## HeroAnimation (5-scene canvas)

File: `src/components/visuals/HeroAnimation.jsx`

Each scene runs for **6 200 ms** with a **620 ms** navy fade-to-black transition between them. Scenes cycle in order using `ts % (SCENE_MS * 5)`.

| # | Scene | Key elements |
|---|-------|--------------|
| 1 | Drag & Drop UI | Left palette panel (COMPONENTS list), right canvas with grid. Chip flies palette → canvas via quadratic bezier every **1 400 ms**. Drop zone pulses dashed. |
| 2 | Mobile / SuperApp | Phone frame centred. 3×3 mini-app tile grid inside (Bank, Shop, Pay…). Four partner boxes outside (BANK API, PAYMENTS, COMMERCE, TRANSIT). Connection arrows exit phone border toward partners; animated packet dots travel outward. Two connections active at a time, cycling every 2 s. |
| 3 | Workflow | BPMN flow: Start → task → diamond gateway → two branches → End×2. White token travels path; splits at gateway. Period 5 000 ms. |
| 4 | Security Suite | 3 concentric rotating dashed rings (EDGE / IAM / VAULT). Red threat particles spiral inward, some burst. White pulsing core. |
| 5 | Microservices | Pentagon of 5 labelled nodes (API / DB / CACHE / AUTH / SVC). Packets flow on edges. API node periodically scales out (clone appears, dashed link, load splits). |

## Canvas animation conventions

- All sizing derived from `canvas.width` / `canvas.height` at draw time — never hardcoded pixels.
- `ResizeObserver` on the wrapper div triggers canvas resize.
- Cleanup: `cancelAnimationFrame` + `ro.disconnect()` on unmount.
- Colour palette: `C.red`, `C.blue`, `C.teal`, `C.green`, `C.purple`, `C.amber`, `C.white`, `C.dim`, `C.slate` — all as `[r, g, b]` triples; use `rgb(col, alpha)` helper.
- Helper functions: `rrp` (rounded-rect path), `fillRR`, `strokeRR`, `radialGlow`, `dotGrid`, `monoLabel`, `ease` (cubic ease-in-out), `bezierPt`, `lerpPt`.

## CSS conventions

- Design tokens in `style.css`: `--navy`, `--red`, `--bg-2`, `--line`, `--text`, `--text-2`, `--text-3`, `--radius`, `--sans`, `--mono`, `--serif`.
- Reveal animation: `.reveal` elements get class `in` added by `useReveal` hook when scrolled into view.
- `hero-right` is hidden below 960 px (`@media (max-width: 960px) { .hero-right { display: none; } }`).
- `hero-geo` sets `aspect-ratio: 1 / 1.05` — the HeroAnimation fills this container.
