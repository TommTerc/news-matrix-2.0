import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

export interface NewsApiArticle {
  source: {
    name: string;
    symbol: string;
  };
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

const newsApi = {
  getTopHeadlines: async (params?: {
    country?: string;
    category?: string;
    pageSize?: number;
  }): Promise<NewsApiResponse> => {
    try {
      const response = await axios.get('/api/news/top-headlines', {
        params: {
          ...params,
          country: params?.country || 'us',
          pageSize: params?.pageSize || 5,
          apiKey: API_CONFIG.newsApi.apiKey,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      throw error;
    }
  }
};

export default newsApi;