/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NOTION_SECRET_TOKEN: process.env.NOTION_SECRET_TOKEN,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
