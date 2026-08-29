export type ToolCategory = 
  | 'json' 
  | 'image' 
  | 'text' 
  | 'developer' 
  | 'pdf' 
  | 'qr';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  shortDescription: string;
  description: string;
  iconName: string;
  color: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  input: string;
  output: string;
  description?: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  category: ToolCategory;
  shortDescription: string;
  iconName: string;
  route: string;
  isPopular?: boolean;
  isNew?: boolean;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  h1: string;
  intro: string;
  whatIsTitle: string;
  whatIsContent: string;
  howToUseSteps: string[];
  features: string[];
  examples?: ToolExample[];
  privacyNote: string;
  faqs: FaqItem[];
  relatedToolSlugs: string[];
}

export interface SiteConfig {
  siteName: string;
  tagline: string;
  siteUrl: string;
  contactEmail: string;
  githubUrl: string;
  adsEnabled: boolean;
  analyticsEnabled: boolean;
}
