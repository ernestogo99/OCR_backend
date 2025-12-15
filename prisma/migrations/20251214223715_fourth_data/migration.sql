-- CreateEnum
CREATE TYPE "OcrStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'ERROR');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "ocrStatus" "OcrStatus" NOT NULL DEFAULT 'PENDING';
