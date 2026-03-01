import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { adminService } from '../services/adminService';
import { FaSignOutAlt } from 'react-icons/fa';
export default function AdminPanel() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const checkAdminStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }
            const admin = await adminService.isAdmin(session.user.id);
            setIsAdmin(admin);
            setCurrentUser(session.user);
            if (admin) {
                const allUsers = await adminService.getAllUsers();
                setUsers(allUsers || []);
            }
            setLoading(false);
        };
        checkAdminStatus();
    }, []);
    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };
    if (loading) {
        return _jsx("div", { className: "text-matrix-green", children: "Loading..." });
    }
    if (!isAdmin) {
        return _jsx(Navigate, { to: "/" });
    }
    return (_jsx("div", { className: "min-h-screen bg-matrix-black/40 backdrop-blur-[2px] font-mono pt-20", children: _jsxs("div", { className: "max-w-7xl mx-auto px-8 py-12", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-4xl font-bold text-matrix-green", children: "Admin Panel" }), _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors", children: [_jsx(FaSignOutAlt, {}), " Logout"] })] }), currentUser && (_jsx("div", { className: "mb-8 p-4 border border-matrix-green/30 rounded bg-black/40", children: _jsxs("p", { className: "text-matrix-green", children: ["Logged in as: ", _jsx("span", { className: "font-bold", children: currentUser.email })] }) })), _jsxs("div", { className: "grid grid-cols-3 gap-4 mb-12", children: [_jsxs("div", { className: "p-6 border border-matrix-green/30 rounded bg-black/40", children: [_jsx("p", { className: "text-matrix-green/60 text-sm", children: "Total Users" }), _jsx("p", { className: "text-3xl font-bold text-matrix-green", children: users.length })] }), _jsxs("div", { className: "p-6 border border-matrix-green/30 rounded bg-black/40", children: [_jsx("p", { className: "text-matrix-green/60 text-sm", children: "Admins" }), _jsx("p", { className: "text-3xl font-bold text-matrix-green", children: users.filter(u => u.role === 'admin').length })] }), _jsxs("div", { className: "p-6 border border-matrix-green/30 rounded bg-black/40", children: [_jsx("p", { className: "text-matrix-green/60 text-sm", children: "Regular Users" }), _jsx("p", { className: "text-3xl font-bold text-matrix-green", children: users.filter(u => u.role !== 'admin').length })] })] }), _jsx("div", { className: "border border-matrix-green/30 rounded overflow-hidden bg-black/40", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-matrix-green/30 bg-matrix-green/10", children: [_jsx("th", { className: "p-4 text-matrix-green", children: "User ID" }), _jsx("th", { className: "p-4 text-matrix-green", children: "Role" }), _jsx("th", { className: "p-4 text-matrix-green", children: "Created At" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { className: "border-b border-matrix-green/20 hover:bg-matrix-green/5", children: [_jsx("td", { className: "p-4 text-matrix-green/80", children: user.user_id }), _jsx("td", { className: "p-4", children: _jsx("span", { className: `px-3 py-1 rounded text-sm ${user.role === 'admin'
                                                    ? 'bg-yellow-600/20 text-yellow-400'
                                                    : 'bg-matrix-green/20 text-matrix-green'}`, children: user.role }) }), _jsx("td", { className: "p-4 text-matrix-green/60 text-sm", children: new Date(user.created_at).toLocaleString() })] }, user.id))) })] }) })] }) }));
}
