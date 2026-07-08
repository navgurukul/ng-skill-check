// import { Download, RefreshCw, ArrowLeft, CheckCircle2, AlertTriangle, TrendingUp, Target } from 'lucide-react';

// function toTitleCase(value) {
//   return value
//     .split(/\s+/)
//     .filter(Boolean)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(' ');
// }

// function cleanDisplayName(value) {
//   return value
//     .replace(/\.[^.]+$/, '')
//     .replace(/[._-]+/g, ' ')
//     .replace(/\b(resume|cv|prework|pre work|project|report|final|candidate|document|portfolio)\b/gi, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();
// }

// function inferSubjectName(type, uploadData) {
//   if (type === 'repo') {
//     const repoUrl = uploadData?.repoUrl || '';

//     try {
//       const parsedUrl = new URL(repoUrl);
//       const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
//       const repoName = pathParts[pathParts.length - 1] || '';
//       const cleanedRepoName = cleanDisplayName(decodeURIComponent(repoName));

//       return cleanedRepoName ? toTitleCase(cleanedRepoName) : 'Repository';
//     } catch {
//       const fallbackParts = repoUrl.split('/').filter(Boolean);
//       const repoName = fallbackParts[fallbackParts.length - 1] || '';
//       const cleanedRepoName = cleanDisplayName(decodeURIComponent(repoName));
//       return cleanedRepoName ? toTitleCase(cleanedRepoName) : 'Repository';
//     }
//   }

//   const fileName = uploadData?.file?.name || '';
//   const cleanedFileName = cleanDisplayName(fileName);
//   return cleanedFileName ? toTitleCase(cleanedFileName) : 'Candidate';
// }

// function buildReportTitle(type, uploadData) {
//   const typeLabelMap = { resume: 'Resume', prework: 'Pre-Work', repo: 'Repository' };
//   const typeLabel = typeLabelMap[type] || 'Report';
//   const subjectName = inferSubjectName(type, uploadData);

//   if (type === 'repo') {
//     return `${subjectName} Repository Report`;
//   }

//   return subjectName === 'Candidate'
//     ? `Your ${typeLabel} Report`
//     : `${subjectName}'s ${typeLabel} Report`;
// }

// function formatTrackLabel(track) {
//   if (!track) {
//     return 'Unknown Track';
//   }

//   return `${toTitleCase(track)} Engineer`;
// }

// export default function Dashboard({ data, onReset, onTryAgain, type, uploadData, track }) {
//   const evaluation = data || {
//     overall_score: 0,
//     score: 0,
//     relevance: 0, 
//     confidence: 0,
//     technical_understanding: 0, 
//     problem_solving: 0, 
//     project_quality: 0, 
//     career_readiness: 0,
//     strengths: [], 
//     weaknesses: [], 
//     critical_gaps: [],
//     next_steps_to_hire: [],
//     skill_assessment: {},
//     navguruful_fit: {},
//     tech_stack: [],
//     hiring_recommendation: '',
//     feedback: ""
//   };

//   const score = evaluation.overall_score || evaluation.score || 0;
//   const hasDetailedAssessment = !!evaluation.skill_assessment;
//   const reportTitle = buildReportTitle(type, uploadData);
//   const trackLabel = formatTrackLabel(track);
//   const techStack = Array.isArray(evaluation.tech_stack) ? evaluation.tech_stack : [];
//   // const hiringRecommendation = evaluation.hiring_recommendation;
//   const getCustomRecommendation = (score) => {
//   const numericScore = Number(score);
//   if (numericScore < 60) return "Low";
//   if (numericScore >= 60 && numericScore <= 80) return "Medium";
//   return "High";
// };

// const hiringRecommendation = getCustomRecommendation(score);

//   // FUNCTIONALITY 1: High-Fidelity Clean Document Printing System
//   const handleDownloadReport = () => {
//     const originalTitle = document.title;
//     document.title = `SkillCheck_${trackLabel.replace(/\s+/g, '_')}_${reportTitle.replace(/\s+/g, '_')}_${score}_Score`;
//     window.print();
//     document.title = originalTitle;
//   };

//   return (
//     <div className="w-full text-left space-y-8 animate-fade-in print:p-8 print:bg-white print:text-black">
      
//       {/* Top action layout blocks - hidden completely during document export generation */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] print:border-black/10 pb-6 print:mb-6">
//           <div>
//           <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-indigo-400 font-semibold tracking-wide print:hidden">Evaluation complete</span>
//             <h1 className="text-4xl font-black text-white print:text-black tracking-tight mt-2">{reportTitle}</h1>
//             <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-slate-300 print:border-black/10 print:bg-slate-100 print:text-slate-700">
//               <span className="text-slate-500 uppercase">Track</span>
//               <span className="text-white print:text-black">{trackLabel}</span>
//             </div>
//         </div>
//         <div className="flex gap-3 print:hidden">
//           {/* Linked explicit controller execution calls */}
//           <button 
//             onClick={handleDownloadReport} 
//             className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
//           >
//             <Download className="w-4 h-4" /> Download Report
//           </button>
//           <button 
//             onClick={onTryAgain} 
//             className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
//           >
//             <RefreshCw className="w-4 h-4" /> Try Again
//           </button>
//           <button 
//             onClick={onReset} 
//             className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-colors cursor-pointer text-white"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back
//           </button>
//         </div>
//       </div>

//       {/* Metrics Section */}
//       <div className="grid lg:grid-cols-3 gap-6 items-start print:grid-cols-3">
//         <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm flex flex-col items-center justify-center text-center relative min-h-[320px] print:bg-slate-50">
//           <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase absolute top-6 left-6">Overall Score</h3>
//           <div className="relative w-40 h-40 flex items-center justify-center mt-6">
//             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
//               <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
//               <circle cx="50" cy="50" r="42" stroke="#a855f7" strokeWidth="6" fill="transparent"
//                 strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)} strokeLinecap="round" />
//             </svg>
//             <div className="absolute">
//               <span className="text-5xl font-black text-white print:text-black block">{score}</span>
//               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">of 100</span>
//             </div>
//           </div>
//           <div className="mt-6 flex gap-6 text-xs text-left w-full border-t border-white/[0.04] print:border-black/5 pt-4 px-2">
//             <div><span className="text-slate-500 block">Relevance</span><span className="text-white print:text-black font-bold">{evaluation.relevance || 0}%</span></div>
//             <div><span className="text-slate-500 block">Confidence</span><span className="text-purple-400 font-bold">{evaluation.confidence || 0}%</span></div>
//           </div>
//         </div>

//         {/* Skill Matrix Framework Breakdown */}
//         {hasDetailedAssessment && Object.keys(evaluation.skill_assessment).length > 0 && (
//           <div className="lg:col-span-2 grid md:grid-cols-2 gap-4 h-full print:col-span-2 print:grid-cols-2">
//             {Object.entries(evaluation.skill_assessment).map(([skill, data], index) => (
//               <div key={index} className="p-4 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm print:bg-slate-50 page-break-inside-avoid">
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-xs font-bold tracking-wider text-slate-400 print:text-slate-700 uppercase">{skill.replace(/_/g, ' ')}</span>
//                   <span className="text-lg font-black text-indigo-400 print:text-indigo-600">{data.score || 0}</span>
//                 </div>
//                 <p className="text-xs text-slate-500 print:text-slate-600 leading-relaxed">{data.evidence || 'No evidence verified'}</p>
//                 <div className="w-full bg-white/5 print:bg-slate-200 h-1 rounded-full mt-3">
//                   <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${data.score}%` }}></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Profile Parameters Indicators Section */}
//       <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
//         <div className="p-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 print:border-emerald-600/20 space-y-4 print:bg-emerald-50/30 page-break-inside-avoid">
//           <h3 className="text-sm font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h3>
//           <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//             {(evaluation.strengths || []).map((str, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">·</span><span>{str}</span></li>)}
//           </ul>
//         </div>
        
//         <div className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/10 print:border-red-600/20 space-y-4 print:bg-red-50/30 page-break-inside-avoid">
//           <h3 className="text-sm font-bold text-red-400 print:text-red-700 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Critical Gaps</h3>
//           <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//             {(evaluation.critical_gaps || evaluation.weaknesses || []).map((gap, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">⚠</span><span>{gap}</span></li>)}
//           </ul>
//         </div>
//       </div>

//       {(techStack.length > 0 || hiringRecommendation) && (
//         <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
//           {techStack.length > 0 && (
//             <div className="p-6 rounded-2xl bg-violet-500/[0.02] border border-violet-500/10 print:border-violet-600/20 space-y-4 print:bg-violet-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-violet-400 print:text-violet-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Tech Stack</h3>
//               <div className="flex flex-wrap gap-2">
//                 {techStack.map((tech, index) => (
//                   <span key={index} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 print:bg-white print:border-black/10 print:text-slate-800">
//                     {tech}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {hiringRecommendation && (
//             <div className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 print:border-amber-600/20 space-y-4 print:bg-amber-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-amber-400 print:text-amber-700 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Hiring Recommendation</h3>
//               <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">{hiringRecommendation}</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Hiring Strategy Execution Steps */}
//       {evaluation.next_steps_to_hire && evaluation.next_steps_to_hire.length > 0 && (
//         <div className="p-6 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10 print:border-blue-600/20 space-y-4 print:bg-blue-50/30 page-break-inside-avoid">
//           <h3 className="text-sm font-bold text-blue-400 print:text-blue-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Next Steps for Hiring</h3>
//           <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//             {evaluation.next_steps_to_hire.map((step, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span><span>{step}</span></li>)}
//           </ul>
//         </div>
//       )}

