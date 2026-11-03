"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import {
  createSignTexture,
  createPosterTexture,
  getCounterTexture,
  getWoodTexture,
} from "@/components/showroom/textures";

const BRASS = "#c49a5a";
const CREAM = "#f7f0e4";
const NAVY = "#102a43";

function WoodMaterial({ color = "#ffffff" }: { color?: string }) {
  const map = getWoodTexture();
  return (
    <meshStandardMaterial
      map={map}
      color={color}
      roughness={0.6}
      metalness={0.02}
      envMapIntensity={0.35}
    />
  );
}

export function Pedestal({
  position = [0, 0, 0],
  rotationY = 0,
  height,
  width = 1.55,
  depth = 1.2,
  round = false,
}: {
  position?: [number, number, number];
  rotationY?: number;
  height: number;
  width?: number;
  depth?: number;
  round?: boolean;
}) {
  if (height <= 0.0001) return null;

  if (round) {
    return (
      <group position={position} rotation={[0, rotationY, 0]}>
        <mesh position={[0, height / 2, 0]}>
          <cylinderGeometry args={[width / 2, width / 2, height, 32]} />
          <WoodMaterial />
        </mesh>
        <mesh position={[0, height - 0.035, 0]}>
          <cylinderGeometry args={[width / 2 + 0.02, width / 2 + 0.02, 0.07, 32]} />
          <meshStandardMaterial color={CREAM} roughness={0.35} />
        </mesh>
        <mesh position={[0, height - 0.075, 0]}>
          <cylinderGeometry args={[width / 2 + 0.005, width / 2 + 0.005, 0.02, 32]} />
          <meshStandardMaterial color={BRASS} metalness={0.55} roughness={0.35} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <RoundedBox args={[width, height, depth]} radius={0.035} position={[0, height / 2, 0]}>
        <WoodMaterial color="#e8d6bf" />
      </RoundedBox>
      <mesh position={[0, height - 0.025, 0]}>
        <boxGeometry args={[width + 0.05, 0.05, depth + 0.05]} />
        <meshStandardMaterial color={CREAM} roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[width + 0.03, 0.04, depth + 0.03]} />
        <meshStandardMaterial color={NAVY} roughness={0.45} />
      </mesh>
      <mesh position={[0, height * 0.62, depth / 2 + 0.005]}>
        <boxGeometry args={[width * 0.88, 0.02, 0.005]} />
        <meshStandardMaterial color={BRASS} metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function WallShelf({
  position,
  rotationY,
  length = 6.4,
  height = 2.2,
  depth = 0.55,
}: {
  position: [number, number, number];
  rotationY: number;
  length?: number;
  height?: number;
  depth?: number;
}) {
  const levels = [0.8, 1.52];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.06, -depth / 2 + 0.16]}>
        <boxGeometry args={[length, 0.12, depth - 0.1]} />
        <meshStandardMaterial color="#ead9c2" roughness={0.6} />
      </mesh>

      <mesh position={[0, height / 2, -depth / 2 + 0.04]}>
        <boxGeometry args={[length + 0.08, height, 0.08]} />
        <meshStandardMaterial color="#e6d2b8" roughness={0.7} />
      </mesh>

      {[-length / 2, length / 2].map((x) => (
        <mesh key={x} position={[x, height / 2, 0]}>
          <boxGeometry args={[0.07, height, depth]} />
          <WoodMaterial color="#f0dfc7" />
        </mesh>
      ))}

      {levels.map((level) => (
        <group key={level}>
          <mesh position={[0, level, 0.01]}>
            <boxGeometry args={[length, 0.05, depth]} />
            <WoodMaterial color="#f6e9d6" />
          </mesh>
          <mesh position={[0, level + 0.028, depth / 2 - 0.012]}>
            <boxGeometry args={[length - 0.16, 0.012, 0.018]} />
            <meshStandardMaterial color="#ffd8a3" emissive="#ffca85" emissiveIntensity={2.4} />
          </mesh>
          <mesh position={[0, level + 0.028, depth / 2 - 0.055]}>
            <boxGeometry args={[length - 0.16, 0.022, 0.02]} />
            <meshStandardMaterial color={BRASS} metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, height + 0.035, 0]}>
        <boxGeometry args={[length + 0.12, 0.09, depth + 0.04]} />
        <WoodMaterial color="#e9d4b9" />
      </mesh>
      <mesh position={[0, height + 0.008, depth / 2 - 0.015]}>
        <boxGeometry args={[length, 0.014, 0.02]} />
        <meshStandardMaterial color="#ffd8a3" emissive="#ffca85" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

export function Gondola({
  position,
  rotationY,
  length = 4.7,
  height = 2.1,
  depth = 1.45,
}: {
  position: [number, number, number];
  rotationY: number;
  length?: number;
  height?: number;
  depth?: number;
}) {
  const levels = [0.56, 1.1, 1.64];

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[length, 0.16, depth]} />
        <meshStandardMaterial color="#e5d1b7" roughness={0.6} />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[length, height, 0.09]} />
        <meshStandardMaterial color="#f1e4d1" roughness={0.65} />
      </mesh>

      {[-length / 2, length / 2].map((x) => (
        <mesh key={x} position={[x, height / 2, 0]}>
          <boxGeometry args={[0.08, height, depth]} />
          <WoodMaterial color="#f1dfc7" />
        </mesh>
      ))}

      {levels.map((level) => (
        <group key={level}>
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh position={[0, level, (side * depth) / 4]}>
                <boxGeometry args={[length, 0.05, depth / 2 - 0.02]} />
                <WoodMaterial color="#f7ebd9" />
              </mesh>
              <mesh
                position={[0, level + 0.026, (side * (depth / 2 - 0.02))]}
              >
                <boxGeometry args={[length - 0.2, 0.014, 0.018]} />
                <meshStandardMaterial
                  color="#ffd8a3"
                  emissive="#ffca85"
                  emissiveIntensity={2.2}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      <mesh position={[0, height + 0.03, 0]}>
        <boxGeometry args={[length + 0.1, 0.08, depth]} />
        <WoodMaterial color="#e7d2b6" />
      </mesh>
      <mesh position={[0, height + 0.07, 0]}>
        <boxGeometry args={[length + 0.06, 0.025, depth - 0.1]} />
        <meshStandardMaterial color={BRASS} metalness={0.45} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function DisplayTable({
  position,
  rotationY = 0,
  width = 3,
  depth = 1.5,
}: {
  position: [number, number, number];
  rotationY?: number;
  width?: number;
  depth?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[width, 0.06, depth]} />
        <WoodMaterial color="#f2e1ca" />
      </mesh>
      <mesh position={[0, 0.865, 0]}>
        <boxGeometry args={[width + 0.04, 0.03, depth + 0.04]} />
        <meshStandardMaterial color={BRASS} metalness={0.45} roughness={0.4} />
      </mesh>

      {[
        [-width / 2 + 0.16, -depth / 2 + 0.16],
        [width / 2 - 0.16, -depth / 2 + 0.16],
        [-width / 2 + 0.16, depth / 2 - 0.16],
        [width / 2 - 0.16, depth / 2 - 0.16],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.44, z]}>
          <cylinderGeometry args={[0.035, 0.03, 0.88, 8]} />
          <meshStandardMaterial color={BRASS} metalness={0.5} roughness={0.35} />
        </mesh>
      ))}

      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[width - 0.3, 0.035, depth - 0.3]} />
        <WoodMaterial color="#d9be9c" />
      </mesh>
    </group>
  );
}

