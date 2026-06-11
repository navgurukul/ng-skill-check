import { Download, RefreshCw, ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, Target } from 'lucide-react';

function toTitleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function cleanDisplayName(value) {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\b(resume|cv|prework|pre work|project|report|final|candidate|document|portfolio)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferSubjectName(type, uploadData) {
  if (type === 'repo') {
    const repoUrl = uploadData?.repoUrl || '';

    try {
      const parsedUrl = new URL(repoUrl);
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      const repoName = pathParts[pathParts.length - 1] || '';
      const cleanedRepoName = cleanDisplayName(decodeURIComponent(repoName));

      return cleanedRepoName ? toTitleCase(cleanedRepoName) : 'Repository';
    } catch {
      const fallbackParts = repoUrl.split('/').filter(Boolean);
      const repoName = fallbackParts[fallbackParts.length - 1] || '';
      const cleanedRepoName = cleanDisplayName(decodeURIComponent(repoName));
      return cleanedRepoName ? toTitleCase(cleanedRepoName) : 'Repository';
    }
  }

  const fileName = uploadData?.file?.name || '';
  const cleanedFileName = cleanDisplayName(fileName);
  return cleanedFileName ? toTitleCase(cleanedFileName) : 'Candidate';
}

function buildReportTitle(type, uploadData) {
  const typeLabelMap = { resume: 'Resume', prework: 'Pre-Work', repo: 'Repository' };
  const typeLabel = typeLabelMap[type] || 'Report';
  const subjectName = inferSubjectName(type, uploadData);

  if (type === 'repo') {
    return `${subjectName} Repository Report`;
  }

  return subjectName === 'Candidate'
    ? `Your ${typeLabel} Report`
    : `${subjectName}'s ${typeLabel} Report`;
}

function formatTrackLabel(track) {
  if (!track) {
    return 'Unknown Track';
  }

  return `${toTitleCase(track)} Engineer`;
}

export default function Dashboard({ data, onReset, onTryAgain, type, uploadData, track }) {
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
    tech_stack: [],
    hiring_recommendation: '',
    feedback: ""
  };

  const score = evaluation.overall_score || evaluation.score || 0;
  const hasDetailedAssessment = !!evaluation.skill_assessment;
  const reportTitle = buildReportTitle(type, uploadData);
  const trackLabel = formatTrackLabel(track);
  const techStack = Array.isArray(evaluation.tech_stack) ? evaluation.tech_stack : [];
  // const hiringRecommendation = evaluation.hiring_recommendation;
  const getCustomRecommendation = (score) => {
  const numericScore = Number(score);
  if (numericScore < 60) return "Low";
  if (numericScore >= 60 && numericScore <= 80) return "Medium";
  return "High";
};

const hiringRecommendation = getCustomRecommendation(score);

  // FUNCTIONALITY 1: High-Fidelity Clean Document Printing System
  const handleDownloadReport = () => {
    const originalTitle = document.title;
    document.title = `SkillCheck_${trackLabel.replace(/\s+/g, '_')}_${reportTitle.replace(/\s+/g, '_')}_${score}_Score`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="w-full text-left space-y-8 animate-fade-in print:p-8 print:bg-white print:text-black">
      
      {/* Top action layout blocks - hidden completely during document export generation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] print:border-black/10 pb-6 print:mb-6">
          <div>
          <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-indigo-400 font-semibold tracking-wide print:hidden">Evaluation complete</span>
            <h1 className="text-4xl font-black text-white print:text-black tracking-tight mt-2">{reportTitle}</h1>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-slate-300 print:border-black/10 print:bg-slate-100 print:text-slate-700">
              <span className="text-slate-500 uppercase">Track</span>
              <span className="text-white print:text-black">{trackLabel}</span>
            </div>
        </div>
        <div className="flex gap-3 print:hidden">
          {/* Linked explicit controller execution calls */}
          <button 
            onClick={handleDownloadReport} 
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
          >
            <Download className="w-4 h-4" /> Download Report
          </button>
          <button 
            onClick={onTryAgain} 
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
          <button 
            onClick={onReset} 
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-colors cursor-pointer text-white"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid lg:grid-cols-3 gap-6 items-start print:grid-cols-3">
        <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm flex flex-col items-center justify-center text-center relative min-h-[320px] print:bg-slate-50">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase absolute top-6 left-6">Overall Score</h3>
          <div className="relative w-40 h-40 flex items-center justify-center mt-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
              <circle cx="50" cy="50" r="42" stroke="#a855f7" strokeWidth="6" fill="transparent"
                strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)} strokeLinecap="round" />
            </svg>
            <div className="absolute">
              <span className="text-5xl font-black text-white print:text-black block">{score}</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">of 100</span>
            </div>
          </div>
          <div className="mt-6 flex gap-6 text-xs text-left w-full border-t border-white/[0.04] print:border-black/5 pt-4 px-2">
            <div><span className="text-slate-500 block">Relevance</span><span className="text-white print:text-black font-bold">{evaluation.relevance || 0}%</span></div>
            <div><span className="text-slate-500 block">Confidence</span><span className="text-purple-400 font-bold">{evaluation.confidence || 0}%</span></div>
          </div>
        </div>

        {/* Skill Matrix Framework Breakdown */}
        {hasDetailedAssessment && Object.keys(evaluation.skill_assessment).length > 0 && (
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-4 h-full print:col-span-2 print:grid-cols-2">
            {Object.entries(evaluation.skill_assessment).map(([skill, data], index) => (
              <div key={index} className="p-4 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm print:bg-slate-50 page-break-inside-avoid">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold tracking-wider text-slate-400 print:text-slate-700 uppercase">{skill.replace(/_/g, ' ')}</span>
                  <span className="text-lg font-black text-indigo-400 print:text-indigo-600">{data.score || 0}</span>
                </div>
                <p className="text-xs text-slate-500 print:text-slate-600 leading-relaxed">{data.evidence || 'No evidence verified'}</p>
                <div className="w-full bg-white/5 print:bg-slate-200 h-1 rounded-full mt-3">
                  <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${data.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Parameters Indicators Section */}
      <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
        <div className="p-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 print:border-emerald-600/20 space-y-4 print:bg-emerald-50/30 page-break-inside-avoid">
          <h3 className="text-sm font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h3>
          <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
            {(evaluation.strengths || []).map((str, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">·</span><span>{str}</span></li>)}
          </ul>
        </div>
        
        <div className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/10 print:border-red-600/20 space-y-4 print:bg-red-50/30 page-break-inside-avoid">
          <h3 className="text-sm font-bold text-red-400 print:text-red-700 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Critical Gaps</h3>
          <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
            {(evaluation.critical_gaps || evaluation.weaknesses || []).map((gap, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">⚠</span><span>{gap}</span></li>)}
          </ul>
        </div>
      </div>

      {(techStack.length > 0 || hiringRecommendation) && (
        <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
          {techStack.length > 0 && (
            <div className="p-6 rounded-2xl bg-violet-500/[0.02] border border-violet-500/10 print:border-violet-600/20 space-y-4 print:bg-violet-50/30 page-break-inside-avoid">
              <h3 className="text-sm font-bold text-violet-400 print:text-violet-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 print:bg-white print:border-black/10 print:text-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {hiringRecommendation && (
            <div className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 print:border-amber-600/20 space-y-4 print:bg-amber-50/30 page-break-inside-avoid">
              <h3 className="text-sm font-bold text-amber-400 print:text-amber-700 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Hiring Recommendation</h3>
              <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">{hiringRecommendation}</p>
            </div>
          )}
        </div>
      )}

      {/* Hiring Strategy Execution Steps */}
      {evaluation.next_steps_to_hire && evaluation.next_steps_to_hire.length > 0 && (
        <div className="p-6 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10 print:border-blue-600/20 space-y-4 print:bg-blue-50/30 page-break-inside-avoid">
          <h3 className="text-sm font-bold text-blue-400 print:text-blue-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Next Steps for Hiring</h3>
          <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
            {evaluation.next_steps_to_hire.map((step, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span><span>{step}</span></li>)}
          </ul>
        </div>
      )}

      {/* Text Output Block */}
      <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm space-y-2 print:bg-slate-50 page-break-inside-avoid">
        <h3 className="text-xs font-bold text-indigo-400 print:text-indigo-600 tracking-wider uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Detailed Feedback</h3>
        <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed whitespace-pre-wrap">{evaluation.feedback}</p>
      </div>
    </div>
  );
}