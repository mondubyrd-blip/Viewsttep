/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useState, useEffect, Suspense} from 'react';
import {Canvas} from '@react-three/fiber';
import {OrbitControls, PerspectiveCamera, Environment, Sky, ContactShadows} from '@react-three/drei';
import {motion, AnimatePresence} from 'motion/react';
import {
  Hammer,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Box as BoxIcon,
  Home,
  Layout,
  Wind,
  ShieldCheck,
  Zap,
  Eye,
  Download,
  Mail,
  History,
  AlertTriangle
} from 'lucide-react';
import {Phase, ConstructionScene} from './components/ConstructionScene';
import {COLORS} from './components/ShedParts';

const PHASES = [
  {id: Phase.SITE, name: "Site Location", icon: MapPin, desc: "Marking property setbacks and orientation."},
  {id: Phase.FOUNDATION_LAYOUT, name: "Layout", icon: Layout, desc: "Batter boards and square check."},
  {id: Phase.PIERS, name: "Piers", icon: BoxIcon, desc: "15 Pier 3x5 grid on Sonotubes."},
  {id: Phase.BEAMS, name: "Beams", icon: Layers, desc: "Triple 2x10PT support beams."},
  {id: Phase.FLOOR_FRAME, name: "Floor Framing", icon: Hammer, desc: "2x8 PT joists @ 16\" O.C. with rim joists."},
  {id: Phase.SUBFLOOR, name: "Subfloor", icon: Maximize2, desc: "3/4\" T&G OSB panels staggered joints."},
  {id: Phase.WALLS, name: "Walls", icon: Home, desc: "2x4 framing, side walls first then front/rear."},
  {id: Phase.LOFT, name: "Loft", icon: Layers, desc: "Mezzanine framing and floor deck."},
  {id: Phase.GAMBREL_ROOF, name: "Roof Framing", icon: Wind, desc: "Gambrel rafters with gussets and ridge board."},
  {id: Phase.SHEATHING, name: "Sheathing", icon: ShieldCheck, desc: "OSB sheathing for structural integrity."},
  {id: Phase.WEATHERPROOFING, name: "Exterior", icon: ShieldCheck, desc: "House wrap and metal roofing panels."},
  {id: Phase.INTERIOR, name: "Fish Room", icon: Zap, desc: "Insulation, electrical, and tank rack zones."},
  {id: Phase.FINAL, name: "Final Build", icon: Eye, desc: "Completed project walk-through."}
];

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<Phase>(Phase.SITE);
  const [showReport, setShowReport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const nextPhase = () => setCurrentPhase(p => (p < Phase.FINAL ? p + 1 : p));
  const prevPhase = () => setCurrentPhase(p => (p > Phase.SITE ? p - 1 : p));

  const currentPhaseInfo = PHASES.find(p => p.id === currentPhase);

  const downloadReport = () => {
    const reportContent = `
GAMBREL SHED CONSTRUCTION REPORT
Generated on: ${new Date().toLocaleString()}

Project: 16x20 Fish Breeding Shed
Status: ${currentPhase === Phase.FINAL ? "COMPLETE" : `Phase ${currentPhase}: ${currentPhaseInfo?.name}`}

SPECIFICATIONS:
- Footprint: 16' x 20'
- Walls: 2x4 PT @ 16" OC
- Roof: Gambrel Barn Style
- Foundation: 15-Pier 3x5 Grid
- Interior: Fish breeding zones, Insulated, Dedicated Electrical Panel.

LOG:
${PHASES.slice(0, currentPhase + 1).map(p => `[${p.id}] ${p.name}: ${p.desc}`).join('\n')}

Note: Verify final dimensions and local codes before construction.
    `;
    const blob = new Blob([reportContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shed_construction_report.txt';
    link.click();
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0k] overflow-hidden font-sans">
      {/* Sidebar Control Panel */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{x: -300}}
            animate={{x: 0}}
            exit={{x: -300}}
            className="w-80 bg-zinc-900 border-r border-white/10 p-6 flex flex-col gap-8 z-20 overflow-y-auto"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Hammer className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg tracking-tight">Shed Builder</h1>
                <p className="text-zinc-500 text-xs">V.1.0 Construction Visualizer</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Construction Phases</h2>
              <div className="space-y-1">
                {PHASES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentPhase(p.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                      currentPhase === p.id 
                        ? "bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20" 
                        : "text-zinc-400 hover:bg-white/5"
                    }`}
                  >
                    <p.icon size={16} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-4">
               <div className="p-4 bg-yellow-900/20 border border-yellow-900/50 rounded-lg">
                  <div className="flex gap-2 text-yellow-500 mb-1">
                    <AlertTriangle size={16} />
                    <span className="text-[10px] font-bold uppercase">Disclaimer</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                    Verify final dimensions, setbacks, anchors, and structural requirements with local building authority.
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-2">
                 <button 
                  onClick={downloadReport}
                  className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded text-xs transition-colors"
                 >
                   <Download size={14} /> Report
                 </button>
                 <button 
                  onClick={() => window.alert("Email functionality simulated. Report would be sent to mondubyrd@gmail.com")}
                  className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded text-xs transition-colors"
                 >
                  <Mail size={14} /> Email
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Viewport */}
      <div className="flex-1 relative bg-gradient-to-b from-zinc-800 to-black">
        {/* Top Header UI */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none z-10">
          <div className="pointer-events-auto">
             <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-black/50 backdrop-blur-md border border-white/10 text-white p-2 rounded-lg hover:bg-black/70 transition-all"
             >
               <History size={20} />
             </button>
          </div>

          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col items-center pointer-events-auto max-w-sm">
             <div className="flex items-center gap-4 mb-2">
               <button 
                onClick={prevPhase}
                disabled={currentPhase === Phase.SITE}
                className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
               >
                 <ChevronLeft size={24} />
               </button>
               <div className="text-center min-w-[150px]">
                 <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest block mb-0.5">Phase {currentPhase}</span>
                 <h2 className="text-white font-medium text-lg">{currentPhaseInfo?.name}</h2>
               </div>
               <button 
                 onClick={nextPhase}
                 disabled={currentPhase === Phase.FINAL}
                 className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                >
                 <ChevronRight size={24} />
               </button>
             </div>
             <p className="text-zinc-400 text-xs text-center">{currentPhaseInfo?.desc}</p>
          </div>

          <div className="pointer-events-auto flex flex-col gap-2">
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-xl text-xs text-white">
              <h3 className="font-bold text-blue-400 mb-2 uppercase text-[10px]">Material Callout</h3>
              {currentPhase === Phase.PIERS && (
                <div className="space-y-1">
                  <p>• 15x Sonotubes (10" dia)</p>
                  <p>• 80lb Concrete Bags (45x)</p>
                  <p>• J-Bolt Anchors (15x)</p>
                </div>
              )}
              {currentPhase === Phase.BEAMS && (
                <div className="space-y-1">
                  <p>• 2x10x20 PT (9x pieces)</p>
                  <p>• Timberlok Screws</p>
                  <p>• Triple Ply Glue-up</p>
                </div>
              )}
               {currentPhase === Phase.FLOOR_FRAME && (
                <div className="space-y-1">
                  <p>• 2x8x16 PT (17x pieces)</p>
                  <p>• 2x8x20 PT (2x Rim)</p>
                  <p>• Joist Hangers (30x)</p>
                </div>
              )}
              {currentPhaseInfo && currentPhase !== Phase.PIERS && currentPhase !== Phase.BEAMS && currentPhase !== Phase.FLOOR_FRAME && (
                <p className="text-zinc-500 italic">Select phase for details</p>
              )}
            </div>
          </div>
        </div>

        {/* 3D Scene */}
        <Canvas shadows className="w-full h-full cursor-move">
          <PerspectiveCamera makeDefault position={[30, 20, 30]} fov={40} />
          <Suspense fallback={null}>
            <Sky sunPosition={[100, 10, 100]} />
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <pointLight position={[50, 50, 50]} intensity={1} castShadow />
            <spotLight position={[0, 40, 0]} angle={0.15} penumbra={1} intensity={2} castShadow />
            
            <ConstructionScene phase={currentPhase} />

            <ContactShadows 
              position={[0, -0.01, 0]} 
              opacity={0.4} 
              scale={60} 
              blur={1} 
              far={10} 
              resolution={256} 
              color="#000000" 
            />

            <OrbitControls 
              makeDefault
              enableDamping
              dampingFactor={0.05}
              minDistance={10}
              maxDistance={100}
              autoRotate={currentPhase === Phase.FINAL}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>

        {/* Bottom Legend */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full text-[10px] text-white tracking-wider">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-blue-500" /> BLUEPRINT
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.concrete}} /> CONCRETE
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.ptWood}} /> PT LUMBER
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.wood}} /> SPF LUMBER
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full border border-white/20 bg-transparent" /> BRACING
           </div>
        </div>
      </div>
    </div>
  );
}
