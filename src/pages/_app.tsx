import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { trpc } from "../utils/trpc";
import { darkTheme } from "styles/theme";
import { MainLayout } from "components/Misc";

import type { AppProps } from "types/app";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const Layout = Component.layout ? Component.layout : MainLayout;
  const title = Component.title || "System ZTM";

  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Layout title={title}>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
