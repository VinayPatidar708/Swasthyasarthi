import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Check, 
  X, 
  Shield, 
  Eye, 
  Edit3, 
  Settings, 
  FileText, 
  Clock, 
  UserCheck,
  UserMinus,
  ChevronRight,
  Heart,
  Stethoscope,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Caregiver {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'revoked';
  permissions: {
    viewOnly: boolean;
    fillLogs: boolean;
    fullAccess: boolean;
  };
  dateAdded: string;
  lastActive: string;
}

export function CaregiverScreen() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'existing' | 'new' | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    role: '',
    permissions: {
      viewOnly: true,
      fillLogs: false,
      fullAccess: false
    }
  });
  
  // Mock caregiver data
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      id: '1',
      name: 'Dr. Arun',
      email: 'emily.rodriguez@hospital.com',
      role: 'Doctor',
      status: 'active',
      permissions: { viewOnly: false, fillLogs: true, fullAccess: true },
      dateAdded: 'Jan 15, 2024',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Yashi',
      email: 'michael.t@email.com',
      role: 'Spouse',
      status: 'active',
      permissions: { viewOnly: true, fillLogs: true, fullAccess: false },
      dateAdded: 'Jan 10, 2024',
      lastActive: 'Yesterday'
    },
    {
      id: '3',
      name: 'Nurse Vikas',
      email: 'Vikas.clark@hospital.com',
      role: 'Nurse',
      status: 'revoked',
      permissions: { viewOnly: true, fillLogs: true, fullAccess: false },
      dateAdded: 'Dec 20, 2023',
      lastActive: '1 week ago'
    }
  ]);

  const roles = [
    { value: 'parent', label: 'Parent', icon: '👥' },
    { value: 'spouse', label: 'Spouse', icon: '💕' },
    { value: 'child', label: 'Child', icon: '👶' },
    { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { value: 'caregiver', label: 'Caregiver', icon: '🤝' }
  ];

  const resetForm = () => {
    setStep(1);
    setUserType(null);
    setFormData({
      username: '',
      name: '',
      email: '',
      role: '',
      permissions: { viewOnly: true, fillLogs: false, fullAccess: false }
    });
  };

  const handlePermissionChange = (permission: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value,
        // Auto-adjust other permissions based on hierarchy
        ...(permission === 'fullAccess' && value ? 
          { viewOnly: true, fillLogs: true } : 
          permission === 'viewOnly' && !value ? 
          { fillLogs: false, fullAccess: false } : {})
      }
    }));
  };

  const toggleCaregiverStatus = (id: string) => {
    setCaregivers(prev => 
      prev.map(caregiver => 
        caregiver.id === id 
          ? { ...caregiver, status: caregiver.status === 'active' ? 'revoked' : 'active' }
          : caregiver
      )
    );
  };

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Caregiver Management 👥
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Manage your care team and their access permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-200 shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-emerald-600">
                    {caregivers.filter(c => c.status === 'active').length} Active
                  </div>
                  <div className="text-sm text-emerald-500">Caregivers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Add Caregiver Form */}
        <div className="col-span-12 lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800">
                  <UserPlus className="w-6 h-6" />
                  Add New Caregiver
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    Step {step} of 3
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Choose User Type
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserType('existing')}
                            className={`
                              p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                              ${userType === 'existing' 
                                ? 'border-emerald-500 bg-emerald-50' 
                                : 'border-slate-200 bg-white hover:border-emerald-300'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                                <Search className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-800">Existing User</h4>
                                <p className="text-sm text-slate-600">Add someone who already has an account</p>
                              </div>
                              {userType === 'existing' && (
                                <Check className="w-5 h-5 text-emerald-600" />
                              )}
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setUserType('new')}
                            className={`
                              p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                              ${userType === 'new' 
                                ? 'border-emerald-500 bg-emerald-50' 
                                : 'border-slate-200 bg-white hover:border-emerald-300'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white">
                                <UserPlus className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-800">New User</h4>
                                <p className="text-sm text-slate-600">Invite someone to create a new account</p>
                              </div>
                              {userType === 'new' && (
                                <Check className="w-5 h-5 text-emerald-600" />
                              )}
                            </div>
                          </motion.div>
                        </div>

                        {userType && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 space-y-3"
                          >
                            {userType === 'existing' ? (
                              <div>
                                <Label htmlFor="username">Username or ID</Label>
                                <Input
                                  id="username"
                                  placeholder="Enter username or user ID"
                                  value={formData.username}
                                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                  className="mt-1"
                                />
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div>
                                  <Label htmlFor="name">Full Name</Label>
                                  <Input
                                    id="name"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="email">Email Address</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          onClick={() => setStep(2)}
                          disabled={!userType || (userType === 'existing' && !formData.username) || 
                                   (userType === 'new' && (!formData.name || !formData.email))}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Select Relationship & Role
                        </h3>
                        <Label htmlFor="role">Relationship to Patient</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Choose relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <span>{role.icon}</span>
                                  <span>{role.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setStep(1)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => setStep(3)}
                          disabled={!formData.role}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                          Set Permissions
                        </h3>
                        
                        <div className="space-y-4 bg-white rounded-xl p-4 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Eye className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-800">View Only</h4>
                                <p className="text-sm text-slate-600">Can view health data and reports</p>
                              </div>
                            </div>
                            <Switch
                              checked={formData.permissions.viewOnly}
                              onCheckedChange={(checked) => handlePermissionChange('viewOnly', checked)}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Edit3 className="w-4 h-4 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-800">Fill Logs</h4>
                                <p className="text-sm text-slate-600">Can add health logs and update data</p>
                              </div>
                            </div>
                            <Switch
                              checked={formData.permissions.fillLogs}
                              onCheckedChange={(checked) => handlePermissionChange('fillLogs', checked)}
                              disabled={!formData.permissions.viewOnly}
                            />
                          </div>

                          <Separator />

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Settings className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-800">Full Access</h4>
                                <p className="text-sm text-slate-600">Can manage settings and other caregivers</p>
                              </div>
                            </div>
                            <Switch
                              checked={formData.permissions.fullAccess}
                              onCheckedChange={(checked) => handlePermissionChange('fullAccess', checked)}
                              disabled={!formData.permissions.fillLogs}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setStep(2)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={resetForm}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                          Add Caregiver
                          <Check className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Caregiver List */}
        <div className="col-span-12 lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-slate-700" />
                  Current Caregivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All ({caregivers.length})</TabsTrigger>
                    <TabsTrigger value="active">Active ({caregivers.filter(c => c.status === 'active').length})</TabsTrigger>
                    <TabsTrigger value="revoked">Revoked ({caregivers.filter(c => c.status === 'revoked').length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    <div className="space-y-4">
                      {caregivers.map((caregiver, index) => (
                        <CaregiverCard 
                          key={caregiver.id} 
                          caregiver={caregiver} 
                          index={index}
                          onToggleStatus={toggleCaregiverStatus}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="active" className="mt-6">
                    <div className="space-y-4">
                      {caregivers.filter(c => c.status === 'active').map((caregiver, index) => (
                        <CaregiverCard 
                          key={caregiver.id} 
                          caregiver={caregiver} 
                          index={index}
                          onToggleStatus={toggleCaregiverStatus}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="revoked" className="mt-6">
                    <div className="space-y-4">
                      {caregivers.filter(c => c.status === 'revoked').map((caregiver, index) => (
                        <CaregiverCard 
                          key={caregiver.id} 
                          caregiver={caregiver} 
                          index={index}
                          onToggleStatus={toggleCaregiverStatus}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CaregiverCard({ caregiver, index, onToggleStatus }: { 
  caregiver: Caregiver; 
  index: number; 
  onToggleStatus: (id: string) => void;
}) {
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'doctor': return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'nurse': return <Heart className="w-5 h-5 text-pink-600" />;
      case 'spouse': return <Users className="w-5 h-5 text-purple-600" />;
      default: return <Users className="w-5 h-5 text-slate-600" />;
    }
  };

  const getPermissionText = (permissions: Caregiver['permissions']) => {
    if (permissions.fullAccess) return 'Full Access';
    if (permissions.fillLogs) return 'Fill Logs';
    if (permissions.viewOnly) return 'View Only';
    return 'No Access';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className={`
        p-4 rounded-xl border-2 transition-all duration-300
        ${caregiver.status === 'active' 
          ? 'bg-white border-emerald-200 hover:border-emerald-300' 
          : 'bg-slate-50 border-slate-200 opacity-75'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
            {getRoleIcon(caregiver.role)}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{caregiver.name}</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-3 h-3" />
              <span>{caregiver.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className="text-xs bg-blue-100 text-blue-700"
              >
                {caregiver.role}
              </Badge>
              <Badge 
                variant="secondary" 
                className={`
                  text-xs
                  ${caregiver.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                  }
                `}
              >
                {caregiver.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-700">
              {getPermissionText(caregiver.permissions)}
            </div>
            <div className="text-xs text-slate-500">
              Last active: {caregiver.lastActive}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
              <FileText className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleStatus(caregiver.id)}
              className={
                caregiver.status === 'active' 
                  ? 'text-red-500 hover:text-red-700' 
                  : 'text-emerald-500 hover:text-emerald-700'
              }
            >
              {caregiver.status === 'active' ? 
                <UserMinus className="w-4 h-4" /> : 
                <UserCheck className="w-4 h-4" />
              }
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}