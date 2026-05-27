import React, { useState } from 'react';
import { UploadCloud, File, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function UploadPage({ onNext, onBack, selectedTrack, selectedType }) {
  const [file, setFile] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');

  const isFormValid = selectedType === 'repo' ? repoUrl.trim().length > 10 : file !== null;

  const expectedSkillsList = {
    ai: ['Python', 'PyTorch', 'LangChain', 'Transformers', 'Vector DBs', 'Prompt Engineering'],
    ml: ['Python', 'scikit-learn', 'TensorFlow', 'Pandas', 'MLflow'],
    fullstack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'REST/GraphQL']
  };

  const skills = expectedSkillsList[selectedTrack] || [];

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 text-left items-start">
      <div className="flex-1 w-full">
        <div className="text-left mb-6">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group cursor-pointer">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span>Back</span>
          </button>
        </div>
        
        <h1 className="text-4xl font-black mb-2 tracking-tight">
          Upload your <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent capitalize">{selectedType === 'repo' ? 'GitHub Codebase' : `${selectedType} PDF`}</span>
        </h1>
        <p className="text-slate-400 text-sm mb-8">
          We'll analyze the document, check relevance to the <span className="capitalize text-white font-semibold">{selectedTrack} Engineer</span> track, and produce a detailed scorecard with feedback.
        </p>

        {selectedType === 'repo' ? (
          <div className="p-8 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/5 rounded-lg text-white">
                <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <label className="block text-sm font-bold text-white">Repository Target URL</label>
                <span className="text-xs text-slate-500">Provide a public link pointer for remote file retrieval</span>
              </div>
            </div>
            <input 
              type="url" 
              placeholder="https://github.com/username/project-repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 text-slate-200 transition-colors"
            />
          </div>
        ) : (
          <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center bg-[#0b0f19]/40 backdrop-blur-sm hover:border-indigo-500/40 transition-colors cursor-pointer relative group">
            <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
            <div className="p-4 bg-indigo-500/5 border border-white/5 rounded-2xl w-fit mx-auto mb-4 text-indigo-400 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-white font-medium mb-1 text-sm">Drop your PDF here</p>
            <p className="text-xs text-slate-500">or click to browse · PDF only · max 10MB</p>
          </div>
        )}

        {file && selectedType !== 'repo' && (
          <div className="mt-4 p-4 rounded-xl bg-[#0b0f19]/80 border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-sm text-white font-medium">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span> 
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-md font-bold flex items-center gap-1">✓ Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <button 
          disabled={!isFormValid}
          onClick={() => {
            if (selectedType === 'repo') {
              onNext({ repoUrl: repoUrl });
            } else {
              onNext({ file: file });
            }
          }}
          className={`w-full mt-6 py-3 px-6 rounded-xl font-bold text-sm tracking-wide text-white transition-all duration-300 ${isFormValid ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 shadow-xl shadow-indigo-600/10 cursor-pointer' : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5'}`}
        >
          <span>Start AI Evaluation</span>
        </button>
      </div>

      <div className="w-full lg:w-80 shrink-0 space-y-4">
        <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Evaluation Summary</h3>
          <div className="text-xs space-y-2 border-t border-white/[0.04] pt-2">
            <div className="flex justify-between"><span className="text-slate-500">Track</span><span className="text-white font-medium capitalize">{selectedTrack} Engineer</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="text-white font-medium capitalize">{selectedType} Evaluation</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Format</span><span className="text-white font-medium">{selectedType === 'repo' ? 'Source Link' : 'PDF · up to 10MB'}</span></div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-sm space-y-3">
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">Expected Skills</h3>
          <div className="flex flex-col gap-2 pt-1">
            {skills.map((sk) => (
              <div key={sk} className="flex items-center gap-2.5 text-xs text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-indigo-500/40" /> <span>{sk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}