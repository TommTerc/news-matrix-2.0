import React, { useState } from 'react';
import { FaUserCircle, FaEdit, FaLink, FaBirthdayCake, FaStar, FaMedal, FaRegBookmark, FaRegComment, FaRegNewspaper } from 'react-icons/fa';
import { format } from 'date-fns';
import { mockNews } from '../data/mockData';

type ProfileTab = 'overview' | 'posts' | 'comments' | 'saved';

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  joinDate: Date;
  karma: number;
  awards: number;
  avatar?: string;
  bannerImage?: string;
}

// Mock user data
const mockUser: UserProfile = {
  username: 'matrix_user',
  displayName: 'Matrix Explorer',
  bio: 'Exploring the digital frontier. Passionate about technology and its impact on society.',
  joinDate: new Date(2023, 5, 15),
  karma: 12547,
  awards: 23,
  bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockUser);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // TODO: Save profile changes to backend
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {mockNews.map((post) => (
              <div 
                key={post.id}
                className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg overflow-hidden hover:border-matrix-green transition-all"
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-matrix-green/60 mb-2">
                    <span>{post.source}</span>
                    <span>•</span>
                    <span>Posted by u/{profile.username}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-matrix-green">{post.title}</h3>
                  <p className="text-matrix-green/80">{post.description}</p>
                  
                  <div className="flex items-center gap-6 mt-4 text-sm text-matrix-green/60">
                    <span className="flex items-center gap-1">
                      <FaRegComment /> {post.comments} comments
                    </span>
                    <span className="flex items-center gap-1">
                      <FaRegBookmark /> Save
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'posts':
        return (
          <div className="space-y-6">
            {mockNews.map((post) => (
              <div 
                key={post.id}
                className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg overflow-hidden hover:border-matrix-green transition-all"
              >
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-matrix-green">{post.title}</h3>
                  <p className="text-matrix-green/80">{post.description}</p>
                </div>
              </div>
            ))}
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
              <div className="w-32 h-32 rounded-full bg-matrix-green/20 flex items-center justify-center text-6xl text-matrix-green border-4 border-matrix-black overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={profile.displayName} className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle />
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green"
                    />
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green"
                      rows={3}
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-matrix-green text-matrix-black rounded hover:bg-matrix-light"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-2xl font-bold text-matrix-green">{profile.displayName}</h1>
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
                    <FaBirthdayCake className="text-matrix-green" />
                    <span>Joined {format(profile.joinDate, 'MMMM yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaStar className="text-matrix-green" />
                    <span>{profile.karma.toLocaleString()} karma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMedal className="text-matrix-green" />
                    <span>{profile.awards} awards</span>
                  </div>
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
    </div>
  );
}