export interface OmiyageStore {
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number; // 1-5
  priceRange: string; // e.g. "¥1000 - ¥3000"
}

export interface OmiyageSpecialty {
  id: string;
  name: string;
  kanjiName: string;
  description: string;
  culturalContext: string; // The "Why it's famous" part
  image: string; // URL
  price: number;
}

export interface PrefectureData {
  id: string; // GeoJSON ID (e.g., "Shimane", "32")
  name: string;
  kanjiName: string;
  region: string;
  description: string;
  specialties: OmiyageSpecialty[];
  stores: OmiyageStore[];
  coordinates: [number, number]; // [lat, lng] for camera focus
}

export const OMIYAGE_DATA: Record<string, PrefectureData> = {
  "Shimane": {
    id: "Shimane",
    name: "Shimane",
    kanjiName: "島根県",
    region: "Chugoku",
    description: "Known for Izumo Taisha, one of Japan's oldest and most important shrines, and the beautiful Lake Shinji.",
    coordinates: [35.4722, 133.0505], // Approx Matsue center
    specialties: [
      {
        id: "izumo-soba",
        name: "Izumo Soba",
        kanjiName: "出雲そば",
        description: "Dark, fragrant buckwheat noodles served in three stacked lacquerware tiers (Warigo).",
        culturalContext: "Ranking alongside Wanko and Togakushi as one of Japan's 'Three Great Sobas'. The dark color comes from grinding the buckwheat with its husk (hikigurumi), retaining more flavor and nutrition.",
        image: "https://images.unsplash.com/photo-1558985250-27a406d64cb6?q=80&w=1000&auto=format&fit=crop", // Placeholder or generic Soba
        price: 1200
      },
      {
        id: "shijimi-clams",
        name: "Shijimi Clams",
        kanjiName: "しじみ",
        description: "Freshwater clams from Lake Shinji, famous for their rich umami flavor.",
        culturalContext: "Lake Shinji produces 40% of Japan's shijimi. They are often used in Miso soup (Shijimi-jiru) and are considered a cure for hangovers due to high ornithine content.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shijimi_miso_soup.jpg/800px-Shijimi_miso_soup.jpg",
        price: 800
      },
      {
        id: "wakakusa",
        name: "Wakakusa",
        kanjiName: "若草",
        description: "A delicate wagashi (sweet) made from glutinous rice and dusted with green sugar.",
        culturalContext: "One of the 'Three Great Sweets of Matsue'. It represents the fresh green grass of spring, favored by Lord Matsudaira Fumai, a famous tea master daimyo.",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Wakakusa_Matsue.jpg",
        price: 1500
      }
    ],
    stores: [
      {
        name: "Yakumoan (Izumo Soba)",
        address: "305 Kitahori-cho, Matsue, Shimane",
        lat: 35.4765,
        lng: 133.0531,
        rating: 4.5,
        priceRange: "¥1000 - ¥2000"
      },
      {
        name: "Ichibata Department Store Matsue",
        address: "661 Asahi-machi, Matsue, Shimane",
        lat: 35.4638, 
        lng: 133.0634,
        rating: 4.0,
        priceRange: "¥2000 - ¥5000"
      },
      {
        name: "Izumo Taisha Souvenir Street",
        address: "Taisha-cho Kizuki Minami, Izumo, Shimane",
        lat: 35.3996,
        lng: 132.6859,
        rating: 4.7,
        priceRange: "¥500 - ¥3000"
      }
    ]
  },
  // Placeholder for others to prevent errors if clicked
  "Tokyo": {
    id: "Tokyo",
    name: "Tokyo",
    kanjiName: "東京都",
    region: "Kanto",
    description: "The capital city, blending the ultramodern and the traditional.",
    coordinates: [35.6895, 139.6917],
    specialties: [],
    stores: []
  },
  "Hokkaido": {
     id: "Hokkaido",
     name: "Hokkaido",
     kanjiName: "北海道",
     region: "Hokkaido",
     description: "Famous for vast nature, powder snow, and fresh seafood.",
     coordinates: [43.0667, 141.3500],
     specialties: [],
     stores: []
  },
  "Kyoto": {
     id: "Kyoto",
     name: "Kyoto",
     kanjiName: "京都府",
     region: "Kansai",
     description: "The heart of traditional Japan, famous for kaiseki arranging and temples.",
     coordinates: [35.0116, 135.7681],
     specialties: [],
     stores: []
  }
};
