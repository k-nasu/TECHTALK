import { getPostsByPage, getPageNumbers } from "@/lib/notionAPI";
import SinglePost from "@/components/Post/SinglePost";
import Pagination from "@/components/Pagination/Pagination";
import { Post } from "@/types/types";

type Props = {
  posts: Post[]
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
  const posts = await getPostsByPage(context.params.page);
  const pageNumbers = await getPageNumbers()

  return {
    props: {
      posts,
      pageNumbers
    },
    revalidate: 60 * 60,
  };
};

const pageList = ({ posts, pageNumbers} ) => {
  return (
    <div className="container lg:w-4/5 h-full mx-auto font-sans">
      <main className="container w-full mt-16">
        <h2 className="font-medium text-center mb-16">トレンドの記事</h2>
        <section className="sm:grid grid-cols-2 mx-4 gap-3">
          {posts.map(post => (
            <SinglePost
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              updated_on={post.updated_on}
              slug={post.slug}
              tags={post.tags}
              isPaginationPage={true}
            />
          ))}
        </section>
        <Pagination pageNumbers={pageNumbers} />
      </main>
    </div>
  );
}

export default pageList
