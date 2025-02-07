import AbstractService from "./abstract.service";
import { type PrismaClient } from "@prisma/client";

export class PermissionService extends AbstractService {
  constructor(db: PrismaClient) {
    super(db);
  }

  public getAllResources() {
    return this.prisma.resource.findMany({
      select: {
        resourceId: true,
        resourceName: true,
        fields: true,
        description: true,
      },
    });
  }
  public getAllActions() {
    return this.prisma.action.findMany({
      select: {
        actionId: true,
        actionName: true,
        description: true,
      },
    });
  }
}
