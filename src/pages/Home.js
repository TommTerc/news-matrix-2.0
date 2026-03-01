import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import newsApi from '../services/newsApi';
import activityLogService from '../services/activityLogService';
import CongressWidget from '../components/CongressWidget';
import SuggestedUsers from '../components/SuggestedUsers';
export default function Home() {
    const [category, setCategory] = useState();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    React.useEffect(() => {
        setLoading(true);
        setError(null);
        newsApi.getTopHeadlines({
            country: 'us',
            category: category,
            pageSize: 12
        })
            .then((res) => {
            setNews(res.articles);
            setLoading(false);
        })
            .catch((err) => {
            setError('Failed to load news.');
            setLoading(false);
        });
    }, [category]);
    // Handle article click to log activity
    const handleArticleClick = (article) => {
        activityLogService.logArticleView(article.url).catch(err => console.error('Error logging article view:', err));
    };
    return (_jsx("div", { className: "min-h-screen bg-matrix-black/40 backdrop-blur-[2px] font-mono", children: _jsxs("div", { className: "w-full mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [_jsx("div", { className: "flex gap-6 mb-12 overflow-x-auto pb-2", children: ['all', 'technology', 'science', 'environment', 'AI'].map((cat) => (_jsx("button", { onClick: () => setCategory(cat === 'all' ? undefined : cat.toLowerCase()), className: `px-6 py-2 rounded-full border transition-colors whitespace-nowrap ${(category === cat || (!category && cat === 'all'))
                            ? 'bg-matrix-green text-matrix-black border-matrix-green'
                            : 'border-matrix-green/30 text-matrix-green hover:border-matrix-green'}`, children: cat.charAt(0).toUpperCase() + cat.slice(1) }, `category-${cat}`))) }), loading && _jsx("div", { className: "text-matrix-green", children: "Loading news..." }), error && _jsx("div", { className: "text-red-500", children: error }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: news.map((article, idx) => {
                                    const storyParams = new URLSearchParams({
                                        title: article.title,
                                        source: article.source?.name || 'Unknown',
                                        description: article.description || '',
                                        publishedAt: article.publishedAt,
                                        url: article.url,
                                        ...(article.urlToImage && { urlToImage: article.urlToImage })
                                    });
                                    return (_jsxs(Link, { to: `/story?${storyParams.toString()}`, onClick: () => handleArticleClick(article), className: "energy-container group block bg-black/40 hover:border-matrix-green transition-all", children: [_jsx("div", { className: "relative h-56 overflow-hidden", children: _jsx("img", { src: article.urlToImage || 'https://via.placeholder.com/400x225?text=No+Image', alt: article.title, className: "w-full h-full object-cover transition-transform group-hover:scale-105" }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-3 text-sm text-matrix-green/60 mb-3", children: [_jsx("span", { children: article.source?.name }), _jsx("span", { children: "\u2022" }), _jsx(FaRegClock, { className: "text-xs" }), _jsxs("span", { children: [formatDistanceToNow(new Date(article.publishedAt)), " ago"] })] }), _jsx("h2", { className: "text-xl font-bold mb-3 text-matrix-green group-hover:text-matrix-light transition-colors", children: article.title }), _jsx("p", { className: "text-matrix-green/80 text-sm mb-6 line-clamp-2", children: article.description })] })] }, article.url || idx));
                                }) }) }), _jsx("aside", { className: "lg:col-span-1", children: _jsxs("div", { className: "sticky top-20", children: [_jsx(CongressWidget, { congress: 119, billType: "hr", billNumber: "30" }), _jsx(SuggestedUsers, {})] }) })] })] }) }));
}
