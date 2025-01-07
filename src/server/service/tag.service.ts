// src/server/services/tag.service.ts
import { type PrismaClient, type Prisma } from "@prisma/client";
import AbstractService from "./abstract.service";
import { v4 as uuidv4 } from "uuid";
import { type PaginationQuery } from "../schema/pagination.schema";
import { type CreateTagDTO, type UpdateTagDTO } from "../schema/tag.schema";
export class TagService extends AbstractService {
  constructor(db: PrismaClient) {
    super(db);
  }

  async findAll(params: PaginationQuery & { search?: string }) {
    const whereClause: Prisma.TagWhereInput = params.search
      ? {
          tagName: {
            contains: params.search,
            mode: "insensitive",
          },
        }
      : {};

    const orderField = params.orderBy || "createdAt"; // Trường mặc định
    const orderDirection = params.order || "asc"; // Hướng mặc định

    const [data, total] = await Promise.all([
      this.prisma.tag.findMany({
        where: whereClause,
        orderBy: {
          [orderField]: orderDirection,
        },
        take: params.pageSize,
        skip: (params.page - 1) * params.pageSize,
      }),
      this.prisma.tag.count({
        where: whereClause,
      }),
    ]);

    return {
      data,
      total,
    };
  }

  async findByName(tagName: string) {
    return this.prisma.tag.findFirst({
      where: {
        tagName: tagName,
      },
    });
  }

  async create(data: CreateTagDTO) {
    return this.prisma.tag.create({
      data: {
        tagName: data.tagName,
        tagId: data.tagId || uuidv4(),
        description: data.description,
      },
    });
  }

  async update(tagId: string, data: UpdateTagDTO) {
    return this.prisma.tag.update({
      where: {
        tagId: tagId,
      },
      data,
    });
  }

  async delete(tagId: string) {
    return this.prisma.tag.delete({
      where: {
        tagId: tagId,
      },
    });
  }

  async makeTagsExist(newTags: CreateTagDTO[]) {
    if (!newTags.length) {
      return [];
    }

    const tagIds = newTags.map((tag) => tag.tagId!);
    const existTags = await this.prisma.tag.findMany({
      where: {
        tagId: {
          in: tagIds,
        },
      },
    });

    const notExistTags = newTags.filter(
      (tag) => !existTags.find((t) => t.tagId === tag.tagId),
    );

    if (notExistTags.length) {
      await this.prisma.tag.createMany({
        data: notExistTags.map((tag) => ({
          tagId: tag.tagId!,
          tagName: tag.tagName,
        })),
      });
    }

    return newTags;
  }
}
