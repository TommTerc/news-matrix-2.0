import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
export default function NewsCard({ article, index }) {
    const cardId = `${article.publishedAt}-${index}`;
    // Create query params for StoryTimeline
    const storyParams = new URLSearchParams({
        title: article.title,
        source: article.source.name,
        description: article.description || '',
        publishedAt: article.publishedAt,
        url: article.url,
        ...(article.urlToImage && { urlToImage: article.urlToImage })
    });
    return (_jsx("article", { className: "border border-matrix-green/30 rounded-lg overflow-hidden hover:border-matrix-green transition-all group bg-gradient-to-b from-gray-900/80 via-gray-800/85 to-gray-900/80 hover:shadow-lg hover:shadow-matrix-green/20", children: _jsx(Link, { to: `/story?${storyParams.toString()}`, children: _jsxs("div", { className: "p-4", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsxs("span", { className: "text-matrix-green/60 text-sm flex items-center gap-1", children: [_jsx(FaRegClock, {}), " ", formatDistanceToNow(new Date(article.publishedAt)), " ago"] }) }), _jsx("h2", { className: "text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-matrix-green via-matrix-light to-matrix-green group-hover:from-matrix-light group-hover:via-matrix-green group-hover:to-matrix-light transition-all", children: article.title }), article.description && (_jsx("p", { className: "text-matrix-green/80 mb-4", children: article.description })), _jsxs("div", { className: "flex items-center gap-2 text-matrix-green/60 text-sm", children: [_jsx("span", { className: "text-xl", children: article.source.symbol }), _jsx("span", { children: article.source.name })] })] }) }) }, cardId));
}
