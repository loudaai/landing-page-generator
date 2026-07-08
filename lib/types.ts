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
  | "service"
  | "default";

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

export type ClarifyingAnswer = {
  questionId: string;
  question: string;
  answer: string;
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
