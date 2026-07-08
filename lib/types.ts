export const TONES = [
  "Clear and practical",
  "Friendly and casual",
  "Professional and direct",
  "Premium but not hypey",
  "Student project style",
  "Local business style",
] as const;

export type Tone = (typeof TONES)[number];

export type LandingPageFormInput = {
  prompt: string;
  brandName: string;
  whatItDoes: string;
  targetAudience: string;
  mainProblem: string;
  mainBenefit: string;
  tone: Tone;
  primaryCTA: string;
  offerOrPricing: string;
  contactInfo: string;
};

export type VisualStyle =
  | "auto"
  | "local-business"
  | "saas"
  | "fitness"
  | "education"
  | "portfolio"
  | "agency"
  | "service"
  | "restaurant-cafe"
  | "personal-brand"
  | "default";

export type GraphicType =
  | "auto-service-dashboard"
  | "inspection-checklist"
  | "booking-card"
  | "saas-dashboard"
  | "workflow-nodes"
  | "fitness-progress"
  | "study-cards"
  | "local-business-card"
  | "portfolio-showcase"
  | "restaurant-menu"
  | "agency-grid"
  | "service-booking"
  | "personal-card"
  | "abstract-gradient"
  | "none";

export type BackgroundStyle =
  | "minimal"
  | "gradient"
  | "editorial"
  | "industrial"
  | "soft"
  | "premium";

export type FontChoice =
  | "modern"
  | "grotesk"
  | "editorial"
  | "rounded"
  | "tech";

export type RadiusChoice = "sharp" | "soft" | "rounded";

export type DensityChoice = "compact" | "balanced" | "airy";

export type DecorationChoice = "minimal" | "balanced" | "rich";

export type AestheticChoice = "studio" | "saas" | "bold" | "minimal";

export type ContactMode =
  | "email"
  | "phone"
  | "form-placeholder"
  | "booking-placeholder"
  | "none";

/* -------------------------------------------------------------------------- */
/* PageBlueprint                                                             */
/* -------------------------------------------------------------------------- */

export type HeroSection = {
  id: string;
  type: "hero";
  layout: "split-visual" | "centered" | "editorial" | "service-hero";
  eyebrow?: string;
  headline: string;
  subheadline: string;
  primaryCTA: string;
  secondaryCTA?: string;
  visual: GraphicType;
};

export type ValueStripSection = {
  id: string;
  type: "value-strip";
  layout: "row" | "chips";
  items: string[];
};

export type ServicesSection = {
  id: string;
  type: "services";
  layout: "grid" | "bento" | "service-list";
  eyebrow?: string;
  title: string;
  description?: string;
  services: { title: string; description: string }[];
};

export type ProblemSolutionSection = {
  id: string;
  type: "problem-solution";
  layout: "split" | "stacked";
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionDescription: string;
};

export type BenefitsSection = {
  id: string;
  type: "benefits";
  layout: "grid" | "row";
  eyebrow?: string;
  title?: string;
  benefits: { title: string; description: string }[];
};

export type FeaturesBentoSection = {
  id: string;
  type: "features";
  layout: "bento";
  eyebrow?: string;
  title?: string;
  features: { title: string; description: string }[];
};

export type ProcessSection = {
  id: string;
  type: "process";
  layout: "steps" | "timeline" | "cards";
  title: string;
  description?: string;
  steps: { title: string; description: string }[];
};

export type ShowcaseSection = {
  id: string;
  type: "showcase";
  layout: "gallery" | "browser" | "panel";
  eyebrow?: string;
  title?: string;
  description?: string;
};

export type PricingOfferSection = {
  id: string;
  type: "pricing-offer";
  layout: "single" | "cards";
  eyebrow?: string;
  title?: string;
  description?: string;
  offer: string;
};

export type ContactSection = {
  id: string;
  type: "contact";
  layout: "card" | "split";
  eyebrow?: string;
  title?: string;
  description?: string;
  contactMode: ContactMode;
  details?: string;
};

export type FAQSection = {
  id: string;
  type: "faq";
  eyebrow?: string;
  title?: string;
  faqs: { question: string; answer: string }[];
};