//       {/* Text Output Block */}
//       <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm space-y-2 print:bg-slate-50 page-break-inside-avoid">
//         <h3 className="text-xs font-bold text-indigo-400 print:text-indigo-600 tracking-wider uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Detailed Feedback</h3>
//         <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed whitespace-pre-wrap">{evaluation.feedback}</p>
//       </div>
//     </div>
//   );
// }





// import React, { useEffect, useState } from 'react';
// import { 
//   Download, RefreshCw, ArrowLeft, CheckCircle2, 
//   AlertTriangle, TrendingUp, Target, Mail, Loader, CheckCircle, XCircle 
// } from 'lucide-react';

// function toTitleCase(value) {
//   if (!value) return '';
//   return value
//     .split(/\s+/)
//     .filter(Boolean)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(' ');
// }

// function cleanDisplayName(value) {
//   return value
//     .replace(/\.[^.]+$/, '')
//     .replace(/[._-]+/g, ' ')
//     .replace(/\b(resume|cv|prework|pre work|project|report|final|candidate|document|portfolio)\b/gi, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();
// }

// function inferSubjectName(type, uploadData) {
//   if (type === 'repo') {
//     const repoUrl = uploadData?.repoUrl || '';
//     try {
//       const parsedUrl = new URL(repoUrl);
//       const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
//       const repoName = pathParts[pathParts.length - 1] || '';
//       const cleanedRepoName = cleanDisplayName(decodeURIComponent(repoName));
//       return cleanedRepoName ? toTitleCase(cleanedRepoName) : 'Repository';
//     } catch {
//       const fallbackParts = repoUrl.split('/').filter(Boolean);
//       const repoName = fallbackParts[fallbackParts.length - 1] || '';
//       const cleanedRepoName = cleanDisplayName(decodeURIComponent(repoName));
//       return cleanedRepoName ? toTitleCase(cleanedRepoName) : 'Repository';
//     }
//   }

//   const fileName = uploadData?.file?.name || '';
//   const cleanedFileName = cleanDisplayName(fileName);
//   return cleanedFileName ? toTitleCase(cleanedFileName) : 'Candidate';
// }

// function buildReportTitle(type, uploadData) {
//   const typeLabelMap = { resume: 'Resume', prework: 'Pre-Work', repo: 'Repository' };
//   const typeLabel = typeLabelMap[type] || 'Report';
//   const subjectName = inferSubjectName(type, uploadData);

//   if (type === 'repo') {
//     return `${subjectName} Repository Report`;
//   }

//   return subjectName === 'Candidate'
//     ? `Your ${typeLabel} Report`
//     : `${subjectName}'s ${typeLabel} Report`;
// }

// function formatTrackLabel(track) {
//   if (!track) return 'Unknown Track';
//   return `${toTitleCase(track)} Engineer`;
// }

// export default function Dashboard({ data, onReset, onTryAgain, type, uploadData, track }) {
//   // --- STATE FOR AUTOMATED EMAIL MODULE ---
//   const [emailSubmissions, setEmailSubmissions] = useState([]);
//   const [dbLoading, setDbLoading] = useState(true);
//   const [selectedEvaluation, setSelectedEvaluation] = useState(data || null);
//   const [activeReportMeta, setActiveReportMeta] = useState({ type, uploadData, track });

//   // Fetch email submissions logs from backend database
//   useEffect(() => {
//     fetch('http://localhost:8000/api/email-submissions')
//       .then((res) => {
//         if (!res.ok) throw new Error("Database network stream exception");
//         return res.json();
//       })
//       .then((logs) => {
//         setEmailSubmissions(logs);
//         setDbLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to load automation records:", err);
//         setDbLoading(false);
//       });
//   }, []);

//   // Action hook to load email JSON report directly into viewer dashboard
//   const handleSelectEmailReport = (submission) => {
//     if (submission.status === 'Completed' && submission.raw_response) {
//       setSelectedEvaluation(submission.raw_response);
//       setActiveReportMeta({
//         type: 'prework',
//         track: submission.raw_response.track || 'AI', 
//         uploadData: { file: { name: submission.file_name } }
//       });
//     }
//   };

//   const evaluation = selectedEvaluation || {
//     overall_score: 0, score: 0, relevance: 0, confidence: 0,
//     strengths: [], weaknesses: [], critical_gaps: [], next_steps_to_hire: [],
//     skill_assessment: {}, tech_stack: [], feedback: ""
//   };

//   const score = evaluation.overall_score || evaluation.score || 0;
//   const hasDetailedAssessment = !!evaluation.skill_assessment;
//   const reportTitle = buildReportTitle(activeReportMeta.type, activeReportMeta.uploadData);
//   const trackLabel = formatTrackLabel(activeReportMeta.track);
//   const techStack = Array.isArray(evaluation.tech_stack) ? evaluation.tech_stack : [];

//   const getCustomRecommendation = (score) => {
//     const numericScore = Number(score);
//     if (numericScore < 60) return "Low";
//     if (numericScore >= 60 && numericScore <= 80) return "Medium";
//     return "High";
//   };
//   const hiringRecommendation = getCustomRecommendation(score);

//   const handleDownloadReport = () => {
//     const originalTitle = document.title;
//     document.title = `SkillCheck_${trackLabel.replace(/\s+/g, '_')}_${reportTitle.replace(/\s+/g, '_')}_${score}_Score`;
//     window.print();
//     document.title = originalTitle;
//   };

//   return (
//     <div className="w-full text-left space-y-10 animate-fade-in print:p-8 print:bg-white print:text-black">
      
//       {/* 1. AUTOMATED EMAIL PIPELINE SECTION (Hidden in printing mode) */}
//       <div className="print:hidden space-y-4">
//         <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
//           <Mail className="w-5 h-5 text-indigo-400" />
//           <h2 className="text-xl font-bold text-white">Automated Candidate Submissions Inbox</h2>
//         </div>
        
//         {dbLoading ? (
//           <div className="flex items-center gap-2 text-slate-400 p-4 justify-center bg-[#0b0f19]/40 rounded-xl border border-white/[0.04]">
//             <Loader className="w-4 h-4 animate-spin text-indigo-400" />
//             <span className="text-xs font-semibold">Syncing evaluation engine database records...</span>
//           </div>
//         ) : emailSubmissions.length === 0 ? (
//           <div className="text-xs text-slate-500 p-6 text-center bg-[#0b0f19]/40 rounded-xl border border-white/[0.04]">
//             No email submissions scanned yet. Send an email with subject 'Pre-Work Submission' to parse live data.
//           </div>
//         ) : (
//           <div className="bg-[#0b0f19]/60 border border-white/[0.06] rounded-xl overflow-hidden shadow-xl">
//             <div className="max-h-60 overflow-y-auto">
//               <table className="w-full text-xs text-slate-300">
//                 <thead className="bg-white/5 text-slate-400 sticky top-0 uppercase tracking-wider font-semibold border-b border-white/[0.06]">
//                   <tr>
//                     <th className="p-3 text-left">Candidate</th>
//                     <th className="p-3 text-left">Email Address</th>
//                     <th className="p-3 text-left">Attached File</th>
//                     <th className="p-3 text-left">Processed Date</th>
//                     <th className="p-3 text-center">Score</th>
//                     <th className="p-3 text-left">Status Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/[0.04]">
//                   {emailSubmissions.map((sub) => (
//                     <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
//                       <td className="p-3 font-semibold text-white">{sub.candidate_name}</td>
//                       <td className="p-3 text-slate-400">{sub.candidate_email}</td>
//                       <td className="p-3 font-mono text-indigo-300">{sub.file_name}</td>
//                       <td className="p-3 text-slate-500">{new Date(sub.submission_date).toLocaleString('en-IN')}</td>
//                       <td className="p-3 text-center font-bold text-sm text-purple-400">
//                         {sub.status === 'Completed' ? `${sub.overall_score}` : '—'}
//                       </td>
//                       <td className="p-3">
//                         {sub.status === 'Completed' ? (
//                           <button 
//                             onClick={() => handleSelectEmailReport(sub)}
//                             className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded-lg cursor-pointer transition-all"
//                           >
//                             <CheckCircle className="w-3.5 h-3.5" /> View Report
//                           </button>
//                         ) : sub.status.includes('Failed') ? (
//                           <span className="flex items-center gap-1 text-red-400 font-semibold px-2">
//                             <XCircle className="w-3.5 h-3.5" /> Error Logged
//                           </span>
//                         ) : (
//                           <span className="flex items-center gap-1 text-amber-400 font-semibold animate-pulse px-2">
//                             <Loader className="w-3.5 h-3.5 animate-spin" /> Evaluating
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* 2. CORE EVALUATION INSIGHTS VIEWER REPORT BREAKDOWN */}
//       {selectedEvaluation && (
//         <div className="space-y-8 mt-4 border-t border-white/[0.04] pt-8 print:border-none print:pt-0">
          
//           {/* Header Controls Layout */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] print:border-black/10 pb-6 print:mb-6">
//             <div>
//               <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-indigo-400 font-semibold tracking-wide print:hidden">Evaluation Analytics Panel</span>
//               <h1 className="text-4xl font-black text-white print:text-black tracking-tight mt-2">{reportTitle}</h1>
//               <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-slate-300 print:border-black/10 print:bg-slate-100 print:text-slate-700">
//                 <span className="text-slate-500 uppercase">Track Match</span>
//                 <span className="text-white print:text-black">{trackLabel}</span>
//               </div>
//             </div>
//             <div className="flex gap-3 print:hidden">
//               <button 
//                 onClick={handleDownloadReport} 
//                 className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
//               >
//                 <Download className="w-4 h-4" /> Download Report
//               </button>
//               <button 
//                 onClick={onTryAgain} 
//                 className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
//               >
//                 <RefreshCw className="w-4 h-4" /> Try Again
//               </button>
//               <button 
//                 onClick={onReset} 
//                 className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-colors cursor-pointer text-white"
//               >
//                 <ArrowLeft className="w-4 h-4" /> Back
//               </button>
//             </div>
//           </div>

