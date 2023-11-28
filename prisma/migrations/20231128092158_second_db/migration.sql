/*
  Warnings:

  - A unique constraint covering the columns `[postId]` on the table `Posts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Posts_postId_key` ON `Posts`(`postId`);
