"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  dark: string;
}

const PALETTES: Palette[] = [
  { primary: "#1d4a6b", secondary: "#f0e3cf", accent: "#d9773f", neutral: "#f7f0e4", dark: "#132838" },
  { primary: "#b85f43", secondary: "#f2e2ce", accent: "#2c5578", neutral: "#faf3e7", dark: "#3f241a" },
  { primary: "#6f8268", secondary: "#ece4d3", accent: "#d9a15c", neutral: "#f7f1e4", dark: "#2d3a2a" },
  { primary: "#d9a79b", secondary: "#f6ece1", accent: "#7c8b75", neutral: "#fff8ee", dark: "#5e3d37" },
  { primary: "#c49a5a", secondary: "#f1e6d4", accent: "#102a43", neutral: "#fbf4e6", dark: "#5c4423" },
  { primary: "#3f6274", secondary: "#efe4d5", accent: "#c8613c", neutral: "#f8f1e4", dark: "#1c2f38" },
];

export function paletteFor(seed: string): Palette {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 9973;
  }
  return PALETTES[hash % PALETTES.length];
}

const RUBBER = "#232323";
const CHROME = "#b7b1a6";

function Material({
  color,
  roughness = 0.55,
  metalness = 0.04,
  emissive,
  emissiveIntensity = 0,
}: {
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissiveIntensity}
      envMapIntensity={0.45}
    />
  );
}

function Wheel({
  position,
  radius,
  color = RUBBER,
  rotation = [0, 0, Math.PI / 2],
}: {
  position: [number, number, number];
  radius: number;
  color?: string;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <cylinderGeometry args={[radius, radius, radius * 0.44, 14]} />
        <Material color={color} roughness={0.85} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[radius * 0.52, radius * 0.52, radius * 0.48, 12]} />
        <Material color={CHROME} metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Beam({
  start,
  end,
  radius = 0.025,
  color,
  metalness = 0.1,
}: {
  start: [number, number, number];
  end: [number, number, number];
  radius?: number;
  color: string;
  metalness?: number;
}) {
  const geometry = useMemo(() => {
    const from = new THREE.Vector3(...start);
    const to = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(to, from);
    const length = direction.length();
    const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    );
    return {
      position: midpoint.toArray() as [number, number, number],
      quaternion,
      length,
    };
  }, [start, end]);

  return (
    <mesh
      position={geometry.position}
      quaternion={geometry.quaternion}
    >
      <cylinderGeometry args={[radius, radius, geometry.length, 7]} />
      <Material color={color} metalness={metalness} roughness={0.55} />
    </mesh>
  );
}

