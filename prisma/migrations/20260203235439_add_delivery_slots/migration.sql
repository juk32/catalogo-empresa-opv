/*
  Warnings:

  - You are about to drop the column `date` on the `DeliverySlot` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `DeliverySlot` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `DeliverySlot` table. All the data in the column will be lost.
  - You are about to drop the column `window` on the `DeliverySlot` table. All the data in the column will be lost.
  - Added the required column `endAt` to the `DeliverySlot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `DeliverySlot` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_deletedAt_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DeliverySlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "capacity" INTEGER NOT NULL DEFAULT 999,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_DeliverySlot" ("createdAt", "id") SELECT "createdAt", "id" FROM "DeliverySlot";
DROP TABLE "DeliverySlot";
ALTER TABLE "new_DeliverySlot" RENAME TO "DeliverySlot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
