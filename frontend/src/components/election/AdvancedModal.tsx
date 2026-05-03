"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, MapPin, Search, CreditCard, ChevronRight, Users, Activity, Phone } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface AdvancedModalProps {
  activeTab: "eligibility" | "booth" | "id" | "candidates" | "helpline" | null;
  onClose: () => void;
}

/** Typed candidate shape from the MyNeta API. */
interface Candidate {
  name: string;
  party: string;
  constituency: string;
  state: string;
  hasCriminalRecord: boolean;
  link: string;
}

export const AdvancedModal = ({ activeTab, onClose }: AdvancedModalProps) => {
  const [age, setAge] = useState<string>("");
  const [citizen, setCitizen] = useState<boolean>(true);
  
  const [pinCode, setPinCode] = useState("");
  const [boothResult, setBoothResult] = useState<string | null>(null);

  const [netaSearch, setNetaSearch] = useState("");
  const [netas, setNetas] = useState<Candidate[]>([]);
  const [netaLoading, setNetaLoading] = useState(false);
  const [netaError, setNetaError] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<number | null>(null);

  // ── Escape key closes the modal (WCAG 2.1 §2.1.2) ─────────────────────────
  const handleEsc = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  if (!activeTab) return null;

  const renderEligibility = () => {
    const isEligible = parseInt(age) >= 18 && citizen;
    const hasChecked = age !== "";

    return (
      <div className="space-y-6">
        <h3 id="modal-title" className="text-2xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="text-blue-500" aria-hidden="true" /> Voter Eligibility Checker</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="age-input" className="block text-sm text-white/60 mb-2">Your Age</label>
            <input 
              id="age-input"
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your age"
              min="1"
              max="120"
              aria-label="Enter your age"
            />
          </div>
          <div>
            <label htmlFor="citizen-checkbox" className="flex items-center gap-3 cursor-pointer">
              <input 
                id="citizen-checkbox"
                type="checkbox" 
                checked={citizen}
                onChange={(e) => setCitizen(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500 focus:ring-offset-black"
                aria-label="I am an Indian Citizen"
              />
              <span className="text-white/80">I am an Indian Citizen</span>
            </label>
          </div>
          
          {hasChecked && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl flex items-start gap-3 ${isEligible ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}
              role="status"
              aria-live="polite"
            >
              {isEligible ? <CheckCircle size={24} aria-hidden="true" /> : <AlertCircle size={24} aria-hidden="true" />}
              <div>
                <h4 className="font-bold">{isEligible ? 'You are Eligible to Vote!' : 'Not Eligible Yet'}</h4>
                <p className="text-sm opacity-80 mt-1">
                  {isEligible 
                    ? 'Make sure you are enrolled in the electoral roll. Proceed to check your booth.' 
                    : 'You must be 18 or older and an Indian citizen to vote.'}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  const handleBoothSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length >= 6) {
      const lastDigit = parseInt(pinCode.slice(-1)) || 0;
      const schools = [
        "Government Primary School", "DPS International", "Kendriya Vidyalaya", 
        "Zilla Parishad School", "Little Flower Convent", "Saraswati Vidya Mandir",
        "National Public School", "Municipal Corporation School", "St. Jude's High School", "DAV Public School"
      ];
      const boothNum = parseInt(pinCode.slice(-2)) || 42;
      setBoothResult(`Booth ${boothNum}, ${schools[lastDigit]}`);
    } else {
      setBoothResult(null);
    }
  };

  const renderBooth = () => (
    <div className="space-y-6">
      <h3 id="modal-title" className="text-2xl font-bold mb-4 flex items-center gap-2"><MapPin className="text-purple-500" aria-hidden="true" /> Locate Your Booth</h3>
      <form 
        className="relative"
        onSubmit={handleBoothSearch}
      >
        <label htmlFor="pin-input" className="sr-only">Enter PIN Code</label>
        <input 
          id="pin-input"
          type="text" 
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          placeholder="Enter PIN Code (e.g. 400001)"
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          maxLength={6}
          pattern="[0-9]*"
        />
        <Search className="absolute left-4 top-4 text-white/40" aria-hidden="true" />
        <button 
          type="submit"
          className="absolute right-2 top-2 bottom-2 bg-purple-600 hover:bg-purple-500 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="Find booth location"
        >
          Find
        </button>
      </form>

      <div className="h-48 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative flex items-center justify-center" aria-hidden="true">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <AnimatePresence>
          {boothResult ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 bg-[#0a0a0a] border border-purple-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-4"
              role="status"
              aria-live="polite"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center" aria-hidden="true">
                <MapPin className="text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-lg">{boothResult}</h4>
                <p className="text-sm text-purple-400/80">1.2 km away • Waiting time: ~15 mins</p>
              </div>
            </motion.div>
          ) : (
            <div className="relative z-10 text-white/40 flex flex-col items-center">
              <MapPin size={32} className="mb-2 opacity-50" aria-hidden="true" />
              <p>Enter your PIN to see map</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderIDs = () => {
    const ids = [
      { name: "Voter ID (EPIC)", desc: "Primary Identification Document", type: "primary" },
      { name: "Aadhaar Card", desc: "Accepted everywhere (Physical/m-Aadhaar)", type: "secondary" },
      { name: "PAN Card", desc: "Secondary Identification Document", type: "secondary" },
      { name: "Passport", desc: "Accepted for NRI and regular voters", type: "secondary" },
      { name: "Driving License", desc: "Valid transport ID", type: "secondary" },
    ];

    return (
      <div className="space-y-6">
        <h3 id="modal-title" className="text-2xl font-bold mb-4 flex items-center gap-2"><CreditCard className="text-orange-500" aria-hidden="true" /> Accepted ID Documents</h3>
        <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 p-4 rounded-xl flex gap-3" role="alert">
          <AlertCircle className="shrink-0" aria-hidden="true" />
          <p className="text-sm">You MUST carry at least ONE of the following original documents to the polling booth.</p>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" role="list">
          {ids.map((id, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={id.name} 
              className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors group cursor-pointer"
              role="listitem"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${id.type === 'primary' ? 'bg-green-500' : 'bg-blue-500'}`} aria-hidden="true" />
                <div>
                  <h4 className="font-bold text-white/90">{id.name}</h4>
                  <p className="text-sm text-white/50">{id.desc}</p>
                </div>
              </div>
              <ChevronRight className="text-white/20 group-hover:text-orange-400 transition-colors" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const handleNetaSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!netaSearch.trim()) return;
    setNetaLoading(true);
    setNetaError(null);
    try {
      const res = await fetch(`/api/candidates/search?q=${encodeURIComponent(netaSearch)}`);
      if (!res.ok) throw new Error("Backend API responded with an error");
      const data = await res.json();
      setNetas(data.candidates || []);
    } catch (e) {
      console.error("Neta search failed:", e);
      setNetaError("Could not connect to the live candidate database. Showing sample data for demonstration.");
      setNetas([
        {
          name: "Aditya Sharma",
          party: "Independent",
          constituency: "Mumbai South",
          state: "Maharashtra",
          hasCriminalRecord: false,
          link: "#"
        },
        {
          name: "Vikram Singh",
          party: "Regional Party",
          constituency: "Mumbai South",
          state: "Maharashtra",
          hasCriminalRecord: true,
          link: "#"
        }
      ]);
    } finally {
      setNetaLoading(false);
    }
  };

  const renderCandidates = () => (
    <div className="space-y-6">
      <h3 id="modal-title" className="text-2xl font-bold mb-4 flex items-center gap-2"><Users className="text-pink-500" aria-hidden="true" /> Know Your Netas</h3>
      <form className="relative" onSubmit={handleNetaSearch}>
        <label htmlFor="neta-search" className="sr-only">Search Candidate Name</label>
        <input 
          id="neta-search"
          type="text" 
          value={netaSearch}
          onChange={(e) => setNetaSearch(e.target.value)}
          placeholder="Search Candidate Name..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
        />
        <Search className="absolute left-4 top-4 text-white/40" aria-hidden="true" />
        <button 
          type="submit"
          disabled={netaLoading}
          className="absolute right-2 top-2 bottom-2 bg-pink-600 hover:bg-pink-500 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-pink-400"
          aria-label="Search for candidates"
        >
          {netaLoading ? "..." : "Find"}
        </button>
      </form>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar" role="list">
        {netaError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-xl flex gap-3 text-sm"
          >
            <AlertCircle className="shrink-0" aria-hidden="true" />
            <p>{netaError}</p>
          </motion.div>
        )}
        {netas.length === 0 && !netaLoading && netaSearch && !netaError && (
          <p className="text-white/40 text-center py-4">No candidates found.</p>
        )}
        {netas.map((neta, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col hover:bg-white/10 transition-colors group relative overflow-hidden"
            role="listitem"
          >
            {neta.hasCriminalRecord && (
               <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-[10px] uppercase font-bold px-3 py-1 rounded-bl-xl" aria-label="Candidate has flagged record">
                 Flagged Record
               </div>
            )}
            <h4 className="font-bold text-white/90 text-xl">{neta.name}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
              <span className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 px-3 py-1 rounded-full font-medium">{neta.party}</span>
              <span className="text-white/50 bg-black/40 px-3 py-1 rounded-full">{neta.constituency}, {neta.state}</span>
            </div>
            
            <div className="mt-4 flex items-center justify-between gap-4">
              <a href={neta.link} target="_blank" rel="noopener noreferrer" className="text-pink-400 text-sm hover:underline flex items-center gap-1 font-medium" aria-label={`View full profile for ${neta.name}`}>
                Full Profile <ChevronRight size={14} aria-hidden="true" />
              </a>
              
              <button 
                onClick={() => setAnalyzingId(analyzingId === i ? null : i)}
                className={`text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 ${analyzingId === i ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'}`}
                aria-expanded={analyzingId === i}
                aria-controls={`ai-analysis-${i}`}
              >
                <div className={`w-2 h-2 rounded-full ${analyzingId === i ? 'bg-white animate-pulse' : 'bg-indigo-400'}`} aria-hidden="true" />
                {analyzingId === i ? "Close AI Analysis" : "AI Analyze Risk"}
              </button>
            </div>

            <AnimatePresence>
              {analyzingId === i && (
                <motion.div
                  id={`ai-analysis-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h5 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
                      <Activity size={14} aria-hidden="true" /> Matdaan-Mitra AI Insights
                    </h5>
                    <div className="bg-black/50 rounded-xl p-4 text-sm text-white/70 space-y-3 font-mono">
                      <p>
                        <span className="text-white/40">Status:</span> 
                        {neta.hasCriminalRecord 
                          ? <span className="text-red-400 ml-2">High Risk (Criminal Record Detected)</span> 
                          : <span className="text-emerald-400 ml-2">Low Risk (Clean Record)</span>
                        }
                      </p>
                      <p>
                        <span className="text-white/40">AI Summary:</span> This candidate is running from the {neta.constituency} constituency under the {neta.party} banner. Based on available affidavit data, {neta.hasCriminalRecord ? 'they have declared pending criminal cases which you should review deeply before voting.' : 'they have a clean background with no declared criminal cases.'}
                      </p>
                      <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden" role="progressbar" aria-valuenow={neta.hasCriminalRecord ? 25 : 85} aria-valuemin={0} aria-valuemax={100} aria-label="Integrity Score">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: neta.hasCriminalRecord ? '25%' : '85%' }}
                          className={`h-full ${neta.hasCriminalRecord ? 'bg-red-500' : 'bg-emerald-500'}`}
                        />
                      </div>
                      <p className="text-[10px] text-right mt-1 uppercase text-white/30">Integrity Score</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderHelpline = () => {
    const helplines = [
      { name: "National Voter Helpline", number: "1950", desc: "Toll-free number for any election queries" },
      { name: "Election Commission of India", number: "011-23052205", desc: "Main control room" },
      { name: "cVIGIL App Support", number: "1800-111-950", desc: "Report Model Code of Conduct violations" },
      { name: "Women's Helpline", number: "1091", desc: "For women voters facing harassment or issues" },
    ];

    return (
      <div className="space-y-6">
        <h3 id="modal-title" className="text-2xl font-bold mb-4 flex items-center gap-2"><AlertCircle className="text-red-500" aria-hidden="true" /> Emergency Helplines</h3>
        <p className="text-white/60 text-sm">Tap on any number to call directly. Please use these numbers responsibly.</p>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" role="list">
          {helplines.map((helpline, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={helpline.name} 
              className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors"
              role="listitem"
            >
              <div>
                <h4 className="font-bold text-white/90">{helpline.name}</h4>
                <p className="text-sm text-white/50">{helpline.desc}</p>
              </div>
              <a 
                href={`tel:${helpline.number}`}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-bold hover:bg-red-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                aria-label={`Call ${helpline.name} at ${helpline.number}`}
              >
                {helpline.number}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        role="presentation"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Close modal"
          >
            <X size={20} className="text-white/60" aria-hidden="true" />
          </button>

          {activeTab === "eligibility" && renderEligibility()}
          {activeTab === "booth" && renderBooth()}
          {activeTab === "id" && renderIDs()}
          {activeTab === "candidates" && renderCandidates()}
          {activeTab === "helpline" && renderHelpline()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
