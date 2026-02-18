
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { supabaseService } from '../services/supabase';
import { toast } from 'react-hot-toast';
import { LogIn, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await supabaseService.login(email);
      await refreshSession();
      toast.success("Welcome to the premium circuit.");
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || "Access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 -mt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white border border-gray-100 p-12 rounded-[2.5rem] shadow-3xl text-center">
          <div className="mb-10 flex justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center text-black shadow-inner">
              <ShieldCheck size={32} />
            </div>
          </div>
          
          <h2 className="text-3xl font-black mb-3">Identity Access</h2>
          <p className="text-gray-400 text-sm mb-10 font-medium">Verify your credentials to enter the RR sanctuary.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 text-left pl-1">Professional Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="architect@rathiri.rowdies"
                className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:bg-white focus:border-black outline-none transition-all text-center font-bold"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center space-x-3 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <>
                  <span>Initialize Connection</span>
                  <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center justify-center space-x-3">
             <div className="h-px bg-gray-100 flex-grow"></div>
             <span>Encrypted by JWT & RSA</span>
             <div className="h-px bg-gray-100 flex-grow"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
