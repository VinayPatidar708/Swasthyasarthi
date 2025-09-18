import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Heart,
  Droplets,
  Scale,
  Activity,
  Filter,
  ExternalLink,
  Clock,
  Pill,
  Utensils,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [selectedType, setSelectedType] = useState("all");

  // Mock health summary data
  const healthSummary = {
    bloodPressure: { systolic: 118, diastolic: 76, status: "Normal", trend: "stable" },
    glucose: { value: 95, unit: "mg/dL", status: "Normal", trend: "improving" },
    weight: { value: 156.2, unit: "lbs", status: "Normal", trend: "stable" },
    heartRate: { value: 72, unit: "bpm", status: "Normal", trend: "stable" },
    crrsScore: { value: 4.2, status: "Low Risk", trend: "improving" }
  };

  // Mock chart data
  const bloodPressureData = [
    { date: "Jan 1", systolic: 125, diastolic: 82 },
    { date: "Jan 8", systolic: 122, diastolic: 79 },
    { date: "Jan 15", systolic: 120, diastolic: 78 },
    { date: "Jan 22", systolic: 118, diastolic: 76 },
    { date: "Jan 29", systolic: 117, diastolic: 75 },
  ];

  const glucoseData = [
    { date: "Week 1", value: 102 },
    { date: "Week 2", value: 98 },
    { date: "Week 3", value: 96 },
    { date: "Week 4", value: 95 },
  ];

  const adherenceData = [
    { name: "Medications", value: 95, color: "#10b981" },
    { name: "Appointments", value: 88, color: "#3b82f6" },
    { name: "Daily Logs", value: 92, color: "#f59e0b" },
  ];

  const anomalyAlerts = [
    { 
      id: 1, 
      type: "blood_pressure", 
      message: "Blood pressure reading unusually high on Jan 15", 
      severity: "medium",
      date: "2 days ago"
    },
    { 
      id: 2, 
      type: "medication", 
      message: "Missed medication dose 3 times this week", 
      severity: "high",
      date: "1 day ago"
    },
    { 
      id: 3, 
      type: "weight", 
      message: "Weight fluctuation detected", 
      severity: "low",
      date: "5 days ago"
    }
  ];

  const lifestyleLogs = [
    { date: "Today", diet: "Balanced", activity: "30 min walk", medication: "On time", mood: "Good" },
    { date: "Yesterday", diet: "High sodium", activity: "Rest day", medication: "Delayed", mood: "Tired" },
    { date: "Jan 28", diet: "Balanced", activity: "45 min exercise", medication: "On time", mood: "Great" },
  ];

  return (
    <div className="ml-20 p-8 space-y-8 pt-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
              Health Reports 📊
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Comprehensive overview of your health journey
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="14">14 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Health Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <FileText className="w-6 h-6" />
                Health Summary Report
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Last 30 Days
                </Badge>
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Blood Pressure */}
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Blood Pressure</h4>
                    <p className="text-2xl font-bold text-slate-900">
                      {healthSummary.bloodPressure.systolic}/{healthSummary.bloodPressure.diastolic}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {healthSummary.bloodPressure.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Stable</span>
                  </div>
                </div>
              </div>

              {/* Glucose */}
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Glucose</h4>
                    <p className="text-2xl font-bold text-slate-900">
                      {healthSummary.glucose.value} <span className="text-sm text-slate-500">{healthSummary.glucose.unit}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {healthSummary.glucose.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Improving</span>
                  </div>
                </div>
              </div>

              {/* Weight */}
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Scale className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Weight</h4>
                    <p className="text-2xl font-bold text-slate-900">
                      {healthSummary.weight.value} <span className="text-sm text-slate-500">{healthSummary.weight.unit}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {healthSummary.weight.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-slate-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Stable</span>
                  </div>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">Heart Rate</h4>
                    <p className="text-2xl font-bold text-slate-900">
                      {healthSummary.heartRate.value} <span className="text-sm text-slate-500">{healthSummary.heartRate.unit}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {healthSummary.heartRate.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-slate-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Stable</span>
                  </div>
                </div>
              </div>

              {/* CRRS Score */}
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800">CRRS Score</h4>
                    <p className="text-2xl font-bold text-slate-900">
                      {healthSummary.crrsScore.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    {healthSummary.crrsScore.status}
                  </Badge>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">Improving</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Reports Section */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Charts */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Vital Trends */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Vital Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bp" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
                    <TabsTrigger value="glucose">Glucose</TabsTrigger>
                    <TabsTrigger value="weight">Weight</TabsTrigger>
                    <TabsTrigger value="hr">Heart Rate</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bp" className="mt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bloodPressureData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px' 
                            }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="systolic" 
                            stroke="#ef4444" 
                            strokeWidth={3}
                            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                            name="Systolic"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="diastolic" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            name="Diastolic"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="glucose" className="mt-6">
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={glucoseData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px' 
                            }} 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#f59e0b" 
                            fill="#fef3c7"
                            strokeWidth={3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="weight" className="mt-6">
                    <div className="text-center py-20 text-slate-500">
                      <Scale className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Weight data visualization coming soon</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hr" className="mt-6">
                    <div className="text-center py-20 text-slate-500">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Heart rate data visualization coming soon</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Adherence Statistics */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  Adherence Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={adherenceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {adherenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {adherenceData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-slate-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Alerts & Logs */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Anomaly Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  Health Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {anomalyAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`
                        p-3 rounded-lg border-l-4 bg-white
                        ${alert.severity === 'high' ? 'border-red-500' :
                          alert.severity === 'medium' ? 'border-yellow-500' :
                          'border-blue-500'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge 
                          variant="secondary" 
                          className={`
                            text-xs
                            ${alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                              alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }
                          `}
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-slate-500">{alert.date}</span>
                      </div>
                      <p className="text-sm text-slate-700">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lifestyle Logs */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Recent Lifestyle Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lifestyleLogs.map((log, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-slate-800">{log.date}</span>
                        <div className="flex items-center gap-1">
                          <div className={`
                            w-2 h-2 rounded-full
                            ${log.mood === 'Great' ? 'bg-green-500' :
                              log.mood === 'Good' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }
                          `}></div>
                          <span className="text-xs text-slate-500">{log.mood}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-orange-500" />
                          <span className="text-slate-600">{log.diet}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-blue-500" />
                          <span className="text-slate-600">{log.activity}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <Pill className="w-3 h-3 text-purple-500" />
                          <span className="text-slate-600">{log.medication}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 gap-2" size="sm">
                  <ExternalLink className="w-4 h-4" />
                  View Full History
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200"
      >
        <h3 className="text-xl font-semibold text-blue-800 mb-2">Export Your Health Data</h3>
        <p className="text-blue-600 mb-4">
          Download comprehensive reports to share with your healthcare provider
        </p>
        <div className="flex justify-center gap-4">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Download Full Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print Summary
          </Button>
        </div>
      </motion.div>
    </div>
  );
}