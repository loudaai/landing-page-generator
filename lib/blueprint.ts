import type {
  BackgroundStyle,
  ContactMode,
  DecorationChoice,
  DensityChoice,
  FontChoice,
  GraphicType,
  PageBlueprint,
  PageSection,
  RadiusChoice,
  VisualStyle,
} from "./types";

let idCounter = 0;
function uid(prefix = "s"): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asStringArray(value: unknown): string[] {
  return asArray(value)
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
    .map((v) => v.trim());
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const VISUAL_STYLES: VisualStyle[] = [
  "auto",
  "local-business",
  "saas",
  "fitness",
  "education",
  "portfolio",
  "agency",
  "service",
  "restaurant-cafe",
  "personal-brand",
  "default",
];

const GRAPHIC_TYPES: GraphicType[] = [
  "auto-service-dashboard",
  "inspection-checklist",
  "booking-card",
  "saas-dashboard",
  "workflow-nodes",
  "fitness-progress",
  "study-cards",
  "local-business-card",
  "portfolio-showcase",
  "abstract-gradient",
  "none",
];

const BACKGROUND_STYLES: BackgroundStyle[] = [
  "minimal",
  "gradient",
  "editorial",
  "industrial",
  "soft",
  "premium",
];

const FONT_CHOICES: FontChoice[] = [
  "modern",
  "grotesk",
  "editorial",
  "rounded",
  "tech",
];

const RADIUS_CHOICES: RadiusChoice[] = ["sharp", "soft", "rounded"];

const DENSITY_CHOICES: DensityChoice[] = ["compact", "balanced", "airy"];

const DECORATION_CHOICES: DecorationChoice[] = [
  "minimal",
  "balanced",
  "rich",
];

const CONTACT_MODES: ContactMode[] = [
  "email",
  "phone",
  "form-placeholder",
  "booking-placeholder",
  "none",
];

export function defaultHeroVisual(style: VisualStyle): GraphicType {
  switch (style) {
    case "auto":
      return "auto-service-dashboard";
    case "saas":
      return "saas-dashboard";
    case "fitness":
      return "fitness-progress";
    case "education":
      return "study-cards";
    case "local-business":
    case "service":
    case "restaurant-cafe":
      return "local-business-card";
    case "portfolio":
      return "portfolio-showcase";
    case "agency":
      return "workflow-nodes";
    default:
      return "abstract-gradient";
  }
}

function normalizeSection(raw: unknown): PageSection | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const type = asString(obj.type);
  const id = asString(obj.id) || uid(type);

  switch (type) {
    case "hero": {
      const layout = pick(obj.layout, ["split-visual", "centered", "editorial", "service-hero"], "split-visual");
      const visual = pick(obj.visual, GRAPHIC_TYPES, "abstract-gradient") as GraphicType;
      return {
        id,
        type: "hero",
        layout,
        eyebrow: asString(obj.eyebrow) || undefined,
        headline: asString(obj.headline, "Build something people remember"),
        subheadline: asString(obj.subheadline),
        primaryCTA: asString(obj.primaryCTA, "Get started"),
        secondaryCTA: asString(obj.secondaryCTA) || undefined,
        visual,
      };
    }
    case "value-strip": {
      const items = asStringArray(obj.items).slice(0, 6);
      if (items.length === 0) return null;
      return {
        id,
        type: "value-strip",
        layout: pick(obj.layout, ["row", "chips"], "row"),
        items,
      };
    }
    case "services": {
      const services = asArray(obj.services)
        .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object")
        .map((s) => ({
          title: asString(s.title, "Service"),
          description: asString(s.description),
        }))
        .slice(0, 8);
      if (services.length === 0) return null;
      return {
        id,
        type: "services",
        layout: pick(obj.layout, ["grid", "bento", "service-list"], "grid"),
        eyebrow: asString(obj.eyebrow) || undefined,
        title: asString(obj.title, "What we offer"),
        description: asString(obj.description) || undefined,
        services,
      };
    }
    case "problem-solution": {
      return {
        id,
        type: "problem-solution",
        layout: pick(obj.layout, ["split", "stacked"], "split"),
        problemTitle: asString(obj.problemTitle, "The problem"),
        problemDescription: asString(obj.problemDescription),
        solutionTitle: asString(obj.solutionTitle, "Our approach"),
        solutionDescription: asString(obj.solutionDescription),
      };
    }
    case "benefits": {
      const benefits = asArray(obj.benefits)
        .filter((b): b is Record<string, unknown> => Boolean(b) && typeof b === "object")
        .map((b) => ({
          title: asString(b.title, "Benefit"),
          description: asString(b.description),
        }))
        .slice(0, 6);
      if (benefits.length === 0) return null;
      return {
        id,
        type: "benefits",
        layout: pick(obj.layout, ["grid", "row"], "grid"),
        eyebrow: asString(obj.eyebrow) || undefined,
        title: asString(obj.title) || undefined,
        benefits,
      };
    }
    case "features": {
      const features = asArray(obj.features)
        .filter((f): f is Record<string, unknown> => Boolean(f) && typeof f === "object")
        .map((f) => ({
          title: asString(f.title, "Feature"),
          description: asString(f.description),
        }))
        .slice(0, 8);
      if (features.length === 0) return null;
      return {
        id,
        type: "features",
        layout: "bento",
        eyebrow: asString(obj.eyebrow) || undefined,
        title: asString(obj.title) || undefined,
        features,
      };
    }
    case "process": {
      const steps = asArray(obj.steps)
        .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object")
        .map((s) => ({
          title: asString(s.title, "Step"),
          description: asString(s.description),
        }))
        .slice(0, 6);
      if (steps.length === 0) return null;
      return {
        id,
        type: "process",
        layout: pick(obj.layout, ["steps", "timeline", "cards"], "steps"),
        title: asString(obj.title, "How it works"),
        description: asString(obj.description) || undefined,
        steps,
      };
    }
    case "showcase": {
      return {
        id,
        type: "showcase",
        layout: pick(obj.layout, ["gallery", "browser", "panel"], "gallery"),
        eyebrow: asString(obj.eyebrow) || undefined,
        title: asString(obj.title) || undefined,
        description: asString(obj.description) || undefined,
      };
    }
    case "pricing-offer": {
      return {
        id,
        type: "pricing-offer",
        layout: pick(obj.layout, ["single", "cards"], "single"),
        eyebrow: asString(obj.eyebrow) || undefined,
        title: asString(obj.title) || undefined,
        description: asString(obj.description) || undefined,
        offer: asString(obj.offer, "Get started today."),
      };
    }
    case "contact": {
      const contactMode = pick(obj.contactMode, CONTACT_MODES, "booking-placeholder") as ContactMode;
      return {
        id,
        type: "contact",
        layout: pick(obj.layout, ["card", "split"], "card"),
        eyebrow: asString(obj.eyebrow) || undefined,
        title: asString(obj.title, "Get in touch"),
        description: asString(obj.description) || undefined,
        contactMode,
        details: asString(obj.details) || undefined,
      };
    }
    case "faq": {
      const faqs = asArray(obj.faqs)
        .filter((f): f is Record<string, unknown> => Boolean(f) && typeof f === "object")
        .map((f) => ({
          question: asString(f.question, "Question"),
          answer: asString(f.answer),
        }))
        .slice(0, 8);
      if (faqs.length === 0) return null;
      return {
        id,
        type: "faq",
        eyebrow: asString(obj.eyebrow) || undefined,
        title: asString(obj.title, "Questions, answered"),
        faqs,
      };
    }
    case "final-cta": {
      return {
        id,
        type: "final-cta",
        headline: asString(obj.headline, "Ready to get started?"),
        subheadline: asString(obj.subheadline) || undefined,
        primaryCTA: asString(obj.primaryCTA, "Get started"),
        secondaryCTA: asString(obj.secondaryCTA) || undefined,
      };
    }
    case "footer": {
      return {
        id,
        type: "footer",
        text: asString(obj.text, "Built with p0r by Louda."),
      };
    }
    default:
      return null;
  }
}

