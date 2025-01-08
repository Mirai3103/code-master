-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(100) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "hashPassword" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" VARCHAR(100) NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "Language" (
    "languageId" SERIAL NOT NULL,
    "languageName" VARCHAR(50) NOT NULL,
    "version" VARCHAR(50) NOT NULL,
    "sourceFileExt" VARCHAR(10) NOT NULL,
    "binaryFileExt" VARCHAR(10),
    "compileCommand" VARCHAR(100),
    "runCommand" VARCHAR(100) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "canDelete" BOOLEAN NOT NULL DEFAULT true,
    "monacoCodeLanguage" VARCHAR(50) DEFAULT 'plaintext',
    "templateCode" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Language_pkey" PRIMARY KEY ("languageId")
);

-- CreateTable
CREATE TABLE "Problem" (
    "problemId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" JSON,
    "problemStatement" JSON NOT NULL,
    "difficultyLevel" SMALLINT NOT NULL DEFAULT 1,
    "timeLimitInMs" INTEGER NOT NULL DEFAULT 10,
    "memoryLimitInKb" INTEGER NOT NULL DEFAULT 256,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "totalSubmissions" INTEGER NOT NULL DEFAULT 0,
    "acceptedSubmissions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),
    "createdBy" VARCHAR(100),
    "updatedBy" VARCHAR(100),
    "deletedBy" VARCHAR(100),

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("problemId")
);

-- CreateTable
CREATE TABLE "ProblemLanguage" (
    "problemId" UUID NOT NULL,
    "languageId" INTEGER NOT NULL,
    "templateCode" TEXT,
    "timeLimitInMs" INTEGER NOT NULL DEFAULT 10,
    "memoryLimitInKb" INTEGER NOT NULL DEFAULT 256,

    CONSTRAINT "ProblemLanguage_ProblemId_LanguageId_pk" PRIMARY KEY ("problemId","languageId")
);

-- CreateTable
CREATE TABLE "ProblemTag" (
    "problemId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "ProblemTag_ProblemId_TagId_pk" PRIMARY KEY ("problemId","tagId")
);

-- CreateTable
CREATE TABLE "Submission" (
    "submissionId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "problemId" UUID NOT NULL,
    "languageId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "timeExecutionInMs" INTEGER NOT NULL,
    "memoryUsageInKb" INTEGER NOT NULL DEFAULT 256,
    "submissionTime" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),
    "createdBy" VARCHAR(100),
    "updatedBy" VARCHAR(100),
    "deletedBy" VARCHAR(100),

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("submissionId")
);

-- CreateTable
CREATE TABLE "SubmissionTestcase" (
    "submissionId" UUID NOT NULL,
    "testcaseId" UUID NOT NULL,
    "status" VARCHAR(100) NOT NULL,
    "stdout" TEXT,
    "problemId" UUID NOT NULL,
    "runtimeInMs" INTEGER NOT NULL DEFAULT 10,
    "memoryUsedInKb" INTEGER NOT NULL DEFAULT 256,

    CONSTRAINT "SubmissionTestcase_SubmissionId_TestcaseId_pk" PRIMARY KEY ("submissionId","testcaseId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "tagId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tagName" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(100),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tagId")
);

-- CreateTable
CREATE TABLE "Testcase" (
    "testCaseId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "problemId" UUID NOT NULL,
    "inputData" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "points" SMALLINT NOT NULL DEFAULT 0,
    "label" VARCHAR(50),
    "explanation" JSON,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),
    "createdBy" VARCHAR(100),
    "updatedBy" VARCHAR(100),
    "deletedBy" VARCHAR(100),

    CONSTRAINT "Testcase_pkey" PRIMARY KEY ("testCaseId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "Authenticator"("credentialID");

-- CreateIndex
CREATE UNIQUE INDEX "Language_LanguageName_Unique" ON "Language"("languageName");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemLanguage" ADD CONSTRAINT "ProblemLanguage_LanguageId_Language_LanguageId_fk" FOREIGN KEY ("languageId") REFERENCES "Language"("languageId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemLanguage" ADD CONSTRAINT "ProblemLanguage_ProblemId_Problem_ProblemId_fk" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemTag" ADD CONSTRAINT "ProblemTag_ProblemId_Problem_ProblemId_fk" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemTag" ADD CONSTRAINT "ProblemTag_TagId_Tag_TagId_fk" FOREIGN KEY ("tagId") REFERENCES "Tag"("tagId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_ProblemId_Problem_ProblemId_fk" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubmissionTestcase" ADD CONSTRAINT "SubmissionTestcase_ProblemId_Problem_ProblemId_fk" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionTestcase" ADD CONSTRAINT "SubmissionTestcase_SubmissionId_Submission_SubmissionId_fk" FOREIGN KEY ("submissionId") REFERENCES "Submission"("submissionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testcase" ADD CONSTRAINT "Testcase_ProblemId_Problem_ProblemId_fk" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE CASCADE ON UPDATE CASCADE;
