import React from 'react'
import Link from 'next/link'
import { SERVICE_NAME } from '@/constants/constants'

const Navbar = () => {
  return (
    <nav className="shadow-lg shadow-gray-100 sticky top-0 left-0 right-0">
      <div className="container px-4 lg:w-4/5 flex items-center justify-between mx-auto py-4">
        <Link href="/" className="text-2xl font-medium text-indigo-600">
          {SERVICE_NAME}
        </Link>
        <ul className="flex items-center text-sm">
          <li>
            {/* <Link href="/" className="block px-4 py-2 hover:text-sky-900 transition-all duration-300">Home</Link> */}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
