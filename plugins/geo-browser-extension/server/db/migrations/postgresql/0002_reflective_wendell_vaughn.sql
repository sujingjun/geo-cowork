ALTER TABLE "products" ALTER COLUMN "asin" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "external_product_id" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "platform_handle" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "vendor" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_type" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "variants" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "raw_data" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "shop_domain" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "scopes" text;--> statement-breakpoint
UPDATE "products" SET "external_product_id" = "asin" WHERE "external_product_id" IS NULL;--> statement-breakpoint
UPDATE "products" SET "product_url" = 'https://amazon.com/dp/' || "asin" WHERE "product_url" IS NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "external_product_id" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "products_external_product_id_idx" ON "products" USING btree ("external_product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "products_store_external_product_id_idx" ON "products" USING btree ("store_id","external_product_id");
