# Sustainability News Platform

A comprehensive platform for tracking and analyzing sustainability news across the three pillars of sustainability (Environmental, Social, Economic) and the 17 UN Sustainable Development Goals (SDGs).

## 🌟 Features

### Core Functionality
- **Real-time News Scraping**: Automated collection from trusted sources (Economic Times, UNEP, WEF, etc.)
- **AI-Powered Analysis**: Intelligent categorization and ESG scoring
- **Multiple Feed Types**: Unified feed, analytics dashboard, and SDG-focused feeds
- **Advanced Filtering**: Date ranges, impact levels, regions, and custom search
- **Dark/Light Mode**: Fully responsive theme switching

### User Experience
- **Landing Page**: Choose between different feed types
- **Bookmark Management**: Save and organize articles
- **Article Modal**: In-depth view with ESG ratings and source links
- **Responsive Design**: Optimized for all device sizes
- **Real-time Updates**: Live data from multiple sources

### Analytics & Insights
- **ESG Scoring**: Environmental, Social, Governance, and Economic ratings
- **Impact Assessment**: AI-driven impact scoring (1-10 scale)
- **SDG Mapping**: Automatic alignment with UN Sustainable Development Goals
- **Progress Tracking**: Visual indicators for SDG advancement
- **Trend Analysis**: Historical data and progress visualization

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/          # React components
│   ├── LandingChoice.tsx    # Feed selection page
│   ├── Header.tsx           # Navigation header
│   ├── NewsCard.tsx         # Article display card
│   ├── NewsGrid.tsx         # Article grid layout
│   ├── SDGSplitFeed.tsx     # SDG-focused feeds
│   ├── ArticleModal.tsx     # Article detail modal
│   ├── ImpactDashboard.tsx  # Analytics dashboard
│   ├── BookmarkManager.tsx  # Bookmark management
│   └── AdvancedFilters.tsx  # Advanced filtering
├── hooks/               # Custom React hooks
│   ├── useNewsFilter.ts     # News filtering logic
│   └── useUserPreferences.ts # User settings management
├── data/                # Data management
│   ├── mockNews.ts          # Sample data
│   ├── scrapedNews.json     # Real scraped articles
│   └── sdgs.ts              # SDG definitions
├── scraper/             # Web scraping system
│   └── index.js             # Main scraping logic
└── types/               # TypeScript definitions
    └── index.ts             # Type definitions
```

### Component Architecture

#### LandingChoice Component
**Purpose**: Initial feed selection interface
**Features**:
- Three feed type options (Unified, Dashboard, SDG-Split)
- Feature highlights for each option
- Statistics display
- Theme-aware design

**Props**:
- `onFeedSelect`: Callback for feed selection
- `theme`: Current theme setting

#### Header Component
**Purpose**: Main navigation and search interface
**Features**:
- Global search functionality
- Theme toggle
- Bookmark counter
- Notification system
- Back navigation

**Props**:
- `searchQuery`: Current search term
- `onSearchChange`: Search input handler
- `onShowBookmarks`: Bookmark modal trigger
- `onShowDashboard`: Dashboard modal trigger
- `onShowAdvancedFilters`: Advanced filters trigger
- `bookmarkCount`: Number of bookmarked articles
- `theme`: Current theme
- `onThemeToggle`: Theme switch handler
- `onBack`: Back navigation handler

#### NewsCard Component
**Purpose**: Individual article display
**Features**:
- Article preview with image
- ESG rating display
- SDG badges
- Bookmark toggle
- Share functionality
- Impact scoring

**Props**:
- `article`: Article data object
- `onBookmarkToggle`: Bookmark handler
- `onShare`: Share handler
- `onArticleClick`: Article detail handler

#### SDGSplitFeed Component
**Purpose**: SDG-focused news organization
**Features**:
- 17 SDG category cards
- Progress indicators
- Article count per SDG
- Trend visualization
- Individual SDG article feeds

**Props**:
- `articles`: Full article array
- `onBack`: Return to landing
- `onBookmarkToggle`: Bookmark handler
- `onShare`: Share handler
- `theme`: Current theme

#### ArticleModal Component
**Purpose**: Detailed article view
**Features**:
- Full article content
- Comprehensive ESG breakdown
- Related SDG display
- Source link integration
- Tag visualization

**Props**:
- `article`: Selected article
- `isVisible`: Modal visibility state
- `onClose`: Close modal handler
- `theme`: Current theme

### Data Management

#### News Article Structure
```typescript
interface NewsArticle {
  id: string;                    // Unique identifier
  title: string;                 // Article headline
  summary: string;               // Brief description
  content: string;               // Full article text
  author: string;                // Article author
  publishedAt: string;           // Publication date (ISO)
  imageUrl: string;              // Featured image URL
  sourceUrl: string;             // Original article URL
  source: string;                // Publication source
  pillar: SustainabilityPillar;  // Primary sustainability pillar
  sdgs: SDG[];                   // Related SDGs
  tags: string[];                // Article tags
  readTime: number;              // Estimated read time (minutes)
  impactScore: number;           // AI-calculated impact (1-10)
  esgRating: ESGRating;          // ESG scores
  region: string;                // Geographic focus
  isBookmarked?: boolean;        // User bookmark status
  viewCount: number;             // View statistics
  shareCount: number;            // Share statistics
  scrapedAt: string;             // Scraping timestamp
}
```

#### ESG Rating System
```typescript
interface ESGRating {
  environmental: number;  // Environmental impact (1-10)
  social: number;         // Social impact (1-10)
  governance: number;     // Governance quality (1-10)
  economic: number;       // Economic impact (1-10)
  overall: number;        // Weighted average
}
```

### Scraping System

#### Architecture
The scraping system (`src/scraper/index.js`) implements:
- **Multi-source Support**: Configurable source definitions
- **Rate Limiting**: Respectful scraping with delays
- **Content Analysis**: AI-powered categorization
- **Data Validation**: Quality checks and filtering
- **Error Handling**: Robust error recovery

#### Source Configuration
```javascript
const SOURCES = [
  {
    name: 'Economic Times - Sustainability',
    baseUrl: 'https://economictimes.indiatimes.com',
    searchUrl: 'https://economictimes.indiatimes.com/topic/sustainability',
    selectors: {
      articles: '.eachStory',
      title: 'h3 a, h4 a',
      link: 'h3 a, h4 a',
      summary: '.summary',
      date: '.time',
      author: '.author'
    }
  }
  // Additional sources...
];
```

#### Content Analysis Algorithm
1. **Keyword Matching**: Sustainability pillar classification
2. **SDG Mapping**: Automatic SDG identification
3. **Impact Scoring**: Relevance and importance assessment
4. **ESG Rating**: Multi-dimensional sustainability scoring

### State Management

#### useNewsFilter Hook
**Purpose**: Centralized filtering logic
**Features**:
- Multi-criteria filtering
- Real-time search
- Sort functionality
- Filter persistence

**State**:
```typescript
interface FilterState {
  pillar: SustainabilityPillar | 'all';
  sdgs: number[];
  searchQuery: string;
  dateRange: DateRange;
  impactLevel: 'all' | 'high' | 'medium' | 'low';
  region: string;
  sortBy: 'date' | 'impact' | 'popularity';
}
```

#### useUserPreferences Hook
**Purpose**: User settings and personalization
**Features**:
- Theme management
- Bookmark persistence
- Notification settings
- Local storage integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Run scraper (optional)
npm run scrape
```

