import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "utils/trpc";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import List from "components/List";
import BusStopCard from "components/BusStopCard";
import NewBusStop from "components/dialogs/NewBusStop";
import Schedule from "components/dialogs/Schedule";
import { MapContainer } from "components/Misc";

import type { Page } from "types/app";
import type { BusStop } from "@prisma/client";

const BusStopsPage: Page = () => {
  useSession({ required: true });
  const trpcContext = trpc.useContext();

  const { isLoading, data: busStops } = trpc.busStop.get.useQuery();
  const { mutate: deleteBusStop } = trpc.busStop.delete.useMutation();

  const [selected, setSelected] = useState<BusStop>();

  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<BusStop>();
  const [showSchedule, setShowSchedule] = useState<BusStop>();

  const handleSelect = (id: number) => {
    const stop = busStops?.find((x) => x.id === id);
    if (!stop) return;
    if (selected === stop) return;
    setSelected(stop);
  };

  const handleEdit = (id: number) => {
    const stop = busStops?.find((x) => x.id === id);
    if (!stop) return;
    setEditing(stop);
  };

  const handleShowSchedule = (id: number) => {
    const stop = busStops?.find((x) => x.id === id);
    if (!stop) return;
    setShowSchedule(stop);
  };

  const handleDelete = (id: number) => {
    deleteBusStop(id, {
      onSuccess: () => {
        trpcContext.busStop.invalidate();
      },
    });
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item xs={12} md="auto" height={{ xs: 0.5, md: 1.0 }}>
        <List
          title="Przystanki"
          minWidth="20rem"
          isLoading={isLoading}
          options={busStops?.map((busStop) => busStop.name)}
          items={busStops?.map((busStop) => ({
            filterBy: busStop.name,
            component: (
              <BusStopCard
                key={busStop.id}
                busStop={busStop}
                selected={selected === busStop}
                onSelect={handleSelect}
                onEdit={handleEdit}
                onShowSchedule={handleShowSchedule}
                onDelete={handleDelete}
              />
            ),
          }))}
        />
      </Grid>

      <Grid item xs md height={{ xs: 0.5, md: 1.0 }}>
        <MapContainer
          scrollWhell
          markers={busStops?.map((busStop) => ({
            id: busStop.id,
            text: busStop.name,
            pos: [busStop.gpsX, busStop.gpsY],
            selected: busStop.id === selected?.id,
          }))}
          zoom={selected ? 16 : undefined}
          center={selected ? [selected.gpsX, selected.gpsY] : undefined}
          onMarkerSelect={handleSelect}
          deps={[selected]}
          actionGroup={
            <Button
              variant="contained"
              color="success"
              onClick={() => setIsAdding(!isAdding)}
            >
              Nowy
            </Button>
          }
        />
      </Grid>

      {isAdding && <NewBusStop onClose={() => setIsAdding(false)} />}

      {editing && (
        <NewBusStop onClose={() => setEditing(undefined)} busStop={editing} />
      )}

      {showSchedule && (
        <Schedule
          busStop={showSchedule}
          onClose={() => setShowSchedule(undefined)}
        />
      )}
    </Grid>
  );
};
BusStopsPage.title = "Przystanki";

export default BusStopsPage;
