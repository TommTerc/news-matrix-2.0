import React from 'react';
import { FaRegClock } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { NewsApiArticle } from '../services/newsApi';

interface NewsCardProps {
  article: NewsApiArticle;
  index: number;
}

export default function NewsCard({ article, index }: NewsCardProps) {
  const cardId = `${article.publishedAt}-${index}`;
  
  return (
    <article 
      key={cardId}
      className="border border-matrix-green/30 rounded-lg overflow-hidden hover:border-matrix-green transition-all group bg-gradient-to-b from-gray-900/80 via-gray-800/85 to-gray-900/80 hover:shadow-lg hover:shadow-matrix-green/20"
    >
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-matrix-green/60 text-sm flex items-center gap-1">
              <FaRegClock /> {formatDistanceToNow(new Date(article.publishedAt))} ago
            </span>
          </div>
          <h2 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-matrix-green via-matrix-light to-matrix-green group-hover:from-matrix-light group-hover:via-matrix-green group-hover:to-matrix-light transition-all">
            {article.title}
          </h2>
          {article.description && (
            <p className="text-matrix-green/80 mb-4">{article.description}</p>
          )}
          <div className="flex items-center gap-2 text-matrix-green/60 text-sm">
            <span className="text-xl">{article.source.symbol}</span>
            <span>{article.source.name}</span>
          </div>
        </div>
      </a>
    </article>
  );
}