import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { adminService } from '../services/adminService';
import { FaGoogle, FaTwitter, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
export default function Auth() {
    const [mode, setMode] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'signin') {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                alert(error.message);
            }
            else {
                // Set as admin if email is tommyterc2021@gmail.com
                if (data.user && email === 'tommyterc2021@gmail.com') {
                    await adminService.setAsAdmin(data.user.id);
                }
                window.location.href = '/';
            }
        }
        else {
            const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
            if (error) {
                alert(error.message);
            }
            else {
                // Set as admin if email is tommyterc2021@gmail.com
                if (data.user && email === 'tommyterc2021@gmail.com') {
                    await adminService.setAsAdmin(data.user.id);
                }
                window.location.href = '/';
            }
        }
    };
    const handleGoogleAuth = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error)
            alert(error.message);
    };
    const handleTwitterAuth = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'twitter',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error)
            alert(error.message);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 font-mono pt-16 flex items-center justify-center px-4", children: _jsxs("div", { className: "max-w-md w-full space-y-8 bg-gradient-to-b from-gray-900/95 via-gray-800/98 to-gray-900/95 p-8 rounded-lg border border-matrix-green/30 hover:shadow-lg hover:shadow-matrix-green/20 transition-all", children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-bold text-matrix-green mb-2", children: mode === 'signin' ? 'Access the Matrix' : 'Join the Matrix' }), _jsx("p", { className: "text-matrix-green/60", children: mode === 'signin'
                                ? 'Enter your credentials to continue'
                                : 'Create your account to join the network' })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("button", { onClick: handleGoogleAuth, className: "w-full flex items-center justify-center gap-3 bg-matrix-green/10 hover:bg-matrix-green/20 text-matrix-green py-3 rounded-lg border border-matrix-green/30 transition-colors", children: [_jsx(FaGoogle, {}), "Continue with Google"] }), _jsxs("button", { onClick: handleTwitterAuth, className: "w-full flex items-center justify-center gap-3 bg-matrix-green/10 hover:bg-matrix-green/20 text-matrix-green py-3 rounded-lg border border-matrix-green/30 transition-colors", children: [_jsx(FaTwitter, {}), "Continue with Twitter"] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-matrix-green/30" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-matrix-dark text-matrix-green/60", children: "Or continue with email" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [mode === 'signup' && (_jsxs("div", { children: [_jsx("label", { className: "block text-matrix-green/80 text-sm font-bold mb-2", children: "Name" }), _jsxs("div", { className: "relative", children: [_jsx(FaUser, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-matrix-green/60" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded-lg pl-10 pr-4 py-3 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Enter your name", required: true })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-matrix-green/80 text-sm font-bold mb-2", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(FaEnvelope, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-matrix-green/60" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded-lg pl-10 pr-4 py-3 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Enter your email", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-matrix-green/80 text-sm font-bold mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(FaLock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-matrix-green/60" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded-lg pl-10 pr-4 py-3 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Enter your password", required: true })] })] }), _jsx("button", { type: "submit", className: "w-full bg-matrix-green text-matrix-black font-bold py-3 rounded-lg hover:bg-matrix-light transition-colors", children: mode === 'signin' ? 'Sign In' : 'Create Account' })] })] }), _jsx("div", { className: "text-center text-matrix-green/60", children: mode === 'signin' ? (_jsxs("p", { children: ["Don't have an account?", ' ', _jsx("button", { onClick: () => setMode('signup'), className: "text-matrix-green hover:text-matrix-light", children: "Sign up" })] })) : (_jsxs("p", { children: ["Already have an account?", ' ', _jsx("button", { onClick: () => setMode('signin'), className: "text-matrix-green hover:text-matrix-light", children: "Sign in" })] })) })] }) }));
}
