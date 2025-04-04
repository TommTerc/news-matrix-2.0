// News item interfaces
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  timestamp: Date;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  trending: boolean;
  keywords: string[];
}

// Comment interface for Reddit-style comments
export interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
}

// Timeline event interface
export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  type: 'update' | 'announcement' | 'development';
  image: string;
  source: string;
  comments: Comment[];
}

// Mock news data
export const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Quantum Computing Breakthrough: Scientists Achieve 1000-Qubit Milestone',
    description: 'In a groundbreaking development, researchers have successfully created and controlled a 1000-qubit quantum computer, marking a significant leap forward in quantum computing capabilities. This breakthrough could revolutionize fields from cryptography to drug discovery.',
    source: 'Quantum Tech Review',
    timestamp: new Date(),
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    likes: 4321,
    comments: 892,
    shares: 1567,
    views: 75000,
    trending: true,
    keywords: ['quantum computing', 'technology', 'science', 'breakthrough', 'research']
  },
  {
    id: '2',
    title: 'Global Climate Summit Announces Ambitious Carbon Capture Initiative',
    description: 'World leaders have united to launch a $100 billion carbon capture program, aiming to remove 1 billion tons of CO2 from the atmosphere annually by 2030. The initiative combines cutting-edge technology with international cooperation.',
    source: 'Environmental Chronicle',
    timestamp: new Date(Date.now() - 3600000),
    image: 'https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?w=800',
    likes: 3876,
    comments: 743,
    shares: 1298,
    views: 62000,
    trending: true,
    keywords: ['climate change', 'environment', 'technology', 'global initiative']
  },
  {
    id: '3',
    title: 'Neural Interface Allows Direct Brain-to-Text Communication',
    description: 'A revolutionary neural interface device has enabled paralyzed individuals to convert their thoughts directly into text with 95% accuracy. The breakthrough promises to transform accessibility and human-computer interaction.',
    source: 'NeuroTech Today',
    timestamp: new Date(Date.now() - 7200000),
    image: 'https://images.unsplash.com/photo-1589638787472-f3421c875634?w=800',
    likes: 5432,
    comments: 967,
    shares: 2145,
    views: 89000,
    trending: true,
    keywords: ['neuroscience', 'technology', 'medical breakthrough', 'accessibility']
  },
  {
    id: '4',
    title: 'Artificial General Intelligence Passes Extended Turing Test',
    description: 'In a historic moment for AI development, a new artificial general intelligence system has passed a month-long Turing test, demonstrating human-level reasoning across multiple domains. Experts debate the implications for society.',
    source: 'AI Insider',
    timestamp: new Date(Date.now() - 10800000),
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    likes: 6789,
    comments: 1543,
    shares: 2876,
    views: 95000,
    trending: true,
    keywords: ['AI', 'artificial intelligence', 'technology', 'breakthrough']
  },
  {
    id: '5',
    title: 'Space Mining Company Launches First Asteroid Resource Mission',
    description: 'AstroMine Corp has successfully launched the first commercial asteroid mining mission, targeting a mineral-rich near-Earth asteroid. The mission aims to demonstrate the feasibility of space resource extraction.',
    source: 'Space Frontier News',
    timestamp: new Date(Date.now() - 14400000),
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800',
    likes: 4567,
    comments: 876,
    shares: 1432,
    views: 71000,
    trending: true,
    keywords: ['space', 'mining', 'technology', 'commercial space']
  },
  {
    id: '6',
    title: 'Fusion Energy Reactor Achieves Net Power Generation',
    description: 'Scientists at the International Fusion Research Center have achieved sustained nuclear fusion with net positive energy output, marking a potential turning point in clean energy production. The breakthrough could revolutionize global power generation.',
    source: 'Energy Science Weekly',
    timestamp: new Date(Date.now() - 18000000),
    image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=800',
    likes: 5678,
    comments: 1234,
    shares: 2345,
    views: 82000,
    trending: true,
    keywords: ['fusion', 'energy', 'science', 'breakthrough', 'clean energy']
  }
];

// Timeline events data
export const timelineEvents: Record<string, TimelineEvent[]> = {
  '1': [
    {
      id: 't1',
      title: 'OpenAI Announces GPT-5',
      description: 'Tech breakthrough first revealed to the public',
      timestamp: new Date(2024, 0, 15, 9, 0),
      type: 'announcement',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
      source: 'Tech Daily',
      comments: [
        {
          id: 'c1',
          content: 'This is a game-changer for the AI industry!',
          author: 'TechEnthusiast',
          timestamp: new Date(2024, 0, 15, 9, 30),
          upvotes: 245,
          downvotes: 12,
          replies: [
            {
              id: 'c1r1',
              content: 'Absolutely agree. The implications for natural language processing are huge.',
              author: 'AIResearcher',
              timestamp: new Date(2024, 0, 15, 9, 45),
              upvotes: 123,
              downvotes: 5,
              replies: []
            }
          ]
        },
        {
          id: 'c2',
          content: 'What about the ethical implications?',
          author: 'EthicsFirst',
          timestamp: new Date(2024, 0, 15, 10, 0),
          upvotes: 189,
          downvotes: 8,
          replies: []
        }
      ]
    },
    {
      id: 't2',
      title: 'GPT-5 Technical Deep Dive',
      description: 'Detailed specifications and implementation plans shared',
      timestamp: new Date(2024, 0, 15, 14, 30),
      type: 'development',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
      source: 'AI Weekly',
      comments: []
    }
  ],
  '2': [
    {
      id: 't5',
      title: 'Climate Summit Begins',
      description: 'World leaders gather for opening ceremony',
      timestamp: new Date(2024, 1, 1, 9, 0),
      type: 'announcement',
      image: 'https://images.unsplash.com/photo-1470723710355-95304d8aece4?w=800&auto=format&fit=crop',
      source: 'Global News',
      comments: []
    }
  ],
  '3': [
    {
      id: 't7',
      title: 'Neural Interface Breakthrough',
      description: 'First successful brain-to-text communication achieved',
      timestamp: new Date(2024, 1, 10, 8, 0),
      type: 'announcement',
      image: 'https://images.unsplash.com/photo-1589638787472-f3421c875634?w=800',
      source: 'NeuroTech Today',
      comments: []
    }
  ]
};