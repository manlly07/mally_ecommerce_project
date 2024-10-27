/*
  Warnings:

  - A unique constraint covering the columns `[user_public_key]` on the table `user_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_private_key]` on the table `user_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_private_key` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_public_key` to the `user_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_tokens` ADD COLUMN `user_private_key` VARCHAR(255) NOT NULL,
    ADD COLUMN `user_public_key` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_tokens_user_public_key_key` ON `user_tokens`(`user_public_key`);

-- CreateIndex
CREATE UNIQUE INDEX `user_tokens_user_private_key_key` ON `user_tokens`(`user_private_key`);
