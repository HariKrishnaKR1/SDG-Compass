import { NewsArticle } from '../types';

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: '1',
    title: 'Revolutionary Solar Technology Reaches 50% Efficiency Breakthrough',
    summary: 'Scientists achieve unprecedented efficiency in solar panel technology, potentially transforming renewable energy adoption worldwide.',
    content: 'A groundbreaking development in photovoltaic technology has achieved 50% efficiency in laboratory conditions...',
    author: 'Dr. Sarah Chen',
    publishedAt: '2024-01-15T10:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
    pillar: 'environmental',
    sdgs: [{ id: 7, title: 'Affordable and Clean Energy', description: '', color: '#FCC30B', icon: 'Zap' }],
    tags: ['renewable energy', 'solar power', 'innovation'],
    readTime: 5,
    impactScore: 9,
    e2sgRating: { environmental: 9, economic: 8, social: 7, governance: 8, overall: 8.0 },
    region: 'Global',
    isBookmarked: false,
    viewCount: 15420,
    shareCount: 342,
    scrapedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Global Food Security Initiative Reduces Hunger by 30% in Target Regions',
    summary: 'Innovative agricultural practices and international cooperation lead to significant improvements in food access.',
    content: 'The Global Food Security Initiative has reported remarkable success in combating hunger...',
    author: 'Michael Rodriguez',
    publishedAt: '2024-01-14T14:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/1459653/pexels-photo-1459653.jpeg?auto=compress&cs=tinysrgb&w=800',
    pillar: 'social',
    sdgs: [
      { id: 2, title: 'Zero Hunger', description: '', color: '#DDA63A', icon: 'Wheat' },
      { id: 1, title: 'No Poverty', description: '', color: '#E5243B', icon: 'HandHeart' }
    ],
    tags: ['food security', 'agriculture', 'poverty reduction'],
    readTime: 7,
    impactScore: 8,
    e2sgRating: { environmental: 6, economic: 7, social: 9, governance: 7, overall: 7.3 },
    region: 'Africa',
    isBookmarked: true,
    viewCount: 12890,
    shareCount: 287,
    scrapedAt: '2024-01-14T14:45:00Z'
  },
  {
    id: '3',
    title: 'Circular Economy Model Drives $2.3 Billion in Sustainable Growth',
    summary: 'Major corporations adopt circular economy principles, demonstrating significant economic and environmental benefits.',
    content: 'The implementation of circular economy models across various industries has generated substantial returns...',
    author: 'Emma Thompson',
    publishedAt: '2024-01-13T09:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    pillar: 'economic',
    sdgs: [
      { id: 12, title: 'Responsible Consumption and Production', description: '', color: '#BF8B2E', icon: 'Recycle' },
      { id: 8, title: 'Decent Work and Economic Growth', description: '', color: '#A21942', icon: 'TrendingUp' }
    ],
    tags: ['circular economy', 'sustainable business', 'economic growth'],
    readTime: 6,
    impactScore: 7,
    e2sgRating: { environmental: 8, economic: 9, social: 6, governance: 8, overall: 7.8 },
    region: 'Europe',
    isBookmarked: false,
    viewCount: 9876,
    shareCount: 198,
    scrapedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Ocean Cleanup Project Removes 100,000 Tons of Plastic Waste',
    summary: 'Advanced cleanup technologies successfully remove massive amounts of plastic pollution from ocean ecosystems.',
    content: 'The Ocean Cleanup Project has achieved a major milestone in marine conservation...',
    author: 'Captain James Wilson',
    publishedAt: '2024-01-12T16:20:00Z',
    imageUrl: 'https://images.pexels.com/photos/2583852/pexels-photo-2583852.jpeg?auto=compress&cs=tinysrgb&w=800',
    pillar: 'environmental',
    sdgs: [
      { id: 14, title: 'Life Below Water', description: '', color: '#0A97D9', icon: 'Fish' },
      { id: 12, title: 'Responsible Consumption and Production', description: '', color: '#BF8B2E', icon: 'Recycle' }
    ],
    tags: ['ocean cleanup', 'plastic pollution', 'marine conservation'],
    readTime: 4,
    impactScore: 8,
    e2sgRating: { environmental: 9, economic: 6, social: 7, governance: 6, overall: 7.0 },
    region: 'Asia Pacific',
    isBookmarked: true,
    viewCount: 18234,
    shareCount: 456,
    scrapedAt: '2024-01-12T16:20:00Z'
  },
  {
    id: '5',
    title: 'Universal Healthcare Initiative Reaches 500 Million People',
    summary: 'Groundbreaking healthcare program provides essential medical services to underserved populations globally.',
    content: 'The Universal Healthcare Initiative has expanded access to quality healthcare services...',
    author: 'Dr. Priya Patel',
    publishedAt: '2024-01-11T11:00:00Z',
    imageUrl: 'https://images.pexels.com/photos/7088793/pexels-photo-7088793.jpeg?auto=compress&cs=tinysrgb&w=800',
    pillar: 'social',
    sdgs: [
      { id: 3, title: 'Good Health and Well-being', description: '', color: '#4C9F38', icon: 'Heart' },
      { id: 10, title: 'Reduced Inequality', description: '', color: '#DD1367', icon: 'Scale' }
    ],
    tags: ['healthcare', 'global health', 'equality'],
    readTime: 8,
    impactScore: 9,
    e2sgRating: { environmental: 5, economic: 7, social: 10, governance: 8, overall: 7.5 },
    region: 'Global',
    isBookmarked: false,
    viewCount: 22156,
    shareCount: 634,
    scrapedAt: '2024-01-11T11:00:00Z'
  },
  {
    id: '6',
    title: 'Green Finance Reaches $1 Trillion Milestone in Sustainable Investments',
    summary: 'Sustainable finance sector achieves historic milestone as investors prioritize environmental and social impact.',
    content: 'The green finance sector has reached an unprecedented $1 trillion in sustainable investments...',
    author: 'Robert Chang',
    publishedAt: '2024-01-10T13:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    pillar: 'economic',
    sdgs: [
      { id: 17, title: 'Partnerships to achieve the Goal', description: '', color: '#19486A', icon: 'Handshake' },
      { id: 13, title: 'Climate Action', description: '', color: '#3F7E44', icon: 'Thermometer' }
    ],
    tags: ['green finance', 'sustainable investing', 'climate finance'],
    readTime: 6,
    impactScore: 8,
    e2sgRating: { environmental: 8, economic: 10, social: 7, governance: 9, overall: 8.5 },
    region: 'North America',
    isBookmarked: true,
    viewCount: 14567,
    shareCount: 389,
    scrapedAt: '2024-01-10T13:30:00Z'
  }
];

