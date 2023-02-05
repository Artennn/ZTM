import Head from "next/head";
import Stack from "@mui/material/Stack";
import SideBar from "./SideBar";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";

export const MainLayout = ({
  title = "System ZTM",
  children,
}: {
  title?: string;
  children: ReactNode;
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <Stack direction="row">
          <SideBar />

          <Box width="100%" p={1}>
            {children}
          </Box>
        </Stack>
      </main>
    </>
  );
};