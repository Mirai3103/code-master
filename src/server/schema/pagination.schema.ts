import z from "zod";

export const paginationQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  orderBy: z.string().nullish(),
  order: z.enum(["asc", "desc"]).nullish(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export class Paginated<T> {
  public data: T[] = [];
  public total = 0;
  public page = 1;
}
