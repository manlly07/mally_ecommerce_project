CREATE TABLE "country" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "country_name" VARCHAR(500)
);

CREATE TABLE "address" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "unit_number" VARCHAR(20),
  "street_number" VARCHAR(20),
  "address_line1" VARCHAR(500),
  "address_line2" VARCHAR(500),
  "city" VARCHAR(200),
  "region" VARCHAR(200),
  "postal_code" VARCHAR(20),
  "country_id" INT
);

CREATE TABLE "site_user" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "email_address" VARCHAR(350),
  "phone_number" VARCHAR(20),
  "password" VARCHAR(500)
);

CREATE TABLE "user_address" (
  "user_id" INT,
  "address_id" INT,
  "is_default" INT
);

CREATE TABLE "product_category" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "parent_category_id" INT,
  "category_name" VARCHAR(200)
);

CREATE TABLE "promotion" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(200),
  "description" VARCHAR(2000),
  "discount_rate" INT,
  "start_date" DATETIME,
  "end_date" DATETIME
);

CREATE TABLE "promotion_category" (
  "category_id" INT,
  "promotion_id" INT
);

CREATE TABLE "product" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "category_id" INT,
  "name" VARCHAR(500),
  "description" VARCHAR(4000),
  "product_image" VARCHAR(1000)
);

CREATE TABLE "product_item" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "product_id" INT,
  "sku" VARCHAR(20),
  "qty_in_stock" INT,
  "product_image" VARCHAR(1000),
  "price" INT
);

CREATE TABLE "variation" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "category_id" INT,
  "name" VARCHAR(500)
);

CREATE TABLE "variation_option" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "variation_id" INT,
  "value" VARCHAR(200)
);

CREATE TABLE "product_configuration" (
  "product_item_id" INT,
  "variation_option_id" INT
);

CREATE TABLE "payment_type" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "value" VARCHAR(100)
);

CREATE TABLE "user_payment_method" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" INT,
  "payment_type_id" INT,
  "provider" VARCHAR(100),
  "account_number" VARCHAR(50),
  "expiry_date" DATE,
  "is_default" INT
);

CREATE TABLE "shopping_cart" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" INT
);

CREATE TABLE "shopping_cart_item" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "cart_id" INT,
  "product_item_id" INT,
  "qty" INT
);

CREATE TABLE "shipping_method" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "name" VARCHAR(100),
  "price" INT
);

CREATE TABLE "order_status" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "status" VARCHAR(100)
);

CREATE TABLE "shop_order" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" INT,
  "order_date" DATETIME,
  "payment_method_id" INT,
  "shipping_address" INT,
  "shipping_method" INT,
  "order_total" INT,
  "order_status" INT
);

CREATE TABLE "order_line" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "product_item_id" INT,
  "order_id" INT,
  "qty" INT,
  "price" INT
);

CREATE TABLE "user_review" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" INT,
  "ordered_product_id" INT,
  "rating_value" INT,
  "comment" VARCHAR(2000)
);

ALTER TABLE "address" ADD CONSTRAINT "fk_add_country" FOREIGN KEY ("country_id") REFERENCES "country" ("id");

ALTER TABLE "user_address" ADD CONSTRAINT "fk_useradd_user" FOREIGN KEY ("user_id") REFERENCES "site_user" ("id");

ALTER TABLE "user_address" ADD CONSTRAINT "fk_useradd_address" FOREIGN KEY ("address_id") REFERENCES "address" ("id");

ALTER TABLE "product_category" ADD CONSTRAINT "fk_category_parent" FOREIGN KEY ("parent_category_id") REFERENCES "product_category" ("id");

ALTER TABLE "promotion_category" ADD CONSTRAINT "fk_promocat_category" FOREIGN KEY ("category_id") REFERENCES "product_category" ("id");

ALTER TABLE "promotion_category" ADD CONSTRAINT "fk_promocat_promo" FOREIGN KEY ("promotion_id") REFERENCES "promotion" ("id");

ALTER TABLE "product_item" ADD CONSTRAINT "fk_proditem_product" FOREIGN KEY ("product_id") REFERENCES "product" ("id");

ALTER TABLE "variation" ADD CONSTRAINT "fk_variation_category" FOREIGN KEY ("category_id") REFERENCES "product_category" ("id");

ALTER TABLE "variation_option" ADD CONSTRAINT "fk_varoption_variation" FOREIGN KEY ("variation_id") REFERENCES "variation" ("id");

ALTER TABLE "product_configuration" ADD CONSTRAINT "fk_prodconf_proditem" FOREIGN KEY ("product_item_id") REFERENCES "product_item" ("id");

ALTER TABLE "product_configuration" ADD CONSTRAINT "fk_prodconf_varoption" FOREIGN KEY ("variation_option_id") REFERENCES "variation_option" ("id");

ALTER TABLE "user_payment_method" ADD CONSTRAINT "fk_userpm_user" FOREIGN KEY ("user_id") REFERENCES "site_user" ("id");

ALTER TABLE "user_payment_method" ADD CONSTRAINT "fk_userpm_paytype" FOREIGN KEY ("payment_type_id") REFERENCES "payment_type" ("id");

ALTER TABLE "shopping_cart" ADD CONSTRAINT "fk_shopcart_user" FOREIGN KEY ("user_id") REFERENCES "site_user" ("id");

ALTER TABLE "shopping_cart_item" ADD CONSTRAINT "fk_shopcartitem_shopcart" FOREIGN KEY ("cart_id") REFERENCES "shopping_cart" ("id");

ALTER TABLE "shopping_cart_item" ADD CONSTRAINT "fk_shopcartitem_proditem" FOREIGN KEY ("product_item_id") REFERENCES "product_item" ("id");

ALTER TABLE "shop_order" ADD CONSTRAINT "fk_shoporder_user" FOREIGN KEY ("user_id") REFERENCES "site_user" ("id");

ALTER TABLE "shop_order" ADD CONSTRAINT "fk_shoporder_paymethod" FOREIGN KEY ("payment_method_id") REFERENCES "user_payment_method" ("id");

ALTER TABLE "shop_order" ADD CONSTRAINT "fk_shoporder_shipaddress" FOREIGN KEY ("shipping_address") REFERENCES "address" ("id");

ALTER TABLE "shop_order" ADD CONSTRAINT "fk_shoporder_shipmethod" FOREIGN KEY ("shipping_method") REFERENCES "shipping_method" ("id");

ALTER TABLE "shop_order" ADD CONSTRAINT "fk_shoporder_status" FOREIGN KEY ("order_status") REFERENCES "order_status" ("id");

ALTER TABLE "order_line" ADD CONSTRAINT "fk_orderline_proditem" FOREIGN KEY ("product_item_id") REFERENCES "product_item" ("id");

ALTER TABLE "order_line" ADD CONSTRAINT "fk_orderline_order" FOREIGN KEY ("order_id") REFERENCES "shop_order" ("id");

ALTER TABLE "user_review" ADD CONSTRAINT "fk_review_user" FOREIGN KEY ("user_id") REFERENCES "site_user" ("id");

ALTER TABLE "user_review" ADD CONSTRAINT "fk_review_product" FOREIGN KEY ("ordered_product_id") REFERENCES "order_line" ("id");