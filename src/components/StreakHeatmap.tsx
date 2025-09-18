import { motion } from "motion/react";
import { Calendar, Flame } from "lucide-react";

export function StreakHeatmap() {
  // Generate 12 weeks of mock data
  const weeks = 12;
  const daysPerWeek = 7;
  
  const generateActivityData = () => {
    const data = [];
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < daysPerWeek; day++) {
        const activity = Math.random();
        data.push({
          week,
          day,
          activity: activity,
          level: activity < 0.2 ? 0 : activity < 0.4 ? 1 : activity < 0.6 ? 2 : activity < 0.8 ? 3 : 4
        });
      }
    }
    return data;
  };

  const activityData = generateActivityData();
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const getColorForLevel = (level: number) => {
    const colors = [
      { bg: 'bg-slate-100', glow: 'transparent' },
      { bg: 'bg-emerald-200', glow: 'rgba(16, 185, 129, 0.3)' },
      { bg: 'bg-emerald-300', glow: 'rgba(16, 185, 129, 0.5)' }, 
      { bg: 'bg-emerald-400', glow: 'rgba(16, 185, 129, 0.7)' },
      { bg: 'bg-emerald-500', glow: 'rgba(16, 185, 129, 0.9)' }
    ];
    return colors[level];
  };

  const currentStreak = 12;
  const bestStreak = 28;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-slate-600" />
          <h2 className="text-xl font-bold text-slate-700">Health Activity Streak</h2>
        </div>
        <div className="flex items-center gap-6">
          {/* Current Streak with flame animation */}
          <motion.div 
            className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(249, 115, 22, 0.2)',
                '0 0 40px rgba(249, 115, 22, 0.4)',
                '0 0 20px rgba(249, 115, 22, 0.2)'
              ] 
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center gap-2 justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0] 
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Flame className="w-6 h-6 text-orange-500" />
              </motion.div>
              <span className="font-bold text-2xl text-orange-600">{currentStreak}</span>
            </div>
            <p className="text-sm text-orange-500 font-medium">Current Streak</p>
          </motion.div>
          
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200">
            <div className="text-2xl font-bold text-slate-700">{bestStreak}</div>
            <p className="text-sm text-slate-500 font-medium">Personal Best</p>
          </div>
        </div>
      </div>

      {/* Day Labels */}
      <div className="flex gap-2 mb-3">
        <div className="w-8"></div>
        {dayLabels.map((day, index) => (
          <div key={index} className="w-4 text-sm text-slate-600 text-center font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Enhanced Heatmap Grid */}
      <div className="flex gap-2">
        {Array.from({ length: weeks }, (_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-2">
            {Array.from({ length: daysPerWeek }, (_, dayIndex) => {
              const dataPoint = activityData.find(d => d.week === weekIndex && d.day === dayIndex);
              const colorData = getColorForLevel(dataPoint?.level || 0);
              const isHighActivity = dataPoint && dataPoint.level >= 3;
              const isToday = weekIndex === weeks - 1 && dayIndex === 6; // Simulate today
              
              return (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`
                    w-4 h-4 rounded-lg cursor-pointer transition-all duration-300 relative
                    ${colorData.bg} 
                    ${isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                    hover:scale-125
                  `}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: (weekIndex * daysPerWeek + dayIndex) * 0.01,
                    duration: 0.3,
                    type: "spring"
                  }}
                  whileHover={{ 
                    scale: 1.4,
                    zIndex: 10,
                    boxShadow: `0 0 25px ${colorData.glow}`
                  }}
                  title={`Activity level: ${dataPoint?.level || 0}/4`}
                  style={{
                    boxShadow: isHighActivity ? `0 0 15px ${colorData.glow}` : 'none'
                  }}
                >
                  {/* Pulsing effect for high activity days */}
                  {isHighActivity && (
                    <motion.div
                      className={`absolute inset-0 rounded-lg ${colorData.bg}`}
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0, 0.6] 
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                  
                  {/* Today indicator */}
                  {isToday && (
                    <motion.div
                      className="absolute inset-1 rounded-md bg-white/50"
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Enhanced Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200/60">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="font-medium">Less Active</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => {
              const colorData = getColorForLevel(level);
              return (
                <motion.div
                  key={level}
                  className={`w-4 h-4 rounded-md ${colorData.bg}`}
                  whileHover={{ 
                    scale: 1.3,
                    boxShadow: `0 0 15px ${colorData.glow}`
                  }}
                />
              );
            })}
          </div>
          <span className="font-medium">More Active</span>
        </div>
        
        <div className="text-sm text-slate-500 font-medium">
          Past 12 weeks • Updated daily
        </div>
      </div>

      {/* Activity Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-emerald-50 rounded-xl">
          <div className="text-lg font-bold text-emerald-600">74%</div>
          <div className="text-xs text-emerald-500 font-medium">Consistency Rate</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <div className="text-lg font-bold text-blue-600">62</div>
          <div className="text-xs text-blue-500 font-medium">Active Days</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-xl">
          <div className="text-lg font-bold text-orange-600">3.2</div>
          <div className="text-xs text-orange-500 font-medium">Daily Average</div>
        </div>
      </div>
    </div>
  );
}