import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaBell, FaHeart, FaComment, FaRetweet, FaEllipsisH } from 'react-icons/fa';
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
export default function Notifications() {
    const [activeTab, setActiveTab] = useState('all');
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
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return _jsx(FaHeart, { className: "text-pink-500" });
            case 'comment':
                return _jsx(FaComment, { className: "text-blue-500" });
            case 'share':
                return _jsx(FaRetweet, { className: "text-green-500" });
            default:
                return _jsx(FaBell, { className: "text-matrix-green" });
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-matrix-black/40 backdrop-blur-[2px] font-mono", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "sticky top-16 bg-matrix-black/95 backdrop-blur-sm border-b border-matrix-green/30 z-10", children: [_jsx("h1", { className: "text-xl font-bold p-4 text-matrix-green", children: "Notifications" }), _jsx("div", { className: "flex", children: ['all', 'mentions', 'likes', 'shares'].map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab), className: `flex-1 py-4 text-center relative transition-colors ${activeTab === tab
                                    ? 'text-matrix-light'
                                    : 'text-matrix-green/60 hover:text-matrix-green'}`, children: [tab.charAt(0).toUpperCase() + tab.slice(1), activeTab === tab && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-matrix-light" }))] }, tab))) })] }), _jsx("div", { className: "divide-y divide-matrix-green/30", children: getFilteredNotifications().map((notification) => (_jsxs("div", { className: "p-4 hover:bg-matrix-green/5 transition-colors flex gap-4", children: [_jsx("div", { className: "w-12 h-12 flex-shrink-0", children: _jsx("div", { className: "w-8 h-8 flex items-center justify-center text-lg", children: getNotificationIcon(notification.type) }) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("img", { src: notification.user.avatar, alt: notification.user.name, className: "w-5 h-5 rounded-full" }), _jsx("span", { className: "font-bold text-matrix-green", children: notification.user.name }), _jsx("span", { className: "text-matrix-green/60", children: notification.user.handle })] }), _jsx("p", { className: "text-matrix-green/80 mb-2", children: notification.content }), notification.comment && (_jsx("div", { className: "bg-matrix-green/5 border border-matrix-green/30 rounded-lg p-3 mb-2", children: _jsx("p", { className: "text-matrix-green/80", children: notification.comment }) })), _jsx("div", { className: "text-sm text-matrix-green/60", children: notification.postPreview })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "text-sm text-matrix-green/60", children: [formatDistanceToNow(notification.timestamp), " ago"] }), _jsx("button", { className: "text-matrix-green/60 hover:text-matrix-light", children: _jsx(FaEllipsisH, {}) })] })] }) })] }, notification.id))) })] }) }));
}
