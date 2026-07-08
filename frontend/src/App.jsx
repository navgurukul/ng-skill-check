// import { useState } from 'react';
// import Navbar from './components/Navbar';
// import TrackSelection from './pages/TrackSelection';
// import TypeSelection from './pages/TypeSelection';
// import UploadPage from './pages/UploadPage';
// import ProcessingView from './pages/ProcessingView';
// import Dashboard from './pages/Dashboard';

// function App() {
//   const [step, setStep] = useState(1);
//   const [track, setTrack] = useState('');
//   const [type, setType] = useState('');
//   const [uploadData, setUploadData] = useState(null);
//   const [evaluationResult, setEvaluationResult] = useState(null); 

//   const handleTryAgain = () => {
//     setUploadData(null);
//     setEvaluationResult(null);
//     setStep(3); 
//   };

//   const handleGlobalReset = () => {
//     setTrack('');
//     setType('');
//     setUploadData(null);
//     setEvaluationResult(null);
//     setStep(1);
//   };

//   return (
//     <div className="min-h-screen bg-[#030712] bg-grid-pattern text-white font-sans antialiased flex flex-col relative select-none print:bg-white print:text-black">
      
//       <div className="print:hidden">
//         <Navbar currentStep={step} onLogoClick={handleGlobalReset} />
//       </div>

//       <main className="flex-1 flex items-center justify-center w-full py-10 px-6 md:px-16 print:py-0 print:px-0">
//         <div className="w-full max-w-[1400px] flex justify-center">
//           {step === 1 && <TrackSelection onNext={(t) => { setTrack(t); setStep(2); }} />}
//           {step === 2 && <TypeSelection onNext={(ty) => { setType(ty); setStep(3); }} onBack={() => setStep(1)} selectedTrack={track} />}
//           {step === 3 && <UploadPage onNext={(data) => { setUploadData(data); setStep(4); }} onBack={() => setStep(2)} selectedTrack={track} selectedType={type} />}
//           {step === 4 && <ProcessingView track={track} type={type} uploadData={uploadData} onComplete={(result) => { setEvaluationResult(result); setStep(5); }} />}
//           {step === 5 && (
//             <Dashboard 
//               data={evaluationResult} 
//               type={type}
//               uploadData={uploadData}
//               track={track}
//               onTryAgain={handleTryAgain} 
//               onReset={handleGlobalReset} 
//             />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;



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

  const handleOpenEmailDashboard = () => {
    setStep(5); // Jump straight to the dashboard list view mode
  };

  return (
    <div className="min-h-screen bg-[#030712] bg-grid-pattern text-white font-sans antialiased flex flex-col relative select-none print:bg-white print:text-black">
      
      {/* 1. Navbar Container (Corner Button Removed) */}
      <div className="print:hidden relative">
        <Navbar currentStep={step} onLogoClick={handleGlobalReset} />
      </div>

      {/* 2. Main Routing Section */}
      <main className="flex-1 flex items-center justify-center w-full py-10 px-6 md:px-16 print:py-0 print:px-0">
        <div className="w-full max-w-[1400px] flex flex-col items-center justify-center gap-6">
          
          {/* STEP 1 Layer: Buttons Layout Override */}
          {step === 1 && (
            <div className="w-full flex flex-col items-center justify-center gap-8">
              {/* Core standard tracks screen selection component */}
              <TrackSelection onNext={(t) => { setTrack(t); setStep(2); }} />
              
              {/* Separator Divider Lines */}
              <div className="flex items-center gap-4 my-2 w-full max-w-md print:hidden">
                <div className="h-[1px] bg-white/10 flex-1"></div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Or Monitor</span>
                <div className="h-[1px] bg-white/10 flex-1"></div>
              </div>

              {/* Seamlessly Integrated Inbox Action Controls */}
              <button 
                onClick={handleOpenEmailDashboard}
                className="px-8 py-3.5 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 hover:text-white text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-indigo-600/20 flex items-center gap-2 tracking-wide"
              >
                📬 View Automated Email Submissions
              </button>
            </div>
          )}

          {/* Standard step wizard fallbacks */}
          {step === 2 && <TypeSelection onNext={(ty) => { setType(ty); setStep(3); }} onBack={() => setStep(1)} selectedTrack={track} />}
          {step === 3 && <UploadPage onNext={(data) => { setUploadData(data); setStep(4); }} onBack={() => setStep(2)} selectedTrack={track} selectedType={type} />}
          {step === 4 && <ProcessingView track={track} type={type} uploadData={uploadData} onComplete={(result) => { setEvaluationResult(result); setStep(5); }} />}
          
          {step === 5 && (
            <Dashboard 
              data={evaluationResult} 
              type={type || 'prework'} 
              uploadData={uploadData}
              track={track || 'fullstack'} 
              onTryAgain={handleTryAgain} 
              onReset={handleGlobalReset} 
              onBackToInbox={handleGlobalReset}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;