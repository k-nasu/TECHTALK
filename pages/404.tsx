import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata:Metadata = {
  title: '404'
}

const NotFound = () => {
  return (
    <div className="container w-full h-full mx-auto font-sans">
      <main className="container w-full mt-16">
        <h3 className="text-5xl font-medium text-center mb-8">ページが見つかりませんでした</h3>
        <Link href="/" className="text-lg pb-20 block mt-10 text-blue-600 text-center"><span>⇦ ホームに戻る</span></Link>
      </main>
    </div>
  )
}

export default NotFound

