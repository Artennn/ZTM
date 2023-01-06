import { Line as PrismaLine } from "server/trpc/router/line";
import { BusStop as PrismaBusStop } from "@prisma/client";

export type Line = PrismaLine;

export type Route = Line["routes"][number];

export type RouteEntry = Line["routes"][number]["entries"][number];

export type BusStop = PrismaBusStop;

export type NewRoute = {
  name: string;
  entries: Omit<RouteEntry, "routeID" | "busStopID">[];
};
