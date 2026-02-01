-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "targeting" JSONB DEFAULT '{}';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "demographics" JSONB DEFAULT '{}';

-- CreateIndex
CREATE INDEX "Response_id_surveyId_idx" ON "Response"("id", "surveyId");

-- CreateIndex
CREATE INDEX "Response_id_participantId_idx" ON "Response"("id", "participantId");

-- CreateIndex
CREATE INDEX "Survey_creatorId_idx" ON "Survey"("creatorId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
