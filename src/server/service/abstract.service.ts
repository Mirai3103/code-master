import { type PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/util/getCurrentUser";

export default abstract class AbstractService {
  protected readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async getCurrentUserId() {
    return await getCurrentUser();
  }
}
