"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as topojson from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection } from "geojson";
import {
  JAPAN_REGIONS,
  getRegionByPrefecture,
  type RegionData,
} from "@/data/japanRegions";

const TOPOJSON_URL =
  "https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson";

// ============================================
// TYPES
// ============================================
type GeoFeature = Feature;

interface JapanMapProps {
  onSelectPrefecture: (id: string, name: string) => void;
  selectedId: string | null;
}

// Helper function to normalize prefecture names
const normalizePrefectureName = (name: string): string => {
  if (!name) return "";

  // Remove common suffixes: Ken (県), Fu (府), To (都), Do (道), -ken, -fu, -to, -do
  // Also normalize diacritics (ō -> o, ū -> u)
  const normalized = name
    .replace(/\s+Ken$/i, "")
    .replace(/\s+Fu$/i, "")
    .replace(/\s+To$/i, "")
    .replace(/\s+Do$/i, "")
    .replace(/-ken$/i, "")
    .replace(/-fu$/i, "")
    .replace(/-to$/i, "")
    .replace(/-do$/i, "")
    .replace(/\s+/g, "") // Remove all spaces (e.g., "Hokkai Do" → "HokkaiDo")
    .replace(/[ōŌ]/g, "o")
    .replace(/[ūŪ]/g, "u")
    .replace(/[āĀ]/g, "a")
    .trim();

  // Special case: GeoJSON might return "Hokkai" after removing " Do"
  if (normalized === "Hokkai") return "Hokkaido";

  return normalized;
};

// ============================================
// LABEL FIXES - Manual positioning với Leader Lines
// ============================================
const LABEL_FIXES: Record<
  string,
  { x: number; y: number; type: "line" | "simple" }
> = {
  // ===== KANTO REGION (Vùng mật độ cao nhất) =====
  Tokyo: { x: 35, y: 20, type: "line" }, // Kéo ra vịnh Tokyo
  Kanagawa: { x: 15, y: 35, type: "line" }, // Kéo xuống dưới
  Saitama: { x: -25, y: -25, type: "line" }, // Kéo lên tây bắc
  Chiba: { x: 40, y: 10, type: "line" }, // Kéo ra biển
  Gunma: { x: -18, y: -20, type: "line" },
  Tochigi: { x: 5, y: -30, type: "line" },
  Ibaraki: { x: 30, y: -15, type: "line" },

  // ===== KANSAI REGION (Osaka-Kyoto-Kobe triangle) =====
  Osaka: { x: -30, y: 18, type: "line" }, // Kéo ra vịnh Osaka
  Kyoto: { x: 12, y: -35, type: "line" }, // Kéo lên phía bắc
  Hyogo: { x: -35, y: -12, type: "line" }, // Kéo sang tây
  Nara: { x: 28, y: 8, type: "line" },
  Shiga: { x: 5, y: -25, type: "line" },
  Wakayama: { x: 10, y: 30, type: "line" },

  // ===== CHUBU REGION =====
  Aichi: { x: 15, y: 25, type: "line" }, // Nagoya area
  Gifu: { x: -12, y: 5, type: "simple" },
  Shizuoka: { x: 20, y: 20, type: "simple" },
  Toyama: { x: -22, y: -10, type: "simple" },
  Ishikawa: { x: -30, y: 8, type: "simple" },
  Fukui: { x: -18, y: 12, type: "simple" },
  Yamanashi: { x: 18, y: 10, type: "simple" },
  Nagano: { x: 0, y: -25, type: "simple" },
  Niigata: { x: -15, y: -20, type: "simple" },
};

