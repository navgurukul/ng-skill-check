import React, { useEffect, useState } from 'react';

export default function ProcessingView({ track, type, uploadData, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const steps = [
    { label: "Extracting PDF content", minProgress: 0 },
    { label: "Understanding context", minProgress: 25 },
    { label: "Checking skills & concepts", minProgress: 50 },
    { label: "Matching career track", minProgress: 75 },
    { label: "Generating feedback", minProgress: 90 }
  ];

  useEffect(() => {
    // Smooth loader ticker logic running safely up to 92%
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 92 ? prev + 1 : prev)); 
    }, 150);

    const runEvaluationPipeline = async () => {
      const formData = new FormData();
      formData.append("track", track);
      formData.append("evaluation_type", type);
      
      if (type === 'repo') {
        formData.append("repo_url", uploadData.repoUrl);
      } else {
        formData.append("file", uploadData.file);
      }

      try {
        const response = await fetch("http://localhost:8000/api/evaluate", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("DeepSeek Engine returned an empty stack verification pattern.");
        
        const deepseekResult = await response.json();
        
        setProgress(100);
        clearInterval(interval);
        
        setTimeout(() => onComplete(deepseekResult), 600);

      } catch (err) {
        setError(err.message || "Failed connecting to local execution thread.");
        clearInterval(interval);
      }
    };

    runEvaluationPipeline();
    return () => clearInterval(interval);
  }, [track, type, uploadData, onComplete]);

  if (error) {
    return (
      <div className="text-center p-8 bg-red-500/5 border border-red-500/20 rounded-2xl max-w-md backdrop-blur-md">
        <h3 className="text-lg font-bold text-red-400 mb-1">Evaluation Failed</h3>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer">Retry Session</button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-16 py-12 px-4">
      <div className="relative w-56 h-56 flex items-center justify-center bg-slate-900/20 rounded-full border border-white/[0.02]">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.02)" strokeWidth="4" fill="transparent" />
          <circle cx="50" cy="50" r="44" stroke="#a855f7" strokeWidth="4" fill="transparent"
            strokeDasharray={2 * Math.PI * 44}
            strokeDashoffset={2 * Math.PI * 44 * (1 - progress / 100)}
            strokeLinecap="round" className="transition-all duration-150 ease-out" />
        </svg>
        <div className="absolute text-center">
          <span className="text-4xl font-black text-white block">{progress}%</span>
          <span className="text-[10px] text-slate-500 tracking-widest uppercase font-bold mt-1 block">Analyzing</span>
        </div>
      </div>

      <div className="flex-1 w-full max-w-xl space-y-4 text-left">
        <h2 className="text-4xl font-black tracking-tight mb-1">Running <span className="text-indigo-400">AI evaluation</span></h2>
        <p className="text-sm text-slate-400 mb-8">Our model is reading your document, scoring against the track rubric and composing personalized feedback.</p>
        
        <div className="space-y-3">
          {steps.map((st, i) => {
            const isDone = progress > st.minProgress + 15 || progress === 100;
            const isActive = progress >= st.minProgress && !isDone;
            
            return (
              <div key={i} className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${isDone ? 'bg-slate-900/40 border-white/[0.04] text-slate-300' : isActive ? 'bg-indigo-600/5 border-indigo-500/30 text-white shadow-[0_0_15px_rgba(99,102,241,0.05)]' : 'bg-transparent border-transparent text-slate-600'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${isDone ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' : isActive ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 animate-spin' : 'border-slate-800'}`}>
                  {isDone ? '✓' : isActive ? '⟳' : ''}
                </div>
                <span className="text-sm font-medium">{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}