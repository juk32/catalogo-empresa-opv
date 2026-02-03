-- CreateTable
CREATE TABLE "DeliverySlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "window" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

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
    "deliverySlotId" TEXT,
    CONSTRAINT "Order_deliverySlotId_fkey" FOREIGN KEY ("deliverySlotId") REFERENCES "DeliverySlot" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "createdBy", "customerName", "deletedAt", "deliveredAt", "deliveredBy", "folio", "folioNumber", "id", "status", "updatedAt", "updatedBy") SELECT "createdAt", "createdBy", "customerName", "deletedAt", "deliveredAt", "deliveredBy", "folio", "folioNumber", "id", "status", "updatedAt", "updatedBy" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_folioNumber_key" ON "Order"("folioNumber");
CREATE UNIQUE INDEX "Order_folio_key" ON "Order"("folio");
CREATE INDEX "Order_deliverySlotId_idx" ON "Order"("deliverySlotId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "DeliverySlot_date_idx" ON "DeliverySlot"("date");

-- CreateIndex
CREATE INDEX "DeliverySlot_enabled_idx" ON "DeliverySlot"("enabled");
