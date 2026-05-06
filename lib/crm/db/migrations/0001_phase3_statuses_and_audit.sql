ALTER TYPE "public"."lead_status" ADD VALUE 'audit_ready' BEFORE 'contacted';--> statement-breakpoint
ALTER TYPE "public"."lead_status" ADD VALUE 'proposal_sent' BEFORE 'won';--> statement-breakpoint
ALTER TYPE "public"."lead_status" ADD VALUE 'do_not_contact';--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "conversion_score" integer;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "top_problems" jsonb;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "top_improvements" jsonb;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "proposal_follow_up_email" text;