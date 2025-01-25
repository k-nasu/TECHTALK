import { NextApiRequest, NextApiResponse } from 'next'
import { getTags } from '@/lib/notionAPI'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
    return
  }

  try {
    const tags = await getTags()
    res.status(200).json(tags)
  } catch (error) {
    console.error('Error in /api/tags:', error)
    res.status(500).json([])
  }
}
