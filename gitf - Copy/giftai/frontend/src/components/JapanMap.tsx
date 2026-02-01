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
  return name
    .replace(/\s*(Ken|Fu|To|Do|-ken|-fu|-to|-do)\s*$/i, "")
    .replace(/\s+/g, "") // Remove all spaces (e.g., "Hokkai Do" → "HokkaiDo")
    .replace(/[ōŌ]/g, "o")
    .replace(/[ūŪ]/g, "u")
    .replace(/[āĀ]/g, "a")
    .trim();
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
}: {
  feature: GeoFeature;
  pathData: string;
  centroid: [number, number];
  isSelected: boolean;
  isInActiveRegion: boolean;
  isHoveredRegion: boolean;
  onClick: () => void;
  mode: "world" | "region";
}) => {
  const [isHovered, setIsHovered] = useState(false);

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
    <g>
      {/* Prefecture Path */}
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

      {/* Prefecture label - Show when in region mode AND prefecture is in active region */}
      {mode === "region" && isInActiveRegion && (
        <g className="pointer-events-none" style={{ opacity: 1 }}>
          {/* Debug marker to verify render */}
          {prefectureName === "Hokkaido" &&
            console.log("🎨 Rendering Hokkaido label!", {
              centroid,
              prefectureName,
            })}

          {/* Text outline (White stroke layer for halo effect) */}
          <text
            x={centroid[0]}
            y={centroid[1]}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            stroke="white"
            strokeWidth="5"
            strokeLinejoin="round"
            fontSize={16}
            className="pointer-events-none"
            style={{
              fontFamily:
                "'VT323', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
              userSelect: "none",
              fontWeight: "bold",
              paintOrder: "stroke fill",
            }}
          >
            {(feature.properties?.nam_ja as string) || prefectureName}
          </text>

          {/* Main text (Black fill layer) */}
          <text
            x={centroid[0]}
            y={centroid[1]}
            textAnchor="middle"
            dominantBaseline="central"
            fill="black"
            fontSize={16}
            className="pointer-events-none"
            style={{
              fontFamily:
                "'VT323', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
              userSelect: "none",
              fontWeight: "bold",
            }}
          >
            {(feature.properties?.nam_ja as string) || prefectureName}
          </text>
        </g>
      )}

      {/* World mode hover label */}
      {mode === "world" && isHighlighted && (
        <g className="pointer-events-none" style={{ opacity: 1 }}>
          <text
            x={centroid[0]}
            y={centroid[1]}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            stroke="white"
            strokeWidth="4"
            strokeLinejoin="round"
            fontSize={12}
            className="pointer-events-none"
            style={{
              fontFamily:
                "'VT323', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
              userSelect: "none",
              fontWeight: "bold",
              paintOrder: "stroke fill",
            }}
          >
            {(feature.properties?.nam_ja as string) || prefectureName}
          </text>
          <text
            x={centroid[0]}
            y={centroid[1]}
            textAnchor="middle"
            dominantBaseline="central"
            fill="black"
            fontSize={12}
            className="pointer-events-none"
            style={{
              fontFamily:
                "'VT323', 'Hiragino Kaku Gothic Pro', 'Meiryo', sans-serif",
              userSelect: "none",
              fontWeight: "bold",
            }}
          >
            {(feature.properties?.nam_ja as string) || prefectureName}
          </text>
        </g>
      )}
    </g>
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
    const prefName =
      (feature.properties?.nam as string) ||
      (feature.properties?.name as string) ||
      (feature.properties?.NAME_1 as string) ||
      "";

    if (!activeRegion) {
      // World View: Click -> Zoom to region
      const region = getRegionByPrefecture(prefName);
      if (region) {
        zoomToRegion(region);
      }
    } else {
      // Region View: Click -> Select prefecture
      onSelectPrefecture(prefName, prefName);
      console.log("Selected prefecture:", prefName);
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

  const mode = activeRegion ? "region" : "world";

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Pixel Art Container */}
      <div
        className="relative pixel-box bg-retro-box"
        style={{
          background:
            "repeating-conic-gradient(#F5F5DC 0% 25%, #EEE5C8 0% 50%) 50% / 20px 20px",
          width: "95vw",
          height: "90vh",
        }}
      >
        {/* CRT Scanlines Effect */}
        <div
          className="absolute inset-0 scanlines pointer-events-none rounded-none"
          style={{ zIndex: 1 }}
        ></div>

        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-retro-accent-yellow border-2 border-black"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-retro-accent-yellow border-2 border-black"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-retro-accent-yellow border-2 border-black"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-retro-accent-yellow border-2 border-black"></div>

        {/* Title Bar */}
        <div className="absolute -top-8 left-0 right-0 text-center">
          <motion.span
            className="font-pixel-retro text-xl text-retro-accent-yellow px-4 py-1 bg-black border-2 border-retro-accent-yellow inline-block"
            style={{ textShadow: "2px 2px 0px #000" }}
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

        {/* Back Button - Only show in Region View */}
        <AnimatePresence>
          {activeRegion && (
            <motion.button
              className="absolute top-4 left-4 pixel-button bg-retro-accent text-black font-pixel-retro text-base px-6 py-3 z-[70] shadow-pixel-lg border-3 border-black pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                handleBackToWorld();
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              ← WORLD MAP
            </motion.button>
          )}
        </AnimatePresence>

        {/* Region Info Panel - Show in Region View */}
        <AnimatePresence>
          {activeRegion && (
            <motion.div
              className="absolute top-24 left-4 max-w-md bg-black/90 border-3 border-retro-accent-yellow p-3 z-[20] pointer-events-none"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 border-2 border-black shadow-pixel-sm flex-shrink-0"
                  style={{ backgroundColor: activeRegion.color }}
                ></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-pixel-retro text-white text-sm mb-1">
                    {activeRegion.name.toUpperCase()}
                  </h3>
                  <p className="font-pixel text-xs text-gray-300 leading-relaxed">
                    {activeRegion.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Indicator */}
        <div className="absolute top-4 right-4 z-[70] bg-black/90 border-3 border-retro-accent-cyan px-4 py-2 shadow-pixel pointer-events-none">
          <span className="font-pixel-retro text-sm text-retro-accent-cyan">
            {mode === "world" ? "🌍 WORLD VIEW" : "🔍 REGION VIEW"}
          </span>
        </div>

        {/* Tutorial Text */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[65] bg-black/95 border-3 border-retro-accent-yellow px-6 py-3 shadow-pixel-lg max-w-md pointer-events-auto"
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
                        ? "Hover and click any prefecture to zoom into its region!"
                        : "Click a prefecture to see its special omiyage!"
                    }
                    className="font-pixel text-sm text-white"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTutorial(false);
                  }}
                  className="pixel-button bg-retro-accent-yellow text-black font-pixel-retro text-sm px-3 py-2 hover:bg-yellow-400 transition-colors border-3 border-black pointer-events-auto shadow-pixel"
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
        >
          <g
            transform={`translate(${panOffset.x * 0.5}, ${panOffset.y * 0.5})`}
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
            </defs>
            <rect width="800" height="640" fill="url(#grid)" />
            {/* Ocean/Sea background */}
            <rect width="800" height="640" fill="#A8D8EA" fillOpacity="0.4" />
            {/* Prefecture paths */}
            {paths.map((item, i) => {
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
                  (item.feature.properties?.nam_ja as string)?.includes("北海"))
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
                />
              );
            })}{" "}
          </g>
        </motion.svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 font-pixel text-xs bg-black/90 text-white p-3 border-3 border-white shadow-pixel-lg max-h-56 overflow-y-auto z-[60] pointer-events-auto">
          <div className="mb-2 font-bold text-retro-accent-yellow border-b border-gray-600 pb-1 pointer-events-none">
            {mode === "world"
              ? "🗾 REGIONS"
              : `📍 ${activeRegion?.nameJa || activeRegion?.name.toUpperCase()}`}
          </div>
          {mode === "world" ? (
            <div className="space-y-1">
              {JAPAN_REGIONS.map((region) => (
                <div
                  key={region.id}
                  className={`flex items-center gap-2 cursor-pointer hover:bg-white/20 px-1 py-1 transition-colors rounded pointer-events-auto ${
                    hoveredRegion?.id === region.id ? "bg-white/30" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomToRegion(region);
                  }}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  <div
                    className="w-4 h-4 border-2 border-black flex-shrink-0"
                    style={{ backgroundColor: region.color }}
                  ></div>
                  <span className="text-xs">{region.nameJa}</span>
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
                <span>prefectures</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
