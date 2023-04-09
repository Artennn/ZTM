import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "utils/trpc";

import List from "components/List";
import { MapContainer } from "components/Misc";
import VehicleCard from "components/VehicleCard";

import Grid from "@mui/material/Grid";

import type { VehicleWithDriver } from "server/trpc/router/vehicle";
import type { Page } from "types/app";

const VehiclesPage: Page = () => {
  useSession({ required: true });
  const [selected, setSelected] = useState<VehicleWithDriver>();

  const { data: vehicles } = trpc.vehicle.getDriver.useQuery();

  return (
    <Grid container spacing={2} sx={{ height: "100vh" }}>
      <Grid item xs={12} md="auto" height={{ xs: 0.5, md: 1.0 }}>
        <List
          title="Pojazdy"
          minWidth="20rem"
          isLoading={false}
          options={vehicles?.map((vehicle) => vehicle.name)}
          items={vehicles?.map((vehicle) => ({
            filterBy: vehicle.name,
            component: (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                selected={selected?.id === vehicle.id}
                onSelect={(id) =>
                  setSelected(
                    vehicles?.find((veh) => veh.id === id || undefined)
                  )
                }
                onEdit={() => {
                  /*  TODO: add handler */
                }}
                onDelete={() => {
                  /*  TODO: add handler */
                }}
                onShowSchedule={() => {
                  /*  TODO: add handler */
                }}
              />
            ),
          }))}
        />
      </Grid>

      <Grid item xs md height={{ xs: 0.5, md: 1.0 }}>
        <MapContainer
          scrollWhell
          zoom={selected ? 16 : undefined}
          center={selected ? [selected.posX, selected.posY] : undefined}
          deps={[selected]}
          markers={vehicles?.map((vehicle) => ({
            id: vehicle.id,
            text: `Pojazd: ${vehicle.name}`,
            pos: [vehicle.posX, vehicle.posY],
            selected: selected?.id === vehicle.id,
          }))}
        />
      </Grid>
    </Grid>
  );
};
VehiclesPage.title = "Pojazdy";

export default VehiclesPage;
