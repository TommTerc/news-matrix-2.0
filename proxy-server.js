import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import Parser from 'rss-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = 8080;

// Log environment variables for debugging
console.log('Environment variables:');
console.log('VITE_NEWS_API_KEY:', process.env.VITE_NEWS_API_KEY ? 'Set' : 'NOT SET');
console.log('NEWS_API_KEY:', process.env.NEWS_API_KEY ? 'Set' : 'NOT SET');

// Initialize RSS parser
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
});

// News organization symbols mapping
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
  // Default symbol for unknown sources
  'default': '📱'
};

app.use(cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// RSS feed endpoint
app.get('/api/rss', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({
        status: 'error',
        message: 'RSS feed URL is required'
      });
    }

      const feed = await parser.parseURL(url);
    
    const articles = feed.items.map(item => ({
      source: {
        name: feed.title || 'Unknown Source',
          symbol: NEWS_SYMBOLS[feed.title] || NEWS_SYMBOLS.default
      },
      title: item.title,
      description: item.contentSnippet || item.content,
      url: item.link,
      publishedAt: item.pubDate,
      image: item.enclosure?.url || null
    }));

    res.json({
      status: 'success',
      feed: {
        title: feed.title,
        description: feed.description,
        link: feed.link
      },
      articles
    });
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch RSS feed'
    });
  }
});

// Proxy endpoint for News API
app.get('/api/news/top-headlines', async (req, res) => {
  try {
    const apiKey = process.env.VITE_NEWS_API_KEY;
    console.log('News API Key:', apiKey ? 'Present' : 'MISSING');
    console.log('Query params:', req.query);
    
    if (!apiKey) {
      return res.status(400).json({
        status: 'error',
        message: 'News API key is missing'
      });
    }
    
    const queryParams = new URLSearchParams(req.query);
    queryParams.delete('apiKey'); // Remove API key from forwarded query params
    
    console.log('Requesting from NewsAPI:', `https://newsapi.org/v2/top-headlines?${queryParams.toString()}`);
    
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?${queryParams.toString()}`,
      {
        headers: {
          'X-Api-Key': apiKey
        }
      }
    );
    
    // Add symbols to the response data
    console.log('Articles received from NewsAPI:', response.data.articles.length);
    if (response.data.articles.length > 0) {
      console.log('First article image URL:', response.data.articles[0].urlToImage);
    }
    
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
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      message: error.response?.data?.message || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});