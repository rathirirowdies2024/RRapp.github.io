
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Sparkles, Layout, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: "Welcome, Rowdy.",
    desc: "The archives are open. This is a minimal, performance-first sanctuary for night-time creators.",
    icon: <Sparkles className="text-white" size={48} />
  },
  {
    title: "Community Driven",
    desc: "React, discuss, and save posts to your private Reading List. Our community thrives on deep work and late-night insights.",
    icon: <Layout className="text-white" size={48} />
  },
  {
    title: "Built with Integrity",
    desc: "Secure authentication, high-performance edge rendering, and privacy by design. You're in good hands.",
    icon: <ShieldCheck className="text-white" size={48} />
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-12 text-center relative rounded-sm shadow-2xl"
      >
        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center"
          >
            <div className="mb-8 p-6 bg-white/5 rounded-full">
              {STEPS[step].icon}
            </div>
            <h2 className="text-4xl font-black mb-6 tracking-tight leading-none">{STEPS[step].title}</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-12">
              {STEPS[step].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col space-y-4">
          <button 
            onClick={next}
            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-sm hover:bg-white/90 transition-all flex items-center justify-center group"
          >
            {step === STEPS.length - 1 ? 'Start Browsing' : 'Next Insight'}
            <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex justify-center space-x-2">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-8 bg-white' : 'w-2 bg-white/10'}`} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
