export interface Article {
  id: string
  title: string
  description: string | null | undefined
  content: string | null | undefined
  updated_on: string | null | undefined
  slug: string | null | undefined
  tags: string[]
  isPaginationPage: boolean
}

export type NotionArticle = {
  id: string
  slug: string | null | undefined
  title: string
  description: string | null | undefined
  content: string | null | undefined
  updated_on: string | null | undefined
  tags: string[]
}
