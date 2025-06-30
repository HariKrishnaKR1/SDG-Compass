# Real Web Scraper Implementation Guide

## 🎯 Overview

This guide explains how the real web scraper works, its implementation details, and how to extend it for production use with a database.

## 🏗️ Architecture

### Current Implementation
```
Real Sources → HTTP Requests → HTML Parsing → Content Analysis → Database Simulation → JSON Output
```

### Production Architecture (Recommended)
```
Real Sources → HTTP Requests → HTML Parsing → Content Analysis → Database (PostgreSQL/MongoDB) → API Endpoints
```

## 📊 How the Scraper Works

### 1. **Source Configuration**
```javascript
const REAL_SOURCES = [
  {
    name: 'Reuters Sustainability',
    baseUrl: 'https://www.reuters.com',
    searchUrl: 'https://www.reuters.com/business/sustainable-business/',
    selectors: {
      articles: '[data-testid="MediaStoryCard"]',  // Container for each article
      title: '[data-testid="Heading"]',            // Article title
      link: 'a',                                   // Link to full article
      summary: '[data-testid="Body"]',             // Article summary
      date: 'time',                                // Publication date
      author: '[data-testid="AuthorName"]'         // Author name
    }
  }
  // ... more sources
];
```

### 2. **Content Analysis Engine**
The scraper uses AI-powered content analysis to:
- **Classify sustainability pillars** (Environmental, Social, Economic)
- **Map to UN SDGs** based on keyword analysis
- **Calculate ESG ratings** across 4 dimensions
- **Determine impact scores** (1-10 scale)
- **Filter relevance** (only sustainability-related content)

### 3. **Smart Filtering**
```javascript
function analyzeContent(title, summary, content) {
  // Keyword-based analysis
  // Pillar classification
  // SDG mapping
  // ESG scoring
  // Confidence calculation
  
  return {
    pillar: 'environmental',
    relevantSDGs: [7, 13, 9],
    esgRating: { environmental: 8, social: 6, governance: 7, economic: 5 },
    impactScore: 8,
    confidence: 0.85
  };
}
```

## 🚀 Running the Scraper

### Manual Execution
```bash
# Run the scraper
npm run scrape

# Test mode (limited articles)
npm run scrape:test
```

### Programmatic Usage
```javascript
import { scrapeAllSources } from './src/scraper/realScraper.js';

const articles = await scrapeAllSources();
console.log(`Scraped ${articles.length} articles`);
```

## 💾 Database Integration

### Current: JSON File Storage
```javascript
// Saves to src/data/scrapedNews.json
writeFileSync(outputPath, JSON.stringify(articles, null, 2));
```

