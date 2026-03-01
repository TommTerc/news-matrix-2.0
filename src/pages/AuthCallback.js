import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { adminService } from '../services/adminService';
export default function AuthCallback() {
    const navigate = useNavigate();
    useEffect(() => {
        const handleCallback = async () => {
            console.log('AuthCallback: Starting...');
            const { data: { session }, error } = await supabase.auth.getSession();
            console.log('AuthCallback: Session retrieved', { session: !!session, error });
            if (error) {
                console.error('Callback error:', error);
                navigate('/auth');
                return;
            }
            if (session) {
                console.log('AuthCallback: Session found, user:', session.user.email);
                // Check if this is the admin email and set admin role
                if (session.user.email === 'tommyterc2021@gmail.com') {
                    console.log('AuthCallback: Setting admin role...');
                    await adminService.setAsAdmin(session.user.id);
                }
                console.log('AuthCallback: Navigating to home...');
                navigate('/');
            }
            else {
                console.log('AuthCallback: No session, redirecting to auth');
                navigate('/auth');
            }
        };
        handleCallback();
    }, [navigate]);
    return (_jsx("div", { className: "min-h-screen bg-matrix-black/40 backdrop-blur-[2px] font-mono flex items-center justify-center", children: _jsx("div", { className: "text-matrix-green text-xl", children: "Authenticating..." }) }));
}