export type FinalCTASection = {
  id: string;
  type: "final-cta";
  headline: string;
  subheadline?: string;
  primaryCTA: string;
  secondaryCTA?: string;
};

export type FooterSection = {
  id: string;
  type: "footer";
  text: string;
};

export type PageSection =
  | HeroSection
  | ValueStripSection
  | ServicesSection
  | ProblemSolutionSection
  | BenefitsSection
  | FeaturesBentoSection
  | ProcessSection
  | ShowcaseSection
  | PricingOfferSection
  | ContactSection
  | FAQSection
  | FinalCTASection
  | FooterSection;

export type PageBlueprint = {
  meta: {
    brandName: string;
    industry: string;
    inferredAudience: string;
    pageGoal: string;
    visualStyle: VisualStyle;
    tone: string;
  };
  theme: {
    mode: "dark" | "light";
    paletteSource: "manual" | "logo" | "default";
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundStyle: BackgroundStyle;
    fontChoice: FontChoice;
    radius: RadiusChoice;
    density: DensityChoice;
    decoration: DecorationChoice;
    aesthetic: AestheticChoice;
  };
  navigation: {
    showNav: boolean;
    items: { label: string; targetId: string }[];
  };
  sections: PageSection[];
  ctaStrategy: {
    primaryCTA: string;
    secondaryCTA?: string;
    contactMode: ContactMode;
  };
  graphics: {
    heroVisual: GraphicType;
    sectionVisuals: GraphicType[];
    useGeneratedImages: boolean;
  };
};

/* -------------------------------------------------------------------------- */
/* Legacy content (kept for backward compatibility / converter)              */
/* -------------------------------------------------------------------------- */

export type LandingPageContent = {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  primaryCTA: string;
  secondaryCTA: string;
  problemTitle: string;
  problemDescription: string;
  solutionTitle: string;
  solutionDescription: string;
  benefits: string[];
  features: {
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  pricingOrOffer: string;
  contactText: string;
  footerText: string;
  imageSuggestions?: string[];
  photoKeywords?: string[];
};

export type SiteTheme = "dark" | "light";

export type LandingPageDesignInput = {
  logoDataUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  siteTheme: SiteTheme;
  photoUrls: string[];
  useLogoPalette: boolean;
  colorsCustomized?: boolean;
  useGeneratedImages?: boolean;
};

export const DEFAULT_DESIGN: LandingPageDesignInput = {
  logoDataUrl: undefined,
  primaryColor: "#f5f5f6",
  secondaryColor: "#2a2a31",
  accentColor: "#9b9ba6",
  siteTheme: "dark",
  photoUrls: [],
  useLogoPalette: false,
  colorsCustomized: false,
};

export const EMPTY_FORM_INPUT: LandingPageFormInput = {
  prompt: "",
  brandName: "",
  whatItDoes: "",
  targetAudience: "",
  mainProblem: "",
  mainBenefit: "",
  tone: "Clear and practical",
  primaryCTA: "",
  offerOrPricing: "",
  contactInfo: "",
};

/* -------------------------------------------------------------------------- */
/* Chat / planning types                                                      */
/* -------------------------------------------------------------------------- */

export type GenerationStatus =
  | "idle"
  | "thinking"
  | "asking"
  | "generating"
  | "ready"
  | "error";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  status?: "thinking" | "working" | "done" | "error";
  kind?: "thought" | "work" | "summary";
};

export type ClarifyingQuestion = {
  id: string;
  question: string;
  recommendedOption?: string;
  options: string[];
  allowCustomAnswer: boolean;
};

export type PlanningResult = {
  shouldAskQuestions: boolean;
  confidence: "low" | "medium" | "high";
  inferred: {
    brandName?: string;
    businessType?: string;
    targetAudience?: string;
    primaryCTA?: string;
    tone?: string;
    visualStyle?: string;
  };
  questions: ClarifyingQuestion[];
};

export type ClarifyingAnswer = {
  questionId: string;
  question: string;
  answer: string;
};
