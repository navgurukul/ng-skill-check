import { useState } from 'react';
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

  return (
    <div className="min-h-screen bg-[#030712] bg-grid-pattern text-white font-sans antialiased flex flex-col relative select-none print:bg-white print:text-black">
      
      <div className="print:hidden">
        <Navbar currentStep={step} onLogoClick={handleGlobalReset} />
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