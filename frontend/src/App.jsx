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
  const [uploadData, setUploadData] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null); 

  const timelineSteps = [
    { id: 1, label: 'Track' },
    { id: 2, label: 'Type' },
    { id: 3, label: 'Upload' },
    { id: 4, label: 'Analyze' },
    { id: 5, label: 'Results' }
  ];

  // FUNCTIONALITY 2: Clear historical buffers and safely route backward to step 3 workspace
  const handleTryAgain = () => {
    setUploadData(null);
    setEvaluationResult(null);
    setStep(3); 
  };

  return (
    <div className="min-h-screen bg-[#030712] bg-grid-pattern text-white font-sans antialiased flex flex-col relative select-none print:bg-white print:text-black">
      
      {/* Hidden layout tracker blocks during document printing sequences */}
      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="w-full flex justify-center mt-6 print:hidden">
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

      <main className="flex-1 flex items-center justify-center w-full py-10 px-6 md:px-16 print:py-0 print:px-0">
        <div className="w-full max-w-[1400px] flex justify-center">
          {step === 1 && <TrackSelection onNext={(t) => { setTrack(t); setStep(2); }} />}
          {step === 2 && <TypeSelection onNext={(ty) => { setType(ty); setStep(3); }} onBack={() => setStep(1)} selectedTrack={track} />}
          {step === 3 && <UploadPage onNext={(data) => { setUploadData(data); setStep(4); }} onBack={() => setStep(2)} selectedTrack={track} selectedType={type} />}
          {step === 4 && <ProcessingView track={track} type={type} uploadData={uploadData} onComplete={(result) => { setEvaluationResult(result); setStep(5); }} />}
          {step === 5 && (
            <Dashboard 
              data={evaluationResult} 
              onTryAgain={handleTryAgain} // Connected safe handler route
              onReset={() => { setTrack(''); setType(''); setUploadData(null); setEvaluationResult(null); setStep(1); }} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;