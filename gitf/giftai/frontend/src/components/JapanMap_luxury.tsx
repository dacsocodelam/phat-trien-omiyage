"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as d3 from "d3-geo";
import { feature } from "topojson-client";
import { getRegionByPrefecture } from "@/data/japanRegions";

// ============================================
// TYPES
// ============================================
interface JapanMapProps {
  onSelectPrefecture?: (id: string, name: string) => void;
  selectedId?: string | null;
}

type Mode = "world" | "region";

interface GeoFeature {
  type: string;
  properties: {
    nam?: string;
    name?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface GeoData {
  type: string;
  features: GeoFeature[];
}

interface Region {
  id?: string;
  name: string;
  nameJa: string;
  prefectures: string[];
}

// Helper function to normalize prefecture names
const normalizePrefectureName = (name: string): string => {
  if (!name) return "";
  return name
    .replace(/\s*(Ken|Fu|To|Do|-ken|-fu|-to|-do)\s*$/i, "")
    .replace(/\s+/g, "")
    .replace(/[ōŌ]/g, "o")
    .replace(/[ūŪ]/g, "u")
    .replace(/[āĀ]/g, "a")
    .trim();
};

// ============================================
// PREFECTURE PATH COMPONENT (LUXURY STYLE)
// ============================================
const PrefecturePath = ({
  path,
  normalizedName,
  isSelected,
  isInActiveRegion,
  mode,
  onClick,
  centroid,
}: {
  path: string;
  normalizedName: string;
  isSelected: boolean;
  isInActiveRegion: boolean;
  mode: Mode;
  onClick: () => void;
  centroid: [number, number];
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g>
      {/* Prefecture Path with Luxury Styling */}
      <motion.path
        d={path}
        fill={
          isSelected
            ? "rgba(212, 175, 55, 0.6)"
            : isHovered
              ? "rgba(212, 175, 55, 0.4)"
              : "rgba(30, 41, 59, 0.3)"
        }
        stroke="rgba(212, 175, 55, 0.3)"
        strokeWidth={0.5}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="cursor-pointer"
        initial={false}
        animate={{
          fill: isSelected
            ? "rgba(212, 175, 55, 0.6)"
            : isHovered
              ? "rgba(212, 175, 55, 0.4)"
              : "rgba(30, 41, 59, 0.3)",
          filter: isHovered
            ? "drop-shadow(0 0 10px rgba(212,175,55,0.6))"
            : "drop-shadow(0 0 0px rgba(0,0,0,0))",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{ pointerEvents: "auto" }}
      />

      {/* Label - Show in region mode when active */}
      {mode === "region" && isInActiveRegion && (
        <motion.text
          x={centroid[0]}
          y={centroid[1]}
          textAnchor="middle"
          className="pointer-events-none select-none font-sans uppercase tracking-widest"
          fill={isHovered || isSelected ? "#FCD34D" : "#F8FAFC"}
          fontSize={isHovered || isSelected ? "14" : "12"}
          fontWeight={isHovered || isSelected ? "600" : "400"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            textShadow: isHovered
              ? "0 0 8px rgba(212, 175, 55, 0.8)"
              : "0 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          {normalizedName}
        </motion.text>
      )}
    </g>
  );
};

// ============================================
// MAIN JAPAN MAP COMPONENT
// ============================================
export default function JapanMap({
  onSelectPrefecture,
  selectedId,
}: JapanMapProps) {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [mode, setMode] = useState<Mode>("world");
  const [activeRegion, setActiveRegion] = useState<Region | null>(null);
  const [hoveredRegion] = useState<Region | null>(null);
  const [viewBox, setViewBox] = useState("0 0 800 600");
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Load TopoJSON data
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson",
    )
      .then((res) => res.json())
      .then((topo) => {
        const geoJson = feature(topo, topo.objects.japan) as unknown as GeoData;
        setGeoData(geoJson);
      })
      .catch((err) => console.error("Failed to load map:", err));
  }, []);

  // D3 Projection (useMemo for performance)
  const projection = useMemo(
    () => d3.geoMercator().center([138, 38]).scale(1650).translate([400, 300]),
    [],
  );

  const pathGenerator = useMemo(
    () => d3.geoPath().projection(projection),
    [projection],
  );

  // Calculate paths and centroids
  const paths = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.map((feature: GeoFeature) => {
      const pathStr = pathGenerator(feature as d3.GeoPermissibleObjects);
      const centroid = pathGenerator.centroid(
        feature as d3.GeoPermissibleObjects,
      );
      return { feature, path: pathStr, centroid };
    });
  }, [geoData, pathGenerator]);

  // Zoom to region using D3 bounds
  const zoomToRegion = (region: Region) => {
    if (!geoData || !pathGenerator) return;

    const regionPrefectures = region.prefectures.map((p: string) =>
      p.toLowerCase(),
    );

    // Find features matching this region
    const matchedFeatures = geoData.features.filter((f: GeoFeature) => {
      const featureName = String(
        f.properties?.nam || f.properties?.name || f.properties?.NAME_1 || "",
      );
      const normalized = normalizePrefectureName(featureName).toLowerCase();

      return regionPrefectures.some((pref: string) => {
        const normalizedPref = pref.toLowerCase();
        return (
          normalized === normalizedPref ||
          normalized.includes(normalizedPref) ||
          normalizedPref.includes(normalized)
        );
      });
    });

    if (matchedFeatures.length === 0) {
      console.warn("No features found for region:", region.name);
      return;
    }

    // Create FeatureCollection for bounds calculation
    const featureCollection = {
      type: "FeatureCollection",
      features: matchedFeatures,
    };

    // Calculate bounds using D3
    const bounds = pathGenerator.bounds(
      featureCollection as unknown as d3.GeoPermissibleObjects,
    );
    const [[x0, y0], [x1, y1]] = bounds;

    const width = x1 - x0;
    const height = y1 - y0;
    const padding = 50;

    setViewBox(
      `${x0 - padding} ${y0 - padding} ${width + padding * 2} ${height + padding * 2}`,
    );
    setMode("region");
    setActiveRegion(region);
  };

  // Reset to world view
  const resetView = () => {
    setViewBox("0 0 800 600");
    setMode("world");
    setActiveRegion(null);
    setPanOffset({ x: 0, y: 0 });
    if (onSelectPrefecture) onSelectPrefecture("", "");
  };

  // Handle prefecture click
  const handlePrefectureClick = (prefName: string, normalizedName: string) => {
    const region = getRegionByPrefecture(normalizedName);

    if (mode === "world") {
      // Zoom into region
      if (region) {
        zoomToRegion(region);
      }
    } else {
      // Select prefecture
      if (onSelectPrefecture) {
        onSelectPrefecture(normalizedName, normalizedName);
      }
    }
  };

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === "region") {
      setIsPanning(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && mode === "region") {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  if (!geoData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div
          className="text-luxury-gold font-luxury text-2xl tracking-widest"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Loading Map...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Back Button - Luxury Style */}
      <AnimatePresence>
        {mode === "region" && (
          <motion.button
            onClick={resetView}
            className="absolute top-6 left-6 z-50 w-14 h-14 rounded-full border border-luxury-gold/50 bg-luxury-card/80 backdrop-blur-md flex items-center justify-center hover:bg-luxury-gold/20 transition-all duration-300 group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-luxury-gold group-hover:text-luxury-gold-light transition-colors"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* SVG Map */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full"
        style={{
          cursor: mode === "region" && isPanning ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`translate(${panOffset.x}, ${panOffset.y})`}>
          {/* Render Prefecture Paths */}
          {paths.map(
            (
              item: {
                feature: GeoFeature;
                path: string | null;
                centroid: [number, number];
              },
              i: number,
            ) => {
              const prefName =
                (item.feature.properties?.nam as string) ||
                (item.feature.properties?.name as string) ||
                (item.feature.properties?.NAME_1 as string) ||
                `P${i}`;

              const normalizedPrefName = normalizePrefectureName(prefName);
              const prefRegion = getRegionByPrefecture(normalizedPrefName);
              const isSelected = selectedId === normalizedPrefName;
              const isInActiveRegion = activeRegion
                ? prefRegion?.id === activeRegion.id
                : true;

              return (
                <PrefecturePath
                  key={i}
                  path={item.path || ""}
                  normalizedName={normalizedPrefName}
                  isSelected={isSelected}
                  isInActiveRegion={isInActiveRegion}
                  mode={mode}
                  onClick={() =>
                    handlePrefectureClick(prefName, normalizedPrefName)
                  }
                  centroid={item.centroid}
                />
              );
            },
          )}
        </g>
      </svg>

      {/* Region Info Overlay (World Mode) */}
      {mode === "world" && hoveredRegion && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass-panel px-6 py-3 pointer-events-none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <p className="font-luxury text-luxury-gold text-sm tracking-wider uppercase">
            {hoveredRegion.name}
          </p>
        </motion.div>
      )}
    </div>
  );
}
