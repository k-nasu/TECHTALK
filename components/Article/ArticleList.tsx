import SingleArticle from '@/components/Article/SingleArticle'
import { Article } from '@/types/types'

type Props = {
  articles: Article[]
}

const ArticleList = ({ articles }: Props) => {
  return (
    <section className="sm:grid grid-cols-2 mx-4 mb-10 gap-3">
      {articles.map(article => (
        <SingleArticle
          key={article.id}
          id={article.id}
          title={article.title}
          content={article.content}
          description={article.description}
          updated_on={article.updated_on}
          slug={article.slug}
          tags={article.tags}
          isPaginationPage={true}
        />
      ))}
    </section>
  )
}

export default ArticleList
