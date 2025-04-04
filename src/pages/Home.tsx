import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock, FaRegComment, FaRegHeart, FaShare } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { mockNews } from '../data/mockData';

export default function Home() {
  const [category, setCategory] = useState<string | undefined>();
  
  const filteredNews = category 
    ? mockNews.filter(article => article.keywords.includes(category))
    : mockNews;

  return (
    <div className="min-h-screen bg-matrix-black/40 backdrop-blur-[2px] font-mono">
      <div className="max-w-7xl mx-auto px-8 py-12">
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

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredNews.map((article) => (
            <Link
              key={article.id}
              to={`/news/${article.id}`}
              className="energy-container block bg-black/40"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {article.trending && (
                  <div className="absolute top-4 right-4 bg-matrix-green/90 text-matrix-black px-3 py-1 rounded text-sm font-bold">
                    Trending
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-matrix-green/60 mb-3">
                  <span>{article.source}</span>
                  <span>•</span>
                  <FaRegClock className="text-xs" />
                  <span>{formatDistanceToNow(article.timestamp)} ago</span>
                </div>

                <h2 className="text-xl font-bold mb-3 text-matrix-green group-hover:text-matrix-light transition-colors">
                  {article.title}
                </h2>

                <p className="text-matrix-green/80 text-sm mb-6 line-clamp-2">
                  {article.description}
                </p>

                <div className="flex items-center gap-8 text-sm text-matrix-green/60">
                  <div className="flex items-center gap-2">
                    <FaRegHeart />
                    <span>{article.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegComment />
                    <span>{article.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaShare />
                    <span>{article.shares.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  {article.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="text-xs bg-matrix-green/10 text-matrix-green px-3 py-1 rounded-full"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}