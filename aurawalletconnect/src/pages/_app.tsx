import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { type NextComponentType } from 'next';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