// ============================================
// PREFECTURE PATH COMPONENT
// ============================================
const PrefecturePath = ({
  feature,
  pathData,
  centroid,
  isSelected,
  isInActiveRegion,
  isHoveredRegion,
  onClick,
  mode,
  regionCenter,
  allCentroids,
}: {
  feature: GeoFeature;
  pathData: string;
  centroid: [number, number];
  isSelected: boolean;
  isInActiveRegion: boolean;
  isHoveredRegion: boolean;
  onClick: () => void;
  mode: "world" | "region";
  regionCenter?: [number, number];
  allCentroids?: Array<[number, number]>;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Fish-Eye Effect: Tính toán vị trí mới của label để tránh chồng lên nhau
  const calculateFishEyePosition = (): [number, number] => {
    if (mode !== "region" || !regionCenter || !allCentroids) {
      return centroid;
    }

    const [cx, cy] = centroid;
    const [rcx, rcy] = regionCenter;

    // Tính vector từ center của region đến centroid
    const dx = cx - rcx;
    const dy = cy - rcy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Nếu quá gần center, giữ nguyên
    if (distance < 10) {
      return centroid;
    }

    // "Fish-eye" expansion factor - càng xa center càng đẩy mạnh hơn
    const expansionFactor = 1.4; // Đẩy ra 40%

    // Kiểm tra xung đột với các prefecture khác
    let finalExpansion = expansionFactor;
    for (const otherCentroid of allCentroids) {
      if (otherCentroid === centroid) continue;

      const [ox, oy] = otherCentroid;
      const dist = Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2);

      // Nếu quá gần nhau, tăng expansion
      if (dist < 50) {
        finalExpansion = Math.max(finalExpansion, 1.8);
      }
    }

    // Tính vị trí mới sau khi "nở" ra
    const newX = rcx + dx * finalExpansion;
    const newY = rcy + dy * finalExpansion;

    return [newX, newY];
  };

  const fishEyePosition = calculateFishEyePosition();

  // Get prefecture name from various possible properties
  const prefectureName =
    (feature.properties?.nam as string) ||
    (feature.properties?.name as string) ||
    (feature.properties?.NAME_1 as string) ||
    (feature.properties?.nam_ja as string) ||
    "";

  // Get region data
  const region = getRegionByPrefecture(prefectureName);
  const fillColor = region ? region.color : "#E0E0E0";

  // Determine visibility and opacity based on mode
  const shouldDim = mode === "region" && !isInActiveRegion && !isSelected;

  // Determine if this prefecture should be highlighted
  const isHighlighted = mode === "world" ? isHoveredRegion : isHovered;

  return (
    <>
      {/* Prefecture Path - chỉ render path, không render text ở đây */}
      <motion.path
        d={pathData}
        fill={fillColor}
        fillOpacity={shouldDim ? 0.15 : isHighlighted ? 1 : 0.85}
        stroke="#000000"
        strokeWidth={isSelected ? 4 : isHighlighted ? 3 : 2}
        strokeLinejoin="miter"
        strokeLinecap="square"
        style={{
          cursor: "pointer",
        }}
        animate={{
          scale: isHighlighted ? 1.02 : isSelected ? 1.05 : 1,
          y: isHighlighted ? -2 : isSelected ? -3 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      />

      {/* Hover/Selected stroke effect */}
      {(isHighlighted || isSelected) && !shouldDim && (
        <motion.path
          d={pathData}
          fill="none"
          stroke={isSelected ? "#FFE700" : "#FFFFFF"}
          strokeWidth={isSelected ? 5 : 4}
          strokeLinejoin="miter"
          strokeLinecap="square"
          pointerEvents="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
        />
      )}
    </>
  );
};

// Component riêng cho Prefecture Label (render sau paths)
const PrefectureLabel = ({
  feature,
  centroid,
  fishEyePosition,
  isHovered,
  isSelected,
}: {
  feature: GeoFeature;
  centroid: [number, number];
  fishEyePosition: [number, number];
  isHovered: boolean;
  isSelected: boolean;
}) => {
  const prefectureName =
    (feature.properties?.nam as string) ||
    (feature.properties?.name as string) ||
    (feature.properties?.NAME_1 as string) ||
    (feature.properties?.nam_ja as string) ||
    "";

  const displayText = (feature.properties?.nam_ja as string) || prefectureName;

  // Tính kích thước background rect (ước lượng từ text length)
  const textWidth = displayText.length * 4.5;
  const textHeight = 10;

  return (
    <motion.g
      className="pointer-events-none"
      initial={{ opacity: 0, scale: 0.5, y: -30 }}
      animate={{
        opacity: isHovered || isSelected ? 1 : 0.85,
        scale: isHovered || isSelected ? 1.15 : 1,
        y: isHovered || isSelected ? -5 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        filter:
          isHovered || isSelected
            ? "drop-shadow(0px 10px 15px rgba(0,0,0,0.5))"
            : "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))",
        zIndex: isHovered || isSelected ? 100 : 10,
      }}
    >
      {/* Background rect - Hộp mờ bao quanh chữ */}
      <rect
        x={fishEyePosition[0] - textWidth / 2}
        y={fishEyePosition[1] - textHeight / 2}
        width={textWidth}
        height={textHeight}
        fill="rgba(0, 0, 0, 0.6)"
        rx={2}
        ry={2}
        opacity={isHovered || isSelected ? 0.9 : 0.7}
      />

      {/* 3D Shadow layers - Depth effect */}
      {[3, 2, 1].map((depth) => (
        <text
          key={`shadow-${depth}`}
          x={fishEyePosition[0]}
          y={fishEyePosition[1]}
          textAnchor="middle"
          dominantBaseline="central"
          fill={`rgba(0, 0, 0, ${0.15 - depth * 0.03})`}
          fontSize={6}
          className="pointer-events-none"
          transform={`translate(${depth * 0.3}, ${depth * 0.3})`}
          style={{
            fontFamily: "'Manrope', 'Inter', 'Hiragino Sans', sans-serif",
            userSelect: "none",
            fontWeight: "700",
            letterSpacing: "0.5px",
          }}
        >
          {displayText}
        </text>
      ))}

      {/* Glow outline layer - Luxury golden glow */}
      <text
        x={fishEyePosition[0]}
        y={fishEyePosition[1]}
        textAnchor="middle"
        dominantBaseline="central"
        fill="none"
        stroke="#FFD700"
        strokeWidth="2"
        strokeLinejoin="round"
        fontSize={6}
        className="pointer-events-none"
        style={{
          fontFamily:
            "'Hiragino Kaku Gothic Pro', 'Meiryo', 'MS Gothic', sans-serif",
          userSelect: "none",
          fontWeight: "800",
          filter: "drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))",
        }}
      >
        {(feature.properties?.nam_ja as string) || prefectureName}
      </text>

      {/* White outline layer */}
      <text
        x={fishEyePosition[0]}
        y={fishEyePosition[1]}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        stroke="white"
        strokeWidth="4"
        strokeLinejoin="round"
        fontSize={14}
        className="pointer-events-none"
        style={{
          fontFamily:
            "'Hiragino Kaku Gothic Pro', 'Meiryo', 'MS Gothic', sans-serif",
          userSelect: "none",
          fontWeight: "800",
          paintOrder: "stroke fill",
        }}
      >
        {(feature.properties?.nam_ja as string) || prefectureName}
      </text>

      {/* Main text with gradient */}
      <text
        x={fishEyePosition[0]}
        y={fishEyePosition[1]}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        className="pointer-events-none"
        style={{
          fontFamily:
            "'Hiragino Kaku Gothic Pro', 'Meiryo', 'MS Gothic', sans-serif",
          userSelect: "none",
          fontWeight: "800",
          fill: "url(#textGradient)",
        }}
      >
        {(feature.properties?.nam_ja as string) || prefectureName}
      </text>
    </motion.g>
  );
};

// ============================================
// TYPEWRITER TEXT COMPONENT
// ============================================
const TypewriterText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse"></span>
      )}
    </span>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function JapanMap({
  onSelectPrefecture,
  selectedId,
}: JapanMapProps) {
  const [paths, setPaths] = useState<
    Array<{ feature: GeoFeature; path: string; centroid: [number, number] }>
  >([]);

  // World/Region View State
  const [activeRegion, setActiveRegion] = useState<RegionData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [viewBox, setViewBox] = useState("0 0 800 640");
  const [showTutorial, setShowTutorial] = useState(true);

  // Pan/Drag state for zoomed view
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Hide tutorial after 5 seconds
  useEffect(() => {
    setShowTutorial(true);
    const timer = setTimeout(() => setShowTutorial(false), 8000);
    return () => clearTimeout(timer);
  }, [activeRegion]);

  // Create projection and path generator (memoized for performance)
  const pathGenerator = useMemo(() => {
    const projection = geoMercator()
      .center([138, 37])
      .scale(1650)
      .translate([400, 320]);
    return geoPath().projection(projection);
  }, []);

  useEffect(() => {
    fetch(TOPOJSON_URL)
      .then((res) => res.json())
      .then((topology) => {
        const key = Object.keys(topology.objects)[0];
        const featureCollection = topojson.feature(
          topology,
          topology.objects[key],
        ) as unknown as FeatureCollection;
        const features = featureCollection.features as GeoFeature[];
        console.log(`✓ Loaded ${features.length} prefectures`);

        // Debug: Log ALL prefecture names to understand the format
        if (features.length > 0) {
          console.log("📍 All prefecture names in GeoJSON:");
          features.forEach((f, i) => {
            const props = f.properties || {};
            console.log(
              `  ${i + 1}. nam="${props.nam}" name="${props.name}" NAME_1="${props.NAME_1}" nam_ja="${props.nam_ja}"`,
            );
          });
        }

        // Generate paths and centroids
        const pathsData = features.map((feature: GeoFeature) => {
          const pathStr = pathGenerator(feature as never) || "";
          const centroid = pathGenerator.centroid(feature as never);
          return { feature, path: pathStr, centroid };
        });
        setPaths(pathsData);
      })
      .catch((err) => console.error("Map Load Error:", err));
  }, [pathGenerator]);

  // Handle zoom to region with auto-bounds calculation
  const zoomToRegion = (region: RegionData) => {
    setActiveRegion(region);

    console.log(
      `🔍 Zooming to region: ${region.name}, looking for prefectures:`,
      region.prefectures,
    );

    // Special debug for Hokkaido - log ALL features
    if (region.id === "Hokkaido") {
      console.log("🗺️ ALL FEATURES for Hokkaido debug:");
      paths.forEach((item, idx) => {
        const props = item.feature.properties || {};
        console.log(
          `  ${idx}. nam="${props.nam}" name="${props.name}" NAME_1="${props.NAME_1}" nam_ja="${props.nam_ja}"`,
        );
      });
    }

    // Calculate dynamic viewBox based on actual prefecture bounds
    // Filter features belonging to the target region
    const regionFeatures = paths
      .filter((item) => {
        const props = item.feature.properties || {};
        const names = [
          props.nam,
          props.name,
          props.NAME_1,
          props.nam_ja,
        ] as string[];

        // Normalize all names from GeoJSON
        const normalizedGeoNames = names
          .filter((n) => n)
          .map((n) => normalizePrefectureName(n).toLowerCase());

        // Check against region's prefecture list (also normalized)
        const isMatch = region.prefectures.some((pref) => {
          const normalizedPref = normalizePrefectureName(pref).toLowerCase();

          // Special case for single-character or short names - use more flexible matching
          const isShortName = pref.length <= 8;

          // Multiple matching strategies
          const matches =
            normalizedGeoNames.some(
              (geoName) =>
                geoName === normalizedPref ||
                (isShortName && geoName.startsWith(normalizedPref)) || // "hokkaido" starts with "hokkaido"
                geoName.includes(normalizedPref) ||
                normalizedPref.includes(geoName),
            ) ||
            // Fallback: check if any original name contains the prefecture name (case-insensitive)
            names.some((n) => {
              if (!n) return false;
              const lowerN = n.toLowerCase();
              const lowerPref = pref.toLowerCase();
              return (
                lowerN.includes(lowerPref) ||
                lowerPref.includes(lowerN) ||
                // Extra flexible: check first 5 chars for Hokkaido case
                (pref.length >= 5 &&
                  lowerN.startsWith(lowerPref.substring(0, 5)))
              );
            });

          if (region.id === "Hokkaido" && matches) {
            console.log("✅ MATCH FOUND:", {
              featureNames: names,
              targetPref: pref,
              normalizedGeoNames,
              normalizedPref,
            });
          }

          return matches;
        });

        return isMatch;
      })
      .map((item) => item.feature);

    console.log(
      `🔍 Filtering for region: ${region.name}, Found ${regionFeatures.length} features`,
    );

    if (regionFeatures.length > 0) {
      // Create a feature collection for bounds calculation
      const collection = {
        type: "FeatureCollection",
        features: regionFeatures,
      };

      // Calculate bounding box using D3
      const bounds = pathGenerator.bounds(collection as never);
      const [[x0, y0], [x1, y1]] = bounds;

      // Add padding (adjust based on preference)
      const padding = 20;
      const width = x1 - x0 + padding * 2;
      const height = y1 - y0 + padding * 2;
      const x = x0 - padding;
      const y = y0 - padding;

      // Set dynamic viewBox
      const dynamicViewBox = `${x} ${y} ${width} ${height}`;
      setViewBox(dynamicViewBox);
      console.log(
        "Auto-Zoom to region:",
        region.name,
        "Bounds:",
        dynamicViewBox,
      );
    } else {
      // Fallback only if no features found
      console.warn("No features found for region, using fallback.");
      // Fix for Hokkaido/Fallback: If auto-calc fails, default to a safe centered view or try to calculate from single feature if possible
      setViewBox(region.viewBox);
    }
  };

  // Handle prefecture click
  const handlePrefectureClick = (feature: GeoFeature) => {
    const rawPrefName =
      (feature.properties?.nam as string) ||
      (feature.properties?.name as string) ||
      (feature.properties?.NAME_1 as string) ||
      "";

    // Normalize prefecture name to match OMIYAGE_DATA keys
    const prefName = normalizePrefectureName(rawPrefName);

    if (!activeRegion) {
      // World View: Click -> Zoom to region
      const region = getRegionByPrefecture(rawPrefName); // Use raw name for region lookup
      if (region) {
        zoomToRegion(region);
      }
    } else {
      // Region View: Click -> Select prefecture
      onSelectPrefecture(prefName, prefName); // Use normalized name
      console.log(
        "Selected prefecture (normalized):",
        prefName,
        "from raw:",
        rawPrefName,
      );
    }
  };

  // Back to World View
  const handleBackToWorld = () => {
    setActiveRegion(null);
    setViewBox("0 0 800 640");
    setHoveredRegion(null);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan/Drag handlers (only in region mode)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeRegion) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && activeRegion) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPanOffset({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  // Zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const delta = -e.deltaY * 0.001; // Negative because wheel down = positive deltaY
    const newZoom = Math.min(Math.max(zoomLevel + delta, 0.5), 3); // Limit 0.5x to 3x

    setZoomLevel(newZoom);

    // Track mouse position for zoom-to-cursor effect
    const svg = e.currentTarget.closest("svg");
    if (svg) {
      const rect = svg.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Reset zoom when switching views
  useEffect(() => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, [activeRegion]);

  const mode = activeRegion ? "region" : "world";

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Modern Transparent Container */}
      <div
        className="relative"
        style={{
          width: "95vw",
          height: "90vh",
        }}
      >
        {/* Title Bar with Glassmorphism + Back Button */}
        <div className="absolute -top-8 left-0 right-0 z-50 flex items-center justify-center gap-4">
          {/* Back Button - Floating style */}
          <AnimatePresence>
            {activeRegion && (
              <motion.button
                className="bg-gradient-to-r from-red-500/90 to-pink-500/90 hover:from-red-600 hover:to-pink-600 backdrop-blur-xl border border-red-400/50 rounded-2xl text-white font-bold text-base px-6 py-3 shadow-2xl pointer-events-auto flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBackToWorld();
                }}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.8 }}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="text-xl">←</span>
                <span>戻る</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Title */}
          <motion.span
            className="bg-black/30 backdrop-blur-xl border border-yellow-500/40 rounded-2xl text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent px-6 py-3 inline-block shadow-2xl"
            key={activeRegion?.id || "world"}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {activeRegion ? (
              <>
                🗾 <TypewriterText text={`${activeRegion.nameJa} REGION`} />
              </>
            ) : (
              "🗾 JAPAN MAP"
            )}
          </motion.span>
        </div>

        {/* Region Info Panel - Show in Region View */}
        <AnimatePresence>
          {activeRegion && (
            <motion.div
              className="absolute top-24 left-4 max-w-md bg-black/20 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-4 z-[20] pointer-events-none shadow-2xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 border-2 border-white/30 rounded-lg shadow-lg flex-shrink-0"
                  style={{ backgroundColor: activeRegion.color }}
                ></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm mb-1">
                    {activeRegion.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {activeRegion.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Indicator */}
        <div className="absolute top-4 right-4 z-[70] space-y-2">
          <div className="bg-black/20 backdrop-blur-xl border border-cyan-400/40 rounded-xl px-4 py-2 shadow-2xl pointer-events-none">
            <span className="font-semibold text-sm text-cyan-400">
              {mode === "world" ? "🌍 WORLD VIEW" : "🔍 REGION VIEW"}
            </span>
          </div>

          {/* Zoom Level Indicator */}
          <motion.div
            className="bg-black/20 backdrop-blur-xl border border-purple-400/40 rounded-xl px-4 py-2 shadow-2xl pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: zoomLevel !== 1 ? 1 : 0.5,
              scale: zoomLevel !== 1 ? 1 : 0.9,
            }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-semibold text-sm text-purple-400">
              🔍 {(zoomLevel * 100).toFixed(0)}%
            </span>
          </motion.div>
        </div>

        {/* Tutorial Text */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[65] bg-black/20 backdrop-blur-xl border border-yellow-500/40 rounded-2xl px-6 py-4 shadow-2xl max-w-md pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {mode === "world" ? "🗺️" : "🎁"}
                </span>
                <div className="flex-1 pointer-events-none">
                  <TypewriterText
                    text={
                      mode === "world"
                        ? "都道府県にマウスを合わせてクリックすると、その地域にズームします！"
                        : "都道府県をクリックして、特産品のお土産を見よう！"
                    }
                    className="text-sm text-white"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTutorial(false);
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-sm px-4 py-2 rounded-xl pointer-events-auto shadow-lg hover:scale-105 transition-all"
                >
                  OK
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SVG Map */}
        <motion.svg
          viewBox={viewBox}
          className="w-full h-full"
          style={{
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            imageRendering: "pixelated",
            cursor:
              mode === "region" ? (isPanning ? "grabbing" : "grab") : "default",
          }}
          animate={{ viewBox }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            duration: 0.8,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        >
          <g
            transform={`translate(${panOffset.x * 0.5}, ${panOffset.y * 0.5}) scale(${zoomLevel})`}
            style={{
              transformOrigin: "center center",
              transition: "transform 0.15s ease-out",
            }}
          >
            {/* Background grid */}
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#DDD"
                  strokeWidth="0.5"
                />
              </pattern>

              {/* Gradient for 3D text effect */}
              <linearGradient
                id="textGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style={{ stopColor: "#2C3E50", stopOpacity: 1 }}
                />
                <stop
                  offset="50%"
                  style={{ stopColor: "#34495E", stopOpacity: 1 }}
                />
                <stop
                  offset="100%"
                  style={{ stopColor: "#1A252F", stopOpacity: 1 }}
                />
              </linearGradient>
            </defs>
            <rect width="800" height="640" fill="url(#grid)" />
            {/* Ocean/Sea background */}
            <rect width="800" height="640" fill="#A8D8EA" fillOpacity="0.4" />
            {/* Prefecture paths */}
            {(() => {
              // Tính toán region center và all centroids cho fish-eye effect TRƯỚC
              const activeRegionPaths = paths.filter((item) => {
                if (!activeRegion) return false;
                const prefName =
                  (item.feature.properties?.nam as string) ||
                  (item.feature.properties?.name as string) ||
                  `P${0}`;
                const normalizedPrefName = normalizePrefectureName(prefName);
                const prefRegion = getRegionByPrefecture(normalizedPrefName);
                return prefRegion?.id === activeRegion.id;
              });

              // Tính center của region (trung bình các centroid)
              const regionCenter: [number, number] | undefined = activeRegion
                ? activeRegionPaths.length > 0
                  ? [
                      activeRegionPaths.reduce(
                        (sum, p) => sum + p.centroid[0],
                        0,
                      ) / activeRegionPaths.length,
                      activeRegionPaths.reduce(
                        (sum, p) => sum + p.centroid[1],
                        0,
                      ) / activeRegionPaths.length,
                    ]
                  : undefined
                : undefined;

              // Lấy tất cả centroids trong region
              const allCentroids = activeRegionPaths.map((p) => p.centroid);

              // Render paths
              const pathElements = paths.map((item, i) => {
                const prefName =
                  (item.feature.properties?.nam as string) ||
                  (item.feature.properties?.name as string) ||
                  (item.feature.properties?.NAME_1 as string) ||
                  `P${i}`;

                // Normalize name to match against region data
                const normalizedPrefName = normalizePrefectureName(prefName);
                const prefRegion = getRegionByPrefecture(normalizedPrefName);
                const isSelected = selectedId === normalizedPrefName;
                const isInActiveRegion = activeRegion
                  ? prefRegion?.id === activeRegion.id
                  : true;
                const isHoveredRegion = hoveredRegion
                  ? prefRegion?.id === hoveredRegion.id
                  : false;

                // Special: Search for Hokkaido by checking all name variants
                const searchTerm = "hokkai";
                if (
                  mode === "region" &&
                  activeRegion?.id === "Hokkaido" &&
                  (prefName.toLowerCase().includes(searchTerm) ||
                    normalizedPrefName.toLowerCase().includes(searchTerm) ||
                    (item.feature.properties?.nam_ja as string)?.includes(
                      "北海",
                    ))
                ) {
                  console.log(`🎯 HOKKAIDO FOUND at index ${i}:`, {
                    prefName,
                    normalizedPrefName,
                    nam_ja: item.feature.properties?.nam_ja,
                    prefRegionId: prefRegion?.id,
                    activeRegionId: activeRegion?.id,
                    isInActiveRegion,
                    shouldShowLabel: mode === "region" && isInActiveRegion,
                  });
                }

                return (
                  <PrefecturePath
                    key={i}
                    feature={item.feature}
                    pathData={item.path}
                    centroid={item.centroid}
                    isSelected={isSelected}
                    isInActiveRegion={isInActiveRegion}
                    isHoveredRegion={isHoveredRegion}
                    onClick={() => handlePrefectureClick(item.feature)}
                    mode={mode}
                    regionCenter={regionCenter}
                    allCentroids={allCentroids}
                  />
                );
              });

              // Render labels (SAU paths để nằm trên)
              const labelElements =
                mode === "region"
                  ? paths.map((item, i) => {
                      const prefName =
                        (item.feature.properties?.nam as string) ||
                        (item.feature.properties?.name as string) ||
                        `P${i}`;
                      const normalizedPrefName =
                        normalizePrefectureName(prefName);
                      const prefRegion =
                        getRegionByPrefecture(normalizedPrefName);
                      const isSelected = selectedId === normalizedPrefName;
                      const isInActiveRegion = activeRegion
                        ? prefRegion?.id === activeRegion.id
                        : false;

                      if (!isInActiveRegion) return null;

                      // Tính fish-eye position cho label
                      const calculateFishEyePos = (): [number, number] => {
                        if (!regionCenter || !allCentroids)
                          return item.centroid;

                        const [cx, cy] = item.centroid;
                        const [rcx, rcy] = regionCenter;
                        const dx = cx - rcx;
                        const dy = cy - rcy;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 10) return item.centroid;

                        // "Fish-eye" expansion - NHẸ NHÀNG để vẫn gần lãnh thổ
                        let expansionFactor = 1.15; // Chỉ đẩy ra 15%

                        // Tìm prefecture gần nhất để điều chỉnh hướng
                        let minDist = Infinity;
                        let closestCentroid: [number, number] | null = null;

                        for (const otherCentroid of allCentroids) {
                          if (otherCentroid === item.centroid) continue;
                          const [ox, oy] = otherCentroid;
                          const dist = Math.sqrt(
                            (cx - ox) ** 2 + (cy - oy) ** 2,
                          );

                          if (dist < minDist) {
                            minDist = dist;
                            closestCentroid = otherCentroid;
                          }
                        }

                        // Chỉ điều chỉnh khi thật sự gần (<60px)
                        if (minDist < 60 && closestCentroid) {
                          // Đẩy nhẹ ra xa prefecture gần nhất
                          const [ocx, ocy] = closestCentroid;
                          const avoidDx = cx - ocx;
                          const avoidDy = cy - ocy;
                          const avoidDist = Math.sqrt(
                            avoidDx * avoidDx + avoidDy * avoidDy,
                          );

                          // Offset nhỏ (8-12px) theo hướng tránh
                          const offsetAmount = minDist < 40 ? 12 : 8;
                          const offsetX = (avoidDx / avoidDist) * offsetAmount;
                          const offsetY = (avoidDy / avoidDist) * offsetAmount;

                          return [cx + offsetX, cy + offsetY];
                        }

                        return [
                          rcx + dx * expansionFactor,
                          rcy + dy * expansionFactor,
                        ];
                      };

                      const fishEyePos = calculateFishEyePos();

                      return (
                        <PrefectureLabel
                          key={`label-${i}`}
                          feature={item.feature}
                          centroid={item.centroid}
                          fishEyePosition={fishEyePos}
                          isHovered={false}
                          isSelected={isSelected}
                        />
                      );
                    })
                  : null;

              // Return cả paths và labels
              return (
                <>
                  {pathElements}
                  {labelElements}
                </>
              );
            })()}{" "}
          </g>
        </motion.svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 text-xs bg-black/20 backdrop-blur-xl text-white p-4 border border-white/30 rounded-2xl shadow-2xl max-h-56 overflow-y-auto z-[60] pointer-events-auto">
          <div className="mb-3 font-bold text-yellow-400 border-b border-yellow-500/30 pb-2 pointer-events-none">
            {mode === "world"
              ? "🗾 地域"
              : `📍 ${activeRegion?.nameJa || activeRegion?.name.toUpperCase()}`}
          </div>
          {mode === "world" ? (
            <div className="space-y-2">
              {JAPAN_REGIONS.map((region) => (
                <div
                  key={region.id}
                  className={`flex items-center gap-3 cursor-pointer hover:bg-white/20 px-2 py-2 transition-all rounded-lg pointer-events-auto ${
                    hoveredRegion?.id === region.id
                      ? "bg-white/30 scale-105"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomToRegion(region);
                  }}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <div
                    className="w-4 h-4 border-2 border-white/50 rounded flex-shrink-0 shadow-lg"
                    style={{ backgroundColor: region.color }}
                  ></div>
                  <span className="text-xs font-medium">{region.nameJa}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-300 space-y-2">
              <div className="leading-relaxed">{activeRegion?.description}</div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-700">
                <span className="text-retro-accent-cyan">📊</span>
                <span className="text-retro-accent-yellow font-bold">
                  {activeRegion?.prefectures.length}
                </span>
                <span>都道府県</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
