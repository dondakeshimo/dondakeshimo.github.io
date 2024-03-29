import Head from 'next/head'
import { HOME_OG_IMAGE_URL, DOMAIN } from '../lib/constants'

type Props = {
  title: string
  description: string
  path: string
}

const Meta = ({
  title,
  description,
  path,
}: Props) => {
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#000000"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#fdf6e3" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#fdf6e3" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta
        name="description"
        content={description}
      />

      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}/${path}`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`https://${DOMAIN}/assets/home/snafkin-1200x630.png`} />
      <meta property="og:image:alt" content={description} />
      <meta property="og:site_name" content="dondakeshimoの丸太" />
      <meta property="og:locale" content="ja_JP" />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image:alt" content={description} />
      <meta property="twitter:site" content="dondakeshimo" />
      <meta property="twitter:creator" content="dondakeshimo" />
    </Head>
  )
}

export default Meta
