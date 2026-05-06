CREATE TYPE "public"."consent_status" AS ENUM('none', 'opted_in', 'unsubscribed');--> statement-breakpoint
CREATE TYPE "public"."contact_type" AS ENUM('email', 'call', 'linkedin', 'visit', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'researched', 'contacted', 'replied', 'meeting_booked', 'won', 'lost');--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"type" "contact_type" NOT NULL,
	"message" text,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follow_ups" (
	"id" text PRIMARY KEY NOT NULL,
	"lead_id" text NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"business_name" text NOT NULL,
	"category" text NOT NULL,
	"city" text NOT NULL,
	"province" text DEFAULT '' NOT NULL,
	"website" text,
	"email" text,
	"contact_page_url" text,
	"phone" text,
	"google_maps_url" text,
	"notes" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"last_contacted_at" timestamp with time zone,
	"next_follow_up_at" timestamp with time zone,
	"consent_status" "consent_status" DEFAULT 'none' NOT NULL,
	"do_not_contact" boolean DEFAULT false NOT NULL,
	"unsubscribed" boolean DEFAULT false NOT NULL,
	"website_score" integer,
	"seo_score" integer,
	"automation_score" integer,
	"audit_summary" text,
	"audit_checklist" jsonb,
	"proposal_email" text,
	"proposal_linkedin" text,
	"proposal_call_script" text,
	"proposal_bullets" text,
	"proposal_offer" text,
	"estimated_value" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "contacts_lead_idx" ON "contacts" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "contacts_sent_at_idx" ON "contacts" USING btree ("sent_at");--> statement-breakpoint
CREATE INDEX "follow_ups_lead_idx" ON "follow_ups" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "follow_ups_due_at_idx" ON "follow_ups" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "leads_city_idx" ON "leads" USING btree ("city");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_next_follow_up_idx" ON "leads" USING btree ("next_follow_up_at");