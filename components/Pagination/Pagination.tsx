import React from 'react'
import Link from 'next/link'

interface Props {
  pageNumbers: number;
}

const Pagination = (props: Props) => {
  const { pageNumbers } = props;

  let pages = [];
  for (let i = 1; i <= pageNumbers; i++) {
    pages.push(i)
  }

  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md px-5">
      <ul className="flex items-center justify-center gap-4">
        {pages.map(page => (
          <li key={page} className="rounded-lg w-6 h-8 relative">
            <Link
              href={`/posts/page/${page}`}
              className="text-sx text-black-900 block text-center h-max leading-8"
            >
              {page}
            </Link>
          </li>
        ))}

      </ul>
    </section>
  )
}

export default Pagination
