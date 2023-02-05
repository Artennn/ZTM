import { router } from "../trpc";
import { busStopRouter } from "./busStop";
import { lineRouter } from "./line";
import { scheduleRouter } from "./schedule";

export const appRouter = router({
  busStop: busStopRouter,
  line: lineRouter,
  schedule: scheduleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
