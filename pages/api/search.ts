import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllArticles } from '@/lib/notionAPI'

const ITEMS_PER_PAGE = 30

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q, page = '1' } = req.query
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: '検索クエリが必要です' })
  }

  try {
    const articles = await getAllArticles()
    const searchResults = articles.filter(article => {
      const searchText = `${article.title} ${article.description || ''} ${article.tags.join(' ')}`.toLowerCase()
      return searchText.includes(q.toLowerCase())
    })

    // ページネーション
    const currentPage = parseInt(page as string, 10)
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    const paginatedResults = searchResults.slice(start, end)

    res.status(200).json({
      articles: paginatedResults,
      total: searchResults.length,
      hasMore: end < searchResults.length
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ error: '検索中にエラーが発生しました' })
  }
}
