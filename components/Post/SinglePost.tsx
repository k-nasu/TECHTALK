import Link from 'next/link';
import React from 'react'
import { Post } from "@/types/types";

const SinglePost = (props: Post) => {
  const { title, description, updated_on, slug, tags, isPaginationPage } = props;

  return (
    <Link href={`/posts/${slug}`}>
      {isPaginationPage ? (
        <section className="bg-sky-900 text-gray-100 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className="lg:flex items-center">
            <h2 className="text-2xl font-medium mb-2">{title}</h2>
            <div className="mr-2">{updated_on}</div>
            {tags?.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-gray-500 rounded-xl px-2 pb-1 font-medium mr-2"
              >
                {tag}
              </span>
            ))}
          </div>
          <p>{description}</p>
        </section>
      ): (
        <section className="lg:w-1/2 bg-sky-900 text-gray-100 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-medium mb-2">{title}</h2>
            <div>{updated_on}</div>
            {tags?.map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-gray-500 rounded-xl px-2 pb-1 font-medium mr-2"
              >
                {tag}
              </span>
            ))}
          </div>
          <p>{description}</p>
        </section>
      )}
    </Link>
  )
}

export default SinglePost;
