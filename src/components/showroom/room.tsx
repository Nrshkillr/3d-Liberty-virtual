"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { HangingSign, PendantLights, Plant, FramedPoster } from "@/components/showroom/furniture";
import { ROOM } from "@/components/showroom/showroom-config";
import {
  createSignTexture,
  getFloorTexture,
  getRugTexture,
} from "@/components/showroom/textures";
import type { Quality } from "@/components/showroom/hooks";

const CREAM_WALL = "#f7efe2";
const WAINSCOT = "#e8d8c2";
const NAVY = "#102a43";
const BRASS = "#c49a5a";

function useSign(title: string, subtitle?: string) {
  return useMemo(
    () =>
      createSignTexture({
        title,
        subtitle,
        variant: "navy",
        width: 1400,
        height: 300,
        accent: BRASS,
      }),
    [title, subtitle],
  );
}

export function RoomShell() {
  const floorMap = useMemo(() => getFloorTexture(), []);
  const rugMap = useMemo(() => getRugTexture(), []);
  const entranceSign = useSign(
    "LIBERTY ENTERPRISES",
    "Virtual showroom · Sowcarpet, Chennai",
  );

  const halfWidth = ROOM.halfWidth;
  const halfDepth = ROOM.halfDepth;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial
          map={floorMap}
          roughness={0.62}
          metalness={0.03}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* Centre rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 1.4]}>
        <planeGeometry args={[6.2, 7.6]} />
        <meshStandardMaterial map={rugMap} roughness={0.95} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#f2e8d9" roughness={0.92} />
      </mesh>

      {/* Ceiling beams */}
      {[-7.5, -2.5, 2.5, 7.5].map((z) => (
        <mesh key={z} position={[0, ROOM.height - 0.12, z]}>
          <boxGeometry args={[ROOM.width, 0.24, 0.26]} />
          <meshStandardMaterial color="#e7d6bf" roughness={0.75} />
        </mesh>
      ))}

      {/* Walls */}
      <mesh position={[0, ROOM.height / 2, -halfDepth - 0.15]}>
        <boxGeometry args={[ROOM.width + 0.6, ROOM.height, 0.3]} />
        <meshStandardMaterial color={CREAM_WALL} roughness={0.95} />
      </mesh>
      <mesh position={[-halfWidth - 0.15, ROOM.height / 2, 0]}>
        <boxGeometry args={[0.3, ROOM.height, ROOM.depth + 0.3]} />
        <meshStandardMaterial color={CREAM_WALL} roughness={0.95} />
      </mesh>
      <mesh position={[halfWidth + 0.15, ROOM.height / 2, 0]}>
        <boxGeometry args={[0.3, ROOM.height, ROOM.depth + 0.3]} />
        <meshStandardMaterial color={CREAM_WALL} roughness={0.95} />
      </mesh>

      {/* Front wall with entrance opening */}
      {[-7.75, 7.75].map((x) => (
        <mesh key={x} position={[x, ROOM.height / 2, halfDepth + 0.15]}>
          <boxGeometry args={[10.5, ROOM.height, 0.3]} />
          <meshStandardMaterial color={CREAM_WALL} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 3.65, halfDepth + 0.15]}>
        <boxGeometry args={[5, 1.5, 0.3]} />
        <meshStandardMaterial color={CREAM_WALL} roughness={0.95} />
      </mesh>

      {/* Wainscot panelling */}
      {[
        { position: [0, 0.52, -halfDepth + 0.02] as const, size: [ROOM.width, 1.04, 0.04] as const },
        { position: [-halfWidth + 0.02, 0.52, 0] as const, size: [0.04, 1.04, ROOM.depth] as const },
        { position: [halfWidth - 0.02, 0.52, 0] as const, size: [0.04, 1.04, ROOM.depth] as const },
      ].map((panel, index) => (
        <mesh key={index} position={[panel.position[0], panel.position[1], panel.position[2]]}>
          <boxGeometry args={[panel.size[0], panel.size[1], panel.size[2]]} />
          <meshStandardMaterial color={WAINSCOT} roughness={0.85} />
        </mesh>
      ))}

      {/* Wainscot rails */}
      {[
        { position: [0, 1.06, -halfDepth + 0.03] as const, size: [ROOM.width, 0.035, 0.05] as const },
        { position: [-halfWidth + 0.03, 1.06, 0] as const, size: [0.05, 0.035, ROOM.depth] as const },
        { position: [halfWidth - 0.03, 1.06, 0] as const, size: [0.05, 0.035, ROOM.depth] as const },
      ].map((rail, index) => (
        <mesh key={index} position={[rail.position[0], rail.position[1], rail.position[2]]}>
          <boxGeometry args={[rail.size[0], rail.size[1], rail.size[2]]} />
          <meshStandardMaterial color={NAVY} roughness={0.5} />
        </mesh>
      ))}

      {/* Baseboards */}
      {[
        { position: [0, 0.07, -halfDepth + 0.03] as const, size: [ROOM.width, 0.14, 0.06] as const },
        { position: [-halfWidth + 0.03, 0.07, 0] as const, size: [0.06, 0.14, ROOM.depth] as const },
        { position: [halfWidth - 0.03, 0.07, 0] as const, size: [0.06, 0.14, ROOM.depth] as const },
        { position: [-7.75, 0.07, halfDepth - 0.03] as const, size: [10.5, 0.14, 0.06] as const },
        { position: [7.75, 0.07, halfDepth - 0.03] as const, size: [10.5, 0.14, 0.06] as const },
      ].map((board, index) => (
        <mesh key={index} position={[board.position[0], board.position[1], board.position[2]]}>
          <boxGeometry args={[board.size[0], board.size[1], board.size[2]]} />
          <meshStandardMaterial color="#8a6244" roughness={0.65} />
        </mesh>
      ))}

      {/* Entrance door frame */}
      {[-2.5, 2.5].map((x) => (
        <mesh key={x} position={[x, 1.45, halfDepth - 0.02]}>
          <boxGeometry args={[0.18, 2.9, 0.24]} />
          <meshStandardMaterial color="#7c5a3c" roughness={0.55} />
        </mesh>
      ))}
      <mesh position={[0, 2.9, halfDepth - 0.02]}>
        <boxGeometry args={[5.1, 0.18, 0.26]} />
        <meshStandardMaterial color="#7c5a3c" roughness={0.55} />
      </mesh>

      {/* Glass doors */}
      {[-1.25, 1.25].map((x) => (
        <group key={x} position={[x, 1.42, halfDepth - 0.06]}>
          <mesh>
            <boxGeometry args={[2.3, 2.72, 0.035]} />
            <meshStandardMaterial
              color="#d7e8ea"
              roughness={0.08}
              metalness={0.15}
              transparent
              opacity={0.18}
            />
          </mesh>
          <mesh position={[0, 1.32, 0]}>
            <boxGeometry args={[2.34, 0.07, 0.07]} />
            <meshStandardMaterial color={BRASS} metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[0, -1.32, 0]}>
            <boxGeometry args={[2.34, 0.07, 0.07]} />
            <meshStandardMaterial color={BRASS} metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[x > 0 ? -1.1 : 1.1, 0, 0]}>
            <boxGeometry args={[0.06, 2.72, 0.07]} />
            <meshStandardMaterial color={BRASS} metalness={0.55} roughness={0.35} />
          </mesh>
          <mesh position={[x > 0 ? -0.95 : 0.95, 0, 0.06]}>
            <boxGeometry args={[0.035, 0.62, 0.05]} />
            <meshStandardMaterial color={BRASS} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Entrance sign above the doors, facing into the room */}
      <mesh position={[0, 3.55, halfDepth - 0.32]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[5.4, 1.15]} />
        <meshStandardMaterial map={entranceSign} roughness={0.6} />
      </mesh>

      {/* Door mat */}
      <mesh position={[0, 0.014, 8.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.7, 1.45]} />
        <meshStandardMaterial color={NAVY} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.016, 8.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 1.2]} />
        <meshStandardMaterial color="#1d3f5e" roughness={0.95} />
      </mesh>

      {/* Entrance side planters */}
      <Plant position={[-12.2, 0, 8.7]} scale={1.15} />
      <Plant position={[12.05, 0, 3.75]} scale={1.05} />

      {/* Wall art near the entrance */}
      <FramedPoster
        position={[halfWidth - 0.045, 2.2, 5.9]}
        rotationY={-Math.PI / 2}
        title="A little wonder in every aisle."
        subtitle="Liberty Enterprises · Chennai"
        variant="cream"
        width={1.25}
        height={1.68}
      />
      <FramedPoster
        position={[-halfWidth + 0.045, 2.2, 5.9]}
        rotationY={Math.PI / 2}
        title="Wholesale, the warm way."
        subtitle="Baby & kids collection"
        variant="cream"
        width={1.25}
        height={1.68}
      />

      {/* Section signage */}
      <HangingSign
        position={[-8.9, 3.05, -1.65]}
        rotationY={Math.PI / 2}
        width={3.6}
        title="BABY WALKERS"
        subtitle="Accessories & everyday essentials"
        variant="navy"
      />
      <HangingSign
        position={[8.9, 3.05, 3.4]}
        rotationY={-Math.PI / 2}
        width={3.7}
        title="RIDE-ONS & BATTERY"
        subtitle="Cars · Bikes · Scooters"
        variant="navy"
      />
      <HangingSign
        position={[0, 3.28, -0.55]}
        rotationY={0}
        width={4.1}
        title="SWINGS & CRADLES"
        subtitle="Jhulas · Nursery comfort"
        variant="cream"
      />
      <HangingSign
        position={[0, 3.28, -8.1]}
        rotationY={0}
        width={4.2}
        title="SOFT TOYS & GIFTS"
        subtitle="Tents · Gift sets · Kids favourites"
        variant="cream"
      />

      {/* Counter pendants */}
      <PendantLights />

      {/* Ceiling light panels */}
      {[-8, 0, 8].flatMap((x) =>
        [-6.4, 0, 6.4].map((z) => (
          <group key={`${x}-${z}`} position={[x, ROOM.height - 0.05, z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.9, 0.55]} />
              <meshStandardMaterial
                color="#fff4de"
                emissive="#ffe6bb"
                emissiveIntensity={1.7}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[3.05, 0.68]} />
              <meshStandardMaterial color="#d9c9ad" roughness={0.6} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

export function RoomLights({ quality }: { quality: Quality }) {
  return (
    <>
      <ambientLight intensity={0.72} color="#fff3e3" />
      <hemisphereLight args={["#fff8ec", "#6f533a", 0.85]} />

      <directionalLight
        position={[6.5, 4.15, 6.5]}
        intensity={quality === "high" ? 1.5 : 1.15}
        color="#ffe9cd"
        castShadow={quality === "high"}
        shadow-mapSize-width={quality === "high" ? 2048 : 1024}
        shadow-mapSize-height={quality === "high" ? 2048 : 1024}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-bias={-0.0004}
        shadow-normalBias={0.035}
      />

      <directionalLight
        position={[-8, 3.6, -5]}
        intensity={0.55}
        color="#dfeafb"
      />

      <pointLight
        position={[0, 3.3, 5.4]}
        intensity={9}
        distance={13}
        decay={1.7}
        color="#ffdcae"
      />
      <pointLight
        position={[-9, 3.1, -2]}
        intensity={7}
        distance={11}
        decay={1.8}
        color="#ffe2bd"
      />
      <pointLight
        position={[9, 3.1, 2]}
        intensity={7}
        distance={11}
        decay={1.8}
        color="#ffe2bd"
      />
      <pointLight
        position={[0, 3.0, -7]}
        intensity={6}
        distance={10}
        decay={1.8}
        color="#ffe6c6"
      />
    </>
  );
}

/**
 * One static shadow pass. The showroom geometry never moves, so rendering the
 * shadow map once gives furniture shadows for free on the very next frames.
 */
export function BakedShadows({ quality }: { quality: Quality }) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (quality !== "high") {
      gl.shadowMap.autoUpdate = false;
      gl.shadowMap.needsUpdate = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (!mesh.isMesh) return;
        if ((mesh.material as THREE.Material | undefined)?.transparent) return;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });

      gl.shadowMap.autoUpdate = false;
      gl.shadowMap.needsUpdate = true;
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [gl, scene, quality]);

  return null;
}
