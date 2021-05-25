import * as React from "react";
import { AppProps } from "next/app";
import "../style.css";
import { Provider } from "react-redux";
import { useStore } from "../store/store";
import Head from "next/head";
import SidebarWrapper from "../components/SideBarWrapper/SideBarWrapper";
import { ToastProvider } from "react-toast-notifications";

export default function App({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <Provider store={store}>
      <ToastProvider autoDismiss>
        <Head>
          <title>Kiwi dApp</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link rel="shortcut icon" href="/favicon.ico" />
          <script src="/node_modules/@lottiefiles/lottie-player/dist/lottie-player.js"></script>
        </Head>
        <SidebarWrapper>
          <Component {...pageProps} />
        </SidebarWrapper>
      </ToastProvider>
    </Provider>
  );
}
