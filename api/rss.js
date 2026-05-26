import Parser from 'rss-parser';

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

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
    ],
  },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: 'error', message: 'RSS feed URL is required' });
  }

  try {
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
      feed: { title: feed.title, description: feed.description, link: feed.link },
      articles
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch RSS feed' });
  }
}
