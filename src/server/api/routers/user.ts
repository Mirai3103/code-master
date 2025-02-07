import { userQuerySchema } from "@/server/schema/user.schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure
    .input(userQuerySchema)
    .query(async ({ ctx, input }) => {
      const users = await ctx.services.user.getAllUsers(input);
      return users;
    }),
});
