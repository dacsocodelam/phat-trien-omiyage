import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface NeuralTransitionProps {
  progress: number;
  isComplete: boolean;
}

export default function NeuralTransition({ progress, isComplete }: NeuralTransitionProps) {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  
  // Calculate light intensity based on progress (0 to 100)
  // Max intensity peaks at 100% just before explosion
  const intensity = useMemo(() => {
     return 1 + (progress / 100) * 4; // 1.0 -> 5.0
  }, [progress]);

  useFrame((state, delta) => {
    if (!sphereRef.current) return;

    const t = state.clock.getElapsedTime();

    // 1. PULSE EFFECT (Heartbeat)
    // Scale up/down rhythmically
    // Speed increases with progress
    const pulseSpeed = 2 + (progress / 100) * 5; 
    const pulseScale = 1 + Math.sin(t * pulseSpeed) * 0.05;
    
    // Base scale grows slightly as it charges up
    const baseScale = 1 + (progress / 100) * 0.2;
    
    let finalScale = baseScale * pulseScale;

    // 2. SHATTER / SHRINK EFFECT
    if (isComplete) {
       // Rapid shrink to center
       const shrinkSpeed = 10 * delta;
       sphereRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.2);
       
       // Increase distortion to chaos
       if (materialRef.current) {
         materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, 2.0, 0.1);
         materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, 0, 0.2);
       }
    } else {
       sphereRef.current.scale.setScalar(finalScale);
    }

    // Rotate slowly
    sphereRef.current.rotation.y += 0.01;
    sphereRef.current.rotation.z += 0.005;
  });

  return (
    <group>
      {/* Main Energy Sphere */}
      <Sphere ref={sphereRef} args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={intensity * 0.5} // Pulse light with progress
          roughness={0.1}
          metalness={0.8}
          distort={0.4} // Fluid-like distortion
          speed={2} // Fast movement
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Outer Pulse Ring (Light representation) */}
      <mesh scale={1.8}>
         <sphereGeometry args={[1, 32, 32]} />
         <meshBasicMaterial 
            color="#00ffff" 
            transparent 
            opacity={0.05 + (progress/100) * 0.1} 
            side={THREE.BackSide} 
            blending={THREE.AdditiveBlending}
         />
      </mesh>
      
      {/* Dynamic Light Source inside */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={intensity} 
        color="#00ffff" 
        distance={10} 
        decay={2}
      />
    </group>
  );
}
