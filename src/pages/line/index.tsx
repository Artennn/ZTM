import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

import { MainLayout } from "components/Layouts";
import LineCard from "components/line/LineCard";

import { trpc } from "utils/trpc";

import { RouteColors } from "styles/theme";

const LinesPage: NextPage = () => {
  useSession({ required: true });

  const { data: busStops } = trpc.busStop.get.useQuery();
  const { data: lines } = trpc.line.get.useQuery();

  const [selectedLineID, setSelectedLineID] = useState(0);
  const selectedLine = lines?.[selectedLineID];

  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/Map"), {
        ssr: false,
      }),
    []
  );

  const handleSelect = (id: number) => {
    const newSelected = lines?.findIndex((line) => line.id === id);
    if (newSelected === -1 || newSelected === undefined) return;
    setSelectedLineID(newSelected);
  };

  return (
    <MainLayout title="Lista linii">
      <Grid container spacing={2} sx={{ height: "100vh" }}>
        <Grid item md={3}>
          <Stack
            direction="column"
            height="100%"
            p={2}
            spacing={2}
            border={(theme) => theme.border.primary}
          >
            <Typography textAlign="center"> Lista Linii </Typography>

            {lines?.map((line, key) => (
              <LineCard
                key={key}
                line={line}
                selected={selectedLine?.id === line.id}
                onSelect={handleSelect}
              />
            ))}
          </Stack>
        </Grid>

        <Grid item md>
          <Map
            scrollWhell
            busStops={busStops}
            routes={
              selectedLine
                ? selectedLine.routes.map((route, key) => ({
                    label: route.name,
                    color: RouteColors[key] || "pink",
                    stops: route.entries.map((entry) => entry.busStop),
                  }))
                : undefined
            }
          />
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default LinesPage;
