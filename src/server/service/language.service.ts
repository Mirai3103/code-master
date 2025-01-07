import type { PaginationQuery } from "@/server/schema/pagination.schema";
import AbstractService from "./abstract.service";
import { type PrismaClient, type Prisma } from "@prisma/client";
import {
  type CreateLanguageDTO,
  type UpdateLanguageDTO,
} from "../schema/language.schema";

export class LanguageService extends AbstractService {
  constructor(db: PrismaClient) {
    super(db);
  }
  async findAll(params: PaginationQuery & { search?: string }) {
    const whereClause: Prisma.LanguageWhereInput = params.search
      ? {
          languageName: {
            contains: params.search,
            mode: "insensitive",
          },
        }
      : {};

    const orderField = params.orderBy || "languageName";
    const orderDirection = params.order || "asc";

    // Lấy dữ liệu
    const [data, total] = await Promise.all([
      this.prisma.language.findMany({
        where: whereClause,
        orderBy: {
          [orderField]: orderDirection,
        },
        take: params.pageSize,
        skip: (params.page - 1) * params.pageSize,
      }),

      this.prisma.language.count({
        where: whereClause,
      }),
    ]);

    return {
      data,
      total,
    };
  }

  async findByName(name: string) {
    return this.prisma.language.findUnique({
      where: {
        languageName: name,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.language.findUnique({
      where: {
        languageId: id,
      },
    });
  }

  async create(data: CreateLanguageDTO) {
    return this.prisma.language.create({
      data,
    });
  }

  async update(id: number, data: UpdateLanguageDTO) {
    return this.prisma.language.update({
      where: {
        languageId: id,
      },
      data,
    });
  }

  async delete(id: number) {
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    return this.prisma.language.delete({
      where: {
        languageId: id,
      },
    });
  }

  async toggleActive(id: number) {
    const existing = await this.findById(id);

    if (!existing) {
      return null;
    }

    return this.prisma.language.update({
      where: {
        languageId: id,
      },
      data: {
        isActive: !existing.isActive,
      },
    });
  }
}
