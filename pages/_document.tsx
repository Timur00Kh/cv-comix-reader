// https://nextjs.org/docs/advanced-features/custom-document
// https://nextjs.org/docs/advanced-features/custom-document#typescript

import React from 'react';
import DocumentNext, { Html, Head, Main, NextScript } from 'next/document';

class Document extends DocumentNext {
  render(): JSX.Element {
    return (
      <Html lang="ru">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
          <script src="opencv.js" />
          <script src="openCvReady.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
