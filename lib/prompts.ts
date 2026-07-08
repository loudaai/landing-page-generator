import type { LandingPageContent, LandingPageFormInput, PageBlueprint } from "./types";

export function buildSystemPrompt(): string {
  return `You are a senior landing page copywriter. Return ONLY a JSON object that matches this exact shape. No markdown, no code fences, no HTML, no React, no explanations. Output the JSON object and nothing else.

{
  "brandName": string,
  "tagline": string,
  "heroHeadline": string,
  "heroSubheadline": string,
  "primaryCTA": string,
  "secondaryCTA": string,
  "problemTitle": string,
  "problemDescription": string,
  "solutionTitle": string,
  "solutionDescription": string,
  "benefits": string[],
  "features": { "title": string, "description": string }[],
  "faqs": { "question": string, "answer": string }[],
  "pricingOrOffer": string,
  "contactText": string,
  "footerText": string,
  "imageSuggestions": string[],
  "photoKeywords": string[]
}

How to write:
- The user may give a short natural-language prompt. Infer the business, audience, problem, benefit, tone, and call-to-action from it when not explicitly provided.
- Identify the industry (e.g. automotive repair, fitness, SaaS, local food business, education) and write copy that fits that industry specifically. Use industry-appropriate language, section titles, and a tailored call-to-action (e.g. automotive repair → "Book a service", "Inspection", "Maintenance").
- Be clear, specific, practical, and directly relevant. Write copy that fits the actual business described. Avoid generic startup SaaS language for non-SaaS businesses.
- Keep copy simple and useful. Do not invent fake testimonials, reviews, star ratings, awards, statistics, certifications, case studies, guarantees, business hours, or phone numbers.
- If contact details are missing, use clearly placeholder values: "(555) 123-4567", "Add your address", "Add business hours". Do not present placeholders as real facts.
- Avoid hype words: innovative, revolutionary, game-changing, next-level, seamless, cutting-edge, world-class, powerful solution, transform your business, unlock your potential.
- imageSuggestions and photoKeywords are optional and only for inspiration. Do NOT use them to fetch or generate images.
- Write copy only. Respond with a single JSON object and nothing else.`;
}

export function buildUserPrompt(input: LandingPageFormInput): string {
  const prompt = input.prompt.trim();
  const details: string[] = [];

  if (input.brandName.trim()) details.push(`Business or product name: ${input.brandName}`);
  if (input.whatItDoes.trim()) details.push(`What it does: ${input.whatItDoes}`);
  if (input.targetAudience.trim())
    details.push(`Target audience: ${input.targetAudience}`);
  if (input.mainProblem.trim()) details.push(`Main problem it solves: ${input.mainProblem}`);
  if (input.mainBenefit.trim()) details.push(`Main benefit: ${input.mainBenefit}`);
  if (input.tone.trim()) details.push(`Tone: ${input.tone}`);
  if (input.primaryCTA.trim()) details.push(`Primary call-to-action: ${input.primaryCTA}`);
  if (input.offerOrPricing.trim())
    details.push(`Offer or pricing: ${input.offerOrPricing}`);
  if (input.contactInfo.trim()) details.push(`Contact info: ${input.contactInfo}`);

  const detailBlock = details.length
    ? `\n\nAdditional details the user provided (use when present, otherwise infer):\n${details.join("\n")}`
    : "";

  return `Create landing page copy${prompt ? ` from this request:\n"${prompt}"` : ""}${detailBlock}`;
}

export function buildRevisionPrompt(
  input: LandingPageFormInput,
  current: LandingPageContent | null,
  instruction: string
): string {
  const base = buildUserPrompt(input);
  const existing = current
    ? `\n\nHere is the current landing page content (JSON). Revise it per the instruction above, keeping the same JSON shape. Do not start from scratch unless asked:\n${JSON.stringify(current)}`
    : "";
  return `${base}\n\nRevision instruction:\n"${instruction}"${existing}`;
}

