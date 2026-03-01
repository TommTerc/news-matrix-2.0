import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FaBell, FaBookmark, FaUser, FaSearch, FaBars, FaCog } from 'react-icons/fa';
import NewsDetail from './pages/NewsDetail';
import StoryTimeline from './pages/StoryTimeline';
import Studio from './pages/Studio';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import MatrixRain from './components/MatrixRain';
import Notifications from './pages/Notifications';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import { adminService } from './services/adminService';
function NavLink({ to, icon: Icon, label }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (_jsxs(Link, { to: to, className: `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive
            ? 'bg-matrix-green/20 text-matrix-light'
            : 'hover:bg-matrix-green/10 text-matrix-green hover:text-matrix-light'}`, children: [_jsx(Icon, { className: "text-xl" }), _jsx("span", { children: label })] }));
}
function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    React.useEffect(() => {
        import('./services/supabaseClient').then(({ supabase }) => {
            supabase.auth.getSession().then(({ data }) => {
                setIsLoggedIn(!!data.session);
                if (data.session) {
                    adminService.isAdmin(data.session.user.id).then(setIsAdmin);
                }
            });
            supabase.auth.onAuthStateChange((_event, session) => {
                setIsLoggedIn(!!session);
                if (session) {
                    adminService.isAdmin(session.user.id).then(setIsAdmin);
                }
                else {
                    setIsAdmin(false);
                }
            });
        });
    }, []);
    return (_jsx("nav", { className: "fixed top-0 left-0 right-0 bg-matrix-black/95 backdrop-blur-sm border-b border-matrix-green/30 z-50", children: _jsxs("div", { className: "w-full px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Link, { to: "/", className: "text-2xl font-bold text-matrix-green", children: "NEWS MATRIX" }), _jsx("img", { src: "/src/images/matrix.jpeg", alt: "matrix", className: "h-12 w-12 rounded-full border border-matrix-green/50 object-cover" })] }), _jsx("div", { className: "flex items-center flex-1 mx-4", children: _jsxs("div", { className: "relative w-full max-w-2xl mx-auto", children: [_jsx(FaSearch, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-matrix-green/60" }), _jsx("input", { type: "search", placeholder: "Search the Matrix for news, topics, or keywords...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded-full pl-10 pr-4 py-2 text-matrix-green focus:outline-none focus:border-matrix-green" })] }) }), _jsxs("div", { className: "hidden md:flex items-center gap-4", children: [isLoggedIn ? (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/notifications", icon: FaBell, label: "Notifications" }), _jsx(NavLink, { to: "/bookmarks", icon: FaBookmark, label: "Bookmarks" }), _jsx(NavLink, { to: "/profile", icon: FaUser, label: "Profile" }), isAdmin && _jsx(NavLink, { to: "/admin", icon: FaCog, label: "Admin" })] })) : null, !isLoggedIn && (_jsx(Link, { to: "/auth", className: "px-4 py-2 rounded-lg bg-matrix-green text-matrix-dark font-semibold hover:bg-matrix-light transition-colors", children: "Sign In" }))] }), _jsx("button", { onClick: () => setIsMenuOpen(!isMenuOpen), className: "md:hidden text-matrix-green hover:text-matrix-light p-2", children: _jsx(FaBars, { className: "text-2xl" }) })] }), isMenuOpen && (_jsxs("div", { className: "md:hidden py-4 border-t border-matrix-green/30", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [isLoggedIn && (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/notifications", icon: FaBell, label: "Notifications" }), _jsx(NavLink, { to: "/bookmarks", icon: FaBookmark, label: "Bookmarks" }), _jsx(NavLink, { to: "/profile", icon: FaUser, label: "Profile" }), isAdmin && _jsx(NavLink, { to: "/admin", icon: FaCog, label: "Admin" })] })), !isLoggedIn && (_jsx(Link, { to: "/auth", className: "px-4 py-2 rounded-lg bg-matrix-green text-matrix-dark font-semibold hover:bg-matrix-light transition-colors text-center", children: "Sign In" }))] }), _jsx("div", { className: "mt-4", children: _jsxs("div", { className: "relative", children: [_jsx(FaSearch, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-matrix-green/60" }), _jsx("input", { type: "search", placeholder: "Search the Matrix for news, topics, or keywords...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded-full pl-10 pr-4 py-2 text-matrix-green focus:outline-none focus:border-matrix-green" })] }) })] }))] }) }));
}
function App() {
    return (_jsx(Router, { children: _jsxs("div", { className: "relative min-h-screen", children: [_jsx("div", { className: "absolute inset-0 bg-black/95 backdrop-blur-sm" }), _jsx(MatrixRain, {}), _jsx("div", { className: "absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" }), _jsxs("div", { className: "relative z-10", children: [_jsx(Navbar, {}), _jsx("main", { className: "pt-16", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/news/:id", element: _jsx(NewsDetail, {}) }), _jsx(Route, { path: "/story", element: _jsx(StoryTimeline, {}) }), _jsx(Route, { path: "/studio", element: _jsx(Studio, {}) }), _jsx(Route, { path: "/notifications", element: _jsx(Notifications, {}) }), _jsx(Route, { path: "/bookmarks", element: _jsx(Bookmarks, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "/auth", element: _jsx(Auth, {}) }), _jsx(Route, { path: "/auth/callback", element: _jsx(AuthCallback, {}) }), _jsx(Route, { path: "/admin", element: _jsx(AdminPanel, {}) }), _jsx(Route, { path: "/terms", element: _jsx(Terms, {}) }), _jsx(Route, { path: "/privacy", element: _jsx(Privacy, {}) })] }) })] })] }) }));
}
export default App;