//           {/* Metrics Layout Block */}
//           <div className="grid lg:grid-cols-3 gap-6 items-start print:grid-cols-3">
//             <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm flex flex-col items-center justify-center text-center relative min-h-[320px] print:bg-slate-50">
//               <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase absolute top-6 left-6">Overall Score</h3>
//               <div className="relative w-40 h-40 flex items-center justify-center mt-6">
//                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
//                   <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
//                   <circle cx="50" cy="50" r="42" stroke="#a855f7" strokeWidth="6" fill="transparent"
//                     strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)} strokeLinecap="round" />
//                 </svg>
//                 <div className="absolute">
//                   <span className="text-5xl font-black text-white print:text-black block">{score}</span>
//                   <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">of 100</span>
//                 </div>
//               </div>
//               <div className="mt-6 flex gap-6 text-xs text-left w-full border-t border-white/[0.04] print:border-black/5 pt-4 px-2">
//                 <div><span className="text-slate-500 block">Relevance</span><span className="text-white print:text-black font-bold">{evaluation.relevance || 0}%</span></div>
//                 <div><span className="text-slate-500 block">Confidence</span><span className="text-purple-400 font-bold">{evaluation.confidence || 0}%</span></div>
//               </div>
//             </div>

//             {/* Detailed Skills Competency Matrices */}
//             {hasDetailedAssessment && Object.keys(evaluation.skill_assessment).length > 0 && (
//               <div className="lg:col-span-2 grid md:grid-cols-2 gap-4 h-full print:col-span-2 print:grid-cols-2">
//                 {Object.entries(evaluation.skill_assessment).map(([skill, sData], idx) => (
//                   <div key={idx} className="p-4 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm print:bg-slate-50 page-break-inside-avoid">
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="text-xs font-bold tracking-wider text-slate-400 print:text-slate-700 uppercase">{skill.replace(/_/g, ' ')}</span>
//                       <span className="text-lg font-black text-indigo-400 print:text-indigo-600">{sData.score || 0}</span>
//                     </div>
//                     <p className="text-xs text-slate-500 print:text-slate-600 leading-relaxed">{sData.evidence || 'No evidence verified'}</p>
//                     <div className="w-full bg-white/5 print:bg-slate-200 h-1 rounded-full mt-3">
//                       <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${sData.score}%` }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Core Strengths and Gaps */}
//           <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
//             <div className="p-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 print:border-emerald-600/20 space-y-4 print:bg-emerald-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {(evaluation.strengths || []).map((str, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">·</span><span>{str}</span></li>)}
//               </ul>
//             </div>
            
//             <div className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/10 print:border-red-600/20 space-y-4 print:bg-red-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-red-400 print:text-red-700 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Critical Gaps</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {(evaluation.critical_gaps || evaluation.weaknesses || []).map((gap, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">⚠</span><span>{gap}</span></li>)}
//               </ul>
//             </div>
//           </div>

//           {/* Strategy Infrastructure Elements */}
//           {(techStack.length > 0 || hiringRecommendation) && (
//             <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
//               {techStack.length > 0 && (
//                 <div className="p-6 rounded-2xl bg-violet-500/[0.02] border border-violet-500/10 print:border-violet-600/20 space-y-4 print:bg-violet-50/30 page-break-inside-avoid">
//                   <h3 className="text-sm font-bold text-violet-400 print:text-violet-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Tech Stack</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {techStack.map((tech, index) => (
//                       <span key={index} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 print:bg-white print:border-black/10 print:text-slate-800">
//                         {tech}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {hiringRecommendation && (
//                 <div className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 print:border-amber-600/20 space-y-4 print:bg-amber-50/30 page-break-inside-avoid">
//                   <h3 className="text-sm font-bold text-amber-400 print:text-amber-700 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Hiring Recommendation</h3>
//                   <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">{hiringRecommendation}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Action Tasks Pipeline */}
//           {evaluation.next_steps_to_hire && evaluation.next_steps_to_hire.length > 0 && (
//             <div className="p-6 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10 print:border-blue-600/20 space-y-4 print:bg-blue-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-blue-400 print:text-blue-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Next Steps for Hiring</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {evaluation.next_steps_to_hire.map((step, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span><span>{step}</span></li>)}
//               </ul>
//             </div>
//           )}

//           {/* Detailed Feedback Text block */}
//           <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm space-y-2 print:bg-slate-50 page-break-inside-avoid">
//             <h3 className="text-xs font-bold text-indigo-400 print:text-indigo-600 tracking-wider uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Detailed Feedback</h3>
//             <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed whitespace-pre-wrap">{evaluation.feedback}</p>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }





// import React, { useEffect, useState } from 'react';
// import { 
//   Download, RefreshCw, ArrowLeft, CheckCircle2, 
//   AlertTriangle, TrendingUp, Target, Mail, Loader, CheckCircle, XCircle, X
// } from 'lucide-react';

// function toTitleCase(value) {
//   if (!value) return '';
//   return value
//     .split(/\s+/)
//     .filter(Boolean)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(' ');
// }

// function cleanDisplayName(value) {
//   return value
//     .replace(/\.[^.]+$/, '')
//     .replace(/[._-]+/g, ' ')
//     .replace(/\b(resume|cv|prework|pre work|project|report|final|candidate|document|portfolio)\b/gi, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();
// }

// function inferSubjectName(type, uploadData) {
//   const fileName = uploadData?.file?.name || uploadData?.fileName || '';
//   if (!fileName && type === 'repo') {
//     return 'Repository';
//   }
//   const cleanedFileName = cleanDisplayName(fileName);
//   return cleanedFileName ? toTitleCase(cleanedFileName) : 'Candidate';
// }

// function buildReportTitle(type, uploadData) {
//   const typeLabelMap = { resume: 'Resume', prework: 'Pre-Work', repo: 'Repository' };
//   const typeLabel = typeLabelMap[type] || 'Report';
//   const subjectName = inferSubjectName(type, uploadData);

//   return subjectName === 'Candidate'
//     ? `Your ${typeLabel} Report`
//     : `${subjectName}'s ${typeLabel} Report`;
// }

// function formatTrackLabel(track) {
//   if (!track) return 'Full Stack Developer';
//   if (track.toLowerCase() === 'ai') return 'AI Engineer';
//   if (track.toLowerCase() === 'ml') return 'ML Engineer';
//   if (track.toLowerCase() === 'fullstack') return 'Full Stack Developer';
//   return `${toTitleCase(track)} Engineer`;
// }

// export default function Dashboard({ data, onReset, onTryAgain, type, uploadData, track }) {
//   // --- STATES ---
//   const [emailSubmissions, setEmailSubmissions] = useState([]);
//   const [dbLoading, setDbLoading] = useState(true);
  
//   // Storage states
//   const [selectedEvaluation, setSelectedEvaluation] = useState(data || null);
//   const [activeReportMeta, setActiveReportMeta] = useState({ 
//     type: type || 'prework', 
//     uploadData: uploadData || { file: { name: 'Candidate Submission' } }, 
//     track: track || 'fullstack' 
//   });
  
//   const [viewMode, setViewMode] = useState(data ? 'report' : 'list');

//   // Fetch automation dashboard logs
//   useEffect(() => {
//     fetch('http://localhost:8000/api/email-submissions')
//       .then((res) => {
//         if (!res.ok) throw new Error("Database network exception connection failure");
//         return res.json();
//       })
//       .then((logs) => {
//         setEmailSubmissions(logs);
//         setDbLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch automation logs:", err);
//         setDbLoading(false);
//       });
//   }, []);

//   // Action event handler triggered when recruiter hits "View Report"
//   const handleSelectEmailReport = (submission) => {
//     console.log("[DEBUG] Raw Submission Clicked:", submission);

//     if (submission.status === 'Completed') {
//       try {
//         let parsedResponse = null;
        
//         // Pick whichever case structure the DB response contains
//         const rawResponseData = submission.raw_response || submission.raw_response_data || submission.RAW_RESPONSE;

//         if (typeof rawResponseData === 'string') {
//           parsedResponse = JSON.parse(rawResponseData);
//         } else {
//           parsedResponse = rawResponseData;
//         }

//         // Deep fallback parsing mechanism if data object still holds string references
//         if (parsedResponse && typeof parsedResponse === 'object' && parsedResponse.raw_response) {
//           const nested = parsedResponse.raw_response;
//           parsedResponse = typeof nested === 'string' ? JSON.parse(nested) : nested;
//         }

//         console.log("[DEBUG] Final Structured AI Object Extracted:", parsedResponse);

//         // Safe verification backup fallback injection array check
//         const finalPayload = parsedResponse || submission;

//         setSelectedEvaluation(finalPayload);
//         setActiveReportMeta({
//           type: 'prework', 
//           track: finalPayload?.track || 'fullstack', 
//           uploadData: { fileName: submission.file_name || 'Pre-Work' }
//         });
        
//         setViewMode('report');
        
//       } catch (parseError) {
//         console.error("JSON parsing structural glitch:", parseError);
//         alert("Failed to read the report structure due to formatting corruption.");
//       }
//     } else {
//       alert(`Cannot open. Current status is: ${submission.status}`);
//     }
//   };

//   // --- COMPACT UNIFIED EVALUATION OBJECT LAYER ---
//   const getActiveEvaluation = () => {
//     let target = selectedEvaluation || data;
//     if (!target) return {};
    
