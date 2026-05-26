import axios from 'axios';

const NEWS_SYMBOLS = {
  'Reuters': '🌐',
  'BBC News': '🇬🇧',
  'CNN': '🔴',
  'The New York Times': '📰',
  'Associated Press': '📡',
  'Bloomberg': '💹',
  'CNBC': '💼',
  'Fox News': '🦊',
  'The Guardian': '👁️',
  'The Washington Post': '📝',
  'ABC News': '🎯',
  'NBC News': '🔵',
  'CBS News': '👁️',
  'USA Today': '🗽',
  'The Wall Street Journal': '📊',
  'Business Insider': '💼',
  'TechCrunch': '💻',
  'Engadget': '🔧',
  'The Verge': '▼',
  'Wired': '🔌',
  'default': '📱'
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.VITE_NEWS_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ status: 'error', message: 'News API key is missing' });
  }

  const queryParams = new URLSearchParams(req.query);
  queryParams.delete('apiKey');

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?${queryParams.toString()}`,
      { headers: { 'X-Api-Key': apiKey } }
    );

    const articles = response.data.articles.map(article => ({
      source: {
        name: article.source.name,
        symbol: NEWS_SYMBOLS[article.source.name] || NEWS_SYMBOLS.default
      },
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage || 'https://via.placeholder.com/400x225?text=No+Image',
      publishedAt: article.publishedAt
    }));

    res.json({
      status: response.data.status,
      totalResults: response.data.totalResults,
      articles
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response?.data?.message || error.message
    });
  }
}
