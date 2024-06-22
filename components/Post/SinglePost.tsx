import React from 'react'

type Props = {
  title: string;
  description: string;
  updated_on: string;
  slug: string;
  tags: string;
}

const SinglePost = (props: Props) => {
  const { title, description, updated_on, slug, tags } = props;

  return (
    <section className="bg-sky-900 mb-8 mx-auto rounded-md p5">
       <div>
        <h2>{title}</h2>
        <div>{updated_on}</div>
        <span>{tags}</span>
       </div>
       <p>{description}</p>
    </section>
  )
}

export default SinglePost;
