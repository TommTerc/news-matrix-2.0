import { Observable } from '@nativescript/core';
import { NewsItem } from '../models/news-item';

export class HomeViewModel extends Observable {
  private _newsItems: NewsItem[];

  constructor() {
    super();
    
    // Mock data - in a real app, this would come from an API
    this._newsItems = [
      {
        id: '1',
        title: 'Breaking: Major Tech Announcement',
        url: 'https://example.com/tech-news',
        source: 'Tech Daily',
        timestamp: new Date(),
        likes: 1234,
        comments: 456,
        shares: 789
      },
      {
        id: '2',
        title: 'World Leaders Meet for Climate Summit',
        url: 'https://example.com/climate-news',
        source: 'World News',
        timestamp: new Date(),
        likes: 2345,
        comments: 567,
        shares: 890
      }
    ];
  }

  get newsItems(): NewsItem[] {
    return this._newsItems;
  }

  onItemTap(args: any) {
    const tappedItem = this._newsItems[args.index];
    console.log(`Tapped: ${tappedItem.title}`);
    // TODO: Implement navigation to detail view
  }

  onLike(id: string) {
    const item = this._newsItems.find(item => item.id === id);
    if (item) {
      item.likes++;
      this.notifyPropertyChange('newsItems', this._newsItems);
    }
  }
}