### Production: Database Storage
```javascript
// Example with PostgreSQL
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function saveToDatabase(articles) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    for (const article of articles) {
      await client.query(`
        INSERT INTO articles (
          id, title, summary, content, author, published_at,
          image_url, source_url, source, pillar, sdgs, tags,
          read_time, impact_score, esg_rating, region,
          view_count, share_count, scraped_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (source_url) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          scraped_at = EXCLUDED.scraped_at
      `, [
        article.id, article.title, article.summary, article.content,
        article.author, article.publishedAt, article.imageUrl,
        article.sourceUrl, article.source, article.pillar,
        JSON.stringify(article.sdgs), JSON.stringify(article.tags),
        article.readTime, article.impactScore, JSON.stringify(article.esgRating),
        article.region, article.viewCount, article.shareCount, article.scrapedAt
      ]);
    }
    
    await client.query('COMMIT');
    console.log(`Saved ${articles.length} articles to database`);
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

## 🔧 Database Schema

### PostgreSQL Schema
```sql
CREATE TABLE articles (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  author VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  source_url TEXT UNIQUE NOT NULL,
  source VARCHAR(255),
  pillar VARCHAR(50),
  sdgs JSONB,
  tags JSONB,
  read_time INTEGER,
  impact_score INTEGER,
  esg_rating JSONB,
  region VARCHAR(100),
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_articles_pillar ON articles(pillar);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_impact_score ON articles(impact_score DESC);
CREATE INDEX idx_articles_source ON articles(source);
CREATE INDEX idx_articles_region ON articles(region);
CREATE INDEX idx_articles_sdgs ON articles USING GIN(sdgs);
```

### MongoDB Schema
```javascript
const articleSchema = {
  _id: ObjectId,
  id: String,
  title: String,
  summary: String,
  content: String,
  author: String,
  publishedAt: Date,
  imageUrl: String,
  sourceUrl: String, // Unique index
  source: String,
  pillar: String,
  sdgs: [{ id: Number, title: String, color: String }],
  tags: [String],
  readTime: Number,
  impactScore: Number,
  esgRating: {
    environmental: Number,
    social: Number,
    governance: Number,
    economic: Number,
    overall: Number
  },
  region: String,
  viewCount: Number,
  shareCount: Number,
  scrapedAt: Date,
  createdAt: Date,
  updatedAt: Date
};
```

## 🔍 Real Article Sources

### Currently Implemented
1. **Reuters Sustainability** - Business sustainability news
2. **Guardian Environment** - Environmental journalism
3. **BBC Future Planet** - Climate and sustainability features
4. **UN News** - Official UN sustainability updates
5. **World Bank News** - Development and sustainability

### Selector Strategy
Each source requires specific CSS selectors:
```javascript
// Example: Finding the right selectors
// 1. Inspect the website's HTML structure
// 2. Identify consistent patterns
// 3. Test selectors in browser console
// 4. Implement with fallbacks

selectors: {
  articles: '.article-card, .news-item, .story-card',  // Multiple fallbacks
  title: 'h1 a, h2 a, .title a',                       // Flexible title selection
  link: 'a[href*="/article/"], a[href*="/story/"]',    // Link patterns
  summary: '.summary, .excerpt, .description',         // Content patterns
  date: 'time, .date, .published',                     // Date patterns
  author: '.author, .byline, .writer'                  // Author patterns
}
```

## 🛡️ Error Handling & Rate Limiting

### Robust Error Handling
```javascript
async function scrapeWithRetry(source, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await scrapeSource(source);
    } catch (error) {
      console.warn(`Attempt ${attempt} failed for ${source.name}:`, error.message);
      
      if (attempt === maxRetries) {
        console.error(`All attempts failed for ${source.name}`);
        return [];
      }
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

### Rate Limiting
```javascript
// Respectful scraping with delays
for (const source of REAL_SOURCES) {
  const articles = await scrapeSource(source);
  allArticles.push(...articles);
  
  // 3-second delay between sources
  await new Promise(resolve => setTimeout(resolve, 3000));
}
```

## 📈 Performance Optimization

### Parallel Processing (Advanced)
```javascript
// Process multiple sources in parallel with rate limiting
async function scrapeAllSourcesParallel() {
  const promises = REAL_SOURCES.map((source, index) => 
    new Promise(resolve => 
      setTimeout(() => 
        scrapeSource(source).then(resolve), 
        index * 2000 // Stagger requests
      )
    )
  );
  
  const results = await Promise.all(promises);
  return results.flat();
}
```

### Caching Strategy
```javascript
// Cache results to avoid re-scraping
const cache = new Map();

async function scrapeWithCache(source) {
  const cacheKey = `${source.name}-${new Date().toDateString()}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const articles = await scrapeSource(source);
  cache.set(cacheKey, articles);
  
  return articles;
}
```

## 🔄 Automated Scheduling

### Cron Job Setup
```bash
# Run scraper every 6 hours
0 */6 * * * cd /path/to/project && npm run scrape

# Run scraper daily at 6 AM
0 6 * * * cd /path/to/project && npm run scrape
```

### Node.js Scheduler
```javascript
import cron from 'node-cron';

// Schedule scraping every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Starting scheduled scraping...');
  try {
    const articles = await scrapeAllSources();
    console.log(`Scheduled scraping completed: ${articles.length} articles`);
  } catch (error) {
    console.error('Scheduled scraping failed:', error);
  }
});
```

## 🚀 Production Deployment

### Environment Variables
```bash
# .env file
DATABASE_URL=postgresql://user:password@localhost:5432/sustainability_news
SCRAPER_DELAY=3000
SCRAPER_MAX_ARTICLES=100
SCRAPER_TIMEOUT=15000
LOG_LEVEL=info
```

### Docker Setup
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Install cron for scheduling
RUN apk add --no-cache dcron

# Add cron job
RUN echo "0 */6 * * * cd /app && npm run scrape" | crontab -

CMD ["sh", "-c", "crond && npm start"]
```

## 📊 Monitoring & Analytics

### Scraping Metrics
```javascript
const metrics = {
  totalSources: REAL_SOURCES.length,
  successfulSources: 0,
  failedSources: 0,
  totalArticles: 0,
  relevantArticles: 0,
  averageConfidence: 0,
  pillarDistribution: {},
  sdgDistribution: {},
  executionTime: 0
};
```

### Health Checks
```javascript
// API endpoint for scraper health
app.get('/api/scraper/health', async (req, res) => {
  const lastRun = await getLastScrapingRun();
  const hoursAgo = (Date.now() - lastRun.timestamp) / (1000 * 60 * 60);
  
  res.json({
    status: hoursAgo < 12 ? 'healthy' : 'stale',
    lastRun: lastRun.timestamp,
    articlesScraped: lastRun.count,
    nextScheduledRun: getNextScheduledRun()
  });
});
```

## 🔧 Extending the Scraper

### Adding New Sources
1. **Analyze the website structure**
2. **Identify CSS selectors**
3. **Test selectors in browser**
4. **Add to REAL_SOURCES array**
5. **Test with small batch**

### Custom Content Analysis
```javascript
// Add custom keyword sets
const CUSTOM_KEYWORDS = {
  'renewable_energy': ['solar', 'wind', 'hydroelectric', 'geothermal'],
  'circular_economy': ['recycling', 'reuse', 'waste reduction', 'circular'],
  'social_impact': ['community', 'education', 'healthcare', 'equality']
};

// Extend analysis function
function customAnalyzeContent(title, summary, content) {
  const baseAnalysis = analyzeContent(title, summary, content);
  
  // Add custom scoring
  const customScores = calculateCustomScores(title, summary, content);
  
  return {
    ...baseAnalysis,
    customScores
  };
}
```

This implementation provides a robust foundation for real-time sustainability news scraping with proper error handling, rate limiting, and extensibility for production use.