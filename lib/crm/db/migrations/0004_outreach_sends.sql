CREATE TABLE "outreach_sends" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"recipient" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"locale" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text DEFAULT 'sent' NOT NULL,
	"message_id" text,
	"error_message" text,
	"sent_by_user_id" text
);
--> statement-breakpoint
CREATE INDEX "outreach_sends_lead_idx" ON "outreach_sends" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "outreach_sends_sent_at_idx" ON "outreach_sends" USING btree ("sent_at");