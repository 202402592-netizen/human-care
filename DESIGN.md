---
name: Serene Lavender Care
colors:
  surface: '#fff7fd'
  surface-dim: '#edcfff'
  surface-bright: '#fff7fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdefff'
  surface-container: '#f9e8ff'
  surface-container-high: '#f6e1ff'
  surface-container-highest: '#f2daff'
  on-surface: '#281139'
  on-surface-variant: '#4b444f'
  inverse-surface: '#3e264f'
  inverse-on-surface: '#fbecff'
  outline: '#7c7480'
  outline-variant: '#cdc3d0'
  surface-tint: '#734e94'
  primary: '#704c91'
  on-primary: '#ffffff'
  primary-container: '#8a65ac'
  on-primary-container: '#fffbff'
  inverse-primary: '#deb7ff'
  secondary: '#71518c'
  on-secondary: '#ffffff'
  secondary-container: '#e1bbfe'
  on-secondary-container: '#664781'
  tertiary: '#61586b'
  on-tertiary: '#ffffff'
  tertiary-container: '#7b7185'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f1dbff'
  primary-fixed-dim: '#deb7ff'
  on-primary-fixed: '#2b044b'
  on-primary-fixed-variant: '#5a367a'
  secondary-fixed: '#f1daff'
  secondary-fixed-dim: '#deb8fb'
  on-secondary-fixed: '#2a0a44'
  on-secondary-fixed-variant: '#583973'
  tertiary-fixed: '#ebdef5'
  tertiary-fixed-dim: '#cec2d8'
  on-tertiary-fixed: '#1f1829'
  on-tertiary-fixed-variant: '#4c4355'
  background: '#fff7fd'
  on-background: '#281139'
  surface-variant: '#f2daff'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a restorative, therapeutic interface designed specifically for clinical psychologists, therapists, and behavioral health practitioners. Mental healthcare workflows demand high emotional sensitivity, clarity, and an environment that actively de-escalates professional burnout and cognitive fatigue. 

The aesthetic style merges **Soft Tactile Healthcare** with **Refined Warm Minimalism**. The interface avoids the sterile, icy blues typical of legacy hospital software in favor of an exclusively warm, floral-tinted lavender spectrum anchored by deep plum contrast. Every element promotes emotional equilibrium through expansive whitespace, softly rounded contours, cushioned tactile surfaces, and gentle ambient depths. The emotional response is deliberately tranquil, trustworthy, dignified, and serene.

## Colors

The palette relies entirely on monochromatic warmth across soft lavender and grounding plum. There are strictly zero cold blue, cyan, navy, or slate undertones.

### Primary Spectrum & Functional Roles
- **Canvas Base (`#F7F0FC`)**: The overall page background, providing a soothing, non-glare foundation that reduces eye strain during lengthy telehealth and documentation sessions.
- **Surface Level (`#FFFFFF`)**: Pure white reserved for elevated practitioner cards, patient charts, note modals, and interactive work surfaces.
- **Light Lavender Tint (`#EDE0F7`)**: Used for passive container backgrounds, secondary chip states, calendar event slots, and inactive track elements.
- **Soft Lavender (`#D8BEEB`)**: Structural dividing lines, subtle borders, and gentle hover highlights.
- **Medium Lavender (`#B995D6`)**: Secondary actions, active tab pill indicators, subtle icon fills, and therapeutic progression metrics.
- **Primary Lavender (`#9670B8`)**: Primary interactive drivers, key buttons, selected states, and pivotal navigation indicators. Meets WCAG AA contrast against light surfaces when used for graphics and UI components.
- **Dark Plum (`#5B426D`)**: The primary typographic and high-contrast anchor. Used for primary headers, patient clinical notes, and active glyphs to provide deep visual authority and effortless legibility without the harshness of pitch black.
- **Muted Plum (`#7B628F`)**: Used for secondary copy, meta timestamps, and helper text (derived directly from `#5B426D` at 70% alpha over white, verified at >4.5:1 contrast against `#FFFFFF`).

## Typography

The design system uses **Plus Jakarta Sans** across all roles to project warmth, approachability, and structural precision. Its geometric foundations combined with soft terminals create an organic, reassuring cadence suited for clinical care.

### Hierarchy & Typesetting Guidelines
- **Headlines & Titles**: Rendered in Semibold (`600`) with subtle negative tracking. This anchors diagnostic overviews and dashboard summaries with gentle authority without appearing intimidating or clinical.
- **Body & Clinical Narrative**: Set in Regular (`400`) with generous line-heights (1.55x–1.62x) to facilitate continuous reading during long case evaluations and progress note reviews.
- **Labels & Badges**: Set in Semibold (`600`) with proportional letter-spacing to maintain crisp definition inside pill badges, session timers, and tabular schedule indexes.

## Layout & Spacing

The dashboard employs a fluid 12-column grid anchored by generous outer margins to ensure mental space and prevent data density from inducing stress.

