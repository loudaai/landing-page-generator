import type { LandingPageContent } from "./types";

export function parseAiJson(raw: string): unknown {
  let text = String(raw).trim();

  const fence = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fence) {
    text = fence[1].trim();
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  return JSON.parse(text);
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

export function ensureStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string" && item.trim() !== "")
    .map((item) => item.trim());
}

export function ensureFeatureArray(
  value: unknown
): LandingPageContent["features"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object"
    )
    .map((item) => ({
      title: asString(item.title),
      description: asString(item.description),
    }));
}

export function ensureFaqArray(value: unknown): LandingPageContent["faqs"] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object"
    )
    .map((item) => ({
      question: asString(item.question),
      answer: asString(item.answer),
    }));
}

export function normalizeLandingPageContent(value: unknown): LandingPageContent {
  const obj = (
    value && typeof value === "object" ? value : {}
  ) as Record<string, unknown>;

  return {
    brandName: asString(obj.brandName),
    tagline: asString(obj.tagline),
    heroHeadline: asString(obj.heroHeadline),
    heroSubheadline: asString(obj.heroSubheadline),
    primaryCTA: asString(obj.primaryCTA),
    secondaryCTA: asString(obj.secondaryCTA),
    problemTitle: asString(obj.problemTitle),
    problemDescription: asString(obj.problemDescription),
    solutionTitle: asString(obj.solutionTitle),
    solutionDescription: asString(obj.solutionDescription),
    benefits: ensureStringArray(obj.benefits),
    features: ensureFeatureArray(obj.features),
    faqs: ensureFaqArray(obj.faqs),
    pricingOrOffer: asString(obj.pricingOrOffer),
    contactText: asString(obj.contactText),
    footerText: asString(obj.footerText),
    imageSuggestions: ensureStringArray(obj.imageSuggestions),
    photoKeywords: ensureStringArray(obj.photoKeywords),
  };
}
