CREATE TABLE `user_role`(
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `role_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    PRIMARY KEY(`role_id`)
);
CREATE TABLE `user`(
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_name` VARCHAR(255) NOT NULL,
    `user_avatar` VARCHAR(255) NOT NULL,
    `user_phone` VARCHAR(255) NOT NULL,
    `user_email` VARCHAR(255) NOT NULL,
    `user_gender` TINYINT NOT NULL,
    `user_birthday` TIMESTAMP NOT NULL,
    `user_password` VARCHAR(255) NOT NULL,
    `user_salt` VARCHAR(255) NOT NULL,
    `is_authenticated` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `categories`(
    `category_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `parent_id` BIGINT NOT NULL,
    `category_name` BIGINT NOT NULL,
    `category_description` VARCHAR(255) NOT NULL,
    `category_status` ENUM('') NOT NULL,
    `has_child_active` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NOT NULL
);
CREATE TABLE `sku`(
    `sku_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `spu_id` BIGINT NOT NULL,
    `sku_tier_idx` JSON NOT NULL,
    `sku_default` BOOLEAN NOT NULL,
    `sku_slug` VARCHAR(255) NOT NULL,
    `sku_price` DECIMAL(8, 2) NOT NULL,
    `sku_stock` BIGINT NOT NULL,
    `isDraft` BOOLEAN NOT NULL,
    `isPublish` BOOLEAN NOT NULL,
    `isDeleted` BOOLEAN NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `user_token`(
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_refresh_token` VARCHAR(255) NOT NULL,
    `user_login_time` TIMESTAMP NOT NULL,
    `user_login_ip` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `expiration` TIMESTAMP NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `user_agent` VARCHAR(255) NOT NULL,
    `user_user_public_key` VARCHAR(255) NOT NULL,
    `user_private_key` VARCHAR(255) NOT NULL
);
CREATE TABLE `role_permission`(
    `role_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `permission_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    PRIMARY KEY(`permission_id`)
);
CREATE TABLE `order_detail`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `oder_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL
);
CREATE TABLE `user_address`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `district` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT 'now()',
    `updated_at` TIMESTAMP NOT NULL DEFAULT 'now()',
    `is_deleted` BOOLEAN NOT NULL DEFAULT '0'
);
CREATE TABLE `role`(
    `role_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `role_name` VARCHAR(255) NOT NULL,
    `role_description` VARCHAR(255) NOT NULL,
    `role_active` ENUM('active block pending') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `product_base`(
    `spu_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `spu_name` VARCHAR(255) NOT NULL,
    `shop_id` BIGINT NOT NULL,
    `category_id` BIGINT NOT NULL,
    `spu_description` BIGINT NOT NULL,
    `spu_img_url` VARCHAR(255) NOT NULL,
    `spu_video_url` VARCHAR(255) NOT NULL,
    `spu_price` DECIMAL(8, 2) NOT NULL,
    `spu_status` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `spu_variation` JSON NOT NULL,
    `updated_at` TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NOT NULL
);
CREATE TABLE `cart_item`(
    `product_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `cart_id` BIGINT NOT NULL,
    `quantity` INT NOT NULL,
    `created_at` TIMESTAMP NOT NULL
);
CREATE TABLE `payment_method`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `method_name` VARCHAR(255) NOT NULL,
    `method_description` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT '1',
    `created_at` TIMESTAMP NOT NULL DEFAULT 'now()',
    `updated_at` TIMESTAMP NOT NULL DEFAULT 'now()'
);
CREATE TABLE `orders`(
    `order_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `order_date` TIMESTAMP NOT NULL,
    `order_total` DECIMAL(8, 2) NOT NULL,
    `order_status` BIGINT NOT NULL,
    `payment_method` BIGINT NOT NULL,
    `shipping_address` BIGINT NOT NULL,
    `shipping_method` BIGINT NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
CREATE TABLE `permission`(
    `permission_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `permission_name` VARCHAR(255) NOT NULL,
    `permission_description` VARCHAR(255) NOT NULL,
    `permission_active` ENUM('') NOT NULL
);
CREATE TABLE `carts`(
    `cart_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL
);
ALTER TABLE
    `carts` ADD CONSTRAINT `carts_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `user`(`user_id`);
ALTER TABLE
    `payment_method` ADD CONSTRAINT `payment_method_method_name_foreign` FOREIGN KEY(`method_name`) REFERENCES `orders`(`payment_method`);
ALTER TABLE
    `role_permission` ADD CONSTRAINT `role_permission_permission_id_foreign` FOREIGN KEY(`permission_id`) REFERENCES `permission`(`permission_id`);
ALTER TABLE
    `cart_item` ADD CONSTRAINT `cart_item_cart_id_foreign` FOREIGN KEY(`cart_id`) REFERENCES `carts`(`cart_id`);
ALTER TABLE
    `orders` ADD CONSTRAINT `orders_shipping_address_foreign` FOREIGN KEY(`shipping_address`) REFERENCES `user_address`(`id`);
ALTER TABLE
    `categories` ADD CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY(`parent_id`) REFERENCES `categories`(`category_id`);
ALTER TABLE
    `order_detail` ADD CONSTRAINT `order_detail_oder_id_foreign` FOREIGN KEY(`oder_id`) REFERENCES `orders`(`order_id`);
ALTER TABLE
    `role_permission` ADD CONSTRAINT `role_permission_role_id_foreign` FOREIGN KEY(`role_id`) REFERENCES `role`(`role_id`);
ALTER TABLE
    `product_base` ADD CONSTRAINT `product_base_category_id_foreign` FOREIGN KEY(`category_id`) REFERENCES `categories`(`category_id`);
ALTER TABLE
    `sku` ADD CONSTRAINT `sku_sku_id_foreign` FOREIGN KEY(`sku_id`) REFERENCES `cart_item`(`product_id`);
ALTER TABLE
    `user_address` ADD CONSTRAINT `user_address_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `user`(`user_id`);
ALTER TABLE
    `user_token` ADD CONSTRAINT `user_token_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `user`(`user_id`);
ALTER TABLE
    `role` ADD CONSTRAINT `role_role_id_foreign` FOREIGN KEY(`role_id`) REFERENCES `user_role`(`user_id`);
ALTER TABLE
    `sku` ADD CONSTRAINT `sku_spu_id_foreign` FOREIGN KEY(`spu_id`) REFERENCES `product_base`(`spu_id`);
ALTER TABLE
    `user_role` ADD CONSTRAINT `user_role_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `user`(`user_id`);