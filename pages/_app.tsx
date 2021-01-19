import React from 'react';
import { Provider } from 'react-redux';
import { AppProps } from 'next/app';
import { LayoutTree } from '@moxy/next-layout';

import { PrimaryLayout } from '@/layouts/PrimaryLayout';
import { useStore } from '@/store/store';
import '@/styles/index.scss';

function App({ Component, pageProps }: AppProps): JSX.Element {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <LayoutTree
        // @ts-ignore
        defaultLayout={<PrimaryLayout />}
        Component={Component}
        pageProps={pageProps}
      />
    </Provider>
  );
}

export default App;
