import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
const newsApi = {
    getTopHeadlines: async (params) => {
        try {
            const response = await axios.get('https://newsmatrix.org/api-proxy/api/news/top-headlines', {
                params: {
                    country: params?.country || 'us',
                    category: params?.category,
                    pageSize: params?.pageSize || 12,
                    apiKey: 'not-needed-proxy-handles-it',
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
