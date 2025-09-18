import React, { useState } from "react";
import { motion } from "motion/react";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Reminders } from "./components/Reminders";
import { HealthMetrics } from "./components/HealthMetrics";
import { StreakHeatmap } from "./components/StreakHeatmap";
import { HealthGraphs } from "./components/HealthGraphs";
import { HumanFigure } from "./components/HumanFigure";
import { HealthActivityStreak } from "./components/HealthActivityStreak";
import { Gamification } from "./components/Gamification";
import { LogScreen } from "./components/LogScreen";
import { GamificationScreen } from "./components/GamificationScreen";
import { ReportsScreen } from "./components/ReportsScreen";
import { CaregiverScreen } from "./components/CaregiverScreen";
import { CaregiverViewDashboard } from "./components/CaregiverViewDashboard";
import { SettingsScreen } from "./components/SettingsScreen";

export default function App() {
  const [currentView, setCurrentView] = useState("Home");
  const [viewMode, setViewMode] = useState<'patient' | 'caregiver'>('patient');

  const handleViewModeChange = (mode: 'patient' | 'caregiver') => {
    setViewMode(mode);
    // Reset to home when switching modes
    if (mode === 'caregiver') {
      setCurrentView("CaregiverView");
    } else {
      setCurrentView("Home");
    }
  };

  const renderCurrentView = () => {
    // Caregiver View Mode
    if (viewMode === 'caregiver') {
      return <CaregiverViewDashboard />;
    }

    // Patient View Mode
    if (currentView === "Logs") {
      return <LogScreen />;
    }

    if (currentView === "Gamification") {
      return <GamificationScreen />;
    }

    if (currentView === "Reports") {
      return <ReportsScreen />;
    }

    if (currentView === "Caregivers") {
      return <CaregiverScreen />;
    }

    if (currentView === "Settings") {
      return <SettingsScreen />;
    }

    // Default dashboard view
    return (
      <div className="ml-20 min-h-screen pt-20">
        <div className="max-w-full p-8 space-y-8">
          {/* Welcome Header Section - Patient Friendly */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome back, Jatin 👋
                </h1>
                <p className="text-slate-600 mt-2 text-lg">
                  Here's how you're doing today
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-200 shadow-lg">
                  <div className="text-2xl font-bold text-emerald-600">
                    Day 12
                  </div>
                  <div className="text-sm text-emerald-500 font-medium">
                    Health Streak
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                  <div className="text-right">
                    <p className="font-medium text-slate-700">
                      Feeling Great
                    </p>
                    <p className="text-sm text-slate-500">
                      Last updated now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🌟</span>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800">
                    You're doing amazing!
                  </h3>
                  <p className="text-emerald-700">
                    Your blood pressure is improving and you've
                    been consistent with your goals. Keep it up!
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Health Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <HealthMetrics />
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column - Charts and CRRS Score */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <HealthGraphs />
              </motion.div>
            </div>

            {/* Right Column - 3D Health Assessment */}
            <div className="col-span-12 lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <HumanFigure />
              </motion.div>
            </div>
          </div>

          {/* Health Activity Streak Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <HealthActivityStreak />
          </motion.div>

          {/* Gamification & Achievements Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Gamification />
          </motion.div>

          {/* Quick Health Actions - Updated with View Report */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                  📊
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    View Report
                  </h3>
                  <p className="text-sm text-slate-600">
                    Review your health summary
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                  💭
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    Log Symptoms
                  </h3>
                  <p className="text-sm text-slate-600">
                    Track how you're feeling
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                  ⏰
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    Medication Time
                  </h3>
                  <p className="text-sm text-slate-600">
                    View today's schedule
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-2xl shadow-lg group-hover:scale-110 transition-all duration-300">
                  💬
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">
                    Get Support
                  </h3>
                  <p className="text-sm text-slate-600">
                    Chat with your care team
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Caring Footer Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-white/30"
          >
            <p className="text-slate-600 text-lg">
              Remember: Small steps every day lead to big
              improvements. You've got this! 💪
            </p>
          </motion.div>
        </div>

        {/* Emergency Support Button */}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 1.5,
            type: "spring",
            damping: 15,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 w-18 h-18 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-red-500/25 transition-all duration-300 z-50 group"
          title="Emergency Support"
        >
          <div className="text-center">
            <div className="text-2xl">🆘</div>
            <div className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Help
            </div>
          </div>

          {/* Pulse ring for emergency button */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.button>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Top Navigation */}
      <TopBar 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Render Current View */}
      {renderCurrentView()}
    </div>
  );
}