### Environment Setup
The application works out of the box with mock data. For real-time scraping:

1. Ensure stable internet connection
2. Run scraper: `npm run scrape`
3. Scraped data will be saved to `src/data/scrapedNews.json`

## 🎨 Design System

### Typography
- **Headers**: Oswald font family (Google Fonts)
- **Body Text**: Roboto font family (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700

### Color Palette
- **Primary**: Green (#10B981) - Environmental focus
- **Secondary**: Blue (#3B82F6) - Social focus
- **Accent**: Purple (#8B5CF6) - Economic focus
- **Neutral**: Gray scale for backgrounds and text

### Dark Mode Implementation
- Comprehensive dark theme support
- Automatic system preference detection
- Manual toggle functionality
- Consistent color contrast ratios

## 📊 Data Sources

### Current Sources
1. **Economic Times**: Sustainability and business news
2. **UNEP**: Environmental policy and research
3. **World Economic Forum**: Global sustainability initiatives
4. **NITI Aayog**: Indian policy and development
5. **Science Direct**: Academic research (planned)

### Scraping Strategy
- **Frequency**: Daily updates
- **Volume**: 50-100 articles per run
- **Timeframe**: Last 3 days
- **Quality Control**: Relevance filtering and deduplication

## 🔧 Configuration

### Scraper Configuration
Modify `src/scraper/index.js` to:
- Add new sources
- Adjust scraping frequency
- Modify content analysis parameters
- Update keyword mappings

### Theme Configuration
Customize themes in `src/index.css`:
- Color variables
- Typography settings
- Component styling
- Responsive breakpoints

## 🚀 Deployment

### Build Process
```bash
# Create production build
npm run build

# Preview build locally
npm run preview
```

### Deployment Options
- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-configuration deployment
- **AWS S3**: Static hosting with CloudFront
- **GitHub Pages**: Free hosting for public repositories

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain component modularity
3. Write comprehensive tests
4. Document new features
5. Ensure accessibility compliance

### Code Style
- Use ESLint configuration
- Follow React best practices
- Implement proper error boundaries
- Maintain consistent naming conventions

## 📈 Future Enhancements

### Planned Features
- **Real-time Notifications**: Push notifications for breaking news
- **AI Summarization**: Automatic article summarization
- **Sentiment Analysis**: Emotional tone detection
- **Trend Prediction**: Predictive analytics for sustainability trends
- **Multi-language Support**: International content support
- **API Integration**: Third-party data sources
- **Mobile App**: React Native implementation

### Technical Improvements
- **Performance Optimization**: Lazy loading and caching
- **Offline Support**: Progressive Web App features
- **Advanced Analytics**: User behavior tracking
- **Machine Learning**: Enhanced content classification
- **Real-time Updates**: WebSocket integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- UN Sustainable Development Goals framework
- Open source community
- Sustainability news sources
- React and TypeScript ecosystems