export function defaultBlueprint(prompt = ""): PageBlueprint {
  const lower = prompt.toLowerCase();
  const visualStyle: VisualStyle = lower.includes("auto") || lower.includes("repair") || lower.includes("car")
    ? "auto"
    : "default";
  const heroVisual = defaultHeroVisual(visualStyle);
  return {
    meta: {
      brandName: "Your Business",
      industry: "general business",
      inferredAudience: "people looking for what you offer",
      pageGoal: "explain the offer and drive a clear action",
      visualStyle,
      tone: "Clear and practical",
    },
    theme: {
      mode: "dark",
      paletteSource: "default",
      primaryColor: "#f5f5f6",
      secondaryColor: "#26262e",
      accentColor: "#9b9ba6",
      backgroundStyle: "minimal",
      fontChoice: "modern",
      radius: "soft",
      density: "balanced",
      decoration: "balanced",
    },
    navigation: {
      showNav: true,
      items: [
        { label: "Offer", targetId: "services" },
        { label: "Process", targetId: "process" },
        { label: "FAQ", targetId: "faq" },
      ],
    },
    sections: [
      {
        id: uid("hero"),
        type: "hero",
        layout: "split-visual",
        headline: "A clear page that earns trust",
        subheadline: "We help you say what you do and why it matters, then make it easy to take the next step.",
        primaryCTA: "Get started",
        secondaryCTA: "Learn more",
        visual: heroVisual,
      },
      {
        id: uid("value"),
        type: "value-strip",
        layout: "row",
        items: ["Clear and practical", "Built for your audience", "No fluff"],
      },
      {
        id: uid("services"),
        type: "services",
        layout: "grid",
        title: "What we offer",
        description: "The essentials, explained simply.",
        services: [
          { title: "Core service", description: "The main thing you do, described clearly." },
          { title: "Supporting service", description: "Helps your customers get the full result." },
          { title: "Ongoing care", description: "Keep things working after the first step." },
        ],
      },
      {
        id: uid("process"),
        type: "process",
        layout: "steps",
        title: "How it works",
        steps: [
          { title: "Reach out", description: "Tell us what you need." },
          { title: "We plan", description: "A simple, clear path forward." },
          { title: "You get results", description: "The outcome your customers care about." },
        ],
      },
      {
        id: uid("showcase"),
        type: "showcase",
        layout: "gallery",
        title: "A closer look",
      },
      {
        id: uid("faq"),
        type: "faq",
        title: "Questions, answered",
        faqs: [
          { question: "How do I get started?", answer: "Send a message and we'll take it from there." },
          { question: "What does it cost?", answer: "Add your pricing or a 'request a quote' option." },
        ],
      },
      {
        id: uid("final"),
        type: "final-cta",
        headline: "Ready to get started?",
        subheadline: "Tell us what you need and we'll help you move.",
        primaryCTA: "Get started",
      },
      {
        id: uid("footer"),
        type: "footer",
        text: "Built with p0r by Louda.",
      },
    ],
    ctaStrategy: {
      primaryCTA: "Get started",
      secondaryCTA: "Learn more",
      contactMode: "booking-placeholder",
    },
    graphics: {
      heroVisual,
      sectionVisuals: [heroVisual],
      useGeneratedImages: false,
    },
  };
}

