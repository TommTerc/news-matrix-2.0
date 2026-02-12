import React, { useState, useEffect } from 'react';
import { FaUsers, FaShield, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { supabase } from '../services/supabaseClient';
import { adminService } from '../services/adminService';

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAndLoadUsers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = '/auth';
          return;
        }

        setCurrentUser(user);

        // Check if user is admin
        const adminStatus = await adminService.isAdmin(user.id);
        setIsAdmin(adminStatus);

        if (adminStatus) {
          // Load all users
          const allUsers = await adminService.getAllUsers();
          setUsers(allUsers);
        } else {
          // Redirect non-admins
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoadUsers();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return <div className="text-matrix-green">Loading admin panel...</div>;
  if (!isAdmin) return <div className="text-red-500">Access denied</div>;

  return (
    <div className="min-h-screen bg-matrix-black/40 font-mono pt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-matrix-green flex items-center gap-3">
            <FaShield /> Administrative Panel
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black/40 border border-matrix-green/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-matrix-green text-2xl" />
              <h3 className="text-matrix-green/60">Total Users</h3>
            </div>
            <p className="text-3xl font-bold text-matrix-green">{users.length}</p>
          </div>

          <div className="bg-black/40 border border-matrix-green/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaShield className="text-matrix-green text-2xl" />
              <h3 className="text-matrix-green/60">Admin Users</h3>
            </div>
            <p className="text-3xl font-bold text-matrix-green">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>

          <div className="bg-black/40 border border-matrix-green/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCog className="text-matrix-green text-2xl" />
              <h3 className="text-matrix-green/60">Settings</h3>
            </div>
            <p className="text-matrix-green">Configure system</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-black/40 border border-matrix-green/30 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-matrix-green/30">
            <h2 className="text-2xl font-bold text-matrix-green flex items-center gap-2">
              <FaUsers /> User Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-matrix-green">
              <thead>
                <tr className="border-b border-matrix-green/30">
                  <th className="px-6 py-3 text-left">User ID</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-matrix-green/10 hover:bg-matrix-green/5">
                    <td className="px-6 py-3 font-mono text-sm">{user.user_id.substring(0, 8)}...</td>
                    <td className="px-6 py-3">Admin Account</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-matrix-green/20 text-matrix-green' 
                          : 'bg-matrix-green/10 text-matrix-green/60'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-matrix-green/60">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Info */}
        <div className="mt-12 p-6 bg-black/40 border border-matrix-green/30 rounded-lg">
          <h3 className="text-lg font-bold text-matrix-green mb-4">Current Admin</h3>
          <p className="text-matrix-green/80">
            Logged in as: <span className="font-mono text-matrix-green">{currentUser?.email}</span>
          </p>
          <p className="text-matrix-green/80 mt-2">
            User ID: <span className="font-mono text-matrix-green text-sm">{currentUser?.id}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
