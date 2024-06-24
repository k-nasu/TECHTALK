import { getArticlesByPage, getPageNumbers } from "@/lib/notionAPI";
import SingleArticle from "@/components/Article/SingleArticle";
import Pagination from "@/components/Pagination/Pagination";
import { Article } from "@/types/types";

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
    <div className="container lg:w-4/5 h-full mx-auto font-sans">
      <main className="container w-full mt-16">
        <h2 className="font-medium text-center mb-16">トレンドの記事</h2>
        <section className="sm:grid grid-cols-2 mx-4 mb-10 gap-3">
          {articles.map(article => (
            <SingleArticle
              key={article.id}
              id={article.id}
              title={article.title}
              description={article.description}
              updated_on={article.updated_on}
              slug={article.slug}
              tags={article.tags}
              isPaginationPage={true}
            />
          ))}
        </section>
        <Pagination pageNumbers={pageNumbers} currentPage={currentPage} />
      </main>
    </div>
  );
}

export default pageList