export function normalizePageBlueprint(
  value: unknown,
  fallbackPrompt = ""
): PageBlueprint {
  if (!value || typeof value !== "object") return defaultBlueprint(fallbackPrompt);
  const obj = value as Record<string, unknown>;

  const metaRaw = (obj.meta ?? {}) as Record<string, unknown>;
  const themeRaw = (obj.theme ?? {}) as Record<string, unknown>;
  const navRaw = (obj.navigation ?? {}) as Record<string, unknown>;
  const ctaRaw = (obj.ctaStrategy ?? {}) as Record<string, unknown>;
  const graphicsRaw = (obj.graphics ?? {}) as Record<string, unknown>;

  const visualStyle = pick(
    metaRaw.visualStyle,
    VISUAL_STYLES,
    "default"
  ) as VisualStyle;
  const backgroundStyle = pick(
    themeRaw.backgroundStyle,
    BACKGROUND_STYLES,
    "minimal"
  ) as BackgroundStyle;
  const fontChoice = pick(themeRaw.fontChoice, FONT_CHOICES, "modern") as FontChoice;
  const radius = pick(themeRaw.radius, RADIUS_CHOICES, "soft") as RadiusChoice;
  const density = pick(themeRaw.density, DENSITY_CHOICES, "balanced") as DensityChoice;
  const decoration = pick(themeRaw.decoration, DECORATION_CHOICES, "balanced") as DecorationChoice;

  const sections = asArray(obj.sections)
    .map(normalizeSection)
    .filter((s): s is PageSection => s !== null);

  // Ensure required backbone sections exist.
  if (!sections.some((s) => s.type === "hero")) {
    sections.unshift({
      id: uid("hero"),
      type: "hero",
      layout: "split-visual",
      headline: asString(metaRaw.brandName, "Your Business"),
      subheadline: "A clear, focused landing page built from your request.",
      primaryCTA: "Get started",
      visual: defaultHeroVisual(visualStyle),
    });
  }
  if (!sections.some((s) => s.type === "final-cta")) {
    sections.push({
      id: uid("final"),
      type: "final-cta",
      headline: "Ready to get started?",
      primaryCTA: asString(ctaRaw.primaryCTA, "Get started"),
      secondaryCTA: asString(ctaRaw.secondaryCTA) || undefined,
    });
  }
  if (!sections.some((s) => s.type === "footer")) {
    sections.push({
      id: uid("footer"),
      type: "footer",
      text: "Built with p0r by Louda.",
    });
  }

  const navItems = asArray(navRaw.items)
    .filter((n): n is Record<string, unknown> => Boolean(n) && typeof n === "object")
    .map((n) => ({
      label: asString(n.label, "Link"),
      targetId: asString(n.targetId, "top"),
    }))
    .slice(0, 6);

  const heroVisual = pick(
    graphicsRaw.heroVisual,
    GRAPHIC_TYPES,
    defaultHeroVisual(visualStyle)
  ) as GraphicType;
  const sectionVisuals = asStringArray(graphicsRaw.sectionVisuals)
    .filter((g): g is GraphicType => GRAPHIC_TYPES.includes(g as GraphicType))
    .slice(0, 4);

  return {
    meta: {
      brandName: asString(metaRaw.brandName, "Your Business"),
      industry: asString(metaRaw.industry, "general business"),
      inferredAudience: asString(metaRaw.inferredAudience, "your audience"),
      pageGoal: asString(metaRaw.pageGoal, "drive a clear action"),
      visualStyle,
      tone: asString(metaRaw.tone, "Clear and practical"),
    },
    theme: {
      mode: themeRaw.mode === "light" ? "light" : "dark",
      paletteSource: pick(themeRaw.paletteSource, ["manual", "logo", "default"], "default"),
      primaryColor: asString(themeRaw.primaryColor, "#f5f5f6"),
      secondaryColor: asString(themeRaw.secondaryColor, "#26262e"),
      accentColor: asString(themeRaw.accentColor, "#9b9ba6"),
      backgroundStyle,
      fontChoice,
      radius,
      density,
      decoration,
    },
    navigation: {
      showNav: navRaw.showNav !== false,
      items: navItems,
    },
    sections,
    ctaStrategy: {
      primaryCTA: asString(ctaRaw.primaryCTA, "Get started"),
      secondaryCTA: asString(ctaRaw.secondaryCTA) || undefined,
      contactMode: pick(ctaRaw.contactMode, CONTACT_MODES, "booking-placeholder") as ContactMode,
    },
    graphics: {
      heroVisual,
      sectionVisuals,
      useGeneratedImages: Boolean(graphicsRaw.useGeneratedImages),
    },
  };
}

