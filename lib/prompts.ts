import type { LandingPageContent, LandingPageFormInput } from "./types";

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
- Every question must include a "recommendedOption" and a list of 3-5 concise options.
- Always set "allowCustomAnswer": true.
- If the request already has enough detail, set "shouldAskQuestions": false and return an empty questions array.
- Prefer recommended options that suit a real, local, believable business.
- Do not invent fake testimonials, stats, or contact details.`;
}

export function buildPlannerUserPrompt(prompt: string): string {
  return `Plan a landing page for this request:\n"${prompt.trim()}"`;
}

