CREATE TABLE "store_auth_events" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"user_id" text NOT NULL,
	"platform" text NOT NULL,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store_sync_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"user_id" text NOT NULL,
	"platform" text NOT NULL,
	"status" text NOT NULL,
	"synced_count" integer DEFAULT 0 NOT NULL,
	"created_count" integer DEFAULT 0 NOT NULL,
	"updated_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"message" text,
	"diagnostics" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "status" text DEFAULT 'connected' NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "last_synced_at" timestamp;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "last_sync_status" text DEFAULT 'never' NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "last_sync_error" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "last_diagnosed_at" timestamp;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "diagnostics" jsonb;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "disconnected_at" timestamp;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "reauthorized_at" timestamp;--> statement-breakpoint
ALTER TABLE "store_auth_events" ADD CONSTRAINT "store_auth_events_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_auth_events" ADD CONSTRAINT "store_auth_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_sync_logs" ADD CONSTRAINT "store_sync_logs_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_sync_logs" ADD CONSTRAINT "store_sync_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "store_auth_events_store_id_idx" ON "store_auth_events" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "store_auth_events_user_id_idx" ON "store_auth_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "store_sync_logs_store_id_idx" ON "store_sync_logs" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX "store_sync_logs_user_id_idx" ON "store_sync_logs" USING btree ("user_id");