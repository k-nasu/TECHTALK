import { getPostsByPage, getPageNumber } from "@/lib/notionAPI";
import SinglePost from "@/components/Post/SinglePost";
import Pagination from "@/components/Pagination/Pagination";
import { Post } from "@/types/types";

type Props = {
  posts: Post[]
};

export const getStaticPaths = async () => {
  const postNumberPerPages = await getPageNumber()

  let params = []
  for (let i = 1; i <= postNumberPerPages; i++) {
    params.push({ params: { page: i.toString() }})
  }

  return {
    paths: params,
    fallback: false
  }
}

export const getStaticProps = async (context: any) => {
  const posts = await getPostsByPage(context.params.page);
  const pageNumbers = await getPageNumber()
  console.log(pageNumbers)

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
    <div className="container w-full h-full mx-auto font-sans">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">TECH TALK</h1>
        <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
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
