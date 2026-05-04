import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0A0A0F" />
        <title>ClauseIQ</title>
      </Head>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <Component {...pageProps} />
    </>
  )
}
