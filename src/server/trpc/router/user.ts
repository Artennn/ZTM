import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  get: protectedProcedure
    .input(z.string())
    //prettier-ignore
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input,
        },
        select: {
          username: true,
        }
      })
      return user;
    }),
});