function WalkerModel({ palette }: { palette: Palette }) {
  return (
    <group>
      {[
        [-0.3, 0.08, 0.23] as [number, number, number],
        [0.3, 0.08, 0.23] as [number, number, number],
        [-0.3, 0.08, -0.23] as [number, number, number],
        [0.3, 0.08, -0.23] as [number, number, number],
      ].map((position, index) => (
        <group key={index}>
          <Wheel position={position} radius={0.075} />
          <mesh position={[position[0], 0.26, position[2]]}>
            <cylinderGeometry args={[0.022, 0.022, 0.32, 8]} />
            <Material color={palette.primary} metalness={0.25} />
          </mesh>
        </group>
      ))}

      <RoundedBox args={[0.68, 0.08, 0.5]} radius={0.035} position={[0, 0.43, 0]}>
        <Material color={palette.primary} roughness={0.45} />
      </RoundedBox>
      <RoundedBox args={[0.54, 0.03, 0.38]} radius={0.015} position={[0, 0.475, 0]}>
        <Material color={palette.secondary} roughness={0.7} />
      </RoundedBox>

      <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.17, 0.055, 8, 20]} />
        <Material color={palette.accent} roughness={0.75} />
      </mesh>

      <RoundedBox
        args={[0.34, 0.2, 0.07]}
        radius={0.035}
        position={[0, 0.37, -0.2]}
        rotation={[0.16, 0, 0]}
      >
        <Material color={palette.secondary} roughness={0.8} />
      </RoundedBox>

      {[-0.27, 0.27].map((x) => (
        <mesh key={x} position={[x, 0.62, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <Material color={palette.accent} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.76, -0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.026, 0.58, 10]} />
        <Material color={palette.accent} metalness={0.3} />
      </mesh>

      {[
        [-0.15, 0.53, 0.05, palette.accent],
        [0.02, 0.53, 0.12, palette.neutral],
        [0.18, 0.53, 0.02, palette.dark],
      ].map(([x, y, z, color], index) => (
        <mesh key={index} position={[x as number, y as number, z as number]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <Material color={color as string} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function RideOnCar({
  palette,
  roof = false,
}: {
  palette: Palette;
  roof?: boolean;
}) {
  return (
    <group>
      {[
        [-0.44, 0.17, 0.3] as [number, number, number],
        [0.44, 0.17, 0.3] as [number, number, number],
        [-0.44, 0.17, -0.3] as [number, number, number],
        [0.44, 0.17, -0.3] as [number, number, number],
      ].map((position, index) => (
        <Wheel key={index} position={position} radius={0.16} />
      ))}

      <RoundedBox args={[1.0, 0.28, 0.56]} radius={0.1} position={[0, 0.33, 0]}>
        <Material color={palette.primary} roughness={0.32} metalness={0.12} />
      </RoundedBox>
      <RoundedBox args={[0.94, 0.09, 0.5]} radius={0.04} position={[0, 0.21, 0]}>
        <Material color={palette.dark} roughness={0.6} />
      </RoundedBox>

      <RoundedBox args={[0.5, 0.26, 0.46]} radius={0.08} position={[0, 0.55, -0.01]}>
        <Material color={palette.secondary} roughness={0.4} />
      </RoundedBox>

      <mesh position={[0, 0.6, 0.235]} rotation={[-0.18, 0, 0]}>
        <planeGeometry args={[0.38, 0.2]} />
        <meshStandardMaterial color="#2a3b45" roughness={0.15} metalness={0.4} />
      </mesh>

      <RoundedBox args={[0.34, 0.07, 0.3]} radius={0.03} position={[0, 0.56, -0.1]}>
        <Material color={palette.accent} roughness={0.65} />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.24, 0.06]} radius={0.025} position={[0, 0.64, -0.25]} rotation={[0.15, 0, 0]}>
        <Material color={palette.accent} roughness={0.7} />
      </RoundedBox>

      {[-0.36, 0.36].map((x) => (
        <mesh key={x} position={[x, 0.3, 0.29]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.16, 0.05, 0.02]} />
          <Material color="#fff6e2" emissive="#fff1d0" emissiveIntensity={0.5} />
        </mesh>
      ))}

      <mesh position={[0, 0.42, 0.29]}>
        <torusGeometry args={[0.055, 0.014, 6, 14]} />
        <Material color={palette.accent} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.45, 0.24]} rotation={[0.9, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.1, 6]} />
        <Material color={palette.dark} />
      </mesh>

      {roof && (
        <>
          {[-0.34, 0.34].map((x) => (
            <mesh key={x} position={[x, 0.76, -0.06]}>
              <cylinderGeometry args={[0.014, 0.014, 0.3, 6]} />
              <Material color={palette.dark} metalness={0.3} />
            </mesh>
          ))}
          <RoundedBox args={[0.68, 0.06, 0.44]} radius={0.03} position={[0, 0.92, -0.06]}>
            <Material color={palette.secondary} roughness={0.5} />
          </RoundedBox>
        </>
      )}

      <RoundedBox args={[0.86, 0.055, 0.07]} radius={0.02} position={[0, 0.4, 0.29]}>
        <Material color={palette.accent} metalness={0.35} roughness={0.35} />
      </RoundedBox>
    </group>
  );
}

function BikeModel({ palette }: { palette: Palette }) {
  return (
    <group>
      <Wheel position={[0, 0.23, 0.42]} radius={0.22} rotation={[0, 0, Math.PI / 2]} />
      <Wheel position={[0, 0.23, -0.4]} radius={0.22} rotation={[0, 0, Math.PI / 2]} />

      <Beam start={[0, 0.25, -0.4]} end={[0, 0.45, 0.05]} radius={0.03} color={palette.primary} metalness={0.4} />
      <Beam start={[0, 0.45, 0.05]} end={[0, 0.28, 0.36]} radius={0.03} color={palette.primary} metalness={0.4} />
      <Beam start={[0, 0.3, 0.38]} end={[0, 0.68, 0.3]} radius={0.025} color={CHROME} metalness={0.6} />

      <RoundedBox args={[0.24, 0.18, 0.38]} radius={0.07} position={[0, 0.5, 0.02]}>
        <Material color={palette.primary} roughness={0.35} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[0.2, 0.05, 0.3]} radius={0.03} position={[0, 0.6, 0.04]}>
        <Material color={palette.accent} roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.26, 0.08, 0.3]} radius={0.035} position={[0, 0.59, -0.22]}>
        <Material color={palette.dark} roughness={0.7} />
      </RoundedBox>

      <mesh position={[0, 0.72, 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 0.4, 8]} />
        <Material color={CHROME} metalness={0.6} />
      </mesh>
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.72, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
          <Material color={RUBBER} roughness={0.9} />
        </mesh>
      ))}

      <mesh position={[0, 0.7, 0.36]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <Material color="#fff3d8" emissive="#ffe6b8" emissiveIntensity={0.35} />
      </mesh>
      <Beam start={[0, 0.17, 0.36]} end={[0.16, 0.3, 0.02]} radius={0.012} color={CHROME} metalness={0.5} />
    </group>
  );
}

