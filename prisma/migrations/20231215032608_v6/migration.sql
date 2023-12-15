-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "pin" INTEGER NOT NULL DEFAULT 0,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "draft" BOOLEAN NOT NULL DEFAULT false,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "flags" INTEGER,
    "memo" TEXT,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("body", "category", "date", "draft", "flags", "id", "memo", "noindex", "pin", "postId", "title", "updatedAt", "userId") SELECT "body", "category", "date", "draft", "flags", "id", "memo", "noindex", coalesce("pin", 0) AS "pin", "postId", "title", "updatedAt", "userId" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE INDEX "Posts_userId_fkey" ON "Post"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
