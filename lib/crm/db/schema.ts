import { pgTable, text, integer, boolean, timestamp, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AuditChecklist } from "../types";

// ── Enums ──────────────────────────────────────────────────────────────────

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "researched",
  "audit_ready",
  "contacted",
  "replied",
  "meeting_booked",
  "proposal_sent",
  "won",
  "lost",
  "do_not_contact",
]);

export const consentStatusEnum = pgEnum("consent_status", [
  "none",
  "opted_in",
  "unsubscribed",
]);

export const contactTypeEnum = pgEnum("contact_type", [
  "email",
  "call",
  "linkedin",
  "visit",
  "other",
]);

// ── leads ──────────────────────────────────────────────────────────────────

export const leads = pgTable(
  "leads",
  {
    id: text("id").primaryKey(),
    businessName: text("business_name").notNull(),
    category: text("category").notNull(),
    city: text("city").notNull(),
    province: text("province").notNull().default(""),
    website: text("website"),
    email: text("email"),
    contactPageUrl: text("contact_page_url"),
    phone: text("phone"),
    googleMapsUrl: text("google_maps_url"),
    notes: text("notes"),
    status: leadStatusEnum("status").notNull().default("new"),
    lastContactedAt: timestamp("last_contacted_at", { withTimezone: true }),
    nextFollowUpAt: timestamp("next_follow_up_at", { withTimezone: true }),
    consentStatus: consentStatusEnum("consent_status").notNull().default("none"),
    doNotContact: boolean("do_not_contact").notNull().default(false),
    unsubscribed: boolean("unsubscribed").notNull().default(false),

    websiteScore: integer("website_score"),
    seoScore: integer("seo_score"),
    conversionScore: integer("conversion_score"),
    automationScore: integer("automation_score"),
    auditSummary: text("audit_summary"),
    auditChecklist: jsonb("audit_checklist").$type<AuditChecklist | null>(),
    topProblems: jsonb("top_problems").$type<string[] | null>(),
    topImprovements: jsonb("top_improvements").$type<string[] | null>(),

    proposalEmail: text("proposal_email"),
    proposalFollowUpEmail: text("proposal_follow_up_email"),
    proposalLinkedIn: text("proposal_linkedin"),
    proposalCallScript: text("proposal_call_script"),
    proposalBullets: text("proposal_bullets"),
    proposalOffer: text("proposal_offer"),
    estimatedValue: integer("estimated_value"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    cityIdx: index("leads_city_idx").on(t.city),
    statusIdx: index("leads_status_idx").on(t.status),
    nextFollowUpIdx: index("leads_next_follow_up_idx").on(t.nextFollowUpAt),
  }),
);

// ── contacts ───────────────────────────────────────────────────────────────

export const contacts = pgTable(
  "contacts",
  {
    id: text("id").primaryKey(),
    leadId: text("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    type: contactTypeEnum("type").notNull(),
    message: text("message"),
    sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    leadIdx: index("contacts_lead_idx").on(t.leadId),
    sentAtIdx: index("contacts_sent_at_idx").on(t.sentAt),
  }),
);

// ── follow_ups ─────────────────────────────────────────────────────────────

export const followUps = pgTable(
  "follow_ups",
  {
    id: text("id").primaryKey(),
    leadId: text("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    completed: boolean("completed").notNull().default(false),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    leadIdx: index("follow_ups_lead_idx").on(t.leadId),
    dueAtIdx: index("follow_ups_due_at_idx").on(t.dueAt),
  }),
);

// ── Relations (for db.query.leads.findMany({ with: ... })) ────────────────

export const leadsRelations = relations(leads, ({ many }) => ({
  contacts: many(contacts),
  followUps: many(followUps),
}));

export const contactsRelations = relations(contacts, ({ one }) => ({
  lead: one(leads, {
    fields: [contacts.leadId],
    references: [leads.id],
  }),
}));

export const followUpsRelations = relations(followUps, ({ one }) => ({
  lead: one(leads, {
    fields: [followUps.leadId],
    references: [leads.id],
  }),
}));

// ── Inferred row types ─────────────────────────────────────────────────────

export type LeadRow = typeof leads.$inferSelect;
export type LeadInsert = typeof leads.$inferInsert;
export type ContactRow = typeof contacts.$inferSelect;
export type ContactInsert = typeof contacts.$inferInsert;
export type FollowUpRow = typeof followUps.$inferSelect;
export type FollowUpInsert = typeof followUps.$inferInsert;
