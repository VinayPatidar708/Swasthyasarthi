import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  FileText, 
  Trophy, 
  Users, 
  BarChart3, 
  Settings,
  Stethoscope
} from "lucide-react";
import { Button } from "./ui/button";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, active = false, onClick }: SidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          className={`
            w-14 h-14 rounded-2xl transition-all duration-300 relative overflow-hidden
            ${active 
              ? 'bg-gradient-to-br from-emerald-400/15 to-cyan-500/15 text-emerald-600 shadow-lg ring-2 ring-emerald-400/20' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/80'
            }
          `}
          onClick={onClick}
        >
          {/* Soft glow effect */}
          <motion.div
            className={`absolute inset-0 rounded-2xl ${
              active 
                ? 'bg-gradient-to-br from-emerald-400/10 to-cyan-500/10' 
                : 'bg-gradient-to-br from-blue-400/5 to-cyan-500/5'
            }`}
            animate={{
              opacity: isHovered ? 1 : active ? 0.7 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Icon with subtle glow */}
          <motion.div
            className="relative z-10"
            animate={{
              filter: isHovered ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' : 'none'
            }}
          >
            {icon}
          </motion.div>

          {/* Active indicator */}
          {active && (
            <motion.div
              className="absolute right-0 top-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-cyan-500 rounded-l-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </Button>
      </motion.div>

      {/* Slide-out text label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-4 z-50"
          >
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl border border-white/20 text-sm font-medium text-slate-700 whitespace-nowrap">
              {label}
              {/* Arrow pointing to sidebar */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-white/95"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SidebarProps {
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export function Sidebar({ activeView = "Home", onViewChange }: SidebarProps) {
  const menuItems = [
    { icon: <Home className="w-6 h-6" />, label: "Home", active: activeView === "Home", onClick: () => onViewChange?.("Home") },
    { icon: <FileText className="w-6 h-6" />, label: "Logs", active: activeView === "Logs", onClick: () => onViewChange?.("Logs") },
    { icon: <Trophy className="w-6 h-6" />, label: "Gamification", active: activeView === "Gamification", onClick: () => onViewChange?.("Gamification") },
    { icon: <Users className="w-6 h-6" />, label: "Caregivers", active: activeView === "Caregivers", onClick: () => onViewChange?.("Caregivers") },
    { icon: <BarChart3 className="w-6 h-6" />, label: "Reports", active: activeView === "Reports", onClick: () => onViewChange?.("Reports") },
    { icon: <Settings className="w-6 h-6" />, label: "Settings", active: activeView === "Settings", onClick: () => onViewChange?.("Settings") }
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-20 bg-white/90 backdrop-blur-xl border-r border-slate-200/50 z-40 flex flex-col items-center py-8 shadow-xl"
    >
      {/* Logo with hospital cross */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", damping: 15 }}
        className="mb-10 p-4 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl shadow-lg group cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        <Stethoscope className="w-7 h-7 text-white drop-shadow-lg" />
        {/* Subtle pulse animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20"
          animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Navigation Items */}
      <div className="flex flex-col gap-3 flex-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index + 0.4 }}
          >
            <SidebarItem {...item} />
          </motion.div>
        ))}
      </div>

      {/* Hospital-style status indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 flex flex-col items-center space-y-2"
      >
        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
        <div className="text-xs text-slate-400 font-medium">ONLINE</div>
      </motion.div>
    </motion.div>
  );
}