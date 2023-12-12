/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "hashedPassword" TEXT,
    "icon" TEXT,
    "point" INTEGER,
    "bio" TEXT,
    "link" TEXT,
    "description" TEXT,
    "authority" TEXT,
    "birthday" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "accessedAt" DATETIME,
    "lastLogin" DATETIME
);
INSERT INTO "new_User" ("accessedAt", "authority", "bio", "birthday", "createdAt", "description", "email", "emailVerified", "icon", "id", "lastLogin", "link", "name", "point", "updatedAt", "userId") SELECT "accessedAt", "authority", "bio", "birthday", "createdAt", "description", "email", "emailVerified", "icon", "id", "lastLogin", "link", "name", "point", "updatedAt", "userId" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
