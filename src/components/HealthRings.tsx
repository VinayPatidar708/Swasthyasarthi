import { motion } from "motion/react";
import { Activity, Heart, Droplets, Zap } from "lucide-react";

interface HealthRingProps {
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
  percentage: number;
}

function HealthRing({ title, value, maxValue, unit, color, icon, percentage }: HealthRingProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative group">
      <div className="w-32 h-32 relative">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={`url(#gradient-${title})`}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="drop-shadow-lg"
          />
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}80`} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl mb-1">{icon}</div>
          <div className="text-lg font-semibold text-slate-700">{value}</div>
          <div className="text-xs text-slate-500">{unit}</div>
        </div>

        {/* Glow Effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"
          style={{ backgroundColor: color }}
        ></div>
      </div>

      {/* Title */}
      <div className="text-center mt-3">
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        <p className="text-xs text-slate-500">{percentage}% of goal</p>
      </div>
    </div>
  );
}

export function HealthRings() {
  const healthData = [
    {
      title: "Heart Rate",
      value: 72,
      maxValue: 100,
      unit: "BPM",
      color: "#ef4444",
      icon: <Heart className="w-6 h-6 text-red-500" />,
      percentage: 85
    },
    {
      title: "Activity",
      value: 8420,
      maxValue: 10000,
      unit: "steps",
      color: "#06b6d4",
      icon: <Activity className="w-6 h-6 text-cyan-500" />,
      percentage: 84
    },
    {
      title: "Hydration",
      value: 1.8,
      maxValue: 2.5,
      unit: "liters",
      color: "#3b82f6",
      icon: <Droplets className="w-6 h-6 text-blue-500" />,
      percentage: 72
    },
    {
      title: "Energy",
      value: 1840,
      maxValue: 2200,
      unit: "kcal",
      color: "#f59e0b",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      percentage: 91
    }
  ];

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-xl">
      <h2 className="text-lg font-semibold text-slate-700 mb-6">Today's Health Overview</h2>
      <div className="grid grid-cols-2 gap-8">
        {healthData.map((data, index) => (
          <motion.div
            key={data.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <HealthRing {...data} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}