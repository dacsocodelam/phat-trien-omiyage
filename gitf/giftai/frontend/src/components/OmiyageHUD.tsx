import React, { useState, useEffect } from "react";
import { OMIYAGE_DATA } from "../data/omiyageData";
import { motion } from "framer-motion";
import RetroDialog from "./RetroDialog";

interface OmiyageHUDProps {
  selectedId: string | null;
  userLocation: { lat: number; lng: number } | null;
  onScanLocation: () => void;
}

interface SelectedOmiyage {
  name: string;
  nameJa?: string;
  kanjiName?: string;
  description?: string;
  price?: string;
  image?: string;
  buyUrl?: string;
}

// Distance calculator (Haversine)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function OmiyageHUD({
  selectedId,
  userLocation,
  onScanLocation,
}: OmiyageHUDProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedOmiyage, setSelectedOmiyage] =
    useState<SelectedOmiyage | null>(null);

  // Helper function to normalize prefecture name for lookup
  const normalizePrefectureName = (name: string): string => {
    if (!name) return "";

    // Remove common suffixes: Ken (県), Fu (府), To (都), Do (道), -ken, -fu, -to, -do
    const normalized = name
      .replace(/\s+Ken$/i, "")
      .replace(/\s+Fu$/i, "")
      .replace(/\s+To$/i, "")
      .replace(/\s+Do$/i, "")
      .replace(/-ken$/i, "")
      .replace(/-fu$/i, "")
      .replace(/-to$/i, "")
      .replace(/-do$/i, "")
      .replace(/\s+/g, "")
      .replace(/[ōŌ]/g, "o")
      .replace(/[ūŪ]/g, "u")
      .replace(/[āĀ]/g, "a")
      .trim();

    // Special case: GeoJSON might return "Hokkai" after removing " Do"
    if (normalized === "Hokkai") return "Hokkaido";

    return normalized;
  };

  // Try to find data with normalized key
  const normalizedKey = selectedId ? normalizePrefectureName(selectedId) : null;
  const data =
    normalizedKey && OMIYAGE_DATA[normalizedKey]
      ? OMIYAGE_DATA[normalizedKey]
      : null;

  // Debug log
  useEffect(() => {
    if (selectedId) {
      console.log("OmiyageHUD - selectedId:", selectedId);
      console.log("OmiyageHUD - normalizedKey:", normalizedKey);
      console.log("OmiyageHUD - data found:", !!data);
      if (!data) {
        console.log("Available keys:", Object.keys(OMIYAGE_DATA));
      }
    }
  }, [selectedId, normalizedKey, data]);

  // Auto-open dialog when prefecture is selected
  useEffect(() => {
    if (selectedId && data) {
      setShowDialog(true);
      // Set first specialty as selected omiyage
      if (data.specialties && data.specialties.length > 0) {
        const firstSpecialty = data.specialties[0];
        setSelectedOmiyage({
          name: firstSpecialty.kanjiName || firstSpecialty.name,
          nameJa: firstSpecialty.kanjiName || firstSpecialty.name,
          kanjiName: firstSpecialty.kanjiName,
          description: `${firstSpecialty.description}\n\n${firstSpecialty.culturalContext}`,
          price: `¥${firstSpecialty.price}`,
          image: firstSpecialty.image,
          buyUrl: "#",
        });
      }
    } else {
      setShowDialog(false);
    }
  }, [selectedId, data]);

  if (!selectedId)
    return (
      <div className="absolute top-5 left-5 pointer-events-auto">
        <div className="bg-black/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-5 max-w-xs shadow-2xl">
          <h2 className="text-base font-bold text-yellow-400 mb-2">
            👆 地域を選択
          </h2>
          <p className="text-sm text-gray-300">
            都道府県をクリックして名物を発見しよう！
          </p>
        </div>
      </div>
    );

  // If data missing, show debug/fallback
  if (!data)
    return (
      <div className="absolute top-5 left-5 pointer-events-auto">
        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 rounded-2xl p-5 max-w-xs shadow-2xl">
          <h2 className="text-base font-bold text-red-400 mb-2">
            ⚠ データなし
          </h2>
          <p className="text-sm text-gray-300">地域: {selectedId}</p>
          <p className="text-xs text-gray-400 mt-1">正規化: {normalizedKey}</p>
          <button
            className="mt-3 bg-black/60 hover:bg-black/80 text-white rounded-xl text-sm px-4 py-2 transition-all"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    );

  return (
    <>
      {/* Modern HUD Sidebar with Glassmorphism */}
      <div className="absolute top-5 left-5 z-[50] pointer-events-none">
        <motion.div
          className="bg-black/20 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-5 max-w-xs pointer-events-auto shadow-2xl"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Header */}
          <div className="border-b border-yellow-500/30 pb-3 mb-4">
            <div className="text-xs text-yellow-400/80 mb-1">選択中:</div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {data.kanjiName}
            </h1>
            <div className="text-sm text-gray-300 mt-1">{data.name}</div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
              <span className="text-sm text-white">
                {data.specialties.length} 名物
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></span>
              <span className="text-sm text-white">
                {data.stores.length} 店舗
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold text-sm py-3 rounded-xl pointer-events-auto transition-all shadow-lg hover:shadow-yellow-500/50 hover:scale-105 active:scale-95"
              onClick={() => setShowDialog(true)}
            >
              📦 お土産を見る
            </button>

            {!userLocation ? (
              <button
                onClick={onScanLocation}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold text-sm py-3 rounded-xl pointer-events-auto transition-all shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95"
              >
                📡 店舗を探す
              </button>
            ) : (
              <div className="bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-3">
                <div className="text-sm text-cyan-400 mb-3 font-semibold">
                  近くの店舗:
                </div>
                {data.stores.slice(0, 2).map((store, i) => {
                  const dist = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    store.lat,
                    store.lng,
                  );
                  const walkUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${store.lat},${store.lng}&travelmode=walking`;

                  return (
                    <div
                      key={i}
                      className="mb-3 last:mb-0 bg-black/30 rounded-lg p-2"
                    >
                      <div className="text-sm text-white font-medium">
                        {store.name}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-yellow-400 font-semibold">
                          {dist.toFixed(1)} km
                        </span>
                        <a
                          href={walkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
                        >
                          行く ↗
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* RetroDialog for detailed view */}
      <RetroDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        prefectureName={data.name}
        omiyage={selectedOmiyage || undefined}
        stores={data.stores}
        userLocation={userLocation}
      />
    </>
  );
}
