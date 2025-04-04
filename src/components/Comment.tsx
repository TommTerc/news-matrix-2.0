import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaReply } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { Comment as CommentType } from '../data/mockData';

interface CommentProps {
  comment: CommentType;
  level?: number;
}

export default function Comment({ comment, level = 0 }: CommentProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement reply submission
    setIsReplying(false);
    setReplyContent('');
  };

  return (
    <div className={`border-l-2 border-matrix-green/30 pl-4 ${level > 0 ? 'ml-4' : ''}`}>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-matrix-green/60 mb-2">
          <span className="font-bold text-matrix-green">{comment.author}</span>
          <span>•</span>
          <span>{formatDistanceToNow(comment.timestamp)} ago</span>
        </div>
        
        <p className="text-matrix-green mb-2">{comment.content}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <button className="hover:text-matrix-light">
              <FaArrowUp />
            </button>
            <span>{comment.upvotes - comment.downvotes}</span>
            <button className="hover:text-matrix-light">
              <FaArrowDown />
            </button>
          </div>
          
          <button 
            className="flex items-center gap-1 hover:text-matrix-light"
            onClick={() => setIsReplying(!isReplying)}
          >
            <FaReply />
            Reply
          </button>
          
          {comment.replies.length > 0 && (
            <button 
              className="hover:text-matrix-light"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? 'Hide' : 'Show'} {comment.replies.length} replies
            </button>
          )}
        </div>

        {isReplying && (
          <form onSubmit={handleSubmitReply} className="mt-4">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full bg-matrix-dark border border-matrix-green/30 rounded p-2 text-matrix-green focus:outline-none focus:border-matrix-green"
              placeholder="Write a reply..."
              rows={3}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-4 py-2 text-sm text-matrix-green hover:text-matrix-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-matrix-green text-matrix-black rounded hover:bg-matrix-light"
              >
                Reply
              </button>
            </div>
          </form>
        )}
      </div>

      {showReplies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}