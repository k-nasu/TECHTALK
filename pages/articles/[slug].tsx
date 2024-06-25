import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { getAllArticles, getSingleArticle } from '@/lib/notionAPI'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Link from 'next/link';
import Tag from '@/components/Tag/Tag';
// import type { ClassAttributes, HTMLAttributes } from 'react'
// import type { ExtraProps } from 'react-markdown'

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

// const H2 = ({
//   node,
//   children,
// }: ClassAttributes<HTMLHeadingElement> &
//   HTMLAttributes<HTMLHeadingElement> &
//   ExtraProps) => {
//   const title =
//     node?.children[0] && 'value' in node?.children[0]
//       ? node?.children[0].value
//       : ''
//   return (
//     <h2>
//       <a id={title} href={`#${title}`}>
//         {children}
//       </a>
//     </h2>
//   )
// }

// const TocH2 = ({
//   node,
// }: ClassAttributes<HTMLHeadingElement> &
//   HTMLAttributes<HTMLHeadingElement> &
//   ExtraProps) => {
//   const title =
//     node?.children[0] && 'value' in node?.children[0]
//       ? node?.children[0].value
//       : ''
//   return (
//     <li key={title}>
//       <a href={`#${title}`}>{title}</a>
//     </li>
//   )
// }

export const getStaticPaths = async () => {
  const allArticles = await getAllArticles();
  const paths = allArticles.map(({slug}) => ({ params: { slug } }))

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

export async function generateMetadata({ params }: any, parent?: ResolvingMetadata): Promise<Metadata> {
  const article = await getSingleArticle(params.slug)
  // const previousImages = (await parent).openGraph?.images || []

  return {
    title: article.metadata.title,
    description: article.metadata.description,
    // openGraph: {
    //   images: ['/image.jpg', ...previousImages],
    // },
  }
}

const Article = ({ article }: any) => {
  // const H2 = ({
  //       node
  //   }: ClassAttributes<HTMLHeadingElement> & HTMLAttributes<HTMLHeadingElement> & ExtraProps) => {
  //       const text = typeof node !== "undefined" && node.children.length > 0 && "value" in node.children[0]
  //           ? node?.children[0]["value"]
  //           : "";
  //       return <h2 id={text} >
  //           {text}
  //       </h2>
  //   }

  // const topLink = ({ node }) => {
  //     const text = typeof node !== "undefined" && node.children.length > 0 && "value" in node.children[0]
  //         ? node?.children[0]["value"]
  //         : "";
  //     return <h2>
  //         <a href={`#${text}`}>{`・${text}`}</a>
  //     </h2>
  // }

  const H2 = ({ node, ...props }: any) => {
    return (
        <h2
          id={node.position?.start.line.toString()}
          className="text-4xl pb-2 mt-24 mb-10 font-bold border-b-2 border-blue-400"
        >
          {props.children}
        </h2>
    );
  }

  const topLink = ({ node, ...props }: any) => {
    return (
        <li className="pb-4">
          <a href={"#"+node.position?.start.line.toString()}>{props.children}</a>
        </li>
    );
  }

  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-4/5 mx-auto mt-20">
      <h1 className="w-full text-5xl font-bold pb-2 mb-6">{article.metadata.title}</h1>
      {article.metadata.tags.map((tag: string, index: number) => (
        <Tag key={index} tag={tag} />
      ))}
      <br/>
      <span className="text-sm text-blue-700 inline-block mt-4">更新日：{article.metadata.updated_on}</span>
      {
        article.markdown ?
        <div className="mt-20 lg:flex flex-row-reverse">
          <div className="mb-20 max-sm:pl-8 lg:w-1/5 text-gray-500">
            <h2 className="pb-2">目次</h2>
            <ul>
              <ReactMarkdown
                allowedElements={['h2']}
                components={{
                  h2: topLink,
                }}
              >
                {article.markdown}
              </ReactMarkdown>
            </ul>
          </div>
          <div className="text-lg lg:w-4/5 lg:pr-20">
            <ReactMarkdown
              components={{
                code: CodeBlock,
                h2: H2,
                // h2: ({ children }) => <h2 className="text-4xl pb-2 mt-24 mb-10 font-bold border-b-2 border-blue-400">{children}</h2>,
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
          </div>
        </div>
        : <div className="mt-20">記事準備中</div>
      }
      <Link href="/articles/page/1" className="block mt-20 pb-20 text-blue-600 text-right"><span>記事一覧を見る</span></Link>
    </section>
  )
}

export default Article

