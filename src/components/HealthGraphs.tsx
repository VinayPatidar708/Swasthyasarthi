import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

// ---------------------- DATA GENERATORS ----------------------

const generateECGData = () => {
  const data = [];
  const baseTime = new Date();

  for (let i = 0; i < 50; i++) {
    const time = new Date(baseTime.getTime() + i * 1000);

    let heartRate;
    if (i % 10 === 7) heartRate = 95; // P wave
    else if (i % 10 === 8) heartRate = 165; // QRS spike
    else if (i % 10 === 9) heartRate = 45; // S wave dip
    else heartRate = 72 + Math.random() * 12 - 6; // Normal

    data.push({
      time: time.toLocaleTimeString("en-US", {
        hour12: false,
        minute: "2-digit",
        second: "2-digit",
      }),
      heartRate,
    });
  }
  return data;
};

const generateTimeSeriesData = (
  days: number,
  type: "bp" | "glucose" | "weight"
) => {
  const data = [];
  const baseValues = { bp: { systolic: 120, diastolic: 80 }, glucose: 95, weight: 78 };

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    if (type === "bp") {
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        systolic: baseValues.bp.systolic + Math.random() * 20 - 10,
        diastolic: baseValues.bp.diastolic + Math.random() * 15 - 7,
      });
    } else if (type === "glucose") {
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: baseValues.glucose + Math.random() * 40 - 20,
      });
    } else {
      data.push({
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: baseValues.weight + Math.random() * 4 - 2,
      });
    }
  }
  return data;
};

// ---------------------- STATIC DATA ----------------------

const medicationAdherenceData = [
  { name: "Taken on Time", value: 82, color: "#10b981" },
  { name: "Taken Late", value: 12, color: "#f59e0b" },
  { name: "Missed", value: 6, color: "#f97316" },
];

const vitalsData = [
  { vital: "Blood Pressure", current: 138, target: 120, color: "#f97316" },
  { vital: "Heart Rate", current: 78, target: 70, color: "#06b6d4" },
  { vital: "Blood Sugar", current: 126, target: 100, color: "#3b82f6" },
  { vital: "Weight", current: 78, target: 75, color: "#10b981" },
  { vital: "Sleep Hours", current: 6.5, target: 8, color: "#8b5cf6" },
];

// ---------------------- CHART CONTAINER ----------------------

interface ChartProps {
  title: string;
  children: React.ReactNode;
  timePeriods?: boolean;
}

function ChartContainer({ title, children, timePeriods = false }: ChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const periods = [
    { label: "7D", value: "7" },
    { label: "14D", value: "14" },
    { label: "30D", value: "30" },
    { label: "90D", value: "90" },
  ];

  return (
    <Card className="bg-white/95 backdrop-blur-xl border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-500 relative">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            {title}
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </CardTitle>
          {timePeriods && (
            <div className="flex gap-1 bg-slate-100/80 rounded-xl p-1">
              {periods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? "default" : "ghost"}
                  size="sm"
                  className={`h-8 px-4 text-xs font-medium transition-all duration-200 ${
                    selectedPeriod === period.value
                      ? "bg-white shadow-md ring-2 ring-emerald-200"
                      : "hover:bg-white/60"
                  }`}
                  onClick={() => setSelectedPeriod(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ---------------------- INDIVIDUAL CHARTS ----------------------

function ECGHeartRateChart() {
  const [data, setData] = useState(generateECGData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateECGData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ChartContainer title="CRRS Score">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="2 2" stroke="rgba(16, 185, 129, 0.1)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[40, 180]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value) => [`${Math.round(value as number)} BPM`, "Score"]}
          />
          <Line type="monotone" dataKey="heartRate" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="0" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function AnimatedVitalsChart() {
  return (
    <ChartContainer title="Vitals vs Target Comparison">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={vitalsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="vital" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", border: "none", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }} />
          <Bar dataKey="current" name="Current" radius={[4, 4, 0, 0]}>
            {vitalsData.map((entry, index) => (
              <Cell key={`cell-current-${index}`} fill={entry.color} />
            ))}
          </Bar>
          <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} fill="rgba(148, 163, 184, 0.3)" />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function ExpandingPieChart() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsExpanded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ChartContainer title="Medication Adherence This Week">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={medicationAdherenceData}
            cx="50%"
            cy="50%"
            innerRadius={isExpanded ? 60 : 0}
            outerRadius={isExpanded ? 100 : 60}
            paddingAngle={5}
            dataKey="value"
          >
            {medicationAdherenceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}%`, "Adherence"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        >
          <div className="text-2xl font-bold text-emerald-600">94%</div>
          <div className="text-xs text-slate-500">Overall</div>
        </motion.div>
      )}
    </ChartContainer>
  );
}

function BloodPressureChart() {
  const data = generateTimeSeriesData(7, "bp");

  return (
    <ChartContainer title="Blood Pressure Trends" timePeriods>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} domain={[60, 160]} />
          <Tooltip contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)", border: "none", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }} />
          <Line type="monotone" dataKey="systolic" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: "#f97316" }} name="Systolic" />
          <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} name="Diastolic" />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
// ---------------------- EXPORT MAIN COMPONENT ----------------------

export function HealthGraphs() {
  return (
    <div className="space-y-8">
      {/* CRRS Score */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ECGHeartRateChart />
      </motion.div>

      {/* Blood Pressure */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <BloodPressureChart />
      </motion.div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <AnimatedVitalsChart />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <ExpandingPieChart />
        </motion.div>
      </div>
    </div>
  );
}
