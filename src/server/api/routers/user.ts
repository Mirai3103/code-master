import {
  editUserRolesSchema,
  userQuerySchema,
} from "@/server/schema/user.schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure
    .input(userQuerySchema)
    .query(async ({ ctx, input }) => {
      const users = await ctx.services.user.getAllUsers(input);
      return users;
    }),
  getUserRoleIds: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.services.user.getUserRoleIds(input.userId);
      return user;
    }),
  addRoleToUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        roleIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.services.user.addRolesToUser(input.userId, input.roleIds);
    }),

  saveUserPerms: publicProcedure
    .input(editUserRolesSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.services.user.saveUserPerms(input);
    }),
});
