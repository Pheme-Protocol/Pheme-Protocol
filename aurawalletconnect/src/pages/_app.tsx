import "@/styles/globals.css";
import type { AppProps } from 'next/app';
import { type NextComponentType, type NextPageContext } from 'next';
import React from 'react';

type AppComponent = NextComponentType<NextPageContext, any, AppProps>;

const App: AppComponent = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default App;
