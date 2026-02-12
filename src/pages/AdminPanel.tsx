import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { adminService } from '../services/adminService';
import { FaSignOutAlt } from 'react-icons/fa';

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
    return <div className="text-matrix-green">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-matrix-black/40 backdrop-blur-[2px] font-mono pt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-matrix-green">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {currentUser && (
          <div className="mb-8 p-4 border border-matrix-green/30 rounded bg-black/40">
            <p className="text-matrix-green">Logged in as: <span className="font-bold">{currentUser.email}</span></p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="p-6 border border-matrix-green/30 rounded bg-black/40">
            <p className="text-matrix-green/60 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-matrix-green">{users.length}</p>
          </div>
          <div className="p-6 border border-matrix-green/30 rounded bg-black/40">
            <p className="text-matrix-green/60 text-sm">Admins</p>
            <p className="text-3xl font-bold text-matrix-green">{users.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="p-6 border border-matrix-green/30 rounded bg-black/40">
            <p className="text-matrix-green/60 text-sm">Regular Users</p>
            <p className="text-3xl font-bold text-matrix-green">{users.filter(u => u.role !== 'admin').length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="border border-matrix-green/30 rounded overflow-hidden bg-black/40">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-matrix-green/30 bg-matrix-green/10">
                <th className="p-4 text-matrix-green">User ID</th>
                <th className="p-4 text-matrix-green">Role</th>
                <th className="p-4 text-matrix-green">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-matrix-green/20 hover:bg-matrix-green/5">
                  <td className="p-4 text-matrix-green/80">{user.user_id}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded text-sm ${
                      user.role === 'admin' 
                        ? 'bg-yellow-600/20 text-yellow-400' 
                        : 'bg-matrix-green/20 text-matrix-green'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-matrix-green/60 text-sm">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
