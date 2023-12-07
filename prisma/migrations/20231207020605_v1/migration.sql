-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "password" TEXT,
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

-- CreateTable
CREATE TABLE "UserRemember" (
    "rememberToken" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "device" TEXT,
    "disableDate" DATETIME
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "category" TEXT,
    "pin" INTEGER,
    "noindex" BOOLEAN,
    "draft" BOOLEAN,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update" DATETIME,
    "flags" INTEGER,
    "memo" TEXT,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Posts_userId_fkey" ON "Post"("userId");
