
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { AppRoute } from '../types';
import { Menu, X, User, LogOut, LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';

const Header: React.FC = () => {
  const { session, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tighter" onClick={closeMenus}>
          RR<span className="text-white/50">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium hover:text-white transition-colors ${location.pathname === '/' ? 'text-white' : 'text-white/60'}`}
          >
            Home
          </Link>
          
          {session ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-sm font-medium hover:text-white transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <User size={16} />
                </span>
                <span>{session.profile?.username}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-black border border-white/10 shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {session.profile?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                      onClick={closeMenus}
                    >
                      <LayoutDashboard size={14} className="mr-3" /> Dashboard
                    </Link>
                  )}
                  <Link 
                    to="/settings" 
                    className="flex items-center px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                    onClick={closeMenus}
                  >
                    <SettingsIcon size={14} className="mr-3" /> Settings
                  </Link>
                  <button 
                    onClick={() => { logout(); closeMenus(); }}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-400 hover:bg-red-400/5 transition-colors text-left"
                  >
                    <LogOut size={14} className="mr-3" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-black border-b border-white/10 p-6 flex flex-col space-y-6 animate-in slide-in-from-top duration-300">
          <Link to="/" className="text-xl font-bold" onClick={closeMenus}>Home</Link>
          {session ? (
            <>
              {session.profile?.role === 'admin' && (
                <Link to="/admin" className="text-xl font-bold" onClick={closeMenus}>Dashboard</Link>
              )}
              <Link to="/settings" className="text-xl font-bold" onClick={closeMenus}>Settings</Link>
              <button 
                onClick={() => { logout(); closeMenus(); }}
                className="text-xl font-bold text-red-500 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-xl font-bold" onClick={closeMenus}>Sign In</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
