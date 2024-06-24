import React from 'react'
import { getAllArticles, getSingleArticle } from '@/lib/notionAPI'
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
  const allArticles = await getAllArticles();
  const paths = allArticles.map(({slug}) => ({ params: { slug } }))
  console.log(paths)

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }: any) => {
  const article = await getSingleArticle(params.slug)

  return {
    props: {
      article
    },
    revalidate: 60 * 60
  }
}

const Article = ({ article }: any) => {
  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-3/5 mx-auto mt-20">
      <h1 className="w-full text-5xl font-bold pb-2 mb-6">{article.metadata.title}</h1>
      {article.metadata.tags.map((tag: string, index: number) => (
        <Tag key={index} tag={tag} />
      ))}
      <br/>
      <span className="text-sm text-blue-700 inline-block mt-4">更新日：{article.metadata.updated_on}</span>
      <div className="mt-20 text-lg">
        {
          article.markdown ?
          <ReactMarkdown
            components={{
              code: CodeBlock,
              h2: ({ children }) => <h2 className="text-4xl pb-2 mt-24 mb-10 font-bold border-b-2 border-blue-400">{children}</h2>,
              h3: ({ children }) => <h3 className="text-2xl font-bold mb-5">{children}</h3>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-16">{children}</ol>,
              ul: ({ children }) => <ul className="mb-16 ml-4 list-disc">{children}</ul>,
              li: ({ children }) => <li className="mb-6">{children}</li>,
              p: ({ children }) => <p className="my-6 leading-8">{children}</p>,
              a: ({ children, href }) => <Link href={href!} rel="noopener noreferrer" target="_blank" className="text-blue-600">{children}</Link>,
              pre: ({ children }) => <pre className="mb-10">{children}</pre>,
            }}
          >
            {article.markdown}
          </ReactMarkdown>
          : "記事準備中"
        }
        <Link href="/articles/page/1" className="block mt-20 pb-20 text-blue-600 text-right"><span>記事一覧を見る</span></Link>
      </div>
    </section>
  )
}

export default Article

