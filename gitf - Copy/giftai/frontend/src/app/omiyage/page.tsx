"use client";
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import JapanMap from "@/components/JapanMap"; 
import OmiyageHUD from "@/components/OmiyageHUD";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function OmiyagePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleScanLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Geo Error", error);
          alert("Could not access location. Please enable permissions.");
        }
      );
    } else {
      alert("Geolocation not supported");
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* 1. Background - Removed for performance */}
      
      {/* 2. 3D Map Context */}
      <div className="absolute inset-0 z-10">
        <Canvas dpr={[1, 1.5]} gl={{ toneMappingExposure: 1.2 }}>
           <PerspectiveCamera makeDefault position={[0, 200, 300]} fov={45} />
           
           {/* Scene content managed by JapanMap */}
           <JapanMap 
              onSelectPrefecture={(id, name) => setSelectedId(name)} 
              selectedId={selectedId}
           />
        </Canvas>
      </div>

      {/* 3. HUD Interface */}
      <div className="absolute inset-0 z-20 pointer-events-none">
         <OmiyageHUD 
            selectedId={selectedId} 
            userLocation={userLocation} 
            onScanLocation={handleScanLocation} 
         />
      </div>

      {/* 4. Home Button */}
      <div className="absolute top-5 right-5 z-30">
          <a href="/" className="text-cyan-500 font-mono text-xs border border-cyan-500 px-4 py-2 hover:bg-cyan-500 hover:text-black transition-colors">
              RETURN TO GIFT PORTAL
          </a>
      </div>
    </div>
  );
}
