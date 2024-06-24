import Link from 'next/link';
import React from 'react'
import { Post } from "@/types/types";
import Tag from '@/components/Tag/Tag';

const SinglePost = (props: Post) => {
  const { title, description, updated_on, slug, tags, isPaginationPage } = props;

  return (
    <Link href={`/posts/${slug}`}>
      {isPaginationPage ? (
        <section className="text-gray-800 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <span className="text-sm text-blue-700">{updated_on}</span><br/>
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <div className="mb-5">{description}.........</div>
          {tags?.map((tag: string, index: number) => (
            <Tag key={index} tag={tag} />
          ))}
        </section>
      ): (
        <section className=" text-gray-800 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <span className="text-sm text-blue-700">{updated_on}</span><br/>
          <h2 className="text-3xl font-bold mb-3">{title}</h2>
          <div className="mb-5">{description}.........</div>
          {tags?.map((tag: string, index: number) => (
            <Tag key={index} tag={tag} />
          ))}
        </section>
      )}
    </Link>
  )
}

export default SinglePost;
