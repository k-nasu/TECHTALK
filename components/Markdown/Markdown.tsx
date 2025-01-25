// @ts-nocheck
import React from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import type { ComponentPropsWithoutRef } from 'react'

interface Props {
  markdown: string
}

type CodeBlockProps = ComponentPropsWithoutRef<'code'> & {
  inline?: boolean
  className?: string
}

interface HeadingProps {
  children: React.ReactNode
  [key: string]: any
}

const CodeBlock = ({ inline, className, children }: any) => {
  if (inline) {
    return <code className={className}>{children}</code>
  }
  const match = /language-(\w+)/.exec(className || '')
  const lang = match && match[1] ? match[1] : ''
  return (
    <SyntaxHighlighter style={vscDarkPlus as any} language={lang}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  )
}

const H2 = ({ node, ...props }: any) => {
  const text = String(props.children)
  const id = text.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  return (
    <h2 id={id} {...props}>
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

const Markdown = ({ markdown }: Props) => {
  const components: Components = {
    code({ inline, className, children, ...props }: CodeBlockProps) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <SyntaxHighlighter
          style={vscDarkPlus as any}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    h2({ children, ...props }) {
      const text = String(children)
      const id = text.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      return (
        <h2 id={id} {...props} className="group relative">
          <div className="flex items-center gap-4 pb-2 mb-6">
            <span className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href={`#${id}`} className="text-slate-400 hover:text-blue-500">
                #
              </a>
            </span>
            <span className="text-blue-600 font-bold text-2xl">
              {children}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-200 opacity-80" />
        </h2>
      )
    },
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
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {markdown}
    </ReactMarkdown>
  )
}

export default Markdown
