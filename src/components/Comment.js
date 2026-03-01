import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaReply } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
export default function Comment({ comment, level = 0 }) {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(true);
    const handleSubmitReply = (e) => {
        e.preventDefault();
        // TODO: Implement reply submission
        setIsReplying(false);
        setReplyContent('');
    };
    return (_jsxs("div", { className: `border-l-2 border-matrix-green/30 pl-4 ${level > 0 ? 'ml-4' : ''}`, children: [_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-matrix-green/60 mb-2", children: [_jsx("span", { className: "font-bold text-matrix-green", children: comment.author }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [formatDistanceToNow(comment.timestamp), " ago"] })] }), _jsx("p", { className: "text-matrix-green mb-2", children: comment.content }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "hover:text-matrix-light", children: _jsx(FaArrowUp, {}) }), _jsx("span", { children: comment.upvotes - comment.downvotes }), _jsx("button", { className: "hover:text-matrix-light", children: _jsx(FaArrowDown, {}) })] }), _jsxs("button", { className: "flex items-center gap-1 hover:text-matrix-light", onClick: () => setIsReplying(!isReplying), children: [_jsx(FaReply, {}), "Reply"] }), comment.replies.length > 0 && (_jsxs("button", { className: "hover:text-matrix-light", onClick: () => setShowReplies(!showReplies), children: [showReplies ? 'Hide' : 'Show', " ", comment.replies.length, " replies"] }))] }), isReplying && (_jsxs("form", { onSubmit: handleSubmitReply, className: "mt-4", children: [_jsx("textarea", { value: replyContent, onChange: (e) => setReplyContent(e.target.value), className: "w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green focus:outline-none focus:border-matrix-green", placeholder: "Write a reply...", rows: 3 }), _jsxs("div", { className: "flex justify-end gap-2 mt-2", children: [_jsx("button", { type: "button", onClick: () => setIsReplying(false), className: "px-4 py-2 text-sm text-matrix-green hover:text-matrix-light", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 text-sm bg-matrix-green text-matrix-black rounded hover:bg-matrix-light", children: "Reply" })] })] }))] }), showReplies && comment.replies.length > 0 && (_jsx("div", { className: "space-y-4", children: comment.replies.map((reply) => (_jsx(Comment, { comment: reply, level: level + 1 }, reply.id))) }))] }));
}
