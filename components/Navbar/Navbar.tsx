import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SERVICE_NAME } from '@/constants/constants'
import { useRouter } from 'next/router'
import { Article } from '@/types'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Article[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchArticles = async () => {
      if (searchQuery.trim().length === 0) {
        setSuggestions([])
        return
      }

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setSuggestions(data)
      } catch (error) {
        console.error('検索エラー:', error)
      }
    }

    const debounceTimer = setTimeout(searchArticles, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // スクロール方向を判定
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        // 上にスクロール、または先頭付近ではヘッダーを表示
        setIsVisible(true)
      } else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        // 下にスクロール かつ 100px以上スクロールしている場合は非表示
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSuggestions(false)
    }
  }

  const handleArticleClick = (slug: string) => {
    setShowSuggestions(false)
    setSearchQuery('')
    router.push(`/articles/${slug}`)
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm
        transition-transform duration-300
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
      `}
    >
      <div className="container px-4 lg:w-4/5 mx-auto h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-medium text-primary">
          {SERVICE_NAME}
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 px-4 py-2 text-secondary hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
