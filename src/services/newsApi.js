import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
const newsApi = {
    getTopHeadlines: async (params) => {
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
        }
        catch (error) {
            console.error('Error fetching top headlines:', error);
            throw error;
        }
    }
};
export default newsApi;
