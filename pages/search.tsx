import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Article } from '@/types'
import { Dialog } from '@headlessui/react'
import SingleArticle from '@/components/Article/SingleArticle'

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.articles)
      setTotalResults(data.total)
    } catch (error) {
      console.error('検索エラー:', error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    if (router.query.q) {
      const query = router.query.q as string
      setSearchQuery(query)
      fetchSearchResults(query)
    }
  }, [router.query.q])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    router.push('/', undefined, { shallow: true })
  }, [router])

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
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-start justify-center pt-16 px-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-xl shadow-xl transform transition-all">
          <div className="relative">
            <div className="p-4 bg-white/80 backdrop-blur-sm rounded-t-xl">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    fetchSearchResults(e.target.value)
                  }}
                  placeholder="キーワードを入力..."
                  className="w-full h-12 pl-12 pr-12 text-lg bg-white/60 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoFocus
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setResults([])
                      setTotalResults(0)
                      searchInputRef.current?.focus()
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                    aria-label="検索をクリア"
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
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 p-2.5 rounded-lg bg-white/80 backdrop-blur hover:bg-white text-gray-700 transition-all"
              aria-label="モーダルを閉じる"
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="px-4 pb-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {results.length > 0 ? (
                <div>
                  <Dialog.Title className="text-xl text-center mb-6">
                    「<span className="text-primary font-medium">{searchQuery}</span>」の検索結果: {totalResults}件
                  </Dialog.Title>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {results.map((article) => (
                      <article
                        key={article.id}
                        className="group bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-xl p-4 md:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-gray-100"
                      >
                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {article.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim() !== '' && !isSearching ? (
                <div className="text-center py-12 text-gray-600">
                  「<span className="text-primary font-medium">{searchQuery}</span>」に一致する記事が見つかりませんでした
                </div>
              ) : null}
              {isSearching && (
                <div className="text-center py-12 text-gray-600">
                  <div className="animate-pulse">読み込み中...</div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default SearchModal
