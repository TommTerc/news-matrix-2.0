import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
const defaultUsers = [
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
export default function SuggestedUsers({ users = defaultUsers }) {
    const [followedUsers, setFollowedUsers] = useState(new Set());
    const toggleFollow = (userId) => {
        const newFollowed = new Set(followedUsers);
        if (newFollowed.has(userId)) {
            newFollowed.delete(userId);
        }
        else {
            newFollowed.add(userId);
        }
        setFollowedUsers(newFollowed);
    };
    return (_jsxs("div", { className: "w-full energy-container bg-black/40 p-3 rounded-lg border border-matrix-green/30 mt-4", children: [_jsx("h3", { className: "text-lg font-bold text-matrix-green mb-3", children: "Suggested Users" }), _jsx("div", { className: "space-y-3", children: users.map((user) => (_jsx("div", { className: "border-b border-matrix-green/20 pb-3 last:border-b-0 last:pb-0", children: _jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-matrix-green truncate", children: user.name }), _jsx("p", { className: "text-xs text-matrix-green/60", children: user.handle }), user.bio && (_jsx("p", { className: "text-xs text-matrix-green/50 mt-1 line-clamp-1", children: user.bio }))] }), _jsxs("button", { onClick: () => toggleFollow(user.id), className: `flex items-center gap-1 px-3 py-1 text-xs rounded transition-colors whitespace-nowrap ${followedUsers.has(user.id)
                                    ? 'bg-matrix-green/20 text-matrix-green border border-matrix-green'
                                    : 'bg-matrix-green text-matrix-black hover:bg-matrix-light border border-matrix-green'}`, children: [_jsx(FaUserPlus, { className: "text-xs" }), followedUsers.has(user.id) ? 'Following' : 'Follow'] })] }) }, user.id))) })] }));
}
