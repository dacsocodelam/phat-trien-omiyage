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
          alert("Could not access location. Please enable permissions.");
        },
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  return (
    <div className="w-full h-screen bg-retro-bg overflow-hidden relative">
      {/* 8-bit Background Music - Using a placeholder URL */}
      {/* Replace with your own 8-bit music file */}
      <audio
        ref={audioRef}
        loop
        src="https://www.bensound.com/bensound-music/bensound-retrosoul.mp3"
      />

      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center pointer-events-auto"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="font-pixel-retro text-4xl text-retro-accent-yellow mb-8"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              LOADING...
            </motion.div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-retro-accent-cyan"
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.8,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <motion.p
              className="font-pixel text-sm text-gray-400 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Press START when ready
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pixel Art Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          )`,
        }}
      />

      {/* Title Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-[90] bg-black border-b-4 border-retro-accent-yellow p-2 pointer-events-none shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-pixel-retro text-lg text-retro-accent-yellow">
              🗾 OMIYAGE QUEST
            </span>
            <div className="font-pixel text-xs text-gray-400">
              SELECT • DISCOVER • BUY
            </div>
          </div>

          {/* Info display */}
          <div className="flex items-center gap-4">
            {selectedId && (
              <motion.div
                className="font-pixel text-xs text-white bg-retro-accent/50 px-3 py-1 border-2 border-retro-accent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                📍 {selectedId}
              </motion.div>
            )}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-retro-accent-green rounded-full animate-pulse"></div>
              <span className="font-pixel text-xs text-gray-400">ONLINE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2D Pixel Map */}
      <div className="absolute inset-0 z-30 flex items-center justify-center px-4 pt-24 pb-16 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          <JapanMap
            onSelectPrefecture={(id, name) => setSelectedId(name)}
            selectedId={selectedId}
          />
        </div>
      </div>

      {/* HUD Interface */}
      <div className="absolute inset-0 z-[60] pointer-events-none pt-16">
        <OmiyageHUD
          selectedId={selectedId}
          userLocation={userLocation}
          onScanLocation={handleScanLocation}
        />
      </div>

      {/* Control Buttons - Top Right */}
      <div className="absolute top-16 right-5 z-[95] flex gap-3">
        {/* Music Toggle */}
        <motion.button
          className="pixel-button bg-gradient-to-r from-purple-500 to-pink-500 text-white font-pixel-retro text-base w-16 h-16 flex items-center justify-center pointer-events-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:from-purple-600 hover:to-pink-600 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
          onClick={(e) => {
            e.stopPropagation();
            toggleMusic();
          }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          title={isMusicPlaying ? "音楽をミュート" : "音楽を再生"}
        >
          {isMusicPlaying ? "🔊" : "🔇"}
        </motion.button>

        {/* Home Button */}
        <Link
          href="/"
          className="pixel-button bg-gradient-to-r from-orange-400 to-red-500 text-white font-pixel-retro text-base px-6 h-16 flex items-center hover:from-orange-500 hover:to-red-600 transition-all pointer-events-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]"
        >
          ← ホーム
        </Link>
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
            <div className="pixel-box bg-black/90 px-6 py-3 border-2 border-retro-accent-cyan">
              <p className="font-pixel text-sm text-white flex items-center gap-2">
                <span className="animate-bounce">👆</span>
                都道府県をクリックして地元の宝物を発見しよう！
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[85] bg-black/90 border-t-3 border-retro-accent p-2 pointer-events-none shadow-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="font-pixel text-xs text-gray-400">
            🎮 マウスで探索 • 🎁 クリックしてお土産を見る • 📡 近くの店舗を探す
          </div>
          <div className="font-pixel text-xs text-retro-accent-yellow">
            v1.0 ピクセルエディション
          </div>
        </div>
      </motion.div>
    </div>
  );
}
