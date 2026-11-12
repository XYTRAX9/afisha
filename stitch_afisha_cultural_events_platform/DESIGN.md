---
name: АФИША
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#55423f'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ec'
  outline: '#88726e'
  outline-variant: '#dbc1bb'
  surface-tint: '#994533'
  primary: '#994533'
  on-primary: '#ffffff'
  primary-container: '#e27d68'
  on-primary-container: '#5e190b'
  inverse-primary: '#ffb4a5'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#006b59'
  on-tertiary: '#ffffff'
  tertiary-container: '#2eab92'
  on-tertiary-container: '#00382e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3e0500'
  on-primary-fixed-variant: '#7b2e1e'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#84f7da'
  tertiary-fixed-dim: '#66dabf'
  on-tertiary-fixed: '#00201a'
  on-tertiary-fixed-variant: '#005143'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-hero:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 46px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The visual identity of this design system is grounded in modern editorial culture: quiet confidence, generous breathing room, and disciplined curation. It strips away SaaS trends, synthetic gradients, and decorative noise to let cultural imagery, performance photography, and theater posters command user focus. 

The aesthetic is minimalist and literary, reminiscent of printed broadsheets and high-end museum programmes, translated into a modern, tactile web canvas. Visual density is balanced: high density for functional event listings and scheduling tables, low density and generous framing for editorial spotlights and premier performances. The emotional register is authoritative, discerning, and effortless.

## Colors

The palette simulates tactile, unbleached paper paired with deep carbon inks and a single, deliberate accent:

- **Canvas & Backgrounds:** The base substrate is `#F7F5F1` (Warm Off-White). Elevated surfaces and floating cards use pure `#FFFFFF`, while subtle tonal wells use `#EFECE6`.
- **Text & Hierarchy:** Headings, prominent titles, and hero dates use `#292929` (Deep Graphite) for rich contrast. Body text, descriptions, and venue information use `#343434` (Charcoal). Secondary metadata, timestamps, and captions utilize `#787570` (Muted Umber).
- **Primary Accent:** `#E27D68` (Selective Terracotta Coral) is strictly reserved for interactive imperatives: primary ticketing CTAs, active filter states, date selection anchors, and live status badges. It is never used as an ornamental fill or ambient background.
- **Borders & Dividers:** Crisp hairline rules (`1px`) in `#EBE7E0` define structure without visual weight.
- **States:** Hover interactions on primary accents shift toward `#CF6853`. Focused outlines utilize `#292929` with subtle offset rings.

## Typography

The type system is powered entirely by **Manrope**, chosen for its balanced geometric armature and Cyrillic proportions. Manrope maintains structural neutrality in informational body text while delivering editorial rhythm and distinct vertical presence in display weights.

- **Uppercase Tracking:** `label-caps` is used for category tags, dates, architectural labels, and venue designations; set in uppercase with `+0.08em` tracking.
- **Numbers:** Tabular lining numbers (`font-variant-numeric: tabular-nums`) must be enabled for prices, dates, hall seatings, and time counters to preserve alignment in structured listings.
- **Hierarchy Rules:** High-contrast scale changes replace font mixing; bold, tight-aperture headlines contrast against airy, regular body copy.

## Layout & Spacing

The layout is built upon an architectural 12-column grid anchored by responsive outer frames:

- **Desktop (≥ 1280px):** 12 columns, `margin-desktop` (3rem / 48px), `gutter-desktop` (2rem / 32px). Maximum container width is constrained to `1440px` for optimal reading scan lines.
- **Tablet (768px – 1279px):** 8 columns, `margin-tablet` (2rem / 32px), `gutter` (1.25rem / 20px). Horizontal category chips and editorial strips scroll cleanly across margins.
- **Mobile (< 768px):** 4 columns, `margin` (1rem / 16px), `gutter` (1rem / 16px). Event cards reflow to single-column or horizontal stacked rows with zero clipping.

Spacing utilizes an intentional cadence: tightly bound metadata (`space-xs` to `space-sm`), structured component interiors (`space-md`), and pronounced editorial separations (`space-lg` to `space-xl`) between content sections.

## Elevation & Depth