//     if (target.raw_response) {
//       return typeof target.raw_response === 'string'
//         ? JSON.parse(target.raw_response)
//         : target.raw_response;
//     }
//     return target;
//   };

//   const evaluation = getActiveEvaluation();

//   // Bulletproof fallback variable extractions
//   const score = Number(evaluation?.overall_score || evaluation?.score || 0);
//   const relevance = Number(evaluation?.relevance || 0);
//   const confidence = Number(evaluation?.confidence || 0);
//   const strengths = Array.isArray(evaluation?.strengths) ? evaluation.strengths : [];
//   const criticalGaps = Array.isArray(evaluation?.critical_gaps) ? evaluation.critical_gaps : (Array.isArray(evaluation?.weaknesses) ? evaluation.weaknesses : []);
//   const nextSteps = Array.isArray(evaluation?.next_steps_to_hire) ? evaluation.next_steps_to_hire : [];
//   const techStack = Array.isArray(evaluation?.tech_stack) ? evaluation.tech_stack : [];
//   const feedbackText = evaluation?.feedback || "No narrative evaluation summary logged.";
  
//   const skillAssessment = evaluation?.skill_assessment || {};
//   const hasDetailedAssessment = typeof skillAssessment === 'object' && Object.keys(skillAssessment).length > 0;

//   // Variables safely initialized outside layout elements to prevent compilation ReferenceError crashes
//   const reportTitle = buildReportTitle(activeReportMeta.type, activeReportMeta.uploadData);
//   const trackLabel = formatTrackLabel(activeReportMeta.track);

//   const getCustomRecommendation = (scoreVal) => {
//     if (scoreVal < 60) return "Low";
//     if (scoreVal >= 60 && scoreVal <= 80) return "Medium";
//     return "High";
//   };
//   const hiringRecommendation = getCustomRecommendation(score);

//   const handleDownloadReport = () => {
//     const originalTitle = document.title;
//     document.title = `SkillCheck_${trackLabel.replace(/\s+/g, '_')}_${reportTitle.replace(/\s+/g, '_')}_${score}_Score`;
//     window.print();
//     document.title = originalTitle;
//   };

//   return (
//     <div className="w-full text-left space-y-10 animate-fade-in print:p-8 print:bg-white print:text-black">
      
//       {/* VIEW MODE 1: MASTER LIST VIEW (Recruiter Inbox Hub) */}
//       {viewMode === 'list' && (
//         <div className="space-y-4 w-full">
//           <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
//             <Mail className="w-5 h-5 text-indigo-400" />
//             <h2 className="text-xl font-bold text-white">Automated Candidate Submissions Inbox</h2>
//           </div>
          
//           {dbLoading ? (
//             <div className="flex items-center gap-2 text-slate-400 p-12 justify-center bg-[#0b0f19]/40 rounded-xl border border-white/[0.04]">
//               <Loader className="w-5 h-5 animate-spin text-indigo-400" />
//               <span className="text-sm font-semibold">Syncing evaluation engine database records...</span>
//             </div>
//           ) : emailSubmissions.length === 0 ? (
//             <div className="text-sm text-slate-500 p-12 text-center bg-[#0b0f19]/40 rounded-xl border border-white/[0.04]">
//               No email submissions scanned yet. Send an email with subject 'Pre-Work Submission' to parse live data.
//             </div>
//           ) : (
//             <div className="bg-[#0b0f19]/60 border border-white/[0.06] rounded-xl overflow-x-auto shadow-2xl w-full">
//               <table className="w-full text-xs text-slate-300 border-collapse table-auto min-w-[800px]">
//                 <thead className="bg-white/5 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/[0.06]">
//                   <tr>
//                     <th className="p-4 text-left">Candidate</th>
//                     <th className="p-4 text-left">Email Address</th>
//                     <th className="p-4 text-left">Attached File</th>
//                     <th className="p-4 text-left">Processed Date</th>
//                     <th className="p-4 text-center">Score</th>
//                     <th className="p-4 text-left">Status Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/[0.04]">
//                   {emailSubmissions.map((sub) => (
//                     <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
//                       <td className="p-4 font-semibold text-white text-sm">{sub.candidate_name}</td>
//                       <td className="p-4 text-slate-400 text-sm">{sub.candidate_email}</td>
//                       <td className="p-4 font-mono text-indigo-300">{sub.file_name}</td>
//                       <td className="p-4 text-slate-500">{new Date(sub.submission_date).toLocaleString('en-IN')}</td>
//                       <td className="p-4 text-center font-bold text-base text-purple-400">
//                         {sub.status === 'Completed' ? `${sub.overall_score}` : '—'}
//                       </td>
//                       <td className="p-4">
//                         {sub.status === 'Completed' ? (
//                           <button 
//                             onClick={() => handleSelectEmailReport(sub)}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-indigo-600/10 text-xs"
//                           >
//                             <CheckCircle className="w-4 h-4" /> View Report
//                           </button>
//                         ) : sub.status.includes('Failed') ? (
//                           <span className="flex items-center gap-1 text-red-400 font-semibold px-2">
//                             <XCircle className="w-4 h-4" /> Error Logged
//                           </span>
//                         ) : (
//                           <span className="flex items-center gap-1 text-amber-400 font-semibold animate-pulse px-2">
//                             <Loader className="w-4 h-4 animate-spin" /> Evaluating
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* VIEW MODE 2: HIGH FIDELITY CANDIDATE REPORT VIEW */}
//       {viewMode === 'report' && (
//         <div className="space-y-8 animate-fade-in w-full">
          
//           {/* Top Sticky Header Panel Controls */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] print:border-black/10 pb-6 print:mb-6">
//             <div>
//               <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-indigo-400 font-semibold tracking-wide print:hidden">
//                 AI SkillCheck Report Evaluated Successfully
//               </span>
//               <h1 className="text-4xl font-black text-white print:text-black tracking-tight mt-2">{reportTitle}</h1>
//               <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-slate-300 print:border-black/10 print:bg-slate-100 print:text-slate-700">
//                 <span className="text-slate-500 uppercase">Track Selected</span>
//                 <span className="text-white print:text-black">{trackLabel}</span>
//               </div>
//             </div>
            
//             <div className="flex gap-3 print:hidden">
//               <button 
//                 onClick={handleDownloadReport} 
//                 className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
//               >
//                 <Download className="w-4 h-4" /> Download Report
//               </button>
              
//               {data ? (
//                 <>
//                   <button onClick={onTryAgain} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"><RefreshCw className="w-4 h-4" /> Try Again</button>
//                   <button onClick={onReset} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-colors cursor-pointer text-white"><ArrowLeft className="w-4 h-4" /> Back</button>
//                 </>
//               ) : (
//                 <button 
//                   onClick={() => setViewMode('list')} 
//                   className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-red-600/10"
//                 >
//                   <X className="w-4 h-4" /> Close Report View
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Graphical Progress Breakdown */}
//           <div className="grid lg:grid-cols-3 gap-6 items-start print:grid-cols-3">
//             <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm flex flex-col items-center justify-center text-center relative min-h-[320px] print:bg-slate-50">
//               <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase absolute top-6 left-6">Overall Score</h3>
//               <div className="relative w-40 h-40 flex items-center justify-center mt-6">
//                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
//                   <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
//                   <circle cx="50" cy="50" r="42" stroke="#a855f7" strokeWidth="6" fill="transparent"
//                     strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)} strokeLinecap="round" />
//                 </svg>
//                 <div className="absolute">
//                   <span className="text-5xl font-black text-white print:text-black block">{score}</span>
//                   <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">of 100</span>
//                 </div>
//               </div>
//               <div className="mt-6 flex gap-6 text-xs text-left w-full border-t border-white/[0.04] print:border-black/5 pt-4 px-2">
//                 <div><span className="text-slate-500 block">Relevance</span><span className="text-white print:text-black font-bold">{relevance}%</span></div>
//                 <div><span className="text-slate-500 block">Confidence</span><span className="text-purple-400 font-bold">{confidence}%</span></div>
//               </div>
//             </div>

//             {/* Core Skills Competency Bars */}
//             {hasDetailedAssessment && (
//               <div className="lg:col-span-2 grid md:grid-cols-2 gap-4 h-full print:col-span-2 print:grid-cols-2">
//                 {Object.entries(skillAssessment).map(([skill, sData], idx) => (
//                   <div key={idx} className="p-4 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm print:bg-slate-50 page-break-inside-avoid">
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="text-xs font-bold tracking-wider text-slate-400 print:text-slate-700 uppercase">{skill.replace(/_/g, ' ')}</span>
//                       <span className="text-lg font-black text-indigo-400 print:text-indigo-600">{sData?.score || 0}</span>
//                     </div>
//                     <p className="text-xs text-slate-500 print:text-slate-600 leading-relaxed">{sData?.evidence || 'No evidence verified'}</p>
//                     <div className="w-full bg-white/5 print:bg-slate-200 h-1 rounded-full mt-3">
//                       <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${sData?.score || 0}%` }}></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Strengths & Critical Gaps */}
//           <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
//             <div className="p-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 print:border-emerald-600/20 space-y-4 print:bg-emerald-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {strengths.length === 0 ? <li>No explicit strengths logged.</li> : strengths.map((str, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">·</span><span>{str}</span></li>)}
//               </ul>
//             </div>
            
//             <div className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/10 print:border-red-600/20 space-y-4 print:bg-red-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-red-400 print:text-red-700 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Critical Gaps</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {criticalGaps.length === 0 ? <li>No core gaps identified.</li> : criticalGaps.map((gap, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">⚠</span><span>{gap}</span></li>)}
//               </ul>
//             </div>
//           </div>

