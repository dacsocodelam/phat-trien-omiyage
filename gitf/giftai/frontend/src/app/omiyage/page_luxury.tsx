"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import JapanMap from "@/components/JapanMap";
import OmiyageHUD from "@/components/OmiyageHUD";

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
          alert("位置情報にアクセスできませんでした。権限を有効にしてください。");
        },
      );
    } else {
      alert("位置情報がサポートされていません");
    }
  };

  return (
    <div className="w-full h-screen bg-luxury-dark overflow-hidden relative japanese-pattern">
      {/* Background Music */}
      <audio
        ref={audioRef}
        loop
        src="https://www.bensound.com/bensound-music/bensound-retrosoul.mp3"
      />

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-luxury-dark z-[100] flex flex-col items-center justify-center pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="font-luxury text-5xl text-gold-gradient mb-8 tracking-wider"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              お土産を探す
            </motion.div>
            <motion.div
              className="w-48 h-1 bg-luxury-card rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-light"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title Header */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-[90] glass-panel m-6 p-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-luxury text-3xl text-gold-gradient tracking-wider">
              日本のお土産
            </h1>
            <p className="text-luxury-muted text-sm mt-2 tracking-wide">
              都道府県を選んで特別な贈り物を見つけましょう
            </p>
          </div>
          
          {/* Control Buttons */}
          <div className="flex gap-3">
            {/* Music Toggle */}
            <motion.button
              className="w-12 h-12 rounded-full gold-border-glow bg-luxury-card/80 backdrop-blur-md flex items-center justify-center group"
              onClick={(e) => {
                e.stopPropagation();
                toggleMusic();
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={isMusicPlaying ? "音楽をミュート" : "音楽を再生"}
            >
              <span className="text-xl group-hover:text-luxury-gold-light transition-colors">
                {isMusicPlaying ? "🔊" : "🔇"}
              </span>
            </motion.button>

            {/* Home Button */}
            <Link
              href="/"
              className="luxury-button flex items-center gap-2 text-luxury-dark text-sm"
            >
              ← ホーム
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Map Container */}
      <div className="absolute inset-0 z-30 flex items-center justify-center px-4 pt-32 pb-16 pointer-events-none">
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

      {/* Help Tooltip */}
      <AnimatePresence>
        {!selectedId && !isLoading && (
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-[75] pointer-events-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1 }}
          >
            <div className="glass-panel px-8 py-4">
              <p className="text-luxury-text text-sm flex items-center gap-3 tracking-wide">
                <span className="animate-bounce text-luxury-gold">👆</span>
                都道府県をクリックして地元の名物を発見しよう
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[85] glass-panel m-4 p-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.6 }}
      >
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="text-luxury-muted tracking-wide">
            🗾 マウスで探索 • 🎁 クリックでお土産を見る • 📡 近くの店舗を探す
          </div>
          <div className="text-luxury-gold tracking-wider font-luxury">
            v2.0 LUXURY EDITION
          </div>
        </div>
      </motion.div>

      {/* Decorative Corner Elements */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t border-l border-luxury-gold/20 pointer-events-none z-[95]" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t border-r border-luxury-gold/20 pointer-events-none z-[95]" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b border-l border-luxury-gold/20 pointer-events-none z-[95]" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b border-r border-luxury-gold/20 pointer-events-none z-[95]" />
    </div>
  );
}
