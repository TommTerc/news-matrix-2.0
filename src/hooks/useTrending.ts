import { useState, useEffect } from 'react';
import trendingService, { TrendingTopic } from '../services/trendingService';

export function useTrending() {
  const [trends, setTrends] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        const data = await trendingService.getAllTrends();
        setTrends(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch trending topics');
        console.error('Error fetching trends:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
    const interval = setInterval(fetchTrends, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return { trends, loading, error };
}