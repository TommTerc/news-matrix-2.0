var express = require('express');
var cors = require('cors');
var axios = require('axios');
var dotenv = require('dotenv');
var path = require('path');
var Parser = require('rss-parser');

// Load environment variables
dotenv.config();

var app = express();
var PORT = process.env.PORT || 8080;

console.log('Starting proxy server...');
console.log('API Key present:', !!process.env.VITE_NEWS_API_KEY);

var parser = new Parser();

var NEWS_SYMBOLS = {
  'Reuters': '🌐',
  'BBC News': '🇬🇧',
  'CNN': '🔴',
  'default': '📱'
};

app.use(cors());

// Health check
app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', timestamp: new Date() });
});

// News API proxy endpoint
app.get('/api/news/top-headlines', function(req, res) {
  var apiKey = process.env.VITE_NEWS_API_KEY;
  
  if (!apiKey) {
    return res.status(400).json({
      status: 'error',
      message: 'News API key is missing'
    });
  }
  
  var queryParams = new (require('url')).URLSearchParams(req.query);
  queryParams.delete('apiKey');
  
  var newsApiUrl = 'https://newsapi.org/v2/top-headlines?' + queryParams.toString();
  
  console.log('Requesting:', newsApiUrl);
  
  axios.get(newsApiUrl, {
    headers: {
      'X-Api-Key': apiKey
    }
  }).then(function(response) {
    var articles = response.data.articles.map(function(article) {
      return {
        source: {
          name: article.source.name,
          symbol: NEWS_SYMBOLS[article.source.name] || NEWS_SYMBOLS['default']
        },
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage || 'https://via.placeholder.com/400x225?text=No+Image',
        publishedAt: article.publishedAt
      };
    });
    
    res.json({
      status: response.data.status,
      totalResults: response.data.totalResults,
      articles: articles
    });
  }).catch(function(error) {
    console.error('Proxy error:', error.message);
    res.status(error.response ? error.response.status : 500).json({
      status: 'error',
      message: error.message
    });
  });
});

// Start server
app.listen(PORT, function() {
  console.log('Proxy server running on port ' + PORT);
});