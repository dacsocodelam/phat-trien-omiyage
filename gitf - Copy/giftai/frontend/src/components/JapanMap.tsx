import React, { useEffect, useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Edges, Text } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping } from "@react-three/postprocessing";
import * as topojson from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
// @ts-ignore
import { SVGLoader } from "three-stdlib";

const TOPOJSON_URL = "https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson";

// ============================================
// REGION MAPPING
// ============================================
const PREFECTURE_REGIONS: Record<string, string> = {
  "Hokkaido": "Hokkaido",
  "Aomori": "Tohoku", "Iwate": "Tohoku", "Miyagi": "Tohoku", 
  "Akita": "Tohoku", "Yamagata": "Tohoku", "Fukushima": "Tohoku",
  "Ibaraki": "Kanto", "Tochigi": "Kanto", "Gunma": "Kanto", 
  "Saitama": "Kanto", "Chiba": "Kanto", "Tokyo": "Kanto", "Kanagawa": "Kanto",
  "Niigata": "Chubu", "Toyama": "Chubu", "Ishikawa": "Chubu", "Fukui": "Chubu",
  "Yamanashi": "Chubu", "Nagano": "Chubu", "Gifu": "Chubu", 
  "Shizuoka": "Chubu", "Aichi": "Chubu",
  "Mie": "Kansai", "Shiga": "Kansai", "Kyoto": "Kansai", "Osaka": "Kansai",
  "Hyogo": "Kansai", "Nara": "Kansai", "Wakayama": "Kansai",
  "Tottori": "Chugoku", "Shimane": "Chugoku", "Okayama": "Chugoku",
  "Hiroshima": "Chugoku", "Yamaguchi": "Chugoku",
  "Tokushima": "Shikoku", "Kagawa": "Shikoku", "Ehime": "Shikoku", "Kochi": "Shikoku",
  "Fukuoka": "Kyushu", "Saga": "Kyushu", "Nagasaki": "Kyushu", "Kumamoto": "Kyushu",
  "Oita": "Kyushu", "Miyazaki": "Kyushu", "Kagoshima": "Kyushu", "Okinawa": "Kyushu"
};

const REGION_BORDER_PREFECTURES = new Set([
  "Aomori", "Fukushima", "Niigata", "Gunma", "Nagano", "Mie", "Fukui",
  "Hyogo", "Tottori", "Yamaguchi", "Tokushima", "Ehime", "Fukuoka"
]);

// ============================================
// TYPES
// ============================================
interface JapanMapProps {
  onSelectPrefecture: (id: string, name: string) => void;
  selectedId: string | null;
}

// ============================================
// PREFECTURE MESH
// ============================================
const PrefectureMesh = ({ 
  feature, 
  pathGenerator, 
  isSelected, 
  isDimmed,
  onClick 
}: {
  feature: any;
  pathGenerator: any;
  isSelected: boolean;
  isDimmed: boolean;
  onClick: (feature: any) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  const prefectureName = feature.properties.nam || feature.properties.name || "";
  const isRegionBorder = REGION_BORDER_PREFECTURES.has(prefectureName);
  const region = PREFECTURE_REGIONS[prefectureName] || "Japan";

  // GEOMETRY - Memoized
  const shapes = useMemo(() => {
    const svgPathStr = pathGenerator(feature);
    if (!svgPathStr) return [];
    const loader = new SVGLoader();
    const svgData = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${svgPathStr}" /></svg>`);
    return svgData.paths.flatMap((p: any) => p.toShapes(true));
  }, [feature, pathGenerator]);

  // CENTROID for label
  const centroid = useMemo(() => {
    try { return pathGenerator.centroid(feature); } 
    catch { return [0, 0]; }
  }, [feature, pathGenerator]);

  // DEPTH ANIMATION
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetDepth = isSelected ? 8 : (hovered ? 4 : 2);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetDepth, delta * 10);
  });

  // Colors
  const bodyColor = "#0a0a0c";
  const edgeColor = isSelected || hovered ? "#FFFFFF" : (isRegionBorder ? "#44FFFF" : "#00CCCC");

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(feature); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
        scale={[1, -1, 1]}
      >
        <extrudeGeometry args={[shapes, { depth: 1, bevelEnabled: false }]} />
        <meshStandardMaterial 
          color={bodyColor}
          emissive={isSelected ? "#004466" : (hovered ? "#002233" : "#001122")}
          emissiveIntensity={isSelected ? 2 : (hovered ? 1.5 : 0.5)}
          roughness={0.5}
          metalness={0.5}
          transparent
          opacity={isDimmed ? 0.15 : 0.9}
        />
        <Edges color={edgeColor} threshold={15} />
      </mesh>

      {/* LABEL - Always show prefecture name */}
      <Text
        position={[centroid[0], -centroid[1], isSelected ? 10 : 3]}
        fontSize={isSelected ? 6 : 3}
        color={isSelected || hovered ? "#FFFFFF" : "#66AAAA"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.2}
        outlineColor="#000000"
        visible={!isDimmed}
      >
        {feature.properties.nam_ja || prefectureName}
      </Text>
      
      {/* Region name on select */}
      {isSelected && (
        <Text
          position={[centroid[0], -centroid[1] - 10, 10]}
          fontSize={3}
          color="#00FFFF"
          anchorX="center"
          anchorY="middle"
        >
          {region.toUpperCase()}
        </Text>
      )}
    </group>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function JapanMap({ onSelectPrefecture, selectedId }: JapanMapProps) {
  const [geoData, setGeoData] = useState<any[]>([]);

  const projection = useMemo(() => geoMercator().center([137, 38]).scale(1600).translate([0, 0]), []);
  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  useEffect(() => {
    fetch(TOPOJSON_URL)
      .then(res => res.json())
      .then(topology => {
        const key = Object.keys(topology.objects)[0];
        const features = (topojson as any).feature(topology, topology.objects[key]).features;
        console.log(`Loaded ${features.length} prefectures`); // Debug log
        setGeoData(features);
      })
      .catch(err => console.error("Map Load Error:", err));
  }, []);

  const handleSelect = (feature: any) => {
    const name = feature.properties.nam || feature.properties.name || feature.properties.nam_ja || "Unknown";
    onSelectPrefecture(name, name);
  };

  return (
    <>
      {/* LIGHTING */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 100, 50]} intensity={1} />
      <pointLight position={[-100, 50, 50]} intensity={0.5} color="#00ffff" />
      
      {/* CONTROLS */}
      <OrbitControls 
        makeDefault
        minDistance={100}
        maxDistance={800}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.5}
        enableRotate={true}
        enablePan={true}
        enableZoom={true}
        rotateSpeed={0.5}
      />

      {/* GRID */}
      <gridHelper args={[2000, 40, 0x003333, 0x001111]} position={[0, -10, 0]} />
      
      {/* MAP */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {geoData.map((feature, i) => {
          const props = feature.properties;
          const name = props.nam || props.name || props.NAME_1 || props.nam_ja || `P${i}`;
          const isSelected = selectedId === name;
          const isDimmed = !!selectedId && !isSelected;
          
          return (
            <PrefectureMesh 
              key={i} 
              feature={feature} 
              pathGenerator={pathGenerator} 
              isSelected={isSelected}
              isDimmed={isDimmed}
              onClick={handleSelect}
            />
          );
        })}
      </group>

      {/* BLOOM */}
      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.3}
          mipmapBlur 
          intensity={1.5}
          radius={0.4}
        />
        <ToneMapping />
      </EffectComposer>
    </>
  );
}