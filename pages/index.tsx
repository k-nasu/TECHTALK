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
    <div className="font-sans lg:w-4/5 mx-auto h-full lg:flex">
      <aside className="lg:basis-1/4 px-4 pt-16">
        {/* タグ */}
      </aside>
      <main className="container lg:basis-2/4 lg:mx-5 px-4 pt-16">
        <h3 className="mb-5">トレンドの記事</h3>
        {posts.map(post => (
          <div key={post.id}>
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
        <Link href="/posts/page/1" className="text-blue-600 mb-20 mx-auto pt-5 px-5 block text-right">一覧を見る</Link>
      </main>
      <aside className="lg:basis-1/4 px-4 pt-16">

      </aside>
    </div>
  );
}
