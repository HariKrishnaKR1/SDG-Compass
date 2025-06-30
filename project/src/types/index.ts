export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  sourceUrl: string;
  source: string;
  pillar: SustainabilityPillar;
  sdgs: SDG[];
  tags: string[];
  readTime: number;
  impactScore: number;
  e2sgRating: E2SGRating;
  region: string;
  isBookmarked?: boolean;
  viewCount: number;
  shareCount: number;
  scrapedAt: string;
}

export type SustainabilityPillar = 'environmental' | 'social' | 'economic';

export interface SDG {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  progress?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface E2SGRating {
  environmental: number;
  economic: number;
  social: number;
  governance: number;
  overall: number;
}

export interface FilterState {
  pillar: SustainabilityPillar | 'all';
  sdgs: number[];
  searchQuery: string;
  dateRange: DateRange;
  impactLevel: 'all' | 'high' | 'medium' | 'low';
  region: string;
  sortBy: 'date' | 'impact' | 'popularity';
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  bookmarkedArticles: string[];
  followedSDGs: number[];
  notificationSettings: {
    email: boolean;
    push: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

export interface SDGProgress {
  id: number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  articles: number;
}

export type FeedType = 'normal' | 'dashboard' | 'sdg-split';

export interface ScrapingSource {
  name: string;
  baseUrl: string;
  selectors: {
    title: string;
    content: string;
    author?: string;
    date?: string;
    image?: string;
  };
  rateLimit: number;
}