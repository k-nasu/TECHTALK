import React from 'react'

interface Props {
  tag: string;
}

const Tag = (props: Props) => {
  const { tag } = props;

  return (
    <span className="text-indigo-500 hover:text-blue-600 shadow-md shadow-indigo-500/20 rounded-xl px-2 pb-1 font-medium mr-2">
      {tag}
    </span>
  )
}

export default Tag