function SwingModel({
  palette,
  hanging = false,
}: {
  palette: Palette;
  hanging?: boolean;
}) {
  return (
    <group>
      {[-0.68, 0.68].map((x) =>
        [
          [-0.52, 0.62],
          [0.52, 0.62],
        ].map(([zOffset], index) => (
          <Beam
            key={`${x}-${index}`}
            start={[x, 1.62, 0]}
            end={[x, 0, zOffset]}
            radius={0.035}
            color={palette.primary}
          />
        )),
      )}
      <mesh position={[0, 1.63, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 1.46, 8]} />
        <Material color={palette.primary} />
      </mesh>

      {[-0.26, 0.26].map((x) => (
        <Beam
          key={x}
          start={[x, 1.6, 0]}
          end={[x, 0.68, 0.02]}
          radius={0.012}
          color="#cbb48d"
        />
      ))}

      {hanging ? (
        <>
          <RoundedBox args={[0.6, 0.12, 0.46]} radius={0.06} position={[0, 0.55, 0.03]}>
            <Material color={palette.secondary} roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.6, 0.28, 0.06]} radius={0.04} position={[0, 0.68, -0.19]} rotation={[0.12, 0, 0]}>
            <Material color={palette.accent} roughness={0.75} />
          </RoundedBox>
          <RoundedBox args={[0.06, 0.28, 0.44]} radius={0.03} position={[-0.28, 0.68, 0.02]}>
            <Material color={palette.accent} roughness={0.75} />
          </RoundedBox>
          <RoundedBox args={[0.06, 0.28, 0.44]} radius={0.03} position={[0.28, 0.68, 0.02]}>
            <Material color={palette.accent} roughness={0.75} />
          </RoundedBox>
          {[-0.18, 0, 0.18].map((x, index) => (
            <mesh key={x} position={[x, 0.33, 0.05]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <Material color={index % 2 === 0 ? palette.neutral : palette.secondary} />
            </mesh>
          ))}
        </>
      ) : (
        <>
          <RoundedBox args={[0.55, 0.07, 0.38]} radius={0.03} position={[0, 0.52, 0.03]}>
            <Material color={palette.secondary} roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[0.55, 0.34, 0.06]} radius={0.03} position={[0, 0.7, -0.18]} rotation={[0.14, 0, 0]}>
            <Material color={palette.accent} roughness={0.75} />
          </RoundedBox>
          <RoundedBox args={[0.42, 0.035, 0.26]} radius={0.02} position={[0, 0.57, 0.04]}>
            <Material color={palette.neutral} roughness={0.85} />
          </RoundedBox>
        </>
      )}
    </group>
  );
}

