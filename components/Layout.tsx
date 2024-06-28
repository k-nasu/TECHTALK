import React from 'react'
import CustomizedHead from './CustomizedHead'
import Navbar from './Navbar/Navbar'
import Footer from './Footer'

const Layout = ({ children }: any) => {
  return (
    <div className="flex flex-col min-h-screen">
      <CustomizedHead />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
