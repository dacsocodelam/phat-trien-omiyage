"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RetroDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prefectureName: string;
  omiyage?: {
    name: string;
    nameJa?: string;
    kanjiName?: string;
    image?: string;
    description?: string;
    price?: string;
    buyUrl?: string;
  };
  stores?: Array<{
    name: string;
    address: string;
    lat: number;
    lng: number;
    rating?: number;
    priceRange?: string;
  }>;
  userLocation?: { lat: number; lng: number } | null;
}

export default function RetroDialog({
  isOpen,
  onClose,
  prefectureName,
  omiyage,
  stores = [],
  userLocation = null,
}: RetroDialogProps) {
  const [showStores, setShowStores] = useState(false);

  // Sample data if no omiyage provided
  const displayOmiyage = omiyage || {
    name: `${prefectureName} Special Gift`,
    nameJa: `${prefectureName}の特産品`,
    image: "/img/placeholder-omiyage.png",
    description: `Famous local specialty from ${prefectureName}. A perfect gift to bring back memories!`,
    price: "¥1,500",
    buyUrl: "#",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-[80] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog Box */}
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-4xl mx-4 pointer-events-auto"
            initial={{ scale: 0, y: 100 }}
            animate={{
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
              },
            }}
            exit={{
              scale: 0,
              y: 100,
              transition: { duration: 0.2 },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* RPG Dialog Container */}
            <div className="relative bg-gradient-to-br from-blue-100 to-indigo-200 border-4 border-white p-1 shadow-2xl">
              {/* Inner border effect */}
              <div className="border-4 border-indigo-300 bg-gradient-to-br from-white to-blue-50 p-6">
                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="absolute -top-3 -right-3 w-10 h-10 bg-retro-accent border-3 border-black font-pixel-retro text-black hover:bg-retro-accent-yellow transition-colors pixel-button z-[100] pointer-events-auto shadow-pixel"
                  style={{ lineHeight: "1" }}
                >
                  ✕
                </button>

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 bg-retro-accent-cyan border-2 border-white"></div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-retro-accent-cyan border-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-retro-accent-cyan border-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-retro-accent-cyan border-2 border-white"></div>

                {/* Prefecture Name Header */}
                <motion.div
                  className="mb-4 text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="inline-block bg-retro-accent-yellow px-4 py-2 border-3 border-black">
                    <h2 className="font-pixel-retro text-lg text-black">
                      📍 {prefectureName}
                    </h2>
                  </div>
                </motion.div>

                {/* Content */}
                <div className="flex gap-6">
                  {/* Left: Image */}
                  <motion.div
                    className="w-48 h-48 flex-shrink-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative w-full h-full pixel-borders bg-white p-2">
                      {/* Product Image or Placeholder */}
                      {displayOmiyage.image ? (
                        <img
                          src={displayOmiyage.image}
                          alt={displayOmiyage.nameJa || displayOmiyage.name}
                          className="w-full h-full object-cover"
                          style={{ imageRendering: "auto" }}
                        />
                      ) : (
                        <div
                          className="w-full h-full bg-gradient-to-br from-retro-accent-orange to-retro-accent-yellow flex items-center justify-center"
                          style={{ imageRendering: "pixelated" }}
                        >
                          <span className="text-6xl">🎁</span>
                        </div>
                      )}

                      {/* Price tag */}
                      <div className="absolute -bottom-2 -right-2 bg-retro-accent border-3 border-black px-3 py-1">
                        <span className="font-pixel text-white text-sm">
                          {displayOmiyage.price}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right: Information */}
                  <motion.div
                    className="flex-1 flex flex-col justify-between"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Name with typewriter effect */}
                    <div className="mb-4">
                      <div className="bg-blue-50 border-2 border-blue-300 p-3 min-h-[60px] shadow-inner overflow-visible">
                        <h3 className="text-gray-800 text-2xl font-bold mb-1 whitespace-normal break-words">
                          {displayOmiyage.kanjiName ||
                            displayOmiyage.nameJa ||
                            displayOmiyage.name}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <motion.div
                      className="mb-4 flex-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="bg-white border-2 border-gray-300 p-4 shadow-inner">
                        <p className="font-pixel text-gray-700 text-base leading-relaxed">
                          {displayOmiyage.description}
                        </p>
                      </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      className="flex gap-3 relative z-[95]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <button
                        className="flex-1 pixel-button bg-retro-accent-green text-black font-pixel-retro text-sm py-3 hover:bg-green-400 transition-colors pointer-events-auto border-2 border-black shadow-pixel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowStores(!showStores);
                        }}
                      >
                        🛒 購入する
                      </button>
                      <button
                        className="flex-1 pixel-button bg-gray-700 text-white font-pixel text-sm py-3 hover:bg-gray-600 transition-colors pointer-events-auto border-2 border-black shadow-pixel"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                        }}
                      >
                        閉じる
                      </button>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Stores List Section */}
                <AnimatePresence>
                  {showStores && stores && stores.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded shadow-inner">
                        <h3 className="font-pixel text-blue-700 text-lg mb-4">
                          🏪 購入できる店舗
                        </h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {stores.map((store, index) => {
                            const distance = userLocation
                              ? Math.sqrt(
                                  Math.pow(
                                    (store.lat - userLocation.lat) * 111,
                                    2,
                                  ) +
                                    Math.pow(
                                      (store.lng - userLocation.lng) *
                                        111 *
                                        Math.cos(
                                          (userLocation.lat * Math.PI) / 180,
                                        ),
                                      2,
                                    ),
                                ).toFixed(1)
                              : null;
                            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
                            const directionsUrl = userLocation
                              ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${store.lat},${store.lng}&travelmode=walking`
                              : mapsUrl;

                            return (
                              <div
                                key={index}
                                className="bg-white border border-blue-200 p-3 rounded hover:border-blue-400 hover:shadow-md transition-all"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-pixel text-gray-800 text-sm mb-1">
                                      {store.name}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                      {store.address}
                                    </p>
                                  </div>
                                  {distance && (
                                    <span className="text-blue-600 font-pixel text-xs ml-2 font-bold">
                                      {distance}km
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <a
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white font-pixel text-xs py-2 rounded transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    📍 地図で見る
                                  </a>
                                  {userLocation && (
                                    <a
                                      href={directionsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white font-pixel text-xs py-2 rounded transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      🚶 行き方
                                    </a>
                                  )}
                                </div>
                                {store.rating && (
                                  <div className="mt-2 text-xs text-yellow-400 font-pixel">
                                    ⭐ {store.rating}{" "}
                                    {store.priceRange &&
                                      `• ${store.priceRange}`}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom decorative bar */}
                <motion.div
                  className="mt-6 h-2 bg-gradient-to-r from-retro-accent via-retro-accent-yellow to-retro-accent-orange"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </div>

            {/* Shadow effect */}
            <div className="absolute inset-0 -z-10 translate-x-2 translate-y-2 bg-black/50"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
