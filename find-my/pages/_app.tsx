//To load global CSS files,
import Script from 'next/script';
import '../styles/globals.css';
import 'normalize.css/normalize.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { CookiesProvider } from 'react-cookie';
import axios from 'axios';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <SWRConfig
        value={{
          fetcher: (url: string) => axios.get(url).then((response) => response.data),
        }}
      >
        <Script
          src="//dapi.kakao.com/v2/maps/sdk.js?appkey=7c979a8b28e8fbc552afe34a35bebecd&libraries=services,clusterer&autoload=false"
          strategy="beforeInteractive"
        />
        <Script></Script>
        <Component {...pageProps} />
      </SWRConfig>
    </CookiesProvider>
  );
}

export default MyApp;
