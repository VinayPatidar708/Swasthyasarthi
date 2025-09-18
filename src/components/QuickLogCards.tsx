import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Droplet, Weight, Activity, Pill, Apple, Footprints, Thermometer, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

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

interface QuickLogCardsProps {
  onAddEntry: (entry: Omit<LogEntry, 'id'>) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const vitalCards = [
  {
    category: 'Blood Pressure',
    icon: Heart,
    color: 'from-red-400 to-pink-500',
    unit: 'mmHg',
    placeholder: 'e.g., 120/80',
    tips: ['Take reading while sitting', 'Rest for 5 minutes first', 'Use same arm each time']
  },
  {
    category: 'Glucose',
    icon: Droplet,
    color: 'from-blue-400 to-cyan-500',
    unit: 'mg/dL',
    placeholder: 'e.g., 95',
    tips: ['Check before meals', 'Wash hands first', 'Log timing (before/after meal)']
  },
  {
    category: 'Weight',
    icon: Weight,
    color: 'from-purple-400 to-indigo-500',
    unit: 'lbs',
    placeholder: 'e.g., 150',
    tips: ['Weigh same time daily', 'Use same scale', 'Wear similar clothing']
  },
  {
    category: 'Heart Rate',
    icon: Activity,
    color: 'from-emerald-400 to-green-500',
    unit: 'bpm',
    placeholder: 'e.g., 72',
    tips: ['Rest for 2 minutes first', 'Count for full minute', 'Note if after exercise']
  }
];

const nonVitalCards = [
  {
    category: 'Medication',
    icon: Pill,
    color: 'from-orange-400 to-amber-500',
    options: ['Taken as prescribed', 'Missed dose', 'Taken late', 'Side effects noted'],
    placeholder: 'Select status or add custom note'
  },
  {
    category: 'Diet',
    icon: Apple,
    color: 'from-green-400 to-lime-500',
    options: ['Healthy breakfast', 'Balanced lunch', 'Light dinner', 'Snack', 'Special diet followed'],
    placeholder: 'Describe your meal or diet choice'
  },
  {
    category: 'Activity',
    icon: Footprints,
    color: 'from-cyan-400 to-blue-500',
    options: ['Walking', 'Exercise', 'Yoga', 'Swimming', 'Physical therapy'],
    placeholder: 'What activity did you do?'
  },
  {
    category: 'Symptoms',
    icon: Thermometer,
    color: 'from-yellow-400 to-orange-500',
    options: ['Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Pain', 'Feeling great'],
    placeholder: 'How are you feeling today?'
  }
];

export function QuickLogCards({ onAddEntry, selectedDate, onDateChange }: QuickLogCardsProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    value: '',
    notes: '',
    customDate: selectedDate
  });

  const handleSubmit = (card: any) => {
    if (!formData.value.trim()) {
      toast.error('Please enter a value');
      return;
    }

    onAddEntry({
      type: vitalCards.includes(card) ? 'vital' : 'non-vital',
      category: card.category,
      value: formData.value,
      unit: card.unit,
      date: formData.customDate,
      notes: formData.notes.trim() || undefined
    });

    // Reset form
    setFormData({
      value: '',
      notes: '',
      customDate: selectedDate
    });
    setSelectedCard(null);
  };

  const renderLogDialog = (card: any) => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}>
            <card.icon className="w-5 h-5" />
          </div>
          Log {card.category}
        </DialogTitle>
        <DialogDescription>
          Enter your {card.category.toLowerCase()} data and any additional notes
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Value Input */}
        <div className="space-y-2">
          <Label>Value {card.unit && `(${card.unit})`}</Label>
          {card.options ? (
            <Select value={formData.value} onValueChange={(value) => setFormData(prev => ({ ...prev, value }))}>
              <SelectTrigger>
                <SelectValue placeholder={card.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {card.options.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={formData.value}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              placeholder={card.placeholder}
            />
          )}
        </div>

        {/* Date Selector */}
        <div className="space-y-2">
          <Label>Date & Time</Label>
          <div className="flex gap-2">
            <Input
              type="datetime-local"
              value={formData.customDate.toISOString().slice(0, 16)}
              onChange={(e) => setFormData(prev => ({ ...prev, customDate: new Date(e.target.value) }))}
            />
            {formData.customDate.toDateString() !== new Date().toDateString() && (
              <Badge variant="secondary" className="whitespace-nowrap">
                Backdated
              </Badge>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes (Optional)</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any additional details..."
            rows={3}
          />
        </div>

        {/* Tips for Vitals */}
        {card.tips && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h4 className="font-medium text-emerald-800 mb-2">💡 Quick Tips:</h4>
            <ul className="text-sm text-emerald-700 space-y-1">
              {card.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleSubmit(card)}
            className={`flex-1 bg-gradient-to-r ${card.color} text-white hover:shadow-lg transition-all duration-300`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Entry
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedCard(null)}
            className="px-6"
          >
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-8">
      {/* Vitals Section */}
      <div>
        <h3 className="mb-4 text-emerald-800">📊 Vital Signs</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vitalCards.map((card) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Dialog open={selectedCard === card.category} onOpenChange={() => setSelectedCard(selectedCard === card.category ? null : card.category)}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer bg-white/80 backdrop-blur-md border-white/40 hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-sm font-medium text-slate-800">{card.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-slate-600 mb-2">Tap to log</div>
                      <Badge variant="secondary" className="text-xs">
                        {card.unit}
                      </Badge>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                {renderLogDialog(card)}
              </Dialog>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Non-Vitals Section */}
      <div>
        <h3 className="mb-4 text-cyan-800">📝 Daily Tracking</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {nonVitalCards.map((card) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <Dialog open={selectedCard === card.category} onOpenChange={() => setSelectedCard(selectedCard === card.category ? null : card.category)}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer bg-white/80 backdrop-blur-md border-white/40 hover:shadow-lg transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-sm font-medium text-slate-800">{card.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-slate-600">Tap to log</div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                {renderLogDialog(card)}
              </Dialog>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}