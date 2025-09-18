import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, ChevronLeft, ChevronRight, TrendingUp, Award, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ActivityDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no activity, 4 = max activity
  activities: string[];
  stepCount?: number;
  logsCompleted?: string[];
}

interface MonthData {
  name: string;
  fullName: string;
  year: number;
  days: ActivityDay[];
  daysInMonth: number;
  startDay: number; // 0 = Sunday, 1 = Monday, etc.
}

interface Tooltip {
  show: boolean;
  x: number;
  y: number;
  content: ActivityDay | null;
}

type ViewPeriod = '7days' | '30days' | '6months' | '12months';

export function HealthActivityStreak() {
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('6months');
  const [tooltip, setTooltip] = useState<Tooltip>({ show: false, x: 0, y: 0, content: null });

  // Generate activity data for different periods
  const generateActivityData = (): MonthData[] => {
    const today = new Date();
    const months: MonthData[] = [];
    
    let startDate: Date;
    let monthsToShow: number;
    
    switch (viewPeriod) {
      case '7days':
        // For 7 days, show exactly 7 consecutive days ending today
        startDate = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
        monthsToShow = 1;
        break;
      case '30days':
        // For 30 days, show current month with correct number of days
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        monthsToShow = 1;
        break;
      case '6months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
        monthsToShow = 6;
        break;
      case '12months':
      default:
        startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1);
        monthsToShow = 12;
        break;
    }

    for (let i = 0; i < monthsToShow; i++) {
      let monthDate: Date;
      let monthName: string;
      let fullMonthName: string;
      let year: number;
      let daysInMonth: number;
      let actualStartDay: number;
      let days: ActivityDay[] = [];
      
      if (viewPeriod === '7days') {
        // Special handling for 7-day view
        monthDate = today;
        monthName = 'Last 7 Days';
        fullMonthName = 'Last 7 Days';
        year = today.getFullYear();
        daysInMonth = 7;
        actualStartDay = startDate.getDay();
        
        // Generate exactly 7 days
        for (let day = 0; day < 7; day++) {
          const currentDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
          days.push(generateDayActivity(currentDate));
        }
      } else if (viewPeriod === '30days') {
        // Special handling for current month view
        monthDate = today;
        monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
        fullMonthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
        year = monthDate.getFullYear();
        
        // Get actual days in current month
        daysInMonth = new Date(year, monthDate.getMonth() + 1, 0).getDate();
        actualStartDay = new Date(year, monthDate.getMonth(), 1).getDay();
        
        // Generate all days in current month up to today
        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, monthDate.getMonth(), day);
          if (currentDate <= today) {
            days.push(generateDayActivity(currentDate));
          }
        }
      } else {
        // Month-based views (6 months / 12 months)
        monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
        fullMonthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
        year = monthDate.getFullYear();
        
        // Get actual days in this month
        daysInMonth = new Date(year, monthDate.getMonth() + 1, 0).getDate();
        actualStartDay = new Date(year, monthDate.getMonth(), 1).getDay();
        
        // Generate all days in month up to today
        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, monthDate.getMonth(), day);
          if (currentDate <= today) {
            days.push(generateDayActivity(currentDate));
          }
        }
      }

      months.push({
        name: monthName,
        fullName: fullMonthName,
        year,
        days,
        daysInMonth,
        startDay: actualStartDay
      });
    }

    return months;
  };

  const generateDayActivity = (date: Date): ActivityDay => {
    const dateStr = date.toISOString().split('T')[0];
    const seed = dateStr.split('-').reduce((acc, val) => acc + parseInt(val), 0);
    const random = (seed * 9301 + 49297) % 233280 / 233280;
    
    // Generate activity level (0-4)
    let level: 0 | 1 | 2 | 3 | 4;
    let activities: string[] = [];
    let stepCount = 0;
    let logsCompleted: string[] = [];
    
    if (random < 0.1) {
      level = 0; // No activity
    } else if (random < 0.25) {
      level = 1; // Low activity
      stepCount = Math.floor(random * 2000) + 1000;
      activities = ['Morning walk'];
      logsCompleted = ['Steps'];
    } else if (random < 0.5) {
      level = 2; // Medium activity
      stepCount = Math.floor(random * 4000) + 3000;
      activities = ['Blood pressure logged', 'Morning walk'];
      logsCompleted = ['BP', 'Steps'];
    } else if (random < 0.8) {
      level = 3; // High activity
      stepCount = Math.floor(random * 6000) + 5000;
      activities = ['Blood pressure logged', 'Medication taken', 'Exercise completed'];
      logsCompleted = ['BP', 'Medication', 'Exercise'];
    } else {
      level = 4; // Max activity
      stepCount = Math.floor(random * 4000) + 8000;
      activities = ['Blood pressure logged', 'Medication taken', 'Exercise completed', 'Meals logged', 'Sleep tracked'];
      logsCompleted = ['BP', 'Medication', 'Exercise', 'Nutrition', 'Sleep'];
    }

    return {
      date: dateStr,
      level,
      activities,
      stepCount,
      logsCompleted
    };
  };

  const monthsData = generateActivityData();

  // Calculate overall stats
  const allDays = monthsData.flatMap(month => month.days);
  const totalDays = allDays.length;
  const activeDays = allDays.filter(day => day.level > 0).length;
  const perfectDays = allDays.filter(day => day.level === 4).length;
  
  // Calculate current streak
  const currentStreak = (() => {
    let streak = 0;
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (allDays[i].level > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  })();

  const getActivityColor = (level: 0 | 1 | 2 | 3 | 4) => {
    switch (level) {
      case 0: return 'bg-slate-100 hover:bg-slate-200 border-slate-200';
      case 1: return 'bg-emerald-100 hover:bg-emerald-200 border-emerald-200';
      case 2: return 'bg-emerald-300 hover:bg-emerald-400 border-emerald-300';
      case 3: return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-400';
      case 4: return 'bg-emerald-700 hover:bg-emerald-800 border-emerald-600';
    }
  };

  const handleCellHover = (event: React.MouseEvent, day: ActivityDay) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: day
    });
  };

  const handleCellLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: null });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const renderMonthGrid = (month: MonthData, index: number) => {
    const isSmallView = viewPeriod === '7days' || viewPeriod === '30days';
    const cellSize = isSmallView ? 'w-6 h-6' : 'w-3 h-3';
    
    return (
      <motion.div
        key={`${month.name}-${month.year}-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="space-y-2"
      >
        {/* Month Label */}
        <div className="text-center">
          <h4 className="text-sm font-medium text-slate-700">
            {month.name} {viewPeriod !== '7days' && viewPeriod !== '30days' && month.year}
          </h4>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-1">
          {/* Day labels for small views */}
          {isSmallView && (
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-xs text-slate-500 text-center">
                  {day}
                </div>
              ))}
            </div>
          )}
          
          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* For 7-day view, add empty cells at the beginning to align with weekdays */}
            {viewPeriod === '7days' && Array.from({ length: month.startDay }, (_, i) => (
              <div key={`empty-start-${i}`} className={cellSize} />
            ))}
            
            {/* For monthly views, add empty cells for start of month */}
            {viewPeriod === '30days' && Array.from({ length: month.startDay }, (_, i) => (
              <div key={`empty-${i}`} className={cellSize} />
            ))}
            
            {/* For 6/12 month views, add empty cells for start of month */}
            {(viewPeriod === '6months' || viewPeriod === '12months') && Array.from({ length: month.startDay }, (_, i) => (
              <div key={`empty-${i}`} className={cellSize} />
            ))}
            
            {/* Activity days */}
            {month.days.map((day, dayIndex) => (
              <motion.div
                key={`${day.date}-${dayIndex}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: index * 0.05 + dayIndex * 0.01,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className={`
                  ${cellSize} rounded-md cursor-pointer transition-all duration-200 border
                  ${getActivityColor(day.level)}
                  hover:scale-110 hover:shadow-md hover:z-10 relative
                  ${day.level > 2 ? 'shadow-sm' : ''}
                `}
                onMouseEnter={(e) => handleCellHover(e, day)}
                onMouseLeave={handleCellLeave}
                title={`${formatDate(day.date)}: ${day.activities.length} activities`}
              />
            ))}
            
            {/* For 7-day view, add empty cells at the end to complete the week */}
            {viewPeriod === '7days' && Array.from({ length: 6 - ((month.startDay + 6) % 7) }, (_, i) => (
              <div key={`empty-end-${i}`} className={cellSize} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const getGridLayout = () => {
    if (viewPeriod === '7days' || viewPeriod === '30days') {
      return 'grid-cols-1';
    } else if (viewPeriod === '6months') {
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6';
    } else { // 12months
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-xl border-slate-200/60 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-800">Health Activity Streak 📅</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Track your daily health journey</p>
            </div>
          </div>
          
          {/* Period Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['7days', '30days', '6months', '12months'] as ViewPeriod[]).map((period) => (
              <Button
                key={period}
                variant={viewPeriod === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewPeriod(period)}
                className={`px-3 py-2 text-xs rounded-md transition-all ${
                  viewPeriod === period
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                    : 'hover:bg-white/60 text-slate-600'
                }`}
              >
                {period === '7days' ? '7D' : 
                 period === '30days' ? '30D' : 
                 period === '6months' ? '6M' : '12M'}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-200"
          >
            <div className="text-2xl font-bold text-emerald-600 mb-1">{currentStreak}</div>
            <div className="text-sm text-emerald-700 font-medium flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Current Streak
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200"
          >
            <div className="text-2xl font-bold text-blue-600 mb-1">{perfectDays}</div>
            <div className="text-sm text-blue-700 font-medium flex items-center justify-center gap-1">
              <Award className="w-4 h-4" />
              Perfect Days
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200"
          >
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round((activeDays / totalDays) * 100)}%
            </div>
            <div className="text-sm text-purple-700 font-medium flex items-center justify-center gap-1">
              <Target className="w-4 h-4" />
              Active Days
            </div>
          </motion.div>
        </div>

        {/* Calendar Grid Layout */}
        <div className={`grid ${getGridLayout()} gap-6 ${ 
          viewPeriod !== '7days' && viewPeriod !== '30days' ? 
          'lg:grid' : 
          'grid'
        }`}>
          {monthsData.map((month, index) => renderMonthGrid(month, index))}
        </div>
        
        {/* Mobile Horizontal Scroll for Multi-Month Views */}
        {(viewPeriod === '6months' || viewPeriod === '12months') && (
          <div className="lg:hidden flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent mt-6">
            {monthsData.map((month, index) => renderMonthGrid(month, index))}
          </div>
        )}
        
        {/* Legend */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Less</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-slate-100 rounded-sm border border-slate-200"></div>
              <div className="w-3 h-3 bg-emerald-100 rounded-sm border border-emerald-200"></div>
              <div className="w-3 h-3 bg-emerald-300 rounded-sm border border-emerald-300"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-sm border border-emerald-400"></div>
              <div className="w-3 h-3 bg-emerald-700 rounded-sm border border-emerald-600"></div>
            </div>
            <span className="text-sm text-slate-600">More</span>
          </div>
        </div>
      </CardContent>

      {/* Enhanced Tooltip */}
      <AnimatePresence>
        {tooltip.show && tooltip.content && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl shadow-xl p-4 max-w-xs">
              <div className="text-sm font-medium text-slate-800 mb-2">
                {formatDate(tooltip.content.date)}
              </div>
              
              {tooltip.content.level === 0 ? (
                <div className="text-xs text-slate-500">No activities logged</div>
              ) : (
                <div className="space-y-2">
                  {tooltip.content.stepCount && (
                    <div className="text-xs text-emerald-600 font-medium">
                      🚶 {tooltip.content.stepCount.toLocaleString()} steps
                    </div>
                  )}
                  
                  {tooltip.content.logsCompleted && tooltip.content.logsCompleted.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs text-slate-600 font-medium">
                        Completed activities:
                      </div>
                      {tooltip.content.logsCompleted.map((log, index) => (
                        <div key={index} className="text-xs text-slate-600 flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      Activity level: {tooltip.content.level}/4
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}