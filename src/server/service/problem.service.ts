import { type PrismaClient, type Prisma } from "@prisma/client";
import { v4 as uuid } from "uuid";

import type { TagService } from "./tag.service";
import { type BulkLanguagesProblem } from "../schema/problem-language.schema";
import {
  type CreateProblemDTO,
  type ProblemQueryDTO,
  type UpdateProblemDTO,
} from "../schema/problem.schema";

export class ProblemService {
  constructor(
    private prisma: PrismaClient,
    private tagService: TagService,
  ) {}

  async findAll(params: ProblemQueryDTO) {
    const where: Prisma.ProblemWhereInput = {
      deletedAt: null,
      ...(params.search && {
        title: { contains: params.search, mode: "insensitive" },
      }),
      ...(params.tags?.length && {
        problemsTags: { some: { tagId: { in: params.tags } } },
      }),
      ...(params.difficultyLevel?.length && {
        difficultyLevel: { in: params.difficultyLevel },
      }),
      ...(params.isPublic !== undefined && { isPublic: params.isPublic }),
    };

    const [data, total] = await Promise.all([
      this.prisma.problem.findMany({
        where,
        select: {
          problemId: true,
          title: true,
          difficultyLevel: true,
          isPublic: true,
          totalSubmissions: true,
          acceptedSubmissions: true,
          createdAt: true,
        },
        orderBy: {
          [params.orderBy || "createdAt"]: params.order || "desc",
        },
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
      }),
      this.prisma.problem.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string) {
    return this.prisma.problem.findFirst({
      where: { problemId: id, deletedAt: null },
      include: {
        problemTags: {
          include: {
            tag: {
              select: {
                tagId: true,
                tagName: true,
              },
            },
          },
        },
      },
    });
  }

  async create(data: CreateProblemDTO) {
    const { tags: problemTags, ...problemData } = data;
    const newId = uuid();

    await this.tagService.makeTagsExist(
      problemTags.map((tag) => ({
        tagName: tag.name!,
        tagId: tag.tagId,
        description: null,
      })),
    );

    return this.prisma.problem.create({
      data: {
        ...problemData,
        problemId: newId,
        problemTags: {
          create: problemTags.map((tag) => ({
            tag: { connect: { tagId: tag.tagId } },
          })),
        },
      },
    });
  }

  async update(id: string, data: UpdateProblemDTO) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const { tags: problemTags, ...problemData } = data;

    await this.tagService.makeTagsExist(
      (problemTags || []).map((tag) => ({
        tagName: tag.name!,
        tagId: tag.tagId,
        description: null,
      })),
    );

    const existingTagIds = existing.problemTags.map((t) => t.tagId);
    const newTagIds = (problemTags || []).map((t) => t.tagId);

    return this.prisma.problem.update({
      where: { problemId: id },
      data: {
        ...problemData,
        problemTags: {
          deleteMany: {
            tagId: {
              in: existingTagIds.filter((id) => !newTagIds.includes(id)),
            },
          },
          createMany: {
            data: (problemTags || [])
              .filter((tag) => !existingTagIds.includes(tag.tagId))
              .map((tag) => ({
                tagId: tag.tagId,
              })),
          },
        },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.problem.update({
      where: { problemId: id },
      data: { deletedAt: new Date() },
    });
  }

  async togglePublic(id: string) {
    const problem = await this.findById(id);
    if (!problem) return null;

    return this.prisma.problem.update({
      where: { problemId: id },
      data: { isPublic: !problem.isPublic },
    });
  }

  async getFullLanguagesWithStatusForProblem(problemId: string) {
    return this.prisma.language
      .findMany({
        where: {
          isActive: true,
          problemLanguages: { some: { problemId } },
        },
        select: {
          languageId: true,
          languageName: true,
          version: true,
          isActive: true,
          problemLanguages: {
            select: {
              timeLimitInMs: true,
              memoryLimitInKb: true,
            },
          },
        },
      })
      .then((languages) =>
        languages.map((lang) => ({
          languageId: lang.languageId,
          name: lang.languageName,
          version: lang.version,
          isActive: lang.isActive,
          timeLimitInMs: lang.problemLanguages[0]?.timeLimitInMs ?? null,
          memoryLimitInKb: lang.problemLanguages[0]?.memoryLimitInKb ?? null,
          isInProblem: lang.problemLanguages.length > 0,
        })),
      );
  }

  async getActiveLanguagesForProblem(problemId: string) {
    return this.prisma.language
      .findMany({
        where: {
          isActive: true,
          problemLanguages: { some: { problemId } },
        },
        select: {
          languageId: true,
          languageName: true,
          version: true,
          isActive: true,
          monacoCodeLanguage: true,
          templateCode: true,
          problemLanguages: {
            select: {
              timeLimitInMs: true,
              memoryLimitInKb: true,
              templateCode: true,
            },
          },
        },
      })
      .then((languages) =>
        languages.map((lang) => ({
          languageId: lang.languageId,
          name: lang.languageName,
          version: lang.version,
          isActive: lang.isActive,
          timeLimitInMs: lang.problemLanguages[0]?.timeLimitInMs ?? null,
          memoryLimitInKb: lang.problemLanguages[0]?.memoryLimitInKb ?? null,
          monacoCodeLanguage: lang.monacoCodeLanguage,
          templateCode:
            lang.problemLanguages[0]?.templateCode ?? lang.templateCode,
        })),
      );
  }

  async updateLanguagesForProblem(payload: BulkLanguagesProblem) {
    const { problemId, removeLanguage, addLanguage } = payload;

    await this.prisma.$transaction([
      this.prisma.problemLanguage.deleteMany({
        where: {
          problemId,
          languageId: { in: removeLanguage.map((l) => l.languageId) },
        },
      }),
      this.prisma.problemLanguage.createMany({
        data: addLanguage.map((lang) => ({
          problemId,
          languageId: lang.languageId,
          templateCode: lang.templateCode,
          timeLimitInMs: lang.timeLimitInMs,
          memoryLimitInKb: lang.memoryLimitInKb,
        })),
      }),
    ]);
  }

  async clearLanguagesForProblem(problemId: string) {
    return this.prisma.problemLanguage.deleteMany({
      where: { problemId },
    });
  }
  async getProblemTags() {
    return this.prisma.problemTag.findMany();
  }

  async createProblemTag(data: { problemId: string; tagId: string }) {
    return this.prisma.problemTag.create({
      data: {
        problem: { connect: { problemId: data.problemId } },
        tag: { connect: { tagId: data.tagId } },
      },
    });
  }

  async getBriefProblemById(id: string) {
    return this.prisma.problem.findFirst({
      where: { problemId: id },
      select: {
        problemId: true,
        title: true,
        difficultyLevel: true,
        isPublic: true,
        timeLimitInMs: true,
        memoryLimitInKb: true,
      },
    });
  }
}
export type LanguageOfProblem = Partial<
  Awaited<
    ReturnType<ProblemService["getFullLanguagesWithStatusForProblem"]>
  >[0] &
    Awaited<ReturnType<ProblemService["getActiveLanguagesForProblem"]>>[0]
>;
