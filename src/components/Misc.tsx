import Head from "next/head";
import { type ReactNode, useState } from "react";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

import SideBar from "./SideBar";

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
        <Stack
          direction="row"
          spacing={1}
          height="100vh"
          p={1}
          sx={{
            mr: {
              xl: "auto",
            },
            ml: {
              xl: "auto",
            },
            maxWidth: 1920,
          }}
        >
          <SideBar />

          <Box width="100%" sx={{ overflowY: "auto" }}>
            {children}
          </Box>
        </Stack>
      </main>
    </>
  );
};

import dynamic from "next/dynamic";
import { type DependencyList, useMemo } from "react";
import type { MapProps } from "./Map";
import type { SxProps } from "@mui/material";

export const useMap = (deps?: DependencyList) => {
  const Map = useMemo(
    () =>
      dynamic(() => import("./Map"), {
        ssr: false,
      }),
    deps || []
  );

  return Map;
};

export const MapContainer = ({
  deps,
  actionGroup,
  sx,
  ...props
}: MapProps & {
  deps?: DependencyList;
  actionGroup?: ReactNode;
  sx?: SxProps;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const Map = useMap(deps);

  return (
    <Box
      sx={{
        position: "relative",
        width: 1,
        height: 1,
        p: 0.1,
        border: (theme) => theme.border.primary,
        ...sx,
      }}
    >
      {!isLoaded &&  <Skeleton sx={{ position: "absolute", width: 1, height: 1 }} variant="rectangular" /> }
      <Map {...props} onReady={() => setIsLoaded(false)} />

      {actionGroup && (
        <Stack
          direction="row"
          spacing={1}
          position="absolute"
          right={25}
          bottom={35}
          zIndex={500}
        >
          {actionGroup}
        </Stack>
      )}
    </Box>
  );
};