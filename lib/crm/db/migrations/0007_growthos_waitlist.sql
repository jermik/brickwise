CREATE TABLE "growthos_waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"niche" text,
	"country" text,
	"source" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "growthos_waitlist_email_idx" ON "growthos_waitlist" USING btree ("email");--> statement-breakpoint
CREATE INDEX "growthos_waitlist_created_at_idx" ON "growthos_waitlist" USING btree ("created_at");