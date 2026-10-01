# Chai & Co.

> Single-estate loose-leaf tea from the hills above Ilam, eastern Nepal. A demo portfolio marketing + e-commerce site for a fictional premium Nepali tea brand. **Zero external imagery, 3D models, or textures — every visual is code-generated via SVG, CSS gradients, or R3F geometry.**

## 60-second onboarding

```bash
# 1. install
npm install

# 2. develop (Lenis smooth scroll + RSC + HMR on :3000)
npm run dev

# 3. build & type-check the 17 static prerendered routes
npm run build
# → exits 0 with 17 prerendered pages
#    ○ /, /shop, /story, /journal, /checkout, /robots.txt, /sitemap.xml
#    ● /journal/[slug] × 3, /product/[slug] × 4
#    ƒ /order/[id] (dynamic)

# 4. tests — 22 baseline unit tests
npx vitest run
# → 3 files, 22 passed (format 4, validators 8, cart 10)
```

Deploy target is [Vercel](https://vercel.com): project ships a `vercel.json` with security headers, 1yr immutable cache for `/_next/static`, and redirects `/home` → `/`, `/products` → `/shop`, `/about` → `/story`, `/blog` → `/journal`.

## What's in the box

| Area | Highlights |
|---|---|
| **Stack** | Next 14 App Router · TypeScript strict · Tailwind · Framer Motion · Lenis (single rAF) · R3F + drei · Zustand v5-rc (persist + migrate + safeStorage) · Zod + React Hook Form · Vitest 2 + RTL |
| **Routes** | Home (10 sections), Shop grid, Product detail with BuyBox + fly-to-cart, Story editorial (SVG hills + 4 blocks + Timeline + Estate Map), Journal index × 3 slugs, 3-step Checkout (URL ?step=N), Order confirmation CH###### regex, 404 tipped SVG cup, sitemap/robots |
| **Branding** | Fraunces SOFT/WONK/opsz display · Inter UI · `--ink #1A1714`, `--paper #F4F0E8`, `--clay #B3541E`, `--gold #C9A227`, `--jade #4F6F52`; quiet-luxury "small-caps + wide tracking" eyebrow convention; global 3% SVG feTurbulence grain overlay; easing `cubic-bezier(0.16,1,0.3,1)` throughout |
| **R3F TeaTin** | 14 behaviours: 9pt Lathe bevel, 3pt studio lighting, ContactShadows, ACES/sRGB, 512² roughness, 1024² Decal crossfade, torus rim + lid bump, 64 InstancedMesh leaves bob/sway, scroll-driven 2.5π rotation, tilt 0.25→-0.1 lerp, idle sine bob, cursor parallax ±0.08Y/±0.05X, OrbitControls damping 0.07; SSR Suspense wrapper with IntersectionObserver frameloop=demand; SVG TinFallback for reduced/WebGL-missing |
| **Cart + Checkout** | Zustand persist v1 migrate (safeStorage try/catch), key=`productId__sizeGrams`, qty 1..20, NPR Intl format en-NP, subtotal/discount/shipping/total/progressToFreeShipping (threshold=3,000 NPR)/distanceToFreeShipping; CHAI10=10% off, MIST=free shipping; standard / express / Kathmandu shipping options; SideSummary sticky drawer; CartDrawer Dialog (ESC-close focus trap scroll-lock body + restore focus); Bezier fly-to-cart portal animation with cart icon WAAPI pulse + drawer highlight-on-arrival |
| **3-step Checkout** | URL `?step=1|2|3` → Zustand checkout.step sync; **StepContact** RHF + Zod (77 Nepali districts, 3 delivery radio cards layoutId "delivery-dot" + "delivery-ring" shared gold animation, label Web Animations horizontal shake on first error + auto scroll focus first aria-invalid); **StepPayment** 4 method radios (card/eSewa/Khalti/COD) shared layoutId, 3D card preview (perspective 1100 container + mouse tilt 16/12° rotY/rotX + flip CVC back on sp-cvc focus) + card masks (groups-of-4 / MM/YY / 3-4 CVC) + inline brand logos; **StepReview** 4 editable Contact/Delivery/Payment/Tins cards + Place order morph spinner→✓→redirect `/order/[id]` |
| **Story editorial** | OpeningHills landscape: 3 ridgeline pathLength draw over 3.8s, mist feTurbulence scroll parallax, code-gen tea-house + 14 staggered plucker dots + lat/long Est.1971 chips; 4 alternating reveal blocks (Land bush tangle / Hands pluck SVG / Wither night racks / Roll figure-eight); Fraunces italic pull-quote Bedan Karki 2011; 5-entry alternating timeline 1971→2025 with accent-color rotate-45 diamond pins + gradient scaleY vertical line; closing EstateMapSVG with 2 ridges + river stroke-dash draw + staggered 7×11 plantation + processing hall pin pulse 1.8s + dashed estate info callout (12ha · 38 pluckers · 4 teas) + 3-bar altitude legend width-reveal |
| **Motion architecture** | Phase 8: 1.8s LoadingScreen dual wipe + leaf center sway (sessionStorage deduped); CustomCursor spring ring + dot (hover any interactive → ring gold 1.6×); MagneticButton hero CTAs translate toward cursor within rect radius; direction-aware page wipes (depth-based POP detection) + mobile edge-swipe history.back/forward |
| **Tests** | format.test.ts 4 (NPR currency) · validators.test.ts 8 (CHAI10/MIST, contact schema, superRefine card) · cart.test.ts 10 (add/merge, sizes, qty clamp, promos, free-shipping progress, remove) |

## Key technical choices (unspecified defaults)

- **Zero external imagery**: no `next/image`, no `.glb`/`.png`/`.jpg`/Lottie anywhere. Every visual = R3F geometry + SVG + CSS gradients.
- **Zustand safeStorage**: every persist store wraps `localStorage` in try/catch (Safari private mode) + explicit v1 migrations.
- **Fly-to-cart loose coupling**: custom `cart:pulse` + `cart:fly-complete` window events; BuyBox never imports `CartDrawer`.
- **URL is source of truth for checkout step**: StepSync uses Suspense-wrapped `useSearchParams` → pushes `/checkout?step=N scroll:false` instead of in-memory state.
- **Consistent motion contracts**: every animation has a `useReducedMotion()` guard (reduces duration to 0.15–0.2 s and disables parallax/springs). Reduced-motion users get instant fades instead of scroll parallax / bezier flights / card 3D tilt.
- **Branded motion easing**: single tuple `[0.16, 1, 0.3, 1]` exported from `@/lib/motion` and reused everywhere for "quiet luxury" weighted feel.

## Project layout

```
src/
  app/
    (route files: layout, template, page, shop, story, journal, product, checkout, order, 404, sitemap, robots)
  components/
    canvas/SteamSystem.tsx        — canvas particle steam (Hero, Newsletter, WitheringRack)
    cart/                         — CartDrawer Dialog, LineItem, ShippingProgress, FlyToCart portal, EmptyCupSVG
    checkout/                     — Stepper · StepContact · StepPayment · StepReview · CheckoutClient · OrderConfirmClient
    home/                         — 10 home sections (Hero, StickyTin, CollectionRail, OriginMap, ProcessTimeline, FlipCards, Testimonials, Newsletter)
    layout/                       — Nav, MobileMenu(Shell), Footer, Grain, ClientOnly, AppProviders, LoadingScreen (phase8), CustomCursor (phase8)
    product/                      — BrewWidget, Reviews, StatMeters, ClientAddToCart, ProductStickyTin
    shop/                         — ShopGrid, ProductCard
    story/StoryClient.tsx         — interactive story body (wrap story/page.tsx for metadata)
    three/                        — TeaTin 14-behaviours, DynamicTeaTin, TinFallback SVG
    ui/                           — Icons, Button (loading), SplitText, Reveal, Chip, NumberRoll, Accordion, Dialog, MagneticButton
  lib/                            — cn, motion.ts (easing + variants + staggerChildrenFactory), format (NPR Intl), useLenis Provider, useReducedMotion, products.ts (4 SKUs × 4 sizes), articles.ts (3), validators.ts (Zod schemas, promo, districts)
  store/                          — cart.ts, checkout.ts (commitOrder CH######), ui.ts
tests/                            — format, validators, cart  → 22 baseline tests
```

## What to demo

1. **Product page** → click Add to cart: watch SVG tin clone spawn at button, arc (quadratic bezier, 750 ms) to the Nav cart icon, icon spring pop + 2.3× gold ring pulse, CartDrawer slides in from right, newly-added line item animates a 1.4 s gold background wash.
2. **Home Hero** → hover the two CTAs (magnetic pull toward cursor within radius). Scroll: 3 ridgelines parallax at 3 depths; mist bands translate; the StickyTin 320 vh section scroll-rotates the R3F TeaTin 2.5π and HSL tints paper→clay.
3. **Story page** → scroll whileInView reveals: ridgelines stroke-draw, alternating blocks stagger, diamond timeline pins pop, estate-map bushes appear row-by-row and house pin pulses.
4. **Checkout** → 3 Steps. Step1 form errors shake the label once per first submit + auto-scroll to aria-invalid field; Step2 focus CVC → 3D card flips 180°; Step3 Place order morphs from spinner → ✓ Confirmed border + redirects `/order/CH######`.

## Known notes

- `next@14.2.15` publishes a non-blocking CVE advisory for a server-action-related advisory surface; demo portfolio is fine (no server actions used, all routes static or light client-only).
- `next/font/google` loads Fraunces (SOFT/WONK/opsz axes) + Inter via `display: swap` — no FOIT flash.
