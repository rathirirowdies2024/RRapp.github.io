
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import Explore from './pages/Explore';
import CommandPalette from './components/CommandPalette';
import { supabaseService } from './services/supabase';
import { UserSession, AppRoute } from './types';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

interface AuthContextType {
  session: UserSession | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const refreshSession = async () => {
    try {
      const s = await supabaseService.getSession();
      setSession(s);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabaseService.logout();
    setSession(null);
    toast.success("Signed out successfully");
  };

  useEffect(() => {
    refreshSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Initializing Engine</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, loading, refreshSession, logout }}>
      <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
        <Navbar />
        <CommandPalette />
        <main className="flex-grow pt-20">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path={AppRoute.HOME} element={<Home />} />
              <Route path={AppRoute.EXPLORE} element={<Explore />} />
              <Route path={AppRoute.POST} element={<PostDetail />} />
              <Route path={AppRoute.LOGIN} element={<Login />} />
              <Route path={AppRoute.SETTINGS} element={session ? <Settings /> : <Navigate to="/login" />} />
              <Route path={AppRoute.DASHBOARD} element={session ? <UserDashboard /> : <Navigate to="/login" />} />
              <Route path={AppRoute.ANALYTICS} element={session ? <Analytics /> : <Navigate to="/login" />} />
              
              <Route 
                path={AppRoute.ADMIN} 
                element={session?.profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </AuthContext.Provider>
  );
};

export default App;
