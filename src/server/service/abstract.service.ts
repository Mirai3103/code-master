import { type PrismaClient } from "@prisma/client";

export default abstract class AbstractService {
  protected readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
