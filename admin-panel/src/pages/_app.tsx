import Header from "@/components/Header";
import TokenInitializer from "@/components/TokenInitializer";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return ( 
    <>
      <TokenInitializer />
      <Header/>
      <Component {...pageProps} />
    </>
  );
}
