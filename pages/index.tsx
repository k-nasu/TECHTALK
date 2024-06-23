import { Inter } from "next/font/google";
import { getAllPosts } from "@/lib/notionAPI";
import SinglePost from "@/components/Post/SinglePost";

export const getStaticProps = async () => {
  const allPosts = await getAllPosts();

  return {
    props: {
      allPosts,
    },
    revalidate: 60 * 60,
  };
};

export default function Home({ allPosts }) {
  return (
    <div className="container w-full h-full mx-auto font-sans">
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Tech blog</h1>
        {allPosts.map(post => (
          <div key={post.id} className="mx-4">
            <SinglePost
              title={post.title}
              description={post.description}
              updated_on={post.updated_on}
              slug={post.slug}
              tags={post.tags}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
