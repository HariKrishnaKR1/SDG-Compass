# Component Documentation

This document provides detailed information about each component in the Sustainability News Platform.

## 📋 Table of Contents

1. [LandingChoice](#landingchoice)
2. [Header](#header)
3. [NewsCard](#newscard)
4. [NewsGrid](#newsgrid)
5. [SDGSplitFeed](#sdgsplitfeed)
6. [ArticleModal](#articlemodal)
7. [ImpactDashboard](#impactdashboard)
8. [BookmarkManager](#bookmarkmanager)
9. [AdvancedFilters](#advancedfilters)
10. [PillarTabs](#pillartabs)
11. [SDGFilter](#sdgfilter)

---

## LandingChoice

### Purpose
Initial landing page component that allows users to choose their preferred news feed type.

### Features
- **Feed Selection**: Three distinct feed options (Unified, Dashboard, SDG-Split)
- **Feature Highlights**: Detailed feature lists for each option
- **Statistics Display**: Real-time platform statistics
- **Responsive Design**: Optimized for all screen sizes
- **Theme Support**: Full dark/light mode compatibility

### Props
```typescript
interface LandingChoiceProps {
  onFeedSelect: (feedType: FeedType) => void;
  theme: 'light' | 'dark';
}
```

### Usage
```tsx
<LandingChoice 
  onFeedSelect={setSelectedFeed} 
  theme={preferences.theme}
/>
```

### Feed Options
1. **Unified News Feed**
   - All sustainability news in one place
   - Advanced filtering capabilities
   - Real-time updates
   - Personalized recommendations

2. **Analytics Dashboard**
   - SDG progress tracking
   - Impact analytics
   - Trend visualization
   - Performance metrics

3. **SDG-Focused Feeds**
   - 17 dedicated SDG feeds
   - Goal-specific metrics
   - Progress indicators
   - Targeted content

### Styling
- Gradient backgrounds for visual appeal
- Hover animations and transitions
- Card-based layout with shadows
- Consistent spacing using 8px grid system

---

## Header

### Purpose
Main navigation component providing search, theme toggle, and access to key features.

### Features
- **Global Search**: Real-time article search
- **Theme Toggle**: Dark/light mode switching
- **Bookmark Counter**: Visual bookmark indicator
- **Notifications**: System notifications dropdown
- **Back Navigation**: Return to previous views

### Props
```typescript
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShowBookmarks: () => void;
  onShowDashboard: () => void;
  onShowAdvancedFilters: () => void;
  bookmarkCount: number;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onBack?: () => void;
}
```

### Search Functionality
- **Real-time Search**: Instant filtering as user types
- **Multi-field Search**: Searches title, summary, tags, and author
- **Search Highlighting**: Visual indication of active search
- **Search Persistence**: Maintains search state across navigation

### Notification System
- **Dropdown Interface**: Expandable notification panel
- **Real-time Updates**: Live notification indicators
- **Categorized Notifications**: Different types of alerts
- **Timestamp Display**: When notifications occurred

---

## NewsCard

### Purpose
Individual article display component with comprehensive information and interaction options.

### Features
- **Article Preview**: Image, title, and summary
- **ESG Rating Display**: Visual ESG scoring breakdown
- **SDG Badges**: Related Sustainable Development Goals
- **Bookmark Toggle**: Save/unsave functionality
- **Share Options**: Social sharing capabilities
- **Impact Scoring**: Visual impact level indicators

### Props
```typescript
interface NewsCardProps {
  article: NewsArticle;
  onBookmarkToggle: (articleId: string) => void;
  onShare: (article: NewsArticle) => void;
  onArticleClick?: (article: NewsArticle) => void;
}
```

### ESG Rating System
```typescript
interface ESGRating {
  environmental: number;  // 1-10 scale
  social: number;         // 1-10 scale
  governance: number;     // 1-10 scale
  economic: number;       // 1-10 scale
  overall: number;        // Calculated average
}
```

### Visual Elements
- **Pillar Color Coding**: Environmental (green), Social (blue), Economic (purple)
- **Impact Level Badges**: High/Medium/Low impact indicators
- **Hover Effects**: Smooth transitions and scaling
- **Responsive Images**: Optimized image loading and display

### Interaction Patterns
- **Click to Read**: Opens article modal or external link
- **Bookmark Toggle**: Instant visual feedback
- **Share Button**: Native sharing or clipboard fallback
- **Tag Navigation**: Clickable tags for filtering

---

## NewsGrid

### Purpose
Container component for displaying multiple NewsCard components in a responsive grid layout.

### Features
- **Responsive Grid**: Adapts to screen size (1-3 columns)
- **Loading States**: Skeleton loading animations
- **Empty States**: User-friendly no results messaging
- **Infinite Scroll**: Planned for large datasets

### Props
```typescript
interface NewsGridProps {
  articles: NewsArticle[];
  loading?: boolean;
  onBookmarkToggle: (articleId: string) => void;
  onShare: (article: NewsArticle) => void;
  onArticleClick?: (article: NewsArticle) => void;
}
```

### Grid Behavior
- **Mobile**: Single column layout
- **Tablet**: Two column layout
- **Desktop**: Three column layout
- **Large Screens**: Maintains three columns with increased spacing

### Loading States
- **Skeleton Cards**: Animated placeholders during loading
- **Progressive Loading**: Articles appear as they're processed
- **Error Handling**: Graceful error state display

---

## SDGSplitFeed

### Purpose
Specialized feed component organizing news by individual Sustainable Development Goals.

### Features
- **SDG Overview**: Grid of all 17 SDGs with statistics
- **Individual SDG Feeds**: Dedicated view for each SDG
- **Progress Indicators**: Visual progress bars for each goal
- **Article Counts**: Number of articles per SDG
- **Trend Visualization**: Up/down/stable trend indicators

### Props
```typescript
interface SDGSplitFeedProps {
  articles: NewsArticle[];
  onBack: () => void;
  onBookmarkToggle: (articleId: string) => void;
  onShare: (article: NewsArticle) => void;
  theme: 'light' | 'dark';
}
```

### SDG Card Structure
- **Color Coding**: Official UN SDG colors
- **Progress Metrics**: Calculated from article impact scores
- **Article Count**: Real-time count of related articles
- **Trend Indicators**: Visual trend direction
- **Click Navigation**: Navigate to individual SDG feed

### Progress Calculation
```javascript
const getSDGProgress = (sdgId: number) => {
  const sdgArticles = getSDGArticles(sdgId);
  const avgImpact = sdgArticles.reduce((acc, article) => 
    acc + article.impactScore, 0) / sdgArticles.length || 0;
  return Math.round(avgImpact * 10);
};
```

---

## ArticleModal

### Purpose
Detailed article view modal with comprehensive information and external link integration.

### Features
- **Full Article Display**: Complete article content
- **ESG Breakdown**: Detailed ESG rating visualization
- **SDG Mapping**: All related SDGs with descriptions
- **Source Integration**: Direct link to original article
- **Tag Display**: All article tags with icons

### Props
```typescript
interface ArticleModalProps {
  article: NewsArticle | null;
  isVisible: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}
```

### Layout Structure
- **Two-Panel Layout**: Information sidebar + content area
- **Responsive Design**: Stacks on mobile devices
- **Scrollable Content**: Independent scroll areas
- **Modal Overlay**: Dark background with click-to-close

### Information Panel
- **Article Metadata**: Author, date, read time
- **ESG Rating Bars**: Visual progress bars for each rating
- **SDG Badges**: Color-coded SDG indicators
- **Tag Cloud**: Clickable tag display
- **External Link**: Direct access to source

### Content Area
- **Formatted Text**: Proper typography and spacing
- **Responsive Text**: Scales with screen size
- **Dark Mode Support**: Proper contrast in all themes

---

## ImpactDashboard

### Purpose
Comprehensive analytics dashboard showing SDG progress and sustainability metrics.

### Features
- **Overview Statistics**: Global progress metrics
- **Progress Charts**: Visual SDG progress representation
- **Trend Analysis**: Historical trend indicators
- **Interactive Charts**: Recharts-powered visualizations

### Props
```typescript
interface ImpactDashboardProps {
  sdgProgress: SDGProgress[];
  isVisible: boolean;
  onClose: () => void;
}
```

### Dashboard Sections
1. **Overview Cards**: Key metrics summary
2. **Progress Chart**: Bar chart of SDG progress
3. **Detailed Grid**: Individual SDG progress cards
4. **Trend Indicators**: Visual trend direction

### Chart Configuration
```typescript
const chartData = sdgProgress.slice(0, 10).map(sdg => ({
  name: `SDG ${sdg.id}`,
  progress: sdg.progress,
  articles: sdg.articles
}));
```

### Metrics Calculation
- **Overall Progress**: Average across all SDGs
- **Improving SDGs**: Count of SDGs with upward trends
- **Total Articles**: Sum of all articles across SDGs

---

## BookmarkManager

### Purpose
User bookmark management interface for saved articles organization.

### Features
- **Bookmark Organization**: Group by sustainability pillars
- **Article Preview**: Condensed article information
- **Bulk Actions**: Remove multiple bookmarks
- **Search Functionality**: Find specific bookmarked articles

### Props
```typescript
interface BookmarkManagerProps {
  bookmarkedArticles: NewsArticle[];
  isVisible: boolean;
  onClose: () => void;
  onRemoveBookmark: (articleId: string) => void;
}
```

### Organization Structure
- **Pillar Grouping**: Environmental, Social, Economic sections
- **Article Count**: Number of articles per pillar
- **Chronological Order**: Most recent bookmarks first
- **Quick Actions**: Read and remove buttons

### Empty State
- **Visual Indicator**: Bookmark icon with message
- **Call to Action**: Encouragement to start bookmarking
- **Help Text**: Instructions for using bookmarks

---

## AdvancedFilters

### Purpose
Comprehensive filtering interface for precise article discovery.

### Features
- **Date Range Selection**: Start and end date pickers
- **Region Filtering**: Geographic focus options
- **Impact Level**: High/Medium/Low impact filtering
- **Sort Options**: Multiple sorting criteria

### Props
```typescript
interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  isVisible: boolean;
  onClose: () => void;
}
```

### Filter Categories
1. **Date Range**: Custom date selection
2. **Geographic Region**: Global and regional options
3. **Impact Level**: Article impact significance
4. **Sort Criteria**: Date, impact, popularity

### Filter Persistence
- **State Management**: Maintains filter state
- **Reset Functionality**: Clear all filters option
- **Apply Changes**: Immediate filter application

---

## PillarTabs

### Purpose
Navigation tabs for switching between sustainability pillars.

### Features
- **Pillar Selection**: Environmental, Social, Economic, All
- **Visual Indicators**: Color-coded pillar identification
- **Active State**: Clear indication of selected pillar
- **Icon Integration**: Lucide React icons for each pillar

### Props
```typescript
interface PillarTabsProps {
  activePillar: SustainabilityPillar | 'all';
  onPillarChange: (pillar: SustainabilityPillar | 'all') => void;
}
```

### Pillar Configuration
```typescript
const pillars = [
  { id: 'all', name: 'All News', icon: Globe, color: 'text-gray-600' },
  { id: 'environmental', name: 'Environmental', icon: Leaf, color: 'text-green-600' },
  { id: 'social', name: 'Social', icon: Users, color: 'text-blue-600' },
  { id: 'economic', name: 'Economic', icon: TrendingUp, color: 'text-purple-600' }
];
```

---

## SDGFilter

### Purpose
Interactive filter for selecting specific Sustainable Development Goals.

### Features
- **17 SDG Buttons**: All UN SDGs with official colors
- **Multi-selection**: Select multiple SDGs simultaneously
- **Clear All**: Reset all SDG selections
- **Visual Feedback**: Selected state indication

### Props
```typescript
interface SDGFilterProps {
  selectedSDGs: number[];
  onSDGToggle: (sdgId: number) => void;
  onClearAll: () => void;
}
```

### SDG Button Design
- **Official Colors**: UN-specified SDG colors
- **Responsive Grid**: Adapts to screen size
- **Hover Effects**: Interactive feedback
- **Selection State**: Clear visual indication

### Interaction Patterns
- **Click to Toggle**: Add/remove SDGs from selection
- **Clear All**: Remove all selections at once
- **Visual Feedback**: Immediate state changes
- **Tooltip Support**: SDG descriptions on hover

---

## 🎨 Design Patterns

### Consistent Styling
- **8px Grid System**: Consistent spacing throughout
- **Color Palette**: Defined color scheme for all components
- **Typography**: Oswald for headers, Roboto for body text
- **Border Radius**: Consistent rounded corners (8px, 12px)

### Interaction Patterns
- **Hover States**: Subtle animations and color changes
- **Loading States**: Skeleton screens and spinners
- **Error States**: User-friendly error messages
- **Empty States**: Helpful guidance when no content

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Clear focus states

### Responsive Design
- **Mobile First**: Designed for mobile, enhanced for desktop
- **Breakpoints**: Consistent responsive breakpoints
- **Touch Targets**: Appropriate touch target sizes
- **Flexible Layouts**: Adapts to various screen sizes

---

## 🔧 Development Guidelines

### Component Structure
```typescript
// Standard component structure
interface ComponentProps {
  // Props definition
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return (
    // JSX structure
  );
}
```

### State Management
- **Local State**: useState for component-specific state
- **Shared State**: Custom hooks for shared logic
- **Props Drilling**: Minimal prop passing through context
- **State Persistence**: localStorage for user preferences

### Performance Optimization
- **Memoization**: React.memo for expensive components
- **Lazy Loading**: Dynamic imports for large components
- **Image Optimization**: Proper image sizing and formats
- **Bundle Splitting**: Code splitting for better loading

### Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user flow testing
- **Accessibility Tests**: Automated accessibility checking