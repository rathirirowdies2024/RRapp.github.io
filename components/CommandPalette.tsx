
import React, { useState, useEffect } from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-xl bg-white border border-gray-200 shadow-3xl rounded-2xl overflow-hidden"
          >
            <div className="flex items-center px-6 py-4 border-b border-gray-50">
              <Search className="text-gray-400 mr-4" size={20} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search archives, settings, creators..."
                className="w-full bg-transparent outline-none text-lg font-medium"
              />
              <div className="flex items-center space-x-1 ml-4 px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-400">
                <Command size={10} /> <span>K</span>
              </div>
            </div>

            <div className="p-4 space-y-2 max-h-96 overflow-auto">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Suggestions</p>
              
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl group transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    <ArrowRight size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">The Art of Minimal Design</p>
                    <p className="text-xs text-gray-400">Design • 5 min read</p>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
