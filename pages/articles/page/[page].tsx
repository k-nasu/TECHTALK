import { getArticlesByPage, getPageNumbers } from "@/lib/notionAPI";
import { Article } from "@/types/types";
import ArticleList from '@/components/Article/ArticleList'

type Props = {
  articles: Article[];
  pageNumbers: number;
  currentPage: number;
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

  return {
    props: {
      articles,
      pageNumbers,
      currentPage,
    },
    revalidate: 60 * 60,
  };
};

const pageList = ({ articles, pageNumbers, currentPage}: Props ) => {
  return (
    <ArticleList articles={articles} pageNumbers={pageNumbers} currentPage={currentPage} />
  );
}

export default pageList
