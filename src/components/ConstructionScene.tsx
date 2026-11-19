import {useRef, useMemo} from "react";
import {Vector3, Color} from "three";
import {Box, Cylinder, Plane, Line, Text, Edges} from "@react-three/drei";
import {SPECS, COLORS, Label, Marker} from "./ShedParts";

export enum Phase {
  SITE,
  FOUNDATION_LAYOUT,
  PIERS,
  BEAMS,
  FLOOR_FRAME,
  SUBFLOOR,
  WALLS,
  LOFT,
  GAMBREL_ROOF,
  SHEATHING,
  WEATHERPROOFING,
  INTERIOR,
  FINAL
}

export function ConstructionScene({phase}: {phase: Phase}) {
  const show = (target: Phase) => phase >= target;

  return (
    <group>
      {/* GROUND & ENV */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={COLORS.ground} />
      </mesh>

      {/* FENCE LINE */}
      <group position={[0, 0, -25]}>
         {/* Simple back fence */}
         <Box args={[60, 6, 0.2]} position={[0, 3, 0]}>
            <meshStandardMaterial color="#78350f" />
         </Box>
      </group>

      {/* PHASE 0: SITE LOCATION */}
      {phase === Phase.SITE && (
        <group>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
            <planeGeometry args={[SPECS.width, SPECS.length]} />
            <meshStandardMaterial color="white" transparent opacity={0.2} wireframe />
          </mesh>
          <Marker position={[-SPECS.width/2, 0.1, -SPECS.length/2]} label="NW Corner" />
          <Marker position={[SPECS.width/2, 0.1, -SPECS.length/2]} label="NE Corner" />
          <Marker position={[-SPECS.width/2, 0.1, SPECS.length/2]} label="SW Corner" />
          <Marker position={[SPECS.width/2, 0.1, SPECS.length/2]} label="SE Corner" />
          
          <group position={[0, 0.1, 15]}>
            <Text position={[0, 0, 0]} rotation-x={-Math.PI/2} fontSize={1} color="white">SOUTH</Text>
          </group>
          <group position={[0, 0.1, -15]}>
            <Text position={[0, 0, 0]} rotation-x={-Math.PI/2} fontSize={1} color="white">NORTH</Text>
          </group>
        </group>
      )}

      {/* PHASE 1: LAYOUT (String lines) */}
      {phase === Phase.FOUNDATION_LAYOUT && (
        <group>
          <Line 
            points={[
              [-10, 0.2, -12], [10, 0.2, -12],
              [10, 0.2, 12], [-10, 0.2, 12],
              [-10, 0.2, -12]
            ]} 
            color="yellow" 
          />
          <Label position={[0, 1, 0]} text="Batter Boards & String Lines" />
        </group>
      )}

      {/* PHASE 2: PIERS (3x5 grid = 15 piers) */}
      {show(Phase.PIERS) && (
        <group>
          {Array.from({length: 5}).map((_, r) => 
            Array.from({length: 3}).map((_, c) => {
              const x = (c - 1) * (SPECS.width / 2);
              const z = (r - 2) * (SPECS.length / 4);
              const id = r * 3 + c + 1;
              return (
                <group key={`pier-${id}`} position={[x, 0, z]}>
                  <Cylinder args={[0.5, 0.5, 2, 16]} position={[0, -0.5, 0]}>
                    <meshStandardMaterial color={COLORS.concrete} />
                  </Cylinder>
                  <Box args={[0.8, 0.8, 0.1]} position={[0, 0.5, 0]} rotation-x={-Math.PI/2}>
                     <meshStandardMaterial color={COLORS.concrete} />
                  </Box>
                  {phase === Phase.PIERS && <Label position={[0, 0.8, 0]} text={`P${id}`} />}
                </group>
              );
            })
          )}
          {phase === Phase.PIERS && (
            <Label position={[0, 2, 0]} text="Verify all pier tops level before beams." />
          )}
        </group>
      )}

      {/* PHASE 3: BEAMS (3 triple 2x10PT) */}
      {show(Phase.BEAMS) && (
        <group>
           {[-1, 0, 1].map((offset, i) => (
             <group key={`beam-${i}`} position={[offset * (SPECS.width / 2), 0.7, 0]}>
                {/* 3x 2x10 (approx 4.5" x 9.25") */}
                <Box args={[0.4, 0.8, SPECS.length]}>
                  <meshStandardMaterial color={COLORS.ptWood} />
                  <Edges color="black" />
                </Box>
                <Label position={[0, 0.6, 0]} text={`Beam ${String.fromCharCode(65 + i)}`} />
             </group>
           ))}
        </group>
      )}

      {/* PHASE 4: FLOOR FRAME (2x8 PT @ 16" OC) */}
      {show(Phase.FLOOR_FRAME) && (
        <group position={[0, 1.1, 0]}>
          {/* Rim Joists */}
          <Box args={[SPECS.width, 0.6, 0.15]} position={[0, 0, -SPECS.length/2]}><meshStandardMaterial color={COLORS.ptWood} /><Edges /></Box>
          <Box args={[SPECS.width, 0.6, 0.15]} position={[0, 0, SPECS.length/2]}><meshStandardMaterial color={COLORS.ptWood} /><Edges /></Box>
          
          {/* Joists */}
          {Array.from({length: Math.floor(SPECS.length / (16/12)) + 1}).map((_, i) => {
            const z = -SPECS.length/2 + i * (16/12);
            if (z > SPECS.length/2) return null;
            return (
              <Box key={`joist-${i}`} args={[SPECS.width - 0.3, 0.6, 0.12]} position={[0, 0, z]}>
                <meshStandardMaterial color={COLORS.ptWood} />
                <Edges />
              </Box>
            );
          })}
        </group>
      )}

      {/* PHASE 5: SUBFLOOR (3/4" OSB) */}
      {show(Phase.SUBFLOOR) && (
        <group position={[0, 1.45, 0]}>
          <Box args={[SPECS.width, 0.1, SPECS.length]}>
            <meshStandardMaterial color={COLORS.osb} />
            <Edges />
          </Box>
        </group>
      )}

      {/* PHASE 6: WALLS (2x4 @ 16" OC) */}
      {show(Phase.WALLS) && (
        <group position={[0, 1.5, 0]}>
          {/* Side Walls (North/South relative) */}
          <Wall x={-SPECS.width/2} z={0} length={SPECS.length} height={SPECS.wallHeight} rotation={[0, Math.PI/2, 0]} label="Side Wall" />
          <Wall x={SPECS.width/2} z={0} length={SPECS.length} height={SPECS.wallHeight} rotation={[0, Math.PI/2, 0]} label="Side Wall" />
          
          {/* Front/Rear Walls */}
          <Wall x={0} z={SPECS.length/2} length={SPECS.width} height={SPECS.wallHeight} rotation={[0, 0, 0]} isFront label="Front Wall" />
          <Wall x={0} z={-SPECS.length/2} length={SPECS.width} height={SPECS.wallHeight} rotation={[0, 0, 0]} label="Rear Wall" />
        </group>
      )}

      {/* PHASE 7: LOFT */}
      {show(Phase.LOFT) && (
        <group position={[0, 1.5 + SPECS.wallHeight - 0.5, -SPECS.length/4]}>
          <Box args={[SPECS.width, 0.1, SPECS.length/2]}>
            <meshStandardMaterial color={COLORS.wood} transparent opacity={phase > Phase.SHEATHING ? 0.3 : 1} />
            <Edges />
          </Box>
          <Label position={[0, 0.2, 0]} text="Mezzanine / Loft" />
        </group>
      )}

      {/* PHASE 8: GAMBREL ROOF FRAMING */}
      {show(Phase.GAMBREL_ROOF) && (
        <group position={[0, 1.5 + SPECS.wallHeight, 0]}>
           {Array.from({length: 11}).map((_, i) => (
             <RafterPair key={`rafter-${i}`} z={-SPECS.length/2 + i * 2} />
           ))}
           <Box args={[0.1, 0.8, SPECS.length]} position={[0, 7, 0]}><meshStandardMaterial color={COLORS.wood} /></Box>
        </group>
      )}

      {/* PHASE 9: SHEATHING */}
      {show(Phase.SHEATHING) && (
        <group position={[0, 1.5, 0]}>
          {/* Wall sheathing - Simplified semi-transparent if later phases */}
          <Box args={[SPECS.width + 0.2, SPECS.wallHeight, SPECS.length + 0.2]} position={[0, SPECS.wallHeight/2, 0]}>
            <meshStandardMaterial color={COLORS.osb} transparent opacity={phase >= Phase.WEATHERPROOFING ? 0.4 : 1} wireframe={phase < Phase.SHEATHING} />
          </Box>
        </group>
      )}

      {/* PHASE 10: WEATHERPROOFING & ROOF */}
      {show(Phase.WEATHERPROOFING) && (
         <group position={[0, 1.5 + SPECS.wallHeight + 4, 0]}>
            {/* Simple metal roof plane for gambrel shape */}
            <Box args={[SPECS.width * 1.1, 0.1, SPECS.length]} rotation={[0,0,Math.PI/6]} position={[-4, 1.5, 0]}>
              <meshStandardMaterial color={COLORS.metal} />
            </Box>
            <Box args={[SPECS.width * 1.1, 0.1, SPECS.length]} rotation={[0,0,-Math.PI/6]} position={[4, 1.5, 0]}>
              <meshStandardMaterial color={COLORS.metal} />
            </Box>
         </group>
      )}

      {/* PHASE 11: INTERIOR (Insulation, etc) */}
      {show(Phase.INTERIOR) && (
        <group position={[0, 3, 0]}>
           <Box args={[2, 4, 0.2]} position={[6, 0, 0]}><meshStandardMaterial color="gray" /><Label position={[0, 2.5, 0]} text="Electrical Panel" /></Box>
           <Box args={[3, 3, 3]} position={[-4, -1, 5]}><meshStandardMaterial color={COLORS.insulation} transparent opacity={0.5} /><Label position={[0, 2, 0]} text="Breeding Rack Zone" /></Box>
        </group>
      )}

      {/* FINAL VIEW (Orbit) handled in App */}
    </group>
  );
}

function Wall({x, z, length, height, rotation, isFront, label}: any) {
  return (
    <group position={[x, height/2, z]} rotation={rotation}>
      <Box args={[length, height, 0.2]}>
        <meshStandardMaterial color={COLORS.wood} transparent opacity={0.3} wireframe />
      </Box>
      {/* Studs */}
      {Array.from({length: Math.floor(length / (16/12)) + 1}).map((_, i) => (
        <Box key={i} args={[0.1, height, 0.1]} position={[-length/2 + i * (16/12), 0, 0]}>
          <meshStandardMaterial color={COLORS.wood} />
        </Box>
      ))}
      {label && <Label position={[0, height/2 + 0.5, 0]} text={label} />}
      {isFront && (
        <Box args={[3, 7, 0.3]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color="#ef4444" transparent opacity={0.5} />
          <Label position={[0, 4, 0]} text="10' Rolling Door Area" />
        </Box>
      )}
    </group>
  );
}

function RafterPair({z}: {z: number}) {
  return (
    <group position={[0, 0, z]}>
      {/* Lower Slopes */}
      <Box args={[6, 0.2, 0.1]} rotation={[0, 0, Math.PI/4]} position={[-5, 2, 0]}><meshStandardMaterial color={COLORS.wood} /></Box>
      <Box args={[6, 0.2, 0.1]} rotation={[0, 0, -Math.PI/4]} position={[5, 2, 0]}><meshStandardMaterial color={COLORS.wood} /></Box>
      {/* Upper Slopes */}
      <Box args={[6, 0.2, 0.1]} rotation={[0, 0, Math.PI/8]} position={[-2.5, 5, 0]}><meshStandardMaterial color={COLORS.wood} /></Box>
      <Box args={[6, 0.2, 0.1]} rotation={[0, 0, -Math.PI/8]} position={[2.5, 5, 0]}><meshStandardMaterial color={COLORS.wood} /></Box>
      {/* Collar Tie */}
      <Box args={[6, 0.15, 0.1]} position={[0, 3.5, 0]}><meshStandardMaterial color={COLORS.wood} /></Box>
    </group>
  );
}
