import React from 'react';
import { Download, RefreshCw, ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, Target } from 'lucide-react';

export default function Dashboard({ data, onReset }) {
  const evaluation = data || {
    overall_score: 0,
    score: 0,
    relevance: 0, 
    confidence: 0,
    technical_understanding: 0, 
    problem_solving: 0, 
    project_quality: 0, 
    career_readiness: 0,
    strengths: [], 
    weaknesses: [], 
    critical_gaps: [],
    next_steps_to_hire: [],
    skill_assessment: {},
    navguruful_fit: {},
    feedback: ""
  };

  // Get score - handle both old and new format
  const score = evaluation.overall_score || evaluation.score || 0;
  const hasDetailedAssessment = !!evaluation.skill_assessment;

  return (
    <div className="w-full text-left space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-indigo-400 font-semibold tracking-wide">Evaluation complete</span>
          <h1 className="text-4xl font-black text-white tracking-tight mt-2">Your <span className="text-indigo-400">SkillCheck</span> report</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer"><Download className="w-4 h-4" /> Download Report</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer"><RefreshCw className="w-4 h-4" /> Try Again</button>
          <button onClick={onReset} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" /> Back</button>
        </div>
      </div>

      {/* Overall Score Card */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm flex flex-col items-center justify-center text-center relative min-h-[320px]">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase absolute top-6 left-6">Overall Score</h3>
          <div className="relative w-40 h-40 flex items-center justify-center mt-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
              <circle cx="50" cy="50" r="42" stroke="#a855f7" strokeWidth="6" fill="transparent"
                strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)} strokeLinecap="round" />
            </svg>
            <div className="absolute">
              <span className="text-5xl font-black text-white block">{score}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">of 100</span>
            </div>
          </div>
          <div className="mt-6 flex gap-6 text-xs text-left w-full border-t border-white/[0.04] pt-4 px-2">
            <div><span className="text-slate-500 block">Relevance</span><span className="text-white font-bold">{evaluation.relevance || 0}%</span></div>
            <div><span className="text-slate-500 block">Confidence</span><span className="text-purple-400 font-bold">{evaluation.confidence || 0}%</span></div>
          </div>
        </div>

        {/* Skill Assessment Grid (if available) */}
        {hasDetailedAssessment && Object.keys(evaluation.skill_assessment).length > 0 && (
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-4 h-full">
            {Object.entries(evaluation.skill_assessment).map(([skill, data], index) => (
              <div key={index} className="p-4 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{skill.replace(/_/g, ' ')}</span>
                  <span className="text-lg font-black text-indigo-400">{data.score || 0}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{data.evidence || 'No evidence'}</p>
                <div className="w-full bg-white/5 h-1 rounded-full mt-3">
                  <div className="bg-indigo-500 h-1 rounded-full transition-all duration-500" style={{ width: `${data.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback: Old Format Metrics */}
        {!hasDetailedAssessment && (
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-4 h-full">
            {[
              { label: "Technical Understanding", val: evaluation.technical_understanding, color: "bg-purple-500" },
              { label: "Problem Solving", val: evaluation.problem_solving, color: "bg-indigo-500" },
              { label: "Project Quality", val: evaluation.project_quality, color: "bg-blue-500" },
              { label: "Career Readiness", val: evaluation.career_readiness, color: "bg-pink-500" }
            ].map((bar, index) => (
              <div key={index} className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm flex flex-col justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase block">{bar.label}</span>
                <div className="mt-4">
                  <span className="text-3xl font-black text-white">{bar.val}<span className="text-xs text-slate-600 font-medium">/100</span></span>
                  <div className="w-full bg-white/5 h-1.5 rounded-full mt-2"><div className={`${bar.color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${bar.val}%` }}></div></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strengths & Gaps */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {(evaluation.strengths || []).map((str, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">·</span><span>{str}</span></li>)}
          </ul>
        </div>
        
        <div className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/10 space-y-4">
          <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Critical Gaps</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {(evaluation.critical_gaps || evaluation.weaknesses || []).map((gap, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">⚠</span><span>{gap}</span></li>)}
          </ul>
        </div>
      </div>

      {/* Next Steps to Hire (if available) */}
      {evaluation.next_steps_to_hire && evaluation.next_steps_to_hire.length > 0 && (
        <div className="p-6 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10 space-y-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Next Steps for Hiring</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {evaluation.next_steps_to_hire.map((step, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span><span>{step}</span></li>)}
          </ul>
        </div>
      )}

      {/* Detailed Feedback */}
      <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm space-y-2">
        <h3 className="text-xs font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Detailed Feedback</h3>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{evaluation.feedback}</p>
      </div>
    </div>
  );
}