import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaChartLine, FaBolt, FaGlobe, FaHashtag, FaRegNewspaper, FaSpinner } from 'react-icons/fa';
import { mockNews } from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

// Temporary mock data until the trending service is fully configured
const mockTrends = [
  { id: '1', name: 'AI Revolution', tweetCount: 245000, category: 'Technology', source: 'twitter' },
  { id: '2', name: 'Climate Action', tweetCount: 182000, category: 'Environment', source: 'google' },
  { id: '3', name: 'Digital Privacy', tweetCount: 156000, category: 'Technology', source: 'twitter' },
  { id: '4', name: 'Future of Work', tweetCount: 134000, category: 'Business', source: 'google' },
  { id: '5', name: 'Space Exploration', tweetCount: 98000, category: 'Science', source: 'twitter' },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'foryou' | 'trending' | 'news'>('foryou');
  const [loading] = useState(false);

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const filteredNews = mockNews.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderTrendingTopics = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-2xl text-matrix-green" />
        </div>
      );
    }

    return (
      <div className="divide-y divide-matrix-green/30">
        {mockTrends.map((topic) => (
          <div
            key={topic.id}
            className="p-4 hover:bg-matrix-green/10 transition-colors cursor-pointer"
          >
            <div className="text-sm text-matrix-green/60 mb-1">
              Trending in {topic.category}
            </div>
            <div className="font-bold mb-1">{topic.name}</div>
            <div className="text-sm text-matrix-green/60">
              {formatCount(topic.tweetCount)} {topic.source === 'twitter' ? 'tweets' : 'mentions'}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green pt-16">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="sticky top-16 bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 py-4 z-10">
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-4 text-matrix-green/60" />
              <input
                type="search"
                placeholder="Search News Matrix"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-matrix-dark border border-matrix-green/30 rounded-full pl-12 pr-4 py-3 text-matrix-green focus:outline-none focus:border-matrix-green transition-all hover:border-matrix-green/60 placeholder-matrix-green/40"
              />
            </div>
            
            {/* Optional: Add a subtle glow effect */}
            <div className="absolute inset-0 rounded-full bg-matrix-green/5 filter blur-xl pointer-events-none"></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-matrix-green/30 mt-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('foryou')}
              className={`pb-4 relative ${activeTab === 'foryou' ? 'text-matrix-light' : 'text-matrix-green/60 hover:text-matrix-green'}`}
            >
              For you
              {activeTab === 'foryou' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-matrix-light rounded-t" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`pb-4 relative ${activeTab === 'trending' ? 'text-matrix-light' : 'text-matrix-green/60 hover:text-matrix-green'}`}
            >
              Trending
              {activeTab === 'trending' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-matrix-light rounded-t" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`pb-4 relative ${activeTab === 'news' ? 'text-matrix-light' : 'text-matrix-green/60 hover:text-matrix-green'}`}
            >
              News
              {activeTab === 'news' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-matrix-light rounded-t" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="py-4">
          {/* For You Tab */}
          {activeTab === 'foryou' && (
            <div className="space-y-6">
              {/* Trending Topics */}
              <div className="bg-matrix-dark/20 rounded-lg border border-matrix-green/30 overflow-hidden">
                <h2 className="text-xl font-bold p-4 border-b border-matrix-green/30">
                  Trending Topics
                </h2>
                {renderTrendingTopics()}
              </div>

              {/* News Feed */}
              <div className="space-y-4">
                {filteredNews.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="block bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 rounded-lg border border-matrix-green/30 overflow-hidden hover:border-matrix-green hover:shadow-lg hover:shadow-matrix-green/20 transition-all"
                  >
                    <div className="flex">
                      <div className="flex-1 p-4">
                        <div className="flex items-center gap-2 text-sm text-matrix-green/60 mb-2">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(item.timestamp)} ago</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                        <p className="text-matrix-green/80">{item.description}</p>
                      </div>
                      {item.image && (
                        <div className="w-48 h-48">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Trending Tab */}
          {activeTab === 'trending' && (
            <div className="space-y-4">
              {filteredNews
                .filter(item => item.trending)
                .map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="block bg-matrix-dark/20 rounded-lg border border-matrix-green/30 overflow-hidden hover:border-matrix-green transition-colors"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaChartLine className="text-matrix-light" />
                        <span className="text-sm text-matrix-green/60">Trending with {formatCount(item.views)} views</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                      <p className="text-matrix-green/80">{item.description}</p>
                    </div>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                  </Link>
                ))}
            </div>
          )}

          {/* News Tab */}
          {activeTab === 'news' && (
            <div className="space-y-4">
              {filteredNews.map((item) => (
                <Link
                  key={item.id}
                  to={`/news/${item.id}`}
                  className="block bg-matrix-dark/20 rounded-lg border border-matrix-green/30 overflow-hidden hover:border-matrix-green transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-matrix-green/60 mb-2">
                      <FaRegNewspaper />
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(item.timestamp)} ago</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {item.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="bg-matrix-green/20 text-matrix-green px-2 py-1 rounded-full text-sm"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}