"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { CameraControls } from "@/components/showroom/CameraControls";
import { DisplayItem } from "@/components/showroom/DisplayItem";
import {
  BakedShadows,
  RoomLights,
  RoomShell,
} from "@/components/showroom/room";
import {
  Bench,
  Counter,
  CubbyWall,
  DisplayTable,
  Gondola,
  Pedestal,
  WallShelf,
} from "@/components/showroom/furniture";
import {
  assignProducts,
  SPAWN,
  type AssignedDisplay,
} from "@/components/showroom/showroom-config";
import { EYE_HEIGHT, type PlayerState } from "@/components/showroom/player";
import type { Quality } from "@/components/showroom/hooks";
import type { Product } from "@/lib/types";

const TEXTILES = [
  ["#f3e3cd", "#e6cdb2", "#d9b795"],
  ["#dfe6d9", "#c9d4c1", "#b3c2ab"],
  ["#f4ded7", "#e6c6bd", "#d6ada3"],
  ["#e6e9f0", "#d3d9e4", "#bcc5d4"],
];

function FoldedStack({
  position,
  rotationY = 0,
  colours = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
  colours?: number;
}) {
  const palette = TEXTILES[colours % TEXTILES.length];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {palette.map((colour, index) => (
        <RoundedBox
          key={colour}
          args={[0.52 - index * 0.02, 0.075, 0.34 - index * 0.015]}
          radius={0.025}
          position={[0, 0.04 + index * 0.078, 0]}
          rotation={[0, index * 0.08 - 0.05, 0]}
        >
          <meshStandardMaterial color={colour} roughness={0.95} />
        </RoundedBox>
      ))}
    </group>
  );
}

function WovenBasket({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.21, 0.17, 0.32, 16]} />
        <meshStandardMaterial color="#c9a678" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.21, 0.018, 8, 24]} />
        <meshStandardMaterial color="#a8825a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#d8b98f" roughness={0.95} />
      </mesh>
    </group>
  );
}

function FurnitureLayout() {
  return (
    <group>
      {/* Left wall shelving */}
      <WallShelf
        position={[-12.9, 0, -2.3]}
        rotationY={Math.PI / 2}
        length={6.4}
        height={2.2}
        depth={0.66}
      />

      {/* Right wall shelving */}
      <WallShelf
        position={[12.6, 0, -0.2]}
        rotationY={-Math.PI / 2}
        length={4.6}
        height={2.2}
        depth={0.66}
      />

      {/* Left gondola */}
      <Gondola
        position={[-8.9, 0, -1.65]}
        rotationY={Math.PI / 2}
        length={4.7}
        height={2.1}
        depth={1.45}
      />

      {/* Left display table */}
      <DisplayTable
        position={[-8.85, 0, 4.4]}
        rotationY={0.35}
        width={3}
        depth={1.5}
      />

      {/* Right display plinths */}
      <Pedestal position={[8.4, 0, 3.1]} height={0.42} width={1.9} depth={1.7} />
      <Pedestal position={[10.15, 0, 0.55]} height={0.42} width={1.9} depth={1.7} />
      <Pedestal position={[8.4, 0, 6.25]} height={0.42} width={1.9} depth={1.7} />

      {/* Centre cradle plinth */}
      <Pedestal position={[2.05, 0, -1.0]} height={0.46} width={1.4} depth={1.2} />

      {/* Centre table */}
      <DisplayTable
        position={[2.7, 0, 2.45]}
        rotationY={-0.55}
        width={1.5}
        depth={1.3}
      />

      {/* Featured hero plinth */}
      <Pedestal position={[3.35, 0, 6.0]} height={0.98} width={2.1} round />
      <pointLight
        position={[3.35, 2.35, 6.0]}
        intensity={6.5}
        distance={5.5}
        decay={1.7}
        color="#ffe4b8"
      />

      {/* Back cubby wall */}
      <CubbyWall />

      {/* Back display table for gift sets */}
      <DisplayTable
        position={[7.1, 0, -7.15]}
        rotationY={0.1}
        width={2.6}
        depth={1.4}
      />

      {/* Enquiries counter, bench and planters are part of the room shell */}

      <Counter />
      <Bench />

      {/* Decorative folded textiles on otherwise empty shelf space */}
      <FoldedStack position={[-12.72, 0.83, -5.02]} rotationY={Math.PI / 2} colours={0} />
      <FoldedStack position={[-12.72, 1.55, -5.02]} rotationY={Math.PI / 2} colours={1} />
      <FoldedStack position={[-12.72, 0.83, 0.42]} rotationY={Math.PI / 2} colours={2} />
      <FoldedStack position={[-12.72, 1.55, 0.42]} rotationY={Math.PI / 2} colours={3} />
      <FoldedStack position={[12.72, 0.83, 1.72]} rotationY={-Math.PI / 2} colours={1} />
      <FoldedStack position={[12.72, 1.55, 1.72]} rotationY={-Math.PI / 2} colours={0} />
      <FoldedStack position={[12.72, 0.83, -2.32]} rotationY={-Math.PI / 2} colours={2} />

      {/* Woven baskets tucked into the cubby wall */}
      <WovenBasket position={[-4.05, 0.1, -9.35]} scale={1.15} />
      <WovenBasket position={[1.75, 0.79, -9.35]} scale={1} />
      <WovenBasket position={[3.35, 0.79, -9.35]} scale={1.05} />
      <WovenBasket position={[-3.2, 1.55, -9.35]} scale={0.9} />
    </group>
  );
}

export interface ShowroomSceneProps {
  products: Product[];
  heroProduct: Product | null;
  player: PlayerState;
  quality: Quality;
  selectedId: string | null;
  hoveredId: string | null;
  controlsEnabled: boolean;
  onSelect: (product: Product) => void;
  onHover: (id: string | null) => void;
  onReady?: () => void;
}

export default function ShowroomScene({
  products,
  heroProduct,
  player,
  quality,
  selectedId,
  hoveredId,
  controlsEnabled,
  onSelect,
  onHover,
  onReady,
}: ShowroomSceneProps) {
  const displays = useMemo<AssignedDisplay[]>(
    () => assignProducts(products, heroProduct),
    [products, heroProduct],
  );

  return (
    <Canvas
      shadows={quality === "high" ? "soft" : false}
      dpr={quality === "high" ? [1, 1.8] : [1, 1]}
      performance={{ min: 0.55 }}
      camera={{
        fov: 68,
        near: 0.06,
        far: 80,
        position: [SPAWN.x, EYE_HEIGHT, SPAWN.z],
      }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
        onReady?.();
      }}
    >
      <color attach="background" args={["#e7d9c4"]} />
      <fog attach="fog" args={["#eadfce", 24, 54]} />

      <CameraControls player={player} enabled={controlsEnabled} />
      <RoomLights quality={quality} />
      <BakedShadows quality={quality} />
      <RoomShell />
      <FurnitureLayout />

      {displays.map((display) => (
        <DisplayItem
          key={display.id}
          display={display}
          selected={display.product.id === selectedId}
          hovered={display.product.id === hoveredId}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
