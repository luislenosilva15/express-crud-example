/*
  Warnings:

  - Added the required column `status` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `size` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductTypes" AS ENUM ('CLOTHES', 'SHOES');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('SOLD', 'AVAILABLE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" "ProductStatus" NOT NULL,
ADD COLUMN     "type" "ProductTypes" NOT NULL,
DROP COLUMN "size",
ADD COLUMN     "size" TEXT NOT NULL;

-- DropEnum
DROP TYPE "SIZE";
