import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function HologramGift() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
    if (glowRef.current) {
        glowRef.current.scale.setScalar(1.2 + Math.sin(t * 2) * 0.05);
    }
  });

  return (
    <group>
      {/* Wireframe Box */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.3} />
      </mesh>
      
      {/* Inner Hologram Core */}
      <mesh>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <MeshDistortMaterial
          color="#00ffff"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          distort={0.3}
          speed={2}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Outer Scanning Ring */}
      <mesh ref={glowRef} rotation-x={Math.PI/2}>
         <ringGeometry args={[1.5, 1.6, 64]} />
         <meshBasicMaterial color="#ffd700" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Particles */}
      <points>
         <sphereGeometry args={[3, 32, 32]} />
         <pointsMaterial color="#00ffff" size={0.05} transparent opacity={0.4} sizeAttenuation />
      </points>
    </group>
  );
}
