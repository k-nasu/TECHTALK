import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import SingleArticle from '@/components/Article/SingleArticle'
import { Article } from '@/types'
import { Dialog } from '@headlessui/react'
import { Fragment } from 'react'

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const observer = useRef<IntersectionObserver>()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const lastArticleRef = useCallback((node: HTMLDivElement) => {
    if (isSearching) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1)
      }
    })

    if (node) observer.current.observe(node)
  }, [isSearching, hasMore])

  const fetchSearchResults = async (query: string, pageNum: number) => {
    setIsSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&page=${pageNum}`)
      const data = await res.json()

      if (pageNum === 1) {
        setResults(data.articles)
      } else {
        setResults(prev => [...prev, ...data.articles])
      }

      setTotalResults(data.total)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error('検索エラー:', error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (router.query.q) {
      setSearchQuery(router.query.q as string)
      setPage(1)
    }
  }, [router.query.q])

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchResults(searchQuery, page)
    }
  }, [searchQuery, page])
  // モーダルを閉じたときの処理
  const handleClose = useCallback(() => {
    setIsOpen(false)
    router.push('/', undefined, { shallow: true })
  }, [router])

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [handleClose])

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl rounded-2xl bg-white p-6">
          {/* 閉じるボタン */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-all hover:scale-110"
            aria-label="検索を閉じる"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* 検索入力フィールド */}
          <div className="mb-8">
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              placeholder="キーワードを入力..."
              className="w-full px-6 py-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              autoFocus
            />
          </div>

          {/* 検索結果 */}
          <div className="max-h-[70vh] overflow-y-auto">
            {results.length > 0 ? (
              <div>
                <Dialog.Title className="text-xl font-semibold mb-8 text-center text-gray-800">
                  「<span className="text-blue-600">{searchQuery}</span>」の検索結果: {totalResults}件
                </Dialog.Title>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((article, index) => (
                    <div
                      key={article.id}
                      ref={index === results.length - 1 ? lastArticleRef : undefined}
                      className="h-full"
                    >
                      <SingleArticle
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        content={article.content ?? ''}
                        description={article.description ?? ''}
                        updated_on={article.updated_on ?? ''}
                        slug={article.slug ?? ''}
                        tags={article.tags}
                        isPaginationPage={true}
                      />
                    </div>
                  ))}
                </div>
                {isSearching && (
                  <div className="text-center mt-8 text-gray-600">
                    <div className="animate-pulse">読み込み中...</div>
                  </div>
                )}
              </div>
            ) : searchQuery.trim() !== '' && !isSearching ? (
              <div className="text-center text-gray-600">
                「<span className="text-blue-600">{searchQuery}</span>」に一致する記事が見つかりませんでした
              </div>
            ) : null}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default SearchModal
