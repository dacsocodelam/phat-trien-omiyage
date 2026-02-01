import React, { useState, useEffect } from "react";
import { OMIYAGE_DATA } from "../data/omiyageData";
import { motion, AnimatePresence } from "framer-motion";
import HighTechCounter from "./HighTechCounter";
import RetroDialog from "./RetroDialog";

interface OmiyageHUDProps {
  selectedId: string | null;
  userLocation: { lat: number; lng: number } | null;
  onScanLocation: () => void;
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
  const [selectedOmiyage, setSelectedOmiyage] = useState<any>(null);

  const data = selectedId
    ? OMIYAGE_DATA[selectedId] || OMIYAGE_DATA["Shimane"]
    : null;

  // Auto-open dialog when prefecture is selected
  useEffect(() => {
    if (selectedId && data) {
      setShowDialog(true);
      // Set first specialty as selected omiyage
      if (data.specialties && data.specialties.length > 0) {
        const firstSpecialty = data.specialties[0];
        setSelectedOmiyage({
          name: firstSpecialty.name,
          nameJa: firstSpecialty.name,
          description: `${firstSpecialty.description}\n\n${firstSpecialty.culturalContext}`,
          price: `¥${firstSpecialty.price}`,
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
        <div className="pixel-box bg-retro-bg-light p-4 max-w-xs">
          <h2 className="font-pixel-retro text-sm text-black mb-2">
            👆 地域を選択
          </h2>
          <p className="font-pixel text-xs text-gray-700">
            都道府県をクリックして名物を発見しよう！
          </p>
        </div>
      </div>
    );

  // If data missing, show debug/fallback
  if (!data)
    return (
      <div className="absolute top-5 left-5 pointer-events-auto">
        <div className="pixel-box bg-retro-accent p-4 max-w-xs">
          <h2 className="font-pixel-retro text-sm text-black mb-2">
            ⚠ データなし
          </h2>
          <p className="font-pixel text-xs text-black">地域: {selectedId}</p>
          <button
            className="mt-3 pixel-button bg-black text-white font-pixel text-xs px-3 py-2"
            onClick={() => window.location.reload()}
          >
            再読み込み
          </button>
        </div>
      </div>
    );

  return (
    <>
      {/* Pixel Art HUD Sidebar */}
      <div className="absolute top-5 left-5 z-[50] pointer-events-none">
        <motion.div
          className="pixel-box bg-retro-bg/90 p-4 max-w-xs pointer-events-auto shadow-pixel-lg border-2 border-retro-accent-yellow"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Header */}
          <div className="border-b-2 border-retro-accent-yellow pb-2 mb-3">
            <div className="font-pixel text-xs text-retro-accent-yellow mb-1">
              選択中:
            </div>
            <h1 className="font-pixel-retro text-lg text-white">
              {data.kanjiName}
            </h1>
            <div className="font-pixel text-xs text-gray-300 mt-1">
              {data.name}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-retro-accent-green rounded-full animate-pulse"></span>
              <span className="font-pixel text-xs text-white">
                {data.specialties.length} 名物
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-retro-accent-cyan rounded-full animate-pulse"></span>
              <span className="font-pixel text-xs text-white">
                {data.stores.length} 店舗
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full pixel-button bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-pixel-retro text-xs py-3 pointer-events-auto hover:from-yellow-500 hover:to-yellow-600 transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
              onClick={() => setShowDialog(true)}
            >
              📦 お土産を見る
            </button>

            {!userLocation ? (
              <button
                onClick={onScanLocation}
                className="w-full pixel-button bg-gradient-to-r from-green-400 to-emerald-500 text-black font-pixel-retro text-xs py-3 pointer-events-auto hover:from-green-500 hover:to-emerald-600 transition-all border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]"
              >
                📡 店舗を探す
              </button>
            ) : (
              <div className="bg-black/50 border-2 border-retro-accent-cyan p-2">
                <div className="font-pixel text-xs text-retro-accent-cyan mb-2">
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
                    <div key={i} className="mb-2 last:mb-0">
                      <div className="font-pixel text-xs text-white">
                        {store.name}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-pixel text-xs text-retro-accent-yellow">
                          {dist.toFixed(1)} km
                        </span>
                        <a
                          href={walkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pixel-button bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-pixel-retro text-xs px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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

          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-retro-accent-yellow border border-black"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-retro-accent-yellow border border-black"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-retro-accent-yellow border border-black"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-retro-accent-yellow border border-black"></div>
        </motion.div>
      </div>

      {/* RetroDialog for detailed view */}
      <RetroDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        prefectureName={data.name}
        omiyage={selectedOmiyage}
      />
    </>
  );
}
