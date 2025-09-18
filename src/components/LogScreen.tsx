import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Mic, Filter, Plus, Activity, Heart, Droplet, Weight, Pill, Apple, Footprints, Thermometer } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { QuickLogCards } from './QuickLogCards';
import { VoiceInputModal } from './VoiceInputModal';
import { LogHistory } from './LogHistory';

interface LogEntry {
  id: string;
  type: 'vital' | 'non-vital';
  category: string;
  value: string;
  unit?: string;
  date: Date;
  notes?: string;
  isBackdated?: boolean;
}

export function LogScreen() {
  const [entries, setEntries] = useState<LogEntry[]>([
    {
      id: '1',
      type: 'vital',
      category: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      date: new Date(2024, 11, 1, 9, 30),
      notes: 'Morning reading, felt relaxed'
    },
    {
      id: '2',
      type: 'vital',
      category: 'Glucose',
      value: '95',
      unit: 'mg/dL',
      date: new Date(2024, 11, 1, 11, 15),
      notes: 'Before lunch'
    },
    {
      id: '3',
      type: 'non-vital',
      category: 'Medication',
      value: 'Metformin - Taken',
      date: new Date(2024, 11, 1, 8, 0),
      notes: 'With breakfast as usual'
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filterPeriod, setFilterPeriod] = useState<'7' | '14' | '30'>('7');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [showQuickLog, setShowQuickLog] = useState(false);

  const addEntry = (entry: Omit<LogEntry, 'id'>) => {
    // Check for duplicates
    const isDuplicate = entries.some(existing => 
      existing.category === entry.category &&
      existing.date.toDateString() === entry.date.toDateString() &&
      Math.abs(existing.date.getTime() - entry.date.getTime()) < 300000 // 5 minutes
    );

    if (isDuplicate) {
      toast.error('Duplicate entry detected! You already have a similar entry around this time.');
      return;
    }

    // Validate ranges for vitals
    if (entry.type === 'vital') {
      const isValid = validateVitalRange(entry.category, entry.value);
      if (!isValid) {
        toast.error('Value is outside normal range. Please check and try again.');
        return;
      }
    }

    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      isBackdated: entry.date.toDateString() !== new Date().toDateString()
    };

    setEntries(prev => [newEntry, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
    toast.success('Entry logged successfully! 🎉');
  };

  const validateVitalRange = (category: string, value: string): boolean => {
    switch (category) {
      case 'Blood Pressure':
        const bpMatch = value.match(/(\d+)\/(\d+)/);
        if (bpMatch) {
          const systolic = parseInt(bpMatch[1]);
          const diastolic = parseInt(bpMatch[2]);
          return systolic >= 70 && systolic <= 200 && diastolic >= 40 && diastolic <= 120;
        }
        return false;
      case 'Glucose':
        const glucose = parseInt(value);
        return glucose >= 70 && glucose <= 400;
      case 'Weight':
        const weight = parseFloat(value);
        return weight >= 30 && weight <= 300;
      case 'Heart Rate':
        const hr = parseInt(value);
        return hr >= 40 && hr <= 200;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen ml-20 p-8 pt-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Health Logging 📝
            </h1>
            <p className="text-slate-600 mt-2">
              Track your health journey with easy logging
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Voice Input Button */}
            <Button
              onClick={() => setIsVoiceModalOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Mic className="w-5 h-5 mr-2" />
              Voice Log
            </Button>
            
            {/* Quick Log Toggle */}
            <Button
              onClick={() => setShowQuickLog(!showQuickLog)}
              variant={showQuickLog ? "default" : "outline"}
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Quick Log
            </Button>
          </div>
        </div>

        {/* Motivational Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-3 gap-6"
        >
          {[
            { title: "Logs This Week", value: "12", color: "from-emerald-400 to-green-500", emoji: "📊" },
            { title: "Streak Days", value: "8", color: "from-blue-400 to-cyan-500", emoji: "🔥" },
            { title: "Completion Rate", value: "85%", color: "from-purple-400 to-pink-500", emoji: "⭐" }
          ].map((stat) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-200 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  {stat.emoji}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Quick Log Cards - Expandable */}
      <AnimatePresence>
        {showQuickLog && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <QuickLogCards 
              onAddEntry={addEntry} 
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Controls */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <Filter className="w-5 h-5 text-slate-600" />
        <Label className="text-slate-700">Show entries from:</Label>
        <Select value={filterPeriod} onValueChange={(value: '7' | '14' | '30') => setFilterPeriod(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Log History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <LogHistory 
          entries={entries}
          filterPeriod={filterPeriod}
          onDeleteEntry={(id) => {
            setEntries(prev => prev.filter(entry => entry.id !== id));
            toast.success('Entry deleted successfully');
          }}
        />
      </motion.div>

      {/* Voice Input Modal */}
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onAddEntry={addEntry}
        selectedDate={selectedDate}
      />

      {/* Encouraging Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center p-6 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-200"
      >
        <p className="text-emerald-800">
          Great job staying on top of your health! Every log entry helps you and your care team make better decisions. 💚
        </p>
      </motion.div>
    </div>
  );
}