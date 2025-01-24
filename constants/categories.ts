import { TECH_CATEGORIES } from '@/types'

export const CATEGORY_INFO = {
  [TECH_CATEGORIES.RAILS]: {
    name: 'Rails特集',
    description: 'Ruby on Railsに関する記事をまとめています',
    icon: '🚂',
  },
  [TECH_CATEGORIES.TYPESCRIPT]: {
    name: 'TypeScript特集',
    description: 'TypeScriptの基礎から応用までの記事をまとめています',
    icon: '📘',
  },
  [TECH_CATEGORIES.FRONTEND]: {
    name: 'フロントエンド開発',
    description: 'フロントエンド開発に関する技術記事をまとめています',
    icon: '🎨',
  },
  [TECH_CATEGORIES.BACKEND]: {
    name: 'バックエンド開発',
    description: 'バックエンド開発に関する技術記事をまとめています',
    icon: '⚙️',
  },
  [TECH_CATEGORIES.INFRASTRUCTURE]: {
    name: 'インフラ',
    description: 'インフラストラクチャに関する記事をまとめています',
    icon: '🏗️',
  },
  [TECH_CATEGORIES.DESIGN]: {
    name: 'デザイン',
    description: 'UIデザインやUXに関する記事をまとめています',
    icon: '🎯',
  },
  [TECH_CATEGORIES.BEGINNER]: {
    name: '初学者向け',
    description: 'プログラミング初学者向けの記事をまとめています',
    icon: '🌱',
  },
  [TECH_CATEGORIES.INTERMEDIATE]: {
    name: '中級者・上級者向け',
    description: 'より深い技術的な知識を扱う記事をまとめています',
    icon: '🚀',
  },
  [TECH_CATEGORIES.PORTFOLIO]: {
    name: 'ポートフォリオ',
    description: 'ポートフォリオ制作に関する記事をまとめています',
    icon: '💼',
  },
} as const
