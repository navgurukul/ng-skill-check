
import React from 'react';
import { Sun, HelpCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 px-8 py-5 md:py-6">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] text-base">
            NG
          </div>
          <div>
            <span className="text-lg font-extrabold text-white tracking-wide block">SkillCheck</span>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest block -mt-0.5">
              NavGurukul · AI Evaluation Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8 text-sm md:text-base text-slate-400">
          <button className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer font-medium">
            <HelpCircle className="w-5 h-5" />
            <span>How it works</span>
          </button>
          <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer">
            <Sun className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}