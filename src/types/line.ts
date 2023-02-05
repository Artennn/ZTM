import type { Line as PrismaLine } from "server/trpc/router/line";
import type {
  BusStop as PrismaBusStop,
  Schedule as PrismaSchedule,
} from "@prisma/client";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type Line = PrismaLine;

export type Route = Line["routes"][number];

export type RouteEntry = Line["routes"][number]["entries"][number];

export type BusStop = PrismaBusStop;

export type NewRoute = {
  name: string;
  entries: Omit<RouteEntry, "routeID" | "busStopID">[];
};

export type Schedule = PrismaSchedule;

export type NewSchedule = Optional<Schedule, "id">;
