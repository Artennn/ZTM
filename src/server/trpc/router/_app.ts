import { router } from "../trpc";
import { busStopRouter } from "./busStop";
import { lineRouter } from "./line";

export const appRouter = router({
  busStop: busStopRouter,
  line: lineRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
