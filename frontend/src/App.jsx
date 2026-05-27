import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TrackSelection from './pages/TrackSelection';
import TypeSelection from './pages/TypeSelection';
import UploadPage from './pages/UploadPage';
import ProcessingView from './pages/ProcessingView';
import Dashboard from './pages/Dashboard';

function App() {
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState('');
  const [type, setType] = useState(''); 

  const timelineSteps = [
    { id: 1, label: 'Track' },
    { id: 2, label: 'Type' },
    { id: 3, label: 'Upload' },
    { id: 4, label: 'Analyze' },
    { id: 5, label: 'Results' }
  ];

  return (
    <div className="min-h-screen bg-[#030712] bg-grid-pattern text-white font-sans antialiased flex flex-col relative select-none">
      <Navbar />

      <div className="w-full flex justify-center mt-6">
        <div className="flex items-center gap-2 bg-slate-900/40 border border-white/[0.06] px-4 py-1.5 rounded-full backdrop-blur-md text-xs">
          {timelineSteps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${step === s.id ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 font-bold' : 'text-slate-500'}`}>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step >= s.id ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800'}`}>{s.id}</span>
                <span>{s.label}</span>
              </div>
              {idx < timelineSteps.length - 1 && <span className="text-slate-700">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center w-full py-10 px-6 md:px-16">
        <div className="w-full max-w-[1400px] flex justify-center">
          {step === 1 && <TrackSelection onNext={(t) => { setTrack(t); setStep(2); }} />}
          {step === 2 && <TypeSelection onNext={(ty) => { setType(ty); setStep(3); }} onBack={() => setStep(1)} selectedTrack={track} />}
          {step === 3 && <UploadPage onNext={() => setStep(4)} onBack={() => setStep(2)} selectedTrack={track} selectedType={type} />}
          {step === 4 && <ProcessingView onComplete={() => setStep(5)} />}
          {step === 5 && <Dashboard onReset={() => { setTrack(''); setType(''); setStep(1); }} />}
        </div>
      </main>
    </div>
  );
}

export default App;