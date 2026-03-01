import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaHeart, FaComment, FaShare } from 'react-icons/fa';
import { format, formatDistanceToNow, isSameMonth } from 'date-fns';
import { mockNews, timelineEvents } from '../data/mockData';
import activityLogService from '../services/activityLogService';
import Comment from '../components/Comment';
export default function NewsDetail() {
    const { id } = useParams();
    const newsItem = mockNews.find(item => item.id === id);
    const events = timelineEvents[id || ''] || [];
    const [selectedDate, setSelectedDate] = useState(events.length > 0 ? events[0].timestamp : new Date());
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [hasLiked, setHasLiked] = useState(false);
    if (!newsItem) {
        return (_jsx("div", { className: "min-h-screen bg-matrix-black text-matrix-green flex items-center justify-center", children: "News item not found" }));
    }
    // Handle like button
    const handleLike = async () => {
        if (!hasLiked) {
            setHasLiked(true);
            await activityLogService.logArticleLike(newsItem.id);
        }
    };
    // Handle share button
    const handleShare = async () => {
        await activityLogService.logArticleShare(newsItem.id, 'internal');
        // Copy to clipboard for sharing
        const shareText = `Check out: ${newsItem.title}`;
        navigator.clipboard.writeText(shareText).catch(err => console.error('Failed to copy:', err));
    };
    // Get unique months from events
    const months = Array.from(new Set(events.map(event => format(event.timestamp, 'yyyy-MM')))).sort();
    // Group events by date
    const eventsByDate = events.reduce((acc, event) => {
        const date = format(event.timestamp, 'yyyy-MM-dd');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {});
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green p-4", children: _jsxs("div", { className: "max-w-6xl mx-auto", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center text-matrix-green hover:text-matrix-light mb-6", children: [_jsx(FaArrowLeft, { className: "mr-2" }), "Back to Feed"] }), _jsxs("article", { className: "border border-matrix-green/30 rounded-lg p-6 bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 mb-12 hover:shadow-lg hover:shadow-matrix-green/20 transition-all", children: [_jsx("img", { src: newsItem.image, alt: newsItem.title, className: "w-full h-96 object-cover rounded-lg mb-6 border border-matrix-green/30" }), _jsx("h1", { className: "text-3xl font-bold mb-4", children: newsItem.title }), _jsxs("div", { className: "flex items-center text-matrix-green/70 mb-6", children: [_jsx("span", { children: newsItem.source }), _jsx("span", { className: "mx-2", children: "\u2022" }), _jsxs("span", { children: [formatDistanceToNow(newsItem.timestamp), " ago"] })] }), _jsx("p", { className: "text-lg mb-6", children: newsItem.description }), _jsxs("div", { className: "flex items-center space-x-12 text-matrix-green/60 border-t border-matrix-green/30 pt-4", children: [_jsxs("button", { onClick: handleLike, className: "flex items-center space-x-2 hover:text-matrix-light transition-colors group", children: [_jsx(FaHeart, { className: `group-hover:scale-110 transition-transform ${hasLiked ? 'text-red-500' : ''}` }), _jsx("span", { children: newsItem.likes + (hasLiked ? 1 : 0) })] }), _jsxs("button", { className: "flex items-center space-x-2 hover:text-matrix-light transition-colors group", children: [_jsx(FaComment, { className: "group-hover:scale-110 transition-transform" }), _jsx("span", { children: newsItem.comments })] }), _jsxs("button", { onClick: handleShare, className: "flex items-center space-x-2 hover:text-matrix-light transition-colors group", children: [_jsx(FaShare, { className: "group-hover:scale-110 transition-transform" }), _jsx("span", { children: newsItem.shares })] })] })] }), _jsx("section", { className: "mb-12 overflow-hidden", children: _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-matrix-green matrix-text", children: "Sacred Timeline" }), _jsx("span", { className: "text-matrix-green/60", children: format(selectedDate, 'MMMM yyyy') })] }), _jsx("div", { className: "flex border-b border-matrix-green/30 relative mb-8", children: months.map((month, index) => (_jsxs("div", { className: "flex-1 relative pb-8", style: {
                                        animationDelay: `${index * 0.2}s`,
                                        opacity: 0,
                                        animation: 'timelineFlow 0.8s ease-out forwards'
                                    }, children: [_jsx("div", { className: "absolute bottom-full mb-2 font-bold timeline-content", children: format(new Date(month), 'MMMM yyyy') }), _jsx("div", { className: "absolute bottom-0 left-0 w-full flex items-center justify-start", children: events
                                                .filter(event => format(event.timestamp, 'yyyy-MM') === month)
                                                .map((event, eventIndex) => (_jsx("div", { className: "timeline-dot w-4 h-4 rounded-full border-2 transition-all transform hover:scale-125", style: {
                                                    left: `${(new Date(event.timestamp).getDate() - 1) * (100 / 31)}%`,
                                                    animationDelay: `${index * 0.2 + eventIndex * 0.1}s`,
                                                    borderColor: isSameMonth(event.timestamp, selectedDate)
                                                        ? '#00ff00'
                                                        : 'rgba(0, 255, 0, 0.3)',
                                                    backgroundColor: isSameMonth(event.timestamp, selectedDate)
                                                        ? '#00ff00'
                                                        : 'transparent'
                                                }, children: _jsx("div", { className: "absolute bottom-full mb-2 text-xs text-matrix-green/60 whitespace-nowrap transform -translate-x-1/2 left-1/2 timeline-content", children: format(event.timestamp, 'h:mm a') }) }, event.id))) }), _jsx("div", { className: "timeline-line absolute bottom-2 left-0 w-full", style: { animationDelay: `${index * 0.3}s` } })] }, month))) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: Object.entries(eventsByDate)
                                    .filter(([date]) => isSameMonth(new Date(date), selectedDate))
                                    .map(([date, dayEvents], groupIndex) => (_jsxs("div", { className: "timeline-event border border-matrix-green/30 rounded-lg overflow-hidden bg-matrix-dark/20", style: { animationDelay: `${groupIndex * 0.2}s` }, children: [_jsx("div", { className: "text-lg font-bold p-4 border-b border-matrix-green/30", children: format(new Date(date), 'MMMM d, yyyy') }), _jsx("div", { className: "p-4 space-y-4", children: dayEvents.map((event, eventIndex) => (_jsxs("div", { className: "timeline-content border border-matrix-green/30 rounded-lg p-4 bg-matrix-dark/40", style: { animationDelay: `${groupIndex * 0.2 + eventIndex * 0.1}s` }, children: [_jsx("img", { src: event.image, alt: event.title, className: "w-full h-48 object-cover rounded-lg mb-4 border border-matrix-green/30" }), _jsxs("div", { className: "mb-2", children: [_jsxs("div", { className: "flex justify-between items-center text-sm text-matrix-green/60 mb-2", children: [_jsx("span", { children: event.source }), _jsx("span", { children: format(event.timestamp, 'h:mm a') })] }), _jsx("h3", { className: "font-bold text-lg mb-1", children: event.title })] }), _jsx("p", { className: "text-matrix-green/80 text-sm mb-4", children: event.description })] }, event.id))) })] }, date))) })] }) }), selectedEvent && (_jsx("div", { className: "fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-matrix-dark border border-matrix-green/30 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-matrix-dark border-b border-matrix-green/30 p-4 flex justify-between items-center", children: [_jsx("h2", { className: "text-xl font-bold", children: selectedEvent.title }), _jsx("button", { onClick: () => setSelectedEvent(null), className: "text-matrix-green hover:text-matrix-light", children: "\u2715" })] }), _jsxs("div", { className: "p-6", children: [_jsx("img", { src: selectedEvent.image, alt: selectedEvent.title, className: "w-full h-64 object-cover rounded-lg mb-6 border border-matrix-green/30" }), _jsxs("div", { className: "flex justify-between items-center mb-4 text-matrix-green/60", children: [_jsx("span", { children: selectedEvent.source }), _jsx("span", { children: format(selectedEvent.timestamp, 'PPpp') })] }), _jsx("p", { className: "text-matrix-green mb-8", children: selectedEvent.description }), _jsxs("div", { className: "border-t border-matrix-green/30 pt-6", children: [_jsx("h3", { className: "text-xl font-bold mb-6", children: "Comments" }), _jsx("div", { className: "space-y-6", children: selectedEvent.comments?.map((comment) => (_jsx(Comment, { comment: comment }, comment.id))) }), _jsxs("form", { className: "mt-8", children: [_jsx("textarea", { className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Add a comment...", rows: 3 }), _jsx("div", { className: "flex justify-end mt-2", children: _jsx("button", { type: "submit", className: "px-4 py-2 bg-matrix-green text-matrix-black rounded hover:bg-matrix-light", children: "Comment" }) })] })] })] })] }) }))] }) }));
}
