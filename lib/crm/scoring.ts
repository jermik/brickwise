import type { AuditChecklist } from "./types";
import { AUDIT_SEO_FIELDS, AUDIT_AUTOMATION_FIELDS } from "./types";

const ALL_KEYS = [
  "hasModernDesign",
  "isMobileFriendly",
  "loadsFast",
  "hasClearCTA",
  "hasContactForm",
  "hasGoogleMapsLink",
  "hasLocalSEOTitle",
  "hasMetaDescription",
  "hasServicePages",
  "hasCityLandingPage",
  "hasAnalytics",
  "hasBookingOpportunity",
] as (keyof AuditChecklist)[];

export function computeWebsiteScore(c: AuditChecklist): number {
  const passed = ALL_KEYS.filter((k) => c[k]).length;
  return Math.round((passed / ALL_KEYS.length) * 100);
}

export function computeSEOScore(c: AuditChecklist): number {
  const passed = AUDIT_SEO_FIELDS.filter((k) => c[k]).length;
  return Math.round((passed / AUDIT_SEO_FIELDS.length) * 100);
}

export function computeAutomationScore(c: AuditChecklist): number {
  const passed = AUDIT_AUTOMATION_FIELDS.filter((k) => c[k]).length;
  return Math.round((passed / AUDIT_AUTOMATION_FIELDS.length) * 100);
}

export function generateAuditSummary(
  checklist: AuditChecklist,
  businessName: string,
  category: string
): string {
  const missing: string[] = [];
  if (!checklist.isMobileFriendly) missing.push("not mobile-friendly");
  if (!checklist.hasLocalSEOTitle) missing.push("missing local SEO title");
  if (!checklist.hasMetaDescription) missing.push("no meta description");
  if (!checklist.hasClearCTA) missing.push("no clear call-to-action");
  if (!checklist.hasContactForm) missing.push("no contact form");
  if (!checklist.hasServicePages) missing.push("no dedicated service pages");
  if (!checklist.hasCityLandingPage) missing.push("no city landing page");
  if (!checklist.hasAnalytics) missing.push("analytics not detected");
  if (!checklist.hasBookingOpportunity) missing.push("no booking system");

  if (missing.length === 0) {
    return `${businessName}'s website is well-optimised. Main opportunity: conversion rate and automation improvements.`;
  }

  const top = missing.slice(0, 3);
  return `${businessName} (${category}): website is ${top.join(", ")}. ${
    missing.length > 3 ? `Plus ${missing.length - 3} more improvements possible.` : ""
  }`.trim();
}

export function computeAllScores(checklist: AuditChecklist) {
  return {
    websiteScore: computeWebsiteScore(checklist),
    seoScore: computeSEOScore(checklist),
    automationScore: computeAutomationScore(checklist),
  };
}
