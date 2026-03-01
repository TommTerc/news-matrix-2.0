import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChartLine, FaRegNewspaper, FaSpinner } from 'react-icons/fa';
import { mockNews } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';
import activityLogService from '../services/activityLogService';
// Temporary mock data until the trending service is fully configured
const mockTrends = [
    { id: '1', name: 'AI Revolution', tweetCount: 245000, category: 'Technology', source: 'twitter' },
    { id: '2', name: 'Climate Action', tweetCount: 182000, category: 'Environment', source: 'google' },
    { id: '3', name: 'Digital Privacy', tweetCount: 156000, category: 'Technology', source: 'twitter' },
    { id: '4', name: 'Future of Work', tweetCount: 134000, category: 'Business', source: 'google' },
    { id: '5', name: 'Space Exploration', tweetCount: 98000, category: 'Science', source: 'twitter' },
];
export default function Explore() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('foryou');
    const [loading] = useState(false);
    const formatCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };
    const handleNewsClick = (newsItem) => {
        activityLogService.logArticleView(newsItem.id).catch(err => console.error('Error logging article view:', err));
    };
    const filteredNews = mockNews.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase())));
    const renderTrendingTopics = () => {
        if (loading) {
            return (_jsx("div", { className: "flex justify-center items-center py-8", children: _jsx(FaSpinner, { className: "animate-spin text-2xl text-matrix-green" }) }));
        }
        return (_jsx("div", { className: "divide-y divide-matrix-green/30", children: mockTrends.map((topic) => (_jsxs("div", { className: "p-4 hover:bg-matrix-green/10 transition-colors cursor-pointer", children: [_jsxs("div", { className: "text-sm text-matrix-green/60 mb-1", children: ["Trending in ", topic.category] }), _jsx("div", { className: "font-bold mb-1", children: topic.name }), _jsxs("div", { className: "text-sm text-matrix-green/60", children: [formatCount(topic.tweetCount), " ", topic.source === 'twitter' ? 'tweets' : 'mentions'] })] }, topic.id))) }));
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green pt-16", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("div", { className: "sticky top-16 bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 py-4 z-10", children: _jsxs("div", { className: "max-w-2xl mx-auto relative", children: [_jsxs("div", { className: "relative flex items-center", children: [_jsx(FaSearch, { className: "absolute left-4 text-matrix-green/60" }), _jsx("input", { type: "search", placeholder: "Search News Matrix", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded-full pl-12 pr-4 py-3 text-matrix-green focus:outline-none focus:border-matrix-green transition-all hover:border-matrix-green/60 placeholder-matrix-green/40" })] }), _jsx("div", { className: "absolute inset-0 rounded-full bg-matrix-green/5 filter blur-xl pointer-events-none" })] }) }), _jsx("div", { className: "border-b border-matrix-green/30 mt-4", children: _jsxs("div", { className: "flex space-x-8", children: [_jsxs("button", { onClick: () => setActiveTab('foryou'), className: `pb-4 relative ${activeTab === 'foryou' ? 'text-matrix-light' : 'text-matrix-green/60 hover:text-matrix-green'}`, children: ["For you", activeTab === 'foryou' && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-matrix-light rounded-t" }))] }), _jsxs("button", { onClick: () => setActiveTab('trending'), className: `pb-4 relative ${activeTab === 'trending' ? 'text-matrix-light' : 'text-matrix-green/60 hover:text-matrix-green'}`, children: ["Trending", activeTab === 'trending' && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-matrix-light rounded-t" }))] }), _jsxs("button", { onClick: () => setActiveTab('news'), className: `pb-4 relative ${activeTab === 'news' ? 'text-matrix-light' : 'text-matrix-green/60 hover:text-matrix-green'}`, children: ["News", activeTab === 'news' && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-matrix-light rounded-t" }))] })] }) }), _jsxs("div", { className: "py-4", children: [activeTab === 'foryou' && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-matrix-dark/20 rounded-lg border border-matrix-green/30 overflow-hidden", children: [_jsx("h2", { className: "text-xl font-bold p-4 border-b border-matrix-green/30", children: "Trending Topics" }), renderTrendingTopics()] }), _jsx("div", { className: "space-y-4", children: filteredNews.map((item) => (_jsx(Link, { to: `/news/${item.id}`, onClick: () => handleNewsClick(item), className: "block bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 rounded-lg border border-matrix-green/30 overflow-hidden hover:border-matrix-green hover:shadow-lg hover:shadow-matrix-green/20 transition-all", children: _jsxs("div", { className: "flex", children: [_jsxs("div", { className: "flex-1 p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-matrix-green/60 mb-2", children: [_jsx("span", { children: item.source }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [formatDistanceToNow(item.timestamp), " ago"] })] }), _jsx("h3", { className: "text-lg font-bold mb-2", children: item.title }), _jsx("p", { className: "text-matrix-green/80", children: item.description })] }), item.image && (_jsx("div", { className: "w-48 h-48", children: _jsx("img", { src: item.image, alt: item.title, className: "w-full h-full object-cover" }) }))] }) }, item.id))) })] })), activeTab === 'trending' && (_jsx("div", { className: "space-y-4", children: filteredNews
                                .filter(item => item.trending)
                                .map((item) => (_jsxs(Link, { to: `/news/${item.id}`, className: "block bg-matrix-dark/20 rounded-lg border border-matrix-green/30 overflow-hidden hover:border-matrix-green transition-colors", children: [_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(FaChartLine, { className: "text-matrix-light" }), _jsxs("span", { className: "text-sm text-matrix-green/60", children: ["Trending with ", formatCount(item.views), " views"] })] }), _jsx("h3", { className: "text-lg font-bold mb-2", children: item.title }), _jsx("p", { className: "text-matrix-green/80", children: item.description })] }), item.image && (_jsx("img", { src: item.image, alt: item.title, className: "w-full h-48 object-cover" }))] }, item.id))) })), activeTab === 'news' && (_jsx("div", { className: "space-y-4", children: filteredNews.map((item) => (_jsxs(Link, { to: `/news/${item.id}`, className: "block bg-matrix-dark/20 rounded-lg border border-matrix-green/30 overflow-hidden hover:border-matrix-green transition-colors", children: [_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-matrix-green/60 mb-2", children: [_jsx(FaRegNewspaper, {}), _jsx("span", { children: item.source }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [formatDistanceToNow(item.timestamp), " ago"] })] }), _jsx("h3", { className: "text-lg font-bold mb-2", children: item.title }), _jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: item.keywords.map((keyword, index) => (_jsxs("span", { className: "bg-matrix-green/20 text-matrix-green px-2 py-1 rounded-full text-sm", children: ["#", keyword] }, index))) })] }), item.image && (_jsx("img", { src: item.image, alt: item.title, className: "w-full h-48 object-cover" }))] }, item.id))) }))] })] }) }));
}
