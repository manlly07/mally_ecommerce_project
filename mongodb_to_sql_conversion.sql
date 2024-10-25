CREATE TABLE User_Base (
    user_id INT NOT NULL REFERENCES User (id) ON DELETE CASCADE ON UPDATE
    
)
-- Users Table
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usr_name VARCHAR(255) DEFAULT '',
    usr_slug VARCHAR(255) NOT NULL,
    usr_password TEXT DEFAULT '',
    usr_salt TEXT DEFAULT '',
    usr_email VARCHAR(255) UNIQUE NOT NULL,
    usr_phone VARCHAR(255) UNIQUE DEFAULT '',
    usr_gender VARCHAR(50) CHECK (usr_gender IN ('Male', 'Female')) DEFAULT 'Male',
    usr_avatar TEXT DEFAULT '',
    usr_date_of_birth DATE DEFAULT NULL,
    usr_role INT REFERENCES Roles(id),
    usr_status VARCHAR(50) CHECK (usr_status IN ('active', 'inactive', 'block')) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table
CREATE TABLE Carts (
    id int PRIMARY KEY,
    cart_state ENUM ('active', 'completed', 'failed', 'pending')) DEFAULT 'active',
    cart_products JSONB NOT NULL DEFAULT '[]',
    cart_userId INT NOT NULL REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments Table
