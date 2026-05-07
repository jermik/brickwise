ALTER TABLE "leads" ADD COLUMN "rich_audit" jsonb;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "lead_score" integer;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "lead_score_data" jsonb;