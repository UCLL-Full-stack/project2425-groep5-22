-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_gameId_fkey";

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "gameId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
