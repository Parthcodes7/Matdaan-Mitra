"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, RefreshCcw, Share2, Send, MessageCircle } from "lucide-react";
import confetti from "canvas-confetti";

/** Quiz question definition. */
interface QuizQuestion {
  q: string;
  a: boolean;
  tip: string;
}

const questions: QuizQuestion[] = [
  { q: "Are you 18 years or older?", a: true, tip: "You must be 18 to vote in national elections." },
  { q: "Do you have a valid Voter ID (EPIC)?", a: true, tip: "A Voter ID is essential, but other documents like Aadhaar can sometimes work." },
  { q: "Is your name in the Electoral Roll?", a: true, tip: "Check nvsp.in to verify your registration status." },
  { q: "Do you know your polling booth location?", a: true, tip: "Use the Booth Locator on our home page!" },
  { q: "Have you reviewed the backgrounds of your local candidates?", a: true, tip: "Use the 'Know Your Netas' tool to check their profiles and AI risk analysis." },
];

/** Launches a rich confetti burst from the center of the viewport. */
function celebrateWithConfetti() {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b"],
  });
}

export const ReadinessQuiz = () => {
  const [current, setCurrent] = useState(0);
  // FIX: Track score synchronously instead of relying on batched state update
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [shareLoading, setShareLoading] = useState(false);

  const handleAnswer = useCallback(
    (ans: boolean) => {
      const isCorrect = ans === questions[current].a;
      setLastAnswerCorrect(isCorrect);

      // Compute new score synchronously to avoid stale-state race on confetti
      const newScore = isCorrect ? score + 1 : score;
      if (isCorrect) setScore(newScore);

      if (current < questions.length - 1) {
        // Slight delay so user sees correct/incorrect flash
        setTimeout(() => {
          setCurrent((prev) => prev + 1);
          setLastAnswerCorrect(null);
        }, 400);
      } else {
        setTimeout(() => {
          setShowResult(true);
          // Use synchronously computed newScore (not stale `score` from closure)
          if (newScore >= 3) celebrateWithConfetti();
        }, 400);
      }
    },
    [current, score]
  );

  const reset = useCallback(() => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setLastAnswerCorrect(null);
  }, []);

  /** Shares results via the Web Share API, falling back to clipboard. */
  const handleShare = useCallback(async () => {
    const percent = Math.round((score / questions.length) * 100);
    const text = `I scored ${score}/${questions.length} (${percent}%) on the Matdaan-Mitra Voter Readiness Quiz! Are you ready to vote? 🗳️\nhttps://matdaan-mitra.com`;

    setShareLoading(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: "Matdaan-Mitra Voter Readiness", text });
      } else {
        await navigator.clipboard.writeText(text);
        alert("Result copied to clipboard!");
      }
    } catch {
      // User cancelled share — no action needed
    } finally {
      setShareLoading(false);
    }
  }, [score]);

  const shareOnTwitter = useCallback(() => {
    const percent = Math.round((score / questions.length) * 100);
    const tweet = encodeURIComponent(
      `I scored ${percent}% on the Matdaan-Mitra Voter Readiness Quiz! 🗳️ Are you ready to vote?\nhttps://matdaan-mitra.com`
    );
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, "_blank", "noopener,noreferrer");
  }, [score]);

  const shareOnWhatsApp = useCallback(() => {
    const percent = Math.round((score / questions.length) * 100);
    const msg = encodeURIComponent(
      `I scored ${percent}% on the Matdaan-Mitra Voter Readiness Quiz! 🗳️ Check yours at https://matdaan-mitra.com`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
  }, [score]);

  return (
    <div
      className="w-full max-w-md mx-auto p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
      role="region"
      aria-label="Voter Readiness Quiz"
    >
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between text-xs text-white/40 uppercase tracking-widest">
              <span aria-label={`Question ${current + 1} of ${questions.length}`}>
                Question {current + 1} of {questions.length}
              </span>
              <span aria-label={`Ready score: ${Math.round((score / questions.length) * 100)} percent`}>
                Ready Score: {Math.round((score / questions.length) * 100)}%
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={current + 1}
              aria-valuemin={1}
              aria-valuemax={questions.length}
              aria-label="Quiz progress"
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <h3 id="quiz-question" className="text-xl font-bold text-white">
              {questions[current].q}
            </h3>

            {/* Answer feedback flash */}
            <AnimatePresence>
              {lastAnswerCorrect !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-sm font-bold text-center py-2 rounded-xl ${
                    lastAnswerCorrect
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                  role="alert"
                  aria-live="assertive"
                >
                  {lastAnswerCorrect ? "✓ Correct!" : "✗ Not quite — check the tip below"}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-2 gap-4" role="group" aria-labelledby="quiz-question">
              <button
                id={`quiz-yes-btn-${current}`}
                onClick={() => handleAnswer(true)}
                className="py-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Answer Yes"
              >
                Yes
              </button>
              <button
                id={`quiz-no-btn-${current}`}
                onClick={() => handleAnswer(false)}
                className="py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white transition-all font-bold focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label="Answer No"
              >
                No
              </button>
            </div>

            <p className="text-xs text-white/40 italic flex gap-2 items-center" role="note">
              <AlertCircle size={14} aria-hidden="true" /> {questions[current].tip}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-5"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2
              size={60}
              className={`mx-auto ${score >= 3 ? "text-emerald-500" : "text-amber-400"}`}
              aria-hidden="true"
            />
            <h3
              className="text-3xl font-black"
              aria-label={`Score: ${score} out of ${questions.length}`}
            >
              Score: {score}/{questions.length}
            </h3>
            <p className="text-white/60 text-sm">
              {score === questions.length
                ? "🎉 You're fully ready to vote! Go make a difference."
                : score >= 3
                ? "Almost there! Review the tips and you'll be fully ready."
                : "Keep learning! Use our tools above to complete your readiness."}
            </p>

            {/* Social Share buttons */}
            <div className="pt-2 space-y-3">
              <p className="text-xs text-white/30 uppercase tracking-widest">Share your result</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button
                  id="share-native-btn"
                  onClick={handleShare}
                  disabled={shareLoading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
                  aria-label="Share your quiz result"
                >
                  <Share2 size={14} aria-hidden="true" />
                  Share
                </button>
                <button
                  id="share-twitter-btn"
                  onClick={shareOnTwitter}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 text-sm font-medium hover:bg-sky-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
                  aria-label="Share on Twitter"
                >
                  <Send size={14} aria-hidden="true" />
                  Twitter
                </button>
                <button
                  id="share-whatsapp-btn"
                  onClick={shareOnWhatsApp}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium hover:bg-emerald-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  aria-label="Share on WhatsApp"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  WhatsApp
                </button>
              </div>
            </div>

            <button
              id="retake-quiz-btn"
              onClick={reset}
              className="flex items-center gap-2 mx-auto px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Retake the readiness quiz"
            >
              <RefreshCcw size={16} aria-hidden="true" /> Retake Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
