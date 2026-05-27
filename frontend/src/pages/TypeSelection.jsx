import React from 'react';
import { FileText, Award, ArrowLeft } from 'lucide-react';

export default function TypeSelection({ onNext, onBack, selectedTrack }) {
  const options = [
    { id: 'resume', title: 'Resume Evaluation', subtitle: 'FOR JOB-READINESS REVIEW', desc: 'Upload your latest resume. We score technical depth, project quality, and how aligned your profile is with the chosen role.', bullets: ['Skill match scoring', 'Experience signal check', 'ATS-style review'], icon: FileText, isSvg: false, color: 'hover:border-blue-500/40 text-blue-400' },
    { id: 'prework', title: 'Pre-Work Evaluation', subtitle: 'FOR PROGRAM SUBMISSION', desc: 'Upload your NavGurukul pre-work PDF. We evaluate conceptual clarity, code quality and completeness against expectations.', bullets: ['Concept understanding', 'Submission quality', 'Improvement plan'], icon: Award, isSvg: false, color: 'hover:border-purple-500/40 text-purple-400' },
    { 
      id: 'repo', 
      title: 'Repository Evaluation', 
      subtitle: 'FOR LIVE CODEBASE INSPECTION', 
      desc: 'Provide a target repository pointer. Our systems inspect real code modularity, git commit hygiene, configuration management and testing blocks.', 
      bullets: ['Production standards mapping', 'Structural layout check', 'Implementation verification'], 
      icon: null, 
      isSvg: true, 
      color: 'hover:border-emerald-500/40 text-emerald-400' 
    }
  ];

  return (
    <div className="w-full text-center">
      <div className="text-left mb-6">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Track: <span className="text-white font-bold capitalize">{selectedTrack} Engineer</span></span>
        </button>
      </div>

      <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">
        What should we <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">evaluate?</span>
      </h1>
      <p className="text-slate-400 max-w-xl mx-auto mb-12 text-sm md:text-base">
        Choose the submission target archetype. We tailor the rubric evaluation matrices, constraints weights, and responses directly to it.
      </p>

      <div className="grid md:grid-cols-3 gap-6 text-left">
        {options.map((opt) => {
          const IconComponent = opt.icon;
          return (
            <div 
              key={opt.id}
              onClick={() => onNext(opt.id)}
              className={`group p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] ${opt.color} cursor-pointer transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm flex flex-col justify-between`}
            >
              <div>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl w-fit mb-6 group-hover:scale-105 transition-transform">
                  {opt.isSvg ? (
                    <svg className="w-6 h-6 text-emerald-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  ) : (
                    <IconComponent className="w-6 h-6" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-0.5">{opt.title}</h3>
                <p className="text-[10px] tracking-wider font-bold text-indigo-400 mb-4">{opt.subtitle}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{opt.desc}</p>
                
                <ul className="space-y-2 mb-6">
                  {opt.bullets.map((b, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                <span>Continue with this option</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}