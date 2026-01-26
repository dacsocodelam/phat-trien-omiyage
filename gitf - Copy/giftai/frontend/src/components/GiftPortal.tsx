"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Environment, PerspectiveCamera, Billboard, PointMaterial, Icosahedron } from "@react-three/drei";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

interface GiftPortalProps {
  progress: number;
  formData: any;
}

// -------------------------------------------------------------
// SHADER: GPU PARTICLE SYSTEM (Suction & Swirl)
// -------------------------------------------------------------
const particleShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#00ffff") },
    uProgress: { value: 0 },
    uPixelRatio: { value: 1 } // Will be set in component
  },
  vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    uniform float uPixelRatio;
    
    attribute vec3 aRandom; // x: random offset, y: speed, z: scale
    
    varying float vAlpha;
    
    void main() {
      // Base rotation
      float angle = uTime * aRandom.y * 0.5 + aRandom.x * 6.28;
      
      // Calculate suction radius
      // Start at original position length (approx 5-10)
      // As progress increases, target radius becomes smaller (approx 1.5)
      vec3 initialPos = position;
      float r = length(initialPos);
      
      // Suction effect: Interpolate radius based on uProgress
      // uProgress 0 -> Radius full
      // uProgress 1 -> Radius squeezed to 1.5 + jitter
      float targetR = 1.2 + sin(uTime * 2.0 + aRandom.x * 10.0) * 0.1; 
      float currentR = mix(r, targetR, uProgress * uProgress); // Non-linear nice suction
      
      // Swirl physics
      float swirl = uProgress * 5.0; // Twist more as we get closer
      float c = cos(angle + swirl);
      float s = sin(angle + swirl);
      
      // New position based on spherical coords roughly
      // We just rotate the initial vector and scale length
      vec3 pos = normalize(initialPos);
      
      // Rotate around Y axis
      vec3 rotatedPos = vec3(
          pos.x * c - pos.z * s,
          pos.y,
          pos.x * s + pos.z * c
      );
      
      vec3 finalPos = rotatedPos * currentR;
      
      // Add "nervous" jitter at high progress
      finalPos += vec3(
          sin(uTime * 10.0 + aRandom.z),
          cos(uTime * 15.0 + aRandom.y),
          sin(uTime * 20.0 + aRandom.x)
      ) * 0.02 * uProgress;

      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size attenuation
      gl_PointSize = (30.0 * aRandom.z + 10.0) * uPixelRatio;
      gl_PointSize *= (1.0 / -mvPosition.z);
      
      // Opacity fade in/out
      vAlpha = 0.5 + 0.5 * sin(uTime + aRandom.x * 10.0);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vAlpha;
    
    void main() {
      // Circular particle
      float r = distance(gl_PointCoord, vec2(0.5));
      if (r > 0.5) discard;
      
      // Soft edge
      float glow = 1.0 - (r * 2.0);
      glow = pow(glow, 1.5);
      
      gl_FragColor = vec4(uColor, vAlpha * glow);
    }
  `
};

// -------------------------------------------------------------
// COMPONENT: GPU Constellation Core
// -------------------------------------------------------------
function GPUConstellationCore({ progress, isExploding }: { progress: number, isExploding: boolean }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.Group>(null!);
  const textRef = useRef<THREE.Group>(null!);
  
  // 1. Generate BufferGeometry for GPU Particles
  const particleCount = 2000;
  const particleGeo = useMemo(() => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(particleCount * 3);
      const randoms = new Float32Array(particleCount * 3);
      
      for(let i=0; i<particleCount; i++) {
          // Spread widely initially
          const r = 4 + Math.random() * 6;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
          pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
          pos[i*3+2] = r * Math.cos(phi);
          
          randoms[i*3] = Math.random(); // offset
          randoms[i*3+1] = 0.5 + Math.random(); // speed
          randoms[i*3+2] = 0.5 + Math.random(); // size scale
      }
      
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
      return geo;
  }, []);

  // 2. Wireframe Core (Static Topology, Rotating)
  // Use simple Icosahedron wireframe
  const wireGeo = useMemo(() => new THREE.IcosahedronGeometry(1.2, 1), []);

  const uniforms = useMemo(() => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#00ffff") },
      uProgress: { value: 0 },
      uPixelRatio: { value: 1 } // Default, updated via useThree
  }), []);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const p = Math.min(progress / 100, 1);
    
    // Update Shader Uniforms
    uniforms.uTime.value = time;
    uniforms.uProgress.value = p;
    uniforms.uPixelRatio.value = state.viewport.dpr;

    // Rotate Wireframe Core
    if (linesRef.current) {
        linesRef.current.rotation.x = time * 0.1;
        linesRef.current.rotation.y = time * 0.15;
        // Pulse
        linesRef.current.scale.setScalar(1 + Math.sin(time*4)*0.02);
    }
    
    // Text Jitter (Ref-based, NO RE-RENDER)
    if (textRef.current) {
        // High progress = Low jitter (Stability reached) or High jitter (Processing)? 
        // User asked for "sharpness", so let's keep jitter minimal or zero when reading.
        // Let's add very subtle float.
        textRef.current.position.x = Math.sin(time * 3) * 0.01;
        textRef.current.position.y = Math.cos(time * 2.5) * 0.01;
        
        // Glitch Shake occasionally
        if (Math.random() > 0.98) {
             textRef.current.position.x += (Math.random()-0.5) * 0.05;
        }
    }
  });

  return (
    <group>
        {/* GPU Particles */}
        <points ref={pointsRef} geometry={particleGeo}>
             <shaderMaterial 
                vertexShader={particleShader.vertexShader}
                fragmentShader={particleShader.fragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
             />
        </points>

        {/* Central Wireframe Core (Optimized LineSegments via wireframe prop) */}
        <group ref={linesRef}>
             <mesh geometry={wireGeo}>
                  <meshBasicMaterial 
                      color="#FFD700" 
                      wireframe={true} 
                      transparent 
                      opacity={0.15} 
                      blending={THREE.AdditiveBlending} 
                  />
             </mesh>
             {/* Inner faint glow */}
             <mesh geometry={wireGeo} scale={0.9}>
                  <meshBasicMaterial color="#00ffff" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
             </mesh>
        </group>

        {/* 3D Text */}
        <Billboard>
            <group ref={textRef}>
                <Text
                    fontSize={1.2} // Larger for legibility
                    anchorX="center"
                    anchorY="middle"
                    // ToneMapped=false makes it ignore post-processing exposure tone mapping -> brighter
                    // But Bloom will pick it up.
                >
                    {Math.round(progress)}%
                    <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </Text>
            </group>
        </Billboard>
    </group>
  );
}


// -------------------------------------------------------------
// PRESERVED COMPONENT: Particle Tunnel (Background)
// -------------------------------------------------------------
function ParticleTunnel({ progress }: { progress: number }) {
  const ref = useRef<THREE.Points>(null!);
  const count = 3000;
  
  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 20; 
        const z = (Math.random() - 0.5) * 100;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;
    }
    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const p = Math.min(progress / 100, 1);
    const speed = 15 * delta + (p * 40 * delta); // Suction increases
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 2] += speed;
      if (positions[i * 3 + 2] > 20) {
        positions[i * 3 + 2] = -80; 
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.z += 0.2 * delta;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#00ffff" 
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// -------------------------------------------------------------
// PRESERVED COMPONENT: Orbiting Data Text
// -------------------------------------------------------------
function OrbitingData({ formData, progress, isExploding }: { formData: any, progress: number, isExploding: boolean }) {
  if (isExploding) return null;
  const labels = useMemo(() => {
    const list = [];
    if (formData.gender) list.push(formData.gender);
    if (formData.relationship) list.push(formData.relationship);
    if (formData.occasion) list.push(formData.occasion);
    if (formData.hobby) list.push(formData.hobby);
    if (formData.age) list.push(`${formData.age}歳`);
    if (formData.budget) list.push(formData.budget);
    return list;
  }, [formData]);

  return (
    <group>
      {labels.map((label, i) => (
        <OrbitingLabel key={i} label={label} index={i} total={labels.length} />
      ))}
    </group>
  );
}

function OrbitingLabel({ label, index, total }: { label: string, index: number, total: number }) {
    const ref = useRef<any>(null!);
    const angleOffset = (index / total) * Math.PI * 2;
    const radiusX = 4 + Math.random() * 2;
    const radiusZ = 3 + Math.random() * 2;
    
    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.elapsedTime * 0.5 + angleOffset;
            ref.current.position.x = Math.cos(t) * radiusX;
            ref.current.position.z = Math.sin(t) * radiusZ;
            ref.current.position.y = Math.sin(t * 1.5) * 1 + Math.cos(t) * 0.5;
            ref.current.lookAt(0, 0, 0);
        }
    });

    return (
        <Text
            ref={ref}
            fontSize={0.25}
            color="#00ffff"
            fillOpacity={0.8}
            anchorX="center"
            anchorY="middle"
        >
            [{label}]
        </Text>
    );
}

// -------------------------------------------------------------
// HELPER: Decoded Text Effect
// -------------------------------------------------------------
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";

function DecodedText({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState(text);
    
    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev => 
                text.split("").map((letter, index) => {
                    if(index < iteration) return text[index];
                    return GLYPHS[Math.floor(Math.random() * 26)];
                }).join("")
            );
            if(iteration >= text.length) clearInterval(interval);
            iteration += 1/3; 
        }, 30);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <motion.div
           initial={{ opacity: 0, filter: 'blur(10px)' }}
           animate={{ opacity: 1, filter: 'blur(0px)' }}
           exit={{ opacity: 0, filter: 'blur(10px)' }}
           className="text-[#00ffff] font-mono text-sm tracking-[0.3em] uppercase glow-text"
           style={{ textShadow: "0 0 10px #00ffff" }}
        >
            {displayText}
        </motion.div>
    )
}

// -------------------------------------------------------------
// SECTION: Cinematic UI
// -------------------------------------------------------------
function CinematicUI({ progress, messages }: { progress: number, messages: string[] }) {
    return (
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center">
             <div className="absolute bottom-12 w-full flex flex-col items-center">
                 <div className="h-20 flex flex-col items-center justify-end space-y-1">
                     <AnimatePresence mode="popLayout">
                        {messages.slice(-1).map((msg, i) => (
                             <DecodedText key={`${msg}-${i}`} text={msg} />
                        ))}
                     </AnimatePresence>
                 </div>
                 <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#00ffff] to-transparent mt-4 opacity-50" />
             </div>
        </div>
    )
}

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export default function GiftPortal({ progress = 0, formData = {} }: GiftPortalProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const isExploding = progress >= 99;

  useEffect(() => {
     if (progress < 10) setMessages(["// INIT_GPU_CLUSTERS"]);
     else if (progress < 40) setMessages(["// OPTIMIZING_NEURAL_PATH", ">> ALLOCATING_VRAM"]);
     else if (progress < 70) setMessages(["// WEAVING_DATA_THREADS", ">> SYNCHRONIZING_CORE"]);
     else if (progress < 95) setMessages(["// RENDERING_REALITY", ">> FINAL_COMPILE"]);
     else if (progress >= 100) setMessages([">> EXECUTION_COMPLETE"]);
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Canvas  
                dpr={[1, 2]} // Support high-DPI screens but cap at 2x
                gl={{ toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
                // Optimization: Switch to demand rendering if static, but this is animated.
            >
                <PerspectiveCamera makeDefault position={[0, 0, 9]} />
                <color attach="background" args={['#02020a']} />
                
                {/* Lighting: Optimized */}
                <ambientLight intensity={0.5} color="#00ffff" />
                <pointLight position={[10, 5, 10]} intensity={1.5} color="#ffffff" />
                
                {/* Environment: Reduced need for expensive env maps if mostly wireframe/points */}
                <Environment preset="night" />
                
                {/* Core Layers */}
                <ParticleTunnel progress={progress} />
                <GPUConstellationCore progress={progress} isExploding={isExploding} />
                <OrbitingData formData={formData} progress={progress} isExploding={isExploding} />
                
                {/* Post Processing: OPTIMIZED */}
                <EffectComposer disableNormalPass>
                    {/* Resolution Scale 0.5: Huge performance gain, softer bloom */}
                    <Bloom 
                        luminanceThreshold={0.6} 
                        luminanceSmoothing={0.9} 
                        height={300} 
                        intensity={0.8} 
                        resolutionScale={0.5} 
                    />
                    <Noise opacity={0.03} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    <ChromaticAberration 
                        blendFunction={BlendFunction.NORMAL} 
                        offset={new THREE.Vector2(0.001, 0.001)} 
                    />
                </EffectComposer>
            </Canvas>
        </div>

        <CinematicUI progress={progress} messages={messages} />

        {/* Grand Finale Whiteout at end */}
        <AnimatePresence>
            {isExploding && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.1, ease: "easeIn" }}
                    className="absolute inset-0 bg-white z-50 pointer-events-none mix-blend-normal"
                />
            )}
        </AnimatePresence>
    </div>
  );
}