export function CubbyWall() {
  const width = 8.6;
  const height = 2.45;
  const depth = 0.42;
  const columns = [-4.3, -2.15, 0, 2.15, 4.3];
  const rows = [0.08, 0.76, 1.52, 2.34];

  return (
    <group position={[0, 0, -9.72]}>
      <mesh position={[0, height / 2, -depth / 2 + 0.03]}>
        <boxGeometry args={[width, height, 0.07]} />
        <meshStandardMaterial color="#efe2ce" roughness={0.7} />
      </mesh>

      {columns.map((x) => (
        <mesh key={x} position={[x, height / 2, 0]}>
          <boxGeometry args={[0.07, height, depth]} />
          <WoodMaterial color="#f5e7d3" />
        </mesh>
      ))}

      {rows.map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[width, y === 0.08 ? 0.16 : 0.055, depth]} />
          <WoodMaterial color={y === 0.08 ? "#dbc1a0" : "#f7ebd9"} />
        </mesh>
      ))}

      {[-3.22, -1.07, 1.07, 3.22].map((x) => (
        <mesh key={x} position={[x, 2.3, -0.05]}>
          <boxGeometry args={[1.8, 0.018, 0.02]} />
          <meshStandardMaterial
            color="#ffd8a3"
            emissive="#ffca85"
            emissiveIntensity={1.6}
          />
        </mesh>
      ))}

      <mesh position={[0, 0.03, 0.1]}>
        <boxGeometry args={[width + 0.12, 0.06, depth + 0.2]} />
        <meshStandardMaterial color={NAVY} roughness={0.5} />
      </mesh>
    </group>
  );
}

