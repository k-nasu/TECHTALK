import { SERVICE_NAME, SERVICE_DESCRIPTION } from './constants/constants'

const SEO = {
  titleTemplate: `%s | ${SERVICE_NAME} | プログラミング、クラウドコンピューティング、AI、データサイエンスが学べるテックブログ`,
  defaultTitle: SERVICE_NAME,
  description: SERVICE_DESCRIPTION,
  additionalMetaTags: [
    {
      property: 'dc:creator',
      content: SERVICE_NAME
    },
    {
      name: 'application-name',
      content: SERVICE_NAME
    }
  ],
  openGraph: {
    type: 'website',
    url: process.env.BASE_URL,
    description: SERVICE_DESCRIPTION,
    locale: 'ja_JP',
    site_name: SERVICE_NAME,
    images: [
      {
        url: '../public/images/programmer.png',
        width: 768,
        height: 783,
        alt: `${SERVICE_NAME}の画像`,
        type: 'image/png'
      }
    ]
  }
}

export default SEO
