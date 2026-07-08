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

## Generated Website Quality v2

The generated/exported landing page was redesigned to look premium, not like a basic skeleton.

### Design direction

* One strong deterministic template (no multi-template system).
* `max-width: 1200px` container, generous section spacing via `clamp()`.
* Hero with `clamp()` headline (~40–76px), eyebrow, subheadline, dual CTA, trust strip, and a layered abstract hero graphic or photo.
* Problem/Solution editorial two-panel split.
* Benefits grid (up to 4 cards with numbered marks).
* Features as a bento grid with varied card sizes on desktop and SVG line glyphs.
* Showcase section: premium photo grid when photo URLs exist, otherwise deterministic browser mockup / generated graphics.
* FAQ as a clean numbered list (no JS).
* Strong closing CTA band using brand color glow.
* Clean footer.

### Color and logo rules

* Colors are optional. `LandingPageDesignInput.colorsCustomized` distinguishes user-set colors from defaults.
* Color priority: (1) manual user colors when `colorsCustomized`, (2) logo-extracted palette when `useLogoPalette` and a logo exists, (3) curated default palette for the chosen theme.
* Curated dark/light base palettes define surfaces, borders, glows, text, and contrast. Brand/user/logo color is applied with restraint to CTA, glows, icons, and highlights only.
* Logo upload (client-side data URL) extracts a 3-color palette via canvas and sets it as the default generated-site palette (`useLogoPalette`), overridable manually. Extraction fails gracefully to the curated palette.
* `themeVars()` in `lib/generated-site.ts` resolves the active palette; `resolvePalette()` implements the priority.

### Graphics (deterministic, no external assets)

* Hero art: layered glow, dot grid, floating cards, orb, ring.
* Browser mockup for showcase when no photos.
* 12 SVG line glyphs for features (`FEATURE_ICONS`), shared between preview and export.
* All graphics use CSS variables, adapt to theme, and are duplicated in preview and export.

### Files

* `lib/generated-site.ts`: `themeVars`, `resolvePalette`, `GENERATED_SITE_CSS`, `heroArtHtml`, `showcaseGraphicHtml`, `featureGlyphSvg`, `FEATURE_ICONS`.
* `lib/html-export.ts`: `generateStandaloneHtml()` uses the new 10-section layout.
* `components/landing-preview.tsx`: React mirror of the export using identical class names.
* `components/generator-form.tsx`: color fields marked optional; manual edits set `colorsCustomized`; logo upload derives default palette.

### Acceptance for v2

* Colors optional; logo optional; no-logo/no-color exports still look good.
* Logo upload drives default palette; user can override.
* Preview and exported `index.html` match and look significantly better.
* Light and dark themes both look premium.
* `npm run build` passes; no secrets committed.

## v0-style UX and prompt-first workspace

The app UX moved to a v0/Lovable-style flow.

### App state

* `AppMode = "start" | "workspace"`.
* Start: centered prompt-first screen. No long form by default.
* Workspace: left chat/history panel (~320px), top toolbar, full preview canvas.

### Start screen

* Full dark background, centered prompt area.
* Headline: `What do you want to create?`
* Large prompt textarea: placeholder `Describe the landing page you want to build...`.
* Generate button enabled when a prompt exists (structured fields optional).
* "Design options" toggles a collapsible panel with advanced structured fields, logo upload, theme, optional colors, optional photo URLs, and example presets.
* App infers missing structured fields from the prompt on the server.

### Prompt-first generation

* `LandingPageFormInput.prompt` is the primary input.
* API receives `{ prompt, ...structuredFields }`. If a prompt exists, required-field validation is skipped.
* `buildUserPrompt` leads with the natural-language prompt and lists provided structured details; the AI infers the rest and still returns the structured JSON shape only.

### Workspace

* Left panel: original prompt, generation history, follow-up input (Cmd/Ctrl+Enter to send; sends a regeneration request).
* Top toolbar: project name, view modes (desktop/tablet/mobile), Copy HTML, Download index.html, Regenerate.
* Preview canvas: full available area; preview is an `<iframe srcDoc={generatedHtml}>` so the preview exactly equals the export.

### Single source of truth

* `const generatedHtml = generateStandaloneHtml(content, design)` is the only generated HTML.
* The iframe preview, Copy HTML, and Download index.html all use this exact string. No separate React preview.

### Exported HTML global reset (white-border fix)

* `lib/generated-site.ts` emits a real reset: `*, *::before, *::after { box-sizing: border-box; }`, `html, body { margin: 0; min-height: 100%; background: var(--bg); }`, `body { overflow-x: hidden; }`.
* The CSS variables are applied to the `<html>` element (`<html lang="en" style="...">`), and `.lp` uses `width: 100%; min-height: 100vh; background: var(--bg); color: var(--fg);`. No `.lp body` selector.
* This removes the white border / browser margin around exported pages.

### Industry-aware graphics

* `inferVisualStyle(content)` returns `auto | saas | fitness | education | local-business | portfolio | service | default` from content keywords.
* `heroArtHtml(style, design)` and `showcaseGraphicHtml(style, design)` render deterministic, CSS/SVG-only visuals tailored per industry (e.g. auto repair shows an inspection/booking card, saas shows a dashboard + sparkline, fitness shows a progress gauge, education shows study notes).
* No AI images, no external image APIs.

### Files

