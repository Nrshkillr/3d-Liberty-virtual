"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Billboard, Html } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { ProductModel } from "@/components/showroom/models";
import type { AssignedDisplay, DisplaySlot } from "@/components/showroom/showroom-config";
import type { Product } from "@/lib/types";
import { getBlobShadowTexture, getHaloTexture } from "@/components/showroom/textures";

const HIT_AREAS: Record<
  DisplaySlot["mount"],
  { size: [number, number, number]; centreY: number; halo: number; ring: number }
> = {
  shelf: { size: [0.92, 0.78, 0.8], centreY: 0.38, halo: 1.05, ring: 0 },
  table: { size: [1.35, 0.95, 1.15], centreY: 0.45, halo: 1.5, ring: 0.5 },
  floor: { size: [1.6, 1.5, 1.45], centreY: 0.72, halo: 1.9, ring: 0.66 },
  hero: { size: [1.8, 1.75, 1.65], centreY: 0.82, halo: 2.15, ring: 0.78 },
};

function Halo({
  position,
  size,
  selected,
}: {
  position: [number, number, number];
  size: number;
  selected: boolean;
}) {
  const texture = useMemo(() => getHaloTexture(), []);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!material.current) return;
    material.current.opacity = selected
      ? 0.72 + Math.sin(state.clock.elapsedTime * 3.2) * 0.14
      : 0.42;
  });

  return (
    <Billboard position={position}>
      <mesh>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          ref={material}
          map={texture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </Billboard>
  );
}

function FloorRing({ radius, selected }: { radius: number; selected: boolean }) {
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!material.current) return;
    material.current.opacity = selected
      ? 0.6 + Math.sin(state.clock.elapsedTime * 2.6) * 0.2
      : 0.28;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]}>
      <ringGeometry args={[radius * 0.92, radius, 48]} />
      <meshBasicMaterial
        ref={material}
        color={selected ? "#d9773f" : "#c49a5a"}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function DisplayItem({
  display,
  selected,
  hovered,
  onSelect,
  onHover,
}: {
  display: AssignedDisplay;
  selected: boolean;
  hovered: boolean;
  onSelect: (product: Product) => void;
  onHover: (id: string | null) => void;
}) {
  const { product, position, rotationY, scale, mount } = display;
  const area = HIT_AREAS[mount];
  const blob = useMemo(() => getBlobShadowTexture(), []);
  const active = selected || hovered;
  const [sx, sy, sz] = area.size;

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = "pointer";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta > 8) return;
    onSelect(product);
  };

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh
        position={[0, area.centreY, 0]}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(product.id);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHover(null);
        }}
        onClick={handleClick}
      >
        <boxGeometry args={[sx, sy, sz]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group scale={scale}>
        <ProductModel
          categorySlug={product.category?.slug}
          seed={product.id}
        />
      </group>

      {/* Soft contact shadow */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[area.halo, area.halo]} />
        <meshBasicMaterial
          map={blob}
          transparent
          depthWrite={false}
          opacity={0.9}
          toneMapped={false}
        />
      </mesh>

      {area.ring > 0 && (
        <FloorRing radius={area.ring} selected={selected} />
      )}

      {active && (
        <Halo
          position={[0, area.centreY + 0.1, 0]}
          size={area.halo * 1.6}
          selected={selected}
        />
      )}

      {hovered && !selected && (
        <Html
          position={[0, area.centreY + sy / 2 + 0.22, 0]}
          center
          distanceFactor={8}
          zIndexRange={[30, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div className="pointer-events-none flex select-none flex-col items-center gap-1">
            <div className="whitespace-nowrap rounded-full border border-white/15 bg-navy/92 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-cream shadow-lg">
              {product.name}
            </div>
            <div className="whitespace-nowrap rounded-full bg-ember px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow">
              Tap to view
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
