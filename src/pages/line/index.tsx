import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";

import { MapContainer } from "components/Misc";
import List from "components/List";
import LineCard from "components/line/LineCard";
import ScheduleEditor from "components/dialogs/ScheduleEditor";

import { trpc } from "utils/trpc";

import { RouteColors } from "styles/theme";

import type { Page } from "types/app";

const LinesPage: Page = () => {
  useSession({ required: true });
  const router = useRouter();

  const { data: busStops } = trpc.busStop.get.useQuery();
  const { isLoading: linesLoading, data: lines } = trpc.line.getMany.useQuery();

  const [selectedLineID, setSelectedLineID] = useState<number>();
  const { data: selectedLine } = trpc.line.get.useQuery(selectedLineID || 0, { enabled: !!selectedLineID });

  const [showSchedule, setShowSchedule] = useState(0);

  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item xs={12} md="auto" height={{ xs: 0.5, md: 1.0 }}>
        <List
          title="Linie"
          isLoading={linesLoading}
          autocomplete
          options={lines?.map((line) => line.name)}
          items={lines?.map((line) => ({
            filterBy: line.name,
            component: (
              <LineCard
                key={line.id}
                line={line}
                selected={selectedLine?.id === line.id}
                onSelect={(id) => setSelectedLineID(id)}
                onShowSchedule={(id) => setShowSchedule(id)}
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

      <Grid item xs md height={{ xs: 0.5, md: 1.0 }}>
        <MapContainer
          scrollWhell
          markers={busStops?.map((busStop) => ({
            id: busStop.id,
            text: busStop.name,
            pos: [busStop.gpsX, busStop.gpsY],
          }))}
          routes={
            (selectedLine &&
              selectedLine.routes.map((route, key) => ({
                label: route.name,
                color: RouteColors[key] || "pink",
                stops: route.entries.map((entry) => entry.busStop),
              }))) ||
            undefined
          }
        />
      </Grid>

      {showSchedule ? (
        <ScheduleEditor
          lineID={showSchedule}
          onClose={() => setShowSchedule(0)}
        />
      ) : null}
    </Grid>
  );
};
LinesPage.title = "Linie";

export default LinesPage;
