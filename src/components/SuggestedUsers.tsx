import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';

interface SuggestedUser {
  id: string;
  name: string;
  handle: string;
  bio?: string;
  avatar?: string;
  isFollowing?: boolean;
}

interface SuggestedUsersProps {
  users?: SuggestedUser[];
}

const defaultUsers: SuggestedUser[] = [
  {
    id: '1',
    name: 'Political Analyst',
    handle: '@polanalyst',
    bio: 'Congress tracking expert',
    isFollowing: false,
  },
  {
    id: '2',
    name: 'News Reporter',
    handle: '@newsreporter',
    bio: 'Latest news updates',
    isFollowing: false,
  },
  {
    id: '3',
    name: 'Policy Expert',
    handle: '@policyexpert',
    bio: 'Government policy analysis',
    isFollowing: false,
  },
];

export default function SuggestedUsers({ users = defaultUsers }: SuggestedUsersProps) {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const toggleFollow = (userId: string) => {
    const newFollowed = new Set(followedUsers);
    if (newFollowed.has(userId)) {
      newFollowed.delete(userId);
    } else {
      newFollowed.add(userId);
    }
    setFollowedUsers(newFollowed);
  };

  return (
    <div className="w-full energy-container bg-black/40 p-3 rounded-lg border border-matrix-green/30 mt-4">
      <h3 className="text-lg font-bold text-matrix-green mb-3">Suggested Users</h3>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="border-b border-matrix-green/20 pb-3 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-matrix-green truncate">{user.name}</p>
                <p className="text-xs text-matrix-green/60">{user.handle}</p>
                {user.bio && (
                  <p className="text-xs text-matrix-green/50 mt-1 line-clamp-1">{user.bio}</p>
                )}
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className={`flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                  followedUsers.has(user.id)
                    ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green'
                    : 'bg-matrix-green text-matrix-black hover:bg-matrix-light border border-matrix-green'
                }`}
              >
                <FaUserPlus className="text-xs" />
                {followedUsers.has(user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
