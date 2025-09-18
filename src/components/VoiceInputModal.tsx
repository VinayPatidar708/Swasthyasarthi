import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Check, X, ArrowRight, ArrowLeft, SkipForward, Volume2, Activity, Heart, Droplet, Weight, Pill, Apple, Footprints, Thermometer, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
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

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: Omit<LogEntry, 'id'>) => void;
  selectedDate: Date;
}

interface StepData {
  category: string;
  value?: string;
  unit?: string;
  skipped: boolean;
  hasInput: boolean;
}

const vitalSteps = [
  { 
    category: 'Blood Pressure', 
    icon: Heart, 
    color: 'from-red-400 to-red-500',
    placeholder: "120 over 80",
    unit: 'mmHg',
    examples: ["My blood pressure is 130 over 85", "BP reading 120 by 80"]
  },
  { 
    category: 'Glucose', 
    icon: Droplet, 
    color: 'from-blue-400 to-blue-500',
    placeholder: "95",
    unit: 'mg/dL',
    examples: ["Glucose level is 95", "Blood sugar 110 before breakfast"]
  },
  { 
    category: 'Weight', 
    icon: Weight, 
    color: 'from-green-400 to-green-500',
    placeholder: "155 lbs",
    unit: 'lbs',
    examples: ["I weigh 155 pounds", "My weight is 70 kilograms"]
  },
  { 
    category: 'Heart Rate', 
    icon: Activity, 
    color: 'from-purple-400 to-purple-500',
    placeholder: "72 bpm",
    unit: 'bpm',
    examples: ["Heart rate is 72", "Pulse 85 beats per minute"]
  }
];

const nonVitalSteps = [
  { 
    category: 'Symptoms', 
    icon: AlertCircle, 
    color: 'from-orange-400 to-orange-500',
    placeholder: "Feeling good",
    examples: ["I'm feeling a bit dizzy", "Experiencing mild headache", "Feeling great today"]
  },
  { 
    category: 'Activity', 
    icon: Footprints, 
    color: 'from-cyan-400 to-cyan-500',
    placeholder: "30 min walk",
    examples: ["Walked for 30 minutes", "Did yoga for 45 minutes", "Went swimming"]
  },
  { 
    category: 'Diet', 
    icon: Apple, 
    color: 'from-emerald-400 to-emerald-500',
    placeholder: "Had breakfast",
    examples: ["Had oatmeal for breakfast", "Ate a salad for lunch", "Drinking more water"]
  },
  { 
    category: 'Medication', 
    icon: Pill, 
    color: 'from-pink-400 to-pink-500',
    placeholder: "Took metformin",
    examples: ["Took my morning medication", "Metformin with breakfast", "Skipped evening dose"]
  }
];

