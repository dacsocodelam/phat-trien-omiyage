"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RetroDialogProps {
  isOpen: boolean;
  onClose: () => void;
  prefectureName: string;
  omiyage?: {
    name: string;
    nameJa?: string;
    image?: string;
    description?: string;
    price?: string;
    buyUrl?: string;
  };
}

// Typewriter effect hook
const useTypewriter = (
  text: string,
  speed: number = 50,
  enabled: boolean = true,
) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    setDisplayedText("");
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayedText, isComplete };
};

export default function RetroDialog({
  isOpen,
  onClose,
  prefectureName,
  omiyage,
}: RetroDialogProps) {
  const [showContent, setShowContent] = useState(false);

  // Sample data if no omiyage provided
  const displayOmiyage = omiyage || {
    name: `${prefectureName} Special Gift`,
    nameJa: `${prefectureName}の特産品`,
    image: "/img/placeholder-omiyage.png",
    description: `Famous local specialty from ${prefectureName}. A perfect gift to bring back memories!`,
    price: "¥1,500",
    buyUrl: "#",
  };

  const { displayedText: typedName, isComplete } = useTypewriter(
    displayOmiyage.nameJa || displayOmiyage.name,
    50,
    showContent,
  );

  useEffect(() => {
    if (isOpen) {
      // Delay content reveal for animation
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-2xl mx-4 pointer-events-auto"
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
            <div className="relative bg-[#0a1628] border-4 border-white p-1 shadow-2xl">
              {/* Inner border effect */}
              <div className="border-4 border-black bg-[#1a2638] p-6">
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
                      {/* Placeholder for image */}
                      <div
                        className="w-full h-full bg-gradient-to-br from-retro-accent-orange to-retro-accent-yellow flex items-center justify-center"
                        style={{ imageRendering: "pixelated" }}
                      >
                        <span className="text-6xl">🎁</span>
                      </div>

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
                      <div className="bg-black/50 border-2 border-retro-accent-cyan p-3 min-h-[60px]">
                        <h3 className="font-pixel text-white text-xl mb-1">
                          {typedName}
                          {!isComplete && (
                            <span className="inline-block w-2 h-5 bg-white ml-1 animate-typewriter-cursor"></span>
                          )}
                        </h3>
                        {isComplete && displayOmiyage.name && (
                          <p className="font-pixel text-retro-accent-yellow text-sm mt-1">
                            {displayOmiyage.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {isComplete && (
                      <motion.div
                        className="mb-4 flex-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="bg-black/30 border-2 border-gray-600 p-3">
                          <p className="font-pixel text-gray-300 text-sm leading-relaxed">
                            {displayOmiyage.description}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    {isComplete && (
                      <motion.div
                        className="flex gap-3 relative z-[95]"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <button
                          className="flex-1 pixel-button bg-retro-accent-green text-black font-pixel-retro text-sm py-3 hover:bg-green-400 transition-colors pointer-events-auto border-2 border-black shadow-pixel"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (displayOmiyage.buyUrl) {
                              window.open(displayOmiyage.buyUrl, "_blank");
                            }
                          }}
                        >
                          🛒 BUY NOW
                        </button>
                        <button
                          className="flex-1 pixel-button bg-gray-700 text-white font-pixel text-sm py-3 hover:bg-gray-600 transition-colors pointer-events-auto border-2 border-black shadow-pixel"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                          }}
                        >
                          CLOSE
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

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
