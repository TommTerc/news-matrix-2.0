import { useState, useEffect } from 'react';
import newsApi, { NewsApiArticle } from '../services/newsApi';

interface UseNewsParams {
  country?: string;
  category?: string;
  pageSize?: number;
}

export function useNews({
  country = 'us',
  category,
  pageSize = 5,
}: UseNewsParams = {}) {
  const [articles, setArticles] = useState<NewsApiArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsApi.getTopHeadlines({
          country,
          category,
          pageSize,
        });
        setArticles(response.articles);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [country, category, pageSize]);

  return { articles, loading, error };
}