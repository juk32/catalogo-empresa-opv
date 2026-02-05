/*
  Warnings:

  - A unique constraint covering the columns `[startAt,endAt]` on the table `DeliverySlot` will be added. If there are existing duplicate values, this will fail.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "byUser" TEXT NOT NULL,
    "at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    CONSTRAINT "OrderAudit_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_OrderAudit" ("action", "at", "byUser", "id", "note", "orderId") SELECT "action", "at", "byUser", "id", "note", "orderId" FROM "OrderAudit";
DROP TABLE "OrderAudit";
ALTER TABLE "new_OrderAudit" RENAME TO "OrderAudit";
CREATE INDEX "OrderAudit_orderId_idx" ON "OrderAudit"("orderId");
CREATE INDEX "OrderAudit_at_idx" ON "OrderAudit"("at");
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitPrice" REAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'PZ',
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "name", "orderId", "productId", "qty", "unit", "unitPrice") SELECT "id", "name", "orderId", "productId", "qty", "unit", "unitPrice" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "DeliverySlot_startAt_idx" ON "DeliverySlot"("startAt");

-- CreateIndex
CREATE INDEX "DeliverySlot_active_idx" ON "DeliverySlot"("active");

-- CreateIndex
CREATE UNIQUE INDEX "DeliverySlot_startAt_endAt_key" ON "DeliverySlot"("startAt", "endAt");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "Order_deletedAt_idx" ON "Order"("deletedAt");
