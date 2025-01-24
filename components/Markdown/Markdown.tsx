import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'

type Props = {
  markdown: string
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => {
    const id = String(children)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\-]/g, '')
    return (
      <h2 id={id} className="text-2xl font-bold mt-8 mb-4">
        {children}
      </h2>
    )
  },
  h3: ({ children }) => (
    <h3 className="text-xl font-bold mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-lg leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 ml-4">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 ml-4">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-lg leading-relaxed">{children}</li>
  ),
  code: ({ className, children }) => {
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <SyntaxHighlighter
        style={vscDarkPlus as any}
        language={match[1]}
        PreTag="div"
        className="text-lg lg:text-xl rounded-lg !bg-[#1E1E1E] !p-4 my-4"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="text-lg px-1.5 py-0.5 rounded bg-gray-100">
        {children}
      </code>
    )
  },
  blockquote: ({ children }) => (
    <blockquote className="text-lg border-l-4 border-primary/20 pl-4 my-6 text-secondary italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-lg text-primary hover:text-primary-dark underline decoration-primary/30 hover:decoration-primary transition-colors"
    >
      {children}
    </a>
  )
}

const Markdown = ({ markdown }: Props) => {
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
