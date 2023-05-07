import { createTheme } from "@mui/material";

import { Roboto } from "@next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const RouteColors = [
  "green",
  "blue",
  "red",
  "yellow",
  "orange",
  "purple",
];

export type MuiColor =
  | "inherit"
  | "action"
  | "disabled"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

declare module "@mui/material/styles" {
  interface ThemeOptions {
    gradient: {
      primary: string;
      hover: string;
      selected: string;
    };
    border: {
      primary: string;
    };
  }

  interface Theme {
    gradient: ThemeOptions["gradient"];
    border: ThemeOptions["border"];
  }
}

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  gradient: {
    primary:
      "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))",
    hover:
      "linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.3))",
    selected:
      "linear-gradient(rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.2))",
  },
  border: {
    primary: "2px solid grey",
  },
});