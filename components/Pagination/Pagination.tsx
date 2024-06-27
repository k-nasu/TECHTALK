import React from 'react'
import Link from 'next/link'

interface Props {
  pageNumbers: number;
  currentPage: number;
  paginationLink: string;
}

const Pagination = (props: Props) => {
  const { pageNumbers, currentPage, paginationLink } = props;
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  }

  let pages = [];
  for (let i = 1; i <= pageNumbers; i++) {
    pages.push(i)
  }

  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md px-5">
      <ul className="flex items-center justify-center gap-3">
        {pages.map(page => (
          <li key={page} className="w-8 h-8">
              <Link
                href={`/${paginationLink}/${page}`}
                className={classNames(
                  page == currentPage
                    ? "rounded-full text-white bg-blue-500"
                    : "text-black-900",
                      "text-sx block text-center h-max leading-8"
                )}
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
