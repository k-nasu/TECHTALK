import React from 'react'
import { getAllPosts, getSinglePost } from '@/lib/notionAPI'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ inline, className, children }: any) => {
  if (inline) {
    return <code className={className}>{children}</code>;
  }
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1] ? match[1] : '';
  return (
    <SyntaxHighlighter
      style={a11yDark}
      language={lang}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};

export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  const paths = allPosts.map(({slug}) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: any) => {
  const post = await getSinglePost(params.slug)

  return {
    props: {
      post
    },
    revalidate: 60 * 60
  }
}

const Post = ({ post }) => {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium ">{post.metadata.title}</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">更新日：{post.metadata.updated_on}</span>
      <br />
      {post.metadata.tags.map((tag: string) => (
        // eslint-disable-next-line react/jsx-key
        <p className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2">
          {tag}
        </p>
      ))}
      <div className="mt-10 font-medium">
        <ReactMarkdown components={{ code: CodeBlock }}>{post.markdown}</ReactMarkdown>
      </div>
    </section>
  )
}

export default Post

