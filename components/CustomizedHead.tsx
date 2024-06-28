import React from 'react'
import { SERVICE_NAME, SERVICE_DESCRIPTION } from "@/constants/constants"
import Head from 'next/head'

const CustomizedHead = () => {
  return (
    <Head>
      <title>{SERVICE_NAME}</title>
      <meta name="description" content={SERVICE_DESCRIPTION} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/techtalk.svg" />
    </Head>
  )
}

export default CustomizedHead

