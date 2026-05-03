"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Next Lok Sabha general election — approximately April 2029. */
const NEXT_ELECTION_DATE = new Date("2029-04-01T00:00:00+05:30");

const ELECTION_LABEL = "Next Lok Sabha Election";

function calcTimeLeft(): TimeLeft {
  const diff = NEXT_ELECTION_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface FlipUnitProps {
  value: number;
  label: string;
}

const FlipUnit = ({ value, label }: FlipUnitProps) => {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2" aria-label={`${value} ${label}`}>
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        {/* Back plate */}
        <div className="absolute inset-0 rounded-2xl bg-white/5 border border-white/10" aria-hidden="true" />
        {/* Value */}
        <motion.div
          key={display}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-black text-white tabular-nums"
          aria-hidden="true"
        >
          {display}
        </motion.div>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
        {label}
      </span>
    </div>
  );
};

/**
 * Countdown timer component showing time remaining until the next election.
 * Updates every second via setInterval, cleaned up on unmount.
 */
export const ElectionCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full max-w-3xl mx-auto my-10 p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden"
      aria-label={`Countdown to ${ELECTION_LABEL}`}
    >
      {/* Glow orbs */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          {/* Pulsing live dot */}
          <span className="relative flex h-3 w-3" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
          </span>
          <div className="flex items-center gap-2 text-sm text-white/60 font-medium">
            <Calendar size={16} className="text-indigo-400" aria-hidden="true" />
            <span>{ELECTION_LABEL}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white/80 sr-only">
          Time remaining until the next election
        </h3>

        <div
          className="flex items-center justify-center gap-4 md:gap-6"
          role="timer"
          aria-live="off"
          aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
        >
          <FlipUnit value={timeLeft.days} label="Days" />
          <div className="text-2xl font-black text-white/20 pb-6" aria-hidden="true">:</div>
          <FlipUnit value={timeLeft.hours} label="Hours" />
          <div className="text-2xl font-black text-white/20 pb-6" aria-hidden="true">:</div>
          <FlipUnit value={timeLeft.minutes} label="Mins" />
          <div className="text-2xl font-black text-white/20 pb-6" aria-hidden="true">:</div>
          <FlipUnit value={timeLeft.seconds} label="Secs" />
        </div>

        <p className="text-xs text-white/30 tracking-wide">
          Your vote shapes the next 5 years of India&apos;s democracy.
        </p>
      </div>
    </motion.section>
  );
};
