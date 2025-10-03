/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `Credential` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Credential_userId_type_key" ON "public"."Credential"("userId", "type");
