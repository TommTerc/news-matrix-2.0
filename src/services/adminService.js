import { supabase } from './supabaseClient';
export const adminService = {
    // Check if current user is admin
    isAdmin: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .eq('role', 'admin')
                .single();
            return !error && data !== null;
        }
        catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    },
    // Set user as admin
    setAsAdmin: async (userId) => {
        try {
            const { error } = await supabase
                .from('user_roles')
                .upsert({
                user_id: userId,
                role: 'admin',
                created_at: new Date().toISOString()
            });
            return !error;
        }
        catch (error) {
            console.error('Error setting admin:', error);
            return false;
        }
    },
    // Get all users
    getAllUsers: async () => {
        try {
            const { data, error } = await supabase
                .from('user_roles')
                .select('*');
            if (error)
                throw error;
            return data;
        }
        catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }
};
