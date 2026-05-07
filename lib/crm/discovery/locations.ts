// Curated locations + niches for the Find Businesses dropdowns.
//
// Goal: cover ~80% of typical searches with one click while keeping the
// dataset small. Anything outside the curated list falls back to free
// text via the "Other" option in the UI.

export interface CountryConfig {
  /** Display name (matches what we send to Google Places as the country). */
  country: string;
  /** ISO 3166-1 alpha-2 country code, used for the Places regionCode bias. */
  regionCode: string;
  /** Curated list of common cities for that country. */
  cities: string[];
}

export const DISCOVERY_LOCATIONS: CountryConfig[] = [
  {
    country: "Netherlands",
    regionCode: "NL",
    cities: [
      "Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven",
      "Groningen", "Tilburg", "Almere", "Breda", "Nijmegen", "Haarlem",
      "Arnhem", "Zwolle", "Leiden", "Dordrecht", "Maastricht", "Delft",
      "Apeldoorn", "Amersfoort", "'s-Hertogenbosch",
    ],
  },
  {
    country: "Belgium",
    regionCode: "BE",
    cities: [
      "Brussels", "Antwerp", "Ghent", "Bruges", "Leuven", "Liège",
      "Charleroi", "Namur", "Mons", "Mechelen", "Hasselt", "Ostend",
    ],
  },
  {
    country: "Germany",
    regionCode: "DE",
    cities: [
      "Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart",
      "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Bremen", "Dresden",
      "Hanover", "Nuremberg",
    ],
  },
  {
    country: "France",
    regionCode: "FR",
    cities: [
      "Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes",
      "Strasbourg", "Montpellier", "Bordeaux", "Lille", "Rennes",
    ],
  },
  {
    country: "United Kingdom",
    regionCode: "GB",
    cities: [
      "London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool",
      "Bristol", "Edinburgh", "Sheffield", "Newcastle", "Cardiff", "Belfast",
      "Nottingham", "Brighton",
    ],
  },
  {
    country: "Ireland",
    regionCode: "IE",
    cities: ["Dublin", "Cork", "Galway", "Limerick", "Waterford"],
  },
  {
    country: "Spain",
    regionCode: "ES",
    cities: [
      "Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga",
      "Bilbao", "Granada", "Palma", "Alicante",
    ],
  },
  {
    country: "Portugal",
    regionCode: "PT",
    cities: ["Lisbon", "Porto", "Faro", "Coimbra", "Braga", "Funchal"],
  },
  {
    country: "Italy",
    regionCode: "IT",
    cities: [
      "Rome", "Milan", "Naples", "Turin", "Florence", "Bologna", "Venice",
      "Verona", "Genoa", "Palermo",
    ],
  },
  {
    country: "Greece",
    regionCode: "GR",
    cities: [
      "Athens", "Thessaloniki", "Patras", "Heraklion", "Larissa",
      "Volos", "Rhodes", "Corfu", "Zakynthos", "Mykonos", "Santorini",
      "Chania",
    ],
  },
  {
    country: "Austria",
    regionCode: "AT",
    cities: ["Vienna", "Graz", "Linz", "Salzburg", "Innsbruck"],
  },
  {
    country: "Switzerland",
    regionCode: "CH",
    cities: ["Zurich", "Geneva", "Basel", "Bern", "Lausanne", "Lucerne"],
  },
  {
    country: "Denmark",
    regionCode: "DK",
    cities: ["Copenhagen", "Aarhus", "Odense", "Aalborg"],
  },
  {
    country: "Sweden",
    regionCode: "SE",
    cities: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Linköping"],
  },
  {
    country: "Norway",
    regionCode: "NO",
    cities: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromsø"],
  },
  {
    country: "Finland",
    regionCode: "FI",
    cities: ["Helsinki", "Espoo", "Tampere", "Turku", "Oulu"],
  },
  {
    country: "Poland",
    regionCode: "PL",
    cities: ["Warsaw", "Kraków", "Wrocław", "Łódź", "Poznań", "Gdańsk"],
  },
  {
    country: "United States",
    regionCode: "US",
    cities: [
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
      "Philadelphia", "San Antonio", "San Diego", "Dallas", "Austin",
      "Seattle", "Denver", "Boston", "Miami", "Atlanta", "San Francisco",
      "Portland",
    ],
  },
  {
    country: "Canada",
    regionCode: "CA",
    cities: [
      "Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa",
      "Quebec City", "Winnipeg",
    ],
  },
  {
    country: "Australia",
    regionCode: "AU",
    cities: [
      "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast",
      "Canberra",
    ],
  },
  {
    country: "New Zealand",
    regionCode: "NZ",
    cities: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga"],
  },
];

/** Niches we surface as quick presets in the dropdown. */
export const DISCOVERY_NICHES = [
  "dentists",
  "gyms",
  "yoga studios",
  "pilates studios",
  "personal trainers",
  "physiotherapists",
  "chiropractors",
  "opticians",
  "lawyers",
  "accountants",
  "real estate agents",
  "barbers",
  "hair salons",
  "beauty salons",
  "nail salons",
  "tattoo studios",
  "spas",
  "restaurants",
  "cafes",
  "coffee shops",
  "bakeries",
  "florists",
  "pet groomers",
  "veterinarians",
  "photographers",
  "videographers",
  "wedding planners",
  "driving schools",
  "tutors",
  "music teachers",
  "plumbers",
  "electricians",
  "roofers",
  "carpenters",
  "painters",
  "auto repair shops",
  "car detailers",
  "cleaning services",
  "moving companies",
  "hotels",
  "bed and breakfasts",
  "pubs",
  "bars",
] as const;

/** Sentinel value used by the UI to mean "let me type my own". */
export const OTHER_OPTION = "__other__";

export function findCountry(name: string): CountryConfig | undefined {
  return DISCOVERY_LOCATIONS.find((c) => c.country === name);
}
