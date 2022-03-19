//To load global CSS files,
import Script from 'next/script';
import '../styles/globals.css';
import 'normalize.css/normalize.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import type { AppProps } from 'next/app';
//
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=7c979a8b28e8fbc552afe34a35bebecd&libraries=services,clusterer&autoload=false"
        strategy="beforeInteractive"
      />
      <div className="w-full max-w-lg mx-auto">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
