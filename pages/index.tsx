import Image from "next/image";
import { getArticlesForTopPage } from "@/lib/notionAPI";
import SingleArticle from "@/components/Article/SingleArticle";
import { Article } from "@/types/types";
import Link from "next/link";
import { INITIAL_PAGE_ARTICLE_SIZE } from "@/constants/constants"
import Programmer from "@/public/programmer.png"
import { REVALIDATE_INTERVAL } from '@/constants/constants'

type Props = {
  articles: Article[]
};

export const getStaticProps = async () => {
  const articles = await getArticlesForTopPage(INITIAL_PAGE_ARTICLE_SIZE);

  return {
    props: {
      articles,
    },
    revalidate: REVALIDATE_INTERVAL,
  };
};

export default function Home({ articles }: Props) {
  return (
    <div>
      <div className="lg:w-4/5 mx-auto mb-10 h-full lg:flex">
        <aside className="lg:basis-1/4 px-4 pt-16">
          {/* ここにタグの一覧を出す */}
        </aside>
        <main className="container lg:basis-2/4 lg:mx-5 px-4 lg:pt-16">
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
            <Link href="/articles/page/1" className="text-blue-600 mb-20 mx-auto pt-5 px-5 block text-right">一覧を見る</Link>
          </section>
          <section>
            {/* ・別のまとめ方を出す
              例：技術ジャンルごと（Rails特集・Typescript特集）、個人開発の各フェーズ（初学者向け、中級者・上級者）、個人開発、ポートフォリオ、分野別（デザイン、インフラ、フロント、バックエンド） */}
          </section>
        </main>
        <aside className="lg:basis-1/4 px-4 pt-16">
          {/* ここに広告を出す */}
        </aside>
      </div>
      {/* <div className="lg:mx-auto mb-20 flex items-center lg:justify-between lg:w-2/5"> */}
        {/* <h4 className="text-  4xl text-indigo-400">ちょっと休憩......</h4> */}
      <div className="mx-auto lg:w-2/5 mb-20">
        <Image src={Programmer} alt="プログラマーの画像" className="w-72 h-72" />
      </div>
      {/* </div> */}
    </div>
  );
}
