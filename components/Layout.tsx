import React from 'react'
import Navbar from './Navbar/Navbar'
import { Metadata } from 'next'
import { SERVICE_NAME } from "@/constants/constants"

export const metadata: Metadata = {
  title: `%s | ${SERVICE_NAME}のトップページです`,
  description: '最新技術情報や実践的な解説を提供するエンジニア向けのテックブログです。プログラミング、クラウドコンピューティング、AI、データサイエンスなど、幅広い分野をカバーしています。各記事は、初心者から上級者まで、あらゆるレベルの読者にとって役立つ内容となっています。最新の技術トレンドや業界ニュースをタイムリーにお届けすることで、読者の知識をアップデートし、スキル向上をサポートします。また、具体的なコード例や図解を用いて、理解しやすい解説を心がけています。技術の最前線で活躍するための知識と洞察を、このブログで手に入れてください。',
  openGraph: {
    title: `${SERVICE_NAME}のトップページです`,
    description: '最新技術情報や実践的な解説を提供するエンジニア向けのテックブログです。プログラミング、クラウドコンピューティング、AI、データサイエンスなど、幅広い分野をカバーしています。各記事は、初心者から上級者まで、あらゆるレベルの読者にとって役立つ内容となっています。最新の技術トレンドや業界ニュースをタイムリーにお届けすることで、読者の知識をアップデートし、スキル向上をサポートします。また、具体的なコード例や図解を用いて、理解しやすい解説を心がけています。技術の最前線で活躍するための知識と洞察を、このブログで手に入れてください。',
    // url: 'https://example.com',
    siteName: SERVICE_NAME,
    // images: ['/image.jpg'],
    locale: 'en_US',
    type: 'website',
  },
}

const Layout = ({ children }: any) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  )
}

export default Layout
