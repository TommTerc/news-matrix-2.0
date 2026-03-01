import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaThumbsUp, FaThumbsDown, FaComment, FaSpinner, FaTimes, FaClock, FaRetweet } from 'react-icons/fa';
import { format } from 'date-fns';
import commentService from '../services/commentService';
import truthService from '../services/truthService';
import repostService from '../services/repostService';
import { supabase } from '../services/supabaseClient';
import activityLogService from '../services/activityLogService';
export default function StoryTimeline() {
    const [searchParams] = useSearchParams();
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [truthStats, setTruthStats] = useState({
        truthful: 0,
        misleading: 0,
        abstain: 0,
        total: 0,
        averageRating: 0
    });
    const [userRating, setUserRating] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [ratingLoading, setRatingLoading] = useState(false);
    const [hasReposted, setHasReposted] = useState(false);
    const [repostLoading, setRepostLoading] = useState(false);
    const [showRepostForm, setShowRepostForm] = useState(false);
    const [repostCaption, setRepostCaption] = useState('');
    // Get article data from URL params
    useEffect(() => {
        const title = searchParams.get('title');
        const description = searchParams.get('description');
        const source = searchParams.get('source');
        const publishedAt = searchParams.get('publishedAt');
        const urlToImage = searchParams.get('urlToImage');
        const url = searchParams.get('url');
        if (url) {
            // If we have full article data, use it
            if (title && source) {
                setArticle({
                    title,
                    description: description || '',
                    source: { name: source },
                    publishedAt: publishedAt || new Date().toISOString(),
                    urlToImage,
                    url
                });
            }
            else {
                // If only URL is provided (from profile comments), create minimal article
                // The URL will be used to fetch comments
                setArticle({
                    title: 'Article',
                    description: 'Loading article details...',
                    source: { name: 'Unknown Source' },
                    publishedAt: new Date().toISOString(),
                    urlToImage: undefined,
                    url
                });
            }
        }
    }, [searchParams]);
    // Load comments and truth stats
    useEffect(() => {
        const loadData = async () => {
            if (!article?.url)
                return;
            try {
                const articleUrl = article.url;
                // Log article view
                await activityLogService.logArticleView(articleUrl);
                const [commentsData, statsData] = await Promise.all([
                    commentService.getComments(articleUrl),
                    truthService.getTruthStats(articleUrl)
                ]);
                setComments(commentsData);
                setTruthStats(statsData);
                // Get current user
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                setUser(currentUser);
                // Get user's rating if authenticated
                if (currentUser) {
                    const rating = await truthService.getUserRating(articleUrl);
                    setUserRating(rating);
                    // Check if user has reposted this article
                    const reposted = await repostService.hasReposted(articleUrl);
                    setHasReposted(reposted);
                }
            }
            catch (err) {
                console.error('Error loading data:', err);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, [article]);
    if (!article) {
        return (_jsx("div", { className: "min-h-screen bg-matrix-black text-matrix-green flex items-center justify-center", children: _jsx("p", { children: "Article not found" }) }));
    }
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user)
            return;
        setSubmittingComment(true);
        try {
            const result = await commentService.addComment(article.url, newComment);
            if (result) {
                // Log comment creation
                await activityLogService.logCommentCreate(article.url, result.id);
                setComments([result, ...comments]);
                setNewComment('');
            }
        }
        catch (err) {
            console.error('Error submitting comment:', err);
        }
        finally {
            setSubmittingComment(false);
        }
    };
    const handleRating = async (rating) => {
        if (!user) {
            alert('Please sign in to rate this article');
            return;
        }
        setRatingLoading(true);
        try {
            const success = await truthService.submitRating(article.url, rating);
            if (success) {
                // Log truth rating
                await activityLogService.logTruthRating(article.url, rating);
                setUserRating(rating);
                const stats = await truthService.getTruthStats(article.url);
                setTruthStats(stats);
            }
        }
        catch (err) {
            console.error('Error rating article:', err);
        }
        finally {
            setRatingLoading(false);
        }
    };
    const handleDeleteComment = async (commentId) => {
        try {
            const success = await commentService.deleteComment(commentId);
            if (success) {
                setComments(comments.filter(c => c.id !== commentId));
            }
        }
        catch (err) {
            console.error('Error deleting comment:', err);
        }
    };
    const handleRepost = async () => {
        if (!user || !article) {
            alert('Please sign in to repost');
            return;
        }
        setRepostLoading(true);
        try {
            const success = await repostService.repostArticle(article.url, {
                title: article.title,
                description: article.description,
                image: article.urlToImage || undefined,
                source: article.source.name
            }, repostCaption || undefined);
            if (success) {
                setHasReposted(true);
                setShowRepostForm(false);
                setRepostCaption('');
                alert('Article reposted to your profile!');
            }
            else {
                alert('Failed to repost article');
            }
        }
        catch (err) {
            console.error('Error reposting:', err);
            alert('Error reposting article');
        }
        finally {
            setRepostLoading(false);
        }
    };
    const handleRemoveRepost = async () => {
        if (!article)
            return;
        try {
            const success = await repostService.deleteRepost(article.url);
            if (success) {
                setHasReposted(false);
                alert('Repost removed');
            }
        }
        catch (err) {
            console.error('Error removing repost:', err);
        }
    };
    const getTruthColor = (rating) => {
        if (rating > 0.3)
            return 'text-green-500';
        if (rating < -0.3)
            return 'text-red-500';
        return 'text-yellow-500';
    };
    const getTruthLabel = (rating) => {
        if (rating > 0.3)
            return 'Generally Trustworthy';
        if (rating < -0.3)
            return 'Potentially Misleading';
        return 'Mixed Opinions';
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center text-matrix-green hover:text-matrix-light mb-6", children: [_jsx(FaArrowLeft, { className: "mr-2" }), "Back to Feed"] }), _jsxs("article", { className: "border border-matrix-green/30 rounded-lg p-6 bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 mb-6", children: [article.urlToImage && (_jsx("img", { src: article.urlToImage, alt: article.title, className: "w-full h-64 object-cover rounded-lg mb-4 border border-matrix-green/30" })), _jsx("h1", { className: "text-3xl font-bold mb-3", children: article.title }), _jsxs("div", { className: "flex items-center text-matrix-green/70 mb-4 gap-4", children: [_jsx("span", { className: "font-semibold", children: article.source.name }), _jsx("span", { children: "\u2022" }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FaClock, { size: 14 }), format(new Date(article.publishedAt), 'MMM dd, yyyy')] })] }), _jsx("p", { className: "text-lg text-matrix-green/90", children: article.description }), _jsx("a", { href: article.url, target: "_blank", rel: "noopener noreferrer", className: "inline-block mt-4 px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors", children: "Read Full Article \u2192" }), _jsx("div", { className: "flex gap-2 mt-4", children: hasReposted ? (_jsxs("button", { onClick: handleRemoveRepost, className: "px-4 py-2 bg-matrix-green/30 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/20 transition-colors flex items-center gap-2", children: [_jsx(FaRetweet, {}), "Reposted"] })) : (_jsxs("button", { onClick: () => setShowRepostForm(!showRepostForm), className: "px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors flex items-center gap-2", children: [_jsx(FaRetweet, {}), "Repost"] })) }), showRepostForm && (_jsxs("div", { className: "mt-4 p-4 bg-matrix-dark/50 border border-matrix-green/30 rounded-lg", children: [_jsx("textarea", { value: repostCaption, onChange: (e) => setRepostCaption(e.target.value), placeholder: "Add a caption (optional)...", className: "w-full bg-matrix-black/80 border border-matrix-green/30 rounded p-2 text-matrix-green placeholder-matrix-green/50 focus:outline-none focus:border-matrix-green mb-3", rows: 3 }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: handleRepost, disabled: repostLoading, className: "px-4 py-2 bg-matrix-green text-matrix-black rounded hover:bg-matrix-light transition-colors disabled:opacity-50 flex items-center gap-2 font-bold", children: [repostLoading ? _jsx(FaSpinner, { className: "animate-spin" }) : _jsx(FaRetweet, {}), "Repost to Profile"] }), _jsx("button", { onClick: () => {
                                                setShowRepostForm(false);
                                                setRepostCaption('');
                                            }, className: "px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/10 transition-colors", children: "Cancel" })] })] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6", children: [_jsxs("div", { className: "lg:col-span-1 border border-matrix-green/30 rounded-lg p-4 bg-black/40", children: [_jsxs("h2", { className: "text-xl font-bold text-matrix-green mb-4 flex items-center gap-2", children: [_jsx(FaThumbsUp, { size: 18 }), "Truth Check"] }), _jsxs("div", { className: "mb-6 space-y-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "text-sm text-matrix-green/60", children: "Trustworthy" }), _jsx("span", { className: "text-sm text-matrix-green", children: truthStats.truthful })] }), _jsx("div", { className: "h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden", children: _jsx("div", { className: "h-full bg-green-500/50 transition-all", style: {
                                                            width: `${truthStats.total > 0
                                                                ? (truthStats.truthful / truthStats.total) * 100
                                                                : 0}%`
                                                        } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "text-sm text-matrix-green/60", children: "Misleading" }), _jsx("span", { className: "text-sm text-matrix-green", children: truthStats.misleading })] }), _jsx("div", { className: "h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden", children: _jsx("div", { className: "h-full bg-red-500/50 transition-all", style: {
                                                            width: `${truthStats.total > 0
                                                                ? (truthStats.misleading / truthStats.total) * 100
                                                                : 0}%`
                                                        } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "text-sm text-matrix-green/60", children: "Undecided" }), _jsx("span", { className: "text-sm text-matrix-green", children: truthStats.abstain })] }), _jsx("div", { className: "h-2 bg-black/60 rounded border border-matrix-green/20 overflow-hidden", children: _jsx("div", { className: "h-full bg-yellow-500/50 transition-all", style: {
                                                            width: `${truthStats.total > 0
                                                                ? (truthStats.abstain / truthStats.total) * 100
                                                                : 0}%`
                                                        } }) })] })] }), _jsxs("div", { className: `text-center mb-4 p-3 bg-black/60 rounded border border-matrix-green/20`, children: [_jsx("p", { className: `font-semibold ${getTruthColor(truthStats.averageRating)}`, children: getTruthLabel(truthStats.averageRating) }), _jsxs("p", { className: "text-xs text-matrix-green/60 mt-1", children: [truthStats.total, " ", truthStats.total === 1 ? 'rating' : 'ratings'] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-matrix-green/60 mb-3", children: "Your assessment:" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => handleRating(1), disabled: ratingLoading, className: `flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded transition-colors ${userRating === 1
                                                        ? 'bg-green-500/30 text-green-400 border border-green-500'
                                                        : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'} disabled:opacity-50`, children: [_jsx(FaThumbsUp, { size: 14 }), "True"] }), _jsx("button", { onClick: () => handleRating(0), disabled: ratingLoading, className: `flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded transition-colors ${userRating === 0
                                                        ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500'
                                                        : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'} disabled:opacity-50`, children: "\u2212" }), _jsxs("button", { onClick: () => handleRating(-1), disabled: ratingLoading, className: `flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm rounded transition-colors ${userRating === -1
                                                        ? 'bg-red-500/30 text-red-400 border border-red-500'
                                                        : 'bg-black/40 text-matrix-green/60 border border-matrix-green/20 hover:border-matrix-green/40'} disabled:opacity-50`, children: [_jsx(FaThumbsDown, { size: 14 }), "False"] })] }), !user && (_jsx("p", { className: "text-xs text-matrix-green/50 mt-2 text-center italic", children: "Sign in to rate" }))] })] }), _jsxs("div", { className: "lg:col-span-2", children: [user && (_jsxs("form", { onSubmit: handleSubmitComment, className: "mb-6 border border-matrix-green/30 rounded-lg p-4 bg-black/40", children: [_jsxs("h3", { className: "font-semibold text-matrix-green mb-3 flex items-center gap-2", children: [_jsx(FaComment, { size: 16 }), "Add Your Thoughts"] }), _jsx("textarea", { value: newComment, onChange: (e) => setNewComment(e.target.value), placeholder: "Share your thoughts on this article...", className: "w-full px-3 py-2 bg-black/60 text-matrix-green border border-matrix-green/30 rounded mb-3 placeholder-matrix-green/40 focus:outline-none focus:border-matrix-green", rows: 3, disabled: submittingComment }), _jsx("button", { type: "submit", disabled: !newComment.trim() || submittingComment, className: "px-4 py-2 bg-matrix-green/20 text-matrix-green border border-matrix-green rounded hover:bg-matrix-green/30 transition-colors disabled:opacity-50", children: submittingComment ? (_jsx(FaSpinner, { className: "inline animate-spin mr-2" })) : ('Post Comment') })] })), !user && (_jsx("div", { className: "mb-6 p-4 bg-black/40 border border-matrix-green/30 rounded text-center", children: _jsx("p", { className: "text-matrix-green/60", children: "Sign in to comment on this article" }) })), _jsx("div", { className: "space-y-4 max-h-96 overflow-y-auto", children: loading ? (_jsx("div", { className: "flex justify-center items-center py-8", children: _jsx(FaSpinner, { className: "animate-spin text-matrix-green text-2xl" }) })) : comments.length === 0 ? (_jsx("div", { className: "text-center text-matrix-green/60 py-8", children: _jsx("p", { children: "No comments yet. Be the first to share your thoughts!" }) })) : (comments.map((comment) => (_jsxs("div", { className: "border border-matrix-green/20 rounded p-3 bg-black/30 hover:bg-black/40 transition-colors", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx("p", { className: "text-sm font-semibold text-matrix-green", children: comment.display_name || comment.username || 'Anonymous' }), _jsxs("p", { className: "text-xs text-matrix-green/60", children: ["@", comment.username || 'user', " \u2022 ", new Date(comment.created_at).toLocaleDateString()] })] }), user?.id === comment.user_id && (_jsx("button", { onClick: () => handleDeleteComment(comment.id), className: "text-red-400 hover:text-red-300 transition-colors", children: _jsx(FaTimes, { size: 14 }) }))] }), _jsx("p", { className: "text-sm text-matrix-green", children: comment.content })] }, comment.id)))) })] })] })] }) }));
}
