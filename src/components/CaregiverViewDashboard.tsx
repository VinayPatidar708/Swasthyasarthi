import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Eye, 
  Edit3, 
  Shield, 
  FileText, 
  User, 
  Heart, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Plus,
  Calendar,
  Clock,
  Pill,
  Utensils,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { HealthMetrics } from "./HealthMetrics";
import { HealthGraphs } from "./HealthGraphs";
import { HumanFigure } from "./HumanFigure";
import { HealthActivityStreak } from "./HealthActivityStreak";
import { Gamification } from "./Gamification";

interface PatientAssignment {
  id: string;
  name: string;
  age: number;
  relation: 'parent' | 'spouse' | 'child' | 'patient' | 'family';
  profilePicture: string;
  status: 'active' | 'revoked';
  permission: 'view_only' | 'fill_logs' | 'full_access';
  lastActivity: string;
  healthStatus: 'stable' | 'improving' | 'needs_attention';
  condition: string;
  recentVitals: {
    bloodPressure: string;
    glucose: string;
    weight: string;
    heartRate: string;
    status: 'normal' | 'elevated' | 'critical';
  };
  urgentAlerts: number;
}

interface LogEntry {
  id: string;
  type: 'symptom' | 'medication' | 'activity' | 'diet';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high';
  caregiverAction?: boolean;
}

