import React from 'react';
import { Brain, Cpu, Code2, ArrowRight } from 'lucide-react';

export default function TrackSelection({ onNext }) {
  const tracks = [
    { id: 'ai', title: 'AI Engineer', subtitle: 'BUILD INTELLIGENT SYSTEMS', desc: 'Design, train and deploy production-grade AI systems powered by deep learning and large language models.', tags: ['LLMs', 'PyTorch', 'RAG', 'Prompting', 'Vector DBs'], icon: Brain, color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30' },
    { id: 'ml', title: 'ML Engineer', subtitle: 'FROM DATA TO DECISIONS', desc: 'Apply machine learning to real-world problems with rigorous experimentation, evaluation and deployment.', tags: ['Python', 'Scikit-learn', 'MLOps', 'Pandas', 'Statistics'], icon: Cpu, color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30' },
    { id: 'fullstack', title: 'Full Stack Developer', subtitle: 'SHIP END-TO-END PRODUCTS', desc: 'Craft beautiful interfaces and robust backends — own the entire product lifecycle with modern tooling.', tags: ['React', 'Node.js', 'TypeScript', 'SQL', 'APIs'], icon: Code2, color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' }
  ];

  return (
    <div className="w-full max-w-6xl px-4 py-12 text-center">
      <span className="text-xs font-semibold tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full text-indigo-300">
        ✨ AI Pre-work Evaluation · v1.0
      </span>
      <h1 className="text-4xl md:text-5xl font-black mt-6 mb-3">
        Choose Your <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">Career Track</span>
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto mb-12">
        Select the track you're preparing for. Our AI will tailor its evaluation to the skills, depth, and standards expected of that role.
      </p>

      <div className="grid md:grid-cols-3 gap-6 text-left mb-12">
        {tracks.map((track) => {
          const Icon = track.icon;
          return (
            <div 
              key={track.id}
              onClick={() => onNext(track.id)}
              className={`group relative p-6 rounded-2xl bg-gradient-to-b ${track.color} border backdrop-blur-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]`}
            >
              <div className="p-3 bg-white/10 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="text-xl font-bold mb-1 text-white">{track.title}</h3>
              <p className="text-[10px] tracking-wider text-indigo-400 font-bold mb-3">{track.subtitle}</p>
              <p className="text-sm text-slate-400 mb-6 line-clamp-3">{track.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {track.tags.map(t => (
                  <span key={t} className="text-xs bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md text-slate-300">{t}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




