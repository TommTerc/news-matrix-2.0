import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaEdit, FaLink, FaPhone, FaRegBookmark, FaRegComment, FaRegNewspaper, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import { supabase } from '../services/supabaseClient';
import userProfileService from '../services/userProfileService';

type ProfileTab = 'overview' | 'posts' | 'comments' | 'saved';

interface UserProfile {
  user_id?: string;
  username: string;
  display_name: string;
  bio: string;
  joinDate?: Date;
  avatar?: string;
  avatar_url?: string;
  bannerImage?: string;
  cover_image_url?: string;
  website?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user and profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          setError('Please sign in to view your profile');
          setLoading(false);
          return;
        }

        setUser(currentUser);

        // Fetch profile from database
        const profileData = await userProfileService.getProfile(currentUser.id);
        
        if (profileData) {
          setProfile({
            ...profileData,
            avatar: profileData.avatar_url,
            bannerImage: profileData.cover_image_url,
            joinDate: new Date(profileData.created_at)
          });
        } else {
          // Create default profile for new user
          setProfile({
            user_id: currentUser.id,
            username: currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'user',
            display_name: currentUser.user_metadata?.display_name || currentUser.email?.split('@')[0] || 'User',
            bio: '',
            avatar: undefined,
            bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
            website: '',
            location: '',
            joinDate: new Date(currentUser.created_at || new Date())
          });
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      const profileData = await userProfileService.updateProfile(user.id, {
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url || profile.avatar,
        cover_image_url: profile.cover_image_url || profile.bannerImage,
        website: profile.website,
        location: profile.location
      });

      if (profileData) {
        setProfile({
          ...profileData,
          avatar: profileData.avatar_url,
          bannerImage: profileData.cover_image_url,
          joinDate: new Date(profileData.created_at)
        });
        setIsEditing(false);
        setError(null);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="text-center text-matrix-green/60 py-12">
            No posts yet
          </div>
        );
      
      
      case 'posts':
        return (
          <div className="text-center text-matrix-green/60 py-12">
            No posts yet
          </div>
        );
      
      case 'comments':
        return (
          <div className="text-center text-matrix-green/60 py-12">
            No comments yet
          </div>
        );
      
      case 'saved':
        return (
          <div className="text-center text-matrix-green/60 py-12">
            No saved items
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-matrix-black/40 backdrop-blur-[2px] pt-16">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <FaSpinner className="animate-spin text-matrix-green text-4xl" />
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-12">
          {error}
        </div>
      ) : !profile ? (
        <div className="text-center text-matrix-green/60 py-12">
          Profile not found
        </div>
      ) : (
        <>
          {/* Profile Banner */}
          <div 
            className="h-48 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${profile.bannerImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-matrix-black/80 to-transparent" />
          </div>

          {/* Profile Info */}
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative -mt-20 mb-8">
              <div className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-6">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-matrix-green/20 flex items-center justify-center text-6xl text-matrix-green border-4 border-matrix-black overflow-hidden">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.display_name} className="w-full h-full object-cover" />
                      ) : (
                        <FaUserCircle />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 p-2 bg-matrix-green rounded-full cursor-pointer hover:bg-matrix-light transition-colors">
                        <FaEdit className="text-matrix-black" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setProfile({ ...profile, avatar: event.target?.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm text-matrix-green/60">Display Name</label>
                          <input
                            type="text"
                            value={profile.display_name}
                            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                            className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-matrix-green/60">Username</label>
                          <input
                            type="text"
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-matrix-green/60">Bio</label>
                          <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-matrix-green/60">Website</label>
                          <input
                            type="text"
                            value={profile.website || ''}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-matrix-green/60">Location</label>
                          <input
                            type="text"
                            value={profile.location || ''}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="px-4 py-2 bg-matrix-green text-matrix-black rounded hover:bg-matrix-light disabled:opacity-50 flex items-center gap-2"
                          >
                            {saving && <FaSpinner className="animate-spin" />}
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            disabled={saving}
                            className="px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h1 className="text-2xl font-bold text-matrix-green">{profile.display_name}</h1>
                          <button
                            onClick={handleEditProfile}
                            className="flex items-center gap-2 px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30"
                          >
                            <FaEdit />
                            Edit Profile
                          </button>
                        </div>
                        <div className="text-matrix-green/60 mb-4">u/{profile.username}</div>
                        <p className="text-matrix-green/80 mb-4">{profile.bio}</p>
                      </>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-matrix-green/60">
                      <div className="flex items-center gap-2">
                        <FaPhone className="text-matrix-green" />
                        <span>Joined {format(profile.joinDate || new Date(), 'MMMM yyyy')}</span>
                      </div>
                      {profile.location && (
                        <div className="flex items-center gap-2">
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-matrix-green">
                          <FaLink className="text-matrix-green" />
                          <span>Website</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-matrix-green/30">
              <div className="flex space-x-8">
                {(['overview', 'posts', 'comments', 'saved'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 relative ${
                      activeTab === tab 
                        ? 'text-matrix-light' 
                        : 'text-matrix-green/60 hover:text-matrix-green'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-matrix-light rounded-t" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </>
      )}
    </div>
  );
}