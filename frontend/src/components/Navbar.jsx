import React from 'react';

export default function Navbar({ currentStep, onLogoClick }) { // 🎯 Added onLogoClick prop
  const timelineSteps = [
    { id: 1, label: 'Track' },
    { id: 2, label: 'Type' },
    { id: 3, label: 'Upload' },
    { id: 4, label: 'Analyze' },
    { id: 5, label: 'Results' }
  ];

  return (
    <nav className="w-full border-b border-white/[0.06] bg-slate-950/90 backdrop-blur-xl sticky top-0 z-50 px-8 py-6 min-h-[90px] flex items-center transition-all">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">

        <div 
          onClick={onLogoClick} 
          className="flex items-center gap-4 shrink-0 cursor-pointer group select-none"
          title="Go to Home"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] text-base group-hover:scale-105 transition-transform">
            NG
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-wide block group-hover:text-indigo-400 transition-colors">
              SkillCheck
            </span>
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest block mt-0.5">
              NavGurukul · AI Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/80 border border-white/[0.06] px-5 py-2 rounded-xl text-xs md:text-sm backdrop-blur-md shadow-inner shadow-black/40">
          {timelineSteps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${currentStep === s.id ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 font-extrabold scale-105' : 'text-slate-500 font-medium'}`}>
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${currentStep >= s.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'bg-slate-800 text-slate-400'}`}>
                  {s.id}
                </span>
                <span className="tracking-wide">{s.label}</span>
              </div>
              {idx < timelineSteps.length - 1 && (
                <span className="text-slate-800 font-semibold text-sm mx-1">/</span>
              )}
            </React.Fragment>
          ))}
        </div>

      </div>
    </nav>
  );
}