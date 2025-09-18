import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Heart, Droplet, Weight, Activity, Pill, Apple, Footprints, Thermometer, Trash2, Edit, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { format, isToday, isYesterday, differenceInDays } from 'date-fns';

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

interface LogHistoryProps {
  entries: LogEntry[];
  filterPeriod: '7' | '14' | '30';
  onDeleteEntry: (id: string) => void;
}

const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'Blood Pressure': Heart,
    'Glucose': Droplet,
    'Weight': Weight,
    'Heart Rate': Activity,
    'Medication': Pill,
    'Diet': Apple,
    'Activity': Footprints,
    'Symptoms': Thermometer
  };
  return iconMap[category] || Activity;
};

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    'Blood Pressure': 'from-red-400 to-pink-500',
    'Glucose': 'from-blue-400 to-cyan-500',
    'Weight': 'from-purple-400 to-indigo-500',
    'Heart Rate': 'from-emerald-400 to-green-500',
    'Medication': 'from-orange-400 to-amber-500',
    'Diet': 'from-green-400 to-lime-500',
    'Activity': 'from-cyan-400 to-blue-500',
    'Symptoms': 'from-yellow-400 to-orange-500'
  };
  return colorMap[category] || 'from-slate-400 to-slate-500';
};

const getVitalStatus = (category: string, value: string) => {
  switch (category) {
    case 'Blood Pressure':
      const bpMatch = value.match(/(\d+)\/(\d+)/);
      if (bpMatch) {
        const systolic = parseInt(bpMatch[1]);
        const diastolic = parseInt(bpMatch[2]);
        if (systolic < 120 && diastolic < 80) return { status: 'normal', color: 'bg-emerald-500' };
        if (systolic < 140 && diastolic < 90) return { status: 'elevated', color: 'bg-yellow-500' };
        return { status: 'high', color: 'bg-red-500' };
      }
      break;
    case 'Glucose':
      const glucose = parseInt(value);
      if (glucose >= 70 && glucose <= 99) return { status: 'normal', color: 'bg-emerald-500' };
      if (glucose <= 125) return { status: 'elevated', color: 'bg-yellow-500' };
      return { status: 'high', color: 'bg-red-500' };
    case 'Heart Rate':
      const hr = parseInt(value);
      if (hr >= 60 && hr <= 100) return { status: 'normal', color: 'bg-emerald-500' };
      if (hr < 60 || hr > 100) return { status: 'outside range', color: 'bg-yellow-500' };
      break;
  }
  return { status: 'recorded', color: 'bg-blue-500' };
};

const formatDate = (date: Date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (differenceInDays(new Date(), date) < 7) {
    return format(date, 'EEEE'); // Day of week
  }
  return format(date, 'MMM dd');
};

export function LogHistory({ entries, filterPeriod, onDeleteEntry }: LogHistoryProps) {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  // Filter entries based on selected period
  const filteredEntries = entries.filter(entry => {
    const daysAgo = differenceInDays(new Date(), entry.date);
    return daysAgo <= parseInt(filterPeriod);
  });

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const dateKey = entry.date.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {} as { [key: string]: LogEntry[] });

  const sortedDateKeys = Object.keys(groupedEntries).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (filteredEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No entries found</h3>
            <p className="text-slate-500 text-center">
              Start logging your health data to see your history here.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card className="bg-white/80 backdrop-blur-md border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{filteredEntries.length}</p>
                <p className="text-sm text-slate-600">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-md border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {filteredEntries.filter(e => e.type === 'vital').length}
                </p>
                <p className="text-sm text-slate-600">Vitals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-md border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">
                  {filteredEntries.filter(e => e.isBackdated).length}
                </p>
                <p className="text-sm text-slate-600">Backdated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Entries List */}
      <div className="space-y-8">
        {sortedDateKeys.map((dateKey) => {
          const dayEntries = groupedEntries[dateKey];
          const entryDate = new Date(dateKey);
          
          return (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Date Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-600 rounded-full flex items-center justify-center text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{formatDate(entryDate)}</h3>
                    <p className="text-sm text-slate-500">{format(entryDate, 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <Badge variant="secondary" className="bg-slate-100">
                  {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
                </Badge>
              </div>

              {/* Entries for this date */}
              <div className="space-y-3 ml-4">
                {dayEntries.map((entry) => {
                  const Icon = getCategoryIcon(entry.category);
                  const isExpanded = expandedEntry === entry.id;
                  const vitalStatus = entry.type === 'vital' ? getVitalStatus(entry.category, entry.value) : null;
                  
                  return (
                    <motion.div
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card className="bg-white/80 backdrop-blur-md border-white/40 hover:shadow-lg transition-all duration-300">
                        <CardHeader
                          className="pb-3 cursor-pointer"
                          onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(entry.category)} flex items-center justify-center text-white shadow-lg`}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <CardTitle className="text-base">{entry.category}</CardTitle>
                                  {entry.isBackdated && (
                                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                                      Backdated
                                    </Badge>
                                  )}
                                  {vitalStatus && (
                                    <div className="flex items-center gap-1">
                                      <div className={`w-2 h-2 rounded-full ${vitalStatus.color}`} />
                                      <span className="text-xs text-slate-600 capitalize">{vitalStatus.status}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="font-semibold text-slate-800">
                                    {entry.value} {entry.unit}
                                  </p>
                                  <div className="flex items-center gap-1 text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-xs">{format(entry.date, 'h:mm a')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Badge variant={entry.type === 'vital' ? 'default' : 'secondary'}>
                              {entry.type === 'vital' ? 'Vital' : 'Daily'}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CardContent className="pt-0">
                                <Separator className="mb-4" />
                                <div className="space-y-4">
                                  {entry.notes && (
                                    <div>
                                      <Label className="text-sm text-slate-600 mb-1 block">Notes</Label>
                                      <p className="text-slate-800 bg-slate-50 p-3 rounded-lg">
                                        {entry.notes}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {entry.type === 'vital' && (
                                    <Alert className="border-blue-200 bg-blue-50">
                                      <AlertCircle className="h-4 w-4" />
                                      <AlertDescription className="text-blue-800">
                                        {entry.category === 'Blood Pressure' && 
                                          "Keep tracking your blood pressure regularly and share trends with your healthcare provider."}
                                        {entry.category === 'Glucose' && 
                                          "Monitor your glucose levels and note any patterns related to meals and activities."}
                                        {entry.category === 'Weight' && 
                                          "Regular weight monitoring helps track your overall health progress."}
                                        {entry.category === 'Heart Rate' && 
                                          "Your heart rate can indicate your fitness level and overall cardiovascular health."}
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                  
                                  <div className="flex justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteEntry(entry.id);
                                      }}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Entry
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}