export function buildPlannerSystemPrompt(): string {
  return `You are a planning assistant for a landing page generator. You do NOT write the landing page yet.

Given a user request, decide whether you have enough information to build a strong landing page. If important context is missing, ask up to 4 multiple-choice clarifying questions.

Return ONLY a JSON object matching this shape. No markdown, no code fences, no explanations.

{
  "shouldAskQuestions": boolean,
  "confidence": "low" | "medium" | "high",
  "inferred": {
    "brandName": string,
    "businessType": string,
    "targetAudience": string,
    "primaryCTA": string,
    "tone": string,
    "visualStyle": string
  },
  "questions": [
    {
      "id": string,
      "question": string,
      "recommendedOption": string,
      "options": string[],
      "allowCustomAnswer": true
    }
  ]
}

Rules:
- Ask at most 4 questions.
- Only ask questions that materially improve the page.
- Do not ask a question if the answer can be confidently inferred from the request.
- Every question must include a "recommendedOption" and exactly 3 concise options. The app appends an "Other" choice, so each question shows 4 choices total.
- Always set "allowCustomAnswer": true.
- If the request already has enough detail, set "shouldAskQuestions": false and return an empty questions array.
- Prefer recommended options that suit a real, local, believable business.
- Do not invent fake testimonials, stats, or contact details.`;
}

export function buildPlannerUserPrompt(prompt: string): string {
  return `Plan a landing page for this request:\n"${prompt.trim()}"`;
}

/* -------------------------------------------------------------------------- */
/* PageBlueprint generation prompts                                           */
/* -------------------------------------------------------------------------- */

export function buildBlueprintSystemPrompt(): string {
  return `You are an AI page architect, not just a copywriter. You design the full structure of a landing page and return it as a single JSON object that matches this exact shape. No markdown, no code fences, no HTML, no CSS, no React, no explanations. Output the JSON object and nothing else.

{
  "meta": {
    "brandName": string,
    "industry": string,
    "inferredAudience": string,
    "pageGoal": string,
    "visualStyle": "auto" | "local-business" | "saas" | "fitness" | "education" | "portfolio" | "agency" | "service" | "restaurant-cafe" | "personal-brand" | "default",
    "tone": string
  },
  "theme": {
    "mode": "dark" | "light",
    "paletteSource": "manual" | "logo" | "default",
    "primaryColor": string,
    "secondaryColor": string,
    "accentColor": string,
    "backgroundStyle": "minimal" | "gradient" | "editorial" | "industrial" | "soft" | "premium",
    "fontChoice": "modern" | "grotesk" | "editorial" | "rounded" | "tech",
    "radius": "sharp" | "soft" | "rounded",
    "density": "compact" | "balanced" | "airy",
    "decoration": "minimal" | "balanced" | "rich",
    "aesthetic": "studio" | "saas" | "bold" | "minimal"
  },
  "navigation": { "showNav": boolean, "items": [{ "label": string, "targetId": string }] },
  "sections": [ /* ordered PageSection objects, see types below */ ],
  "ctaStrategy": {
    "primaryCTA": string,
    "secondaryCTA": string,
    "contactMode": "email" | "phone" | "form-placeholder" | "booking-placeholder" | "none"
  },
  "graphics": {
    "heroVisual": "auto-service-dashboard" | "inspection-checklist" | "booking-card" | "saas-dashboard" | "workflow-nodes" | "fitness-progress" | "study-cards" | "local-business-card" | "portfolio-showcase" | "abstract-gradient" | "none",
    "sectionVisuals": [ /* same GraphicType values */ ],
    "useGeneratedImages": boolean
  }
}

Section objects (use only these "type" values, each needs a unique "id" string):
- { "id", "type": "hero", "layout": "split-visual" | "centered" | "editorial" | "service-hero", "eyebrow"?, "headline", "subheadline", "primaryCTA", "secondaryCTA"?, "visual": GraphicType }
- { "id", "type": "value-strip", "layout": "row" | "chips", "items": string[] }
- { "id", "type": "services", "layout": "grid" | "bento" | "service-list", "eyebrow"?, "title", "description"?, "services": [{ "title", "description" }] }
- { "id", "type": "problem-solution", "layout": "split" | "stacked", "problemTitle", "problemDescription", "solutionTitle", "solutionDescription" }
- { "id", "type": "benefits", "layout": "grid" | "row", "eyebrow"?, "title"?, "benefits": [{ "title", "description" }] }
- { "id", "type": "features", "layout": "bento", "eyebrow"?, "title"?, "features": [{ "title", "description" }] }
- { "id", "type": "process", "layout": "steps" | "timeline" | "cards", "title", "description"?, "steps": [{ "title", "description" }] }
- { "id", "type": "showcase", "layout": "gallery" | "browser" | "panel", "eyebrow"?, "title"?, "description"? }
- { "id", "type": "pricing-offer", "layout": "single" | "cards", "eyebrow"?, "title"?, "description"?, "offer": string }
- { "id", "type": "contact", "layout": "card" | "split", "eyebrow"?, "title"?, "description"?, "contactMode": ContactMode, "details"?: string }
- { "id", "type": "faq", "eyebrow"?, "title"?, "faqs": [{ "question", "answer" }] }
- { "id", "type": "final-cta", "headline", "subheadline"?, "primaryCTA", "secondaryCTA"? }
- { "id", "type": "footer", "text" }

How to design:
- Choose sections that fit the user's request. Do NOT use a fixed template. A local auto repair shop should get auto-specific sections (services, process, inspection visuals, booking CTA). A study app should get education/SAAS sections. Pick the section order intentionally.
- Choose "layout" per section based on business type and content density.
- Choose "visualStyle" from the industry (auto, saas, fitness, education, local-business, portfolio, agency, service, restaurant-cafe, personal-brand, default).
- Choose "heroVisual" and "sectionVisuals" from the GraphicType list that match the industry.
- Choose "ctaStrategy": primaryCTA should be the single most important action (e.g. "Book a service" for auto repair, "Request a quote" for freelancers). Set contactMode appropriately.
- Choose "theme.backgroundStyle" to match the brand (industrial for auto, premium/soft for portfolio, minimal for SaaS). Colors must be valid hex codes.
- Choose the visual design tokens intentionally to make the page feel crafted, not templated:
  - "fontChoice": "editorial" for refined/luxury brands, "grotesk" for bold modern brands, "tech" for developer/AI tools, "rounded" for friendly/casual, "modern" for clean general use.
  - "radius": "sharp" for crisp/industrial/editorial, "soft" for standard, "rounded" for friendly/soft brands.
  - "density": "compact" for information-dense/pricing pages, "balanced" default, "airy" for premium/spacious feel.
  - "decoration": "minimal" for clean/corporate, "balanced" default, "rich" for bold visual brands with more glow and texture.
  - "aesthetic": choose the overall design direction that fits the brand — "studio" for refined/editorial/luxury (serif display, hairline rules, airy), "saas" for modern product/tech brands (gradient glow, crisp cards, pill buttons), "bold" for high-impact brands (large type, strong contrast, thick borders), "minimal" for clean/calm brands (hairline borders, lots of whitespace, muted).
- Write copy that is specific, practical, and non-hype. Avoid: innovative, revolutionary, game-changing, next-level, seamless, cutting-edge, world-class, powerful solution, transform your business, unlock your potential.
- Do NOT invent fake reviews, ratings, certifications, awards, statistics, customer counts, business hours, phone numbers, addresses, or "same-day service" guarantees. When contact details are missing, use clearly placeholder values: "Add your phone number", "Add your address", "Add business hours", "Book a service".
- Infer any missing information when reasonable. Return JSON only.`;
}