//           {/* Tech Stack and Hiring Recommendation */}
//           {(techStack.length > 0 || hiringRecommendation) && (
//             <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
//               {techStack.length > 0 && (
//                 <div className="p-6 rounded-2xl bg-violet-500/[0.02] border border-violet-500/10 print:border-violet-600/20 space-y-4 print:bg-violet-50/30 page-break-inside-avoid">
//                   <h3 className="text-sm font-bold text-violet-400 print:text-violet-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Tech Stack</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {techStack.map((tech, index) => (
//                       <span key={index} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 print:bg-white print:border-black/10 print:text-slate-800">
//                         {tech}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {hiringRecommendation && (
//                 <div className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 print:border-amber-600/20 space-y-4 print:bg-amber-50/30 page-break-inside-avoid">
//                   <h3 className="text-sm font-bold text-amber-400 print:text-amber-700 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Hiring Recommendation</h3>
//                   <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed">{hiringRecommendation}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Next Steps Hiring Action Strategy */}
//           {nextSteps.length > 0 && (
//             <div className="p-6 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10 print:border-blue-600/20 space-y-4 print:bg-blue-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-blue-400 print:text-blue-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Next Steps for Hiring</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {nextSteps.map((step, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span><span>{step}</span></li>)}
//               </ul>
//             </div>
//           )}

//           {/* Detailed Feedback Text */}
//           <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm space-y-2 print:bg-slate-50 page-break-inside-avoid">
//             <h3 className="text-xs font-bold text-indigo-400 print:text-indigo-600 tracking-wider uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Detailed Feedback</h3>
//             <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed whitespace-pre-wrap">{feedbackText}</p>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }





// import React, { useEffect, useState } from 'react';
// import { 
//   Download, RefreshCw, ArrowLeft, CheckCircle2, 
//   AlertTriangle, TrendingUp, Target, Mail, Loader, CheckCircle, XCircle, X
// } from 'lucide-react';

// function toTitleCase(value) {
//   if (!value) return '';
//   return value
//     .split(/\s+/)
//     .filter(Boolean)
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(' ');
// }

// function cleanDisplayName(value) {
//   return value
//     .replace(/\.[^.]+$/, '')
//     .replace(/[._-]+/g, ' ')
//     .replace(/\b(resume|cv|prework|pre work|project|report|final|candidate|document|portfolio)\b/gi, ' ')
//     .replace(/\s+/g, ' ')
//     .trim();
// }

// function inferSubjectName(type, uploadData) {
//   const fileName = uploadData?.file?.name || uploadData?.fileName || '';
//   if (!fileName && type === 'repo') {
//     return 'Repository';
//   }
//   const cleanedFileName = cleanDisplayName(fileName);
//   return cleanedFileName ? toTitleCase(cleanedFileName) : 'Candidate';
// }

// function buildReportTitle(type, uploadData) {
//   const typeLabelMap = { resume: 'Resume', prework: 'Pre-Work', repo: 'Repository' };
//   const typeLabel = typeLabelMap[type] || 'Report';
//   const subjectName = inferSubjectName(type, uploadData);

//   return subjectName === 'Candidate'
//     ? `Your ${typeLabel} Report`
//     : `${subjectName}'s ${typeLabel} Report`;
// }

// function formatTrackLabel(track) {
//   if (!track) return 'Full Stack Developer';
//   if (track.toLowerCase() === 'ai') return 'AI Engineer';
//   if (track.toLowerCase() === 'ml') return 'ML Engineer';
//   if (track.toLowerCase() === 'fullstack') return 'Full Stack Developer';
//   return `${toTitleCase(track)} Engineer`;
// }

// export default function Dashboard({ data, onReset, onTryAgain, type, uploadData, track }) {
//   // --- STATES ---
//   const [emailSubmissions, setEmailSubmissions] = useState([]);
//   const [dbLoading, setDbLoading] = useState(true);
  
//   const [selectedEvaluation, setSelectedEvaluation] = useState(data || null);
//   const [activeReportMeta, setActiveReportMeta] = useState({ 
//     type: type || 'prework', 
//     uploadData: uploadData || { file: { name: 'Candidate Submission' } }, 
//     track: track || 'fullstack' 
//   });
  
//   const [viewMode, setViewMode] = useState(data ? 'report' : 'list');

//   // Fetch submissions logs
//   useEffect(() => {
//     fetch('http://localhost:8000/api/email-submissions')
//       .then((res) => {
//         if (!res.ok) throw new Error("Database network failure");
//         return res.json();
//       })
//       .then((logs) => {
//         setEmailSubmissions(logs);
//         setDbLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch logs:", err);
//         setDbLoading(false);
//       });
//   }, []);

//   // MASTER DATA PARSING CONTROLLER
//   const handleSelectEmailReport = (submission) => {
//     console.log("[DEBUG] Clicked submission row structure:", submission);

//     if (submission.status === 'Completed' || submission.overall_score > 0) {
//       let payload = submission.raw_response;
      
//       // Layer 1: Agar raw_response text-string format me mila toh parse karein
//       if (typeof payload === 'string') {
//         try {
//           payload = JSON.parse(payload);
//         } catch (e) {
//           console.error("String JSON parse crash:", e);
//         }
//       }

//       // Layer 2: Agar parsing ke baad bhi key double nested 'raw_response' ke andar band hai
//       if (payload && payload.raw_response) {
//         payload = typeof payload.raw_response === 'string'
//           ? JSON.parse(payload.raw_response)
//           : payload.raw_response;
//       }

//       // Layer 3: Dynamic fallback injection agar data root dictionary structure par ho
//       const activePayload = payload || submission;
//       console.log("[DEBUG] Final Clean AI Object Resolved:", activePayload);

//       setSelectedEvaluation(activePayload);
//       setActiveReportMeta({
//         type: 'prework', 
//         track: activePayload?.track || submission?.track || 'ai', 
//         uploadData: { fileName: submission.file_name || 'Pre-Work' }
//       });
//       setViewMode('report');
//     } else {
//       alert(`Cannot view details. Current Status: ${submission.status}`);
//     }
//   };

//   // --- UNIFY LAYER (MANUAL FILE VS EMAIL PIPELINE SYNC) ---
//   const getCleanEvaluation = () => {
//     let target = selectedEvaluation || data;
//     if (!target) return {};
    
//     // Agar object me seedhe property "feedback" ya "strengths" maujood hai, toh direct return karein
//     if (target.feedback || target.strengths || target.overall_score) {
//       return target;
//     }
    
//     // Nested checks fallbacks
//     if (target.raw_response) {
//       return typeof target.raw_response === 'string'
//         ? JSON.parse(target.raw_response)
//         : target.raw_response;
//     }
//     return target;
//   };

//   const evaluation = getCleanEvaluation();

//   // --- SAFE PROPERTIES EXTRACTION ---
//   const score = Number(evaluation?.overall_score || evaluation?.score || selectedEvaluation?.overall_score || 0);
//   const relevance = Number(evaluation?.relevance !== undefined ? evaluation.relevance : (selectedEvaluation?.relevance || 0));
//   const confidence = Number(evaluation?.confidence !== undefined ? evaluation.confidence : (selectedEvaluation?.confidence || 0));
//   const feedbackText = evaluation?.feedback || selectedEvaluation?.feedback || "No narrative evaluation summary logged.";
//   const hiringRecommendation = evaluation?.hiring_recommendation || selectedEvaluation?.hiring_recommendation || "Low";

//   // Array Extractions with robust layer fallback verification
//   const strengths = Array.isArray(evaluation?.strengths) && evaluation.strengths.length > 0 ? evaluation.strengths : 
//                     (Array.isArray(selectedEvaluation?.strengths) ? selectedEvaluation.strengths : []);

//   const criticalGaps = Array.isArray(evaluation?.critical_gaps) && evaluation.critical_gaps.length > 0 ? evaluation.critical_gaps : 
//                        (Array.isArray(selectedEvaluation?.critical_gaps) && selectedEvaluation.critical_gaps.length > 0 ? selectedEvaluation.critical_gaps : 
//                        (Array.isArray(evaluation?.weaknesses) ? evaluation.weaknesses : []));

//   const nextSteps = Array.isArray(evaluation?.next_steps_to_hire) ? evaluation.next_steps_to_hire : [];
//   const techStack = Array.isArray(evaluation?.tech_stack) ? evaluation.tech_stack : [];
  
//   const skillAssessment = evaluation?.skill_assessment || selectedEvaluation?.skill_assessment || {};
//   const hasDetailedAssessment = typeof skillAssessment === 'object' && Object.keys(skillAssessment).length > 0;

//   const reportTitle = buildReportTitle(activeReportMeta.type, activeReportMeta.uploadData);
//   const trackLabel = formatTrackLabel(activeReportMeta.track);

//   const handleDownloadReport = () => {
//     const originalTitle = document.title;
//     document.title = `SkillCheck_${trackLabel.replace(/\s+/g, '_')}_${reportTitle.replace(/\s+/g, '_')}_${score}_Score`;
//     window.print();
//     document.title = originalTitle;
//   };

//   return (
//     <div className="w-full text-left space-y-10 animate-fade-in print:p-8 print:bg-white print:text-black">
      
//       {/* VIEW MODE 1: MASTER LIST VIEW */}
//       {viewMode === 'list' && (
//         <div className="space-y-4 w-full">
//           <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
//             <Mail className="w-5 h-5 text-indigo-400" />
//             <h2 className="text-xl font-bold text-white">Automated Candidate Submissions Inbox</h2>
//           </div>
          
