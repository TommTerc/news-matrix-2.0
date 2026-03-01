import Parser from 'rss-parser';
const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail'],
        ],
    },
});
export const RSS_FEEDS = [
    {
        id: 'google-business',
        name: 'Google Business News',
        url: 'https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=en-US&gl=US&ceid=US:en',
        category: 'business'
    }
];
class RSSService {
    constructor() {
        this.cache = new Map();
        this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    }
    static getInstance() {
        if (!RSSService.instance) {
            RSSService.instance = new RSSService();
        }
        return RSSService.instance;
    }
    isCacheValid(feedId) {
        const cached = this.cache.get(feedId);
        if (!cached)
            return false;
        return Date.now() - cached.timestamp < this.CACHE_DURATION;
    }
    async fetchFeed(feed) {
        if (this.isCacheValid(feed.id)) {
            return this.cache.get(feed.id).data;
        }
        try {
            const parsedFeed = await parser.parseURL(feed.url);
            const newsItems = parsedFeed.items.map((item, index) => ({
                id: item.guid || `${feed.id}-${index}`,
                title: item.title || 'Untitled',
                description: item.contentSnippet || item.content || '',
                source: feed.name,
                timestamp: new Date(item.pubDate || new Date()),
                image: this.extractImage(item),
                likes: 0,
                comments: 0,
                shares: 0,
                views: 0,
                trending: false,
                keywords: [feed.category, ...(item.categories || [])]
            }));
            this.cache.set(feed.id, {
                data: newsItems,
                timestamp: Date.now()
            });
            return newsItems;
        }
        catch (error) {
            console.error(`Error fetching RSS feed ${feed.name}:`, error);
            return [];
        }
    }
    extractImage(item) {
        // Try different possible image sources
        return (item.mediaContent?.$.url ||
            item.mediaThumbnail?.$.url ||
            item.enclosure?.url ||
            'https://via.placeholder.com/800x400');
    }
    async fetchAllFeeds() {
        const allItems = await Promise.all(RSS_FEEDS.map(feed => this.fetchFeed(feed)));
        return allItems
            .flat()
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
}
export default RSSService.getInstance();
