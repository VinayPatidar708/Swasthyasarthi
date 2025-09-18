import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Shield, 
  Globe, 
  Palette, 
  Activity, 
  Users, 
  Bell, 
  Lock, 
  HelpCircle, 
  Settings,
  Camera,
  Upload,
  X,
  Edit3,
  Save,
  XCircle,
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  RefreshCw,
  LogOut,
  Trash2,
  Plus,
  Check,
  AlertTriangle,
  Download,
  FileText,
  Phone,
  MessageSquare,
  Mail,
  Menu,
  ChevronRight,
  RotateCcw,
  Sun,
  Moon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";

interface SettingsSectionRef {
  [key: string]: HTMLDivElement | null;
}

export function SettingsScreen() {
  const [activeSection, setActiveSection] = useState("profile");
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    firstName: "Jatin",
    lastName: "Patidar",
    email: "jatin.patidar@email.com",
    phone: "+91 8090011253",
    dateOfBirth: "1985-06-15",
    profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b35c?w=100&h=100&fit=crop&crop=face",
    healthConditions: "Hypertension, Type 2 Diabetes",
    emergencyContact: "Vikas - +1 (555) 987-6543"
  });

  // Security settings state
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    biometricEnabled: false,
    smsNotifications: true,
    emailNotifications: true
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    appNotifications: true,
    smsReminders: true,
    emailUpdates: true,
    pushNotifications: true,
    medicationReminders: true,
    appointmentReminders: true,
    healthTips: false,
    emergencyAlerts: true
  });

  // App settings state
  const [appSettings, setAppSettings] = useState({
    language: "en",
    region: "US",
    fontSize: "medium",
    theme: "light"
  });

  // Caregiver state
  const [caregivers, setCaregivers] = useState([
    {
      id: "1",
      name: "Dr. Arun",
      role: "doctor",
      email: "dr.arun@healthcare.com",
      permission: "full_access",
      status: "active",
      addedDate: "2024-01-15"
    },
    {
      id: "2",
      name: "Yashi",
      role: "spouse",
      email: "Yashi.j@email.com",
      permission: "fill_logs",
      status: "active",
      addedDate: "2024-02-01"
    }
  ]);

  const sectionRefs = useRef<SettingsSectionRef>({});
  const mainContentRef = useRef<HTMLDivElement>(null);

  const settingsSections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "language", label: "Language & Region", icon: Globe },
    { id: "theme", label: "Theme & Appearance", icon: Palette },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "caregivers", label: "Caregivers", icon: Users },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "support", label: "Support", icon: HelpCircle },
    { id: "account", label: "Account", icon: Settings }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element && mainContentRef.current) {
      const container = mainContentRef.current;
      const elementTop = element.offsetTop - container.offsetTop - 100;
      
      container.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
      
      setActiveSection(sectionId);
      setSettingsSidebarOpen(false);
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return;

      const container = mainContentRef.current;
      const scrollTop = container.scrollTop;

      for (const section of settingsSections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const elementTop = element.offsetTop - container.offsetTop - 150;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollTop >= elementTop && scrollTop < elementBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    const container = mainContentRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [settingsSections]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    toast.info("Changes cancelled");
  };

  const toggleSecurity = (setting: keyof typeof securitySettings) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!securitySettings[setting] ? 'enabled' : 'disabled'}`);
  };

  const toggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast.success(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${!notificationSettings[setting] ? 'enabled' : 'disabled'}`);
  };

  const handleLanguageChange = (language: string) => {
    setAppSettings(prev => ({ ...prev, language }));
    toast.success("Language updated successfully!");
  };

  const handleThemeToggle = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    setAppSettings(prev => ({ ...prev, theme: newTheme }));
    document.documentElement.classList.toggle('dark', !isDarkMode);
    toast.success(`${newTheme} mode enabled`);
  };

  const handleFontSizeChange = (fontSize: string) => {
    setAppSettings(prev => ({ ...prev, fontSize }));
    toast.success("Font size updated!");
  };

  const handleRemoveCaregiver = (id: string) => {
    setCaregivers(prev => prev.filter(c => c.id !== id));
    toast.success("Caregiver removed successfully");
  };

  const handleSyncData = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Syncing data...',
        success: 'Data synced successfully!',
        error: 'Failed to sync data'
      }
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return '👨‍⚕️';
      case 'nurse': return '👩‍⚕️';
      case 'spouse': return '💕';
      case 'parent': return '👨‍👩‍👧‍👦';
      case 'child': return '👶';
      default: return '👤';
    }
  };

  const getPermissionInfo = (permission: string) => {
    switch (permission) {
      case 'view_only':
        return { label: 'View Only', className: 'bg-blue-100 text-blue-700' };
      case 'fill_logs':
        return { label: 'Fill Logs', className: 'bg-emerald-100 text-emerald-700' };
      case 'full_access':
        return { label: 'Full Access', className: 'bg-purple-100 text-purple-700' };
      default:
        return { label: 'Unknown', className: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="ml-20 pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="flex h-[calc(100vh-5rem)]">
        {/* Settings Local Sidebar */}
        <div className="hidden lg:block w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Settings</h2>
                <p className="text-sm text-slate-500">SwasthyaSarthi</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {settingsSections.map((section) => (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
                {activeSection === section.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Mobile Settings Header */}
        <div className="lg:hidden fixed top-20 left-20 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-bold text-slate-800">Settings</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Settings Sidebar Overlay */}
        <AnimatePresence>
          {settingsSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setSettingsSidebarOpen(false)}
              />

              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed top-0 left-20 h-full w-80 bg-white/95 backdrop-blur-xl border-r border-slate-200 shadow-xl z-50 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-slate-800">Settings</h2>
                        <p className="text-sm text-slate-500">SwasthyaSarthi</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSettingsSidebarOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <nav className="p-4 space-y-2">
                  {settingsSections.map((section) => (
                    <motion.button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200'
                          : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                      {activeSection === section.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </motion.button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Settings Content */}
        <div className="flex-1 h-full">
          <div
            ref={mainContentRef}
            className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent pt-16 lg:pt-0"
          >
            <div className="max-w-4xl mx-auto p-6 space-y-8">
              {/* Profile Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.profile = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-blue-200">
                          <AvatarImage src={userProfile.profilePhoto} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                            {userProfile.firstName[0]}{userProfile.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-white shadow-md"
                          onClick={() => setShowPhotoDialog(true)}
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800">
                              {userProfile.firstName} {userProfile.lastName}
                            </h3>
                            <p className="text-slate-600">{userProfile.email}</p>
                          </div>
                          {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)} variant="outline">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Profile
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button onClick={handleSaveProfile} size="sm">
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </Button>
                              <Button onClick={handleCancelEdit} variant="outline" size="sm">
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                value={userProfile.firstName}
                                onChange={(e) =>
                                  setUserProfile((prev) => ({ ...prev, firstName: e.target.value }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                value={userProfile.lastName}
                                onChange={(e) =>
                                  setUserProfile((prev) => ({ ...prev, lastName: e.target.value }))
                                }
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={userProfile.email}
                                onChange={(e) =>
                                  setUserProfile((prev) => ({ ...prev, email: e.target.value }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={userProfile.phone}
                                onChange={(e) =>
                                  setUserProfile((prev) => ({ ...prev, phone: e.target.value }))
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="dateOfBirth">Date of Birth</Label>
                              <Input
                                id="dateOfBirth"
                                type="date"
                                value={userProfile.dateOfBirth}
                                onChange={(e) =>
                                  setUserProfile((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                                }
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="healthConditions">Health Conditions</Label>
                              <Textarea
                                id="healthConditions"
                                value={userProfile.healthConditions}
                                onChange={(e) =>
                                  setUserProfile((prev) => ({ ...prev, healthConditions: e.target.value }))
                                }
                                placeholder="List your current health conditions..."
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="emergencyContact">Emergency Contact</Label>
                              <Input
                                id="emergencyContact"
                                value={userProfile.emergencyContact}
                                onChange={(e) =>
                                  setUserProfile((prev) => ({ ...prev, emergencyContact: e.target.value }))
                                }
                                placeholder="Name - Phone Number"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600">{userProfile.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600">{userProfile.healthConditions}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-600">Emergency: {userProfile.emergencyContact}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.security = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Security</h1>
                </div>

                <div className="grid gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                    <CardHeader>
                      <CardTitle>Authentication</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-slate-600">Add an extra layer of security</p>
                        </div>
                        <Switch
                          checked={securitySettings.twoFactorEnabled}
                          onCheckedChange={() => toggleSecurity('twoFactorEnabled')}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Biometric Login</h4>
                          <p className="text-sm text-slate-600">Use fingerprint or face recognition</p>
                        </div>
                        <Switch
                          checked={securitySettings.biometricEnabled}
                          onCheckedChange={() => toggleSecurity('biometricEnabled')}
                        />
                      </div>
                      <Separator />
                      <Button variant="outline" className="w-full">
                        <Shield className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                    <CardHeader>
                      <CardTitle>Logged-in Devices</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">iPhone 14 Pro</h4>
                          <p className="text-sm text-slate-600">Current device • Last active now</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Monitor className="w-5 h-5 text-slate-600" />
                        <div className="flex-1">
                          <h4 className="font-medium">MacBook Pro</h4>
                          <p className="text-sm text-slate-600">Last active 2 hours ago</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Sign Out
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Language & Region Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.language = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Language & Region</h1>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={appSettings.language} onValueChange={handleLanguageChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="fr">Français</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="region">Region</Label>
                        <Select
                          value={appSettings.region}
                          onValueChange={(value) => {
                            setAppSettings((prev) => ({ ...prev, region: value }));
                            toast.success("Region updated successfully!");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="IN">India</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Theme & Appearance Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.theme = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Palette className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Theme & Appearance</h1>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Dark Mode</h4>
                        <p className="text-sm text-slate-600">Toggle between light and dark themes</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Sun className="w-4 h-4 text-amber-500" />
                        <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
                        <Moon className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label>Font Size</Label>
                      <div className="flex gap-2 mt-2">
                        {['small', 'medium', 'large'].map((size) => (
                          <Button
                            key={size}
                            variant={appSettings.fontSize === size ? 'default' : 'outline'}
                            onClick={() => handleFontSizeChange(size)}
                            className="capitalize"
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.activity = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Activity className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Activity</h1>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                    <CardHeader>
                      <CardTitle>Health Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-600 mb-2">12</div>
                        <p className="text-slate-600">Days Active</p>
                        <Progress value={85} className="mt-4" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                    <CardHeader>
                      <CardTitle>Last Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">2 hours ago</div>
                        <p className="text-slate-600">Logged vitals</p>
                        <div className="flex justify-center mt-4">
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>

              {/* Caregivers Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.caregivers = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    <h1 className="text-3xl font-bold text-slate-800">Caregivers</h1>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Caregiver
                  </Button>
                </div>

                <div className="space-y-4">
                  {caregivers.map((caregiver) => (
                    <Card key={caregiver.id} className="bg-white/80 backdrop-blur-sm border border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{getRoleIcon(caregiver.role)}</div>
                            <div>
                              <h4 className="font-medium">{caregiver.name}</h4>
                              <p className="text-sm text-slate-600">{caregiver.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getPermissionInfo(caregiver.permission).className}>
                                  {getPermissionInfo(caregiver.permission).label}
                                </Badge>
                                <Badge className="bg-green-100 text-green-700">
                                  {caregiver.status === 'active' ? 'Active' : 'Revoked'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Caregiver</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove {caregiver.name} from your caregivers list?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveCaregiver(caregiver.id)}>
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>

              {/* Notifications Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.notifications = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                  <CardContent className="p-6 space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {key === 'appNotifications' && 'Receive in-app notifications'}
                              {key === 'smsReminders' && 'Get SMS reminders for medications'}
                              {key === 'emailUpdates' && 'Receive email updates about your health'}
                              {key === 'pushNotifications' && 'Allow push notifications on your device'}
                              {key === 'medicationReminders' && 'Reminders for medication times'}
                              {key === 'appointmentReminders' && 'Upcoming appointment alerts'}
                              {key === 'healthTips' && 'Daily health tips and advice'}
                              {key === 'emergencyAlerts' && 'Critical health alerts'}
                            </p>
                          </div>
                          <Switch
                            checked={value}
                            onCheckedChange={() => toggleNotification(key as keyof typeof notificationSettings)}
                          />
                        </div>
                        {key !== 'emergencyAlerts' && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Privacy Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.privacy = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Privacy</h1>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                  <CardContent className="p-6 space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Consent History
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle className="w-4 h-4 mr-2" />
                      Revoke All Consents
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.support = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Support</h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <HelpCircle className="w-6 h-6" />
                    FAQ
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <MessageSquare className="w-6 h-6" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Mail className="w-6 h-6" />
                    Feedback
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-red-50 border-red-200 text-red-600 hover:bg-red-100">
                    <Phone className="w-6 h-6" />
                    Emergency Helpline
                  </Button>
                </div>
              </motion.div>

              {/* Account Section */}
              <motion.div
                ref={(el) => (sectionRefs.current.account = el)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-20"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-blue-600" />
                  <h1 className="text-3xl font-bold text-slate-800">Account</h1>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border border-slate-200">
                  <CardContent className="p-6 space-y-4">
                    <Button onClick={handleSyncData} variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}