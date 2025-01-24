export interface Article {
  title: string;
  slug: string;
  content: string;
  id: string;
  description: string;
  updated_on: string;
  tags: string[];
  isPaginationPage?: boolean;
  // 他の必要なプロパティをここに追加
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
