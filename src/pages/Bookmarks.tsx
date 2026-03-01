import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegBookmark, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import bookmarkService, { ArticleBookmark } from '../services/bookmarkService';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<ArticleBookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setLoading(true);
        const userBookmarks = await bookmarkService.getUserBookmarks();
        setBookmarks(userBookmarks);
      } catch (err) {
        console.error('Error loading bookmarks:', err);
        setError('Failed to load bookmarks');
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-3xl text-matrix-green" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-matrix-green flex items-center gap-3 mb-2">
          <FaRegBookmark className="text-2xl" />
          Saved Articles
        </h1>
        <p className="text-matrix-green/60">Your bookmarked articles</p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-12 text-center">
          <FaRegBookmark className="text-4xl text-matrix-green/40 mx-auto mb-4" />
          <p className="text-matrix-green/60">No saved articles yet</p>
          <p className="text-sm text-matrix-green/40 mt-2">
            Bookmark articles while browsing to save them here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-matrix-black/80 border border-matrix-green/30 rounded-lg p-4 hover:border-matrix-green transition-colors group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaRegBookmark className="text-matrix-green" />
                    <span className="text-xs text-matrix-green/50">
                      {format(new Date(bookmark.created_at), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-matrix-green/60 font-mono break-all hover:text-matrix-green transition-colors">
                    {bookmark.article_url}
                  </p>
                </div>

                <a
                  href={bookmark.article_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 px-4 py-2 bg-matrix-green/10 border border-matrix-green/30 rounded hover:bg-matrix-green/20 hover:border-matrix-green transition-all flex items-center gap-2 group-hover:text-matrix-green text-matrix-green/60"
                >
                  <FaArrowRight className="text-sm" />
                  <span className="text-sm">Open</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
