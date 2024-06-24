import React from 'react'
import { SERVICE_NAME } from '@/constants/constants'

const Footer = () => {
  return (
    <footer className="w-full h-60 text-blue-600 text-center">
      © {new Date().getFullYear()} {SERVICE_NAME}
    </footer>
  )
}

export default Footer
