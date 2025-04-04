export const API_CONFIG = {
  twitter: {
    apiKey: import.meta.env.VITE_TWITTER_API_KEY,
    apiKeySecret: import.meta.env.VITE_TWITTER_API_SECRET,
    bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN,
    clientId: import.meta.env.VITE_TWITTER_CLIENT_ID,
    clientSecret: import.meta.env.VITE_TWITTER_CLIENT_SECRET
  },
  newsApi: {
    apiKey: import.meta.env.VITE_NEWS_API_KEY
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  }
};