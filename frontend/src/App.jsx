import { useState } from 'react';
import Navbar from './components/Navbar';
import TrackSelection from './pages/TrackSelection';
import TypeSelection from './pages/TypeSelection';
import UploadPage from './pages/UploadPage';
import ProcessingView from './pages/ProcessingView';
import Dashboard from './pages/Dashboard';
import ConfigPage from './pages/ConfigPage';

function App() {
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState('');
  const [type, setType] = useState('');
  const [uploadData, setUploadData] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Lightweight path-based routing (no router dependency).
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const isConfig = path === '/config';

  const handleTryAgain = () => {
    setUploadData(null);
    setEvaluationResult(null);
    setStep(3);
  };

  const handleGlobalReset = () => {
    setTrack('');
    setType('');
    setUploadData(null);
    setEvaluationResult(null);
    setStep(1);
  };

  const goHome = () => { window.location.href = '/'; };

  return (
    <div className="min-h-screen bg-[#030712] bg-grid-pattern text-white font-sans antialiased flex flex-col relative select-none print:bg-white print:text-black">

      <div className="print:hidden">
        <Navbar currentStep={step} showTimeline={!isConfig} onLogoClick={isConfig ? goHome : handleGlobalReset} />
      </div>

      <main className="flex-1 flex items-center justify-center w-full py-10 px-6 md:px-16 print:py-0 print:px-0">
        <div className="w-full max-w-[1400px] flex justify-center">
          {isConfig && <ConfigPage />}
          {!isConfig && step === 1 && <TrackSelection onNext={(t) => { setTrack(t); setStep(2); }} />}
          {!isConfig && step === 2 && <TypeSelection onNext={(ty) => { setType(ty); setStep(3); }} onBack={() => setStep(1)} selectedTrack={track} />}
          {!isConfig && step === 3 && <UploadPage onNext={(data) => { setUploadData(data); setStep(4); }} onBack={() => setStep(2)} selectedTrack={track} selectedType={type} />}
          {!isConfig && step === 4 && <ProcessingView track={track} type={type} uploadData={uploadData} onComplete={(result) => { setEvaluationResult(result); setStep(5); }} />}
          {!isConfig && step === 5 && (
            <Dashboard 
              data={evaluationResult} 
              type={type}
              uploadData={uploadData}
              track={track}
              onTryAgain={handleTryAgain} 
              onReset={handleGlobalReset} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;