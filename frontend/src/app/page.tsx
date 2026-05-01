"use client";

import { useState } from "react";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { InteractiveTimeline } from "@/components/election/InteractiveTimeline";
import { FloatingOrb } from "@/components/chat/FloatingOrb";
import { ReadinessQuiz } from "@/components/election/ReadinessQuiz";
import { AdvancedModal } from "@/components/election/AdvancedModal";
import { AnalyticsDashboard } from "@/components/election/AnalyticsDashboard";
import { CursorTrail } from "@/components/ui/CursorTrail";
import { 
  Vote, Users, Search, ClipboardList,
  MapPin, Eye, EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [location] = useState("Mumbai, MH");
  const [activeModal, setActiveModal] = useState<"eligibility" | "booth" | "id" | "candidates" | null>(null);

  return (
    <div className={`min-h-screen bg-[#050505] text-white overflow-x-hidden relative ${reduceMotion ? 'motion-reduce' : ''}`}>
      {!reduceMotion && <CursorTrail />}

      {/* Accessibility Controls */}
      <nav className="fixed top-4 right-4 z-[100] flex gap-2" aria-label="Accessibility controls">
        <button 
          id="motion-toggle"
          onClick={() => setReduceMotion(!reduceMotion)}
          className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          aria-label={reduceMotion ? "Enable animations" : "Reduce animations"}
          aria-pressed={reduceMotion}
        >
          {reduceMotion ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </nav>

      {/* Onboarding Overlay */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Welcome dialog"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center rotate-12 shadow-[0_0_40px_rgba(16,185,129,0.3)]" aria-hidden="true">
                <Vote size={40} className="text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight">Your Vote, <br /> Intelligent.</h1>
                <p className="text-white/60">Welcome to the future of election guidance. Experience our zero-gravity AI interface designed for clarity.</p>
              </div>
              <button 
                id="enter-experience-btn"
                onClick={() => setShowOnboarding(false)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-black"
                autoFocus
              >
                Enter Experience
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/15 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/15 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-10 px-6 max-w-7xl mx-auto text-center" aria-labelledby="hero-heading">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm mb-8 backdrop-blur-md"
        >
          <MapPin size={14} aria-hidden="true" />
          <span>Showing data for: <span className="font-bold">{location}</span></span>
        </motion.div>
        <h2 id="hero-heading" className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-2xl">
          Matdaan-Mitra <br />
          <span className="text-white/90">AI Experience</span>
        </h2>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12">
          This system reduces confusion for first-time voters by converting complex procedures into interactive, personalized guidance.
        </p>
      </section>

      {/* Floating Info Cards - SHIFTED HERE */}
      <section className="relative z-10 pb-20 px-6" aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="sr-only">Voter Resources</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FloatingCard delay={0.1} onClick={() => setActiveModal("eligibility")}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.15)]" aria-hidden="true">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white/90">Voter Eligibility</h3>
            <p className="text-white/50 text-sm leading-relaxed">Find out if you qualify. Check citizenship status and residency rules.</p>
          </FloatingCard>

          <FloatingCard delay={0.2} onClick={() => setActiveModal("booth")}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]" aria-hidden="true">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white/90">Find Your Booth</h3>
            <p className="text-white/50 text-sm leading-relaxed">Locate your nearest polling station with real-time distance metrics.</p>
          </FloatingCard>

          <FloatingCard delay={0.3} onClick={() => setActiveModal("id")}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-6 shadow-[0_0_30px_rgba(249,115,22,0.15)]" aria-hidden="true">
              <ClipboardList size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white/90">Required IDs</h3>
            <p className="text-white/50 text-sm leading-relaxed">Full list of accepted IDs including digital versions like m-Aadhaar.</p>
          </FloatingCard>

          <FloatingCard delay={0.4} onClick={() => setActiveModal("candidates")}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/30 to-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6 shadow-[0_0_30px_rgba(236,72,153,0.15)]" aria-hidden="true">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white/90">Know Your Netas</h3>
            <p className="text-white/50 text-sm leading-relaxed">Search and discover candidate details, parties, and their constituencies.</p>
          </FloatingCard>
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="relative z-10 px-6" aria-label="Analytics">
        <AnalyticsDashboard />
      </section>

      {/* Interactive Timeline */}
      <section className="relative z-10 py-20 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]" aria-labelledby="timeline-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="timeline-heading" className="text-4xl font-bold mb-4">Election Lifecycle</h2>
            <p className="text-white/40">From registration to results, explained visually</p>
          </div>
          <InteractiveTimeline />
        </div>
      </section>

      {/* Readiness & Quiz */}
      <section className="relative z-10 py-24 px-6 bg-black border-t border-white/5" aria-labelledby="quiz-heading">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <h2 id="quiz-heading" className="text-5xl md:text-6xl font-black tracking-tight leading-none">Are you <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Ready to Vote?</span></h2>
            <p className="text-lg text-white/60 leading-relaxed">
              Our interactive readiness check analyzes your current status and provides actionable steps to ensure your voice is heard.
            </p>
            <div className="flex gap-4" role="group" aria-label="Platform statistics">
              <div className="flex-1 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="text-3xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent" aria-label="12,500 voters guided">12.5k</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-2 font-semibold">Voters Guided</div>
              </div>
              <div className="flex-1 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="text-3xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent" aria-label="98 percent clarity score">98%</div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-2 font-semibold">Clarity Score</div>
              </div>
            </div>
          </div>
          <ReadinessQuiz />
        </div>
      </section>

      <AdvancedModal activeTab={activeModal} onClose={() => setActiveModal(null)} />

      <FloatingOrb />

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/10 text-center text-white/40 text-sm" role="contentinfo">
        <p>© 2026 Matdaan-Mitra. Built for the Future of Democracy.</p>
      </footer>
    </div>
  );
}
