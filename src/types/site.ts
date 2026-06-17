export interface SiteConfig {
  // Identity
  id: string;
  name: string;
  domain: string;
  tagline: string;
  subTagline: string;
  revamprMedium: string;
  sourceParam: string;

  // Co-branding
  headerBrand: string;
  footerPoweredBy: string;

  // Funnel
  freeRenderLimit: number;
  renderWall: {
    headline: string;
    body: string;
    ctaText: string;
    ctaUrl: string;
  };

  // Color swatches (Simple Mode — primary selection)
  colorSwatches: ColorSwatch[];

  // Material cards (Pro Mode — secondary selection)
  materials: MaterialCard[];

  // Pro Mode advanced options
  advancedOptions: AdvancedOptionGroup[];

  // Content
  heroBeforeImage: string;
  heroAfterImage: string;
  galleryItems: GalleryItem[];
  faqItems: FAQItem[];
  howItWorks: HowItWorksStep[];
  whyVisualize: WhyVisualizeBlock[];

  // SEO pages
  seoPages: SEOPageConfig[];

  // Theme
  theme: ThemeConfig;
}

export interface ColorSwatch {
  id: string;
  name: string;
  textureUrl: string;           // circular texture swatch image
  promptValue: string;          // value injected into Gemini prompt
}

export interface MaterialCard {
  id: string;
  name: string;
  textureUrl: string;           // material closeup texture image
  description: string;          // one-line description for tooltip/subtext
  promptValue: string;          // value injected into Gemini prompt
}

export interface AdvancedOptionGroup {
  id: string;
  label: string;
  helperText: string;
  type: 'single-select';
  defaultValue: string | null;
  options: AdvancedOption[];
}

export interface AdvancedOption {
  id: string;
  label: string;
  promptValue: string;
}

export interface GalleryItem {
  id: string;
  beforeUrl: string;
  afterUrl: string;
  colorName: string;
  altText: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  icon: string;
  title: string;
  description: string;
}

export interface WhyVisualizeBlock {
  headline: string;
  body: string;
}

export interface SEOPageConfig {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
}

export interface ThemeConfig {
  heroBackground: string;
  heroTextColor: string;
  heroSubTextColor: string;
}
