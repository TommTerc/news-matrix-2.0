import React, { useState } from 'react';
import { FaBell, FaHeart, FaComment, FaRetweet, FaUser, FaEllipsisH } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

// Mock notifications data
const mockNotifications = [
  {
    id: '1',
    type: 'like',
    user: {
      name: 'John Doe',
      handle: '@johndoe',
      avatar: 'https://via.placeholder.com/40'
    },
    content: 'liked your post about AI developments',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    postPreview: 'Breaking: Major AI breakthrough in quantum computing...'
  },
  {
    id: '2',
    type: 'comment',
    user: {
      name: 'Jane Smith',
      handle: '@janesmith',
      avatar: 'https://via.placeholder.com/40'
    },
    content: 'commented on your post',
    comment: 'This is a fascinating development! What are your thoughts on its implications?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    postPreview: 'New climate change policies announced at global summit...'
  },
  {
    id: '3',
    type: 'share',
    user: {
      name: 'Tech Daily',
      handle: '@techdaily',
      avatar: 'https://via.placeholder.com/40'
    },
    content: 'shared your post',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    postPreview: 'Cybersecurity alert: Major platform vulnerability detected...'
  }
];

type NotificationType = 'all' | 'mentions' | 'likes' | 'shares';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<NotificationType>('all');

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'mentions':
        return mockNotifications.filter(n => n.type === 'comment');
      case 'likes':
        return mockNotifications.filter(n => n.type === 'like');
      case 'shares':
        return mockNotifications.filter(n => n.type === 'share');
      default:
        return mockNotifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-pink-500" />;
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'share':
        return <FaRetweet className="text-green-500" />;
      default:
        return <FaBell className="text-matrix-green" />;
    }
  };

  return (
    <div className="min-h-screen bg-matrix-black/40 backdrop-blur-[2px] font-mono">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-16 bg-matrix-black/95 backdrop-blur-sm border-b border-matrix-green/30 z-10">
          <h1 className="text-xl font-bold p-4 text-matrix-green">Notifications</h1>
          
          {/* Tabs */}
          <div className="flex">
            {(['all', 'mentions', 'likes', 'shares'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center relative transition-colors ${
                  activeTab === tab 
                    ? 'text-matrix-light' 
                    : 'text-matrix-green/60 hover:text-matrix-green'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-matrix-light" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-matrix-green/30">
          {getFilteredNotifications().map((notification) => (
            <div
              key={notification.id}
              className="p-4 hover:bg-matrix-green/5 transition-colors flex gap-4"
            >
              <div className="w-12 h-12 flex-shrink-0">
                <div className="w-8 h-8 flex items-center justify-center text-lg">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={notification.user.avatar}
                        alt={notification.user.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="font-bold text-matrix-green">
                        {notification.user.name}
                      </span>
                      <span className="text-matrix-green/60">
                        {notification.user.handle}
                      </span>
                    </div>
                    
                    <p className="text-matrix-green/80 mb-2">
                      {notification.content}
                    </p>
                    
                    {notification.comment && (
                      <div className="bg-matrix-green/5 border border-matrix-green/30 rounded-lg p-3 mb-2">
                        <p className="text-matrix-green/80">{notification.comment}</p>
                      </div>
                    )}
                    
                    <div className="text-sm text-matrix-green/60">
                      {notification.postPreview}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-matrix-green/60">
                      {formatDistanceToNow(notification.timestamp)} ago
                    </span>
                    <button className="text-matrix-green/60 hover:text-matrix-light">
                      <FaEllipsisH />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}