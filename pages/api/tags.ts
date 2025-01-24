import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllTags } from '@/lib/notionAPI'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const tags = await getAllTags()
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')
    return res.status(200).json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
