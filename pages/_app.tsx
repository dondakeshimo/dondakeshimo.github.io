import { AppProps } from 'next/app'
import { useEffect } from 'react'
import TagManager from 'react-gtm-module'
import '../styles/index.scss'

const tagManagerArgs = {
  gtmId: `${process.env.NEXT_PUBLIC_GTM_ID}`,
  dataLayerName: 'dataLayer',
  dataLayer: {
    platform: 'nextjs',
  }
}

console.log(tagManagerArgs)

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])

  return <Component {...pageProps} />
}
