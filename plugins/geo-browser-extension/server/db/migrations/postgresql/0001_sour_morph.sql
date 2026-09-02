ALTER TABLE "messages" ALTER COLUMN "parts" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "parts" SET NOT NULL;