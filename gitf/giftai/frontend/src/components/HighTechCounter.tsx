import React from "react";
import { motion } from "framer-motion";

// Import Orbitron font locally
const OrbitronFont = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    
    .font-orbitron {
      font-family: 'Orbitron', sans-serif;
    }
    
    .neon-text {
      color: #00f3ff;
      text-shadow: 
        0 0 5px rgba(0, 243, 255, 0.8),
        0 0 10px rgba(0, 243, 255, 0.6),
        0 0 20px rgba(0, 243, 255, 0.4),
        0 0 40px rgba(0, 95, 115, 0.5);
    }
  `}</style>
);

const RollingDigit = ({ value }: { value: number }) => {
  return (
    <div className="relative h-[1em] w-[0.6em] overflow-hidden inline-block text-center align-middle">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: `-${value * 10}%` }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="flex flex-col w-full"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div key={num} className="h-[1em] w-full flex items-center justify-center">
            {num}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function HighTechCounter({ progress }: { progress: number }) {
  // Ensure we consistently render 3 digits ? No, let's just render available.
  const valueStr = Math.round(progress).toString();
  const digits = valueStr.split("").map(Number);

  return (
    <div className="relative px-12 py-6 rounded-md backdrop-blur-sm bg-black/20 border border-cyan-500/30 overflow-hidden flex flex-col items-center justify-center shadow-[0_0_50px_-10px_rgba(0,243,255,0.3)]">
      <OrbitronFont />
      
      {/* Scanner Line */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scanline pointer-events-none" />

      {/* Decorative HUD Frame */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
      
      {/* Top Label */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.3em] font-orbitron text-cyan-300/80 uppercase whitespace-nowrap">
        /// SYNC_STATUS: ACTIVE ///
      </div>

      {/* Counter */}
      <div className="flex items-baseline font-orbitron font-black text-7xl sm:text-8xl neon-text leading-none tracking-tight mix-blend-screen py-2">
         {digits.map((d, i) => (
            // Key using index is fine here as we only grow in length (1 -> 2 -> 3 digits)
            <RollingDigit key={`${i}-${valueStr.length}`} value={d} />
         ))}
         <span className="text-3xl ml-2 text-cyan-200 animate-pulse">%</span>
      </div>

      {/* Bottom Glitch Text */}
      <div className="text-[0.6rem] tracking-widest text-cyan-500/80 font-mono mt-2 animate-pulse">
        DECRYPTING_DATA_STREAM...
      </div>
      
    </div>
  );
}
