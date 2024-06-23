import { getPostsForTopPage } from "@/lib/notionAPI";
import SinglePost from "@/components/Post/SinglePost";
import { Post } from "@/types/types";
import Link from "next/link";
import { PAGE_SIZE } from "@/constants/constants"

type Props = {
  posts: Post[]
};

export const getStaticProps = async () => {
  const posts = await getPostsForTopPage(PAGE_SIZE);

  return {
    props: {
      posts,
    },
    revalidate: 60 * 60,
  };
};

export default function Home({ posts }: Props) {
  return (
    <div className="container w-full h-full mx-auto font-sans">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">TECH TALK</h1>
        {posts.map(post => (
          <div key={post.id} className="mx-4">
            <SinglePost
              id={post.id}
              title={post.title}
              description={post.description}
              updated_on={post.updated_on}
              slug={post.slug}
              tags={post.tags}
              isPaginationPage={false}
            />
          </div>
        ))}
        <Link href="/posts/page/1" className="mb-6 lg:w-1/2 mx-auto px-5 block text-right">...もっと見る</Link>
      </main>
    </div>
  );
}
