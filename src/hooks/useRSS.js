import { useState, useEffect } from 'react';
import rssService from '../services/rssService';
export function useRSS({ feedId, category } = {}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchRSSFeeds = async () => {
            try {
                setLoading(true);
                let newsItems;
                if (feedId) {
                    const feed = rssService.RSS_FEEDS.find(f => f.id === feedId);
                    if (!feed)
                        throw new Error('Feed not found');
                    newsItems = await rssService.fetchFeed(feed);
                }
                else {
                    newsItems = await rssService.fetchAllFeeds();
                }
                if (category) {
                    newsItems = newsItems.filter(item => item.keywords.some(keyword => keyword.toLowerCase() === category.toLowerCase()));
                }
                setItems(newsItems);
                setError(null);
            }
            catch (err) {
                setError('Failed to fetch RSS feeds');
                console.error('Error fetching RSS feeds:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchRSSFeeds();
    }, [feedId, category]);
    return { items, loading, error };
}