export function Counter() {
  const map = getCounterTexture();
  const sign = useMemo(
    () =>
      createSignTexture({
        title: "WHOLESALE ENQUIRIES",
        subtitle: "Liberty Enterprises · Sowcarpet",
        variant: "navy",
        width: 1024,
        height: 210,
        accent: "#c49a5a",
      }),
    [],
  );

  return (
    <group position={[-8.9, 0, 7.25]}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[3.4, 1.02, 1.15]} />
        <meshStandardMaterial map={map} color="#ffffff" roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.035, 0]}>
        <boxGeometry args={[3.46, 0.07, 1.21]} />
        <meshStandardMaterial color="#0b1d2d" roughness={0.45} />
      </mesh>

      <RoundedBox args={[3.62, 0.09, 1.34]} radius={0.025} position={[0, 1.11, 0]}>
        <meshStandardMaterial color="#f4ead9" roughness={0.25} metalness={0.05} />
      </RoundedBox>
      <mesh position={[0, 1.16, 0]}>
        <boxGeometry args={[3.64, 0.015, 1.36]} />
        <meshStandardMaterial color={BRASS} metalness={0.55} roughness={0.3} />
      </mesh>

      <mesh position={[0, 0.68, 0.582]}>
        <planeGeometry args={[2.6, 0.53]} />
        <meshBasicMaterial map={sign} transparent />
      </mesh>

      <group position={[-0.85, 1.16, -0.1]}>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[0.34, 0.02, 0.22]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.16, -0.02]} rotation={[-0.16, 0, 0]}>
          <boxGeometry args={[0.56, 0.34, 0.025]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.16, 0.002]} rotation={[-0.16, 0, 0]}>
          <planeGeometry args={[0.5, 0.29]} />
          <meshStandardMaterial color="#123c55" emissive="#1d5a78" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0, 0.16, 0.006]} rotation={[-0.16, 0, 0]}>
          <boxGeometry args={[0.22, 0.012, 0.002]} />
          <meshStandardMaterial color="#ffd7a3" emissive="#ffca85" emissiveIntensity={0.5} />
        </mesh>
      </group>

      <group position={[0.9, 1.155, 0.12]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.1, 0.08, 0.22, 12]} />
          <meshStandardMaterial color="#d9c9b1" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <icosahedronGeometry args={[0.2, 1]} />
          <meshStandardMaterial color="#65795c" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0.1, 0.38, 0.03]}>
          <icosahedronGeometry args={[0.12, 1]} />
          <meshStandardMaterial color="#7c8b75" roughness={0.8} flatShading />
        </mesh>
      </group>

      <group position={[1.25, 1.16, 0.34]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0.035, 0]}>
          <boxGeometry args={[0.18, 0.07, 0.26]} />
          <meshStandardMaterial color="#2c2c2c" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.1, -0.05]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[0.15, 0.12, 0.015]} />
          <meshStandardMaterial color="#24343b" roughness={0.3} />
        </mesh>
      </group>

      <mesh position={[-1.35, 1.17, 0.36]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.26, 0.03, 0.34]} />
        <meshStandardMaterial color="#d6c3a8" roughness={0.85} />
      </mesh>
      <mesh position={[-1.35, 1.2, 0.36]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.23, 0.02, 0.31]} />
        <meshStandardMaterial color="#f7f0e4" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function Bench() {
  return (
    <group position={[10.55, 0, 8.5]} rotation={[0, -Math.PI / 2, 0]}>
      <RoundedBox args={[2.1, 0.18, 0.65]} radius={0.07} position={[0, 0.46, 0]}>
        <meshStandardMaterial color="#c8a887" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[2.1, 0.32, 0.18]} radius={0.06} position={[0, 0.68, -0.24]}>
        <meshStandardMaterial color="#c8a887" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.2, 0.14]} radius={0.05} position={[-0.6, 0.68, -0.12]} rotation={[0.2, 0.1, 0]}>
        <meshStandardMaterial color="#d9773f" roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.2, 0.14]} radius={0.05} position={[0.6, 0.68, -0.12]} rotation={[0.2, -0.1, 0]}>
        <meshStandardMaterial color="#f1e6d4" roughness={0.85} />
      </RoundedBox>

      {[
        [-0.9, -0.24],
        [0.9, -0.24],
        [-0.9, 0.24],
        [0.9, 0.24],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.22, z]}>
          <cylinderGeometry args={[0.03, 0.026, 0.44, 8]} />
          <meshStandardMaterial color={BRASS} metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[1.9, 0.03, 0.05]} />
        <meshStandardMaterial color={BRASS} metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function Plant({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.26, 0.2, 0.44, 12]} />
        <meshStandardMaterial color="#c9b8a2" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 12]} />
        <meshStandardMaterial color="#5b4632" roughness={1} />
      </mesh>
      {[
        [0, 0.8, 0, 0.36],
        [-0.2, 0.95, 0.08, 0.26],
        [0.22, 0.93, -0.06, 0.28],
        [0.04, 1.08, 0.12, 0.22],
      ].map(([x, y, z, radius], index) => (
        <mesh key={index} position={[x, y, z]}>
          <icosahedronGeometry args={[radius, 1]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#6f8268" : "#7c8b75"}
            roughness={0.85}
            flatShading
          />
        </mesh>
      ))}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.022, 0.03, 0.5, 6]} />
        <meshStandardMaterial color="#6b5a3e" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function HangingSign({
  position,
  rotationY = 0,
  width = 4,
  title,
  subtitle,
  variant = "navy",
}: {
  position: [number, number, number];
  rotationY?: number;
  width?: number;
  title: string;
  subtitle?: string;
  variant?: "cream" | "navy" | "wood";
}) {
  const texture = useMemo(
    () =>
      createSignTexture({
        title,
        subtitle,
        variant,
        width: 1024,
        height: 230,
        accent: "#c49a5a",
      }),
    [title, subtitle, variant],
  );

  const height = width * 0.225;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[-width / 3, width / 3].map((x) => (
        <mesh key={x} position={[x, height / 2 + 0.24, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.48, 5]} />
          <meshStandardMaterial color="#2c2c2c" roughness={0.7} />
        </mesh>
      ))}

      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0, -0.022]}>
        <boxGeometry args={[width + 0.06, height + 0.06, 0.035]} />
        <meshStandardMaterial color={NAVY} roughness={0.5} />
      </mesh>
      <mesh position={[0, height / 2 + 0.02, 0]}>
        <boxGeometry args={[width + 0.08, 0.018, 0.045]} />
        <meshStandardMaterial color={BRASS} metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

