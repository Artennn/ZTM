import { router } from "../trpc";
import { busStopRouter } from "./busStop";
import { lineRouter } from "./line";
import { scheduleRouter } from "./schedule";
import { vehicleRouter } from "./vehicle";

export const appRouter = router({
  busStop: busStopRouter,
  line: lineRouter,
  schedule: scheduleRouter,
  vehicle: vehicleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
