import { motion } from "motion/react";
import { 
  Heart, 
  Droplets, 
  Scale, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Edit3,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ReactNode;
  color: string;
  lastReading: string;
  percentage: number;
  patientNote: string;
  readonly?: boolean;
}

function MetricCard({ 
  title, 
  value, 
  unit, 
  status, 
  trend, 
  trendValue, 
  icon, 
  color, 
  lastReading,
  percentage,
  patientNote,
  readonly = false
}: MetricCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusRingColor = (status: string) => {
    switch (status) {
      case 'normal': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4" />;
      case 'down': return <TrendingDown className="w-4 h-4" />;
      default: return <div className="w-4 h-1 bg-current rounded-full" />;
    }
  };

  const getTrendColor = () => {
    if (status === 'critical' || status === 'warning') return 'text-red-500';
    return trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-slate-500';
  };

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group"
    >
      <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-lg hover:shadow-xl hover:border-slate-300/60 transition-all duration-500 overflow-hidden relative">
        {/* Subtle glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            backgroundImage: `linear-gradient(135deg, ${color}40, ${color}20)`
          }}
        />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon with subtle glow */}
              <motion.div 
                className="p-3 rounded-xl shadow-sm relative"
                style={{ backgroundColor: `${color}15` }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ color: color }}>
                  {icon}
                </div>
                {/* Icon glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30"
                  style={{ backgroundColor: color, filter: 'blur(8px)' }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.2, 0] 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              <CardTitle className="font-medium text-slate-700">{title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs px-3 py-1.5 rounded-full border ${getStatusColor(status)}`}>
                {status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              {!readonly && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            {/* Left side - Value and trend */}
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <motion.span 
                  className="text-3xl font-bold text-slate-800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  {value}
                </motion.span>
                <span className="text-sm font-medium text-slate-500">{unit}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span>{trendValue}</span>
                </div>
              </div>
              
              <div className="text-xs text-slate-400 font-medium">
                {lastReading}
              </div>
            </div>

            {/* Right side - Animated ring */}
            <div className="relative">
              <svg width="100" height="100" className="transform -rotate-90">
                {/* Background ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#f1f5f9"
                  strokeWidth="6"
                  fill="transparent"
                />
                
                {/* Animated progress ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={getStatusRingColor(status)}
                  strokeWidth="6"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={strokeDasharray}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: strokeDashoffset }}
                  transition={{ 
                    duration: 2,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.3))'
                  }}
                />
              </svg>
              
              {/* Center percentage */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              >
                <span className="text-lg font-bold" style={{ color: getStatusRingColor(status) }}>
                  {percentage}%
                </span>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface HealthMetricsProps {
  readonly?: boolean;
}

export function HealthMetrics({ readonly = false }: HealthMetricsProps) {
  const metrics = [
    {
      title: "Blood Pressure",
      value: "138/92",
      unit: "mmHg",
      status: 'warning' as const,
      trend: 'up' as const,
      trendValue: "+2 from yesterday",
      icon: <Heart className="w-5 h-5" />,
      color: "#f97316",
      lastReading: "2 hours ago",
      percentage: 75,
      patientNote: "Your BP is a bit high. Try some deep breathing exercises."
    },
    {
      title: "Blood Sugar",
      value: "126",
      unit: "mg/dL",
      status: 'warning' as const,
      trend: 'up' as const,
      trendValue: "+8 mg/dL",
      icon: <Droplets className="w-5 h-5" />,
      color: "#3b82f6",
      lastReading: "1 hour ago",
      percentage: 68,
      patientNote: "Consider checking what you ate today. Stay hydrated!"
    },
    {
      title: "Weight",
      value: "78.2",
      unit: "kg",
      status: 'normal' as const,
      trend: 'down' as const,
      trendValue: "-0.5 kg",
      icon: <Scale className="w-5 h-5" />,
      color: "#10b981",
      lastReading: "This morning",
      percentage: 92,
      patientNote: "You're doing amazing! Keep up the healthy habits."
    },
    {
      title: "Heart Rate",
      value: "78",
      unit: "BPM",
      status: 'normal' as const,
      trend: 'stable' as const,
      trendValue: "No change",
      icon: <Activity className="w-5 h-5" />,
      color: "#06b6d4",
      lastReading: "5 min ago",
      percentage: 85,
      patientNote: "Your heart is working beautifully. Well done!"
    },
    {
      title: "Wellness Score",
      value: "8.2",
      unit: "/10",
      status: 'normal' as const,
      trend: 'up' as const,
      trendValue: "+0.3 points",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#10b981",
      lastReading: "Daily check-in",
      percentage: 82,
      patientNote: "Your overall wellness is trending up. Keep going!"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-700">Your Health Today 📊</h2>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          Real-time tracking
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <MetricCard {...metric} readonly={readonly} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}