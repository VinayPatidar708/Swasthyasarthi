import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, User, UserCheck, Heart, X, Clock, CheckCircle, Pill, Calendar, Activity, Settings, LogOut, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Reminder {
  id: string;
  type: 'medication' | 'appointment' | 'exercise' | 'vitals' | 'checkup';
  title: string;
  description: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed?: boolean;
  icon: React.ReactNode;
  color: string;
}

const reminders: Reminder[] = [
  {
    id: '1',
    type: 'medication',
    title: 'Take Morning Medication',
    description: 'Metformin 500mg with breakfast',
    time: 'Due now',
    priority: 'high',
    icon: <Pill className="w-4 h-4" />,
    color: 'text-red-600'
  },
  {
    id: '2',
    type: 'vitals',
    title: 'Log Blood Pressure',
    description: 'Daily BP reading for tracking',
    time: 'Due in 2 hours',
    priority: 'medium',
    icon: <Heart className="w-4 h-4" />,
    color: 'text-orange-600'
  },
  {
    id: '3',
    type: 'exercise',
    title: 'Evening Walk',
    description: '30-minute neighborhood walk',
    time: 'Scheduled for 6:00 PM',
    priority: 'medium',
    icon: <Activity className="w-4 h-4" />,
    color: 'text-emerald-600'
  },
  {
    id: '4',
    type: 'appointment',
    title: 'Cardiology Follow-up',
    description: 'Dr. Smith - review test results',
    time: 'Tomorrow at 10:30 AM',
    priority: 'high',
    icon: <Calendar className="w-4 h-4" />,
    color: 'text-blue-600'
  },
  {
    id: '5',
    type: 'vitals',
    title: 'Weight Check',
    description: 'Weekly weight measurement',
    time: 'Due tomorrow',
    priority: 'low',
    icon: <Activity className="w-4 h-4" />,
    color: 'text-cyan-600'
  }
];

interface TopBarProps {
  viewMode?: 'patient' | 'caregiver';
  onViewModeChange?: (mode: 'patient' | 'caregiver') => void;
}

