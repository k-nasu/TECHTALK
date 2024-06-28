import { getArticlesByPage, getPageNumbers } from "@/lib/notionAPI";
import { Article } from "@/types/types";
import ArticleList from '@/components/Article/ArticleList'
import { REVALIDATE_INTERVAL } from '@/constants/constants'
import Pagination from '@/components/Pagination/Pagination'
import Head from 'next/head';
import { SERVICE_NAME } from "@/constants/constants"

type Props = {
  articles: Article[];
  pageNumbers: number;
  currentPage: number;
  paginationLink: string
};

export const getStaticPaths = async () => {
  const pageNumbers = await getPageNumbers()

  let params = []
  for (let i = 1; i <= pageNumbers; i++) {
    params.push({ params: { page: i.toString() }})
  }

  return {
    paths: params,
    fallback: false
  }
}

export const getStaticProps = async (context: any) => {
  const articles = await getArticlesByPage(context.params.page);
  const pageNumbers = await getPageNumbers();
  const currentPage = context.params.page;
  const paginationLink = "articles/page"

  return {
    props: {
      articles,
      pageNumbers,
      currentPage,
      paginationLink
    },
    revalidate: REVALIDATE_INTERVAL,
  };
};

const pageList = ({ articles, pageNumbers, currentPage, paginationLink }: Props ) => {
  return (
    <>
      <Head>
        <title>{SERVICE_NAME} | トレンドの記事一覧</title>
      </Head>
      <main className="container lg:w-4/5 h-full mx-auto mt-16">
        <h2 className="font-medium text-center mb-16">トレンドの記事</h2>
        <ArticleList articles={articles} />
        <Pagination pageNumbers={pageNumbers} currentPage={currentPage} paginationLink={paginationLink} />
      </main>
    </>
  );
}

export default pageList
