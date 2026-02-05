/*
  Warnings:

  - You are about to drop the `DeliverySlot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `deliverySlotId` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "DeliverySlot_startAt_endAt_key";

-- DropIndex
DROP INDEX "DeliverySlot_active_idx";

-- DropIndex
DROP INDEX "DeliverySlot_startAt_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "DeliverySlot";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folioNumber" INTEGER NOT NULL,
    "folio" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT,
    "deliveredAt" DATETIME,
    "deliveredBy" TEXT,
    "deletedAt" DATETIME,
    "deliveryAt" DATETIME
);
INSERT INTO "new_Order" ("createdAt", "createdBy", "customerName", "deletedAt", "deliveredAt", "deliveredBy", "deliveryAt", "folio", "folioNumber", "id", "status", "updatedAt", "updatedBy") SELECT "createdAt", "createdBy", "customerName", "deletedAt", "deliveredAt", "deliveredBy", "deliveryAt", "folio", "folioNumber", "id", "status", "updatedAt", "updatedBy" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_folioNumber_key" ON "Order"("folioNumber");
CREATE UNIQUE INDEX "Order_folio_key" ON "Order"("folio");
CREATE TABLE "new_OrderAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "byUser" TEXT NOT NULL,
    "at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    CONSTRAINT "OrderAudit_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderAudit" ("action", "at", "byUser", "id", "note", "orderId") SELECT "action", "at", "byUser", "id", "note", "orderId" FROM "OrderAudit";
DROP TABLE "OrderAudit";
ALTER TABLE "new_OrderAudit" RENAME TO "OrderAudit";
CREATE INDEX "OrderAudit_orderId_idx" ON "OrderAudit"("orderId");
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitPrice" REAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'PZ',
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "name", "orderId", "productId", "qty", "unit", "unitPrice") SELECT "id", "name", "orderId", "productId", "qty", "unit", "unitPrice" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
