import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Brain, 
  Wind, 
  Scale,
  X,
  Zap,
  Thermometer,
  Eye,
  Stethoscope,
  Activity
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface VitalData {
  organ: string;
  icon: React.ReactNode;
  metrics: {
    name: string;
    value: string;
    status: 'normal' | 'warning' | 'critical';
    description: string;
  }[];
  color: string;
}

const vitalsData: VitalData[] = [
  {
    organ: "Cardiovascular",
    icon: <Heart className="w-6 h-6" />,
    color: "#f97316",
    metrics: [
      { name: "Heart Rate", value: "78 BPM", status: "normal", description: "Resting heart rate within normal range" },
      { name: "Blood Pressure", value: "138/92", status: "warning", description: "Slightly elevated, monitor closely" },
      { name: "Oxygen Saturation", value: "97%", status: "normal", description: "Good oxygen levels" },
      { name: "ECG Rhythm", value: "Normal Sinus", status: "normal", description: "Regular heart rhythm detected" }
    ]
  },
  {
    organ: "Neurological",
    icon: <Brain className="w-6 h-6" />,
    color: "#8b5cf6",
    metrics: [
      { name: "Cognitive Function", value: "92/100", status: "normal", description: "Excellent cognitive performance" },
      { name: "Stress Level", value: "Moderate", status: "warning", description: "Elevated stress markers detected" },
      { name: "Sleep Quality", value: "6.8/10", status: "warning", description: "Sleep pattern analysis shows disruption" },
      { name: "Reflex Response", value: "Normal", status: "normal", description: "All reflexes within expected range" }
    ]
  },
  {
    organ: "Respiratory",
    icon: <Wind className="w-6 h-6" />,
    color: "#06b6d4",
    metrics: [
      { name: "Lung Capacity", value: "4.2L", status: "normal", description: "Good lung capacity for age" },
      { name: "Respiratory Rate", value: "18/min", status: "normal", description: "Normal breathing rate" },
      { name: "Peak Flow", value: "480 L/min", status: "warning", description: "Slightly below expected for demographics" },
      { name: "Blood Oxygen", value: "97%", status: "normal", description: "Adequate oxygenation" }
    ]
  },
  {
    organ: "Metabolic",
    icon: <Zap className="w-6 h-6" />,
    color: "#10b981",
    metrics: [
      { name: "Blood Sugar", value: "126 mg/dL", status: "warning", description: "Elevated fasting glucose levels" },
      { name: "BMI", value: "24.8", status: "normal", description: "Healthy weight range" },
      { name: "Body Temperature", value: "98.6°F", status: "normal", description: "Normal body temperature" },
      { name: "Hydration", value: "Good", status: "normal", description: "Adequate fluid levels" }
    ]
  }
];

