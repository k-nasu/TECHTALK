import React from 'react'
import Head from 'next/head'
import Navbar from './Navbar/Navbar'
import Footer from './Footer'
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'

const Layout = ({ children }: any) => {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      <DefaultSeo {...SEO} />
      <Head>
        <link rel="icon" href="/techtalk.svg" />
        <meta name="google-site-verification" content="kQgcdr4Kor47GBRJD07vuXz0L_7ELzmYuiRnqiIBsh8" />
      </Head>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