function CradleModel({ palette }: { palette: Palette }) {
  return (
    <group>
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.24, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.4, 0.032, 6, 22, Math.PI]} />
          <Material color={palette.primary} roughness={0.6} />
        </mesh>
      ))}

      <RoundedBox args={[0.92, 0.3, 0.52]} radius={0.12} position={[0, 0.63, 0]}>
        <Material color={palette.secondary} roughness={0.72} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.06, 0.42]} radius={0.03} position={[0, 0.8, 0]}>
        <Material color={palette.neutral} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[0.78, 0.1, 0.44]} radius={0.04} position={[0, 0.84, 0]}>
        <Material color="#fdf7ee" roughness={0.9} />
      </RoundedBox>

      {[-0.5, 0.5].map((x) => (
        <RoundedBox
          key={x}
          args={[0.06, 0.36, 0.5]}
          radius={0.025}
          position={[x, 0.7, 0]}
        >
          <Material color={palette.primary} roughness={0.5} />
        </RoundedBox>
      ))}

      <mesh position={[0, 0.47, 0]}>
        <boxGeometry args={[0.86, 0.12, 0.48]} />
        <Material color={palette.accent} roughness={0.8} />
      </mesh>

      <mesh position={[-0.34, 1.0, -0.1]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 6]} />
        <Material color={palette.primary} />
      </mesh>
      {[
        [-0.34, 1.27, -0.1],
        [-0.46, 1.2, 0.02],
        [-0.22, 1.2, 0.02],
      ].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <Material color={index === 0 ? palette.accent : palette.neutral} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function PlushModel({ palette }: { palette: Palette }) {
  return (
    <group>
      <mesh position={[0, 0.34, 0]} scale={[1, 1.12, 0.92]}>
        <sphereGeometry args={[0.3, 18, 16]} />
        <Material color={palette.secondary} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.73, 0.02]}>
        <sphereGeometry args={[0.24, 18, 16]} />
        <Material color={palette.secondary} roughness={0.95} />
      </mesh>
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.91, -0.01]}>
          <sphereGeometry args={[0.085, 12, 12]} />
          <Material color={palette.primary} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 0.69, 0.22]} scale={[1, 0.8, 0.7]}>
        <sphereGeometry args={[0.12, 14, 12]} />
        <Material color={palette.neutral} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.72, 0.3]}>
        <sphereGeometry args={[0.033, 10, 10]} />
        <Material color={palette.dark} roughness={0.5} />
      </mesh>
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 0.78, 0.215]}>
          <sphereGeometry args={[0.019, 8, 8]} />
          <Material color="#1a1a1a" roughness={0.3} />
        </mesh>
      ))}
      {[-0.29, 0.29].map((x) => (
        <mesh key={x} position={[x, 0.4, 0.05]} rotation={[0, 0, x > 0 ? -0.5 : 0.5]} scale={[1, 1.5, 1]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <Material color={palette.secondary} roughness={0.95} />
        </mesh>
      ))}
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.13, 0.12]} scale={[1, 1.2, 1.35]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <Material color={palette.primary} roughness={0.95} />
        </mesh>
      ))}
      <mesh position={[0, 0.56, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.185, 0.028, 8, 20]} />
        <Material color={palette.accent} roughness={0.6} />
      </mesh>
    </group>
  );
}

