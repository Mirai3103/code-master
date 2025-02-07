import { createTRPCRouter, publicProcedure } from "../trpc";

export const permissionRouter = createTRPCRouter({
  getResources: publicProcedure.query(async ({ ctx }) => {
    return ctx.services.permission.getAllResources();
  }),

  getActions: publicProcedure.query(async ({ ctx }) => {
    return ctx.services.permission.getAllActions();
  }),
});
