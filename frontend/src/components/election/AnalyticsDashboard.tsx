import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Activity, BarChart3 } from "lucide-react";

export function AnalyticsDashboard() {
  return (
    <section className="w-full max-w-7xl mx-auto mt-20 mb-20" aria-label="Live Democracy Analytics">
      <header className="text-center mb-12">
        <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
          Live Democracy Analytics
        </h2>
        <p className="text-white/60">Real-time insights into voting trends and demographics</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget 1: Turnout Trend */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden"
          aria-label="National Turnout Trend Chart"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" aria-hidden="true" />
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={20} aria-hidden="true" />
                National Turnout Trend
              </h3>
              <p className="text-white/50 text-sm mt-1">Projected vs Historical data</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-emerald-400" aria-label="Current projection 67.4 percent">67.4%</div>
              <div className="text-xs text-emerald-400/80 font-medium">+2.1% from 2019</div>
            </div>
          </div>

          <div className="h-48 w-full relative z-10 flex items-end justify-between gap-2 px-2" role="group" aria-label="Bar chart showing turnout percentage over years">
            {[45, 52, 58, 62, 60, 67, 72].map((height, i) => (
              <div key={i} className="w-full relative flex flex-col justify-end items-center group">
                <motion.div 
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="w-full bg-gradient-to-t from-emerald-500/20 to-emerald-400/80 rounded-t-sm relative focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  tabIndex={0}
                  aria-label={`Year ${2014 + i}, turnout ${height} percent`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity text-xs font-bold bg-white/10 px-2 py-1 rounded backdrop-blur-md" aria-hidden="true">
                    {height}%
                  </div>
                </motion.div>
                <div className="text-[10px] text-white/50 mt-2 font-mono font-medium" aria-hidden="true">
                  {2014 + i}
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        {/* Widget 2: Demographics */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col"
          aria-label="Voter Demographics"
        >
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Users className="text-cyan-400" size={20} aria-hidden="true" />
              Demographics
            </h3>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative">
            {/* Simple CSS Ring Chart */}
            <div className="w-40 h-40 rounded-full border-[16px] border-white/5 relative flex items-center justify-center" aria-label="Total eligible voters 945 million, 22% youth, 78% general" role="img">
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-cyan-400/80 border-r-transparent border-b-transparent rotate-45" />
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-emerald-400/80 border-l-transparent border-t-transparent rotate-12" />
              
              <div className="text-center" aria-hidden="true">
                <div className="text-2xl font-black">945M</div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Eligible Voters</div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3" aria-hidden="true">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400/80" />
                <span className="text-white/80">Youth (18-25)</span>
              </div>
              <span className="font-bold text-white/90">22%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="text-white/80">General</span>
              </div>
              <span className="font-bold text-white/90">78%</span>
            </div>
          </div>
        </motion.article>

        {/* Widget 3: Live Pulse */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-3 bg-gradient-to-r from-emerald-900/40 via-teal-900/20 to-transparent border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6"
          aria-label="Matdaan-Mitra Engine Status"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center relative" aria-hidden="true">
              <Activity className="text-emerald-400 z-10" size={24} />
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Matdaan-Mitra AI Engine</h3>
              <p className="text-white/60 text-sm">Real-time candidate indexing active</p>
            </div>
          </div>
          
          <div className="flex gap-8">
            <div className="text-center md:text-right" aria-label="24.5 thousand candidates indexed">
              <div className="text-2xl font-black text-white/90" aria-hidden="true">24.5K</div>
              <div className="text-xs text-white/50 uppercase tracking-wider font-medium" aria-hidden="true">Candidates Indexed</div>
            </div>
            <div className="text-center md:text-right" aria-label="99.9 percent data accuracy">
              <div className="text-2xl font-black text-emerald-400" aria-hidden="true">99.9%</div>
              <div className="text-xs text-white/50 uppercase tracking-wider font-medium" aria-hidden="true">Data Accuracy</div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