export const MOCK_SDG_PROGRESS = [
  { id: 1, progress: 65, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 234 },
  { id: 2, progress: 58, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 189 },
  { id: 3, progress: 72, trend: 'stable' as const, lastUpdated: '2024-01-15', articles: 312 },
  { id: 4, progress: 69, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 278 },
  { id: 5, progress: 61, trend: 'down' as const, lastUpdated: '2024-01-15', articles: 156 },
  { id: 6, progress: 55, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 203 },
  { id: 7, progress: 78, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 445 },
  { id: 8, progress: 63, trend: 'stable' as const, lastUpdated: '2024-01-15', articles: 298 },
  { id: 9, progress: 71, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 367 },
  { id: 10, progress: 52, trend: 'down' as const, lastUpdated: '2024-01-15', articles: 134 },
  { id: 11, progress: 67, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 289 },
  { id: 12, progress: 74, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 398 },
  { id: 13, progress: 45, trend: 'down' as const, lastUpdated: '2024-01-15', articles: 567 },
  { id: 14, progress: 59, trend: 'stable' as const, lastUpdated: '2024-01-15', articles: 223 },
  { id: 15, progress: 62, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 245 },
  { id: 16, progress: 48, trend: 'down' as const, lastUpdated: '2024-01-15', articles: 178 },
  { id: 17, progress: 81, trend: 'up' as const, lastUpdated: '2024-01-15', articles: 456 }
];