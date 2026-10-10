---
name: Portfolio
description: A playful, interactive portfolio site
colors:
  primary: oklch(0.28 0.015 60)
  neutral-bg: oklch(0.965 0.008 75)
  accent: oklch(0.62 0.08 40)
typography:
  display:
    fontFamily: '"Space Grotesk", "Cabinet Grotesk", system-ui, sans-serif'
    letterSpacing: "-0.02em"
  body:
    fontFamily: '"Inter", system-ui, sans-serif'
rounded:
  sm: "calc(1.25rem - 4px)"
  md: "calc(1.25rem - 2px)"
  lg: "1.25rem"
  xl: "calc(1.25rem + 4px)"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "oklch(0.97 0.008 75)"
    rounded: "{rounded.md}"
    padding: "0.5rem 1rem"
---

# Design System: Portfolio

## 1. Overview

**Creative North Star: "The Playful Creator"**

The design system for this portfolio embraces a playful, interactive, and colorful aesthetic. It rejects the dry, generic SaaS template look in favor of memorable interactions, warm gradients, and distinctive typography. The goal is to show personality and capability simultaneously, leaving a lasting impression on recruiters and potential clients.

**Key Characteristics:**

- Warm, off-white bone/paper backgrounds.
- Vibrant, playful gradients (pink->purple, orange->yellow, cyan->blue).
- High-contrast typography with a distinctive display font.
- Soft, bouncy animations that feel alive but not overwhelming.

## 2. Colors

The palette is anchored by a warm, quiet background that allows vibrant accents to pop.

### Primary

- **Deep Ink** (oklch(0.28 0.015 60)): Used for primary text and high-contrast buttons. Grounding and confident.

### Neutral

- **Warm Bone** (oklch(0.965 0.008 75)): The default canvas. Feels like warm paper, avoiding stark generic white.
- **Dusty Terracotta** (oklch(0.62 0.08 40)): The primary accent color for active states and highlights.

### Named Rules

**The Not-A-SaaS Rule.** Avoid generic, flat blue-on-white combinations. Embrace the warm, muted brand colors and playful gradients to stand out.

## 3. Typography

**Display Font:** Space Grotesk (with Cabinet Grotesk fallback)
**Body Font:** Inter

**Character:** Technical but approachable. The combination of a slightly quirky geometric display font with a highly legible sans-serif body creates a balance of personality and professionalism.

### Hierarchy

- **Display**: Used for hero headlines and major section titles. Tight tracking (-0.02em) for impact.
- **Body**: Clean and readable for prose and descriptions.

### Named Rules

**The Let The Type Speak Rule.** Use large, confident display typography for headers rather than relying on small, uppercase, tracked-out "eyebrows" (like "ABOUT ME" over every section).

## 4. Elevation

The system relies more on tonal contrast and playful interactions (like scaling and rotation) than heavy, realistic shadows, though soft, diffuse shadows are used to lift interactive elements off the canvas.

### Shadow Vocabulary

- **Pop Shadow** (`0 20px 50px -25px oklch(0.22 0.01 60 / 0.25)`): A deep, diffuse shadow for hero elements and floating cards.
- **Card Shadow** (`6px 6px 0 0 oklch(0.22 0.01 60 / 0.9)`): A hard, solid offset shadow for a more playful, brutalist touch on specific components.

## 5. Components

### Buttons

- **Shape:** Softly rounded corners (var(--radius-md) default).
- **Primary:** Deep Ink background, bright text. Solid and grounded.
- **Hover / Focus:** Playful interactions; expect a slight scale down (`scale(0.98)`) or a subtle shadow shift.

### Cards / Containers

- **Corner Style:** Generously rounded (`var(--radius-lg)` or higher).
- **Background:** Slightly lighter than the canvas, or featuring a subtle noise texture.
- **Shadow Strategy:** Use the hard `Card Shadow` for a playful feel, or the diffuse `Pop Shadow` for elegance.

## 6. Do's and Don'ts

### Do:

- **Do** use playful interactions (wiggle, soft bounce) to reward user engagement.
- **Do** maintain high contrast for readability, especially with the deep ink text on warm bone backgrounds.
- **Do** let the content (projects, code snippets) be the hero, using design to frame it nicely.

### Don't:

- **Don't** use standard, generic SaaS templates or layouts (boring whites/grays).
- **Don't** over-animate to the point of distraction; animations should be purposeful and delightful, not chaotic.
- **Don't** use the 2023-era kicker (tiny uppercase tracked eyebrow above every section).
