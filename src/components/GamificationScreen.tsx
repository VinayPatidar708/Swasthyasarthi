import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Award, 
  Lock, 
  CheckCircle2,
  Calendar,
  TrendingUp,
  Medal,
  Gift,
  Timer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function GamificationScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
  // Mock user stats
  const userStats = {
    totalPoints: 2847,
    currentStreak: 12,
    longestStreak: 28,
    level: 7,
    levelProgress: 68,
    nextLevelPoints: 3000
  };

  // Mock streak data for calendar heatmap
  const streakData = generateStreakData();

  // Mock badges data
  const badges = [
    { id: 1, name: "First Steps", description: "Complete your first health log", icon: "👶", earned: true, rarity: "common" },
    { id: 2, name: "Week Warrior", description: "Log health data for 7 consecutive days", icon: "⚔️", earned: true, rarity: "common" },
    { id: 3, name: "Streak Master", description: "Maintain a 30-day logging streak", icon: "🔥", earned: false, rarity: "rare" },
    { id: 4, name: "Health Champion", description: "Achieve all weekly goals for a month", icon: "🏆", earned: true, rarity: "epic" },
    { id: 5, name: "Vital Virtuoso", description: "Perfect medication adherence for 2 weeks", icon: "💊", earned: true, rarity: "rare" },
    { id: 6, name: "Wellness Wizard", description: "Complete 100 health assessments", icon: "🧙‍♂️", earned: false, rarity: "legendary" },
    { id: 7, name: "Care Companion", description: "Connect with 3 caregivers", icon: "🤝", earned: true, rarity: "common" },
    { id: 8, name: "Data Detective", description: "Use analytics feature 50 times", icon: "🔍", earned: false, rarity: "rare" }
  ];

  // Mock weekly quests
  const weeklyQuests = [
    { 
      id: 1, 
      title: "Daily Logger", 
      description: "Log your health data every day this week", 
      progress: 5, 
      target: 7, 
      reward: 150, 
      type: "logging",
      completed: false
    },
    { 
      id: 2, 
      title: "Medication Master", 
      description: "Take medications on schedule for 5 days", 
      progress: 3, 
      target: 5, 
      reward: 100, 
      type: "medication",
      completed: false
    },
    { 
      id: 3, 
      title: "Vitals Victory", 
      description: "Keep blood pressure in target range for 3 days", 
      progress: 3, 
      target: 3, 
      reward: 200, 
      type: "vitals",
      completed: true
    }
  ];

  return (
    <div className="ml-20 p-8 space-y-8 pt-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Your Health Journey 🚀
            </h1>
            <p className="text-slate-600 mt-2 text-lg">
              Level up your wellness game!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center shadow-xl"
            >
              <div className="text-3xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
              <div className="text-purple-100 text-sm">Total Points</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center shadow-xl"
            >
              <div className="text-3xl font-bold flex items-center justify-center gap-2">
                <Flame className="w-8 h-8" />
                {userStats.currentStreak}
              </div>
              <div className="text-orange-100 text-sm">Day Streak</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Level Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-indigo-800">
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
                <Star className="w-6 h-6" />
              </div>
              Level {userStats.level} - Health Enthusiast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-indigo-700">
                <span>{userStats.totalPoints} / {userStats.nextLevelPoints} points</span>
                <span>{userStats.nextLevelPoints - userStats.totalPoints} points to next level</span>
              </div>
              <Progress 
                value={userStats.levelProgress} 
                className="h-3 bg-indigo-100"
              />
              <p className="text-sm text-indigo-600">
                🎯 Next Level: <strong>Wellness Warrior</strong> - Unlock exclusive health insights!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Streak Calendar & Weekly Quests */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Streak Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800">
                  <Calendar className="w-6 h-6" />
                  Health Activity Streak
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={selectedPeriod === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod("week")}
                    className="text-xs"
                  >
                    This Week
                  </Button>
                  <Button
                    variant={selectedPeriod === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod("month")}
                    className="text-xs"
                  >
                    This Month
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-emerald-600 py-2">
                        {day}
                      </div>
                    ))}
                    {streakData.map((day, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer
                          ${day.activity === 0 ? 'bg-slate-100 text-slate-400' : 
                            day.activity === 1 ? 'bg-emerald-200 text-emerald-700' :
                            day.activity === 2 ? 'bg-emerald-300 text-emerald-800' :
                            'bg-emerald-500 text-white'
                          }
                        `}
                      >
                        {day.day}
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-600">Activity Level:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-slate-100 rounded border"></div>
                      <span className="text-xs text-slate-500">None</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-200 rounded"></div>
                      <span className="text-xs text-slate-500">Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-300 rounded"></div>
                      <span className="text-xs text-slate-500">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                      <span className="text-xs text-slate-500">High</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Quests */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-orange-800">
                  <Target className="w-6 h-6" />
                  Weekly Quests
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">New Week!</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyQuests.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-300
                        ${quest.completed 
                          ? 'bg-green-50 border-green-200 opacity-75' 
                          : 'bg-white border-orange-200 hover:border-orange-300'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center
                              ${quest.completed ? 'bg-green-500' : 'bg-orange-500'} text-white
                            `}>
                              {quest.completed ? <CheckCircle2 className="w-5 h-5" /> : 
                               quest.type === 'logging' ? <Calendar className="w-5 h-5" /> :
                               quest.type === 'medication' ? <Timer className="w-5 h-5" /> :
                               <TrendingUp className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800">{quest.title}</h4>
                              <p className="text-sm text-slate-600">{quest.description}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Progress</span>
                              <span className="font-medium">
                                {quest.progress}/{quest.target}
                              </span>
                            </div>
                            <Progress 
                              value={(quest.progress / quest.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        </div>
                        
                        <div className="ml-4 text-center">
                          <div className="flex items-center gap-1 text-orange-600 font-medium">
                            <Gift className="w-4 h-4" />
                            {quest.reward}
                          </div>
                          <div className="text-xs text-slate-500">points</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Badges */}
        <div className="col-span-12 lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-pink-800">
                  <Award className="w-6 h-6" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="earned" className="text-xs">Earned</TabsTrigger>
                    <TabsTrigger value="locked" className="text-xs">Locked</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {badges.map((badge, index) => (
                        <BadgeCard key={badge.id} badge={badge} index={index} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="earned">
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {badges.filter(badge => badge.earned).map((badge, index) => (
                        <BadgeCard key={badge.id} badge={badge} index={index} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="locked">
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {badges.filter(badge => !badge.earned).map((badge, index) => (
                        <BadgeCard key={badge.id} badge={badge} index={index} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function BadgeCard({ badge, index }: { badge: any; index: number }) {
  const rarityColors = {
    common: "from-slate-400 to-slate-500",
    rare: "from-blue-400 to-blue-500", 
    epic: "from-purple-400 to-purple-500",
    legendary: "from-yellow-400 to-orange-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`
        relative p-4 rounded-xl border-2 text-center transition-all duration-300
        ${badge.earned 
          ? 'bg-white border-pink-200 shadow-md hover:shadow-lg' 
          : 'bg-slate-50 border-slate-200 opacity-60'
        }
      `}
    >
      {!badge.earned && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-xl">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
      )}
      
      <div className={`
        w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl mb-2
        bg-gradient-to-br ${rarityColors[badge.rarity as keyof typeof rarityColors]} 
        ${badge.earned ? 'shadow-lg' : 'grayscale'}
      `}>
        {badge.icon}
      </div>
      
      <h4 className="font-medium text-sm text-slate-800 mb-1">{badge.name}</h4>
      <p className="text-xs text-slate-600 leading-tight">{badge.description}</p>
      
      <Badge 
        variant="secondary" 
        className={`
          mt-2 text-xs capitalize
          ${badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
            badge.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
            badge.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
            'bg-slate-100 text-slate-700'
          }
        `}
      >
        {badge.rarity}
      </Badge>
    </motion.div>
  );
}

function generateStreakData() {
  const data = [];
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  for (let i = 0; i < 35; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      day: date.getDate(),
      activity: Math.floor(Math.random() * 4), // 0-3 activity levels
      date: date.toDateString()
    });
  }
  
  return data;
}