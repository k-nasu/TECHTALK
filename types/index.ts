export interface Article {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  updated_on?: string | null;
  slug?: string | null;
  tags: string[];
  isPaginationPage: boolean;
}

export type TechCategory = {
  id: string;
  name: string;
  description: string;
  articles: Article[];
}

export const TECH_CATEGORIES = {
  RAILS: 'rails',
  TYPESCRIPT: 'typescript',
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  INFRASTRUCTURE: 'infrastructure',
  DESIGN: 'design',
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  PORTFOLIO: 'portfolio',
} as const;
