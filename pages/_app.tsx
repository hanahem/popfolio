import * as React from "react";
import { AppProps } from "next/app";
import "../style.css";
import { Provider } from "react-redux";
import { useStore } from "../store/store";
import Head from "next/head";
import SidebarWrapper from "../components/SideBarWrapper/SideBarWrapper";
import { ToastProvider } from "react-toast-notifications";
import { ThemeProvider } from "next-themes";
import AppProvider from "../components/AppProvider/AppProvider";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types*/
export default function App({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState);
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <ToastProvider autoDismiss>
          <>
            <Head>
              <title>Popfolio.</title>
              <meta name="viewport" content="initial-scale=1.0, width=device-width" />
              <link rel="shortcut icon" href="/images/lollipop.png" />
              <script src="/node_modules/@lottiefiles/lottie-player/dist/lottie-player.js"></script>
            </Head>
            <AppProvider>
              <SidebarWrapper>
                <Component {...pageProps} />
              </SidebarWrapper>
            </AppProvider>
          </>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}
