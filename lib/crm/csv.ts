import type { LeadCreateInput } from "./types";

interface CSVRow {
  businessName?: string;
  business_name?: string;
  name?: string;
  category?: string;
  city?: string;
  province?: string;
  region?: string;
  website?: string;
  email?: string;
  contactPage?: string;
  contact_page?: string;
  phone?: string;
}

function normaliseHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export function parseCSV(raw: string): { leads: LeadCreateInput[]; errors: string[] } {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { leads: [], errors: ["CSV has no data rows."] };

  const headers = lines[0].split(",").map(normaliseHeader);
  const leads: LeadCreateInput[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    if (cols.length < 2) continue;

    const row: CSVRow = {};
    headers.forEach((h, idx) => {
      (row as Record<string, string>)[h] = (cols[idx] ?? "").trim();
    });

    const businessName =
      row.businessName ?? row.business_name ?? row.name ?? "";
    if (!businessName) {
      errors.push(`Row ${i + 1}: missing business name — skipped.`);
      continue;
    }

    const city = row.city ?? "";
    if (!city) {
      errors.push(`Row ${i + 1} (${businessName}): missing city — skipped.`);
      continue;
    }

    const now = new Date().toISOString();
    leads.push({
      businessName,
      category: row.category ?? "Other",
      city,
      province: row.province ?? row.region ?? "",
      website: row.website || undefined,
      email: row.email || undefined,
      contactPageUrl: (row.contactPage ?? row.contact_page) || undefined,
      phone: row.phone || undefined,
      status: "new",
      consentStatus: "none",
      doNotContact: false,
      unsubscribed: false,
    });
  }

  return { leads, errors };
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export const CSV_TEMPLATE_HEADERS =
  "businessName,category,city,province,website,email,phone\n";

export const CSV_TEMPLATE_EXAMPLE =
  CSV_TEMPLATE_HEADERS +
  "Cape Town Smiles Dental,Dentist,Cape Town,Western Cape,https://ctsmiles.co.za,info@ctsmiles.co.za,+27 21 555 0123\n" +
  "Barber Brothers,Barber / Hair Salon,Johannesburg,Gauteng,https://barberbros.co.za,,+27 11 444 9876\n";