export function legacyContentToBlueprint(content: {
  brandName?: string;
  tagline?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  primaryCTA?: string;
  secondaryCTA?: string;
  problemTitle?: string;
  problemDescription?: string;
  solutionTitle?: string;
  solutionDescription?: string;
  benefits?: string[];
  features?: { title?: string; description?: string }[];
  faqs?: { question?: string; answer?: string }[];
  pricingOrOffer?: string;
  contactText?: string;
  footerText?: string;
}): PageBlueprint {
  const brand = content.brandName || "Your Business";
  const primaryCTA = content.primaryCTA || "Get started";
  const visualStyle: VisualStyle = "default";
  const heroVisual = defaultHeroVisual(visualStyle);

  const benefits = (content.benefits || [])
    .filter((b) => typeof b === "string" && b.trim())
    .map((b) => ({ title: b, description: "" }))
    .slice(0, 6);

  const features = (content.features || [])
    .filter((f): f is { title?: string; description?: string } => Boolean(f))
    .map((f) => ({ title: f.title || "Feature", description: f.description || "" }))
    .slice(0, 8);

  const faqs = (content.faqs || [])
    .filter((f): f is { question?: string; answer?: string } => Boolean(f))
    .map((f) => ({ question: f.question || "Question", answer: f.answer || "" }))
    .slice(0, 8);

  const sections: PageSection[] = [];

  sections.push({
    id: uid("hero"),
    type: "hero",
    layout: "split-visual",
    eyebrow: content.tagline || undefined,
    headline: content.heroHeadline || brand,
    subheadline: content.heroSubheadline || "",
    primaryCTA,
    secondaryCTA: content.secondaryCTA || undefined,
    visual: heroVisual,
  });

  if (content.problemTitle || content.problemDescription) {
    sections.push({
      id: uid("ps"),
      type: "problem-solution",
      layout: "split",
      problemTitle: content.problemTitle || "The problem",
      problemDescription: content.problemDescription || "",
      solutionTitle: content.solutionTitle || "Our approach",
      solutionDescription: content.solutionDescription || "",
    });
  }

  if (benefits.length) {
    sections.push({ id: uid("benefits"), type: "benefits", layout: "grid", benefits });
  }
  if (features.length) {
    sections.push({ id: uid("features"), type: "features", layout: "bento", features });
  }

  sections.push({ id: uid("showcase"), type: "showcase", layout: "gallery" });

  if (content.pricingOrOffer) {
    sections.push({
      id: uid("offer"),
      type: "pricing-offer",
      layout: "single",
      offer: content.pricingOrOffer,
    });
  }

  if (content.contactText) {
    sections.push({
      id: uid("contact"),
      type: "contact",
      layout: "card",
      contactMode: "booking-placeholder",
      details: content.contactText,
    });
  }

  if (faqs.length) {
    sections.push({ id: uid("faq"), type: "faq", faqs });
  }

  sections.push({
    id: uid("final"),
    type: "final-cta",
    headline: content.heroHeadline || "Ready to get started?",
    primaryCTA,
    secondaryCTA: content.secondaryCTA || undefined,
  });
  sections.push({ id: uid("footer"), type: "footer", text: content.footerText || "Built with p0r by Louda." });

  return {
    meta: {
      brandName: brand,
      industry: "general business",
      inferredAudience: "your audience",
      pageGoal: "drive a clear action",
      visualStyle,
      tone: "Clear and practical",
    },
    theme: {
      mode: "dark",
      paletteSource: "default",
      primaryColor: "#f5f5f6",
      secondaryColor: "#26262e",
      accentColor: "#9b9ba6",
      backgroundStyle: "minimal",
      fontChoice: "modern",
      radius: "soft",
      density: "balanced",
      decoration: "balanced",
    },
    navigation: { showNav: true, items: [] },
    sections,
    ctaStrategy: { primaryCTA, secondaryCTA: content.secondaryCTA || undefined, contactMode: "booking-placeholder" },
    graphics: { heroVisual, sectionVisuals: [heroVisual], useGeneratedImages: false },
  };
}
