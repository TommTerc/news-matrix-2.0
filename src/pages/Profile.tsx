import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaEdit, FaLink, FaPhone, FaRegBookmark, FaRegComment, FaRegNewspaper, FaSpinner, FaRetweet } from 'react-icons/fa';
import { format } from 'date-fns';
import { supabase } from '../services/supabaseClient';
import userProfileService from '../services/userProfileService';
import activityLogService from '../services/activityLogService';
import commentService, { Comment } from '../services/commentService';
import bookmarkService, { ArticleBookmark } from '../services/bookmarkService';
import repostService, { Repost } from '../services/repostService';

type ProfileTab = 'overview' | 'posts' | 'comments' | 'reposts' | 'saved';

interface UserProfile {
  id?: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  joinDate?: Date;
  avatar?: string | null;
  avatar_url?: string | null;
  bannerImage?: string | null;
  cover_image_url?: string | null;
  website?: string | null;
  location?: string | null;
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [bookmarks, setBookmarks] = useState<ArticleBookmark[]>([]);
  const [reposts, setReposts] = useState<Repost[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [loadingReposts, setLoadingReposts] = useState(false);

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
            joinDate: profileData.created_at ? new Date(profileData.created_at) : new Date()
          });
        } else {
          // Create default profile for new user
          setProfile({
            id: currentUser.id,
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

  // Load comments and bookmarks when tab changes or user updates
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      if (activeTab === 'comments') {
        setLoadingComments(true);
        try {
          const userComments = await commentService.getUserComments();
          setComments(userComments);
        } catch (err) {
          console.error('Error loading comments:', err);
        } finally {
          setLoadingComments(false);
        }
      } else if (activeTab === 'reposts') {
        setLoadingReposts(true);
        try {
          const userReposts = await repostService.getUserReposts(user.id);
          setReposts(userReposts);
        } catch (err) {
          console.error('Error loading reposts:', err);
        } finally {
          setLoadingReposts(false);
        }
      } else if (activeTab === 'saved') {
        setLoadingBookmarks(true);
        try {
          const userBookmarks = await bookmarkService.getUserBookmarks();
          setBookmarks(userBookmarks);
        } catch (err) {
          console.error('Error loading bookmarks:', err);
        } finally {
          setLoadingBookmarks(false);
        }
      }
    };

    loadData();
  }, [activeTab, user]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleAvatarUpload = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      if (!user) {
        setError('User not authenticated');
        return null;
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        setError(`Failed to upload avatar: ${uploadError.message}`);
        return null;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        return urlData.publicUrl;
      }

      return null;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile || !user) return;

    setSaving(true);
    try {
      // Only save database fields (not data URLs)
      const updates: Partial<UserProfile> = {
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        website: profile.website || null,
        location: profile.location || null
      };

      // If avatar is a data URL (newly uploaded), don't save it directly
      // The file picker will handle it separately through the upload handler
      if (profile.avatar_url && !profile.avatar_url.startsWith('data:')) {
        updates.avatar_url = profile.avatar_url;
      }

      const profileData = await userProfileService.updateProfile(user.id, updates, user.email);

      if (profileData) {
        setProfile({
          ...profileData,
          avatar: profileData.avatar_url,
          bannerImage: profileData.cover_image_url,
          joinDate: profileData.created_at ? new Date(profileData.created_at) : new Date()
        });
        setIsEditing(false);
        setError(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); // Hide success message after 3 seconds
      } else {
        setError('Failed to save profile changes');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile: ' + (err instanceof Error ? err.message : 'Unknown error'));
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
        if (loadingComments) {
          return (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-2xl text-matrix-green" />
            </div>
          );
        }
        
        if (comments.length === 0) {
          return (
            <div className="text-center text-matrix-green/60 py-12">
              No comments yet
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg overflow-hidden hover:border-matrix-green transition-colors"
              >
                <Link
                  to={`/story?url=${encodeURIComponent(comment.article_url)}`}
                  className="block p-4 border-b border-matrix-green/20 bg-matrix-dark/50 hover:bg-matrix-dark/80 transition-colors"
                >
                  <p className="text-sm text-matrix-green/60 truncate hover:text-matrix-green transition-colors">
                    {comment.article_url}
                  </p>
                </Link>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-matrix-light">{comment.display_name || comment.username}</h4>
                      <p className="text-sm text-matrix-green/60">{format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                  </div>
                  <p className="text-matrix-green/80">{comment.content}</p>
                  
                  <Link
                    to={`/story?url=${encodeURIComponent(comment.article_url)}`}
                    className="inline-block mt-3 text-sm text-matrix-green/60 hover:text-matrix-green transition-colors"
                  >
                    View in article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'reposts':
        if (loadingReposts) {
          return (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-2xl text-matrix-green" />
            </div>
          );
        }

        if (reposts.length === 0) {
          return (
            <div className="text-center text-matrix-green/60 py-12">
              No reposts yet
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {reposts.map((repost) => (
              <div
                key={repost.id}
                className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg overflow-hidden hover:border-matrix-green transition-colors"
              >
                <Link
                  to={`/story?url=${encodeURIComponent(repost.article_url)}`}
                  className="block p-4 border-b border-matrix-green/20 bg-matrix-dark/50 hover:bg-matrix-dark/80 transition-colors"
                >
                  {repost.article_image && (
                    <img
                      src={repost.article_image}
                      alt={repost.article_title || 'Article image'}
                      onError={(e) => {
                        // Hide image if it fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                      className="w-full h-40 object-cover rounded mb-3 border border-matrix-green/20"
                    />
                  )}
                  <p className="font-bold text-matrix-light mb-1">
                    {repost.article_title || 'Untitled Article'}
                  </p>
                  {repost.article_source && (
                    <p className="text-sm text-matrix-green/60">{repost.article_source}</p>
                  )}
                  {repost.article_description && (
                    <p className="text-sm text-matrix-green/80 line-clamp-2 mt-2">{repost.article_description}</p>
                  )}
                  {!repost.article_description && (
                    <p className="text-sm text-matrix-green/60 italic mt-2">No description available</p>
                  )}
                </Link>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaRetweet className="text-matrix-green" />
                    <p className="text-sm text-matrix-green/60">{format(new Date(repost.created_at), 'MMM dd, yyyy')}</p>
                  </div>
                  {repost.repost_caption && (
                    <p className="text-matrix-green/90 mb-3 italic">"{repost.repost_caption}"</p>
                  )}

                  <Link
                    to={`/story?url=${encodeURIComponent(repost.article_url)}`}
                    className="inline-block text-sm text-matrix-green/60 hover:text-matrix-green transition-colors"
                  >
                    View full article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'saved':
        if (loadingBookmarks) {
          return (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-2xl text-matrix-green" />
            </div>
          );
        }

        if (bookmarks.length === 0) {
          return (
            <div className="text-center text-matrix-green/60 py-12">
              No saved items
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-4 hover:border-matrix-green transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-matrix-light flex items-center gap-2">
                      <FaRegBookmark className="text-matrix-green" />
                      Saved Article
                    </h4>
                    <p className="text-sm text-matrix-green/60 mt-1">{bookmark.article_url}</p>
                    <p className="text-sm text-matrix-green/60">{format(new Date(bookmark.created_at), 'MMM dd, yyyy')}</p>
                  </div>
                  <a
                    href={bookmark.article_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors"
                  >
                    Open →
                  </a>
                </div>
              </div>
            ))}
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

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 text-green-400 p-3 text-center border border-green-500 mx-4 -mb-2 rounded">
              ✓ Profile saved successfully!
            </div>
          )}

          {/* Profile Info */}
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative -mt-20 mb-8">
              <div className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-6">
                <div className="flex items-start gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-matrix-green/20 flex items-center justify-center text-6xl text-matrix-green border-4 border-matrix-black overflow-hidden">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt={profile.display_name || 'User avatar'} className="w-full h-full object-cover" />
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
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleAvatarUpload(file);
                              if (url) {
                                setProfile({ ...profile, avatar: url, avatar_url: url });
                              }
                            }
                          }}
                          disabled={uploading}
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
                            value={profile.display_name || ''}
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
                            value={profile.bio || ''}
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
                {(['overview', 'posts', 'comments', 'reposts', 'saved'] as const).map((tab) => (
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