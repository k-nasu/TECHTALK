import React from 'react'
import { getAllPosts, getSinglePost } from '@/lib/notionAPI'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';
import Tag from '@/components/Tag/Tag';

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
      <h2 className="w-full text-4xl font-bold border-b-2 pb-2 mb-6">{post.metadata.title}</h2>
      {post.metadata.tags.map((tag: string, index: number) => (
        <Tag key={index} tag={tag} />
      ))}
      <br/>
      <span className="text-sm text-gray-500 inline-block mt-3">更新日：{post.metadata.updated_on}</span>
      <div className="mt-24 font-medium text-lg">
        {
          post.markdown ?
          <ReactMarkdown components={{ code: CodeBlock }}>{post.markdown}</ReactMarkdown>
          : "記事準備中"
        }
        <Link href="/" className="pb-20 block mt-10 text-blue-600"><span>⇦ ホームに戻る</span></Link>
      </div>
    </section>
  )
}

export default Post

