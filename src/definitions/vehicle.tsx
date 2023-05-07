import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import NoTransferIcon from "@mui/icons-material/NoTransfer";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { VehicleStatus } from "@prisma/client";

export type Status = VehicleStatus;

export const Statuses: Status[] = ["enroute", "parked", "service", "emergency"];

type Defitinition = Record<
  Status,
  {
    label: string;
    Icon: JSX.Element;
  }
>;

export const Definitions: Defitinition = {
  enroute: {
    label: "W trasie",
    Icon: <AirportShuttleIcon color="success" />,
  },
  parked: {
    label: "Zaparkowany",
    Icon: <LocalParkingIcon color="info" />,
  },
  service: {
    label: "Trasa serwisowa",
    Icon: <NoTransferIcon color="warning" />,
  },
  emergency: {
    label: "Awaria",
    Icon: <WarningAmberIcon color="error" />,
  },
};