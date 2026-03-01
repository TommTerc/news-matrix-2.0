import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { FaRegBookmark, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import bookmarkService from '../services/bookmarkService';
export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                setLoading(true);
                const userBookmarks = await bookmarkService.getUserBookmarks();
                setBookmarks(userBookmarks);
            }
            catch (err) {
                console.error('Error loading bookmarks:', err);
                setError('Failed to load bookmarks');
            }
            finally {
                setLoading(false);
            }
        };
        loadBookmarks();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-12", children: _jsx("div", { className: "flex justify-center items-center py-12", children: _jsx(FaSpinner, { className: "animate-spin text-3xl text-matrix-green" }) }) }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("h1", { className: "text-3xl font-bold text-matrix-green flex items-center gap-3 mb-2", children: [_jsx(FaRegBookmark, { className: "text-2xl" }), "Saved Articles"] }), _jsx("p", { className: "text-matrix-green/60", children: "Your bookmarked articles" })] }), error && (_jsx("div", { className: "bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6", children: error })), bookmarks.length === 0 ? (_jsxs("div", { className: "bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-12 text-center", children: [_jsx(FaRegBookmark, { className: "text-4xl text-matrix-green/40 mx-auto mb-4" }), _jsx("p", { className: "text-matrix-green/60", children: "No saved articles yet" }), _jsx("p", { className: "text-sm text-matrix-green/40 mt-2", children: "Bookmark articles while browsing to save them here" })] })) : (_jsx("div", { className: "space-y-4", children: bookmarks.map((bookmark) => (_jsx("div", { className: "bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-4 hover:border-matrix-green transition-colors group", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(FaRegBookmark, { className: "text-matrix-green" }), _jsx("span", { className: "text-xs text-matrix-green/50", children: format(new Date(bookmark.created_at), 'MMM dd, yyyy HH:mm') })] }), _jsx("p", { className: "text-sm text-matrix-green/60 font-mono break-all hover:text-matrix-green transition-colors", children: bookmark.article_url })] }), _jsxs("a", { href: bookmark.article_url, target: "_blank", rel: "noopener noreferrer", className: "flex-shrink-0 px-4 py-2 bg-matrix-green/10 border border-matrix-green/30 rounded hover:bg-matrix-green/20 hover:border-matrix-green transition-all flex items-center gap-2 group-hover:text-matrix-green text-matrix-green/60", children: [_jsx(FaArrowRight, { className: "text-sm" }), _jsx("span", { className: "text-sm", children: "Open" })] })] }) }, bookmark.id))) }))] }));
}
