import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import '../styles/styleEnregistrement.css';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Commute?</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
