import { StatCard, InfoCard } from "components/Cards";
import { StatusIcons } from "components/VehicleCard";
import { MapContainer } from "components/Misc";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RoomIcon from "@mui/icons-material/Room";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

import SignalWifi3BarIcon from "@mui/icons-material/SignalWifi3Bar";
import SignalWifiStatusbarConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";

import BusAlertIcon from "@mui/icons-material/BusAlert";

import { useSession } from "next-auth/react";
import { trpc } from "utils/trpc";

import type { Page } from "types/app";
import type { VehicleStatus } from "@prisma/client";

const VehicleStatuses: { status: VehicleStatus; label: string }[] = [
  { status: "enroute", label: "W trasie" },
  { status: "parked", label: "Zaparkowany" },
  { status: "service", label: "Trasa serwisowa" },
  { status: "emergency", label: "Awaria" },
];

const Home: Page = () => {
  useSession({ required: true });

  const { data: vehicles } = trpc.vehicle.get.useQuery();
  const { data: vehicleStats } = trpc.vehicle.getStats.useQuery();

  return (
      <Grid container spacing={2} height="100vh">
      <Grid item md={4} height={0.4}>
        <StatCard
          title="Pojazdy"
          Icon={DirectionsBusIcon}
          stats={VehicleStatuses.map((stat) => ({
            key: stat.status,
            icon: StatusIcons[stat.status],
            label: stat.label,
            count: vehicleStats?.find((x) => x.status === stat.status)?._count,
          }))}
        />
      </Grid>

      <Grid item md={4} height={0.4}>
        <StatCard
          title="Przystanki"
          Icon={RoomIcon}
          stats={[
            {
              key: "online",
              icon: <SignalWifi3BarIcon color="success" />,
              label: "Aktywne",
              count: 158,
            },
            {
              key: "error",
              icon: (
                <SignalWifiStatusbarConnectedNoInternet4Icon color="warning" />
              ),
              label: "Awaria",
              count: 3,
            },
            {
              key: "offline",
              icon: <SignalWifiOffIcon color="error" />,
              label: "Niedostepne",
              count: 2,
            },
          ]}
          actionGroup={
            <Button variant="contained" color="info">
              Szczegoly
            </Button>
          }
        />
      </Grid>

      <Grid item md={4} height={0.4}>
        <StatCard
          title="Opóznienia linii"
          Icon={AccessAlarmIcon}
          stats={[
            {
              key: "14",
              icon: <BusAlertIcon color="error" />,
              label: "14 (#1832)",
              count: "15 min",
            },
            {
              key: "12",
              icon: <BusAlertIcon color="warning" />,
              label: "12 (#1922)",
              count: "6 min",
            },
            {
              key: "58",
              icon: <BusAlertIcon color="info" />,
              label: "58 (#1252)",
              count: "4 min",
            },
            {
              key: "59",
              icon: <BusAlertIcon color="info" />,
              label: "59 (#1252)",
              count: "4 min",
            },
            {
              key: "60",
              icon: <BusAlertIcon color="info" />,
              label: "60 (#1252)",
              count: "4 min",
            },
          ]}
          actionGroup={
            <Button variant="contained" color="info">
              Szczegoly
            </Button>
          }
        />
      </Grid>

      <Grid item md={4} height={0.6}>
        <InfoCard />
      </Grid>

      <Grid item md={8} height={0.6}>
        <MapContainer
          scrollWhell
          markers={vehicles?.map((vehicle) => ({
            id: vehicle.id,
            text: vehicle.name,
            icon: "vehicle",
            pos: [vehicle.posX, vehicle.posY],
          }))}
        />
      </Grid>
    </Grid>
  );
};

export default Home;
