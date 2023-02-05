import { MainLayout } from "components/Layouts";
import BusStops from "components/BusStops";

import { type NextPage } from "next";
import { useSession } from "next-auth/react";

const BusStopsPage: NextPage = () => {
  useSession({ required: true });

  return (
    <MainLayout title="Lista przystanków">
      <BusStops />
    </MainLayout>
  );
};

export default BusStopsPage;