//           {dbLoading ? (
//             <div className="flex items-center gap-2 text-slate-400 p-12 justify-center bg-[#0b0f19]/40 rounded-xl border border-white/[0.04]">
//               <Loader className="w-5 h-5 animate-spin text-indigo-400" />
//               <span className="text-sm font-semibold">Syncing evaluation engine database records...</span>
//             </div>
//           ) : emailSubmissions.length === 0 ? (
//             <div className="text-sm text-slate-500 p-12 text-center bg-[#0b0f19]/40 rounded-xl border border-white/[0.04]">
//               No email submissions scanned yet. Send an email with subject 'Pre-Work Submission' to parse live data.
//             </div>
//           ) : (
//             <div className="bg-[#0b0f19]/60 border border-white/[0.06] rounded-xl overflow-x-auto shadow-2xl w-full">
//               <table className="w-full text-xs text-slate-300 border-collapse table-auto min-w-[800px]">
//                 <thead className="bg-white/5 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/[0.06]">
//                   <tr>
//                     <th className="p-4 text-left">Candidate</th>
//                     <th className="p-4 text-left">Email Address</th>
//                     <th className="p-4 text-left">Attached File</th>
//                     <th className="p-4 text-left">Processed Date</th>
//                     <th className="p-4 text-center">Score</th>
//                     <th className="p-4 text-left">Status Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/[0.04]">
//                   {emailSubmissions.map((sub) => (
//                     <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
//                       <td className="p-4 font-semibold text-white text-sm">{sub.candidate_name}</td>
//                       <td className="p-4 text-slate-400 text-sm">{sub.candidate_email}</td>
//                       <td className="p-4 font-mono text-indigo-300">{sub.file_name}</td>
//                       <td className="p-4 text-slate-500">{new Date(sub.submission_date).toLocaleString('en-IN')}</td>
//                       <td className="p-4 text-center font-bold text-base text-purple-400">
//                         {sub.status === 'Completed' ? `${sub.overall_score}` : '—'}
//                       </td>
//                       <td className="p-4">
//                         {sub.status === 'Completed' ? (
//                           <button 
//                             onClick={() => handleSelectEmailReport(sub)}
//                             className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-indigo-600/10 text-xs"
//                           >
//                             <CheckCircle className="w-4 h-4" /> View Report
//                           </button>
//                         ) : sub.status.includes('Failed') ? (
//                           <span className="flex items-center gap-1 text-red-400 font-semibold px-2">
//                             <XCircle className="w-4 h-4" /> Error Logged
//                           </span>
//                         ) : (
//                           <span className="flex items-center gap-1 text-amber-400 font-semibold animate-pulse px-2">
//                             <Loader className="w-4 h-4 animate-spin" /> Evaluating
//                           </span>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* VIEW MODE 2: HIGH FIDELITY CANDIDATE REPORT VIEW */}
//       {viewMode === 'report' && (
//         <div className="space-y-8 animate-fade-in w-full">
          
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] print:border-black/10 pb-6 print:mb-6">
//             <div>
//               <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-indigo-400 font-semibold tracking-wide print:hidden">
//                 AI SkillCheck Report Evaluated Successfully
//               </span>
//               <h1 className="text-4xl font-black text-white print:text-black tracking-tight mt-2">{reportTitle}</h1>
//               <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-slate-300 print:border-black/10 print:bg-slate-100 print:text-slate-700">
//                 <span className="text-slate-500 uppercase">Track Selected</span>
//                 <span className="text-white print:text-black">{trackLabel}</span>
//               </div>
//             </div>
            
//             <div className="flex gap-3 print:hidden">
//               <button 
//                 onClick={handleDownloadReport} 
//                 className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
//               >
//                 <Download className="w-4 h-4" /> Download Report
//               </button>
              
//               {data ? (
//                 <>
//                   <button onClick={onTryAgain} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"><RefreshCw className="w-4 h-4" /> Try Again</button>
//                   <button onClick={onReset} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-colors cursor-pointer text-white"><ArrowLeft className="w-4 h-4" /> Back</button>
//                 </>
//               ) : (
//                 <button 
//                   onClick={() => setViewMode('list')} 
//                   className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-red-600/10"
//                 >
//                   <X className="w-4 h-4" /> Close Report View
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Graphical Progress Metrics */}
//           <div className="grid lg:grid-cols-3 gap-6 items-start print:grid-cols-3">
//             <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm flex flex-col items-center justify-center text-center relative min-h-[320px] print:bg-slate-50">
//               <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase absolute top-6 left-6">Overall Score</h3>
//               <div className="relative w-40 h-40 flex items-center justify-center mt-6">
//                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
//                   <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.02)" strokeWidth="6" fill="transparent" />
//                   <circle cx="50" cy="50" r="42" stroke="#a855f7" strokeWidth="6" fill="transparent"
//                     strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - score / 100)} strokeLinecap="round" />
//                 </svg>
//                 <div className="absolute">
//                   <span className="text-5xl font-black text-white print:text-black block">{score}</span>
//                   <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">of 100</span>
//                 </div>
//               </div>
//               <div className="mt-6 flex gap-6 text-xs text-left w-full border-t border-white/[0.04] print:border-black/5 pt-4 px-2">
//                 <div><span className="text-slate-500 block">Relevance</span><span className="text-white print:text-black font-bold">{relevance}%</span></div>
//                 <div><span className="text-slate-500 block">Confidence</span><span className="text-purple-400 font-bold">{confidence}%</span></div>
//               </div>
//             </div>

//             {/* Individual Role Core Skill Blocks */}
//             {hasDetailedAssessment && (
//               <div className="lg:col-span-2 grid md:grid-cols-2 gap-4 h-full print:col-span-2 print:grid-cols-2">
//                 {Object.entries(skillAssessment).map(([skill, sData], idx) => (
//                   <div key={idx} className="p-4 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm print:bg-slate-50 page-break-inside-avoid">
//                     <div className="flex justify-between items-start mb-2">
//                       <span className="text-xs font-bold tracking-wider text-slate-400 print:text-slate-700 uppercase">{skill.replace(/_/g, ' ')}</span>
//                       <span className="text-lg font-black text-indigo-400 print:text-indigo-600">
//                         {sData?.score !== undefined ? sData.score : (typeof sData === 'number' ? sData : 0)}
//                       </span>
//                     </div>
//                     <p className="text-xs text-slate-500 print:text-slate-600 leading-relaxed">
//                       {sData?.evidence || "Metric criterion verified successfully."}
//                     </p>
//                     <div className="w-full bg-white/5 print:bg-slate-200 h-1 rounded-full mt-3">
//                       <div 
//                         className="bg-indigo-500 h-1 rounded-full" 
//                         style={{ width: `${sData?.score !== undefined ? sData.score : (typeof sData === 'number' ? sData : 0)}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Strengths & Critical Gaps Lists */}
//           <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
//             <div className="p-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 print:border-emerald-600/20 space-y-4 print:bg-emerald-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {strengths.length === 0 ? <li>No explicit strengths logged.</li> : strengths.map((str, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">·</span><span>{str}</span></li>)}
//               </ul>
//             </div>
            
//             <div className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/10 print:border-red-600/20 space-y-4 print:bg-red-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-red-400 print:text-red-700 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Critical Gaps</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {criticalGaps.length === 0 ? <li>No core gaps identified.</li> : criticalGaps.map((gap, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">⚠</span><span>{gap}</span></li>)}
//               </ul>
//             </div>
//           </div>

//           {/* Tech Stack and Hiring Recommendation */}
//           {(techStack.length > 0 || hiringRecommendation) && (
//             <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
//               {techStack.length > 0 && (
//                 <div className="p-6 rounded-2xl bg-violet-500/[0.02] border border-violet-500/10 print:border-violet-600/20 space-y-4 print:bg-violet-50/30 page-break-inside-avoid">
//                   <h3 className="text-sm font-bold text-violet-400 print:text-violet-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Tech Stack</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {techStack.map((tech, index) => (
//                       <span key={index} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-200 print:bg-white print:border-black/10 print:text-slate-800">
//                         {tech}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {hiringRecommendation && (
//                 <div className="p-6 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 print:border-amber-600/20 space-y-4 print:bg-amber-50/30 page-break-inside-avoid">
//                   <h3 className="text-sm font-bold text-amber-400 print:text-amber-700 uppercase tracking-widest flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Hiring Recommendation</h3>
//                   <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed font-bold">{hiringRecommendation}</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Next Steps Hiring Strategy Pipeline */}
//           {nextSteps.length > 0 && (
//             <div className="p-6 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10 print:border-blue-600/20 space-y-4 print:bg-blue-50/30 page-break-inside-avoid">
//               <h3 className="text-sm font-bold text-blue-400 print:text-blue-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Next Steps for Hiring</h3>
//               <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
//                 {nextSteps.map((step, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span><span>{step}</span></li>)}
//               </ul>
//             </div>
//           )}

//           {/* Detailed Feedback Text */}
//           <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm space-y-2 print:bg-slate-50 page-break-inside-avoid">
//             <h3 className="text-xs font-bold text-indigo-400 print:text-indigo-600 tracking-wider uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Detailed Feedback</h3>
//             <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed whitespace-pre-wrap">{feedbackText}</p>
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }





import React, { useEffect, useState } from 'react';
import { 
  Download, RefreshCw, ArrowLeft, CheckCircle2, 
  AlertTriangle, TrendingUp, Target, Mail, Loader, CheckCircle, XCircle, X
} from 'lucide-react';