export function VoiceInputModal({ isOpen, onClose, onAddEntry, selectedDate }: VoiceInputModalProps) {
  const [currentStep, setCurrentStep] = useState<'category' | 'collecting' | 'summary'>(  'category');
  const [selectedCategory, setSelectedCategory] = useState<'vitals' | 'non-vitals' | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepData, setStepData] = useState<StepData[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentSteps = selectedCategory === 'vitals' ? vitalSteps : nonVitalSteps;
  const totalSteps = currentSteps.length;
  const progress = (stepIndex / totalSteps) * 100;

  // Initialize step data when category is selected
  useEffect(() => {
    if (selectedCategory && stepData.length === 0) {
      const steps = selectedCategory === 'vitals' ? vitalSteps : nonVitalSteps;
      setStepData(steps.map(step => ({
        category: step.category,
        skipped: false,
        hasInput: false
      })));
    }
  }, [selectedCategory, stepData.length]);

  // Reset modal state
  const resetModal = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
    setStepIndex(0);
    setStepData([]);
    setIsListening(false);
    setTranscript('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetModal, 300);
  };

  // Category selection
  const selectCategory = (category: 'vitals' | 'non-vitals') => {
    setSelectedCategory(category);
    setCurrentStep('collecting');
  };

  // Voice input simulation
  const startListening = () => {
    if (!currentSteps[stepIndex]) return;
    
    setIsListening(true);
    setTranscript('');

    // Simulate voice input
    setTimeout(() => {
      const currentStepConfig = currentSteps[stepIndex];
      const randomExample = currentStepConfig.examples[Math.floor(Math.random() * currentStepConfig.examples.length)];
      setTranscript(randomExample);
      setIsListening(false);
      processVoiceInput(randomExample, currentStepConfig);
    }, 2500);
  };

  const processVoiceInput = (input: string, stepConfig: any) => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Extract value from voice input
      let extractedValue = '';
      let unit = stepConfig.unit;

      // Simple pattern matching for common health data
      if (stepConfig.category === 'Blood Pressure') {
        const bpMatch = input.match(/(\d+)\s*(?:over|by|\/)\s*(\d+)/i);
        if (bpMatch) {
          extractedValue = `${bpMatch[1]}/${bpMatch[2]}`;
        }
      } else if (stepConfig.category === 'Glucose') {
        const glucoseMatch = input.match(/(\d+)/);
        if (glucoseMatch) {
          extractedValue = glucoseMatch[1];
        }
      } else if (stepConfig.category === 'Weight') {
        const weightMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:pounds|lbs|kilograms|kg)/i);
        if (weightMatch) {
          extractedValue = weightMatch[1];
          unit = input.includes('kg') || input.includes('kilogram') ? 'kg' : 'lbs';
        }
      } else if (stepConfig.category === 'Heart Rate') {
        const hrMatch = input.match(/(\d+)/);
        if (hrMatch) {
          extractedValue = hrMatch[1];
        }
      } else {
        // For non-vitals, use the whole phrase
        extractedValue = input.replace(/^(I'm|I am|I|My|I've|I have)\s*/i, '').trim();
      }

      // Update step data
      const newStepData = [...stepData];
      newStepData[stepIndex] = {
        ...newStepData[stepIndex],
        value: extractedValue,
        unit,
        hasInput: true,
        skipped: false
      };
      setStepData(newStepData);
      setIsProcessing(false);
    }, 1500);
  };

  // Navigation
  const nextStep = () => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1);
      setTranscript('');
    } else {
      setCurrentStep('summary');
    }
  };

  const skipStep = () => {
    const newStepData = [...stepData];
    newStepData[stepIndex] = {
      ...newStepData[stepIndex],
      skipped: true,
      hasInput: false
    };
    setStepData(newStepData);
    nextStep();
  };

  const goBack = () => {
    if (currentStep === 'summary') {
      setCurrentStep('collecting');
      setStepIndex(totalSteps - 1);
    } else if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setTranscript('');
    } else {
      setCurrentStep('category');
    }
  };

  // Submit entries
  const submitEntries = () => {
    const entriesToSubmit = stepData.filter(step => step.hasInput && step.value);
    
    entriesToSubmit.forEach(step => {
      onAddEntry({
        type: selectedCategory === 'vitals' ? 'vital' : 'non-vital',
        category: step.category,
        value: step.value!,
        unit: step.unit,
        date: selectedDate,
        notes: 'Voice input - Multi-step logging'
      });
    });

    toast.success(`Successfully logged ${entriesToSubmit.length} entries! 🎉`);
    handleClose();
  };

  // Toggle step data for summary
  const toggleStepInclude = (index: number, include: boolean) => {
    const newStepData = [...stepData];
    newStepData[index].hasInput = include;
    setStepData(newStepData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white">
              <Mic className="w-5 h-5" />
            </div>
            Multi-Step Voice Logging
          </DialogTitle>
          <DialogDescription>
            Follow the guided steps to log your health data using voice input
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {/* Step 0: Category Selection */}
            {currentStep === 'category' && (
              <motion.div
                key="category"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-xl text-slate-800 mb-2">Choose what you'd like to log</h3>
                  <p className="text-slate-600">Select the type of health data you want to record</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    onClick={() => selectCategory('vitals')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <Card className="border-2 border-emerald-200 hover:border-emerald-400 bg-gradient-to-br from-emerald-50 to-green-50 transition-all duration-200">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                          <Heart className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-semibold text-emerald-800 mb-2">Vitals</h4>
                        <p className="text-sm text-emerald-600 mb-3">Blood pressure, glucose, weight, heart rate</p>
                        <Badge className="bg-emerald-100 text-emerald-700">4 steps</Badge>
                      </CardContent>
                    </Card>
                  </motion.button>

                  <motion.button
                    onClick={() => selectCategory('non-vitals')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <Card className="border-2 border-cyan-200 hover:border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 transition-all duration-200">
                      <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300">
                          <Activity className="w-8 h-8" />
                        </div>
                        <h4 className="text-lg font-semibold text-cyan-800 mb-2">Non-Vitals</h4>
                        <p className="text-sm text-cyan-600 mb-3">Symptoms, activities, diet, medications</p>
                        <Badge className="bg-cyan-100 text-cyan-700">4 steps</Badge>
                      </CardContent>
                    </Card>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Steps 1-4: Individual Collection */}
            {currentStep === 'collecting' && currentSteps[stepIndex] && (() => {
              const CurrentIcon = currentSteps[stepIndex].icon;
              return (
                <motion.div
                  key={`step-${stepIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Step {stepIndex + 1} of {totalSteps}</span>
                      <span className="text-slate-600">{Math.round(progress)}% complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Current Step Card */}
                  <Card className="border-2 border-slate-200 bg-white shadow-lg">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentSteps[stepIndex].color} flex items-center justify-center text-white shadow-lg`}>
                          <CurrentIcon className="w-6 h-6" />
                        </div>
                      <div>
                        <CardTitle className="text-xl">{currentSteps[stepIndex].category}</CardTitle>
                        <p className="text-slate-600">
                          Voice your {currentSteps[stepIndex].category.toLowerCase()} information
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Voice Input Section */}
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <motion.button
                          onClick={startListening}
                          disabled={isListening || isProcessing}
                          className={`w-20 h-20 rounded-full ${
                            isListening 
                              ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                              : isProcessing
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                              : `bg-gradient-to-r ${currentSteps[stepIndex].color} hover:opacity-90`
                          } text-white shadow-xl flex items-center justify-center transition-all duration-300 mx-auto`}
                          whileTap={{ scale: 0.95 }}
                          animate={isListening ? { scale: [1, 1.05, 1] } : isProcessing ? { rotate: 360 } : {}}
                          transition={
                            isListening 
                              ? { duration: 2, repeat: Infinity, ease: "easeInOut" } 
                              : isProcessing 
                              ? { duration: 2, repeat: Infinity, ease: "linear" }
                              : {}
                          }
                        >
                          {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                        </motion.button>

                        {/* Pulse rings when listening */}
                        {isListening && (
                          <>
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="absolute inset-0 rounded-full border-2 border-red-300"
                                style={{ 
                                  width: '140%', 
                                  height: '140%', 
                                  left: '-20%', 
                                  top: '-20%' 
                                }}
                                animate={{
                                  scale: [1, 1.8],
                                  opacity: [0.8, 0]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: i * 0.6,
                                  ease: "easeOut"
                                }}
                              />
                            ))}
                          </>
                        )}
                      </div>

                      <div>
                        <h4 className={`text-lg ${
                          isListening ? 'text-red-600' : isProcessing ? 'text-blue-600' : 'text-slate-800'
                        }`}>
                          {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to speak'}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          Example: "{currentSteps[stepIndex].examples[0]}"
                        </p>
                      </div>
                    </div>

                    {/* Transcript Display */}
                    {transcript && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-700">You said:</span>
                        </div>
                        <p className="text-slate-800">"{transcript}"</p>
                        
                        {stepData[stepIndex]?.value && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium text-emerald-700">
                                Extracted: {stepData[stepIndex].value} {stepData[stepIndex].unit}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={goBack}
                        disabled={stepIndex === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={skipStep}
                        className="flex-1"
                      >
                        <SkipForward className="w-4 h-4 mr-2" />
                        Skip
                      </Button>
                      
                      <Button
                        onClick={nextStep}
                        disabled={!stepData[stepIndex]?.hasInput && !stepData[stepIndex]?.skipped}
                        className={`flex-1 ${
                          stepData[stepIndex]?.hasInput 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600' 
                            : ''
                        }`}
                      >
                        {stepIndex === totalSteps - 1 ? 'Review' : 'Next'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              );
            })()}

            {/* Summary Step */}
            {currentStep === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-white mx-auto mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl text-slate-800 mb-2">Review Your Entries</h3>
                  <p className="text-slate-600">Confirm the data you want to save</p>
                </div>

                {/* Summary Cards */}
                <div className="space-y-3">
                  {stepData.map((step, index) => {
                    if (!step.value && !step.skipped) return null;
                    
                    const stepConfig = currentSteps[index];
                    const StepIcon = stepConfig.icon;
                    return (
                      <motion.div
                        key={step.category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          step.hasInput && step.value
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stepConfig.color} flex items-center justify-center text-white`}>
                            <StepIcon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-800">{step.category}</span>
                              {step.skipped && (
                                <Badge variant="secondary" className="text-xs">Skipped</Badge>
                              )}
                            </div>
                            {step.value && (
                              <p className="text-slate-600">
                                {step.value} {step.unit}
                              </p>
                            )}
                          </div>

                          {step.value && (
                            <Checkbox
                              checked={step.hasInput}
                              onCheckedChange={(checked) => toggleStepInclude(index, checked as boolean)}
                              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Summary Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={goBack}
                    size="lg"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  
                  <Button
                    onClick={submitEntries}
                    disabled={!stepData.some(step => step.hasInput && step.value)}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white shadow-lg"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Submit Entries
                    {stepData.filter(step => step.hasInput && step.value).length > 0 && (
                      <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30">
                        {stepData.filter(step => step.hasInput && step.value).length}
                      </Badge>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}