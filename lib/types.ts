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
};

export const DEFAULT_DESIGN: LandingPageDesignInput = {
  logoDataUrl: undefined,
  primaryColor: "#e5e5e5",
  secondaryColor: "#3f3f46",
  accentColor: "#a1a1aa",
  siteTheme: "dark",
  photoUrls: [],
  useLogoPalette: false,
};

export const EMPTY_FORM_INPUT: LandingPageFormInput = {
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
