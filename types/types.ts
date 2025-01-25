export interface Article {
  id: string
  title: string
  description: string | undefined
  content: string | undefined
  updated_on: string | undefined
  slug: string | undefined
  tags: string[] | undefined
  isPaginationPage: boolean
}

export type NotionArticle = {
  id: string
  slug: string | undefined
  title: string
  description: string | undefined
  content: string | undefined
  updated_on: string | undefined
  tags: string[]
}
