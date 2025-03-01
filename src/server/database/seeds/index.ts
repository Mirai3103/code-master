import { PrismaClient, Language, Tag } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // await reset(db, { problem, tags, languages });
  await prisma.problem.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.language.deleteMany();
  const listLanguage: Omit<Language, "languageId">[] = [];
  listLanguage.push({
    languageName: "Python",
    sourceFileExt: ".py",
    binaryFileExt: null,
    compileCommand: null,
    runCommand: "python3 $SourceFileName",
    version: "3.8",
    canDelete: false,
    isActive: true,
    monacoCodeLanguage: "python",
    templateCode: `# Write your code here`,
  });
  listLanguage.push({
    languageName: "Go",
    sourceFileExt: ".go",
    binaryFileExt: ".out",
    compileCommand: "go build -o $BinaryFileName $SourceFileName",
    runCommand: "$BinaryFileName",
    version: "1.16",
    canDelete: false,
    isActive: true,
    monacoCodeLanguage: "go",
    templateCode: `package main`,
  });
  listLanguage.push({
    languageName: "Node.js",
    sourceFileExt: ".js",
    binaryFileExt: null,
    compileCommand: null,
    runCommand: "node $SourceFileName",
    version: "14",
    canDelete: false,
    isActive: true,
    monacoCodeLanguage: "javascript",
    templateCode: `// Write your code here`,
  });
  listLanguage.push({
    languageName: "Shell",
    sourceFileExt: ".sh",
    binaryFileExt: null,
    compileCommand: null,
    runCommand: "/bin/bash $SourceFileName",
    version: "5",
    canDelete: false,
    isActive: true,
    monacoCodeLanguage: "shell",
    templateCode: `# Write your code here`,
  });
  listLanguage.push({
    languageName: "C++",
    sourceFileExt: ".cpp",
    binaryFileExt: ".out",
    compileCommand: "g++ -o $BinaryFileName $SourceFileName",
    runCommand: "$BinaryFileName",
    version: "11",
    canDelete: false,
    isActive: true,
    monacoCodeLanguage: "cpp",
    templateCode: `#include <iostream>`,
  });
  await prisma.language.createMany({
    data: listLanguage,
    skipDuplicates: true,
  });

  const listTag: Omit<
    Tag,
    "tagId" | "createdBy" | "description" | "createdAt"
  >[] = [];
  listTag.push({
    tagName: "Mảng",
  });
  listTag.push({
    tagName: "Chuỗi",
  });
  listTag.push({
    tagName: "Qui hoạch động",
  });
  listTag.push({
    tagName: "Toán học",
  });
  listTag.push({
    tagName: "Tham lam",
  });
  listTag.push({
    tagName: "Cây",
  });
  listTag.push({
    tagName: "Đồ thị",
  });
  listTag.push({
    tagName: "Tìm kiếm theo chiều sâu(DFS)",
  });
  listTag.push({
    tagName: "Tìm kiếm theo chiều rộng(BFS)",
  });
  listTag.push({
    tagName: "Quay lui",
  });
  listTag.push({
    tagName: "Bit Manipulation",
  });
  // await prisma.tag.createMany({
  //   data: listTag,
  //   skipDuplicates: true,
  // });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
