import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Grid } from "@react-three/drei";
import * as THREE from "three";

function ParallaxScene() {
  const starsRef = useRef<THREE.Group>(null!);
  const gridRef = useRef<THREE.Group>(null!);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame((state) => {
    // Parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouse.x * 2, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouse.y * 2, 0.05);
    state.camera.lookAt(0, 0, 0);

    // Subtle drift
    if(starsRef.current) starsRef.current.rotation.y += 0.0002;
  });

  return (
    <group>
       <group ref={starsRef}>
         <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
       </group>
       
       <group ref={gridRef} position={[0, -10, 0]}>
         <Grid infiniteGrid cellSize={1} sectionSize={5} fadeDistance={30} sectionColor="#00ffff" cellColor="#111111" />
       </group>
       
       <fog attach="fog" args={['#02020a', 10, 40]} />
    </group>
  );
}

export default function DynamicBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
       <Canvas camera={{ position: [0, 5, 10], fov: 45 }} gl={{ antialias: false }}>
          <ParallaxScene />
       </Canvas>
    </div>
  );
}
