import type { BusinessCategory } from "./types";

// Maps GrowthOS business categories to OpenStreetMap tag selectors. Each entry
// is a list of `key=value` pairs (Overpass tag-filter syntax). A discovered
// node/way matching any of the tags is treated as belonging to that category.
//
// Add or refine entries as you find better OSM coverage for your local area.
// Reference: https://wiki.openstreetmap.org/wiki/Map_features

export const CATEGORY_OSM_TAGS: Record<BusinessCategory, string[]> = {
  "Restaurant": ["amenity=restaurant", "amenity=cafe", "amenity=fast_food"],
  "Gym": ["leisure=fitness_centre", "sport=fitness", "leisure=sports_centre"],
  "Barber / Hair Salon": ["shop=hairdresser"],
  "Dentist": ["amenity=dentist", "healthcare=dentist"],
  "Real Estate Agent": ["office=estate_agent"],
  "Cleaner": ["shop=dry_cleaning", "shop=laundry"],
  "Roofer": ["craft=roofer"],
  "Beauty Salon": ["shop=beauty"],
  "Car Detailer": ["shop=car_repair", "shop=car"],
  "Accountant": ["office=accountant", "office=tax_advisor"],
  "Plumber": ["craft=plumber"],
  "Electrician": ["craft=electrician"],
  "Landscaper": ["craft=gardener", "shop=garden_centre"],
  "Photographer": ["craft=photographer", "shop=photo"],
  "Physiotherapist": ["healthcare=physiotherapist"],
  "Vet": ["amenity=veterinary"],
  "Other": [],
};

// Curated country list for the discovery dropdown. Country names map directly
// to Nominatim search terms (e.g. "Rotterdam, Netherlands"). Extend freely.
export const DISCOVERY_COUNTRIES = [
  "Netherlands",
  "Belgium",
  "Germany",
  "France",
  "United Kingdom",
  "Ireland",
  "Spain",
  "Portugal",
  "Italy",
  "Austria",
  "Switzerland",
  "Denmark",
  "Sweden",
  "Norway",
  "Finland",
  "Poland",
  "United States",
  "Canada",
  "Australia",
  "New Zealand",
  "South Africa",
  "Brazil",
  "Mexico",
  "Argentina",
] as const;
