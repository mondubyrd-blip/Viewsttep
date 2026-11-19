import {useMemo} from "react";
import {Box, Sphere, Line, Text, Html} from "@react-three/drei";
import {Vector3} from "three";

interface ShedSpecs {
  width: number;
  length: number;
  wallHeight: number;
}

export const SPECS: ShedSpecs = {
  width: 16,
  length: 20,
  wallHeight: 8,
};

// Colors
export const COLORS = {
  wood: "#b58e63",
  ptWood: "#4a5d4e", // Greenish pressure treated
  concrete: "#9ca3af",
  ground: "#3f6212",
  metal: "#94a3b8",
  insulation: "#ec4899", // Pink fiberglass or blue foam
  osb: "#d97706",
  blueprint: "#2563eb",
};

export function Label({position, text}: {position: [number, number, number]; text: string}) {
  return (
    <Html position={position} center distanceFactor={10}>
      <div className="bg-black/70 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none border border-white/20 font-mono">
        {text}
      </div>
    </Html>
  );
}

export function Marker({position, label}: {position: [number, number, number]; label?: string}) {
  return (
    <group position={position}>
      <Sphere args={[0.1, 16, 16]}>
        <meshStandardMaterial color="red" />
      </Sphere>
      {label && <Label position={[0, 0.3, 0]} text={label} />}
    </group>
  );
}

export function DimensionLine({start, end, label}: {start: Vector3; end: Vector3; label: string}) {
  const points = [start, end];
  const mid = new Vector3().addVectors(start, end).multiplyScalar(0.5);

  return (
    <group>
      <Line points={points} color="#ffffff" lineWidth={1} transparent opacity={0.5} />
      <Text
        position={[mid.x, mid.y + 0.2, mid.z]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}
