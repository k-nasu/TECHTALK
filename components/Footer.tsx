import React from 'react'
import { SERVICE_NAME } from '@/constants/constants'

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-6 text-blue-400 text-center">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} {SERVICE_NAME} All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
