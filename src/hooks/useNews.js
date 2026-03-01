import { useState, useEffect } from 'react';
import newsApi from '../services/newsApi';
export function useNews({ country = 'us', category, pageSize = 5, } = {}) {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            }
            catch (err) {
                setError('Failed to fetch news');
                console.error('Error fetching news:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [country, category, pageSize]);
    return { articles, loading, error };
}