function TentModel({ palette }: { palette: Palette }) {
  const doorShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.24, 0);
    shape.lineTo(-0.24, 0.3);
    shape.quadraticCurveTo(0, 0.64, 0.24, 0.3);
    shape.lineTo(0.24, 0);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group>
      <mesh position={[0, 0.58, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.82, 1.15, 4]} />
        <meshStandardMaterial
          color={palette.primary}
          roughness={0.85}
          flatShading
          envMapIntensity={0.35}
        />
      </mesh>

      <mesh position={[0, 0.02, 0.68]}>
        <shapeGeometry args={[doorShape]} />
        <meshStandardMaterial color={palette.dark} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, 1.17, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.36, 6]} />
        <Material color={palette.accent} />
      </mesh>
      <mesh position={[0.1, 1.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.09, 0.14, 3]} />
        <Material color={palette.accent} />
      </mesh>

      {[
        [-0.95, 0.32],
        [0.95, 0.32],
        [0, 0.95],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.36, 16]} />
          <meshStandardMaterial color={palette.secondary} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function GiftModel({ palette }: { palette: Palette }) {
  return (
    <group>
      <RoundedBox args={[0.72, 0.3, 0.52]} radius={0.03} position={[0, 0.16, 0]}>
        <Material color={palette.primary} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.1, 0.315, 0.535]} />
        <Material color={palette.secondary} roughness={0.4} />
      </mesh>

      <RoundedBox args={[0.55, 0.26, 0.44]} radius={0.03} position={[0.04, 0.44, 0.02]} rotation={[0, 0.22, 0]}>
        <Material color={palette.secondary} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0.04, 0.44, 0.02]} rotation={[0, 0.22, 0]}>
        <boxGeometry args={[0.075, 0.275, 0.455]} />
        <Material color={palette.primary} roughness={0.4} />
      </mesh>

      {[-0.06, 0.06].map((x, index) => (
        <mesh key={x} position={[0.04 + x, 0.6, 0.02]} rotation={[Math.PI / 2, 0, index === 0 ? 0.4 : -0.4]}>
          <torusGeometry args={[0.07, 0.02, 6, 12]} />
          <Material color={palette.accent} roughness={0.35} metalness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.26, 0.53, 0.23]} rotation={[0.4, 0.3, 0]}>
        <boxGeometry args={[0.13, 0.08, 0.005]} />
        <Material color={palette.accent} />
      </mesh>
    </group>
  );
}

function AccessoriesModel({ palette }: { palette: Palette }) {
  return (
    <group>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.38, 0.4, 0.08, 20]} />
        <Material color={palette.primary} roughness={0.6} />
      </mesh>

      <group position={[-0.15, 0.08, 0.05]}>
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.36, 14]} />
          <Material color={palette.neutral} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.47, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.07, 14]} />
          <Material color={palette.accent} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.53, 0]}>
          <sphereGeometry args={[0.055, 12, 10]} />
          <Material color={palette.secondary} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.093, 0.093, 0.16, 14]} />
          <Material color={palette.secondary} roughness={0.8} />
        </mesh>
      </group>

      <group position={[0.18, 0.08, 0.02]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.028, 0.035, 0.26, 8]} />
          <Material color={palette.accent} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.36, 0]}>
          <sphereGeometry args={[0.11, 14, 12]} />
          <Material color={palette.neutral} roughness={0.6} />
        </mesh>
        <mesh position={[0.08, 0.4, 0.04]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <Material color={palette.primary} roughness={0.5} />
        </mesh>
      </group>

      {[0.29, 0.35, 0.41].map((y, index) => (
        <RoundedBox
          key={y}
          args={[0.3 - index * 0.015, 0.05, 0.36]}
          radius={0.02}
          position={[0.22, y, -0.22]}
          rotation={[0, index * 0.12, 0]}
        >
          <Material color={index % 2 === 0 ? palette.secondary : palette.primary} roughness={0.9} />
        </RoundedBox>
      ))}
    </group>
  );
}

export function ProductModel({
  categorySlug,
  seed,
}: {
  categorySlug: string | null | undefined;
  seed: string;
}) {
  const palette = useMemo(() => paletteFor(seed), [seed]);

  switch (categorySlug) {
    case "baby-walkers":
      return <WalkerModel palette={palette} />;
    case "kids-riding-toys":
      return <RideOnCar palette={palette} />;
    case "battery-operated-cars":
      return <RideOnCar palette={palette} roof />;
    case "battery-bikes":
      return <BikeModel palette={palette} />;
    case "baby-swings":
      return <SwingModel palette={palette} />;
    case "baby-jhulas":
      return <SwingModel palette={palette} hanging />;
    case "baby-cradles":
      return <CradleModel palette={palette} />;
    case "soft-toys":
      return <PlushModel palette={palette} />;
    case "kids-tent-houses":
      return <TentModel palette={palette} />;
    case "baby-gift-sets":
      return <GiftModel palette={palette} />;
    case "baby-accessories":
      return <AccessoriesModel palette={palette} />;
    default:
      return <GiftModel palette={palette} />;
  }
}
