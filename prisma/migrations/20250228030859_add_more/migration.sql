-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "hints" JSON;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "problemContestId" UUID;

-- CreateTable
CREATE TABLE "Profile" (
    "id" VARCHAR(100) NOT NULL,
    "bio" TEXT,
    "image" TEXT,
    "gender" TEXT,
    "location" TEXT,
    "birthdate" DATE,
    "website" TEXT,
    "github" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "works" JSONB,
    "education" JSONB,
    "skills" JSONB,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "globalPoints" INTEGER NOT NULL DEFAULT 0,
    "totalSolved" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "contestId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "totalParticipants" INTEGER NOT NULL DEFAULT 0,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "details" JSONB,
    "prices" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "status" VARCHAR(50) NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("contestId")
);

-- CreateTable
CREATE TABLE "ProblemContest" (
    "id" UUID NOT NULL,
    "contestId" UUID NOT NULL,
    "problemId" UUID NOT NULL,

    CONSTRAINT "ProblemContest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "contestId" UUID NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER NOT NULL DEFAULT 0,
    "totalTime" INTEGER NOT NULL DEFAULT 0,
    "totalSolved" INTEGER NOT NULL DEFAULT 0,
    "submissionAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leaderboard_ContestId_UserId_pk" PRIMARY KEY ("contestId","userId")
);

-- CreateTable
CREATE TABLE "ContestParticipant" (
    "contestId" UUID NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "registerAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContestParticipant_ContestId_UserId_pk" PRIMARY KEY ("contestId","userId")
);

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_ProblemContestId_ProblemContest_ProblemContestId_fk" FOREIGN KEY ("problemContestId") REFERENCES "ProblemContest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProblemContest" ADD CONSTRAINT "ProblemContest_ProblemId_Problem_ProblemId_fk" FOREIGN KEY ("problemId") REFERENCES "Problem"("problemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemContest" ADD CONSTRAINT "ProblemContest_ContestId_Contest_ContestId_fk" FOREIGN KEY ("contestId") REFERENCES "Contest"("contestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Leaderboard" ADD CONSTRAINT "Leaderboard_ContestId_Contest_ContestId_fk" FOREIGN KEY ("contestId") REFERENCES "Contest"("contestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_ContestId_Contest_ContestId_fk" FOREIGN KEY ("contestId") REFERENCES "Contest"("contestId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_UserId_User_Id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
