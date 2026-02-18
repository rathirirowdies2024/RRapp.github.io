
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { AppRoute } from '../types';
import { 
  Search, User, Bell, LayoutDashboard, Shield, 
  Settings as SettingsIcon, LogOut, TrendingUp, Compass, 
  Bookmark, Menu, X, BarChart3 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { session, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: AppRoute.HOME, icon: null },
    { label: 'Explore', path: AppRoute.EXPLORE, icon: <Compass size={16} /> },
    { label: 'Trending', path: AppRoute.TRENDING, icon: <TrendingUp size={16} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel h-16 border-b">
      <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-black tracking-tightest">
            RR<span className="text-gray-300">.</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold transition-colors flex items-center space-x-2 ${
                  location.pathname === item.path ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors" title="Command Search (⌘K)">
            <Search size={18} />
          </button>

          {session ? (
            <div className="flex items-center space-x-2 border-l pl-4 border-gray-100">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 hover:border-black transition-colors"
                >
                  <img src={session.profile?.avatar_url || `https://ui-avatars.com/api/?name=${session.profile?.username}`} alt="User" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0" onClick={() => setIsProfileOpen(false)} />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 shadow-2xl rounded-xl p-2 overflow-hidden"
                      >
                        <div className="px-3 py-3 border-b border-gray-50">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                          <p className="font-bold text-gray-900">{session.profile?.username}</p>
                        </div>

                        <div className="py-2">
                          <Link 
                            to={AppRoute.DASHBOARD} 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                          >
                            <LayoutDashboard size={16} /> <span>Creator Dashboard</span>
                          </Link>
                          {session.profile?.role === 'admin' && (
                            <Link 
                              to={AppRoute.ADMIN} 
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                              <Shield size={16} className="text-black" /> <span>Admin Portal</span>
                            </Link>
                          )}
                          <Link 
                            to={AppRoute.ANALYTICS} 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                          >
                            <BarChart3 size={16} /> <span>Performance</span>
                          </Link>
                          <Link 
                            to={AppRoute.SETTINGS} 
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
                          >
                            <SettingsIcon size={16} /> <span>System Settings</span>
                          </Link>
                        </div>

                        <div className="pt-2 mt-2 border-t border-gray-50">
                          <button 
                            onClick={logout}
                            className="w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <LogOut size={16} /> <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <Link 
              to={AppRoute.LOGIN} 
              className="px-5 py-2 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
