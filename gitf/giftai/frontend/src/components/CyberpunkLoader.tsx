import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

// Removed external font to prevent loading errors 

export function MatrixRain({ count = 50 }) {
  const drops = useMemo(() => {
    return new Array(count).fill(0).map((_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 20,
      z: (Math.random() - 0.5) * 10,
      speed: 0.1 + Math.random() * 0.2,
      len: 5 + Math.floor(Math.random() * 10),
      color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.45, 1, 0.5) // Cyan/Green
    }));
  }, [count]);

  return (
    <group>
      {drops.map((drop, i) => (
        <MatrixColumn key={i} {...drop} />
      ))}
    </group>
  );
}

function MatrixColumn({ x, y, z, speed, len, color }: any) {
  const group = useRef<THREE.Group>(null!);
  const [chars] = useState(() => 
    new Array(len).fill(0).map(() => 
      String.fromCharCode(0x30A0 + Math.random() * 96) // Katakana
    )
  );

  useFrame((state) => {
    if (group.current) {
      group.current.position.y -= speed;
      if (group.current.position.y < -10) {
        group.current.position.y = 10 + Math.random() * 5;
      }
    }
  });

  return (
    <group ref={group} position={[x, y, z]}>
      {chars.map((char, i) => (
        <Text
          key={i}
          position={[0, -i * 0.5, 0]}
          fontSize={0.4}
          color={i === 0 ? "#ffffff" : color} // Leading char is white
          // Default font is safer
          anchorX="center"
          anchorY="middle"
          fillOpacity={1 - i / len} // Fade out trail
        >
          {char}
        </Text>
      ))}
    </group>
  );
}

export default function CyberpunkLoader({ progress }: { progress: number }) {
  return (
    <group>
        <MatrixRain count={30} />
        {/* Converging Rings */}
        <mesh rotation-x={Math.PI / 2}>
           <torusGeometry args={[3, 0.02, 16, 100]} />
           <meshBasicMaterial color="#00ffff" transparent opacity={0.5} />
        </mesh>
    </group>
  );
}
