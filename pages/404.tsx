import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404'
}

export default function Custom404() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      {/* イラストエリア */}
      <div className="w-64 h-64 mb-8 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-full h-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      {/* テキストエリア */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">
          404 - ページが見つかりません
        </h1>
        <p className="text-secondary mb-8 max-w-md">
          お探しのページは削除されたか、URLが変更された可能性があります。
        </p>
      </div>

      {/* アクションエリア */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="
            px-6 py-3 rounded-full
            bg-primary text-white
            hover:bg-primary-dark
            transition-colors duration-200
            shadow-lg hover:shadow-xl
            flex items-center justify-center gap-2
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          ホームに戻る
        </Link>
        <button
          onClick={() => window.history.back()}
          className="
            px-6 py-3 rounded-full
            bg-surface text-primary
            hover:bg-gray-50
            transition-colors duration-200
            shadow-lg hover:shadow-xl
            border border-gray-200
            flex items-center justify-center gap-2
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
          前のページに戻る
        </button>
      </div>
    </div>
  )
}
