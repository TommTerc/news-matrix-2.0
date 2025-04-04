import { createClient } from '@supabase/supabase-js';
import { TwitterApi } from 'twitter-api-v2';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const twitterClient = new TwitterApi(import.meta.env.VITE_TWITTER_BEARER_TOKEN);

export interface TrendingTopic {
  id: string;
  name: string;
  tweetCount: number;
  category: string;
  source: 'twitter' | 'news';
  timestamp: Date;
}

class TrendingService {
  private static instance: TrendingService;
  private cache: Map<string, { data: TrendingTopic[]; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): TrendingService {
    if (!TrendingService.instance) {
      TrendingService.instance = new TrendingService();
    }
    return TrendingService.instance;
  }

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  async getTwitterTrends(): Promise<TrendingTopic[]> {
    if (this.isCacheValid('twitter')) {
      return this.cache.get('twitter')!.data;
    }

    try {
      const trends = await twitterClient.v2.trendingTopics();
      const trendingTopics: TrendingTopic[] = trends.data.map(trend => ({
        id: trend.id,
        name: trend.name,
        tweetCount: trend.tweet_volume || 0,
        category: this.categorizeTopicByKeywords(trend.name),
        source: 'twitter',
        timestamp: new Date()
      }));

      this.cache.set('twitter', {
        data: trendingTopics,
        timestamp: Date.now()
      });

      await this.saveTrendsToDatabase(trendingTopics);
      return trendingTopics;
    } catch (error) {
      console.error('Error fetching Twitter trends:', error);
      return [];
    }
  }

  private categorizeTopicByKeywords(title: string): string {
    const categories = {
      Technology: ['AI', 'tech', 'cyber', 'digital', 'software', 'hardware', 'app'],
      Business: ['market', 'economy', 'finance', 'stock', 'trade', 'business'],
      Science: ['science', 'research', 'study', 'discovery', 'space', 'climate'],
      Politics: ['policy', 'government', 'election', 'political', 'vote'],
      Entertainment: ['movie', 'music', 'celebrity', 'film', 'tv', 'show'],
      Sports: ['sport', 'game', 'player', 'team', 'match', 'tournament']
    };

    const lowerTitle = title.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        return category;
      }
    }
    return 'General';
  }

  private async saveTrendsToDatabase(trends: TrendingTopic[]) {
    try {
      const { error } = await supabase
        .from('trending_topics')
        .insert(trends.map(trend => ({
          ...trend,
          timestamp: trend.timestamp.toISOString()
        })));

      if (error) throw error;
    } catch (error) {
      console.error('Error saving trends to database:', error);
    }
  }

  async getAllTrends(): Promise<TrendingTopic[]> {
    const twitterTrends = await this.getTwitterTrends();
    return twitterTrends
      .sort((a, b) => b.tweetCount - a.tweetCount)
      .slice(0, 10); // Return top 10 trends
  }
}

export default TrendingService.getInstance();