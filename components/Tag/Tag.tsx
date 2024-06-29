import React from 'react'

interface Props {
  tag: string;
}

const Tag = (props: Props) => {
  const { tag } = props;

  return (
    <span className="text-indigo-600 hover:text-blue-600 shadow-md shadow-indigo-500/20 rounded-xl px-2 pb-1 mb-2 font-medium mr-2 whitespace-nowrap inline-block">
      {tag}
    </span>
  )
}

export default Tag