### Breakpoints & Adaptive Layout Rules
- **Desktop (1200px+)**: 12 columns with `1.5rem` gutters and `2rem` outer margins. Accommodates the persistent left navigation rail (260px fixed), primary workspace (patient feed / calendar), and contextual right-side drawer (active patient insights / quick note capture).
- **Tablet (768px – 1199px)**: 8 columns with `1.25rem` gutters and `1.5rem` margins. The left rail collapses to an icon bar (72px), while contextual side panels transition to slide-over sheets.
- **Mobile (<768px)**: 4 columns with `1rem` gutters and `1rem` margins. Layout stacks vertically; navigation converts to a serene bottom pill bar, ensuring essential schedule actions remain within comfortable thumb reach.

### Spacing Principles
Padding within clinical cards must remain breathing and uncrowded. Use `space-lg` (`1.5rem`) as the baseline padding for internal card containers, and `space-md` (`1rem`) for secondary modules within stacked list groups.

## Elevation & Depth

Visual hierarchy relies on warm, tinted atmospheric depth rather than standard cold grayscale dropshadows. Shadows mimic sunlight filtered through lavender glass.

### Depth Levels
- **Canvas (Ground)**: `#F7F0FC`. Receded, non-interactive floor.
- **Level 1 (Resting Cards & Surfaces)**: `#FFFFFF` resting on `#F7F0FC`. Framed by a soft warm border (`1px solid #EDE0F7`) combined with an ambient diffuse shadow: `0 4px 20px -2px rgba(91, 66, 109, 0.05)`.
- **Level 2 (Hovered Cards & Interactive Controls)**: Elevated surface with `0 8px 24px -4px rgba(91, 66, 109, 0.08)` and subtle border shift to `#D8BEEB`.
- **Level 3 (Modals, Clinical Drawers & Popovers)**: High-level overlay with `0 16px 40px -8px rgba(91, 66, 109, 0.14)`. Backdrop scrim uses `#5B426D` at 20% opacity with a `4px` blur filter to preserve calm focus behind active clinical workflows.

## Shapes

The design system adopts a roundedness factor of `2` (`0.5rem` / 8px base radius), expanding to generous `rounded-xl` (`1.5rem` / 24px) for cards and total pill closures (`9999px`) for interactive badges, status indicators, and button controls. 

Sharp edges are consciously eliminated to reduce perceived clinical hostility and reinforce an approachable, welcoming aesthetic. Cards feature soft 20px–24px corners, evoking tactile index cards or smooth organic stationery.

## Components

### Buttons
- **Primary Action**: Background `#9670B8`, text `#FFFFFF`, fully rounded pill (`9999px`). Internal padding: `0.75rem 1.5rem`. Hover shifts to a richer tint (`#855FA7`) with `box-shadow: 0 4px 14px rgba(150, 112, 184, 0.35)`.
- **Secondary Action**: Background `#EDE0F7`, text `#5B426D`, 1px border `#D8BEEB`. Hover shifts to `#D8BEEB`.
- **Ghost/Tertiary Action**: Transparent background, text `#5B426D`, hover background `#EDE0F7` at 50% opacity.

### Chips & Pill Badges
- **Status Badges (e.g., Confirmed, In Session, Rescheduled)**: Always formatted as fully rounded pills (`rounded-full`). Background `#EDE0F7` with text `#5B426D` and a `6px` solid indicator dot tinted in `#9670B8`.
- **Emotion & Mood Tags**: Background `#FFFFFF`, border `1px solid #D8BEEB`, text `#5B426D`. When active/selected, background transitions to `#9670B8` with `#FFFFFF` text.

### Clinical Cards & Data Modules
- Constructed on pure white (`#FFFFFF`) with `20px` border-radius and `1px solid #EDE0F7`.
- Internal padding is strictly `1.5rem`.
- Divided sections within a card use a delicate divider line of `1px solid #F7F0FC`.

### Form Inputs & Clinical Notes Area
- **Input Fields & Textareas**: Background `#FFFFFF`, border `1.5px solid #D8BEEB`, text `#5B426D`, border-radius `12px`, padding `0.75rem 1rem`. Placeholder text in `#B995D6`.
- **Focus State**: Border color illuminates to `#9670B8` with an ambient glow ring: `0 0 0 4px rgba(216, 190, 235, 0.4)`. No harsh browser outlines.

### Checkboxes & Radio Controls
- Circular and softly rounded squircle bases (`6px` radius for checkboxes).
- Unchecked: `1.5px solid #B995D6`, background `#FFFFFF`.
- Checked: Background `#9670B8`, border `#9670B8`, checkmark icon `#FFFFFF`.

### Therapeutic Domain Components
- **Session Progress Bar**: Track background `#EDE0F7`, progress fill `#9670B8`, completely pill-capped (`9999px`) with height of `8px`.
- **Patient Note Journal Card**: Subtle left vertical accent border (`4px solid #B995D6`) on a `#FFFFFF` card, highlighting therapy notes and emergency contact notifications without visual disruption.