export function CaregiverViewDashboard() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Mock caregiver assignments
  const patientAssignments: PatientAssignment[] = [
    {
      id: '1',
      name: 'Susmita kumar',
      age: 78,
      relation: 'parent',
      profilePicture: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
      status: 'active',
      permission: 'view_only',
      lastActivity: '2 hours ago',
      healthStatus: 'stable',
      condition: 'Hypertension, Diabetes',
      recentVitals: {
        bloodPressure: '142/88',
        glucose: '98 mg/dL',
        weight: '165 lbs',
        heartRate: '78 bpm',
        status: 'elevated'
      },
      urgentAlerts: 1
    },
    {
      id: '2',
      name: 'Ritik kumar',
      age: 45,
      relation: 'spouse',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      status: 'active',
      permission: 'fill_logs',
      lastActivity: '30 minutes ago',
      healthStatus: 'improving',
      condition: 'Post-Surgery Recovery',
      recentVitals: {
        bloodPressure: '118/76',
        glucose: '85 mg/dL',
        weight: '180 lbs',
        heartRate: '72 bpm',
        status: 'normal'
      },
      urgentAlerts: 0
    },
    {
      id: '3',
      name: 'Vikas',
      age: 22,
      relation: 'child',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b35c?w=100&h=100&fit=crop&crop=face',
      status: 'active',
      permission: 'full_access',
      lastActivity: '1 hour ago',
      healthStatus: 'needs_attention',
      condition: 'Chronic Fatigue Syndrome',
      recentVitals: {
        bloodPressure: '106/68',
        glucose: '92 mg/dL',
        weight: '125 lbs',
        heartRate: '68 bpm',
        status: 'normal'
      },
      urgentAlerts: 2
    }
  ];

  const selectedPatient = patientAssignments.find(p => p.id === selectedPatientId);
  const activePatients = patientAssignments.filter(p => p.status === 'active');
  const totalUrgentAlerts = activePatients.reduce((sum, p) => sum + p.urgentAlerts, 0);

  // Mock logs data for individual patient view
  const logsData: LogEntry[] = [
    {
      id: '1',
      type: 'medication',
      title: 'Metformin taken',
      description: '500mg with breakfast as prescribed',
      timestamp: '2 hours ago',
      caregiverAction: false
    },
    {
      id: '2',
      type: 'symptom',
      title: 'Blood pressure logged',
      description: 'BP reading: 142/88 - slightly elevated',
      timestamp: '3 hours ago',
      severity: 'medium',
      caregiverAction: true
    },
    {
      id: '3',
      type: 'activity',
      title: '30-minute walk',
      description: 'Evening walk in the neighborhood',
      timestamp: 'Yesterday',
      caregiverAction: false
    }
  ];

  const getPermissionInfo = (permission: string) => {
    switch (permission) {
      case 'view_only':
        return {
          label: 'View Only',
          icon: <Eye className="w-4 h-4" />,
          className: 'bg-blue-100 text-blue-700 border-blue-300',
          description: 'Can view vitals and history only'
        };
      case 'fill_logs':
        return {
          label: 'Fill Logs',
          icon: <Edit3 className="w-4 h-4" />,
          className: 'bg-emerald-100 text-emerald-700 border-emerald-300',
          description: 'Can add vitals and update logs'
        };
      case 'full_access':
        return {
          label: 'Full Access',
          icon: <Shield className="w-4 h-4" />,
          className: 'bg-purple-100 text-purple-700 border-purple-300',
          description: 'Complete dashboard access'
        };
      default:
        return {
          label: 'Unknown',
          icon: <User className="w-4 h-4" />,
          className: 'bg-slate-100 text-slate-700',
          description: ''
        };
    }
  };

  const getHealthStatusInfo = (status: string) => {
    switch (status) {
      case 'stable':
        return {
          label: 'Stable',
          icon: <CheckCircle2 className="w-4 h-4" />,
          className: 'bg-emerald-100 text-emerald-700'
        };
      case 'improving':
        return {
          label: 'Improving',
          icon: <TrendingUp className="w-4 h-4" />,
          className: 'bg-blue-100 text-blue-700'
        };
      case 'needs_attention':
        return {
          label: 'Needs Attention',
          icon: <AlertCircle className="w-4 h-4" />,
          className: 'bg-orange-100 text-orange-700'
        };
      default:
        return {
          label: 'Unknown',
          icon: <User className="w-4 h-4" />,
          className: 'bg-slate-100 text-slate-700'
        };
    }
  };

  const getRelationIcon = (relation: string) => {
    switch (relation) {
      case 'parent': return '👨‍👩‍👧‍👦';
      case 'spouse': return '💕';
      case 'child': return '👶';
      case 'patient': return '🏥';
      case 'family': return '👥';
      default: return '👤';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="w-4 h-4 text-blue-600" />;
      case 'symptom': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'activity': return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'diet': return <Utensils className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const canEdit = selectedPatient?.permission !== 'view_only';
  const hasFullAccess = selectedPatient?.permission === 'full_access';

  if (selectedPatient) {
    return (
      <div className="ml-20 pt-20 p-8 space-y-8">
        {/* Header with Back Button and Patient Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPatientId(null)}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patients
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 ring-2 ring-emerald-200">
                <AvatarImage src={selectedPatient.profilePicture} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-800">{selectedPatient.name}</h1>
                  <span className="text-2xl">{getRelationIcon(selectedPatient.relation)}</span>
                </div>
                <p className="text-slate-600">Age {selectedPatient.age} • {selectedPatient.condition}</p>
              </div>
            </div>
            
            <div className="ml-auto flex items-center gap-4">
              <Badge className={`${getPermissionInfo(selectedPatient.permission).className} font-medium`}>
                {getPermissionInfo(selectedPatient.permission).icon}
                <span className="ml-2">{getPermissionInfo(selectedPatient.permission).label}</span>
              </Badge>
              
              <Button variant="outline" size="sm" title="Audit Log">
                <FileText className="w-4 h-4 mr-2" />
                Audit Log
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Permission-Based Dashboard Content */}
        <AnimatePresence mode="wait">
          {selectedPatient.permission === 'view_only' && (
            <motion.div
              key="view-only"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* View Only: Vitals Cards + History */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">View Only Access</h3>
                  </div>
                  <p className="text-blue-700">You can view vitals and health history but cannot make changes.</p>
                </CardContent>
              </Card>

              <HealthMetrics readonly={true} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Health History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {logsData.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                          {getLogIcon(log.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-slate-800">{log.title}</h4>
                            {log.caregiverAction && (
                              <Badge className="text-xs bg-emerald-100 text-emerald-700">
                                Caregiver Entry
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{log.description}</p>
                          <p className="text-xs text-slate-500">{log.timestamp}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedPatient.permission === 'fill_logs' && (
            <motion.div
              key="fill-logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Fill Logs: Vitals + Logs with Edit Capabilities */}
              <Card className="bg-emerald-50 border-emerald-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Edit3 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-emerald-800">Fill Logs Access</h3>
                  </div>
                  <p className="text-emerald-700">You can add vitals, update logs, and manage daily health entries.</p>
                </CardContent>
              </Card>

              <HealthMetrics readonly={false} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Quick Log Entry</CardTitle>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Entry
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {['Medication', 'Symptom', 'Activity', 'Diet'].map((type) => (
                        <Button
                          key={type}
                          variant="outline"
                          className="h-20 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-300"
                        >
                          {getLogIcon(type.toLowerCase())}
                          <span className="text-sm">{type}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Entries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {logsData.slice(0, 3).map((log) => (
                        <div key={log.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
                            {getLogIcon(log.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 truncate">{log.title}</p>
                            <p className="text-xs text-slate-500">{log.timestamp}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {selectedPatient.permission === 'full_access' && (
            <motion.div
              key="full-access"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Full Access: Complete Dashboard Replica */}
              <Card className="bg-purple-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-800">Full Access</h3>
                  </div>
                  <p className="text-purple-700">Complete dashboard access including reports, CRRS scores, and health management.</p>
                </CardContent>
              </Card>

              <HealthMetrics readonly={false} />

              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-8 space-y-8">
                  <HealthGraphs />
                </div>
                <div className="col-span-12 lg:col-span-4">
                  <HumanFigure />
                </div>
              </div>

              <HealthActivityStreak />
              
              <Gamification />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Patient List View
  return (
    <div className="ml-20 pt-20 p-8 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Caregiver Dashboard 👩‍⚕️
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Managing care for {activePatients.length} patients
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/80 backdrop-blur-md rounded-xl border border-emerald-200 shadow-lg">
                <div className="text-xl font-bold text-emerald-600">{activePatients.length}</div>
                <div className="text-xs text-emerald-500">Active</div>
              </div>
              <div className="text-center p-3 bg-white/80 backdrop-blur-md rounded-xl border border-orange-200 shadow-lg">
                <div className="text-xl font-bold text-orange-600">{totalUrgentAlerts}</div>
                <div className="text-xs text-orange-500">Alerts</div>
              </div>
              <div className="text-center p-3 bg-white/80 backdrop-blur-md rounded-xl border border-blue-200 shadow-lg">
                <div className="text-xl font-bold text-blue-600">24/7</div>
                <div className="text-xs text-blue-500">Active</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Patients Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePatients.map((patient, index) => (
            <PatientCard 
              key={patient.id}
              patient={patient} 
              onSelect={setSelectedPatientId}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function PatientCard({ 
  patient, 
  onSelect, 
  index 
}: { 
  patient: PatientAssignment; 
  onSelect: (id: string) => void;
  index: number;
}) {
  const permissionInfo = getPermissionInfo(patient.permission);
  const healthStatusInfo = getHealthStatusInfo(patient.healthStatus);
  const relationIcon = getRelationIcon(patient.relation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(patient.id)}
      className="cursor-pointer"
    >
      <Card className="border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        {patient.urgentAlerts > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
            >
              {patient.urgentAlerts}
            </motion.div>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-emerald-200">
              <AvatarImage src={patient.profilePicture} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-slate-800">{patient.name}</h3>
                <span className="text-lg">{relationIcon}</span>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                Age {patient.age} • {patient.relation.charAt(0).toUpperCase() + patient.relation.slice(1)}
              </p>
              
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${healthStatusInfo.className}`}>
                  {healthStatusInfo.icon}
                  <span className="ml-1">{healthStatusInfo.label}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Access Level</span>
            </div>
            <Badge className={`${permissionInfo.className} font-medium`}>
              {permissionInfo.icon}
              <span className="ml-2">{permissionInfo.label}</span>
            </Badge>
          </div>

          <div className="bg-slate-50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">BP:</span>
                <span className="ml-1 font-medium">{patient.recentVitals.bloodPressure}</span>
              </div>
              <div>
                <span className="text-slate-500">HR:</span>
                <span className="ml-1 font-medium">{patient.recentVitals.heartRate}</span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
            View Dashboard
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getPermissionInfo(permission: string) {
  switch (permission) {
    case 'view_only':
      return {
        label: 'View Only',
        icon: <Eye className="w-4 h-4" />,
        className: 'bg-blue-100 text-blue-700 border-blue-300'
      };
    case 'fill_logs':
      return {
        label: 'Fill Logs',
        icon: <Edit3 className="w-4 h-4" />,
        className: 'bg-emerald-100 text-emerald-700 border-emerald-300'
      };
    case 'full_access':
      return {
        label: 'Full Access',
        icon: <Shield className="w-4 h-4" />,
        className: 'bg-purple-100 text-purple-700 border-purple-300'
      };
    default:
      return {
        label: 'Unknown',
        icon: <User className="w-4 h-4" />,
        className: 'bg-slate-100 text-slate-700'
      };
  }
}

function getHealthStatusInfo(status: string) {
  switch (status) {
    case 'stable':
      return {
        label: 'Stable',
        icon: <CheckCircle2 className="w-4 h-4" />,
        className: 'bg-emerald-100 text-emerald-700'
      };
    case 'improving':
      return {
        label: 'Improving',
        icon: <TrendingUp className="w-4 h-4" />,
        className: 'bg-blue-100 text-blue-700'
      };
    case 'needs_attention':
      return {
        label: 'Needs Attention',
        icon: <AlertCircle className="w-4 h-4" />,
        className: 'bg-orange-100 text-orange-700'
      };
    default:
      return {
        label: 'Unknown',
        icon: <User className="w-4 h-4" />,
        className: 'bg-slate-100 text-slate-700'
      };
  }
}

function getRelationIcon(relation: string) {
  switch (relation) {
    case 'parent': return '👨‍👩‍👧‍👦';
    case 'spouse': return '💕';
    case 'child': return '👶';
    case 'patient': return '🏥';
    case 'family': return '👥';
    default: return '👤';
  }
}