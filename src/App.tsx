import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaHashtag, FaBell, FaBookmark, FaUser, FaSearch, FaBars } from 'react-icons/fa';
import NewsDetail from './pages/NewsDetail';
import Studio from './pages/Studio';
import Explore from './pages/Explore';
import Auth from './pages/Auth';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import MatrixRain from './components/MatrixRain';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Home from './pages/Home';

function NavLink({ to, icon: Icon, label }: { to: string; icon: React.ComponentType; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-matrix-green/20 text-matrix-light' 
          : 'hover:bg-matrix-green/10 text-matrix-green hover:text-matrix-light'
      }`}
    >
      <Icon className="text-xl" />
      <span>{label}</span>
    </Link>
  );
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="fixed top-0 left-0 right-0 bg-matrix-black/95 backdrop-blur-sm border-b border-matrix-green/30 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-matrix-green">
            NEWS MATRIX
          </Link>

          {/* Search Bar - Now with more width */}
          <div className="flex items-center flex-1 mx-8">
            <div className="relative w-full max-w-2xl mx-auto">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-matrix-green/60" />
              <input
                type="search"
                placeholder="Search the Matrix for news, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-matrix-dark border border-matrix-green/30 rounded-full pl-10 pr-4 py-2 text-matrix-green focus:outline-none focus:border-matrix-green"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/explore" icon={FaHashtag} label="Explore" />
            <NavLink to="/notifications" icon={FaBell} label="Notifications" />
            <NavLink to="/bookmarks" icon={FaBookmark} label="Bookmarks" />
            <NavLink to="/profile" icon={FaUser} label="Profile" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-matrix-green hover:text-matrix-light p-2"
          >
            <FaBars className="text-2xl" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-matrix-green/30">
            <div className="flex flex-col gap-2">
              <NavLink to="/explore" icon={FaHashtag} label="Explore" />
              <NavLink to="/notifications" icon={FaBell} label="Notifications" />
              <NavLink to="/bookmarks" icon={FaBookmark} label="Bookmarks" />
              <NavLink to="/profile" icon={FaUser} label="Profile" />
            </div>
            {/* Mobile Search */}
            <div className="mt-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-matrix-green/60" />
                <input
                  type="search"
                  placeholder="Search the Matrix for news, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-matrix-dark border border-matrix-green/30 rounded-full pl-10 pr-4 py-2 text-matrix-green focus:outline-none focus:border-matrix-green"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
        
        {/* Matrix rain effect */}
        <MatrixRain />
        
        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          <Navbar />
          
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;