CREATE TABLE Comments (
    id SERIAL PRIMARY KEY,
    comment_productId INT REFERENCES Products(id),
    comment_userId INT REFERENCES Users(id),
    comment_content TEXT DEFAULT '',
    comment_left INT DEFAULT 0,
    comment_right INT DEFAULT 0,
    comment_parentId INT REFERENCES Comments(id),
    isDeleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discounts Table
CREATE TABLE Discounts (
    id SERIAL PRIMARY KEY,
    discount_name VARCHAR(255) NOT NULL,
    discount_description TEXT NOT NULL,
    discount_type VARCHAR(50) CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value DECIMAL NOT NULL,
    discount_max_value DECIMAL NOT NULL,
    discount_code VARCHAR(255) NOT NULL,
    discount_start_date DATE NOT NULL,
    discount_end_date DATE NOT NULL,
    discount_max_uses INT NOT NULL,
    discount_uses_count INT DEFAULT 0 NOT NULL,
    discount_users_used JSONB NOT NULL DEFAULT '[]',
    discount_max_uses_per_user INT NOT NULL DEFAULT 1,
    discount_min_order_value DECIMAL NOT NULL DEFAULT 0,
    discount_shopId INT REFERENCES Shops(id),
    discount_is_active BOOLEAN DEFAULT TRUE NOT NULL,
    discount_applies_to VARCHAR(50) CHECK (discount_applies_to IN ('all', 'specific')) NOT NULL,
    discount_product_ids JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Keys Table
CREATE TABLE Keys (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    privateKey TEXT NOT NULL,
    publicKey TEXT NOT NULL,
    refreshTokensUsed JSONB DEFAULT '[]',
    refreshToken TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE Notifications (
    id SERIAL PRIMARY KEY,
    noti_type VARCHAR(50) CHECK (noti_type IN ('ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001')) NOT NULL,
    noti_receivedId INT REFERENCES Users(id),
    noti_senderId INT REFERENCES Shops(id),
    noti_content TEXT NOT NULL,
    noti_options JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    order_userId INT REFERENCES Users(id),
    order_checkout JSONB DEFAULT '{}'::jsonb,
    order_shipping JSONB DEFAULT '{}'::jsonb,
    order_payment JSONB DEFAULT '{}'::jsonb,
    order_products JSONB NOT NULL,
    order_trackingNumber VARCHAR(255) DEFAULT '',
    order_status VARCHAR(50) CHECK (order_status IN ('pending', 'confirmed', 'shipped', 'cancelled', 'delivered')) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Otp_logs Table
CREATE TABLE Otp_logs (
    id SERIAL PRIMARY KEY,
    otp_token VARCHAR(255) NOT NULL,
    otp_email VARCHAR(255) NOT NULL,
    otp_status VARCHAR(50) CHECK (otp_status IN ('active', 'pending', 'block')) NOT NULL DEFAULT 'pending',
    expireAt TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '5 minutes'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resources Table
CREATE TABLE Resources (
    id SERIAL PRIMARY KEY,
    src_name VARCHAR(255) NOT NULL UNIQUE,
    src_slug VARCHAR(255) NOT NULL,
    src_description TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    rol_name VARCHAR(50) CHECK (rol_name IN ('user', 'shop', 'admin')) NOT NULL UNIQUE DEFAULT 'user',
    rol_slug VARCHAR(255) NOT NULL,
    rol_status VARCHAR(50) CHECK (rol_status IN ('active', 'pending', 'block')) NOT NULL DEFAULT 'active',
    rol_description TEXT DEFAULT '',
    rol_grants JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skus Table
CREATE TABLE Skus (
    id SERIAL PRIMARY KEY,
    sku_id VARCHAR(255) NOT NULL,
    sku_tier_idx JSONB DEFAULT '[0]'::jsonb,
    sku_default BOOLEAN DEFAULT FALSE,
    sku_thumb TEXT DEFAULT '',
    sku_slug TEXT DEFAULT '',
    sku_sort INT DEFAULT 0,
    sku_price DECIMAL NOT NULL,
    sku_stock INT DEFAULT 0,
    product_id INT REFERENCES Products(id),
    isDraft BOOLEAN DEFAULT TRUE,
    isPublished BOOLEAN DEFAULT FALSE,
    isDeleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spus Table
CREATE TABLE Spus (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_thumb TEXT NOT NULL,
    product_description TEXT,
    product_slug VARCHAR(255),
    product_price DECIMAL NOT NULL,
    product_category JSONB DEFAULT '[]'::jsonb,
    product_quantity INT NOT NULL,
    product_shop INT REFERENCES Shops(id),
    product_attributes JSONB NOT NULL,
    product_ratingsAverage DECIMAL DEFAULT 4.5 CHECK (product_ratingsAverage >= 1.0 AND product_ratingsAverage <= 5.0),
    product_variations JSONB DEFAULT '[]'::jsonb,
    isDraft BOOLEAN DEFAULT TRUE,
    isPublished BOOLEAN DEFAULT FALSE,
    isDeleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);







CREATE TABLE `sd_product` (
  `productId` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `product_name` varchar(64) DEFAULT NULL COMMENT 'spu name',
  `product_desc` varchar(256) DEFAULT NULL COMMENT 'spu desc',
  `product_status` tinyint(4) DEFAULT NULL COMMENT '0: out of stock, 1: in stock ',
  `product_attrs` json DEFAULT NULL COMMENT 'json attributes',
  `product_shopId` bigint(20) DEFAULT NULL COMMENT 'id shop',
  `is_deleted` tinyint(1) unsigned DEFAULT '0' COMMENT '0:delete 1:null',
  `sort` int(10) DEFAULT '0' COMMENT 'piority sort',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'created timestamp',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'updated timestamp',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='spu';

-- tb_sku

CREATE TABLE `sku` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_no` varchar(32) DEFAULT '' COMMENT 'sku_no',
  `sku_name` varchar(50) DEFAULT NULL COMMENT 'sku_name',
  `sku_description` varchar(256) DEFAULT NULL COMMENT 'sku_description',
  `sku_type` tinyint(4) DEFAULT NULL COMMENT 'sku_type',
  `status` tinyint(4) NOT NULL COMMENT 'status',
  `sort` int(10) DEFAULT '0' COMMENT 'piority sort',
  `sku_stock` int(11) NOT NULL DEFAULT '0' COMMENT 'sku_stock',
  `sku_price` decimal(8,2) NOT NULL COMMENT 'sku_price',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY(`id`) USING BTREE,
  UNIQUE KEY `uk_sku_no` (`sku_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = 'sku'

-- tb_sku_attr

CREATE TABLE `sku_attr` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sku_no` varchar(32) DEFAULT '' COMMENT 'sku_no',
  `sku_stock` int(11) NOT NULL DEFAULT '0' COMMENT 'sku_stock',
  `sku_price` decimal(8,2) NOT NULL COMMENT 'sku_price',
  `sku_attrs` json DEFAULT NULL COMMENT 'sku_attrs',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY(`id`) USING BTREE,
  UNIQUE KEY `uk_sku_no` (`sku_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COMMENT = 'sku_attr'


-- tb_sku_specs

CREATE TABLE `sku_attr` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `spu_specs` json DEFAULT NULL COMMENT 'attributes',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='spu';


-- tb_spu_to_sku

CREATE TABLE `spu_to_sku` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id',
  `sku_no` varchar(32) NOT NULL DEFAULT '' COMMENT 'sku id',
  `spu_no` varchar(32) NOT NULL DEFAULT '' COMMENT 'spu id',

  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '0:deleted 1:nul',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'create_time',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'update_time',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_spu_to_sku` (`spu_no`,`sku_no`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='spu_to_sku';
