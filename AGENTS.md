# AGENTS.md

## Project Overview

This project is a same-day, no-cost MVP called **p0r by Louda**.

Tagline: **Build Landing Page with AI**

The app lets a user describe a business, product, service, startup idea, personal brand, student project, freelancer offer, or local business. It uses AI to generate structured landing page content and turns that content into a polished one-page website preview with deterministic graphics, then exports a complete standalone `index.html`.

The final output is a complete standalone `index.html` the user can copy or download and open directly in a browser.

This is not a full website builder.
This is not a SaaS dashboard.
This is not a drag-and-drop editor.

## Main Goal

Build a clean, working, deployed MVP that can be shared today.

The MVP must let the user:

1. Fill out a short form about a business or idea.
2. Optionally upload a logo (client-side only).
3. Choose 3 brand colors and a light/dark generated-site theme.
4. Optionally provide up to 3 photo URLs.
5. Generate structured landing page content using OpenRouter.
6. Preview the generated landing page with deterministic graphics.
7. Copy the generated HTML.
8. Download the website as `index.html`.
9. Open the downloaded file directly in a browser.

## Tech Stack

Use:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* OpenRouter API
* HY3/free OpenRouter model if available
* Vercel free tier

Free tools and free tiers only.

Avoid:

* Paid APIs
* Paid databases
* Paid templates
* Paid UI kits
* Paid assets
* Paid hosting
* AI image generation

## Hard Scope Rules

Do not build:

* Auth
* Database
* Dashboard
* Payments
* Drag-and-drop editor
* Custom domains
* User hosting
* Saved projects
* User accounts
* Team accounts
* Complex template systems
* Multiple unnecessary pages
* Section-by-section editor
* Full website builder functionality
* AI image generation
* External image APIs (Unsplash, Pexels, etc.)
* Logo storage or upload to a server

The priority is a working deployed product, not a large feature set.

## Product Principle

The AI generates **structured content only**.

Do not ask the AI to generate:

* React components
* Next.js pages
* Raw HTML
* CSS
* Random layouts
* External image URLs
* Image API calls

The app owns:

* Layout
* Styling
* Preview rendering
* HTML export
* Logo rendering (data URL)
* Color system
* Theme system
* Deterministic graphics
* Copy behavior
* Download behavior

Pipeline:

```txt
User form + design input
→ Server-side OpenRouter call (text only)
→ Structured JSON content
→ Parse and normalize response
→ Render React preview (with logo, colors, theme, graphics)
→ Generate standalone HTML string
→ Copy or download index.html
```

## Required Form Fields

Short form:

* Business/product name
* What it does
* Target audience
* Main problem it solves
* Main benefit
* Tone
* Primary call-to-action
* Optional offer/pricing
* Optional contact info

Tone options: Clear and practical, Friendly and casual, Professional and direct, Premium but not hypey, Student project style, Local business style.

## Design Input

```ts
type LandingPageDesignInput = {
  logoDataUrl?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  siteTheme: "dark" | "light"
  photoUrls: string[]
  useLogoPalette: boolean
}
```

Rules:

* Logo upload is client-side only; converted to a data URL; never sent to a server.
* 3 manual brand colors (primary, secondary, accent) affect the generated site.
* Theme (dark/light) controls only the generated site, not the builder app UI.
* Up to 3 optional photo URLs. Invalid URLs must not crash the app.
* Optional logo palette extraction: sample the uploaded logo on a canvas, extract up to 3 colors, let the user override manually. Fail gracefully.
* If no photo URLs are provided, show deterministic generated graphics instead.

## Required AI Output Shape

```ts
export type LandingPageContent = {
  brandName: string
  tagline: string
  heroHeadline: string
  heroSubheadline: string
  primaryCTA: string
  secondaryCTA: string
  problemTitle: string
  problemDescription: string
  solutionTitle: string
  solutionDescription: string
  benefits: string[]
  features: {
    title: string
    description: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
  pricingOrOffer: string
  contactText: string
  footerText: string
  imageSuggestions?: string[]
  photoKeywords?: string[]
}
```

The AI returns JSON only. No markdown, code fences, explanations, HTML, or React. `imageSuggestions`/`photoKeywords` are optional and must NOT be used to fetch images.

## AI Copywriting Rules

Specific, practical, clear, useful, simple, relevant, non-hypey. Avoid: innovative, revolutionary, game-changing, next-level, seamless, cutting-edge, world-class, powerful solution, transform your business, unlock your potential. Do not invent fake testimonials, awards, numbers, case studies, guarantees.

## OpenRouter Rules

Server-side only.

