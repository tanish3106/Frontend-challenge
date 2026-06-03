"use client";

/**
 * UI LAYER — Sidebar, Bento tiles, animations, skeleton loader.
 * All Framer Motion and interactive UI in this one file.
 */

import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  BarChart3,
  Settings,
  Menu,
  Flame,
  Code2,
  Database,
  Layout,
  type LucideIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
/** Course shape passed from server (matches Supabase table) */
type Course = {
  id: string;
  title: string;
  progress: number;
  icon_name: string;
};

/** Maps icon_name from DB to Lucide icon (client-only) */
const iconMap = { BookOpen, Code2, Database, Layout };
function getIconByName(name: string): LucideIcon {
  return iconMap[name as keyof typeof iconMap] ?? BookOpen;
}

/* ---------- Animated Bento wrapper (stagger + spring hover) ---------- */

function BentoTile({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.article
      className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${className}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
      style={{ willChange: "transform" }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
        whileHover={{
          opacity: 1,
          boxShadow: "0 0 24px rgba(99, 102, 241, 0.25)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-hidden
      />
      {children}
    </motion.article>
  );
}

/* ---------- Progress bar (scaleX only — no layout shift) ---------- */

function ProgressBar({ progress }: { progress: number }) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <div
      className="h-2 w-full rounded-full bg-border overflow-hidden"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full origin-left rounded-full bg-gradient-to-r from-accent to-accent-glow"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: clamped / 100 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        style={{ width: "100%" }}
      />
    </div>
  );
}

/* ---------- Hero, course, activity tiles ---------- */

function HeroTile({ delay = 0 }: { delay?: number }) {
  return (
    <BentoTile
      className="md:col-span-2 min-h-[160px] p-6 card-texture"
      delay={delay}
    >
      <section className="flex h-full flex-col justify-between">
        <div>
          <p className="text-sm text-gray-400">Welcome back,</p>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-accent-glow bg-clip-text text-transparent">
            Tanish
          </h1>
        </div>
        <div className="flex items-center gap-2 mt-4 text-amber-400">
          <Flame size={22} aria-hidden />
          <p className="text-sm font-medium">
            <span className="text-white">7 day</span> learning streak
          </p>
        </div>
      </section>
    </BentoTile>
  );
}

function CourseCard({ course, delay = 0 }: { course: Course; delay?: number }) {
  const Icon = getIconByName(course.icon_name);
  return (
    <BentoTile className="min-h-[140px] p-5 card-texture" delay={delay}>
      <section className="flex flex-col h-full gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-accent/20 p-2 text-accent-glow">
            <Icon size={22} aria-hidden />
          </div>
          <h2 className="text-base font-semibold line-clamp-2">{course.title}</h2>
        </div>
        <div className="mt-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <ProgressBar progress={course.progress} />
        </div>
      </section>
    </BentoTile>
  );
}

const mockWeek = [0.3, 0.6, 0.4, 0.9, 0.5, 0.7, 0.2];
const days = ["M", "T", "W", "T", "F", "S", "S"];

function ActivityTile({ delay = 0 }: { delay?: number }) {
  return (
    <BentoTile className="md:col-span-2 min-h-[180px] p-5" delay={delay}>
      <section>
        <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
        <div className="flex items-end justify-between gap-2 h-24">
          {mockWeek.map((h, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-1">
              <div
                className="w-full max-w-[28px] rounded-t bg-accent/60 mx-auto"
                style={{ height: `${h * 100}%`, minHeight: "8px" }}
              />
              <span className="text-xs text-gray-500">{days[i]}</span>
            </div>
          ))}
        </div>
      </section>
    </BentoTile>
  );
}

/** Main Bento grid — receives courses from the server page */
export function DashboardGrid({ courses }: { courses: Course[] }) {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="Dashboard bento grid"
    >
      <HeroTile delay={0} />
      {courses.map((c, i) => (
        <CourseCard key={c.id} course={c} delay={0.1 + i * 0.1} />
      ))}
      <ActivityTile delay={0.1 + courses.length * 0.1 + 0.1} />
    </section>
  );
}

/* ---------- Sidebar with layoutId highlight ---------- */

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "activity", label: "Activity", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

function NavButton({
  item,
  isActive,
  onClick,
  showLabel,
}: {
  item: (typeof navItems)[0];
  isActive: boolean;
  onClick: () => void;
  showLabel: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 w-full"
    >
      {isActive && (
        <motion.span
          layoutId="nav-highlight"
          className="absolute inset-0 rounded-xl bg-accent/20 border border-accent/30"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      )}
      <Icon size={20} className="relative z-10 shrink-0" />
      {showLabel ? (
        <span className="relative z-10 hidden lg:inline">{item.label}</span>
      ) : (
        <span className="sr-only">{item.label}</span>
      )}
    </button>
  );
}

/** Collapsible sidebar (desktop/tablet) + bottom nav (mobile) */
export function Sidebar() {
  const [activeId, setActiveId] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav
        className="hidden md:flex md:flex-col md:w-20 lg:w-56 md:min-h-screen md:border-r md:border-border md:bg-surface/50 md:p-4 md:gap-2"
        aria-label="Main navigation"
      >
        <p className="hidden lg:block text-sm font-semibold text-gray-400 mb-4 px-2">
          LearnDash
        </p>
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => setActiveId(item.id)}
            showLabel
          />
        ))}
      </nav>
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-border bg-surface/95 p-2"
        aria-label="Mobile navigation"
      >
        {navItems.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => setActiveId(item.id)}
            showLabel={false}
          />
        ))}
        <button
          type="button"
          className="p-2 text-gray-400"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>
      </nav>
      {mobileOpen && (
        <motion.aside
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

/** Error screen when Supabase fails */
export function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <main className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-xl font-semibold text-red-400 mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-400 mb-4 max-w-md">
        Check .env.local and run the SQL from README in Supabase.
      </p>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-accent text-white"
        >
          Try again
        </button>
      )}
    </main>
  );
}
