-- AlterTable
ALTER TABLE "Testcase" ADD COLUMN     "index" SMALLINT NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_LanguageId_Language_LanguageId_fk" FOREIGN KEY ("languageId") REFERENCES "Language"("languageId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "SubmissionTestcase" ADD CONSTRAINT "SubmissionTestcase_TestcaseId_Testcase_TestCaseId_fk" FOREIGN KEY ("testcaseId") REFERENCES "Testcase"("testCaseId") ON DELETE CASCADE ON UPDATE CASCADE;
