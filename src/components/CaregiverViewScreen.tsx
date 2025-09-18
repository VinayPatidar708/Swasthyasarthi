import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Heart, 
  Droplets, 
  Scale, 
  Activity, 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Eye, 
  Shield, 
  ChevronDown,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Pill,
  Utensils,
  FileText,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { HealthMetrics } from "./HealthMetrics";
import { HealthGraphs } from "./HealthGraphs";
import { HumanFigure } from "./HumanFigure";
import { HealthActivityStreak } from "./HealthActivityStreak";
import { Gamification } from "./Gamification";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  profilePicture: string;
  status: 'stable' | 'improving' | 'needs_attention';
}

interface CaregiverPermission {
  patientId: string;
  level: 'view_only' | 'fill_logs' | 'full_access';
  status: 'active' | 'revoked';
}

interface VitalReading {
  id: string;
  type: 'blood_pressure' | 'glucose' | 'weight' | 'heart_rate';
  value: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  timestamp: string;
  editable: boolean;
}

interface LogEntry {
  id: string;
  type: 'symptom' | 'medication' | 'activity' | 'diet';
  title: string;
  description: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high';
}

export function CaregiverViewScreen() {
  // Mock caregiver data
  const caregiverPatients: Patient[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 65,
      condition: 'Hypertension, Type 2 Diabetes',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b35c?w=100&h=100&fit=crop&crop=face',
      status: 'improving'
    },
    {
      id: '2', 
      name: 'Robert Chen',
      age: 72,
      condition: 'Cardiac Arrhythmia',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      status: 'stable'
    }
  ];

  const caregiverPermissions: CaregiverPermission[] = [
    { patientId: '1', level: 'full_access', status: 'active' },
    { patientId: '2', level: 'view_only', status: 'active' }
  ];

  const [selectedPatientId, setSelectedPatientId] = useState('1');
  const [currentTab, setCurrentTab] = useState('overview');

  const selectedPatient = caregiverPatients.find(p => p.id === selectedPatientId);
  const currentPermission = caregiverPermissions.find(p => p.patientId === selectedPatientId);
  const permissionLevel = currentPermission?.level || 'view_only';
  const permissionStatus = currentPermission?.status || 'revoked';

  // Mock vitals data
  const vitalsData: VitalReading[] = [
    {
      id: '1',
      type: 'blood_pressure',
      value: '118/76',
      status: 'normal',
      timestamp: '2 hours ago',
      editable: permissionLevel !== 'view_only'
    },
    {
      id: '2',
      type: 'glucose',
      value: '95 mg/dL',
      status: 'normal',
      timestamp: '4 hours ago',
      editable: permissionLevel !== 'view_only'
    },
    {
      id: '3',
      type: 'weight',
      value: '156.2 lbs',
      status: 'normal',
      timestamp: 'Today',
      editable: permissionLevel !== 'view_only'
    },
    {
      id: '4',
      type: 'heart_rate',
      value: '72 bpm',
      status: 'normal',
      timestamp: '1 hour ago',
      editable: permissionLevel !== 'view_only'
    }
  ];

  // Mock logs data
  const logsData: LogEntry[] = [
    {
      id: '1',
      type: 'medication',
      title: 'Metformin taken',
      description: '500mg with breakfast as prescribed',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'symptom',
      title: 'Mild headache',
      description: 'Reported mild headache, resolved with rest',
      timestamp: '4 hours ago',
      severity: 'low'
    },
    {
      id: '3',
      type: 'activity',
      title: '30-minute walk',
      description: 'Evening walk in the neighborhood',
      timestamp: 'Yesterday',
    },
    {
      id: '4',
      type: 'diet',
      title: 'Balanced lunch',
      description: 'Grilled chicken salad, low sodium',
      timestamp: 'Yesterday'
    }
  ];

  const getPermissionBadge = () => {
    const badgeConfig = {
      view_only: { label: 'View Only', className: 'bg-blue-100 text-blue-700 border-blue-300' },
      fill_logs: { label: 'Fill Logs', className: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
      full_access: { label: 'Full Access', className: 'bg-purple-100 text-purple-700 border-purple-300' }
    };

    const config = badgeConfig[permissionLevel];
    return (
      <Badge className={`${config.className} font-medium`}>
        <Shield className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      improving: { label: 'Improving', className: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
      stable: { label: 'Stable', className: 'bg-blue-100 text-blue-700', icon: Activity },
      needs_attention: { label: 'Needs Attention', className: 'bg-orange-100 text-orange-700', icon: AlertCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.className} font-medium`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return <Heart className="w-5 h-5 text-red-600" />;
      case 'glucose': return <Droplets className="w-5 h-5 text-orange-600" />;
      case 'weight': return <Scale className="w-5 h-5 text-purple-600" />;
      case 'heart_rate': return <Activity className="w-5 h-5 text-pink-600" />;
      default: return <Activity className="w-5 h-5 text-slate-600" />;
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

  const canEdit = permissionLevel !== 'view_only';
  const hasFullAccess = permissionLevel === 'full_access';

  if (permissionStatus === 'revoked') {
    return (
      <div className="ml-20 p-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Access Revoked</h3>
            <p className="text-slate-600 mb-4">
              Your access to patient information has been revoked. Please contact the administrator for assistance.
            </p>
            <Badge className="bg-red-100 text-red-700 border-red-300">
              Status: Revoked
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="ml-20 p-8 space-y-8">
      {/* Header with Patient Selection */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Patient Care Dashboard 👩‍⚕️
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Monitoring and supporting patient health
              </p>
            </div>
            
            {/* Patient Selection Dropdown */}
            {caregiverPatients.length > 1 && (
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger className="w-64 bg-white border-emerald-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {caregiverPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={patient.profilePicture} />
                          <AvatarFallback className="text-xs">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{patient.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {getPermissionBadge()}
            <div className="text-right">
              <p className="text-sm text-slate-500">Caregiver Access</p>
              <p className="font-medium text-slate-700">Dr. Emily Rodriguez</p>
            </div>
          </div>
        </div>
      </motion.div>

      {selectedPatient && (
        <>
          {/* Patient Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800">
                  <User className="w-6 h-6" />
                  Patient Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 ring-4 ring-emerald-200">
                    <AvatarImage src={selectedPatient.profilePicture} />
                    <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-700">
                      {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800">{selectedPatient.name}</h2>
                    <p className="text-slate-600 mb-2">Age: {selectedPatient.age} years</p>
                    <p className="text-slate-700 mb-3">
                      <strong>Condition:</strong> {selectedPatient.condition}
                    </p>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(selectedPatient.status)}
                      <Badge className="bg-slate-100 text-slate-700">
                        <Clock className="w-3 h-3 mr-1" />
                        Last Updated: 2 hours ago
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                {hasFullAccess && <TabsTrigger value="insights">Insights</TabsTrigger>}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-8 space-y-8">
                {/* Quick Vitals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {vitalsData.map((vital, index) => (
                    <motion.div
                      key={vital.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className={`
                        transition-all duration-300 hover:shadow-lg
                        ${vital.status === 'normal' ? 'border-emerald-200' :
                          vital.status === 'high' || vital.status === 'low' ? 'border-yellow-200' :
                          'border-red-200'
                        }
                      `}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                              {getVitalIcon(vital.type)}
                            </div>
                            {canEdit && vital.editable && (
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                          
                          <h3 className="font-medium text-slate-800 capitalize mb-2">
                            {vital.type.replace('_', ' ')}
                          </h3>
                          <p className="text-2xl font-bold text-slate-900 mb-2">
                            {vital.value}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <Badge 
                              className={`text-xs ${
                                vital.status === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                                vital.status === 'high' || vital.status === 'low' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}
                            >
                              {vital.status}
                            </Badge>
                            <span className="text-xs text-slate-500">{vital.timestamp}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Activity</CardTitle>
                      {canEdit && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Entry
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {logsData.slice(0, 5).map((log, index) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                            {getLogIcon(log.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-slate-800">{log.title}</h4>
                              {log.severity && (
                                <Badge 
                                  className={`text-xs ${
                                    log.severity === 'low' ? 'bg-blue-100 text-blue-700' :
                                    log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {log.severity}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{log.description}</p>
                            <p className="text-xs text-slate-500">{log.timestamp}</p>
                          </div>
                          {canEdit && (
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vitals Tab */}
              <TabsContent value="vitals" className="mt-8">
                <div className="space-y-8">
                  <HealthMetrics />
                  {hasFullAccess && (
                    <div className="grid grid-cols-12 gap-8">
                      <div className="col-span-12 lg:col-span-8">
                        <HealthGraphs />
                      </div>
                      <div className="col-span-12 lg:col-span-4">
                        <HumanFigure />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Logs Tab */}
              <TabsContent value="logs" className="mt-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Patient History & Logs</CardTitle>
                      {canEdit && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Filter
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            New Entry
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {logsData.map((log, index) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start gap-4 p-6 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all duration-200"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                            {getLogIcon(log.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-slate-800">{log.title}</h4>
                              <Badge className="text-xs bg-slate-100 text-slate-600 capitalize">
                                {log.type}
                              </Badge>
                              {log.severity && (
                                <Badge 
                                  className={`text-xs ${
                                    log.severity === 'low' ? 'bg-blue-100 text-blue-700' :
                                    log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {log.severity}
                                </Badge>
                              )}
                            </div>
                            <p className="text-slate-600 mb-3">{log.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {log.timestamp}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Home
                              </span>
                            </div>
                          </div>
                          {canEdit && (
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Insights Tab (Full Access Only) */}
              {hasFullAccess && (
                <TabsContent value="insights" className="mt-8 space-y-8">
                  <HealthActivityStreak />
                  <Gamification />
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
        </>
      )}
    </div>
  );
}