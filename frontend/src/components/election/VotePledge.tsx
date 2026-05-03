"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Users, CheckCircle } from "lucide-react";

const STORAGE_KEY = "matdaan_pledge_taken";
const PLEDGE_COUNT_KEY = "matdaan_pledge_count";
/** Starting baseline count for social proof (real count would come from backend). */
const BASE_COUNT = 12473;

/**
 * VotePledge — lets users pledge to vote with persistent localStorage state.
 * Shows an animated live counter and confetti-style celebration on pledge.
 */
export const VotePledge = () => {
  const [pledged, setPledged] = useState(false);
  const [count, setCount] = useState(BASE_COUNT);
  const [animating, setAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasPledged = localStorage.getItem(STORAGE_KEY) === "true";
    const storedCount = parseInt(localStorage.getItem(PLEDGE_COUNT_KEY) || String(BASE_COUNT), 10);
    setPledged(hasPledged);
    setCount(hasPledged ? storedCount : BASE_COUNT);
  }, []);

  const handlePledge = useCallback(() => {
    if (pledged) return;
    const newCount = count + 1;
    setAnimating(true);
    setPledged(true);
    setCount(newCount);
    localStorage.setItem(STORAGE_KEY, "true");
    localStorage.setItem(PLEDGE_COUNT_KEY, String(newCount));
    setTimeout(() => setAnimating(false), 600);
  }, [pledged, count]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePledge();
      }
    },
    [handlePledge]
  );

  if (!mounted) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative w-full max-w-3xl mx-auto my-6 p-8 rounded-3xl bg-gradient-to-br from-rose-900/20 via-pink-900/10 to-transparent border border-white/10 backdrop-blur-md overflow-hidden text-center"
      aria-label="Vote Pledge Section"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,63,94,0.06),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-5">
        {/* Icon */}
        <div
          className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center"
          aria-hidden="true"
        >
          <Heart size={28} className="text-rose-400" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-white mb-2">Pledge to Vote</h3>
          <p className="text-white/50 text-sm max-w-xs mx-auto">
            Join thousands of citizens who have committed to making their voice heard this election.
          </p>
        </div>

        {/* Live counter */}
        <div className="flex items-center justify-center gap-3" aria-live="polite">
          <Users size={18} className="text-rose-400" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-3xl font-black text-white tabular-nums"
              aria-label={`${count.toLocaleString("en-IN")} people have pledged`}
            >
              {count.toLocaleString("en-IN")}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/40 text-sm">pledges</span>
        </div>

        {/* CTA button */}
        <AnimatePresence mode="wait">
          {pledged ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-sm"
              role="status"
            >
              <CheckCircle size={18} aria-hidden="true" />
              You&apos;ve pledged to vote! Thank you.
            </motion.div>
          ) : (
            <motion.button
              key="pledge"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              animate={animating ? { scale: [1, 1.12, 1] } : {}}
              onClick={handlePledge}
              onKeyDown={handleKeyDown}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-rose-500/20 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-black transition-all"
              aria-label="Click to pledge that you will vote in the next election"
            >
              <Heart size={18} aria-hidden="true" />I Pledge to Vote
            </motion.button>
          )}
        </AnimatePresence>

        <p className="text-[10px] text-white/20 tracking-wide uppercase">
          This pledge is personal and stored locally on your device.
        </p>
      </div>
    </motion.section>
  );
};
