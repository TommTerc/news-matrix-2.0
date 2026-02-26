import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock, FaRegComment, FaRegHeart, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import newsApi from '../services/newsApi';
import CongressWidget from '../components/CongressWidget';
import SuggestedUsers from '../components/SuggestedUsers';

export default function Home() {
  const [category, setCategory] = useState<string | undefined>();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-matrix-black/40 backdrop-blur-[2px] font-mono">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs */}
        <div className="flex gap-6 mb-12 overflow-x-auto pb-2">
          {['all', 'technology', 'science', 'environment', 'AI'].map((cat) => (
            <button
              key={`category-${cat}`}
              onClick={() => setCategory(cat === 'all' ? undefined : cat.toLowerCase())}
              className={`px-6 py-2 rounded-full border transition-colors whitespace-nowrap ${
                (category === cat || (!category && cat === 'all'))
                  ? 'bg-matrix-green text-matrix-black border-matrix-green'
                  : 'border-matrix-green/30 text-matrix-green hover:border-matrix-green'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading && <div className="text-matrix-green">Loading news...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {/* Main Content Grid: News Feed + Congress Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* News Feed - Takes up 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, idx) => (
                <a
                  key={article.url || idx}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="energy-container block bg-black/40"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={article.urlToImage || 'https://via.placeholder.com/400x225?text=No+Image'}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-matrix-green/60 mb-3">
                      <span>{article.source?.name}</span>
                      <span>•</span>
                      <FaRegClock className="text-xs" />
                      <span>{formatDistanceToNow(new Date(article.publishedAt))} ago</span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 text-matrix-green group-hover:text-matrix-light transition-colors">
                      {article.title}
                    </h2>

                    <p className="text-matrix-green/80 text-sm mb-6 line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Congress Sidebar - 1/3 width on large screens */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <CongressWidget congress={119} billType="hr" billNumber="30" />
              <SuggestedUsers />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}