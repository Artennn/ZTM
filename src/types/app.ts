import type { ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps as NextAppProps } from "next/app";
import type { Session } from "next-auth";

export interface LayoutProps {
  title?: string;
  children: ReactNode;
}

export type Page<P = Record<string, never>, IP = P> = NextPage<P, IP> & {
  title?: string;
  layout?: (props: LayoutProps) => JSX.Element;
};

export type AppProps = NextAppProps & {
  Component: Page;
  pageProps: {
    session: Session | null;
  };
};
