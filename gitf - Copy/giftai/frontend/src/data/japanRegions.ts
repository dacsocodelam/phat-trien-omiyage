// ============================================
// JAPAN REGIONS DATA - RPG World Map System
// ============================================

export interface RegionData {
  id: string;
  name: string;
  nameJa: string;
  color: string;
  viewBox: string; // SVG viewBox for zoomed view
  prefectures: string[];
  description: string;
}

export const JAPAN_REGIONS: RegionData[] = [
  {
    id: "Hokkaido",
    name: "Hokkaido",
    nameJa: "北海道",
    color: "#A5B4FC", // Lavender blue (pastel)
    viewBox: "600 0 400 400",
    prefectures: ["Hokkaido"],
    description:
      "The northernmost island, famous for snow, dairy products, and seafood.",
  },
  {
    id: "Tohoku",
    name: "Tohoku",
    nameJa: "東北",
    color: "#93C5FD", // Sky blue (pastel)
    viewBox: "600 150 300 400",
    prefectures: [
      "Aomori",
      "Iwate",
      "Miyagi",
      "Akita",
      "Yamagata",
      "Fukushima",
    ],
    description:
      "The northern region known for rice, sake, and traditional festivals.",
  },
  {
    id: "Kanto",
    name: "Kanto",
    nameJa: "関東",
    color: "#6EE7B7", // Mint green (pastel)
    viewBox: "650 450 150 150",
    prefectures: [
      "Ibaraki",
      "Tochigi",
      "Gunma",
      "Saitama",
      "Chiba",
      "Tokyo",
      "Kanagawa",
    ],
    description:
      "The capital region with Tokyo, blending tradition and modernity.",
  },
  {
    id: "Chubu",
    name: "Chubu",
    nameJa: "中部",
    color: "#FCD34D", // Soft yellow (pastel)
    viewBox: "450 350 250 250",
    prefectures: [
      "Niigata",
      "Toyama",
      "Ishikawa",
      "Fukui",
      "Yamanashi",
      "Nagano",
      "Gifu",
      "Shizuoka",
      "Aichi",
    ],
    description: "Central mountain region, home to Mt. Fuji and Japanese Alps.",
  },
  {
    id: "Kansai",
    name: "Kansai",
    nameJa: "関西",
    color: "#FDA4AF", // Soft pink (pastel)
    viewBox: "350 450 150 150",
    prefectures: [
      "Mie",
      "Shiga",
      "Kyoto",
      "Osaka",
      "Hyogo",
      "Nara",
      "Wakayama",
    ],
    description:
      "Ancient capital region with Kyoto, Osaka, and rich cultural heritage.",
  },
  {
    id: "Chugoku",
    name: "Chugoku",
    nameJa: "中国",
    color: "#FDBA74", // Peach orange (pastel)
    viewBox: "150 400 250 200",
    prefectures: ["Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi"],
    description: "Western Honshu, connecting to Kyushu via Shimonoseki.",
  },
  {
    id: "Shikoku",
    name: "Shikoku",
    nameJa: "四国",
    color: "#C4B5FD", // Soft purple (pastel)
    viewBox: "250 500 150 150",
    prefectures: ["Tokushima", "Kagawa", "Ehime", "Kochi"],
    description: "Smallest main island, famous for 88-temple pilgrimage.",
  },
  {
    id: "Kyushu",
    name: "Kyushu & Okinawa",
    nameJa: "九州・沖縄",
    color: "#86EFAC", // Lime green (pastel)
    viewBox: "0 500 300 300",
    prefectures: [
      "Fukuoka",
      "Saga",
      "Nagasaki",
      "Kumamoto",
      "Oita",
      "Miyazaki",
      "Kagoshima",
      "Okinawa",
    ],
    description:
      "Southern region with tropical islands, hot springs, and unique culture.",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Find which region a prefecture belongs to
 * Handles both "Tokyo" and "Tokyo To" formats
 */
export function getRegionByPrefecture(
  prefectureName: string,
): RegionData | null {
  if (!prefectureName) return null;

  // Normalize by removing suffixes like "Ken", "To", "Fu" and diacritics
  const normalized = prefectureName
    .replace(/\s*(Ken|Fu|To|-ken|-fu|-to)\s*$/i, "")
    .replace(/[ōŌ]/g, "o")
    .replace(/[ūŪ]/g, "u")
    .replace(/[āĀ]/g, "a")
    .trim()
    .toLowerCase();

  for (const region of JAPAN_REGIONS) {
    // Check for exact match first
    const exactMatch = region.prefectures.some(
      (pref) => pref.toLowerCase() === normalized,
    );

    if (exactMatch) {
      return region;
    }

    // Then check partial matches (but only if length > 3 to avoid false positives)
    if (normalized.length > 3) {
      const partialMatch = region.prefectures.some(
        (pref) =>
          pref.toLowerCase().includes(normalized) ||
          normalized.includes(pref.toLowerCase()),
      );

      if (partialMatch) {
        return region;
      }
    }
  }
  return null;
}

/**
 * Get region by ID
 */
export function getRegionById(regionId: string): RegionData | null {
  return JAPAN_REGIONS.find((r) => r.id === regionId) || null;
}

/**
 * Get all prefecture names from all regions
 */
export function getAllPrefectures(): string[] {
  return JAPAN_REGIONS.flatMap((region) => region.prefectures);
}

/**
 * Check if a prefecture exists in the data
 */
export function isPrefectureValid(prefectureName: string): boolean {
  return getAllPrefectures().includes(prefectureName);
}

/**
 * Get region color by prefecture name
 */
export function getRegionColor(prefectureName: string): string {
  const region = getRegionByPrefecture(prefectureName);
  return region ? region.color : "#E0E0E0";
}

// ============================================
// REGION MAPPING (for backward compatibility)
// ============================================
export const PREFECTURE_TO_REGION: Record<string, string> = {};

JAPAN_REGIONS.forEach((region) => {
  region.prefectures.forEach((prefecture) => {
    PREFECTURE_TO_REGION[prefecture] = region.id;
  });
});
