import React, { useState, useEffect } from 'react';
import { FaVideo, FaExternalLinkAlt } from 'react-icons/fa';

interface Video {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
}

// Mock data for development
const mockVideos: Video[] = [
  {
    title: "Understanding the Digital Matrix: A Deep Dive",
    link: "https://example.com/video1",
    pubDate: new Date().toISOString(),
    thumbnail: "https://via.placeholder.com/120x68"
  },
  {
    title: "Breaking News: Tech Revolution Continues",
    link: "https://example.com/video2",
    pubDate: new Date(Date.now() - 86400000).toISOString(),
    thumbnail: "https://via.placeholder.com/120x68"
  },
  {
    title: "The Future of AI and Machine Learning",
    link: "https://example.com/video3",
    pubDate: new Date(Date.now() - 172800000).toISOString(),
    thumbnail: "https://via.placeholder.com/120x68"
  }
];

export default function RelatedVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // In production, replace this with actual API call
        // For now, simulate API delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVideos(mockVideos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load related videos');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-matrix-green/20 rounded w-3/4 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="mb-4">
            <div className="h-20 bg-matrix-green/10 rounded mb-2"></div>
            <div className="h-4 bg-matrix-green/20 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-matrix-green/60 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900/95 via-gray-800/98 to-gray-900/95 border border-matrix-green/30 rounded-lg p-4">
      <h3 className="text-lg font-bold text-matrix-green mb-4 flex items-center gap-2">
        <FaVideo />
        Related Videos
      </h3>
      
      <div className="space-y-4">
        {videos.map((video, index) => (
          <a
            key={index}
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 group hover:bg-matrix-green/10 p-2 rounded-lg transition-colors"
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-30 h-17 object-cover rounded border border-matrix-green/30"
            />
            <div className="flex-1">
              <h4 className="text-matrix-green group-hover:text-matrix-light font-bold mb-1 line-clamp-2">
                {video.title}
              </h4>
              <div className="flex items-center gap-2 text-matrix-green/60 text-sm">
                <span>{new Date(video.pubDate).toLocaleDateString()}</span>
                <FaExternalLinkAlt className="text-xs" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}