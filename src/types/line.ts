import type { Line as PrismaFullLine } from "server/trpc/router/line";
import type {
  Line as PrismaLine,
  Route as PrismaRoute,
  BusStop as PrismaBusStop,
  Schedule as PrismaSchedule,
} from "@prisma/client";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type Line = PrismaLine;
export type FullLine = PrismaFullLine;

export type Route = PrismaRoute;
export type FullRoute = FullLine["routes"][number];

export type RouteEntry = FullLine["routes"][number]["entries"][number];

export type BusStop = PrismaBusStop;

export type NewRoute = {
  name: string;
  entries: Omit<RouteEntry, "routeID" | "busStopID">[];
};

export type Schedule = PrismaSchedule;

export type NewSchedule = Optional<Schedule, "id">;