* `app/page.tsx`: start/workspace state machine + single source of truth.
* `components/start-screen.tsx`, `components/workspace.tsx`, `components/advanced-options.tsx`, `components/export-actions.tsx`.
* `lib/generated-site.ts`: reset/CSS, `inferVisualStyle`, `heroArtHtml`, `showcaseGraphicHtml`, `themeVars`, `resolvePalette`.
* `lib/html-export.ts`: builds the single HTML, applies style on `<html>`, uses `inferVisualStyle`.
* `lib/prompts.ts`, `app/api/generate/route.ts`: prompt-first request handling.

### Acceptance

* No white border around exported pages.
* Proper `html, body` reset.
* Start screen prompt-first like v0.
* Workspace has left chat panel + large preview canvas (iframe `srcDoc`).
* Preview equals export; copy/download use the exact HTML.
* Industry-aware graphics appear without photos.
* Light/dark themes look premium; `npm run build` passes; no secrets committed.

## Agentic v0-style workspace flow

The app now transitions to the workspace immediately and behaves like an agent.

### State model

* `AppMode = "start" | "workspace"`.
* `GenerationStatus = "idle" | "thinking" | "asking" | "generating" | "ready" | "error"`.
* `ChatMessage = { id, role: user|assistant|system, content, status? }`.
* `ClarifyingQuestion = { id, question, recommendedOption?, options[], allowCustomAnswer }`.

### Immediate transition

On Generate, the app sets `mode = "workspace"` right away, adds the user prompt to chat, sets status `thinking`, and shows the empty preview canvas with a loading state. Generation/planning happens after the workspace is visible.

### Planning + clarifying questions

* `POST /api/plan` receives the prompt (and optional design) and returns `{ shouldAskQuestions, confidence, inferred, questions }`.
* Implemented with OpenRouter (server-side, key never exposed). On missing key or failure it falls back to a local planner that returns up to 4 useful questions.
* Max 4 questions; each has options, one `recommendedOption`, and `allowCustomAnswer: true`.
* If the prompt is enough, `shouldAskQuestions: false` and generation proceeds directly.
* Answers are collected in the chat, then generation runs with the original prompt + answers.

### Chat composer

* Compact `ChatComposer` with a plus button, auto-resizing textarea (min ~48px, max ~180px), and a submit button.
* Used on both the start screen and the workspace follow-up input.
* The start screen's visible "Design options" button was replaced by the plus menu (Upload logo, Generate images toggle, Design options).

### Generated images toggle

* `LandingPageDesignInput.useGeneratedImages` exists and is toggled from the plus menu.
* Full AI image generation is not implemented; the toggle currently maps to enhanced deterministic generated graphics. OpenRouter image generation can be plugged in later behind `ENABLE_AI_IMAGES` / `OPENROUTER_IMAGE_MODEL`.

### Files

* `app/page.tsx`: start/workspace state machine, status, plan→ask→generate flow.
* `app/api/plan/route.ts`: OpenRouter planner with local fallback.
* `components/chat-composer.tsx`, `components/clarifying-questions.tsx`, `components/start-screen.tsx`, `components/workspace.tsx`, `components/export-actions.tsx`, `components/advanced-options.tsx`.
* `lib/prompts.ts` adds planner prompts; `lib/types.ts` adds the new types.

### Acceptance

* Generate immediately opens the workspace.
* Chat shows prompt + status; questions have choices/recommended/custom; skip works; generation works without questions.
* Preview is full canvas via iframe `srcDoc`; copy/download use exact HTML; no white border; `npm run build` passes.

## UI polish and tailored generation

A focused polish pass: clean v0-style composer, muted chat, one-by-one questions, icon toolbar, and more tailored generated sites.

### Header
* Left: `p0r by Louda` only. No tagline, no `Beta`.

### Composer
* Centered, width ~680–760px.
* Compact empty height (48–56px), auto-grows to ~160px.
* Enter sends; Shift+Enter new line.
* Placeholder: `Ask p0r to build...`.
* Plus button left, send right; buttons tight/aligned.

### Plus menu
* Opens below the plus button.
* Closes on outside click, Escape, and after selecting an option.
* Items: Upload logo, Generate images toggle. No visible "Design options".

### Chat
* Assistant messages are plain muted text, no heavy background or border.
* Thinking/working state is a muted line with a neutral monochrome icon (no bright color).
* User prompts get a subtle bubble.

### Questions
* Asked one at a time (max 4).
* Each is a normal assistant turn with compact option buttons.
* Recommended option indicated by text only.
* Custom answer allowed; Skip available; final answer triggers generation.

### Toolbar
* Copy/Download/Regenerate are icon-only square buttons (~32–36px) with title tooltips.

### Generated site
* Industry-aware (`inferVisualStyle`): auto/saas/fitness/education/local-business/portfolio/service/default.
* Auto: appointment/inspection/service hero, service-category showcase, garage-inspired accents.
* No fake reviews, star ratings, certifications, awards, business hours, or phone numbers. Use placeholders like `(555) 123-4567`, `Add your address`, `Add business hours` when details are missing.
* No hype words (innovative, revolutionary, etc.).

### Follow-up
* Workspace follow-up revises/regenerates the current page using conversation context (prompt + prior answers + instruction).

### Acceptance
* Header only shows `p0r by Louda`.
* Composer compact/aligned; Enter sends; Shift+Enter newline.
* Plus dropdown opens below and closes on outside click/Escape/select.
* Assistant chat has no heavy background/borders; thought state muted + neutral icon.
* Questions one-by-one; options clean; Copy/Download icon-only.
* Generated auto pages tailored; no fake claims; exported HTML no white border; `npm run build` passes.
