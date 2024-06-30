import Image from 'next/image'
import { getAllTags, getArticlesForTopPage } from '@/lib/notionAPI'
import SingleArticle from '@/components/Article/SingleArticle'
import { Article } from '@/types/types'
import Link from 'next/link'
import { INITIAL_PAGE_ARTICLE_SIZE } from '@/constants/constants'
import Programmer from '@/public/programmer.png'
import { REVALIDATE_INTERVAL } from '@/constants/constants'
import Tag from '@/components/Tag/Tag'

type Props = {
  articles: Article[]
  tags: string[]
}

export const getStaticProps = async () => {
  const articles = await getArticlesForTopPage(INITIAL_PAGE_ARTICLE_SIZE)
  const allTags = await getAllTags()
  const tags = allTags.sort()

  return {
    props: {
      articles,
      tags
    },
    revalidate: REVALIDATE_INTERVAL
  }
}

export default function Home({ articles, tags }: Props) {
  return (
    <div>
      <div className="lg:w-4/5 mx-auto mb-10 h-full lg:flex">
        <main className="order-2 container lg:basis-2/4 lg:mx-5 px-4 mt-16">
          <section>
            <h3 className="mb-5">トレンドの記事</h3>
            {articles.map(article => (
              <div key={article.id}>
                <SingleArticle
                  id={article.id}
                  title={article.title}
                  description={article.description}
                  updated_on={article.updated_on}
                  slug={article.slug}
                  tags={article.tags}
                  isPaginationPage={false}
                />
              </div>
            ))}
            <Link
              href="/articles/page/1"
              className="text-blue-600 mb-20 mx-auto pt-5 px-5 block text-right"
            >
              一覧を見る
            </Link>
          </section>
          <section>
            {/* ・別のまとめ方を出す
              例：技術ジャンルごと（Rails特集・Typescript特集）、個人開発の各フェーズ（初学者向け、中級者・上級者）、個人開発、ポートフォリオ、分野別（デザイン、インフラ、フロント、バックエンド） */}
          </section>
        </main>
        <aside className="order-1 lg:basis-1/4 px-4 lg:mt-16 pt-4 shadow-md inline-block h-full">
          <h4 className="font-medium mb-8">タグ検索</h4>
          <div className="flex flex-wrap gap-3 pb-8">
            {tags.map((tag: string, index: number) => (
              <Link key={index} href={`/articles/tag/${tag}/page/1`}>
                <Tag tag={tag} />
              </Link>
            ))}
          </div>
        </aside>
        <aside className="order-3 lg:basis-1/4 px-4 pt-16">
          {/* ここに広告を出す */}
        </aside>
      </div>
      {/* <div className="lg:mx-auto mb-20 flex items-center lg:justify-between lg:w-2/5"> */}
      {/* <h4 className="text-  4xl text-indigo-400">ちょっと休憩......</h4> */}
      <div className="mx-auto lg:w-2/5 mb-20">
        <Image
          src={Programmer}
          alt="プログラマーの画像"
          className="w-72 h-72"
        />
      </div>
      {/* </div> */}
    </div>
  )
}
