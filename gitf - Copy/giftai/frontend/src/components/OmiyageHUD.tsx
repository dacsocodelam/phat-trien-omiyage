import React, { useState, useEffect } from "react";
import { OMIYAGE_DATA } from "../data/omiyageData";
import { motion, AnimatePresence } from "framer-motion";
import HighTechCounter from "./HighTechCounter";

interface OmiyageHUDProps {
  selectedId: string | null;
  userLocation: { lat: number; lng: number } | null;
  onScanLocation: () => void;
}

// Distance calculator (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function OmiyageHUD({ selectedId, userLocation, onScanLocation }: OmiyageHUDProps) {
  const data = selectedId ? OMIYAGE_DATA[selectedId] || OMIYAGE_DATA["Shimane"] : null; // Fallback for demo
  
  if (!selectedId) return (
      <div className="absolute top-20 left-10 p-6 glass-panel max-w-sm pointer-events-auto">
          <h2 className="text-2xl font-orbitron text-cyan-400 mb-2">SELECT REGION</h2>
          <p className="text-cyan-200/70 text-sm">Please select a prefecture on the holographic map to view Omiyage data.</p>
      </div>
  );

  // If data missing, show debug/fallback
  if (!data) return (
      <div className="absolute top-20 left-10 p-6 glass-panel max-w-sm pointer-events-auto">
          <h2 className="text-2xl font-orbitron text-red-400 mb-2">NO DATA</h2>
          <p className="text-cyan-200/70 text-sm">Region: <span className="font-bold text-white">{selectedId}</span></p>
          <p className="text-xs text-gray-400 mt-2">Database entry not found. Displaying Shimane demo data below:</p>
          <button 
             className="mt-4 border border-cyan-500 text-cyan-500 px-4 py-1 text-xs hover:bg-cyan-500 hover:text-black transition-colors"
             onClick={() => window.location.reload()} // Quick reset or custom handler
          >
             LOAD DEMO (SHIMANE)
          </button>
      </div>
  );

  return (
    <div className="absolute top-20 left-10 w-[400px] h-[80vh] flex flex-col pointer-events-none">
      
      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-0" />
      
      {/* CONTENT CONTAINER */}
      <div className="glass-panel p-6 h-full overflow-y-auto pointer-events-auto relative z-10 scrollbar-hide">
          
          {/* HEADER */}
          <div className="border-b border-cyan-500/50 pb-4 mb-6">
              <div className="text-xs text-cyan-500 font-mono tracking-widest mb-1">REGION DATA</div>
              <h1 className="text-4xl font-black text-cyan-100 uppercase tracking-tighter drop-shadow-glow">
                  {data.name}
                  <span className="text-xl ml-2 opacity-50">{data.kanjiName}</span>
              </h1>
              <p className="text-sm text-cyan-200/80 mt-2 font-mono leading-relaxed">
                  {data.description}
              </p>
          </div>

          {/* SPECIALTIES */}
          <div className="mb-8">
              <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-cyan-400 mr-2 rounded-full animate-pulse"></span>
                  FAMOUS SPECIALTIES
              </h3>
              <div className="space-y-4">
                  {data.specialties.map(item => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-black/40 border border-cyan-500/30 p-3 rounded hover:bg-cyan-900/20 transition-colors group"
                      >
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-cyan-100">{item.name}</h4>
                             <span className="text-xs bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-300">¥{item.price}</span>
                          </div>
                          <p className="text-xs text-cyan-200/60 mb-2 italic">"{item.culturalContext}"</p>
                          <p className="text-xs text-white/80">{item.description}</p>
                      </motion.div>
                  ))}
              </div>
          </div>

          {/* GEOLOCATION STORE FINDER */}
          <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center">
                  <span className="text-xl mr-2">📡</span>
                  STORE LOCATOR
              </h3>
              
              {!userLocation ? (
                   <button 
                     onClick={onScanLocation}
                     className="w-full py-3 bg-cyan-600/20 border border-cyan-500 hover:bg-cyan-500 hover:text-black transition-all text-cyan-400 font-mono text-sm tracking-widest uppercase flex items-center justify-center gap-2 group"
                   >
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-cyan-400 opacity-20"></span>
                      Initialize Radar Scan
                   </button>
              ) : (
                  <div className="space-y-4">
                      {data.stores.map((store, i) => {
                          const dist = calculateDistance(userLocation.lat, userLocation.lng, store.lat, store.lng);
                          const walkUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${store.lat},${store.lng}&travelmode=walking`;
                          
                          return (
                              <div key={i} className="border-l-2 border-cyan-500 pl-4 py-2 relative">
                                  <div className="font-bold text-white text-sm">{store.name}</div>
                                  <div className="text-xs text-cyan-200/50 mb-2">{store.address}</div>
                                  
                                  <div className="flex items-center justify-between">
                                      {/* Odometer Distance */}
                                      <div className="text-cyan-400 font-mono text-lg font-bold">
                                         {dist.toFixed(1)} <span className="text-xs">km</span>
                                      </div>
                                      
                                      <a 
                                        href={walkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded hover:bg-white transition-colors flex items-center gap-1"
                                      >
                                          NAVIGATE ↗
                                      </a>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              )}
          </div>

      </div>

      {/* DECORATIVE CORNERS */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />
    </div>
  );
}
