/*
  Warnings:

  - A unique constraint covering the columns `[intensity]` on the table `Intensity` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Intensity_intensity_key" ON "Intensity"("intensity");
