import SignalWifi3BarIcon from "@mui/icons-material/SignalWifi3Bar";
import SignalWifiStatusbarConnectedNoInternet4Icon from "@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";

import type { MuiColor } from "styles/theme";
import type { SvgIconComponent } from "@mui/icons-material";

export const Statuses = ["online", "error", "offline"] as const;

export type Status = typeof Statuses[number];

type Defitinition = Record<
  Status,
  {
    label: string;
    color: MuiColor;
    Icon: SvgIconComponent;
  }
>;

export const Definitions: Defitinition = {
  online: {
    label: "Online",
    color: "success",
    Icon: SignalWifi3BarIcon,
  },
  error: {
    label: "Awaria",
    color: "warning",
    Icon: SignalWifiStatusbarConnectedNoInternet4Icon,
  },
  offline: {
    label: "Offline",
    color: "error",
    Icon: SignalWifiOffIcon,
  },
};
