import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo-avicenna.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>E-Voting Avicenna</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