This design system avoids traditional dropshadows and float simulations. Elevation is communicated through **tonal surfacing and structural hairlines**:

- **Level 0 (Base Canvas):** `#F7F5F1`.
- **Level 1 (Cards & Surface Tiles):** `#FFFFFF` bordered with `1px solid #EBE7E0`.
- **Level 2 (Active Sheets & Navigation Header):** `#FFFFFF` with `border-bottom: 1px solid #EBE7E0`. Navigation headers use an opaque `#F7F5F1` with hairline dividers—no translucent glassmorphism or blur filters.
- **Level 3 (Modals & Checkout Sheets):** `#FFFFFF` resting on a tinted backdrop overlay (`rgba(41, 41, 41, 0.45)`). Modals carry an ultra-diffused, ambient shadow (`0 20px 40px -15px rgba(41, 41, 41, 0.08)`).
- **Hover Transitions:** Interactive cards lift neither physically nor through shadows; instead, interaction is telegraphed by image zooms within card media frames and border shifts from `#EBE7E0` to `#292929`.

## Shapes

The shape vocabulary uses restrained radii to preserve an editorial, printed silhouette:

- **Base Radius (`0.25rem` / 4px):** Applied to functional components including cards, image posters, inputs, modals, and date tiles. This provides subtle softness without rounding off architectural edges.
- **Pill Radius (`9999px`):** Used selectively for chips, category pills, search controls, and secondary badges to create distinct contrast against rectangular media containers.
- **Media Containers:** Aspect ratios are locked to standard cultural dimensions: `3:4` for vertical theatrical posters, `16:9` for concert hall headers, and `1:1` for compact chronological list thumbnails.

## Components

### Buttons
- **Primary CTA:** Background `#E27D68`, label `#FFFFFF`, border `none`, border-radius `0.25rem`. On hover, background deepens to `#CF6853`. Used exclusively for direct purchase actions («Купить билет», «Выбрать места»).
- **Secondary Action:** Background transparent, label `#292929`, border `1px solid #292929`. Hover transitions background to `#292929` and label to `#FFFFFF`.
- **Tertiary / Ghost:** Background transparent, label `#292929`, underline offset on hover.

### Filter & Category Chips
- **Neutral Chip:** Pill-shaped (`9999px`), background `#FFFFFF`, border `1px solid #EBE7E0`, text `#343434`, padding `0.5rem 1rem`.
- **Active Filter Chip:** Background `#E27D68`, border `1px solid #E27D68`, text `#FFFFFF`.
- Chips are arranged in horizontal overflow-scroll strips with masked edge indicators on mobile screens.

### Unified Event Cards
- **Structure:** Vertical container with `#FFFFFF` background and `1px solid #EBE7E0` border.
- **Media:** Top-anchored `3:4` image container with `border-bottom: 1px solid #EBE7E0`.
- **Badge Overlay:** Positioned `space-sm` from top-left: pill-shaped `#FFFFFF` badge with `label-caps` specifying the event genre («ТЕАТР», «ВЫСТАВКА», «КОНЦЕРТ»).
- **Content Block:** Internal padding `1rem`. Top line features the humanized date («14 ОКТЯБРЯ, 19:00») in `#E27D68`, followed by the event title in `headline-sm` (`#292929`), and the venue name in `body-sm` (`#787570`).
- **Footer:** Bottom row contains starting ticket price («от 1 500 ₽») in `label-lg` tabular figures, alongside a compact icon or minimal button.

### Form Inputs & Search
- **Search Bar:** Elongated search pill or soft rectangle (`4px` radius) with `#FFFFFF` background, `1px solid #EBE7E0` border, `15px` Manrope body text, and placeholder in `#787570`. Focus state replaces border with `1px solid #292929` without expanding outlines.
- **Checkboxes & Radios:** `16px` squares (`2px` radius) or circles with `1px solid #292929`. Selected state fills with `#E27D68` and sharp white check mark or dot.

### Curated Editorial Carousels & Strips
- Section headlines utilize `headline-lg` with an accompanying subline. Carousel navigation relies on discrete `36px` circular arrow buttons bordered by `1px solid #EBE7E0`, positioned in the section header alongside the link to view the complete catalog.