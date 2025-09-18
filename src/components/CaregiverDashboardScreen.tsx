import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Eye, 
  Edit3, 
  Shield, 
  Clock, 
  FileText, 
  Heart, 
  TrendingUp, 
  User, 
  Calendar, 
  ChevronRight, 
  Settings,
  Activity,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

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
    status: 'normal' | 'elevated' | 'critical';
  };
  urgentAlerts: number;
}

export function CaregiverDashboardScreen() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Mock caregiver assignments
  const patientAssignments: PatientAssignment[] = [
    {
      id: '1',
      name: 'Ritik Kumar',
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
        status: 'elevated'
      },
      urgentAlerts: 1
    },
    {
      id: '2',
      name: 'Yash jain',
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
        status: 'normal'
      },
      urgentAlerts: 2
    },
    {
      id: '4',
      name: 'Vinay Patidar',
      age: 65,
      relation: 'patient',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      status: 'revoked',
      permission: 'view_only',
      lastActivity: '1 week ago',
      healthStatus: 'stable',
      condition: 'Cardiac Monitoring',
      recentVitals: {
        bloodPressure: '125/80',
        glucose: '110 mg/dL',
        status: 'normal'
      },
      urgentAlerts: 0
    }
  ];

  const activePatients = patientAssignments.filter(p => p.status === 'active');
  const revokedPatients = patientAssignments.filter(p => p.status === 'revoked');
  const totalUrgentAlerts = activePatients.reduce((sum, p) => sum + p.urgentAlerts, 0);

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

  return (
    <div className="ml-20 p-8 space-y-8">
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
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/80 backdrop-blur-md rounded-xl border border-emerald-200 shadow-lg">
                <div className="text-xl font-bold text-emerald-600">{activePatients.length}</div>
                <div className="text-xs text-emerald-500">Active Patients</div>
              </div>
              <div className="text-center p-3 bg-white/80 backdrop-blur-md rounded-xl border border-orange-200 shadow-lg">
                <div className="text-xl font-bold text-orange-600">{totalUrgentAlerts}</div>
                <div className="text-xs text-orange-500">Urgent Alerts</div>
              </div>
              <div className="text-center p-3 bg-white/80 backdrop-blur-md rounded-xl border border-blue-200 shadow-lg">
                <div className="text-xl font-bold text-blue-600">24/7</div>
                <div className="text-xs text-blue-500">Monitoring</div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium text-slate-700">Dr. Arun</p>
              <p className="text-sm text-slate-500">Primary Caregiver</p>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-600 font-medium">On Duty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800">Daily Overview</h3>
                <p className="text-emerald-700">All patients showing normal vitals. 2 medication reminders due.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">
              <FileText className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Active Patients Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Active Patients</h2>
          <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1">
            {activePatients.length} Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <PatientCard 
                patient={patient} 
                onSelect={setSelectedPatient}
                isSelected={selectedPatient === patient.id}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Revoked Access Section */}
      {revokedPatients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Separator className="my-8" />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Revoked Access</h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1">
              {revokedPatients.length} Revoked
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {revokedPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <PatientCard 
                  patient={patient} 
                  onSelect={setSelectedPatient}
                  isSelected={selectedPatient === patient.id}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-600" />
              Recent Activity Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activePatients.slice(0, 3).map((patient) => (
                <div key={patient.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={patient.profilePicture} />
                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{patient.name}</p>
                    <p className="text-sm text-slate-600">Last activity: {patient.lastActivity}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-700">
                      BP: {patient.recentVitals.bloodPressure}
                    </div>
                    <div className="text-xs text-slate-500">
                      Glucose: {patient.recentVitals.glucose}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function PatientCard({ 
  patient, 
  onSelect, 
  isSelected 
}: { 
  patient: PatientAssignment; 
  onSelect: (id: string) => void;
  isSelected: boolean;
}) {
  const permissionInfo = getPermissionInfo(patient.permission);
  const healthStatusInfo = getHealthStatusInfo(patient.healthStatus);
  const relationIcon = getRelationIcon(patient.relation);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(patient.id)}
      className={`
        cursor-pointer transition-all duration-300
        ${patient.status === 'revoked' ? 'opacity-60' : ''}
        ${isSelected ? 'ring-2 ring-emerald-400' : ''}
      `}
    >
      <Card className={`
        relative overflow-hidden
        ${patient.status === 'active' 
          ? 'border-emerald-200 hover:border-emerald-300 hover:shadow-lg' 
          : 'border-slate-200 bg-slate-50'
        }
      `}>
        {/* Urgent Alerts Indicator */}
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
              
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  className={`text-xs ${
                    patient.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {patient.status === 'active' ? 'Active' : 'Revoked'}
                </Badge>
                
                <Badge className={`text-xs ${healthStatusInfo.className}`}>
                  {healthStatusInfo.icon}
                  <span className="ml-1">{healthStatusInfo.label}</span>
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Permission Level */}
          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Access Level</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Audit Log">
                <FileText className="w-3 h-3" />
              </Button>
            </div>
            <Badge className={`${permissionInfo.className} font-medium`}>
              {permissionInfo.icon}
              <span className="ml-2">{permissionInfo.label}</span>
            </Badge>
            <p className="text-xs text-slate-500 mt-1">{permissionInfo.description}</p>
          </div>

          {/* Health Condition */}
          <div>
            <span className="text-sm font-medium text-slate-700 block mb-1">Current Condition</span>
            <p className="text-sm text-slate-600">{patient.condition}</p>
          </div>

          {/* Recent Vitals */}
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Recent Vitals</span>
              <Badge 
                className={`text-xs ${
                  patient.recentVitals.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                  patient.recentVitals.status === 'elevated' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}
              >
                {patient.recentVitals.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-500">BP:</span>
                <span className="ml-1 font-medium">{patient.recentVitals.bloodPressure}</span>
              </div>
              <div>
                <span className="text-slate-500">Glucose:</span>
                <span className="ml-1 font-medium">{patient.recentVitals.glucose}</span>
              </div>
            </div>
          </div>

          {/* Last Activity */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Last activity:</span>
            <span className="font-medium text-slate-700">{patient.lastActivity}</span>
          </div>

          {/* Action Button */}
          <Button 
            className={`w-full ${
              patient.status === 'active' 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'bg-slate-400 cursor-not-allowed'
            }`}
            disabled={patient.status === 'revoked'}
          >
            {patient.status === 'active' ? 'View Dashboard' : 'Access Revoked'}
            {patient.status === 'active' && <ChevronRight className="w-4 h-4 ml-2" />}
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