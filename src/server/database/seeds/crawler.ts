import axios from "axios";
import PQueue from "p-queue";
import { v4 as uuidv4 } from "uuid";
import { Mutex } from "async-mutex";
import { generateJSON } from "@tiptap/html";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import { PrismaClient, Problem, ProblemTag, Tag } from "@prisma/client";
import { readFileSync } from "fs";

const prisma = new PrismaClient();
const queue = new PQueue({ concurrency: 1 });

export interface ProblemsResponse {
  totalQuestions: number;
  count: number;
  problemsetQuestionList: ProblemsetQuestionList[];
}

export interface ProblemsetQuestionList {
  acRate: number;
  difficulty: Difficulty;
  freqBar: null;
  questionFrontendId: string;
  isFavor: boolean;
  isPaidOnly: boolean;
  status: null;
  title: string;
  titleSlug: string;
  topicTags: TopicTag[];
  hasSolution: boolean;
  hasVideoSolution: boolean;
}

export enum Difficulty {
  Easy = "Easy",
  Hard = "Hard",
  Medium = "Medium",
}

const difficulties = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

export interface TopicTag {
  name: string;
  id?: string;
  slug: string;
  translatedName?: null;
}

export interface ProblemDetail {
  link: string;
  questionId: string;
  questionFrontendId: string;
  questionTitle: string;
  titleSlug: string;
  difficulty: string;
  isPaidOnly: boolean;
  question: string;
  exampleTestcases: string;
  topicTags: TopicTag[];
  hints: string[];
  solution: Solution;
  companyTagStats: null;
  likes: number;
  dislikes: number;
  similarQuestions: string;
}

export interface Solution {
  id: string;
  canSeeDetail: boolean;
  paidOnly: boolean;
  hasVideoSolution: boolean;
  paidOnlyVideo: boolean;
}

const mutex = new Mutex();

async function saveTags(tags: TopicTag[]): Promise<Tag[]> {
  const newTags: Tag[] = tags.map((tag) => {
    return {
      tagId: uuidv4(),
      tagName: tag.name,
      createdAt: new Date(),
      createdBy: null,
      description: null,
    };
  });

  const release = await mutex.acquire();
  try {
    // Use Promise.all to wait for all async operations to complete
    await Promise.all(
      newTags.map(async (newTag) => {
        const exist = await prisma.tag.findFirst({
          where: { tagName: newTag.tagName },
        });
        if (!exist) {
          await prisma.tag.create({
            data: {
              tagId: newTag.tagId,
              tagName: newTag.tagName,
              createdAt: newTag.createdAt,
              description: newTag.description,
              createdBy: newTag.createdBy,
            },
          });
        } else {
          newTag.tagId = exist.tagId;
        }
      }),
    );
  } finally {
    release();
  }

  return newTags;
}

const extensions = [
  Blockquote.configure({ HTMLAttributes: { class: "blockquote" } }),
  Bold,
  BulletList,
  Code,
  CodeBlock.configure({ HTMLAttributes: { class: "code-block" } }),
  Color,
  Document,
  HardBreak,
  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  HorizontalRule,
  Italic,
  ListItem,
  OrderedList,
  Paragraph,
  Strike,
  Text,
  TextAlign,
  TextStyle,
  Typography,
];

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getProblemsDetail(
  briefProblem: ProblemsetQuestionList,
): Promise<Partial<Problem>> {
  try {
    await sleep(1000);
    const response = await axios.get<ProblemDetail>(
      `https://alfa-leetcode-api.onrender.com/select?titleSlug=${briefProblem.titleSlug}`,
    );

    const rest = {
      title: response.data.questionTitle,
      createdAt: new Date(),
      difficultyLevel: difficulties[briefProblem.difficulty],
      problemStatement: generateJSON(response.data.question, extensions),
      description: generateJSON(
        response.data.hints.map((hint) => `<p>${hint}</p>`).join(""),
        extensions,
      ),
    };

    const exitsTitle = await prisma.problem.findFirst({
      where: { title: rest.title },
    });

    if (exitsTitle) {
      return rest;
    }

    const tags = await saveTags(response.data.topicTags);

    const newProb = await prisma.problem.create({
      data: rest,
    });

    const problemTags: ProblemTag[] = tags.map((tag) => {
      return {
        problemId: newProb.problemId,
        tagId: tag.tagId,
      };
    });

    await prisma.problemTag.createMany({
      data: problemTags,
      skipDuplicates: true,
    });

    const availableLanguages = await prisma.language.findMany();
    prisma.problemLanguage.createMany({
      data: availableLanguages.map((language) => ({
        languageId: language.languageId,
        problemId: newProb.problemId,
      })),
    });

    return rest;
  } catch (error) {
    console.error(`Error fetching problem ${briefProblem.titleSlug}:`, error);
    throw error;
  }
}

async function main() {
  try {
    // Uncomment to fetch from API instead of using local file
    // const response = await axios.get<ProblemsResponse>(
    //   "https://alfa-leetcode-api.onrender.com/problems?skip=40&limit=100",
    // );
    // const briefProblems = response.data.problemsetQuestionList;

    // Use a relative path or environment variable for the file path
    const filePath =
      process.env.PROBLEMS_JSON_PATH ||
      "C:/Users/BaoBao/Downloads/problems.json";
    console.log(`Reading problems from ${filePath}`);

    const problemsData = JSON.parse(
      readFileSync(filePath, "utf-8"),
    ) as ProblemsResponse;

    const briefProblems = problemsData.problemsetQuestionList;

    // Add items to queue with proper error handling
    for (const briefProblem of briefProblems) {
      queue.add(() =>
        getProblemsDetail(briefProblem).catch((err) => {
          console.error(
            `Failed to process problem ${briefProblem.titleSlug}:`,
            err,
          );
        }),
      );
    }

    await queue.onIdle();
    console.log("All problems processed successfully");
  } catch (error) {
    console.error("Error in main function:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => console.log("Done"))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