```env
OPENROUTER_API_KEY=
OPENROUTER_MODEL=tencent/hy3:free
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

* Never expose the API key to the client.
* No `NEXT_PUBLIC_OPENROUTER_API_KEY`.
* Client calls a local server endpoint; server calls OpenRouter.
* Model configurable via `OPENROUTER_MODEL`; default `tencent/hy3:free`.
* No image generation calls; no other providers.

## Parsing and Normalization

Implement `parseAiJson`, `normalizeLandingPageContent`, `ensureStringArray`, `ensureFeatureArray`, `ensureFaqArray`. Normalize missing fields, keep arrays safe, prevent preview crashes on partial output.

## Deterministic Graphics

Generated site includes built-in graphics created with CSS, inline SVG, HTML, gradients, borders, shadows, and pseudo-layouts. No external dependencies.

Use: abstract hero visual, gradient mesh/card, orb/glow shapes, monochrome grid background, product-style mock card, feature cards with icon-like shapes, decorative SVG lines, simple geometric blocks, branded visual panel using selected colors.

Graphics adapt to primary/secondary/accent colors, light/dark theme, optional logo, and optional photo URLs. If photo URLs are provided, show them; otherwise show deterministic graphics.

## HTML Export Rules

Exported website must be: complete HTML document, single file `index.html`, responsive, styled with embedded CSS, usable opened directly in a browser, free of external scripts/CSS/frameworks/required images.

`generateStandaloneHtml(content, design): string` supports logo data URL, selected colors, light/dark theme, optional photo URLs, and deterministic graphics. All user/AI content escaped via `escapeHtml`. No raw AI HTML. No `dangerouslySetInnerHTML` for the app preview.

## Preview Rules

React preview using structured content + design. Includes header with logo if provided, hero with abstract graphic or photo, CTA buttons, problem, solution, benefits, features, visual/graphics section, optional photo grid, FAQ, offer/contact CTA, footer. Polished, modern, screenshot-friendly.

## UI Design Rules

shadcn/ui components: Button, Input, Textarea, Select, Card, Badge, Separator, Skeleton (Sonner optional).

Builder app: dark, mostly monochrome, minimal, crisp, spacious, strong typography, clean cards, clear hierarchy, v0-style. Brand colors affect the generated site, not the builder UI.

## State Requirements

Empty state, validation errors, loading state (disable Generate, show preview skeleton + "Generating landing page...", optional staged labels), API error, JSON parse error, generated preview, copied state, disabled export before content exists. Keep state simple, no global store.

## Example Presets

Local coffee shop, Freelance web design service, Student study app, Beginner fitness tracker. Fill the form instantly, remain editable.

## Build Order

1. Update AGENTS.md.
2. Update visible branding (p0r by Louda / Build Landing Page with AI).
3. Update package/app metadata.
4. Add design input fields (logo, palette toggle, 3 colors, theme, up to 3 photo URLs).
5. Logo-to-data-URL handling.
6. Simple logo palette extraction if safe.
7. Update preview for logo, colors, theme, photos, deterministic graphics.
8. Update generateStandaloneHtml for design + graphics.
9. Improve generated site design.
10. Improve loading state.
11. Improve app UI to clean v0-style.
12. Run build, fix errors.
13. Commit and push.

## Acceptance Criteria

* AGENTS.md updated.
* Branding says p0r by Louda; tagline Build Landing Page with AI.
* Optional logo upload; logo in preview and embedded in index.html.
* Manual 3 brand colors.
* Optional logo palette extraction works or fails gracefully.
* Light/dark generated-site theme.
* Preview and export reflect colors and theme.
* Up to 3 optional photo URLs render if provided.
* Deterministic graphics when no photos.
* Generated site more polished than before.
* Copy/Download still work; file opens in browser.
* OpenRouter text generation still works.
* `npm run build` passes.
* No secrets committed. No auth/db/dashboard/payments.

## Manual Test Checklist

[ ] App opens locally
[ ] Branding shows p0r by Louda / Build Landing Page with AI
[ ] Form fields and validation work
[ ] Presets fill the form
[ ] Logo upload shows in preview
[ ] Logo embedded in downloaded index.html
[ ] 3 color controls change preview + export
[ ] Logo palette extraction works/fails gracefully
[ ] Theme dark/light switches generated site
[ ] Up to 3 photo URLs render; bad URLs don't crash
[ ] No photos → deterministic graphics render
[ ] Generate shows loading skeleton + text
[ ] API errors show readable messages
[ ] AI output renders in preview
[ ] Copy HTML works
[ ] Download index.html works and opens in browser
[ ] Responsive
[ ] No OpenRouter key in client code
[ ] Production build passes

## Vercel Deployment Notes

Push to GitHub, import into Vercel, add env vars (OPENROUTER_API_KEY, OPENROUTER_MODEL, NEXT_PUBLIC_SITE_URL), redeploy, test generation, download index.html, open locally, screenshot.

## Development Philosophy

Keep the app small. Prefer boring, reliable code. Prioritize working generation, preview, export, deployment, clean UI. Do not overbuild.

Goal: ship a useful AI tool today, not a full platform.
