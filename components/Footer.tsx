
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <p className="text-xl font-black mb-6">RRapp<span className="text-gray-300">.</span></p>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed font-medium">
            Redefining the digital publication landscape with high-end typography, 
            minimalist aesthetics, and uncompromising performance.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-6">Directory</h4>
          <ul className="space-y-4 text-sm font-bold text-gray-500">
            <li><a href="#" className="hover:text-black transition-colors">The Archives</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Manifesto</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Community</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-6">Legal</h4>
          <ul className="space-y-4 text-sm font-bold text-gray-500">
            <li><a href="#" className="hover:text-black transition-colors">Privacy Charter</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Usage Terms</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Audit Trail</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-6 mt-16 pt-8 border-t border-gray-50 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
        © {new Date().getFullYear()} RRapp. Optimized for the human mind.
      </div>
    </footer>
  );
};

export default Footer;
