import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    const metadata = { title: undefined, description: undefined, image: undefined };

    let match = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    if (match?.[1]) metadata.title = match[1];
    else {
      match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (match?.[1]) metadata.title = match[1];
    }

    match = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
    if (match?.[1]) metadata.description = match[1];
    else {
      match = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
      if (match?.[1]) metadata.description = match[1];
    }

    match = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    if (match?.[1]) metadata.image = match[1];

    if (!metadata.image) {
      match = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
      if (match?.[1]) metadata.image = match[1];
    }

    if (!metadata.image) {
      match = html.match(/<img\s+[^>]*src=["']([^"'>"]+)["'][^>]*>/i);
      if (match?.[1]) {
        let imgUrl = match[1];
        if (!imgUrl.startsWith('http')) imgUrl = new URL(imgUrl, url).href;
        metadata.image = imgUrl;
      }
    }

    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to extract metadata', message: error.message });
  }
}
