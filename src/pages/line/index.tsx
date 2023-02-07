import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

import { MainLayout } from "components/Layouts";
import List from "components/List";
import LineCard from "components/line/LineCard";

import { trpc } from "utils/trpc";

import { RouteColors } from "styles/theme";

const LinesPage: NextPage = () => {
  useSession({ required: true });
  const router = useRouter();

  const { data: busStops } = trpc.busStop.get.useQuery();
  const { isLoading: linesLoading, data: lines } = trpc.line.get.useQuery();

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
          <List
            title="Linie"
            isLoading={linesLoading}
            options={lines?.map((line) => line.name)}
            items={lines?.map((line) => ({
              filterBy: line.name,
              component: (
                <LineCard
                  line={line}
                  selected={selectedLine?.id === line.id}
                  onSelect={handleSelect}
                />
              ),
            }))}
            actionGroup={
              <Button
                variant="contained"
                color="success"
                onClick={() => router.push("line/create")}
              >
                Nowa Linia
              </Button>
            }
          />
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