export function TopBar({ viewMode = 'patient', onViewModeChange }: TopBarProps) {
  const [hasNewNotification, setHasNewNotification] = useState(true);
  const [reminderDropdownOpen, setReminderDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentReminders, setCurrentReminders] = useState(reminders);

  // Simulate new notification arrival
  useEffect(() => {
    const interval = setInterval(() => {
      setHasNewNotification(prev => !prev);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleCompleteReminder = (id: string) => {
    setCurrentReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: true }
          : reminder
      )
    );
  };

  const handleViewModeChange = (mode: 'patient' | 'caregiver') => {
    onViewModeChange?.(mode);
  };

  const pendingReminders = currentReminders.filter(r => !r.completed);
  const completedReminders = currentReminders.filter(r => r.completed);

  // Get latest 3 reminders for dropdown
  const latestReminders = pendingReminders.slice(0, 3);

  return (
    <div className="fixed top-0 left-20 right-0 h-20  bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm z-30">
      <div className="w-full h-full px-8 flex items-center justify-between">
        {/* Profile Switch & Greeting */}
        <div className="flex items-center gap-6">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 p-2 bg-slate-100/80 rounded-xl">
            <Button
              variant={viewMode === 'patient' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('patient')}
              className={`h-10 px-4 rounded-lg transition-all duration-300 ${
                viewMode === 'patient' 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md' 
                  : 'hover:bg-white/60 text-slate-600'
              }`}
            >
              <User className="w-4 h-4 mr-2" />
              My Health
            </Button>
            <Button
              variant={viewMode === 'caregiver' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('caregiver')}
              className={`h-10 px-4 rounded-lg transition-all duration-300 ${
                viewMode === 'caregiver' 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md' 
                  : 'hover:bg-white/60 text-slate-600'
              }`}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Caregiver View
            </Button>
          </div>

          {/* Greeting & Time */}
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="font-medium text-slate-700">
                {viewMode === 'patient' ? 'Good afternoon, Jatin' : 'Good afternoon, Dr. Jatin'}
              </p>
              <p className="text-sm text-slate-500">
                {viewMode === 'patient' ? 'Taking control of your health journey' : 'Supporting  wellness'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions - Auto Layout with proper padding */}
        <div className="flex items-center gap-4 pr-4">
          {/* Reminders with bounce animation */}
          <motion.div
            animate={hasNewNotification ? {
              y: [0, -4, 0, -2, 0],
              rotate: [0, -10, 0, 10, 0]
            } : {}}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 1]
            }}
            className="relative"
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setReminderDropdownOpen(!reminderDropdownOpen)}
              className="relative w-12 h-12 rounded-xl hover:bg-slate-100/80 transition-all duration-300"
              title={viewMode === 'patient' ? 'Health reminders & updates' : 'Care team notifications'}
            >
              <Bell className={`w-6 h-6 transition-colors duration-300 ${
                pendingReminders.length > 0
                  ? 'text-orange-500 drop-shadow-sm' 
                  : 'text-slate-600 hover:text-slate-700'
              }`} />
              
              {/* Enhanced notification badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: pendingReminders.length > 0 ? 1 : 0.8 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <Badge className={`absolute -top-1 -right-1 text-xs px-2 py-0.5 min-w-0 h-5 border-2 border-white shadow-lg ${
                  pendingReminders.length > 0
                    ? 'bg-gradient-to-r from-red-400 to-red-500 animate-pulse' 
                    : 'bg-gradient-to-r from-slate-400 to-slate-500'
                }`}>
                  {pendingReminders.length}
                </Badge>
              </motion.div>

              {/* Notification glow effect */}
              {pendingReminders.length > 0 && (
                <motion.div
                  className="absolute inset-0 bg-orange-400/20 rounded-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0, 0.3] 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
            </Button>

            {/* Compact Reminder Dropdown */}
            <AnimatePresence>
              {reminderDropdownOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setReminderDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-black/8 z-50 overflow-hidden max-h-96"
                  >
                    {/* Dropdown Header */}
                    <div className="p-4 border-b border-slate-200/60">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-800">Health Reminders</h3>
                        <Badge className={`px-2 py-1 text-xs rounded-lg ${
                          pendingReminders.length > 0 
                            ? 'bg-red-100 text-red-700 border-red-200' 
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                          {pendingReminders.length} pending
                        </Badge>
                      </div>
                    </div>

                    {/* Latest 3 Reminders */}
                    <div className="p-2 space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                      {latestReminders.length > 0 ? (
                        latestReminders.map((reminder, index) => (
                          <motion.div
                            key={reminder.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 bg-white rounded-xl border border-slate-100 hover:bg-slate-50/80 hover:border-slate-200 transition-all duration-200 cursor-pointer group"
                            onClick={() => handleCompleteReminder(reminder.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${reminder.color} group-hover:bg-white`}>
                                {reminder.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-slate-800 text-sm truncate">{reminder.title}</h4>
                                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{reminder.description}</p>
                                <p className={`text-xs font-medium mt-1 ${reminder.color}`}>
                                  {reminder.time}
                                </p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-6 text-center">
                          <div className="text-2xl mb-2">🎉</div>
                          <p className="text-sm font-medium text-emerald-800">All caught up!</p>
                          <p className="text-xs text-slate-600 mt-1">No pending reminders</p>
                        </div>
                      )}
                    </div>

                    {/* View All Button */}
                    <div className="p-3 border-t border-slate-200/60 bg-slate-50/50">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium"
                        onClick={() => {
                          setReminderDropdownOpen(false);
                          // Add navigation to full reminders view here
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View All Reminders
                      </Button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Patient Profile with Auto Layout padding */}
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200 relative">
            <div className="text-right">
              <p className="font-medium text-slate-700">Jatin Patidar</p>
              <p className="text-sm text-slate-500">
                {viewMode === 'patient' ? 'Patient Portal' : 'Caregiver Access'}
              </p>
              <div className="flex items-center gap-2 mt-1 justify-end">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-600 font-medium">Online</span>
              </div>
            </div>
            <Avatar 
              className="w-12 h-12 ring-3 ring-emerald-200 ring-offset-2 ring-offset-white shadow-lg cursor-pointer hover:ring-emerald-300 transition-all"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            >
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b35c?w=100&h=100&fit=crop&crop=face" />
              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-cyan-500 text-white">
                SJ
              </AvatarFallback>
            </Avatar>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {profileDropdownOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg shadow-black/8 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-200/60">
                      <p className="font-medium text-slate-800">Jatin Patidar</p>
                      <p className="text-sm text-slate-500 capitalize">
                        {viewMode === 'patient' ? 'Patient' : 'Caregiver'}
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100/80 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100/80 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}