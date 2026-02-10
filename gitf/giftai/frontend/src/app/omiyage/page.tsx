"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import JapanMap from "@/components/JapanMap";
import OmiyageHUD from "@/components/OmiyageHUD";

const DynamicBackground = dynamic(
  () => import("@/components/DynamicBackground"),
  { ssr: false },
);

export default function OmiyagePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-request user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("位置情報の取得に失敗しました:", error.message);
        },
      );
    }
  }, []);

  // Music player control
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((err) => console.log("Audio play failed:", err));
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleScanLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geo Error", error);
          alert(
            "現在地にアクセスできません。位置情報の許可を有効にしてください。",
          );
        },
      );
    } else {
      alert("位置情報に対応していません");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] overflow-hidden relative">
      {/* Dynamic Background giống trang chủ */}
      <DynamicBackground />

      {/* 8-bit Background Music - Using a placeholder URL */}
      {/* Replace with your own 8-bit music file */}
      <audio
        ref={audioRef}
        loop
        src="/img/ヴォーゴックダット (online-audio-converter.com) (1).mp3"
      />

      {/* Loading Screen với gradient hiện đại */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] z-[100] flex flex-col items-center justify-center pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-5xl font-bold mb-8"
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                お土産を探す
              </span>
            </motion.div>

            {/* Progress bar giống trang chủ */}
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>

            <motion.p
              className="text-sm text-gray-400 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              日本全国のお土産データを読み込んでいます...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header với gradient modern */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-[90] pointer-events-none"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="pointer-events-auto">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] bg-clip-text text-transparent">
                🗾 日本のお土産マップ
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              {/* 都道府県を選んで特別な贈り物を見つけましょう */}
              {selectedId && (
                <span className="ml-3 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-400 text-xs">
                  📍 {selectedId}
                </span>
              )}
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 pointer-events-auto">
            {/* Music Toggle */}
            <motion.button
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-md flex items-center justify-center hover:from-purple-500/30 hover:to-pink-500/30 transition-all group"
              onClick={(e) => {
                e.stopPropagation();
                toggleMusic();
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title={isMusicPlaying ? "音楽を止める" : "音楽を再生"}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {isMusicPlaying ? "🔊" : "🔇"}
              </span>
            </motion.button>

            {/* Home Button */}
            <Link
              href="/"
              className="px-6 h-12 rounded-xl bg-gradient-to-r from-yellow-500/90 to-orange-500/90 hover:from-yellow-400 hover:to-orange-400 flex items-center gap-2 font-semibold text-black transition-all shadow-lg hover:shadow-yellow-500/50 hover:scale-105"
            >
              <span>←</span>
              <span>ホーム</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="absolute inset-0 z-30 flex items-center justify-center px-4 pt-32 pb-24 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <JapanMap
            onSelectPrefecture={(id, name) => setSelectedId(name)}
            selectedId={selectedId}
          />
        </div>
      </div>

      {/* HUD Interface */}
      <div className="absolute inset-0 z-[60] pointer-events-none pt-32">
        <OmiyageHUD
          selectedId={selectedId}
          userLocation={userLocation}
          onScanLocation={handleScanLocation}
        />
      </div>

      {/* Help Tooltip - Ẩn đi vì JapanMap đã có tutorial riêng */}
      {/* <AnimatePresence>
        {!selectedId && !isLoading && (
          <motion.div
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[75] pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-md border border-yellow-500/30 rounded-2xl px-8 py-4 shadow-2xl">
              <p className="text-white text-sm flex items-center gap-3">
                <span className="animate-bounce text-2xl">👆</span>
                <span>都道府県をクリックして地元の名物を発見しよう！</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Footer - Modern glassmorphism */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[85] bg-gradient-to-t from-black/80 via-black/50 to-transparent backdrop-blur-md border-t border-white/10 p-4 pointer-events-none"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.6 }}
      >
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="text-gray-400">
            🗾 マウスで探索 • 🎁 クリックでお土産を見る • 📡 近くの店舗を探す
          </div>
          <div className="text-yellow-500 font-semibold">
            v2.0 MODERN EDITION
          </div>
        </div>
      </motion.div>
    </div>
  );
}