function VitalsOverlay({ organ, onClose }: { organ: VitalData; onClose: () => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-emerald-600';
      case 'warning': return 'text-amber-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-emerald-50 border-emerald-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'warning': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30 }}
        className="bg-white/98 backdrop-blur-2xl rounded-3xl border border-white/60 p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-5">
            <motion.div 
              className="p-5 rounded-2xl shadow-xl relative"
              style={{ 
                backgroundColor: `${organ.color}15`, 
                border: `3px solid ${organ.color}30`,
                boxShadow: `0 0 30px ${organ.color}20`
              }}
              animate={{
                boxShadow: [
                  `0 0 30px ${organ.color}20`,
                  `0 0 50px ${organ.color}40`,
                  `0 0 30px ${organ.color}20`
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div style={{ color: organ.color }}>
                {organ.icon}
              </div>
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800">{organ.organ} System</h2>
              <p className="text-slate-600 text-lg">Comprehensive health analysis</p>
              <div className="flex items-center gap-2 mt-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-emerald-600 font-medium">Live monitoring active</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={onClose} 
            className="rounded-full w-12 h-12 hover:bg-slate-100"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {organ.metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
              className={`p-8 rounded-3xl border-2 ${getStatusBg(metric.status)} transition-all hover:shadow-xl hover:scale-102 cursor-pointer`}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">{metric.name}</h3>
                <Badge className={`text-sm px-4 py-2 ${getStatusBadge(metric.status)} rounded-full`}>
                  {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                </Badge>
              </div>
              <div className={`text-4xl font-bold mb-4 ${getStatusColor(metric.status)}`}>
                {metric.value}
              </div>
              <p className="text-slate-700 leading-relaxed">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-start gap-4">
            <motion.div 
              className="p-3 bg-blue-100 rounded-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </motion.div>
            <div>
              <h4 className="text-xl font-bold text-blue-800 mb-3">AI Health Assessment</h4>
              <p className="text-blue-800 leading-relaxed text-lg">
                Overall {organ.organ.toLowerCase()} system performance is within acceptable ranges with some areas for improvement. 
                Regular monitoring recommended with follow-up assessment scheduled. Consider lifestyle modifications 
                to optimize health outcomes.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function HumanFigure() {
  const [selectedOrgan, setSelectedOrgan] = useState<VitalData | null>(null);
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);
  const [breathingPhase, setBreathingPhase] = useState(0);

  // Breathing animation cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathingPhase(prev => (prev + 0.1) % (Math.PI * 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const organPositions = [
    { organ: "Cardiovascular", x: 48, y: 35, data: vitalsData[0] },
    { organ: "Neurological", x: 50, y: 16, data: vitalsData[1] },
    { organ: "Respiratory", x: 44, y: 32, data: vitalsData[2] },
    { organ: "Metabolic", x: 52, y: 45, data: vitalsData[3] }
  ];

  // Breathing effect calculation
  const breathingScale = 1 + (Math.sin(breathingPhase) * 0.02);
  const chestExpansion = Math.sin(breathingPhase) * 0.5;

  return (
    <div className="relative">
      <motion.div 
        className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-8 shadow-2xl"
        animate={{ 
          boxShadow: [
            '0 20px 60px rgba(59, 130, 246, 0.1)',
            '0 30px 80px rgba(59, 130, 246, 0.15)',
            '0 20px 60px rgba(59, 130, 246, 0.1)'
          ] 
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            3D Health Assessment
          </h2>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            Real-time monitoring
          </div>
        </div>
        
        {/* Human Figure Container with breathing */}
        <div className="relative w-full h-[930px] mx-auto overflow-hidden">
          {/* Enhanced Holographic Background */}
          <motion.div 
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              background: `
                radial-gradient(circle at 30% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)
              `
            }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Breathing Human Silhouette */}
          <motion.svg 
            viewBox="0 0 100 100" 
            className="w-full h-full relative z-10"
            style={{ 
              filter: 'drop-shadow(0 0 40px rgba(16, 185, 129, 0.2))',
              transformOrigin: '50% 50%'
            }}
            animate={{ 
              scale: breathingScale,
            }}
          >
            {/* Enhanced body outline with breathing effect */}
            <motion.path
              d={`M50 8
                 C46 8, 42 12, 42 18
                 C42 22, 44 26, ${46 + chestExpansion} 30
                 L${46 + chestExpansion} 38
                 C${44 + chestExpansion} 42, ${42 + chestExpansion} 46, ${42 + chestExpansion} 52
                 L42 65
                 C42 70, 40 75, 38 78
                 L36 82
                 C34 85, 32 88, 30 90
                 L28 92
                 C26 94, 22 94, 20 92
                 L18 90
                 C16 88, 16 85, 18 82
                 L20 78
                 C22 75, 24 72, 24 68
                 L24 52
                 C${24 - chestExpansion} 46, ${22 - chestExpansion} 42, ${20 - chestExpansion} 38
                 L${20 - chestExpansion} 30
                 C18 26, 16 22, 16 18
                 C16 12, 20 8, 24 8
                 L26 8
                 C30 8, 34 8, 38 8
                 L42 8
                 C46 8, 50 8, 50 8
                 
                 C54 8, 58 8, 62 8
                 L66 8
                 C70 8, 74 8, 76 8
                 C80 8, 84 12, 84 18
                 C84 22, 82 26, ${80 + chestExpansion} 30
                 L${80 + chestExpansion} 38
                 C${78 + chestExpansion} 42, ${76 + chestExpansion} 46, ${76 + chestExpansion} 52
                 L76 68
                 C76 72, 78 75, 80 78
                 L82 82
                 C84 85, 84 88, 82 90
                 L80 92
                 C78 94, 74 94, 72 92
                 L70 90
                 C68 88, 66 85, 64 82
                 L62 78
                 C60 75, 58 70, 58 65
                 L58 52
                 C${58 - chestExpansion} 46, ${56 - chestExpansion} 42, ${54 - chestExpansion} 38
                 L${54 - chestExpansion} 30
                 C56 26, 58 22, 58 18
                 C58 12, 54 8, 50 8`}
              fill="rgba(16, 185, 129, 0.08)"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="0.4"
              animate={{
                fill: [
                  'rgba(16, 185, 129, 0.08)',
                  'rgba(59, 130, 246, 0.08)',
                  'rgba(16, 185, 129, 0.08)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Enhanced Organ Points with Glow */}
            {organPositions.map((position, index) => (
              <g key={position.organ}>
                {/* Outer glowing ring */}
                <motion.circle
                  cx={position.x}
                  cy={position.y}
                  r="12"
                  fill="none"
                  stroke={position.data.color}
                  strokeWidth="0.8"
                  opacity="0.3"
                  className="cursor-pointer"
                  animate={{
                    scale: hoveredOrgan === position.organ ? [1, 2.2, 1] : [1, 1.8, 1],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  onMouseEnter={() => setHoveredOrgan(position.organ)}
                  onMouseLeave={() => setHoveredOrgan(null)}
                  onClick={() => setSelectedOrgan(position.data)}
                />
                
                {/* Middle pulsing ring */}
                <motion.circle
                  cx={position.x}
                  cy={position.y}
                  r="8"
                  fill={`${position.data.color}20`}
                  stroke={position.data.color}
                  strokeWidth="1"
                  className="cursor-pointer"
                  animate={{
                    scale: hoveredOrgan === position.organ ? [1, 1.5, 1] : [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                  onMouseEnter={() => setHoveredOrgan(position.organ)}
                  onMouseLeave={() => setHoveredOrgan(null)}
                  onClick={() => setSelectedOrgan(position.data)}
                />
                
                {/* Inner solid circle with enhanced glow */}
                <motion.circle
                  cx={position.x}
                  cy={position.y}
                  r="5"
                  fill={position.data.color}
                  className="cursor-pointer"
                  style={{
                    filter: hoveredOrgan === position.organ 
                      ? `drop-shadow(0 0 20px ${position.data.color})`
                      : `drop-shadow(0 0 8px ${position.data.color})`
                  }}
                  animate={{
                    scale: hoveredOrgan === position.organ ? [1, 1.4, 1] : [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  onMouseEnter={() => setHoveredOrgan(position.organ)}
                  onMouseLeave={() => setHoveredOrgan(null)}
                  onClick={() => setSelectedOrgan(position.data)}
                />
                
                {/* Enhanced Hover Tooltip */}
                {hoveredOrgan === position.organ && (
                  <motion.g
                    initial={{ opacity: 0, y: 8, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <rect
                      x={position.x - 18}
                      y={position.y - 25}
                      width="36"
                      height="16"
                      fill="rgba(0,0,0,0.9)"
                      rx="8"
                      style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}
                    />
                    <text
                      x={position.x}
                      y={position.y - 15}
                      textAnchor="middle"
                      fontSize="3.5"
                      fill="white"
                      className="pointer-events-none font-semibold"
                    >
                      {position.organ.split(' ')[0]}
                    </text>
                  </motion.g>
                )}
              </g>
            ))}
          </motion.svg>

          {/* Enhanced Medical Scan Lines */}
          <motion.div
            className="absolute inset-0 opacity-25 pointer-events-none"
            initial={{ y: -150 }}
            animate={{ y: '120%' }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="h-3 bg-gradient-to-r from-transparent via-emerald-400 via-cyan-400 to-transparent opacity-60 shadow-lg"></div>
            <div className="h-1 bg-gradient-to-r from-transparent via-white to-transparent mt-1"></div>
          </motion.div>
        </div>

        <div className="text-center mt-8 space-y-3">
          <motion.p 
            className="text-lg font-semibold text-slate-700"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Interactive 3D Health Scan
          </motion.p>
          <p className="text-slate-500">
            Hover over highlighted areas and click to explore detailed vitals
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span>Monitor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span>Alert</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Vitals Overlay */}
      <AnimatePresence>
        {selectedOrgan && (
          <VitalsOverlay
            organ={selectedOrgan}
            onClose={() => setSelectedOrgan(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}