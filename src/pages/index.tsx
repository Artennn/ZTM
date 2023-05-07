import { StatCard, InfoCard } from "components/Cards";
import { MapContainer } from "components/Misc";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import RoomIcon from "@mui/icons-material/Room";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

import BusAlertIcon from "@mui/icons-material/BusAlert";

import { useSession } from "next-auth/react";
import { getServerAuthSession } from "server/common/get-server-auth-session";
import { trpc } from "utils/trpc";

import {
  Statuses as VehicleStatuses,
  Definitions as VehicleDefinitions,
} from "definitions/vehicle";

import {
  type Status as BusStopStatus,
  Statuses as BusStopStatuses,
  Definitions as BusStopDefinitions,
} from "definitions/busStop";

import type { Page } from "types/app";
import type { GetServerSideProps } from "next";

const BusStopStats: { status: BusStopStatus; _count: number }[] = [
  { status: "online", _count: 153 },
  { status: "error", _count: 5 },
  { status: "offline", _count: 2 },
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
            key: stat,
            label: VehicleDefinitions[stat].label,
            icon: VehicleDefinitions[stat].Icon,
            count: vehicleStats?.find((x) => x.status === stat)?._count,
          }))}
        />
      </Grid>

      <Grid item md={4} height={0.4}>
        <StatCard
          title="Przystanki"
          Icon={RoomIcon}
          stats={BusStopStatuses.map((stat) => {
            const Icon = BusStopDefinitions[stat].Icon;
            return {
              key: stat,
              label: BusStopDefinitions[stat].label,
              icon: <Icon color={BusStopDefinitions[stat].color} />,
              count: BusStopStats.find((x) => x.status === stat)?._count,
            };
          })}
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session?.user?.id) {
      return {
          redirect: {
              destination: "/api/auth/signin",
              permanent: false,
          }
      }
  }

  return {
      props: {},
  }
}

export default Home;
