
import React, { useState } from 'react';
import { ChevronRight, Repeat2, Bookmark, Crown, Zap, MousePointer2 } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "THE RESIDENT",
      desc: "All audio is curated by the Master Resident. You are witnessing a curated history of Rave.",
      icon: <Crown className="w-12 h-12 text-pink-500" />,
      color: "border-pink-500"
    },
    {
      title: "SYNC TO TIMELINE",
      desc: "Use the SYNC button (the arrows) to repost tracks to your own timeline. Let the world see your taste.",
      icon: <Repeat2 className="w-12 h-12 text-cyan-500" />,
      color: "border-cyan-500"
    },
    {
      title: "YOUR VAULT",
      desc: "Hit the VAULT button to save tracks to your private stash. Build the ultimate archive.",
      icon: <Bookmark className="w-12 h-12 text-yellow-500" />,
      color: "border-yellow-500"
    }
  ];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-xl flex items-center justify-center p-8">
      <div className={`w-full max-w-sm bg-zinc-900 border-2 ${steps[step].color} rounded-[3rem] p-10 shadow-[0_0_50px_rgba(0,0,0,1)] relative overflow-hidden animate-in zoom-in duration-300`}>
        {/* Animated Background Pulse */}
        <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 ${step === 0 ? 'bg-pink-500' : step === 1 ? 'bg-cyan-500' : 'bg-yellow-500'}`} />

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-8 animate-bounce">
            {steps[step].icon}
          </div>
          <h2 className="rave-font text-2xl text-white mb-4 tracking-tighter uppercase italic">{steps[step].title}</h2>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-10">{steps[step].desc}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-white' : 'w-2 bg-zinc-800'}`} />
              ))}
            </div>
            <button 
              onClick={next}
              className="bg-white text-black p-4 rounded-2xl flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">{step === steps.length - 1 ? 'Start Raving' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Indicator Overlay */}
      {step === 1 && (
        <div className="absolute right-6 bottom-44 animate-pulse pointer-events-none">
           <div className="flex items-center space-x-4 bg-cyan-500/10 border border-cyan-500/40 p-3 rounded-2xl backdrop-blur-md">
             <MousePointer2 className="w-6 h-6 text-cyan-400" />
             <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">SYNC HERE</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default Tutorial;
