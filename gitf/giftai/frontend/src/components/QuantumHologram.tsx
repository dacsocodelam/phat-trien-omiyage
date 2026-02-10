import React, { useRef, useMemo } from "react";
import { useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial, useTexture } from "@react-three/drei";

// 1. DEFINING THE CUSTOM SHADER MATERIAL
const QuantumShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0, // 0 to 1
    uColor: new THREE.Color("#00ffff"),
    uResolution: new THREE.Vector2(1, 1)
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying float vNoise;
    uniform float uTime;

    // Simple noise function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      
      // Jitter / Glitch effect on Vertex based on time
      float glitch = sin(uTime * 20.0) * 0.01;
      vec3 pos = position;
      pos.x += glitch * step(0.95, random(uv + uTime)); // Occasional glitch

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform float uProgress;
    uniform vec3 uColor;
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUv;

    void main() {
      // Map progress (0-1) to height (-2 to 2)
      float limit = mix(-1.5, 1.5, uProgress);
      
      // Calculate distance to the "Event Horizon" plane
      float dist = vPosition.y - limit;
      
      // 1. MATERIALIZED PART (Below limit)
      if (dist < 0.0) {
          // Standard-ish look with slight tech overlay
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDir, vNormal), 3.0);
          
          vec3 baseColor = vec3(0.1, 0.1, 0.2); // Dark metallic
          vec3 glow = uColor * fresnel * 2.0;
          
          gl_FragColor = vec4(baseColor + glow, 1.0);
      } 
      // 2. THE EVENT HORIZON (The Edge)
      else if (dist < 0.1) {
          // High intensity neon breakdown
          float flash = sin(uTime * 20.0) * 0.5 + 0.5;
          gl_FragColor = vec4(uColor * 5.0 * flash, 1.0); // Super bright for Bloom
      }
      // 3. UNMATERIALIZED PART (Above limit - Point Cloud / Dissolve)
      else {
          // Dithering pattern
          float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
          
          // Wireframe-ish logic (grid)
          float grid = step(0.9, fract(vPosition.x * 5.0)) + step(0.9, fract(vPosition.z * 5.0));
          
          if (dither > 0.8 || grid > 0.5) {
             gl_FragColor = vec4(uColor * 0.5, 0.3); // Faint ghost
          } else {
             discard;
          }
      }
    }
  `
);

extend({ QuantumShaderMaterial });

// Add TypeScript definition
declare global {
  namespace JSX {
    interface IntrinsicElements {
      quantumShaderMaterial: any;
    }
  }
}

export default function QuantumHologram({ isVisible }: { isVisible: boolean }) {
  const materialRef = useRef<any>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const targetProgress = useRef(0);
  
  useFrame((state, delta) => {
    if (!materialRef.current) return;
    
    // Smooth cinematic transition logic
    if (isVisible) {
        targetProgress.current = Math.min(targetProgress.current + delta * 0.5, 1);
    } else {
        targetProgress.current = 0;
    }

    // Lerp actual uniform for smoothness
    materialRef.current.uProgress = THREE.MathUtils.lerp(
        materialRef.current.uProgress, 
        targetProgress.current, 
        delta * 2
    );
    
    materialRef.current.uTime = state.clock.elapsedTime;
    
    // Floating animation
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.2;
        // Impact Pulse at 100%
        if (materialRef.current.uProgress > 0.95) {
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.02;
            meshRef.current.scale.setScalar(pulse);
        }
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 4]} /> {/* High poly for smooth shader */}
      {/* @ts-ignore */}
      <quantumShaderMaterial 
         ref={materialRef} 
         transparent 
         side={THREE.DoubleSide} 
      />
    </mesh>
  );
}
