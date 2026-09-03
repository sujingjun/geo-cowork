CREATE TABLE "browser_cycle_query_inputs" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"cycle_ref" text NOT NULL,
	"fingerprint" text NOT NULL,
	"payload" jsonb NOT NULL,
	"registered_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "browser_extraction_results" (
	"id" text PRIMARY KEY NOT NULL,
	"capture_id" text NOT NULL,
	"attempt_no" integer NOT NULL,
	"status" text NOT NULL,
	"payload" jsonb NOT NULL,
	"completed_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "browser_pending_query_results" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"cycle_ref" text NOT NULL,
	"capture_id" text NOT NULL,
	"extraction_id" text NOT NULL,
	"status" text NOT NULL,
	"receiver_fingerprint" text,
	"acknowledged_at" text,
	"payload" jsonb NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "browser_query_artifacts" (
	"id" text PRIMARY KEY NOT NULL,
	"media_type" text NOT NULL,
	"byte_length" integer NOT NULL,
	"sha256" text NOT NULL,
	"content_base64" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "browser_query_captures" (
	"id" text PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"artifact_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"captured_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "browser_query_tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"input_id" text NOT NULL,
	"cycle_ref" text NOT NULL,
	"status" text NOT NULL,
	"revision" integer DEFAULT 0 NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "browser_extraction_results" ADD CONSTRAINT "browser_extraction_results_capture_id_browser_query_captures_id_fk" FOREIGN KEY ("capture_id") REFERENCES "public"."browser_query_captures"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_pending_query_results" ADD CONSTRAINT "browser_pending_query_results_task_id_browser_query_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."browser_query_tasks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_pending_query_results" ADD CONSTRAINT "browser_pending_query_results_capture_id_browser_query_captures_id_fk" FOREIGN KEY ("capture_id") REFERENCES "public"."browser_query_captures"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_pending_query_results" ADD CONSTRAINT "browser_pending_query_results_extraction_id_browser_extraction_results_id_fk" FOREIGN KEY ("extraction_id") REFERENCES "public"."browser_extraction_results"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_query_captures" ADD CONSTRAINT "browser_query_captures_task_id_browser_query_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."browser_query_tasks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_query_captures" ADD CONSTRAINT "browser_query_captures_artifact_id_browser_query_artifacts_id_fk" FOREIGN KEY ("artifact_id") REFERENCES "public"."browser_query_artifacts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_query_tasks" ADD CONSTRAINT "browser_query_tasks_input_id_browser_cycle_query_inputs_id_fk" FOREIGN KEY ("input_id") REFERENCES "public"."browser_cycle_query_inputs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "browser_cycle_query_inputs_request_idx" ON "browser_cycle_query_inputs" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "browser_cycle_query_inputs_cycle_idx" ON "browser_cycle_query_inputs" USING btree ("cycle_ref","registered_at");--> statement-breakpoint
CREATE UNIQUE INDEX "browser_extraction_results_attempt_idx" ON "browser_extraction_results" USING btree ("capture_id","attempt_no");--> statement-breakpoint
CREATE INDEX "browser_pending_query_results_queue_idx" ON "browser_pending_query_results" USING btree ("status","created_at","id");--> statement-breakpoint
CREATE INDEX "browser_pending_query_results_cycle_idx" ON "browser_pending_query_results" USING btree ("cycle_ref","status");--> statement-breakpoint
CREATE INDEX "browser_pending_query_results_task_idx" ON "browser_pending_query_results" USING btree ("task_id","status");--> statement-breakpoint
CREATE INDEX "browser_query_artifacts_sha_idx" ON "browser_query_artifacts" USING btree ("sha256");--> statement-breakpoint
CREATE INDEX "browser_query_captures_task_idx" ON "browser_query_captures" USING btree ("task_id","captured_at");--> statement-breakpoint
CREATE UNIQUE INDEX "browser_query_tasks_request_idx" ON "browser_query_tasks" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "browser_query_tasks_cycle_idx" ON "browser_query_tasks" USING btree ("cycle_ref","created_at");--> statement-breakpoint
CREATE INDEX "browser_query_tasks_status_idx" ON "browser_query_tasks" USING btree ("status");