// ADDITIONAL PREFECTURES DATA - To be merged with omiyageData.ts
// This file contains omiyage data for 40 more prefectures

export const ADDITIONAL_PREFECTURES = {
  // ===== TOHOKU REGION =====
  Aomori: {
    id: "Aomori",
    name: "Aomori",
    kanjiName: "青森県",
    region: "Tohoku",
    description: "Northernmost Honshu, famous for apples and Nebuta Festival.",
    coordinates: [40.8244, 140.74],
    specialties: [
      {
        id: "apple-pie",
        name: "Aomori Apple Pie",
        kanjiName: "青森アップルパイ",
        description: "Buttery pie filled with sweet Aomori apples.",
        culturalContext:
          "Aomori produces 60% of Japan's apples. These tart, juicy Fuji apples make the perfect pie filling!",
        image:
          "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?q=80&w=1000&auto=format&fit=crop",
        price: 1200,
      },
      {
        id: "dried-scallop",
        name: "Hotate (Dried Scallops)",
        kanjiName: "ほたて",
        description: "Premium dried scallops from Mutsu Bay.",
        culturalContext:
          "Mutsu Bay's cold waters produce Japan's best scallops. Rich umami flavor, perfect for soup or rice.",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
        price: 2500,
      },
    ],
    stores: [
      {
        name: "A-Factory (Aomori Station)",
        address: "1-4-2 Yanakawa, Aomori",
        lat: 40.8275,
        lng: 140.7431,
        rating: 4.5,
        priceRange: "¥800 - ¥3000",
      },
    ],
  },

  Iwate: {
    id: "Iwate",
    name: "Iwate",
    kanjiName: "岩手県",
    region: "Tohoku",
    description: "Land of wanko soba and beautiful coastlines.",
    coordinates: [39.7036, 141.1527],
    specialties: [
      {
        id: "kamome-egg",
        name: "Kamome no Tamago",
        kanjiName: "かもめの玉子",
        description:
          "Egg-shaped cake with white bean paste and sponge, coated in white chocolate.",
        culturalContext:
          "Named after seagull eggs. Created in 1952, it's Iwate's #1 souvenir with fluffy texture!",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 1100,
      },
      {
        id: "morioka-reimen",
        name: "Morioka Reimen (Instant)",
        kanjiName: "盛岡冷麺",
        description:
          "Chewy cold noodles in refreshing beef broth, take-home version.",
        culturalContext:
          "Korean-influenced dish that became Morioka's soul food. Elastic noodles with tangy kimchi!",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop",
        price: 650,
      },
    ],
    stores: [
      {
        name: "Saito Confectionery (Morioka Station)",
        address: "1-48 Morioka-ekimae-dori, Morioka",
        lat: 39.701,
        lng: 141.1366,
        rating: 4.7,
        priceRange: "¥800 - ¥2000",
      },
    ],
  },

  Miyagi: {
    id: "Miyagi",
    name: "Miyagi",
    kanjiName: "宮城県",
    region: "Tohoku",
    description: "Home to Sendai and delicious beef tongue.",
    coordinates: [38.2682, 140.8721],
    specialties: [
      {
        id: "zunda-mochi",
        name: "Zunda Mochi",
        kanjiName: "ずんだ餅",
        description: "Mochi topped with sweet edamame paste.",
        culturalContext:
          "Sendai's signature! Bright green zunda (crushed edamame) is both sweet and healthy. Date Masamune's favorite!",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 900,
      },
      {
        id: "hagi-moon",
        name: "Hagi no Tsuki",
        kanjiName: "萩の月",
        description: "Fluffy castella cake filled with custard cream.",
        culturalContext:
          "Sendai's beloved souvenir since 1979. The soft sponge represents the moon over bush clover fields.",
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
        price: 1300,
      },
    ],
    stores: [
      {
        name: "Sendai Station S-PAL",
        address: "1-1-1 Chuo, Aoba-ku, Sendai",
        lat: 38.2606,
        lng: 140.8819,
        rating: 4.6,
        priceRange: "¥800 - ¥2500",
      },
    ],
  },

  Akita: {
    id: "Akita",
    name: "Akita",
    kanjiName: "秋田県",
    region: "Tohoku",
    description: "Famous for rice, sake, and Namahage folklore.",
    coordinates: [39.7186, 140.1024],
    specialties: [
      {
        id: "kinako-bou",
        name: "Kinako Bou",
        kanjiName: "きなこ棒",
        description: "Soybean flour candy sticks, crunchy and sweet.",
        culturalContext:
          "Retro candy from 1930s! Simple ingredients: kinako, sugar, and starch syrup. Addictively crunchy!",
        image:
          "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?q=80&w=1000&auto=format&fit=crop",
        price: 400,
      },
      {
        id: "iburigakko",
        name: "Iburigakko",
        kanjiName: "いぶりがっこ",
        description: "Smoked pickled daikon radish, Akita's unique tsukemono.",
        culturalContext:
          "Preserved using smoke from ancient irori hearths. Smoky aroma with crunchy texture, perfect with sake!",
        image:
          "https://images.unsplash.com/photo-1596040033229-a0b55b3a6f3f?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
    ],
    stores: [
      {
        name: "Akita Station Topico",
        address: "7-1-2 Nakadori, Akita",
        lat: 39.7187,
        lng: 140.1239,
        rating: 4.4,
        priceRange: "¥500 - ¥2000",
      },
    ],
  },

  Yamagata: {
    id: "Yamagata",
    name: "Yamagata",
    kanjiName: "山形県",
    region: "Tohoku",
    description: "Cherry capital and hot spring paradise.",
    coordinates: [38.2404, 140.3633],
    specialties: [
      {
        id: "cherry-confection",
        name: "Sato Nishiki Cherries",
        kanjiName: "佐藤錦",
        description: "Premium cherry preserves and sweets.",
        culturalContext:
          "Yamagata produces 70% of Japan's cherries! Sato Nishiki variety is sweet, juicy perfection.",
        image:
          "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1000&auto=format&fit=crop",
        price: 1800,
      },
      {
        id: "tama-konnyaku",
        name: "Tama Konnyaku",
        kanjiName: "玉こんにゃく",
        description:
          "Round konnyaku balls in soy sauce, popular festival food.",
        culturalContext:
          "Yamagata's comfort food since Edo period. Chewy texture soaked in savory dashi - street food favorite!",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 600,
      },
    ],
    stores: [
      {
        name: "Yamagata Station Gift Shop",
        address: "1-1-1 Kasumi-cho, Yamagata",
        lat: 38.2406,
        lng: 140.3395,
        rating: 4.3,
        priceRange: "¥600 - ¥2500",
      },
    ],
  },

  Fukushima: {
    id: "Fukushima",
    name: "Fukushima",
    kanjiName: "福島県",
    region: "Tohoku",
    description: "Peach country with beautiful castles and hot springs.",
    coordinates: [37.75, 140.4674],
    specialties: [
      {
        id: "mamador",
        name: "Mamador",
        kanjiName: "ままどおる",
        description: "Buttery cookie filled with milk-flavored bean paste.",
        culturalContext:
          "Meaning 'drink milk' in Spanish! Created in 1968, the milky filling melts in your mouth.",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 1000,
      },
      {
        id: "peach-jelly",
        name: "Fukushima Peach Jelly",
        kanjiName: "福島桃ゼリー",
        description:
          "Fresh peach jelly made from Fukushima's famous Akatsuki peaches.",
        culturalContext:
          "Fukushima peaches are incredibly sweet! This jelly captures the juicy, aromatic essence.",
        image:
          "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1000&auto=format&fit=crop",
        price: 1200,
      },
    ],
    stores: [
      {
        name: "Fukushima Station PIVOUNE",
        address: "1-1 Sakaemachi, Fukushima",
        lat: 37.7542,
        lng: 140.4614,
        rating: 4.4,
        priceRange: "¥800 - ¥2000",
      },
    ],
  },

  // ===== KANTO REGION =====
  Ibaraki: {
    id: "Ibaraki",
    name: "Ibaraki",
    kanjiName: "茨城県",
    region: "Kanto",
    description: "Natto homeland and agricultural powerhouse.",
    coordinates: [36.3418, 140.4468],
    specialties: [
      {
        id: "natto-okaki",
        name: "Natto Rice Crackers",
        kanjiName: "納豆おかき",
        description: "Crispy rice crackers flavored with fermented soybeans.",
        culturalContext:
          "Mito is natto capital! These crackers capture that sticky, savory umami without the slime.",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 700,
      },
      {
        id: "mito-komon",
        name: "Mito Komon Manju",
        kanjiName: "水戸黄門饅頭",
        description:
          "Sweet buns filled with anko, featuring historical lord Mitsukuni.",
        culturalContext:
          "Named after famous Edo-period lord. These buns symbolize Mito's proud samurai history!",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 900,
      },
    ],
    stores: [
      {
        name: "Mito Station Excel",
        address: "1-1-1 Miyamachi, Mito",
        lat: 36.3708,
        lng: 140.4709,
        rating: 4.2,
        priceRange: "¥600 - ¥1800",
      },
    ],
  },

  Tochigi: {
    id: "Tochigi",
    name: "Tochigi",
    kanjiName: "栃木県",
    region: "Kanto",
    description: "Home to Nikko shrines and gyoza paradise.",
    coordinates: [36.5658, 139.8836],
    specialties: [
      {
        id: "lemon-milk",
        name: "Lemon Milk Cookies",
        kanjiName: "レモン牛乳",
        description: "Lemon-flavored milk cookies, Tochigi's cult classic!",
        culturalContext:
          "Based on famous Kanto Lemon drink! This yellow milk drink is beloved locally, now in cookie form.",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
      {
        id: "nikko-yuba",
        name: "Nikko Yuba",
        kanjiName: "日光湯葉",
        description: "Premium tofu skin, a Buddhist vegetarian delicacy.",
        culturalContext:
          "Nikko's pure mountain water makes the best yuba. Eaten by Buddhist monks for centuries!",
        image:
          "https://images.unsplash.com/photo-1596040033229-a0b55b3a6f3f?q=80&w=1000&auto=format&fit=crop",
        price: 1500,
      },
    ],
    stores: [
      {
        name: "Utsunomiya Station VAL",
        address: "1-3-1 Kawamuko-cho, Utsunomiya",
        lat: 36.5577,
        lng: 139.8983,
        rating: 4.3,
        priceRange: "¥700 - ¥2000",
      },
    ],
  },

  Gunma: {
    id: "Gunma",
    name: "Gunma",
    kanjiName: "群馬県",
    region: "Kanto",
    description: "Hot spring haven and konnyaku capital.",
    coordinates: [36.391, 139.0608],
    specialties: [
      {
        id: "yaki-manju",
        name: "Yaki Manju",
        kanjiName: "焼きまんじゅう",
        description: "Grilled steamed buns coated with sweet miso sauce.",
        culturalContext:
          "Gunma's unique snack! Unlike normal manju, these have NO filling - just fluffy bread with caramelized miso!",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 650,
      },
      {
        id: "konnyaku-jelly",
        name: "Konnyaku Jelly",
        kanjiName: "こんにゃくゼリー",
        description: "Chewy fruit jellies made from konnyaku root.",
        culturalContext:
          "Gunma produces 90% of Japan's konnyaku! These jellies are healthy, low-calorie, and delicious.",
        image:
          "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?q=80&w=1000&auto=format&fit=crop",
        price: 500,
      },
    ],
    stores: [
      {
        name: "Takasaki Station E-SITE",
        address: "222 Yashima-cho, Takasaki",
        lat: 36.3223,
        lng: 139.0033,
        rating: 4.4,
        priceRange: "¥500 - ¥1500",
      },
    ],
  },

  Saitama: {
    id: "Saitama",
    name: "Saitama",
    kanjiName: "埼玉県",
    region: "Kanto",
    description: "Tokyo's neighbor, famous for sweet potato and bonsai.",
    coordinates: [35.8569, 139.6489],
    specialties: [
      {
        id: "kurazukuri-okaki",
        name: "Kurazukuri Rice Crackers",
        kanjiName: "蔵造りおかき",
        description:
          "Traditional soy sauce-flavored rice crackers from Kawagoe.",
        culturalContext:
          "Made in Kawagoe's 'Little Edo' streets. Crafted using Edo-period techniques!",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
      {
        id: "jyumonji-manju",
        name: "Jumonji Manju",
        kanjiName: "十万石まんじゅう",
        description: "Soft manju with smooth sweet bean paste filling.",
        culturalContext:
          "Saitama's pride since 1954! The tagline 'Fuumu, Jumonjiya' (風味豊か十万石) is famous!",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 900,
      },
    ],
    stores: [
      {
        name: "Omiya Station Ecute",
        address: "Nishikicho, Omiya-ku, Saitama",
        lat: 35.9063,
        lng: 139.6239,
        rating: 4.5,
        priceRange: "¥700 - ¥2000",
      },
    ],
  },

  Chiba: {
    id: "Chiba",
    name: "Chiba",
    kanjiName: "千葉県",
    region: "Kanto",
    description: "Home to Narita Airport and Tokyo Disneyland.",
    coordinates: [35.6048, 140.1233],
    specialties: [
      {
        id: "peanuts-sable",
        name: "Chiba Peanut Sable",
        kanjiName: "千葉ピーナッツサブレ",
        description: "Buttery cookies filled with peanut cream.",
        culturalContext:
          "Chiba produces 80% of Japan's peanuts! These cookies showcase that nutty richness.",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 1000,
      },
      {
        id: "nure-senbei",
        name: "Nure Senbei",
        kanjiName: "ぬれ煎餅",
        description: "Moist soy sauce rice crackers, Choshi's specialty.",
        culturalContext:
          "Unlike crispy senbei, these are chewy and moist! Soaked in rich soy sauce for deep flavor.",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 700,
      },
    ],
    stores: [
      {
        name: "Narita Airport Terminal Shops",
        address: "Narita International Airport",
        lat: 35.772,
        lng: 140.3929,
        rating: 4.6,
        priceRange: "¥800 - ¥2500",
      },
    ],
  },

  // ===== CHUBU REGION =====
  Niigata: {
    id: "Niigata",
    name: "Niigata",
    kanjiName: "新潟県",
    region: "Chubu",
    description: "Rice and sake kingdom with heavy snow.",
    coordinates: [37.9161, 139.0364],
    specialties: [
      {
        id: "sasa-dango",
        name: "Sasa Dango",
        kanjiName: "笹団子",
        description: "Mugwort mochi wrapped in bamboo leaves.",
        culturalContext:
          "Niigata's soul food! The bamboo leaf imparts a subtle fragrance to the chewy yomogi mochi.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
      {
        id: "kaki-no-tane",
        name: "Kaki no Tane",
        kanjiName: "柿の種",
        description: "Spicy rice crackers with peanuts, Japan's #1 snack!",
        culturalContext:
          "Born in Niigata in 1923! The crescent shape was an accident that became iconic. Perfect with beer!",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 600,
      },
    ],
    stores: [
      {
        name: "Niigata Station CoCoLo",
        address: "1-1-1 Hanazono, Chuo-ku, Niigata",
        lat: 37.9126,
        lng: 139.0608,
        rating: 4.6,
        priceRange: "¥600 - ¥2000",
      },
    ],
  },

  Toyama: {
    id: "Toyama",
    name: "Toyama",
    kanjiName: "富山県",
    region: "Chubu",
    description: "Alpine region famous for firefly squid.",
    coordinates: [36.6953, 137.2113],
    specialties: [
      {
        id: "shiroebi-senbei",
        name: "Shiro-ebi Senbei",
        kanjiName: "白えび煎餅",
        description: "Crispy crackers made with Toyama Bay's white shrimp.",
        culturalContext:
          "Toyama Bay's 'jewel of the sea'! These transparent shrimp have sweet, delicate flavor.",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 1200,
      },
      {
        id: "tsukumo",
        name: "Tsukumo Mochi",
        kanjiName: "つくも餅",
        description: "Sweet red bean paste wrapped in glutinous rice.",
        culturalContext:
          "Named after Toyama Bay! Soft, stretchy mochi represents the waves of the sea.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 900,
      },
    ],
    stores: [
      {
        name: "Toyama Station Kiosk",
        address: "1-1 Sakuramachi, Toyama",
        lat: 36.7017,
        lng: 137.2141,
        rating: 4.4,
        priceRange: "¥800 - ¥2000",
      },
    ],
  },

  Ishikawa: {
    id: "Ishikawa",
    name: "Ishikawa",
    kanjiName: "石川県",
    region: "Chubu",
    description: "Kanazawa's gold leaf and seafood paradise.",
    coordinates: [36.5945, 136.6256],
    specialties: [
      {
        id: "kintsuba",
        name: "Kaga Kintsuba",
        kanjiName: "加賀きんつば",
        description: "Sweet red bean cake wrapped in thin crepe.",
        culturalContext:
          "Kanazawa's refined wagashi! Unlike Tokyo kintsuba, Kaga's version is square and elegant.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 1100,
      },
      {
        id: "gold-leaf-sake",
        name: "Gold Leaf Sake",
        kanjiName: "金箔入り日本酒",
        description: "Premium sake with edible gold flakes.",
        culturalContext:
          "Kanazawa produces 99% of Japan's gold leaf! This luxurious sake is perfect for celebrations.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop",
        price: 2500,
      },
    ],
    stores: [
      {
        name: "Kanazawa Station Anto",
        address: "1-1 Kinoshinbomachi, Kanazawa",
        lat: 36.5782,
        lng: 136.6478,
        rating: 4.7,
        priceRange: "¥1000 - ¥3500",
      },
    ],
  },

  Fukui: {
    id: "Fukui",
    name: "Fukui",
    kanjiName: "福井県",
    region: "Chubu",
    description: "Dinosaur fossils and Echizen crab country.",
    coordinates: [36.0652, 136.2216],
    specialties: [
      {
        id: "hekadoshi",
        name: "Hekadoshi",
        kanjiName: "羽二重餅",
        description: "Ultra-soft mochi wrapped around sweet bean paste.",
        culturalContext:
          "Named after Fukui's famous silk! The texture is as smooth as the finest fabric.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 1000,
      },
      {
        id: "echizen-oroshi-soba",
        name: "Echizen Oroshi Soba",
        kanjiName: "越前おろしそば",
        description: "Buckwheat noodles with grated daikon, take-home kit.",
        culturalContext:
          "Fukui's signature dish! The spicy daikon cuts through the rich soba flavor perfectly.",
        image:
          "https://images.unsplash.com/photo-1558985250-27a406d64cb6?q=80&w=1000&auto=format&fit=crop",
        price: 850,
      },
    ],
    stores: [
      {
        name: "Fukui Station Prism",
        address: "1-1-1 Chuo, Fukui",
        lat: 36.0613,
        lng: 136.2236,
        rating: 4.3,
        priceRange: "¥800 - ¥2000",
      },
    ],
  },

  Yamanashi: {
    id: "Yamanashi",
    name: "Yamanashi",
    kanjiName: "山梨県",
    region: "Chubu",
    description: "Mt. Fuji's home and grape/wine capital.",
    coordinates: [35.6638, 138.5683],
    specialties: [
      {
        id: "shingen-mochi",
        name: "Shingen Mochi",
        kanjiName: "信玄餅",
        description: "Kinako-dusted mochi with kuromitsu syrup.",
        culturalContext:
          "Named after warlord Takeda Shingen! Pour the black sugar syrup over kinako mochi - heavenly!",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 750,
      },
      {
        id: "grape-cookies",
        name: "Koshu Grape Cookies",
        kanjiName: "甲州ぶどうクッキー",
        description: "Buttery cookies infused with Yamanashi wine.",
        culturalContext:
          "Yamanashi's Koshu grapes make Japan's best wine! These cookies capture that fruity elegance.",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 1100,
      },
    ],
    stores: [
      {
        name: "Kofu Station Gift Plaza",
        address: "1-1-1 Marunouchi, Kofu",
        lat: 35.6654,
        lng: 138.5688,
        rating: 4.4,
        priceRange: "¥700 - ¥2000",
      },
    ],
  },

  Nagano: {
    id: "Nagano",
    name: "Nagano",
    kanjiName: "長野県",
    region: "Chubu",
    description: "Alpine wonderland with apples and soba.",
    coordinates: [36.6513, 138.1811],
    specialties: [
      {
        id: "oyaki",
        name: "Oyaki",
        kanjiName: "おやき",
        description: "Grilled dumplings filled with vegetables or anko.",
        culturalContext:
          "Mountain farmers' soul food! These hearty buns sustained workers in harsh alpine winters.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 600,
      },
      {
        id: "kuri-kinton",
        name: "Obuse Kuri Kinton",
        kanjiName: "小布施栗きんとん",
        description: "Chestnut paste sweets from Obuse town.",
        culturalContext:
          "Obuse chestnuts are legendary! This silky paste melts on your tongue with natural sweetness.",
        image:
          "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?q=80&w=1000&auto=format&fit=crop",
        price: 1500,
      },
    ],
    stores: [
      {
        name: "Nagano Station MIDORI",
        address: "1356-1 Minami-Ishidocho, Nagano",
        lat: 36.6425,
        lng: 138.1888,
        rating: 4.5,
        priceRange: "¥600 - ¥2500",
      },
    ],
  },

  Gifu: {
    id: "Gifu",
    name: "Gifu",
    kanjiName: "岐阜県",
    region: "Chubu",
    description: "Cormorant fishing and Hida beef land.",
    coordinates: [35.3912, 136.7223],
    specialties: [
      {
        id: "kurikinton",
        name: "Nakatsugawa Kuri Kinton",
        kanjiName: "中津川栗きんとん",
        description: "Pure chestnut paste shaped like chestnuts.",
        culturalContext:
          "Nakatsugawa's specialty since Edo period! Only chestnuts and sugar - nothing else!",
        image:
          "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?q=80&w=1000&auto=format&fit=crop",
        price: 1400,
      },
      {
        id: "ayu-sweets",
        name: "Ayu no Sugata-zushi",
        kanjiName: "鮎の姿寿司",
        description: "Sweetfish-shaped sponge cake filled with custard.",
        culturalContext:
          "Representing Nagara River's cormorant fishing! The ayu shape is both cute and delicious.",
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
        price: 950,
      },
    ],
    stores: [
      {
        name: "Gifu Station Active G",
        address: "6-2 Hashimoto-cho, Gifu",
        lat: 35.4091,
        lng: 136.7564,
        rating: 4.3,
        priceRange: "¥800 - ¥2000",
      },
    ],
  },

  Shizuoka: {
    id: "Shizuoka",
    name: "Shizuoka",
    kanjiName: "静岡県",
    region: "Chubu",
    description: "Mt. Fuji, green tea, and eel paradise.",
    coordinates: [34.9766, 138.383],
    specialties: [
      {
        id: "unagi-pie",
        name: "Unagi Pie",
        kanjiName: "うなぎパイ",
        description: "Crispy eel-flavored pastry, Hamamatsu's icon.",
        culturalContext:
          "Contains eel extract! The tagline 'Yoru no Okashi' (Night Snack) caused controversy but it's family-friendly!",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 1200,
      },
      {
        id: "green-tea-sweets",
        name: "Shizuoka Green Tea Sweets",
        kanjiName: "静岡茶菓子",
        description: "Premium matcha cookies and chocolates.",
        culturalContext:
          "Shizuoka produces 40% of Japan's tea! These sweets showcase that rich, grassy flavor.",
        image:
          "https://images.unsplash.com/photo-1582716401301-b2407dc7563d?q=80&w=1000&auto=format&fit=crop",
        price: 1300,
      },
    ],
    stores: [
      {
        name: "Shizuoka Station ASTY",
        address: "3-1-1 Kuruma-cho, Shizuoka",
        lat: 34.9758,
        lng: 138.3885,
        rating: 4.5,
        priceRange: "¥900 - ¥2500",
      },
    ],
  },

  // ===== KANSAI REGION =====
  Mie: {
    id: "Mie",
    name: "Mie",
    kanjiName: "三重県",
    region: "Kansai",
    description: "Ise Shrine and spiny lobster coast.",
    coordinates: [34.7303, 136.5086],
    specialties: [
      {
        id: "akafuku-mochi",
        name: "Akafuku Mochi",
        kanjiName: "赤福餅",
        description: "Sweet red bean paste over soft mochi, Ise's signature.",
        culturalContext:
          "Sold at Ise Shrine since 1707! The wave pattern represents Isuzu River flowing to the shrine.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 760,
      },
      {
        id: "matsusaka-beef",
        name: "Matsusaka Beef Jerky",
        kanjiName: "松阪牛ジャーキー",
        description: "Premium beef jerky from legendary Matsusaka cattle.",
        culturalContext:
          "Matsusaka beef rivals Kobe! This jerky captures that intense marbled flavor in portable form.",
        image:
          "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?q=80&w=1000&auto=format&fit=crop",
        price: 2000,
      },
    ],
    stores: [
      {
        name: "Ise Shrine Oharai-machi",
        address: "Ujiimazaike-cho, Ise",
        lat: 34.4552,
        lng: 136.7255,
        rating: 4.8,
        priceRange: "¥700 - ¥3000",
      },
    ],
  },

  Shiga: {
    id: "Shiga",
    name: "Shiga",
    kanjiName: "滋賀県",
    region: "Kansai",
    description: "Lake Biwa and ancient temples.",
    coordinates: [35.0045, 135.8686],
    specialties: [
      {
        id: "funazushi",
        name: "Funazushi",
        kanjiName: "鮒寿司",
        description: "Fermented crucian carp, Japan's oldest sushi.",
        culturalContext:
          "1000+ year history! This pungent delicacy takes months to ferment. Acquired taste but deeply traditional.",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1000&auto=format&fit=crop",
        price: 3000,
      },
      {
        id: "omi-beef",
        name: "Omi Beef Senbei",
        kanjiName: "近江牛煎餅",
        description: "Crispy rice crackers flavored with Omi beef.",
        culturalContext:
          "Omi beef is Japan's oldest wagyu brand! These crackers capture that rich beefy umami.",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 1200,
      },
    ],
    stores: [
      {
        name: "Otsu Station Biwako Souvenir Plaza",
        address: "1-1-1 Umemori, Otsu",
        lat: 35.0088,
        lng: 135.8626,
        rating: 4.3,
        priceRange: "¥800 - ¥3500",
      },
    ],
  },

  Hyogo: {
    id: "Hyogo",
    name: "Hyogo",
    kanjiName: "兵庫県",
    region: "Kansai",
    description: "Kobe beef and Himeji Castle.",
    coordinates: [34.6913, 135.183],
    specialties: [
      {
        id: "kobe-pudding",
        name: "Kobe Pudding",
        kanjiName: "神戸プリン",
        description: "Ultra-creamy custard pudding in glass bottle.",
        culturalContext:
          "Kobe's dairy expertise shines! This pudding is so smooth it melts instantly on your tongue.",
        image:
          "https://images.unsplash.com/photo-1570145820509-dd0f29f4e005?q=80&w=1000&auto=format&fit=crop",
        price: 350,
      },
      {
        id: "akashi-yaki",
        name: "Akashi-yaki Crackers",
        kanjiName: "明石焼き煎餅",
        description: "Octopus ball crackers representing Akashi's specialty.",
        culturalContext:
          "Akashi-yaki is softer than takoyaki! These crackers capture that dashi-rich flavor.",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
    ],
    stores: [
      {
        name: "Kobe Sannomiya Station",
        address: "Kumochi-cho, Chuo-ku, Kobe",
        lat: 34.6951,
        lng: 135.1955,
        rating: 4.6,
        priceRange: "¥600 - ¥2500",
      },
    ],
  },

  Nara: {
    id: "Nara",
    name: "Nara",
    kanjiName: "奈良県",
    region: "Kansai",
    description: "Ancient capital with sacred deer.",
    coordinates: [34.6851, 135.805],
    specialties: [
      {
        id: "nakatanidou",
        name: "Nakatanidou Yomogi Mochi",
        kanjiName: "中谷堂よもぎ餅",
        description: "Fresh-pounded mugwort mochi, legendary speed-pounding!",
        culturalContext:
          "Watch them pound mochi at lightning speed! The chewy texture is unbeatable when fresh.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 150,
      },
      {
        id: "shikano-senbei",
        name: "Shikano Senbei",
        kanjiName: "鹿の煎餅",
        description: "Deer-shaped rice crackers, Nara's adorable souvenir.",
        culturalContext:
          "Shaped like Nara's sacred deer! These aren't for the deer though - they're for you!",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
    ],
    stores: [
      {
        name: "Nara Park Nakamachi Street",
        address: "Higashimuki Nakamachi, Nara",
        lat: 34.6825,
        lng: 135.8295,
        rating: 4.7,
        priceRange: "¥400 - ¥1500",
      },
    ],
  },

  Wakayama: {
    id: "Wakayama",
    name: "Wakayama",
    kanjiName: "和歌山県",
    region: "Kansai",
    description: "Mikan orange paradise and Kumano pilgrimage.",
    coordinates: [34.2261, 135.1675],
    specialties: [
      {
        id: "umeboshi",
        name: "Kishu Nanko Umeboshi",
        kanjiName: "紀州南高梅干し",
        description: "Premium pickled plums, Japan's finest.",
        culturalContext:
          "Wakayama produces 60% of Japan's ume! Nanko variety is large, soft, and perfectly balanced.",
        image:
          "https://images.unsplash.com/photo-1596040033229-a0b55b3a6f3f?q=80&w=1000&auto=format&fit=crop",
        price: 1500,
      },
      {
        id: "mikan-jelly",
        name: "Arida Mikan Jelly",
        kanjiName: "有田みかんゼリー",
        description: "Sweet orange jelly bursting with juice.",
        culturalContext:
          "Arida mikan are incredibly sweet! This jelly captures the sunshine flavor of Wakayama oranges.",
        image:
          "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1000&auto=format&fit=crop",
        price: 900,
      },
    ],
    stores: [
      {
        name: "Wakayama Station MIO",
        address: "1 Misonobashi-dori, Wakayama",
        lat: 34.2331,
        lng: 135.1905,
        rating: 4.4,
        priceRange: "¥800 - ¥2500",
      },
    ],
  },

  // ===== CHUGOKU REGION =====
  Tottori: {
    id: "Tottori",
    name: "Tottori",
    kanjiName: "鳥取県",
    region: "Chugoku",
    description: "Sand dunes and pear kingdom.",
    coordinates: [35.5014, 134.2381],
    specialties: [
      {
        id: "nijisseiki-pear",
        name: "Nijisseiki Pear Jelly",
        kanjiName: "二十世紀梨ゼリー",
        description: "Juicy pear jelly made from Tottori's famous green pears.",
        culturalContext:
          "Tottori's pears are legendary! Nijisseiki (20th Century) variety is crisp, sweet perfection.",
        image:
          "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=1000&auto=format&fit=crop",
        price: 1000,
      },
      {
        id: "daisen-butter",
        name: "Daisen Butter Cookies",
        kanjiName: "大山バタークッキー",
        description: "Rich butter cookies from Mt. Daisen dairy.",
        culturalContext:
          "Mt. Daisen's pure air makes the best dairy! These cookies are melt-in-your-mouth buttery.",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 950,
      },
    ],
    stores: [
      {
        name: "Tottori Station Gift Shop",
        address: "102 Higashimachi, Tottori",
        lat: 35.501,
        lng: 134.2372,
        rating: 4.3,
        priceRange: "¥800 - ¥2000",
      },
    ],
  },

  Okayama: {
    id: "Okayama",
    name: "Okayama",
    kanjiName: "岡山県",
    region: "Chugoku",
    description: "Sunshine land with peaches and Momotaro legend.",
    coordinates: [34.6617, 133.935],
    specialties: [
      {
        id: "kibi-dango",
        name: "Kibi Dango",
        kanjiName: "きびだんご",
        description:
          "Mochi balls made from millet, Momotaro's legendary snack!",
        culturalContext:
          "From the Momotaro folktale! These chewy balls gave the hero strength to fight demons.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 700,
      },
      {
        id: "muscat-jelly",
        name: "Okayama Muscat Jelly",
        kanjiName: "岡山マスカットゼリー",
        description: "Luxurious green grape jelly.",
        culturalContext:
          "Okayama's Shine Muscat grapes are Japan's finest! Each grape costs $10+ - this jelly is affordable luxury.",
        image:
          "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=1000&auto=format&fit=crop",
        price: 1500,
      },
    ],
    stores: [
      {
        name: "Okayama Station SanSun",
        address: "1-1-1 Ekimotomachi, Okayama",
        lat: 34.6655,
        lng: 133.9191,
        rating: 4.5,
        priceRange: "¥700 - ¥2500",
      },
    ],
  },

  Hiroshima: {
    id: "Hiroshima",
    name: "Hiroshima",
    kanjiName: "広島県",
    region: "Chugoku",
    description: "Peace city famous for okonomiyaki and oysters.",
    coordinates: [34.3853, 132.4553],
    specialties: [
      {
        id: "momiji-manju",
        name: "Momiji Manju",
        kanjiName: "もみじ饅頭",
        description: "Maple leaf-shaped cake filled with sweet anko.",
        culturalContext:
          "Miyajima's iconic souvenir since 1906! The maple leaf represents autumn on sacred Itsukushima.",
        image: "/img/momiji.png",
        price: 900,
      },
      {
        id: "oyster-okonomiyaki",
        name: "Hiroshima Okonomiyaki Sauce",
        kanjiName: "広島お好み焼きソース",
        description: "Sweet-savory sauce for Hiroshima-style okonomiyaki.",
        culturalContext:
          "Hiroshima's soul food! Layer-style okonomiyaki with noodles needs this perfect sauce blend.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop",
        price: 600,
      },
    ],
    stores: [
      {
        name: "Hiroshima Station ekie",
        address: "1-2 Matsubara-cho, Hiroshima",
        lat: 34.3979,
        lng: 132.4753,
        rating: 4.6,
        priceRange: "¥600 - ¥2000",
      },
    ],
  },

  Yamaguchi: {
    id: "Yamaguchi",
    name: "Yamaguchi",
    kanjiName: "山口県",
    region: "Chugoku",
    description: "Westernmost Honshu, fugu and history.",
    coordinates: [34.1858, 131.4706],
    specialties: [
      {
        id: "fuku-senbei",
        name: "Fuku Senbei",
        kanjiName: "ふく煎餅",
        description:
          "Blowfish-shaped rice crackers (fugu is 'fuku' in dialect).",
        culturalContext:
          "Shimonoseki is fugu capital! These cute crackers avoid the poison but keep the charm.",
        image:
          "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
      {
        id: "usukarigahanadoori",
        name: "Uirou",
        kanjiName: "外郎",
        description: "Yamaguchi-style steamed rice cake with sweet bean paste.",
        culturalContext:
          "Different from Nagoya's! Yamaguchi version is softer with elegant sweetness.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 850,
      },
    ],
    stores: [
      {
        name: "Shin-Yamaguchi Station Gift Shop",
        address: "1-1-1 Ogori, Yamaguchi",
        lat: 34.0769,
        lng: 131.4436,
        rating: 4.3,
        priceRange: "¥700 - ¥1800",
      },
    ],
  },

  // ===== SHIKOKU REGION =====
  Tokushima: {
    id: "Tokushima",
    name: "Tokushima",
    kanjiName: "徳島県",
    region: "Shikoku",
    description: "Awa Odori dance and indigo dye.",
    coordinates: [34.0658, 134.5594],
    specialties: [
      {
        id: "sudachi-ponzu",
        name: "Sudachi Citrus Products",
        kanjiName: "すだち",
        description: "Refreshing sudachi juice and sweets.",
        culturalContext:
          "Tokushima produces 98% of Japan's sudachi! This green citrus is more aromatic than lime.",
        image:
          "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1000&auto=format&fit=crop",
        price: 1000,
      },
      {
        id: "kincho-manju",
        name: "Kincho Manju",
        kanjiName: "金長まんじゅう",
        description: "Tanuki (raccoon dog) shaped sweet buns.",
        culturalContext:
          "Based on Tokushima's famous tanuki folklore! These cute buns honor the legendary Kincho.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 750,
      },
    ],
    stores: [
      {
        name: "Tokushima Station Clement Plaza",
        address: "1-5 Terashima-honcho-nishi, Tokushima",
        lat: 34.0748,
        lng: 134.5532,
        rating: 4.4,
        priceRange: "¥700 - ¥2000",
      },
    ],
  },

  Kagawa: {
    id: "Kagawa",
    name: "Kagawa",
    kanjiName: "香川県",
    region: "Shikoku",
    description: "Udon kingdom and Seto Inland Sea.",
    coordinates: [34.3401, 134.0434],
    specialties: [
      {
        id: "sanuki-udon",
        name: "Sanuki Udon (Dry)",
        kanjiName: "讃岐うどん",
        description: "Famous thick udon noodles, take-home pack.",
        culturalContext:
          "Kagawa consumes most udon per capita in Japan! Firm, chewy texture is perfection.",
        image:
          "https://images.unsplash.com/photo-1618841557871-b9a8b57c8e8c?q=80&w=1000&auto=format&fit=crop",
        price: 600,
      },
      {
        id: "olive-sweets",
        name: "Shodoshima Olive Chocolates",
        kanjiName: "小豆島オリーブチョコ",
        description: "Chocolates infused with olive oil.",
        culturalContext:
          "Shodoshima is Japan's olive island! The fruity olive oil adds elegant complexity to chocolate.",
        image:
          "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1000&auto=format&fit=crop",
        price: 1200,
      },
    ],
    stores: [
      {
        name: "Takamatsu Station Gift Kiosk",
        address: "1-20 Hamano-cho, Takamatsu",
        lat: 34.3508,
        lng: 134.0469,
        rating: 4.5,
        priceRange: "¥600 - ¥2000",
      },
    ],
  },

  Ehime: {
    id: "Ehime",
    name: "Ehime",
    kanjiName: "愛媛県",
    region: "Shikoku",
    description: "Mikan paradise and Dogo Onsen.",
    coordinates: [33.8416, 132.7657],
    specialties: [
      {
        id: "ponkan-jelly",
        name: "Ehime Mikan Tart",
        kanjiName: "愛媛みかんタルト",
        description: "Fluffy sponge cake wrapped around mikan jam.",
        culturalContext:
          "Ehime produces Japan's best mikan! This roll cake is soaked in sweet citrus flavor.",
        image:
          "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1000&auto=format&fit=crop",
        price: 1300,
      },
      {
        id: "jakoten",
        name: "Jakoten",
        kanjiName: "じゃこ天",
        description: "Fried fish cake made from small fish.",
        culturalContext:
          "Uwa Sea's small fish make the best jakoten! Crispy outside, fluffy inside, perfect as snack or in udon.",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
        price: 700,
      },
    ],
    stores: [
      {
        name: "Matsuyama Station Kiosk",
        address: "Minami-cho, Matsuyama",
        lat: 33.8386,
        lng: 132.769,
        rating: 4.4,
        priceRange: "¥700 - ¥2000",
      },
    ],
  },

  Kochi: {
    id: "Kochi",
    name: "Kochi",
    kanjiName: "高知県",
    region: "Shikoku",
    description: "Bonito tataki and Sakamoto Ryoma's home.",
    coordinates: [33.5597, 133.5311],
    specialties: [
      {
        id: "katsuo-tataki",
        name: "Katsuo Tataki (Packaged)",
        kanjiName: "鰹のたたき",
        description: "Seared bonito with citrus ponzu sauce.",
        culturalContext:
          "Kochi's soul food! Sear the outside, leave inside raw - the aroma is intoxicating with yuzu!",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1000&auto=format&fit=crop",
        price: 1500,
      },
      {
        id: "buntan-mochi",
        name: "Buntan Mochi",
        kanjiName: "文旦餅",
        description: "Mochi flavored with Buntan citrus.",
        culturalContext:
          "Kochi's giant buntan grapefruit is sweet and aromatic! This mochi captures that refreshing essence.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 900,
      },
    ],
    stores: [
      {
        name: "Kochi Station Tosa Terrace",
        address: "1-1-1 Kita-honmachi, Kochi",
        lat: 33.5661,
        lng: 133.5336,
        rating: 4.5,
        priceRange: "¥800 - ¥2500",
      },
    ],
  },

  // ===== KYUSHU REGION =====
  Fukuoka: {
    id: "Fukuoka",
    name: "Fukuoka",
    kanjiName: "福岡県",
    region: "Kyushu",
    description: "Hakata ramen and mentaiko paradise.",
    coordinates: [33.5904, 130.4017],
    specialties: [
      {
        id: "mentaiko",
        name: "Hakata Mentaiko",
        kanjiName: "博多明太子",
        description: "Spicy cod roe, Fukuoka's signature.",
        culturalContext:
          "Brought from Korea in 1949! This spicy, salty roe is perfect with rice, pasta, or plain.",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
        price: 2000,
      },
      {
        id: "tonkotsu-ramen",
        name: "Hakata Tonkotsu Ramen Kit",
        kanjiName: "博多とんこつラーメン",
        description: "Instant ramen with rich pork bone broth.",
        culturalContext:
          "Hakata invented tonkotsu ramen! Creamy, milky broth simmered for 12+ hours.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
    ],
    stores: [
      {
        name: "Hakata Station Ming",
        address: "1-1 Hakataeki-chuogai, Fukuoka",
        lat: 33.5903,
        lng: 130.4206,
        rating: 4.7,
        priceRange: "¥800 - ¥3000",
      },
    ],
  },

  Saga: {
    id: "Saga",
    name: "Saga",
    kanjiName: "佐賀県",
    region: "Kyushu",
    description: "Pottery town and seaweed coast.",
    coordinates: [33.2494, 130.2989],
    specialties: [
      {
        id: "marubolo",
        name: "Marubolo",
        kanjiName: "丸ぼうろ",
        description: "Round sponge cake with honey flavor, Saga's classic.",
        culturalContext:
          "Portuguese-influenced sweet from 400 years ago! Soft, fluffy, with gentle sweetness.",
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
        price: 850,
      },
      {
        id: "saga-nori",
        name: "Ariake Sea Nori",
        kanjiName: "有明海苔",
        description: "Premium dried seaweed sheets.",
        culturalContext:
          "Ariake Sea's nutrient-rich waters grow Japan's best nori! Paper-thin with deep ocean flavor.",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
        price: 1200,
      },
    ],
    stores: [
      {
        name: "Saga Station Gift Corner",
        address: "1-1 Ekimae-chuo, Saga",
        lat: 33.2653,
        lng: 130.3005,
        rating: 4.2,
        priceRange: "¥700 - ¥2000",
      },
    ],
  },

  Nagasaki: {
    id: "Nagasaki",
    name: "Nagasaki",
    kanjiName: "長崎県",
    region: "Kyushu",
    description: "International port with Castella cake.",
    coordinates: [32.7503, 129.8777],
    specialties: [
      {
        id: "castella",
        name: "Nagasaki Castella",
        kanjiName: "長崎カステラ",
        description: "Portuguese sponge cake, moist and sweet.",
        culturalContext:
          "Brought by Portuguese in 1500s! Fukusaya's castella is THE original - dense, eggy perfection.",
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
        price: 1800,
      },
      {
        id: "kakuni-manju",
        name: "Kakuni Manju",
        kanjiName: "角煮まんじゅう",
        description: "Steamed buns filled with braised pork belly.",
        culturalContext:
          "Chinatown fusion! Tender, melt-in-mouth pork belly in fluffy bun - Nagasaki's comfort food.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 400,
      },
    ],
    stores: [
      {
        name: "Nagasaki Station Amu Plaza",
        address: "1-1 Onouemachi, Nagasaki",
        lat: 32.7532,
        lng: 129.8697,
        rating: 4.6,
        priceRange: "¥800 - ¥3000",
      },
    ],
  },

  Kumamoto: {
    id: "Kumamoto",
    name: "Kumamoto",
    kanjiName: "熊本県",
    region: "Kyushu",
    description: "Kumamon's home and horse meat cuisine.",
    coordinates: [32.8031, 130.7079],
    specialties: [
      {
        id: "ikinari-dango",
        name: "Ikinari Dango",
        kanjiName: "いきなり団子",
        description: "Sweet potato wrapped in dough with anko.",
        culturalContext:
          "Farmers' quick snack! The name means 'sudden dumpling' - made when guests arrive unexpectedly.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 600,
      },
      {
        id: "kumamon-cookies",
        name: "Kumamon Cookies",
        kanjiName: "くまモンクッキー",
        description: "Bear-shaped cookies featuring Kumamoto's mascot.",
        culturalContext:
          "Kumamon is Japan's most famous mascot! These cute cookies spread happiness worldwide.",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 950,
      },
    ],
    stores: [
      {
        name: "Kumamoto Station Amu Plaza",
        address: "3-15-26 Kasuga, Kumamoto",
        lat: 32.794,
        lng: 130.6893,
        rating: 4.5,
        priceRange: "¥600 - ¥2000",
      },
    ],
  },

  Oita: {
    id: "Oita",
    name: "Oita",
    kanjiName: "大分県",
    region: "Kyushu",
    description: "Hot spring capital 'Onsen Prefecture'.",
    coordinates: [33.2382, 131.6126],
    specialties: [
      {
        id: "zabieru",
        name: "Zabieru",
        kanjiName: "ざびえる",
        description: "Western-style cookie filled with white bean paste.",
        culturalContext:
          "Named after Francis Xavier who came to Oita! Rum-flavored cookie with smooth filling.",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 1100,
      },
      {
        id: "kabosu-ponzu",
        name: "Kabosu Citrus Products",
        kanjiName: "かぼす",
        description: "Refreshing kabosu juice and sweets.",
        culturalContext:
          "Oita produces 95% of Japan's kabosu! This green citrus is less acidic than lemon, perfect for seafood.",
        image:
          "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1000&auto=format&fit=crop",
        price: 900,
      },
    ],
    stores: [
      {
        name: "Oita Station AMU Plaza",
        address: "1-1-1 Kaname, Oita",
        lat: 33.2387,
        lng: 131.6037,
        rating: 4.4,
        priceRange: "¥800 - ¥2000",
      },
    ],
  },

  Miyazaki: {
    id: "Miyazaki",
    name: "Miyazaki",
    kanjiName: "宮崎県",
    region: "Kyushu",
    description: "Tropical paradise with mango and chicken nanban.",
    coordinates: [31.9077, 131.4202],
    specialties: [
      {
        id: "cheese-manju",
        name: "Cheese Manju",
        kanjiName: "チーズ饅頭",
        description: "Sweet buns with cream cheese filling.",
        culturalContext:
          "Miyazaki's dairy industry shines! These fluffy buns hide rich, tangy cheese cream inside.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 850,
      },
      {
        id: "mango-jelly",
        name: "Miyazaki Mango Sweets",
        kanjiName: "宮崎マンゴー",
        description: "Premium mango jelly and dried fruits.",
        culturalContext:
          "Miyazaki's Taiyo no Tamago mango costs $50+ each! These sweets capture that tropical luxury.",
        image:
          "https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=1000&auto=format&fit=crop",
        price: 1500,
      },
    ],
    stores: [
      {
        name: "Miyazaki Station Gift Shop",
        address: "4-6-3 Nishiki-machi, Miyazaki",
        lat: 31.9115,
        lng: 131.4239,
        rating: 4.5,
        priceRange: "¥800 - ¥2500",
      },
    ],
  },

  Kagoshima: {
    id: "Kagoshima",
    name: "Kagoshima",
    kanjiName: "鹿児島県",
    region: "Kyushu",
    description: "Sakurajima volcano and shochu distilleries.",
    coordinates: [31.5966, 130.5571],
    specialties: [
      {
        id: "karukan",
        name: "Karukan",
        kanjiName: "かるかん",
        description: "Light sponge cake made from yam and rice flour.",
        culturalContext:
          "Kagoshima's signature since Edo period! Fluffy as clouds with delicate sweetness.",
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
        price: 950,
      },
      {
        id: "satsuma-age",
        name: "Satsuma-age",
        kanjiName: "さつま揚げ",
        description: "Fried fish cakes, Kagoshima's specialty.",
        culturalContext:
          "The original fish cake! Made with fresh local fish, crispy outside, tender inside.",
        image:
          "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=1000&auto=format&fit=crop",
        price: 800,
      },
    ],
    stores: [
      {
        name: "Kagoshima-Chuo Station Miyage Yokocho",
        address: "1-1 Chuo-cho, Kagoshima",
        lat: 31.5851,
        lng: 130.5421,
        rating: 4.6,
        priceRange: "¥700 - ¥2000",
      },
    ],
  },

  Okinawa: {
    id: "Okinawa",
    name: "Okinawa",
    kanjiName: "沖縄県",
    region: "Kyushu",
    description: "Tropical islands with unique Ryukyu culture.",
    coordinates: [26.2124, 127.6809],
    specialties: [
      {
        id: "chinsuko",
        name: "Chinsuko",
        kanjiName: "ちんすこう",
        description: "Traditional Okinawan shortbread cookies.",
        culturalContext:
          "Ryukyu Kingdom royal sweet! Crumbly texture with lard gives unique rich flavor.",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1000&auto=format&fit=crop",
        price: 700,
      },
      {
        id: "beni-imo-tart",
        name: "Beni-Imo Tart",
        kanjiName: "紅芋タルト",
        description: "Purple sweet potato tart, Okinawa's iconic souvenir.",
        culturalContext:
          "Okinawa's purple yam is naturally sweet and vibrant! This tart is moist, rich perfection.",
        image:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1000&auto=format&fit=crop",
        price: 1200,
      },
      {
        id: "awamori",
        name: "Awamori",
        kanjiName: "泡盛",
        description: "Okinawan distilled rice spirit.",
        culturalContext:
          "600-year-old tradition! This spirit ages beautifully, becoming smoother with time.",
        image:
          "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=1000&auto=format&fit=crop",
        price: 1800,
      },
    ],
    stores: [
      {
        name: "Naha Airport Terminal Shops",
        address: "150 Kagamizu, Naha",
        lat: 26.2059,
        lng: 127.6465,
        rating: 4.7,
        priceRange: "¥700 - ¥3000",
      },
    ],
  },
};
