import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Pill, 
  Calendar, 
  Activity, 
  Heart, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
  bgColor: string;
}

const reminders: Reminder[] = [
  {
    id: '1',
    type: 'medication',
    title: 'Take Morning Medication',
    description: 'Metformin 500mg with breakfast - helps manage blood sugar levels',
    time: 'Due now',
    priority: 'high',
    icon: <Pill className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  },
  {
    id: '2',
    type: 'vitals',
    title: 'Log Blood Pressure',
    description: 'Daily BP reading - track your cardiovascular health progress',
    time: 'Due in 2 hours',
    priority: 'medium',
    icon: <Heart className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200'
  },
  {
    id: '3',
    type: 'exercise',
    title: 'Evening Walk',
    description: '30-minute walk around the neighborhood - great for your heart!',
    time: 'Scheduled for 6:00 PM',
    priority: 'medium',
    icon: <Activity className="w-5 h-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200'
  },
  {
    id: '4',
    type: 'appointment',
    title: 'Cardiology Follow-up',
    description: 'Dr. Smith appointment to review your recent test results',
    time: 'Tomorrow at 10:30 AM',
    priority: 'high',
    icon: <Calendar className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  {
    id: '5',
    type: 'checkup',
    title: 'Weight Check',
    description: 'Weekly weight monitoring - part of your health tracking routine',
    time: 'Due today',
    priority: 'low',
    completed: true,
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200'
  }
];

export function Reminders() {
  const [currentReminders, setCurrentReminders] = useState(reminders);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const handleComplete = (id: string) => {
    setCurrentReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: true, color: 'text-green-600', bgColor: 'bg-green-50 border-green-200' }
          : reminder
      )
    );
  };

  const handleDismiss = (id: string) => {
    setDismissed(prev => [...prev, id]);
  };

  const visibleReminders = currentReminders.filter(r => !dismissed.includes(r.id));
  const pendingCount = visibleReminders.filter(r => !r.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-lg p-6"
    >
      <div className="max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(16, 185, 129, 0.3)',
                  '0 0 0 10px rgba(16, 185, 129, 0)',
                  '0 0 0 0 rgba(16, 185, 129, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Health Reminders</h2>
              <p className="text-slate-600">Stay on track with your wellness goals</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge 
              className={`px-4 py-2 text-sm ${
                pendingCount > 0 
                  ? 'bg-orange-100 text-orange-700 border-orange-300' 
                  : 'bg-green-100 text-green-700 border-green-300'
              }`}
            >
              {pendingCount > 0 ? `${pendingCount} pending` : 'All caught up!'}
            </Badge>
          </div>
        </div>

        {/* Reminders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {visibleReminders.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-2xl border-2 ${reminder.bgColor} transition-all duration-300 hover:shadow-lg group`}
                whileHover={{ y: -2, scale: 1.02 }}
              >
                {/* Dismiss button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(reminder.id)}
                  className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white/60"
                >
                  <X className="w-3 h-3" />
                </Button>

                {/* Priority indicator */}
                {reminder.priority === 'high' && !reminder.completed && (
                  <motion.div
                    className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-xl ${reminder.bgColor} border ${reminder.color.replace('text-', 'border-').replace('-600', '-300')} flex items-center justify-center mb-3 relative overflow-hidden`}
                  whileHover={{ rotate: 5 }}
                >
                  <div className={reminder.color}>
                    {reminder.icon}
                  </div>
                  
                  {/* Completion checkmark overlay */}
                  {reminder.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-green-500 rounded-xl flex items-center justify-center"
                    >
                      <CheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className={`font-semibold ${reminder.completed ? 'text-green-700 line-through' : 'text-slate-800'}`}>
                    {reminder.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${reminder.completed ? 'text-green-600' : 'text-slate-600'}`}>
                    {reminder.description}
                  </p>
                  
                  {/* Time and action */}
                  <div className="flex items-center justify-between pt-2">
                    <span className={`text-xs font-medium ${reminder.color}`}>
                      {reminder.time}
                    </span>
                    
                    {!reminder.completed && (
                      <Button
                        size="sm"
                        onClick={() => handleComplete(reminder.id)}
                        className={`h-7 px-3 text-xs ${reminder.color.replace('text-', 'bg-').replace('-600', '-100 hover:bg-').replace('100 hover:bg-', '-200')} ${reminder.color} border-transparent hover:border-current/20`}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Done
                      </Button>
                    )}
                  </div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${reminder.color.replace('text-', 'bg-').replace('-600', '-200')}`}
                  style={{ 
                    background: `radial-gradient(circle at center, ${reminder.color.replace('text-', '').replace('-600', '')} 0%, transparent 70%)`,
                    filter: 'blur(20px)'
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Encouraging message */}
        {pendingCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200"
          >
            <div className="flex items-center justify-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Great job! You're all caught up with your health goals today! 🎉</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}