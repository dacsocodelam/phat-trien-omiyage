import React, { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useSpring,
  useTransform,
  animate,
  AnimatePresence,
} from "framer-motion";
import HighTechCounter from "./HighTechCounter";

// --- SUB-COMPONENTS ---

// 1. Digital Glitch Text
const GlitchText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className={`relative ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-[1px] -z-10 opacity-50 animate-pulse text-red-500">
        {text}
      </span>
      <span className="absolute top-0 -left-[1px] -z-10 opacity-50 animate-pulse text-blue-500 delay-75">
        {text}
      </span>
    </div>
  );
};

// 2. Random Hex Data Stream
const HexData = ({ position }: { position: string }) => {
  const [data, setData] = useState("0x00");

  useEffect(() => {
    const interval = setInterval(
      () => {
        setData(
          `0x${Math.floor(Math.random() * 255)
            .toString(16)
            .toUpperCase()
            .padStart(2, "0")}`,
        );
      },
      100 + Math.random() * 200,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`absolute ${position} font-mono text-xs text-cyan-500/70 tracking-widest`}
    >
      DATA_STREAM: {data}
    </div>
  );
};

// 3. Central Wireframe Core
const CentralCore = ({ progress }: { progress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Pulse based on progress
    const speed = 2 + (progress / 100) * 8; // Faster as it loads
    const scale = 1 + Math.sin(t * speed) * (0.05 + (progress / 100) * 0.1);

    meshRef.current.scale.setScalar(scale);
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.02;
  });

  return (
    <group>
      {/* Outer Wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.3 + (progress / 100) * 0.7}
        />
      </mesh>
      {/* Inner Glow Core */}
      <mesh scale={0.8}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.2}
          wireframe={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// 4. Data Vortex Particles
const DataVortex = ({ progress }: { progress: number }) => {
  const count = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const tempObj = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: 10 + Math.random() * 10,
      speed: 0.1 + Math.random() * 0.2,
      y: (Math.random() - 0.5) * 10,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    particles.forEach((p, i) => {
      // Spiral inwards
      // Capture effect: High progress = tighter radius, faster speed
      const suction = 1 + (progress / 100) * 2;

      p.angle += p.speed * 0.1 * suction;
      p.radius -= 0.05 * suction;

      if (p.radius < 0.5) {
        p.radius = 15 + Math.random() * 5; // Reset
      }

      const x = Math.cos(p.angle) * p.radius;
      const z = Math.sin(p.angle) * p.radius;

      tempObj.position.set(x, p.y * (p.radius / 10), z); // Flatten as it gets closer
      tempObj.rotation.set(t, t, t);
      tempObj.scale.setScalar(0.05 + (10 - p.radius) * 0.01);
      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
};

// --- NEW COMPONENTS ---

// 1. AI Process Terminal
const AIProcessTerminal = ({ progress }: { progress: number }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (progress > 5 && !logs.includes("> CONNECTING_TO_SATELLITE..."))
      setLogs((p) => [...p, "> CONNECTING_TO_SATELLITE..."]);
    if (progress > 20 && !logs.includes("> HANDSHAKE_ESTABLISHED"))
      setLogs((p) => [...p, "> HANDSHAKE_ESTABLISHED"]);
    if (progress > 40 && !logs.includes("> DOWNLOADING_NEURAL_MAP..."))
      setLogs((p) => [...p, "> DOWNLOADING_NEURAL_MAP..."]);
    if (progress > 60 && !logs.includes("> DECRYPTING_GIFT_MATRIX..."))
      setLogs((p) => [...p, "> DECRYPTING_GIFT_MATRIX..."]);
    if (progress > 80 && !logs.includes("> OPTIMIZING_HOLOGRAM_CORE..."))
      setLogs((p) => [...p, "> OPTIMIZING_HOLOGRAM_CORE..."]);
    if (progress > 95 && !logs.includes("> FINALIZING_RENDER_SEQUENCE"))
      setLogs((p) => [...p, "> FINALIZING_RENDER_SEQUENCE"]);
  }, [progress, logs]);

  return (
    <div className="absolute top-20 left-10 w-64 font-mono text-xs text-cyan-400/80 space-y-1">
      <div className="border-b border-cyan-500/30 pb-1 mb-2 tracking-widest text-cyan-200">
        SYSTEM_LOGS
      </div>
      <AnimatePresence>
        {logs.slice(-5).map((log, i) => (
          <motion.div
            key={log}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="truncate"
          >
            {log}
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="animate-pulse">_</div>
    </div>
  );
};

// 2. Smart Countdown Ring (Pulse Ring)
const SmartCountdownRing = () => {
  const [ms, setMs] = useState(999);
  useEffect(() => {
    const interval = setInterval(
      () => setMs((prev) => (prev <= 10 ? 999 : prev - 13)),
      50,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute bottom-20 right-10 flex items-center justify-center">
      {/* Rotating Outer Ring */}
      <div
        className={`w-24 h-24 rounded-full border border-cyan-500/30 border-t-cyan-400 animate-[spin_3s_linear_infinite] absolute`}
      />
      {/* Pulse Inner Ring */}
      <div
        className={`w-20 h-20 rounded-full border border-cyan-500/10 animate-ping absolute`}
      />

      <div className="flex flex-col items-center z-10 font-mono text-cyan-300">
        <span className="text-xl font-bold tracking-widest">00:00</span>
        <span className="text-xs text-cyan-500">
          {ms.toString().padStart(3, "0")}ms
        </span>
      </div>

      <div className="absolute top-[-10px] bg-[#050510] px-1 text-[0.6rem] text-cyan-500">
        TIMER
      </div>
    </div>
  );
};

// 3. Dynamic Particle Status Bar
const DynamicStatusBar = ({ progress }: { progress: number }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0a0a20]">
      <motion.div
        className="h-full bg-cyan-500 relative overflow-hidden"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
      >
        {/* Simulated Particles */}
        <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white to-transparent opacity-80 animate-pulse"></div>
      </motion.div>
    </div>
  );
};

// 4. White Flash Effect
const FlashOverlay = ({ progress }: { progress: number }) => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    // Trigger flash at roughly 25, 50, 75
    // Since progress updates frequently, we need to debounce or check range logic
    // Simple hack: Check rounded values and use flag ref if strictness needed.
    // Or just let blinking happen randomly for "High Tech" feel?
    // User asked specifically for 25, 50, 75.
    if (
      Math.abs(progress - 25) < 1 ||
      Math.abs(progress - 50) < 1 ||
      Math.abs(progress - 75) < 1
    ) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 100);
      return () => clearTimeout(t);
    }
  }, [progress]);

  return (
    <div
      className={`absolute inset-0 bg-white pointer-events-none transition-opacity duration-100 ease-out z-[999]
            ${flash ? "opacity-30" : "opacity-0"}`}
    />
  );
};

// --- MAIN COMPONENT ---

export default function TechLoadingHUD({ progress }: { progress: number }) {
  // Smooth number transition using framer-motion is handled by HighTechCounter now.

  return (
    <group>
      {/* 3D Elements */}
      <CentralCore progress={progress} />
      <DataVortex progress={progress} />

      {/* 2D HUD Overlay */}
      <Html fullscreen zIndexRange={[100, 0]}>
        <div className="w-full h-full font-mono pointer-events-none select-none text-cyan-400 bg-transparent">
          <FlashOverlay progress={progress} />

          {/* Main Percent (Center) - UPGRADED */}
          <div className="absolute inset-0 flex items-center justify-center">
            <HighTechCounter progress={progress} />
          </div>

          {/* New Components */}
          <AIProcessTerminal progress={progress} />
          <SmartCountdownRing />
          <DynamicStatusBar progress={progress} />

          {/* Corners Hex Data (Keep 2 at top) */}
          <HexData position="top-10 left-10" />
          <HexData position="top-10 right-10" />

          {/* Decorative Frames */}
          <div className="absolute top-1/2 left-4 w-1 h-20 bg-cyan-500/50"></div>
          <div className="absolute top-1/2 right-4 w-1 h-20 bg-cyan-500/50"></div>
        </div>
      </Html>
    </group>
  );
}
