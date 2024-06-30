import React from 'react'
import Head from 'next/head'
import Navbar from './Navbar/Navbar'
import Footer from './Footer'
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'

const Layout = ({ children }: any) => {
  return (
    <div className="flex flex-col min-h-screen">
      <DefaultSeo {...SEO} />
      <Head>
        <link rel="icon" href="/techtalk.svg" />
      </Head>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
