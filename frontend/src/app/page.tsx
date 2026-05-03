"use client";

import { useState } from "react";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { InteractiveTimeline } from "@/components/election/InteractiveTimeline";
import { FloatingOrb } from "@/components/chat/FloatingOrb";
import { ReadinessQuiz } from "@/components/election/ReadinessQuiz";
import { AdvancedModal } from "@/components/election/AdvancedModal";
import { AnalyticsDashboard } from "@/components/election/AnalyticsDashboard";
import { ElectionCountdown } from "@/components/election/ElectionCountdown";
import { VotePledge } from "@/components/election/VotePledge";
import { CursorTrail } from "@/components/ui/CursorTrail";
import {
  Vote, Users, Search, ClipboardList,
  MapPin, Eye, EyeOff, Phone, Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Bilingual content (Feature: Hindi / English toggle) ────────────────────
const CONTENT = {
  en: {
    heroTag: "Showing data for:",
    heroTitle: "Matdaan-Mitra",
    heroSub: "AI Experience",
    heroDesc: "This system reduces confusion for first-time voters by converting complex procedures into interactive, personalized guidance.",
    resourcesHeading: "Voter Resources",
    cards: [
      { title: "Voter Eligibility", desc: "Check citizenship status and residency rules." },
      { title: "Find Your Booth", desc: "Locate your nearest polling station easily." },
      { title: "Required IDs", desc: "Full list of accepted IDs including m-Aadhaar." },
      { title: "Know Your Netas", desc: "Discover candidate details and constituencies." },
      { title: "Emergency Helplines", desc: "EC contacts, toll-free numbers, and cVIGIL app info." },
    ],
    quizTitle: "Are you",
    quizHighlight: "Ready to Vote?",
    quizDesc: "Our interactive readiness check analyzes your current status and provides actionable steps to ensure your voice is heard.",
    stat1Label: "Voters Guided",
    stat1Val: "12.5k",
    stat2Label: "Clarity Score",
    stat2Val: "98%",
    timelineTitle: "Election Lifecycle",
    timelineDesc: "From registration to results, explained visually",
    enterBtn: "Enter Experience",
    onboardTitle: "Your Vote,",
    onboardSub: "Intelligent.",
    onboardDesc: "Welcome to the future of election guidance. Experience our zero-gravity AI interface designed for clarity.",
    motionEnable: "Enable animations",
    motionReduce: "Reduce animations",
    langToggle: "हिंदी",
    footer: "© 2026 Matdaan-Mitra. Built for the Future of Democracy.",
  },
  hi: {
    heroTag: "डेटा दिखाया जा रहा है:",
    heroTitle: "मतदान-मित्र",
    heroSub: "AI अनुभव",
    heroDesc: "यह प्रणाली पहली बार मतदान करने वालों की जटिल प्रक्रियाओं को इंटरैक्टिव, व्यक्तिगत मार्गदर्शन में बदलकर भ्रम को कम करती है।",
    resourcesHeading: "मतदाता संसाधन",
    cards: [
      { title: "मतदाता पात्रता", desc: "नागरिकता और निवास नियम जांचें।" },
      { title: "बूथ खोजें", desc: "अपना नजदीकी मतदान केंद्र आसानी से खोजें।" },
      { title: "जरूरी दस्तावेज", desc: "m-Aadhaar सहित स्वीकार्य पहचान पत्रों की पूरी सूची।" },
      { title: "अपने नेताओं को जानें", desc: "उम्मीदवारों की जानकारी और निर्वाचन क्षेत्र खोजें।" },
      { title: "आपातकालीन हेल्पलाइन", desc: "EC संपर्क, टोल-फ्री नंबर, और cVIGIL ऐप जानकारी।" },
    ],
    quizTitle: "क्या आप",
    quizHighlight: "मतदान के लिए तैयार हैं?",
    quizDesc: "हमारा इंटरैक्टिव रेडीनेस चेक आपकी मौजूदा स्थिति का विश्लेषण करता है।",
    stat1Label: "निर्देशित मतदाता",
    stat1Val: "12.5k",
    stat2Label: "स्पष्टता स्कोर",
    stat2Val: "98%",
    timelineTitle: "चुनाव जीवनचक्र",
    timelineDesc: "पंजीकरण से परिणाम तक, चित्रात्मक व्याख्या",
    enterBtn: "अनुभव शुरू करें",
    onboardTitle: "आपका वोट,",
    onboardSub: "बुद्धिमान।",
    onboardDesc: "चुनाव मार्गदर्शन के भविष्य में आपका स्वागत है।",
    motionEnable: "एनिमेशन चालू करें",
    motionReduce: "एनिमेशन कम करें",
    langToggle: "English",
    footer: "© 2026 मतदान-मित्र। लोकतंत्र के भविष्य के लिए बनाया गया।",
  },
} as const;

type Lang = keyof typeof CONTENT;
type ModalTab = "eligibility" | "booth" | "id" | "candidates" | "helpline" | null;

const CARD_ICONS = [Users, Search, ClipboardList, Users, Phone];
const CARD_COLORS = [
  { ring: "from-blue-500/30 to-blue-600/10", border: "border-blue-500/20", text: "text-blue-400", glow: "shadow-[0_0_30px_rgba(59,130,246,0.15)]" },
  { ring: "from-purple-500/30 to-purple-600/10", border: "border-purple-500/20", text: "text-purple-400", glow: "shadow-[0_0_30px_rgba(168,85,247,0.15)]" },
  { ring: "from-orange-500/30 to-orange-600/10", border: "border-orange-500/20", text: "text-orange-400", glow: "shadow-[0_0_30px_rgba(249,115,22,0.15)]" },
  { ring: "from-pink-500/30 to-pink-600/10", border: "border-pink-500/20", text: "text-pink-400", glow: "shadow-[0_0_30px_rgba(236,72,153,0.15)]" },
  { ring: "from-red-500/30 to-red-600/10", border: "border-red-500/20", text: "text-red-400", glow: "shadow-[0_0_30px_rgba(239,68,68,0.15)]" },
] as const;
const MODAL_TABS: ModalTab[] = ["eligibility", "booth", "id", "candidates", "helpline"];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [location] = useState("Mumbai, MH");
  const [activeModal, setActiveModal] = useState<ModalTab>(null);

  const t = CONTENT[lang];

  return (
    <div
      className={`min-h-screen bg-[#050505] text-white overflow-x-hidden relative ${reduceMotion ? "motion-reduce" : ""}`}
    >
      {!reduceMotion && <CursorTrail />}

      {/* Accessibility & Language Controls */}
      <nav
        className="fixed top-4 right-4 z-[100] flex gap-2"
        aria-label="Accessibility and language controls"
      >
        {/* Motion toggle */}
        <button
          id="motion-toggle"
          onClick={() => setReduceMotion(!reduceMotion)}
          className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all"
          aria-label={reduceMotion ? t.motionEnable : t.motionReduce}
          aria-pressed={reduceMotion}
        >
          {reduceMotion ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>

        {/* Language toggle — Feature #3 */}
        <button
          id="lang-toggle"
          onClick={() => setLang((l) => (l === "en" ? "hi" : "en"))}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white transition-all text-xs font-semibold"
          aria-label={`Switch language to ${lang === "en" ? "Hindi" : "English"}`}
        >
          <Globe size={14} aria-hidden="true" />
          {t.langToggle}
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
              <div
                className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center rotate-12 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                aria-hidden="true"
              >
                <Vote size={40} className="text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight">
                  {t.onboardTitle} <br /> {t.onboardSub}
                </h1>
                <p className="text-white/60">{t.onboardDesc}</p>
              </div>
              <button
                id="enter-experience-btn"
                onClick={() => setShowOnboarding(false)}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-black"
                autoFocus
              >
                {t.enterBtn}
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

      {/* Hero Section — NOTE: h1 is in the onboarding dialog above; h2 is correct semantic level here */}
      <section
        className="relative z-10 pt-32 pb-10 px-6 max-w-7xl mx-auto text-center"
        aria-labelledby="hero-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-sm mb-8 backdrop-blur-md"
        >
          <MapPin size={14} aria-hidden="true" />
          <span>
            {t.heroTag} <span className="font-bold">{location}</span>
          </span>
        </motion.div>
        {/* 
          Semantic note: the page's primary h1 lives inside the onboarding dialog.
          Once dismissed, this h2 becomes the top visible heading — correct per ARIA landmark structure.
        */}
        <h2
          id="hero-heading"
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-2xl"
        >
          {t.heroTitle} <br />
          <span className="text-white/90">{t.heroSub}</span>
        </h2>
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12">
          {t.heroDesc}
        </p>

        {/* Election Countdown — Feature #1 */}
        <ElectionCountdown />
      </section>

      {/* Floating Info Cards */}
      <section className="relative z-10 pb-20 px-6" aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="sr-only">
          {t.resourcesHeading}
        </h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {t.cards.map((card, idx) => {
            const Icon = CARD_ICONS[idx];
            const color = CARD_COLORS[idx];
            return (
              <FloatingCard
                key={card.title}
                delay={(idx + 1) * 0.1}
                onClick={() => setActiveModal(MODAL_TABS[idx])}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color.ring} border ${color.border} flex items-center justify-center ${color.text} mb-6 ${color.glow}`}
                  aria-hidden="true"
                >
                  <Icon size={28} />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white/90">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
              </FloatingCard>
            );
          })}
        </div>
      </section>

      {/* Vote Pledge — Feature #2 */}
      <section className="relative z-10 px-6" aria-label="Vote Pledge">
        <div className="max-w-7xl mx-auto">
          <VotePledge />
        </div>
      </section>

      {/* Analytics Dashboard */}
      <section className="relative z-10 px-6" aria-label="Analytics">
        <AnalyticsDashboard />
      </section>

      {/* Interactive Timeline */}
      <section
        className="relative z-10 py-20 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]"
        aria-labelledby="timeline-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="timeline-heading" className="text-4xl font-bold mb-4">
              {t.timelineTitle}
            </h2>
            <p className="text-white/40">{t.timelineDesc}</p>
          </div>
          <InteractiveTimeline />
        </div>
      </section>

      {/* Readiness Quiz */}
      <section
        className="relative z-10 py-24 px-6 bg-black border-t border-white/5"
        aria-labelledby="quiz-heading"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <h2
              id="quiz-heading"
              className="text-5xl md:text-6xl font-black tracking-tight leading-none"
            >
              {t.quizTitle} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                {t.quizHighlight}
              </span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">{t.quizDesc}</p>
            <div className="flex gap-4" role="group" aria-label="Platform statistics">
              <div className="flex-1 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div
                  className="text-3xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                  aria-label={`${t.stat1Val} voters guided`}
                >
                  {t.stat1Val}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-2 font-semibold">
                  {t.stat1Label}
                </div>
              </div>
              <div className="flex-1 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div
                  className="text-3xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
                  aria-label={`${t.stat2Val} clarity score`}
                >
                  {t.stat2Val}
                </div>
                <div className="text-xs text-white/40 uppercase tracking-widest mt-2 font-semibold">
                  {t.stat2Label}
                </div>
              </div>
            </div>
          </div>
          <ReadinessQuiz />
        </div>
      </section>

      <AdvancedModal activeTab={activeModal} onClose={() => setActiveModal(null)} />

      <FloatingOrb />

      {/* Footer */}
      <footer
        className="relative z-10 py-12 px-6 border-t border-white/10 text-center text-white/40 text-sm"
        role="contentinfo"
      >
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
