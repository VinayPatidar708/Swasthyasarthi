import { motion } from "motion/react";
import { 
  Trophy, 
  Target, 
  Zap, 
  Heart, 
  Calendar, 
  Award,
  Star,
  Gift,
  CheckCircle,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface BadgeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
  progress?: number;
}

function AchievementBadge({ title, description, icon, color, earned, progress }: BadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -4 }}
      className={`
        relative p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer group
        ${earned 
          ? 'bg-gradient-to-br from-white/90 to-white/70 border-emerald-200 shadow-xl' 
          : 'bg-white/60 border-slate-200/60 hover:border-slate-300/60 shadow-lg'
        }
      `}
    >
      {/* Glowing background effect for earned badges */}
      {earned && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-20"
          style={{ backgroundColor: color }}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.3, 0.1] 
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      <div className="flex flex-col items-center text-center space-y-3 relative z-10">
        <motion.div 
          className={`
            p-4 rounded-full transition-all duration-500 relative
            ${earned 
              ? 'shadow-2xl' 
              : 'bg-slate-100 group-hover:bg-slate-200'
            }
          `}
          style={{
            backgroundColor: earned ? color : undefined,
            backgroundImage: earned ? `linear-gradient(135deg, ${color}, ${color}cc)` : undefined,
            boxShadow: earned ? `0 0 30px ${color}40, 0 10px 25px rgba(0,0,0,0.15)` : undefined
          }}
          animate={earned ? {
            boxShadow: [
              `0 0 20px ${color}30, 0 5px 15px rgba(0,0,0,0.1)`,
              `0 0 40px ${color}50, 0 10px 25px rgba(0,0,0,0.15)`,
              `0 0 20px ${color}30, 0 5px 15px rgba(0,0,0,0.1)`
            ]
          } : {}}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className={earned ? 'text-white drop-shadow-lg' : 'text-slate-400'}>
            {icon}
          </div>
          
          {/* Sparkle effect for earned badges */}
          {earned && (
            <>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80"
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 0
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-white rounded-full opacity-60"
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: 1
                }}
              />
            </>
          )}
        </motion.div>
        
        <h4 className={`font-semibold ${earned ? 'text-slate-800' : 'text-slate-500'}`}>
          {title}
        </h4>
        <p className={`text-sm ${earned ? 'text-slate-600' : 'text-slate-400'}`}>
          {description}
        </p>
        
        {progress !== undefined && !earned && (
          <div className="w-full space-y-2">
            <Progress 
              value={progress} 
              className="h-2 bg-slate-200"
            />
            <p className="text-xs text-slate-500 font-medium">{progress}% complete</p>
          </div>
        )}
      </div>
      
      {/* Earned indicator with glow */}
      {earned && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            damping: 15,
            delay: 0.3
          }}
          className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl"
          style={{
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <CheckCircle className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}

interface QuestProps {
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: string;
  icon: React.ReactNode;
  color: string;
  timeLeft?: string;
}

function QuestCard({ title, description, progress, maxProgress, reward, icon, color, timeLeft }: QuestProps) {
  const progressPercent = (progress / maxProgress) * 100;
  const isCompleted = progress >= maxProgress;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/60 backdrop-blur-md rounded-xl border border-white/30 p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div 
          className="p-2 rounded-lg flex-shrink-0"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {icon}
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-700">{title}</h4>
              {isCompleted && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <Gift className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Progress: {progress}/{maxProgress}</span>
              <span className="font-medium text-slate-700">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-amber-600">
              <Star className="w-3 h-3" />
              <span>{reward}</span>
            </div>
            {timeLeft && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{timeLeft}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Gamification() {
  const badges = [
    {
      title: "Medicine Star ⭐",
      description: "Perfect week of meds!",
      icon: <Award className="w-5 h-5" />,
      color: "#10b981",
      earned: true
    },
    {
      title: "Heart Hero 💗",
      description: "Great blood pressure",
      icon: <Heart className="w-5 h-5" />,
      color: "#f97316",
      earned: true
    },
    {
      title: "Sugar Warrior 🛡️",
      description: "Stable glucose levels",
      icon: <Target className="w-5 h-5" />,
      color: "#3b82f6",
      earned: false,
      progress: 78
    },
    {
      title: "Daily Champion 🏆",
      description: "30-day check-in streak",
      icon: <Calendar className="w-5 h-5" />,
      color: "#8b5cf6",
      earned: false,
      progress: 45
    },
    {
      title: "Wellness Warrior ⚡",
      description: "90 days of growth",
      icon: <Zap className="w-5 h-5" />,
      color: "#f59e0b",
      earned: false,
      progress: 12
    },
    {
      title: "Week Winner 🎯",
      description: "All goals achieved!",
      icon: <Trophy className="w-5 h-5" />,
      color: "#06b6d4",
      earned: true
    }
  ];

  const quests = [
    {
      title: "This Week's Medicine Quest 💊",
      description: "Take your medications on time every day this week",
      progress: 5,
      maxProgress: 7,
      reward: "Medicine Star Badge + 75 points",
      icon: <Target className="w-4 h-4" />,
      color: "#10b981",
      timeLeft: "2 days left"
    },
    {
      title: "Blood Pressure Hero Challenge 🩺",
      description: "Check and log your BP twice daily for 5 days",
      progress: 8,
      maxProgress: 10,
      reward: "Heart Hero Badge + 100 points",
      icon: <Heart className="w-4 h-4" />,
      color: "#f97316",
      timeLeft: "1 day left"
    },
    {
      title: "Wellness Check-in Streak 📋",
      description: "Complete your daily wellness check 3 times",
      progress: 2,
      maxProgress: 3,
      reward: "Consistency points + health insights",
      icon: <Trophy className="w-4 h-4" />,
      color: "#3b82f6",
      timeLeft: "3 days left"
    },
    {
      title: "Healthy Habit Builder 🌱",
      description: "Try one new healthy activity this week",
      progress: 0,
      maxProgress: 1,
      reward: "Explorer Badge + surprise reward",
      icon: <Star className="w-4 h-4" />,
      color: "#8b5cf6",
      timeLeft: "6 days left"
    }
  ];

  const totalPoints = 1247;
  const currentLevel = 8;
  const pointsToNextLevel = 253;

  return (
    <div className="space-y-6">
      {/* Level and Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Level {currentLevel} 🌟</h2>
            <p className="text-purple-100 text-lg">Health Champion</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{totalPoints.toLocaleString()}</p>
            <p className="text-purple-100 text-lg">Wellness Points</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {currentLevel + 1}</span>
            <span>{pointsToNextLevel} points to go</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: '83%' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Your Achievements 🏆
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <AchievementBadge {...badge} />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Quests */}
      <Card className="bg-white/60 backdrop-blur-md border-white/30 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            This Week's Health Quests 🎯
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quests.map((quest, index) => (
              <motion.div
                key={quest.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <QuestCard {...quest} />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}