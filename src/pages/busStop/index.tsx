import { useSession } from "next-auth/react";

import BusStops from "components/BusStops";

import type { Page } from "types/app";

const BusStopsPage: Page = () => {
  useSession({ required: true });

  return <BusStops />;
};
BusStopsPage.title = "Przystanki";

export default BusStopsPage;
