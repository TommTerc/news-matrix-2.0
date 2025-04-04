export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
}