export function FramedPoster({
  position,
  rotationY,
  title,
  subtitle,
  variant = "cream",
  width = 1.35,
  height = 1.8,
}: {
  position: [number, number, number];
  rotationY: number;
  title: string;
  subtitle: string;
  variant?: "cream" | "navy" | "wood";
  width?: number;
  height?: number;
}) {
  const texture = useMemo(
    () => createPosterTexture({ title, subtitle, variant }),
    [title, subtitle, variant],
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.04]} />
        <meshStandardMaterial color={BRASS} metalness={0.45} roughness={0.4} />
      </mesh>
    </group>
  );
}

export function PendantLights() {
  return (
    <group>
      {[-10.15, -8.9, -7.65].map((x) => (
        <group key={x} position={[x, 0, 7.15]}>
          <mesh position={[0, 3.45, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.9, 5]} />
            <meshStandardMaterial color="#242424" roughness={0.6} />
          </mesh>
          <mesh position={[0, 2.58, 0]}>
            <cylinderGeometry args={[0.16, 0.22, 0.24, 16, 1, true]} />
            <meshStandardMaterial
              color="#c49a5a"
              metalness={0.55}
              roughness={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[0.075, 12, 10]} />
            <meshStandardMaterial
              color="#fff1d2"
              emissive="#ffd9a1"
              emissiveIntensity={4}
            />
          </mesh>
          <mesh position={[0, 2.42, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.12, 8]} />
            <meshStandardMaterial color="#f4e9d7" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