function toTitleCase(value) {
  if (!value) return '';
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Email base key filter handler to show dynamic raw subject name from address
function extractNameFromEmail(email) {
  if (!email) return 'Candidate';
  const namePart = email.split('@')[0];
  // Remove special separating characters from internal org addresses
  const cleanName = namePart.replace(/[._-]+/g, ' ');
  return toTitleCase(cleanName);
}

function cleanDisplayName(value) {
  return value
    .replace(/\.[^.]+$/, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\b(resume|cv|prework|pre work|project|report|final|candidate|document|portfolio)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function inferSubjectName(type, uploadData, emailAddress) {
  if (emailAddress) {
    return extractNameFromEmail(emailAddress);
  }
  const fileName = uploadData?.file?.name || uploadData?.fileName || '';
  if (!fileName && type === 'repo') {
    return 'Repository';
  }
  const cleanedFileName = cleanDisplayName(fileName);
  return cleanedFileName ? toTitleCase(cleanedFileName) : 'Candidate';
}

function buildReportTitle(type, uploadData, emailAddress) {
  const typeLabelMap = { resume: 'Resume', prework: 'Pre-Work', repo: 'Repository' };
  const typeLabel = typeLabelMap[type] || 'Report';
  const subjectName = inferSubjectName(type, uploadData, emailAddress);

  return subjectName === 'Candidate'
    ? `Your ${typeLabel} Report`
    : `${subjectName}'s ${typeLabel} Report`;
}

function parseRawResponseTrack(rawResponse) {
  if (!rawResponse) return null;
  if (typeof rawResponse === 'string') {
    try {
      rawResponse = JSON.parse(rawResponse);
    } catch {
      return null;
    }
  }
  if (typeof rawResponse !== 'object' || rawResponse === null) return null;
  if (rawResponse.track) return rawResponse.track;
  if (rawResponse.raw_response) return parseRawResponseTrack(rawResponse.raw_response);
  return null;
}

function getSubmissionTrack(submission) {
  return (
    submission.track ||
    parseRawResponseTrack(submission.raw_response) ||
    'ai'
  ).toString().toLowerCase();
}

function getSubmissionRoleLabel(submission) {
  const track = getSubmissionTrack(submission);
  if (track === 'ml') return 'ML Engineer';
  if (track === 'fullstack') return 'Full Stack';
  return 'AI Engineer';
}

function getPayloadTrack(payload, submission) {
  return (
    parseRawResponseTrack(payload) ||
    submission?.track ||
    parseRawResponseTrack(submission?.raw_response) ||
    'ai'
  ).toString().toLowerCase();
}

function formatTrackLabel(track) {
  if (!track) return 'Full Stack Developer';
  if (track.toLowerCase() === 'ai') return 'AI Engineer';
  if (track.toLowerCase() === 'ml') return 'ML Engineer';
  if (track.toLowerCase() === 'fullstack') return 'Full Stack Developer';
  return `${toTitleCase(track)} Engineer`;
}

export default function Dashboard({ data, onReset, onTryAgain, type, uploadData, track }) {
  // --- STATES ---
  const [emailSubmissions, setEmailSubmissions] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [isProcessingEmails, setIsProcessingEmails] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  const [selectedEvaluation, setSelectedEvaluation] = useState(data || null);
  const [activeReportMeta, setActiveReportMeta] = useState({ 
    type: type || 'prework', 
    uploadData: uploadData || { file: { name: 'Candidate Submission' } }, 
    track: track || 'fullstack',
    candidateEmail: null // Email reference track state mapping
  });
  
  const [viewMode, setViewMode] = useState(data ? 'report' : 'list');

  const BASE_URL = import.meta.env.NG_API_URL || window.location.origin;

  const fetchEmailSubmissions = async () => {
    try {
      setDbLoading(true);
      const res = await fetch(`${BASE_URL}/api/email-submissions`);
      if (!res.ok) throw new Error('Database network failure');
      const logs = await res.json();
      setEmailSubmissions(logs);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setDbLoading(false);
    }
  };

  useEffect(() => {
    fetchEmailSubmissions();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const handleProcessEmails = async () => {
    setIsProcessingEmails(true);
    setProcessingMessage('Scanning Gmail for new pre-work submissions...');
    setToast(null);

    try {
      const res = await fetch(`${BASE_URL}/api/process-emails`, { method: 'POST' });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.detail || 'Email processing failed');
      setProcessingMessage(payload.message || 'Processing complete.');
      setToast({
        type: 'success',
        message: payload.message || 'New pre-work emails were processed successfully.'
      });
      await fetchEmailSubmissions();
    } catch (err) {
      console.error('Failed to process emails:', err);
      setProcessingMessage(err.message || 'Unable to process emails right now.');
      setToast({
        type: 'error',
        message: err.message || 'Unable to process emails right now.'
      });
    } finally {
      setIsProcessingEmails(false);
    }
  };

  // MASTER DATA PARSING CONTROLLER
  const handleSelectEmailReport = (submission) => {
    console.log("[DEBUG] Clicked submission row structure:", submission);

    if (submission.status === 'Completed' || submission.overall_score > 0) {
      let payload = submission.raw_response;
      
      if (typeof payload === 'string') {
        try {
          payload = JSON.parse(payload);
        } catch (e) {
          console.error("String JSON parse crash:", e);
        }
      }

      if (payload && payload.raw_response) {
        payload = typeof payload.raw_response === 'string'
          ? JSON.parse(payload.raw_response)
          : payload.raw_response;
      }

      const activePayload = payload || submission;
      console.log("[DEBUG] Final Clean AI Object Resolved:", activePayload);

      setSelectedEvaluation(activePayload);
      setActiveReportMeta({
        type: 'prework', 
        track: getPayloadTrack(activePayload, submission),
        uploadData: { fileName: submission.file_name || 'Pre-Work' },
        candidateEmail: submission.candidate_email // Pass user email address down
      });
      setViewMode('report');
    } else {
      alert(`Cannot view details. Current Status: ${submission.status}`);
    }
  };

  const getCleanEvaluation = () => {
    let target = selectedEvaluation || data;
    if (!target) return {};
    
    if (target.feedback || target.strengths || target.overall_score) {
      return target;
    }
    
    if (target.raw_response) {
      return typeof target.raw_response === 'string'
        ? JSON.parse(target.raw_response)
        : target.raw_response;
    }
    return target;
  };

  const evaluation = getCleanEvaluation();

  // --- SAFE PROPERTIES EXTRACTION ---
  const score = Number(evaluation?.overall_score || evaluation?.score || selectedEvaluation?.overall_score || 0);
  const relevance = Number(evaluation?.relevance !== undefined ? evaluation.relevance : (selectedEvaluation?.relevance || 0));
  const confidence = Number(evaluation?.confidence !== undefined ? evaluation.confidence : (selectedEvaluation?.confidence || 0));
  const feedbackText = evaluation?.feedback || selectedEvaluation?.feedback || "No narrative evaluation summary logged.";
  const hiringRecommendation = evaluation?.hiring_recommendation || selectedEvaluation?.hiring_recommendation || "Low";

  const strengths = Array.isArray(evaluation?.strengths) && evaluation.strengths.length > 0 ? evaluation.strengths : 
                    (Array.isArray(selectedEvaluation?.strengths) ? selectedEvaluation.strengths : []);

  const criticalGaps = Array.isArray(evaluation?.critical_gaps) && evaluation.critical_gaps.length > 0 ? evaluation.critical_gaps : 
                       (Array.isArray(selectedEvaluation?.critical_gaps) && selectedEvaluation.critical_gaps.length > 0 ? selectedEvaluation.critical_gaps : 
                       (Array.isArray(evaluation?.weaknesses) ? evaluation.weaknesses : []));

  const nextSteps = Array.isArray(evaluation?.next_steps_to_hire) ? evaluation.next_steps_to_hire : [];
  const techStack = Array.isArray(evaluation?.tech_stack) ? evaluation.tech_stack : [];
  
  const skillAssessment = evaluation?.skill_assessment || selectedEvaluation?.skill_assessment || {};
  const hasDetailedAssessment = typeof skillAssessment === 'object' && Object.keys(skillAssessment).length > 0;

  // Render configuration bindings
  const reportTitle = buildReportTitle(activeReportMeta.type, activeReportMeta.uploadData, activeReportMeta.candidateEmail);
  const trackLabel = formatTrackLabel(activeReportMeta.track);

  const filteredSubmissions = emailSubmissions.filter((sub) => {
    const roleLabel = getSubmissionRoleLabel(sub).toLowerCase();
    const candidateName = extractNameFromEmail(sub.candidate_email).toLowerCase();
    const email = (sub.candidate_email || '').toLowerCase();
    const submissionDate = new Date(sub.submission_date);
    const formattedDate = submissionDate.toLocaleDateString('en-IN').toLowerCase();
    const scoreText = (sub.overall_score || '').toString().toLowerCase();
    const searchableText = [candidateName, roleLabel, email, formattedDate, scoreText, sub.file_name || '', sub.status || '']
      .join(' ');

    const matchesSearch = !searchTerm || searchableText.includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || roleLabel.toLowerCase() === roleFilter.toLowerCase();

    let matchesDate = true;
    if (dateFilter !== 'all' && submissionDate instanceof Date && !Number.isNaN(submissionDate.getTime())) {
      const now = new Date();
      const diffHours = (now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60);
      if (dateFilter === '24h') matchesDate = diffHours <= 24;
      if (dateFilter === '3d') matchesDate = diffHours <= 72;
      if (dateFilter === '7d') matchesDate = diffHours <= 168;
    } else if (dateFilter !== 'all') {
      matchesDate = false;
    }

    return matchesSearch && matchesRole && matchesDate;
  });

  const handleDownloadReport = () => {
    const originalTitle = document.title;
    document.title = `SkillCheck_${trackLabel.replace(/\s+/g, '_')}_${reportTitle.replace(/\s+/g, '_')}_${score}_Score`;
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="w-full text-left space-y-10 animate-fade-in print:p-8 print:bg-white print:text-black">
      {toast && (
        <div className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur ${toast.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-red-500/30 bg-red-500/10 text-red-200'}`}>
          {toast.type === 'success' ? (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <div className="flex-1">
            <p className="text-sm font-semibold">{toast.type === 'success' ? 'Processing finished' : 'Processing failed'}</p>
            <p className="mt-1 text-sm text-slate-200/90">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-full p-1 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {/* VIEW MODE 1: MASTER LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4 w-full">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Automated Candidate Submissions Inbox</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleProcessEmails}
                disabled={isProcessingEmails}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                {isProcessingEmails ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                {isProcessingEmails ? 'Processing...' : 'Process New Pre-Work Emails'}
              </button>
              <span className="text-xs text-slate-400">{processingMessage || 'Checks Gmail for new pre-work submissions and updates the inbox.'}</span>
            </div>
          </div>
          
          {dbLoading ? (
            <div className="flex items-center gap-2 text-slate-400 p-12 justify-center bg-[#0b0f19]/40 rounded-xl border border-white/[0.04]">
              <Loader className="w-5 h-5 animate-spin text-indigo-400" />
              <span className="text-sm font-semibold">Syncing evaluation engine database records...</span>
            </div>
          ) : emailSubmissions.length === 0 ? (
            <div className="text-sm text-slate-500 p-12 text-center bg-[#0b0f19]/40 rounded-xl border border-white/[0.04]">
              No email submissions scanned yet. Send an email with subject 'Pre-Work Submission' to parse live data.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#0b0f19]/50 p-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, role, mail, date, score..."
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0b0f19]/80 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 md:max-w-xs"
                  />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="rounded-lg border border-white/[0.08] bg-[#0b0f19]/80 px-3 py-2 text-sm text-slate-200 outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="AI Engineer">AI Engineer</option>
                    <option value="ML Engineer">ML Engineer</option>
                    <option value="Full Stack">Full Stack</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="rounded-lg border border-white/[0.08] bg-[#0b0f19]/80 px-3 py-2 text-sm text-slate-200 outline-none"
                  >
                    <option value="all">All Dates</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="3d">Last 3 Days</option>
                    <option value="7d">Last 7 Days</option>
                  </select>
                </div>
                <div className="text-sm text-slate-400">
                  Showing {filteredSubmissions.length} of {emailSubmissions.length} submissions
                </div>
              </div>

              <div className="bg-[#0b0f19]/60 border border-white/[0.06] rounded-xl overflow-x-auto shadow-2xl w-full">
                {filteredSubmissions.length === 0 ? (
                  <div className="p-10 text-center text-sm text-slate-500">
                    No submissions match the current filters.
                  </div>
                ) : (
                  <table className="w-full text-xs text-slate-300 border-collapse table-auto min-w-[900px]">
                <thead className="bg-white/5 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/[0.06]">
                  <tr>
                    <th className="p-4 text-left">Candidate</th>
                    <th className="p-4 text-left">Email Address</th>
                    <th className="p-4 text-left">Track</th>
                    <th className="p-4 text-left">Attached File</th>
                    <th className="p-4 text-left">Processed Date</th>
                    <th className="p-4 text-center">Score</th>
                    <th className="p-4 text-left">Status Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Fixed: Extracting cleanly mapped name string directly from candidate email address */}
                      <td className="p-4 font-semibold text-white text-sm">
                        {extractNameFromEmail(sub.candidate_email)}
                      </td>
                      <td className="p-4 text-slate-400 text-sm">{sub.candidate_email}</td>
                      {/* New Column: Dynamic Track Badge Field */}
                      <td className="p-4 text-sm font-medium text-slate-200">
                        <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {formatTrackLabel(getSubmissionTrack(sub))}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-indigo-300">{sub.file_name}</td>
                      <td className="p-4 text-slate-500">{new Date(sub.submission_date).toLocaleString('en-IN')}</td>
                      <td className="p-4 text-center font-bold text-base text-purple-400">
                        {sub.status === 'Completed' ? `${sub.overall_score}` : '—'}
                      </td>
                      <td className="p-4">
                        {sub.status === 'Completed' ? (
                          <button 
                            onClick={() => handleSelectEmailReport(sub)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-indigo-600/10 text-xs"
                          >
                            <CheckCircle className="w-4 h-4" /> View Report
                          </button>
                        ) : sub.status.includes('Failed') ? (
                          <span className="flex items-center gap-1 text-red-400 font-semibold px-2">
                            <XCircle className="w-4 h-4" /> Error Logged
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-400 font-semibold animate-pulse px-2">
                            <Loader className="w-4 h-4 animate-spin" /> Evaluating
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: HIGH FIDELITY CANDIDATE REPORT VIEW */}
      {viewMode === 'report' && (
        <div className="space-y-8 animate-fade-in w-full">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] print:border-black/10 pb-6 print:mb-6">
            <div>
              <span className="text-xs bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full text-indigo-400 font-semibold tracking-wide print:hidden">
                AI SkillCheck Report Evaluated Successfully
              </span>
              <h1 className="text-4xl font-black text-white print:text-black tracking-tight mt-2">{reportTitle}</h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wider text-slate-300 print:border-black/10 print:bg-slate-100 print:text-slate-700">
                <span className="text-slate-500 uppercase">Track Selected</span>
                <span className="text-white print:text-black">{trackLabel}</span>
              </div>
            </div>
            
            <div className="flex gap-3 print:hidden">
              <button 
                onClick={handleDownloadReport} 
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"
              >
                <Download className="w-4 h-4" /> Download Report
              </button>
              
              {data ? (
                <>
                  <button onClick={onTryAgain} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-xl text-sm font-medium transition-colors cursor-pointer text-white"><RefreshCw className="w-4 h-4" /> Try Again</button>
                  <button onClick={onReset} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-colors cursor-pointer text-white"><ArrowLeft className="w-4 h-4" /> Back</button>
                </>
              ) : (
                <button 
                  onClick={() => setViewMode('list')} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600 border border-red-500/30 text-red-300 hover:text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-red-600/10"
                >
                  <X className="w-4 h-4" /> Close Report View
                </button>
              )}
            </div>
          </div>

          {/* Graphical Progress Metrics */}
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
                <div><span className="text-slate-500 block">Relevance</span><span className="text-white print:text-black font-bold">{relevance}%</span></div>
                <div><span className="text-slate-500 block">Confidence</span><span className="text-purple-400 font-bold">{confidence}%</span></div>
              </div>
            </div>

            {/* Individual Role Core Skill Blocks */}
            {hasDetailedAssessment && (
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-4 h-full print:col-span-2 print:grid-cols-2">
                {Object.entries(skillAssessment).map(([skill, sData], idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm print:bg-slate-50 page-break-inside-avoid">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold tracking-wider text-slate-400 print:text-slate-700 uppercase">{skill.replace(/_/g, ' ')}</span>
                      <span className="text-lg font-black text-indigo-400 print:text-indigo-600">
                        {sData?.score !== undefined ? sData.score : (typeof sData === 'number' ? sData : 0)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 print:text-slate-600 leading-relaxed">
                      {sData?.evidence || "Metric criterion verified successfully."}
                    </p>
                    <div className="w-full bg-white/5 print:bg-slate-200 h-1 rounded-full mt-3">
                      <div 
                        className="bg-indigo-500 h-1 rounded-full" 
                        style={{ width: `${sData?.score !== undefined ? sData.score : (typeof sData === 'number' ? sData : 0)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strengths & Critical Gaps Lists */}
          <div className="grid md:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="p-6 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 print:border-emerald-600/20 space-y-4 print:bg-emerald-50/30 page-break-inside-avoid">
              <h3 className="text-sm font-bold text-emerald-400 print:text-emerald-700 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h3>
              <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
                {strengths.length === 0 ? <li>No explicit strengths logged.</li> : strengths.map((str, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 font-bold mt-0.5">·</span><span>{str}</span></li>)}
              </ul>
            </div>
            
            <div className="p-6 rounded-2xl bg-red-500/[0.02] border border-red-500/10 print:border-red-600/20 space-y-4 print:bg-red-50/30 page-break-inside-avoid">
              <h3 className="text-sm font-bold text-red-400 print:text-red-700 uppercase tracking-widest flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Critical Gaps</h3>
              <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
                {criticalGaps.length === 0 ? <li>No core gaps identified.</li> : criticalGaps.map((gap, i) => <li key={i} className="flex items-start gap-2"><span className="text-red-500 font-bold mt-0.5">⚠</span><span>{gap}</span></li>)}
              </ul>
            </div>
          </div>

          {/* Tech Stack and Hiring Recommendation */}
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
                  <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed font-bold">{hiringRecommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* Next Steps Hiring Strategy Pipeline */}
          {nextSteps.length > 0 && (
            <div className="p-6 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10 print:border-blue-600/20 space-y-4 print:bg-blue-50/30 page-break-inside-avoid">
              <h3 className="text-sm font-bold text-blue-400 print:text-blue-700 uppercase tracking-widest flex items-center gap-2"><Target className="w-4 h-4" /> Next Steps for Hiring</h3>
              <ul className="space-y-2 text-sm text-slate-300 print:text-slate-800">
                {nextSteps.map((step, i) => <li key={i} className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">→</span><span>{step}</span></li>)}
              </ul>
            </div>
          )}

          {/* Detailed Feedback Text */}
          <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] print:border-black/10 backdrop-blur-sm space-y-2 print:bg-slate-50 page-break-inside-avoid">
            <h3 className="text-xs font-bold text-indigo-400 print:text-indigo-600 tracking-wider uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Detailed Feedback</h3>
            <p className="text-sm text-slate-300 print:text-slate-800 leading-relaxed whitespace-pre-wrap">{feedbackText}</p>
          </div>

        </div>
      )}
    </div>
  );
}