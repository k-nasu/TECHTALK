import React from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
// import type { ClassAttributes, HTMLAttributes } from 'react'
// import type { ExtraProps } from 'react-markdown'

type Props = {
  markdown: string
}

const CodeBlock = ({ inline, className, children }: any) => {
  if (inline) {
    return <code className={className}>{children}</code>
  }
  const match = /language-(\w+)/.exec(className || '')
  const lang = match && match[1] ? match[1] : ''
  return (
    <SyntaxHighlighter style={a11yDark} language={lang}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  )
}

const H2 = ({ node, ...props }: any) => {
  return (
    <h2
      id={node.position?.start.line.toString()}
      className="text-4xl pb-2 mt-24 mb-10 font-bold border-b-2 border-blue-400"
    >
      {props.children}
    </h2>
  )
}

const topLink = ({ node, ...props }: any) => {
  return (
    <li className="pb-4">
      <a href={'#' + node.position?.start.line.toString()}>{props.children}</a>
    </li>
  )
}

const Markdown = (props: Props) => {
  const { markdown } = props

  return (
    <div className="lg:flex flex-row-reverse relative">
      <div className=" h-full lg:sticky top-20 mb-20 max-sm:pl-8 lg:w-1/5 text-gray-500">
        <h2 className="pb-2">目次</h2>
        <ul>
          <ReactMarkdown
            allowedElements={['h2']}
            components={{
              h2: topLink
            }}
          >
            {markdown}
          </ReactMarkdown>
        </ul>
      </div>
      <div className="text-lg lg:w-4/5 lg:pr-20">
        <ReactMarkdown
          components={{
            code: CodeBlock,
            h2: H2,
            h3: ({ children }) => (
              <h3 className="text-2xl font-bold mb-5">{children}</h3>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-16">{children}</ol>
            ),
            ul: ({ children }) => (
              <ul className="mb-16 ml-4 list-disc">{children}</ul>
            ),
            li: ({ children }) => <li className="mb-6">{children}</li>,
            p: ({ children }) => <p className="my-6 leading-8">{children}</p>,
            a: ({ children, href }) => (
              <Link
                href={href!}
                rel="noopener noreferrer"
                target="_blank"
                className="text-blue-600"
              >
                {children}
              </Link>
            ),
            pre: ({ children }) => <pre className="mb-10">{children}</pre>
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default Markdown
