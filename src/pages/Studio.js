import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { FaImage, FaTag, FaTimes, FaCode, FaPlus } from 'react-icons/fa';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import activityLogService from '../services/activityLogService';
export default function Studio() {
    const [content, setContent] = useState({
        title: '',
        description: '',
        source: '',
        image: '',
        keywords: [],
        trending: false,
        iframeUrl: '',
        embedType: null,
        embedOptions: {
            theme: 'dark',
            align: 'center',
            hideThread: false,
            hideMedia: false
        },
        timelineEvents: []
    });
    const [keyword, setKeyword] = useState('');
    const [preview, setPreview] = useState(null);
    const [showIframePreview, setShowIframePreview] = useState(false);
    const [showTimelineForm, setShowTimelineForm] = useState(false);
    const [timelineEvent, setTimelineEvent] = useState({
        type: 'update'
    });
    const [timelineView, setTimelineView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const tweetContainerRef = useRef(null);
    // Load Twitter widget script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = () => {
            if (showIframePreview && content.embedType === 'twitter') {
                loadTweet();
            }
        };
        if (!window.twttr) {
            document.head.appendChild(script);
            return () => {
                document.head.removeChild(script);
            };
        }
    }, []);
    // Function to extract tweet ID from URL
    const extractTweetId = (url) => {
        const match = url.match(/status\/(\d+)/);
        return match ? match[1] : null;
    };
    // Function to detect embed type from URL
    const detectEmbedType = (url) => {
        if (!url)
            return null;
        if (url.includes('twitter.com') || url.includes('x.com'))
            return 'twitter';
        return 'iframe';
    };
    // Function to load tweet
    const loadTweet = async () => {
        if (!content.iframeUrl || !tweetContainerRef.current)
            return;
        const tweetId = extractTweetId(content.iframeUrl);
        if (!tweetId)
            return;
        // Clear previous content
        tweetContainerRef.current.innerHTML = '';
        if (window.twttr) {
            try {
                await window.twttr.widgets.createTweet(tweetId, tweetContainerRef.current, {
                    theme: content.embedOptions.theme,
                    align: content.embedOptions.align,
                    conversation: content.embedOptions.hideThread ? 'none' : 'all',
                    cards: content.embedOptions.hideMedia ? 'hidden' : 'visible'
                });
            }
            catch (error) {
                console.error('Error loading tweet:', error);
                tweetContainerRef.current.innerHTML = '<p class="text-red-500">Error loading tweet. Please check the URL and try again.</p>';
            }
        }
    };
    // Effect to load tweet when URL changes or preview is shown
    useEffect(() => {
        if (showIframePreview && content.embedType === 'twitter') {
            loadTweet();
        }
    }, [showIframePreview, content.iframeUrl, content.embedOptions]);
    const handleUrlChange = (url) => {
        const embedType = detectEmbedType(url);
        setContent(prev => ({
            ...prev,
            iframeUrl: url,
            embedType
        }));
    };
    const handleIframePreview = () => {
        if (content.iframeUrl) {
            setShowIframePreview(true);
        }
    };
    const getDateRange = () => {
        switch (timelineView) {
            case 'week':
                return {
                    start: startOfWeek(selectedDate),
                    end: endOfWeek(selectedDate)
                };
            case 'month':
                return {
                    start: startOfMonth(selectedDate),
                    end: endOfMonth(selectedDate)
                };
            case 'year':
                return {
                    start: startOfYear(selectedDate),
                    end: endOfYear(selectedDate)
                };
        }
    };
    const getFilteredEvents = () => {
        const { start, end } = getDateRange();
        return content.timelineEvents.filter(event => {
            const eventDate = new Date(event.timestamp);
            return eventDate >= start && eventDate <= end;
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Content to submit:', content);
        // Log post creation
        const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        activityLogService.logPostCreate(postId).catch(err => console.error('Error logging post creation:', err));
        setContent({
            title: '',
            description: '',
            source: '',
            image: '',
            keywords: [],
            trending: false,
            iframeUrl: '',
            embedType: null,
            embedOptions: {
                theme: 'dark',
                align: 'center',
                hideThread: false,
                hideMedia: false
            },
            timelineEvents: []
        });
        setPreview(null);
        setShowIframePreview(false);
    };
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setContent({ ...content, image: file.name });
            };
            reader.readAsDataURL(file);
        }
    };
    const addKeyword = (e) => {
        if (e.key === 'Enter' && keyword.trim()) {
            e.preventDefault();
            if (!content.keywords.includes(keyword.trim())) {
                setContent({
                    ...content,
                    keywords: [...content.keywords, keyword.trim()]
                });
            }
            setKeyword('');
        }
    };
    const removeKeyword = (keywordToRemove) => {
        setContent({
            ...content,
            keywords: content.keywords.filter(k => k !== keywordToRemove)
        });
    };
    const handleAddTimelineEvent = () => {
        if (timelineEvent.title && timelineEvent.description && timelineEvent.timestamp) {
            const newEvent = {
                id: Date.now().toString(),
                title: timelineEvent.title,
                description: timelineEvent.description,
                timestamp: new Date(timelineEvent.timestamp),
                type: timelineEvent.type || 'update',
                image: timelineEvent.image || '',
                source: timelineEvent.source || content.source
            };
            setContent({
                ...content,
                timelineEvents: [...content.timelineEvents, newEvent].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
            });
            setTimelineEvent({ type: 'update' });
            setShowTimelineForm(false);
        }
    };
    const removeTimelineEvent = (id) => {
        setContent({
            ...content,
            timelineEvents: content.timelineEvents.filter(event => event.id !== id)
        });
    };
    // Function to render the appropriate embed
    const renderEmbed = () => {
        if (!content.iframeUrl)
            return null;
        if (content.embedType === 'twitter') {
            return (_jsxs("div", { children: [_jsxs("div", { className: "mb-4 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: content.embedOptions.hideThread, onChange: e => setContent(prev => ({
                                                    ...prev,
                                                    embedOptions: {
                                                        ...prev.embedOptions,
                                                        hideThread: e.target.checked
                                                    }
                                                })), className: "form-checkbox" }), "Hide conversation thread"] }), _jsxs("label", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", checked: content.embedOptions.hideMedia, onChange: e => setContent(prev => ({
                                                    ...prev,
                                                    embedOptions: {
                                                        ...prev.embedOptions,
                                                        hideMedia: e.target.checked
                                                    }
                                                })), className: "form-checkbox" }), "Hide media"] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("label", { className: "flex items-center gap-2", children: ["Theme:", _jsxs("select", { value: content.embedOptions.theme, onChange: e => setContent(prev => ({
                                                    ...prev,
                                                    embedOptions: {
                                                        ...prev.embedOptions,
                                                        theme: e.target.value
                                                    }
                                                })), className: "bg-matrix-dark border border-matrix-green/30 rounded p-1", children: [_jsx("option", { value: "dark", children: "Dark" }), _jsx("option", { value: "light", children: "Light" })] })] }), _jsxs("label", { className: "flex items-center gap-2", children: ["Alignment:", _jsxs("select", { value: content.embedOptions.align, onChange: e => setContent(prev => ({
                                                    ...prev,
                                                    embedOptions: {
                                                        ...prev.embedOptions,
                                                        align: e.target.value
                                                    }
                                                })), className: "bg-matrix-dark border border-matrix-green/30 rounded p-1", children: [_jsx("option", { value: "left", children: "Left" }), _jsx("option", { value: "center", children: "Center" }), _jsx("option", { value: "right", children: "Right" })] })] })] })] }), _jsx("div", { ref: tweetContainerRef, className: "flex justify-center" })] }));
        }
        return (_jsx("iframe", { src: content.iframeUrl, className: "w-full h-full min-h-[400px]", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }));
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green p-4", children: _jsxs("div", { className: "max-w-4xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-8", children: "Content Studio" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Title" }), _jsx("input", { type: "text", value: content.title, onChange: e => setContent({ ...content, title: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Enter article title", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Description" }), _jsx("textarea", { value: content.description, onChange: e => setContent({ ...content, description: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", rows: 4, placeholder: "Enter article description", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Source" }), _jsx("input", { type: "text", value: content.source, onChange: e => setContent({ ...content, source: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Enter content source", required: true })] }), _jsxs("div", { className: "border border-matrix-green/30 rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-bold", children: "Timeline Events" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex items-center gap-2 bg-matrix-dark/40 rounded-lg p-1", children: ['week', 'month', 'year'].map((view) => (_jsx("button", { type: "button", onClick: () => setTimelineView(view), className: `px-3 py-1 rounded ${timelineView === view
                                                            ? 'bg-matrix-green text-matrix-black'
                                                            : 'text-matrix-green hover:bg-matrix-green/20'}`, children: view.charAt(0).toUpperCase() + view.slice(1) }, view))) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: () => {
                                                                const { start } = getDateRange();
                                                                setSelectedDate(new Date(start.setDate(start.getDate() - 1)));
                                                            }, className: "p-2 hover:text-matrix-light", children: "\u2190" }), _jsx("span", { className: "text-sm", children: format(selectedDate, timelineView === 'week' ? "'Week of' MMM d, yyyy" :
                                                                timelineView === 'month' ? 'MMMM yyyy' :
                                                                    'yyyy') }), _jsx("button", { type: "button", onClick: () => {
                                                                const { end } = getDateRange();
                                                                setSelectedDate(new Date(end.setDate(end.getDate() + 1)));
                                                            }, className: "p-2 hover:text-matrix-light", children: "\u2192" })] }), _jsxs("button", { type: "button", onClick: () => setShowTimelineForm(true), className: "flex items-center gap-2 px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30", children: [_jsx(FaPlus, {}), " Add Event"] })] })] }), _jsx("div", { className: "space-y-4 mb-4", children: getFilteredEvents().length === 0 ? (_jsxs("div", { className: "text-center text-matrix-green/60 py-8", children: ["No events in this ", timelineView] })) : (getFilteredEvents().map(event => (_jsxs("div", { className: "flex items-start gap-4 p-4 border border-matrix-green/30 rounded-lg bg-matrix-dark/40", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: `px-2 py-1 rounded text-xs ${event.type === 'announcement' ? 'bg-blue-500/20 text-blue-400' :
                                                                    event.type === 'development' ? 'bg-purple-500/20 text-purple-400' :
                                                                        'bg-green-500/20 text-green-400'}`, children: event.type.toUpperCase() }), _jsx("span", { className: "text-matrix-green/60", children: format(event.timestamp, 'PPp') })] }), _jsx("h3", { className: "font-bold mb-1", children: event.title }), _jsx("p", { className: "text-sm text-matrix-green/80", children: event.description })] }), _jsx("button", { type: "button", onClick: () => removeTimelineEvent(event.id), className: "text-matrix-green/60 hover:text-matrix-light", children: _jsx(FaTimes, {}) })] }, event.id)))) }), showTimelineForm && (_jsx("div", { className: "fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-matrix-dark border border-matrix-green/30 rounded-lg p-6 max-w-lg w-full", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-xl font-bold", children: "Add Timeline Event" }), _jsx("button", { type: "button", onClick: () => setShowTimelineForm(false), className: "text-matrix-green hover:text-matrix-light", children: _jsx(FaTimes, {}) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Event Title" }), _jsx("input", { type: "text", value: timelineEvent.title || '', onChange: e => setTimelineEvent({ ...timelineEvent, title: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Description" }), _jsx("textarea", { value: timelineEvent.description || '', onChange: e => setTimelineEvent({ ...timelineEvent, description: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", rows: 3, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Timestamp" }), _jsx("input", { type: "datetime-local", value: timelineEvent.timestamp ? format(new Date(timelineEvent.timestamp), "yyyy-MM-dd'T'HH:mm") : '', onChange: e => setTimelineEvent({ ...timelineEvent, timestamp: new Date(e.target.value) }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Event Type" }), _jsxs("select", { value: timelineEvent.type, onChange: e => setTimelineEvent({ ...timelineEvent, type: e.target.value }), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", children: [_jsx("option", { value: "update", children: "Update" }), _jsx("option", { value: "announcement", children: "Announcement" }), _jsx("option", { value: "development", children: "Development" })] })] }), _jsxs("div", { className: "flex justify-end gap-2 mt-6", children: [_jsx("button", { type: "button", onClick: () => setShowTimelineForm(false), className: "px-4 py-2 text-matrix-green hover:text-matrix-light", children: "Cancel" }), _jsx("button", { type: "button", onClick: handleAddTimelineEvent, className: "px-4 py-2 bg-matrix-green text-matrix-black rounded hover:bg-matrix-light", children: "Add Event" })] })] })] }) }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Embed Content" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "url", value: content.iframeUrl, onChange: e => handleUrlChange(e.target.value), className: "flex-1 bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Enter URL to embed (Twitter or other)" }), _jsxs("button", { type: "button", onClick: handleIframePreview, className: "px-4 py-2 bg-matrix-green/20 text-matrix-green rounded hover:bg-matrix-green/30 flex items-center gap-2", children: [_jsx(FaCode, {}), "Preview"] })] }), showIframePreview && content.iframeUrl && (_jsxs("div", { className: "border border-matrix-green/30 rounded-lg overflow-hidden", children: [_jsxs("div", { className: "bg-matrix-dark p-2 text-sm flex justify-between items-center", children: [_jsx("span", { children: "Preview" }), _jsx("button", { type: "button", onClick: () => setShowIframePreview(false), className: "text-matrix-green hover:text-matrix-light", children: _jsx(FaTimes, {}) })] }), _jsx("div", { className: "bg-matrix-dark p-4", children: renderEmbed() })] }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Image" }), _jsxs("div", { className: "border-2 border-dashed border-matrix-green/30 rounded-lg p-6 text-center", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "hidden", id: "image-upload", required: true }), _jsxs("label", { htmlFor: "image-upload", className: "cursor-pointer flex flex-col items-center", children: [_jsx(FaImage, { className: "text-4xl mb-2" }), _jsx("span", { children: "Click to upload image" })] }), preview && (_jsx("div", { className: "mt-4", children: _jsx("img", { src: preview, alt: "Preview", className: "max-h-48 mx-auto rounded" }) }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-bold mb-2", children: "Keywords" }), _jsx("div", { className: "flex flex-wrap gap-2 mb-2", children: content.keywords.map(kw => (_jsxs("span", { className: "bg-matrix-green/20 text-matrix-green px-3 py-1 rounded-full flex items-center gap-2", children: [_jsx(FaTag, { className: "text-xs" }), kw, _jsx("button", { type: "button", onClick: () => removeKeyword(kw), className: "hover:text-matrix-light", children: _jsx(FaTimes, { className: "text-xs" }) })] }, kw))) }), _jsx("input", { type: "text", value: keyword, onChange: e => setKeyword(e.target.value), onKeyDown: addKeyword, className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-3 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Type keyword and press Enter" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "trending", checked: content.trending, onChange: e => setContent({ ...content, trending: e.target.checked }), className: "w-4 h-4 bg-matrix-dark border-matrix-green/30 rounded focus:ring-matrix-green" }), _jsx("label", { htmlFor: "trending", className: "text-sm font-bold", children: "Mark as trending" })] }), _jsx("button", { type: "submit", className: "w-full bg-matrix-green text-matrix-black font-bold py-3 px-6 rounded hover:bg-matrix-light transition-colors", children: "Publish Content" })] })] }) }));
}