export function buildBlueprintUserPrompt(input: LandingPageFormInput): string {
  const prompt = input.prompt.trim();
  const details: string[] = [];

  if (input.brandName.trim()) details.push(`Business or product name: ${input.brandName}`);
  if (input.whatItDoes.trim()) details.push(`What it does: ${input.whatItDoes}`);
  if (input.targetAudience.trim())
    details.push(`Target audience: ${input.targetAudience}`);
  if (input.mainProblem.trim()) details.push(`Main problem it solves: ${input.mainProblem}`);
  if (input.mainBenefit.trim()) details.push(`Main benefit: ${input.mainBenefit}`);
  if (input.tone.trim()) details.push(`Tone: ${input.tone}`);
  if (input.primaryCTA.trim()) details.push(`Primary call-to-action: ${input.primaryCTA}`);
  if (input.offerOrPricing.trim())
    details.push(`Offer or pricing: ${input.offerOrPricing}`);
  if (input.contactInfo.trim()) details.push(`Contact info: ${input.contactInfo}`);

  const detailBlock = details.length
    ? `\n\nAdditional details the user provided (use when present, otherwise infer):\n${details.join("\n")}`
    : "";

  return `Design a complete landing page blueprint${prompt ? ` from this request:\n"${prompt}"` : ""}${detailBlock}\n\nReturn the PageBlueprint JSON now.`;
}

export function buildBlueprintRevisionPrompt(
  input: LandingPageFormInput,
  current: PageBlueprint | null,
  instruction: string
): string {
  const base = buildBlueprintUserPrompt(input);
  const existing = current
    ? `\n\nHere is the CURRENT PageBlueprint JSON. Revise it according to the instruction. Preserve good structure unless the instruction requires changing it. Return the FULL updated PageBlueprint JSON (all sections), not a diff:\n${JSON.stringify(current)}`
    : "";
  return `${base}\n\nRevision instruction:\n"${instruction}"${existing}\n\nReturn the full updated PageBlueprint JSON now.`;
}

