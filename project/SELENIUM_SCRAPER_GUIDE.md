# Selenium Web Scraper Implementation Guide

## 🎯 Overview

This guide explains the Selenium-based web scraper implementation for real sustainability news articles. Selenium provides better JavaScript handling, dynamic content loading, and more reliable scraping compared to basic HTTP requests.

## 🏗️ Architecture

### Selenium Scraping Flow
```
Selenium WebDriver → Real Websites → Dynamic Content Loading → HTML Parsing → Content Analysis → Database Storage
```

### Key Advantages over Basic Scraping
- **JavaScript Execution**: Handles dynamic content loading
- **Real Browser Environment**: Better compatibility with modern websites
- **Scroll Loading**: Can load more content by scrolling
- **Wait Strategies**: Waits for elements to load before scraping
- **Better Error Handling**: More robust against website changes

## 🔧 Technical Implementation

### 1. **Selenium WebDriver Setup**
```javascript
async function setupDriver() {
  const options = new chrome.Options();
  
  // Headless mode for server environments
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1920,1080');
  
  // Performance optimizations
  options.addArguments('--disable-images');
  options.addArguments('--disable-plugins');
  options.addArguments('--disable-extensions');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
    
  return driver;
}
```

### 2. **Enhanced Source Configuration**
```javascript
const SELENIUM_SOURCES = [
  {
    name: 'Economic Times Sustainability',
    baseUrl: 'https://economictimes.indiatimes.com',
    searchUrl: 'https://economictimes.indiatimes.com/topic/sustainability',
    selectors: {
      articles: '.eachStory',
      title: 'h3 a, h4 a, .story-title a',
      link: 'h3 a, h4 a, .story-title a',
      summary: '.summary, .story-summary',
      date: '.time, .story-date',
      author: '.author, .story-author'
    },
    waitForElement: '.eachStory',    // Element to wait for
    scrollToLoad: true               // Whether to scroll for more content
  }
  // ... more sources
];
```

### 3. **Dynamic Content Loading**
```javascript
async function scrollToLoadContent(driver) {
  try {
    const initialHeight = await driver.executeScript('return document.body.scrollHeight');
    
    // Scroll down in steps to load more content
    for (let i = 0; i < 3; i++) {
      await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
      await driver.sleep(2000);
      
      const newHeight = await driver.executeScript('return document.body.scrollHeight');
      if (newHeight === initialHeight) break; // No more content to load
    }
    
    // Scroll back to top
    await driver.executeScript('window.scrollTo(0, 0)');
    await driver.sleep(1000);
    
  } catch (error) {
    console.log('⚠️  Scrolling failed, continuing...');
  }
}
```

### 4. **Smart Wait Strategies**
```javascript
async function scrapeSourceWithSelenium(driver, source) {
  // Navigate to URL
  await driver.get(source.searchUrl);
  
  // Wait for specific element to load
  try {
    await driver.wait(until.elementLocated(By.css(source.waitForElement)), 15000);
  } catch (error) {
    console.log(`⚠️  Wait element not found for ${source.name}, continuing...`);
  }
  
  // Load dynamic content if needed
  if (source.scrollToLoad) {
    await scrollToLoadContent(driver);
  }
  
  // Wait for content to stabilize
  await driver.sleep(2000);
}
```

## 📊 Enhanced Content Analysis

### 1. **Improved Keyword Detection**
```javascript
const SUSTAINABILITY_KEYWORDS = {
  environmental: [
    'climate change', 'global warming', 'carbon emissions', 'renewable energy',
    'solar power', 'wind energy', 'biodiversity', 'conservation', 'ecosystem',
    'deforestation', 'ocean pollution', 'water scarcity', 'air quality',
    'green technology', 'sustainable agriculture', 'wildlife protection',
    'circular economy', 'waste management', 'recycling', 'pollution control'
  ],
  social: [
    'social justice', 'human rights', 'gender equality', 'education access',
    'healthcare', 'poverty reduction', 'community development', 'fair trade',
    'labor rights', 'social inclusion', 'diversity', 'equality',
    'food security', 'social welfare', 'humanitarian', 'development aid'
  ],
  economic: [
    'sustainable finance', 'green bonds', 'impact investing', 'ESG investing',
    'sustainable business', 'green growth', 'economic development',
    'financial inclusion', 'microfinance', 'sustainable supply chain',
    'green jobs', 'sustainable economics', 'economic sustainability'
  ]
};
```

### 2. **Confidence Scoring**
```javascript
function analyzeContent(title, summary, content) {
  const text = `${title} ${summary} ${content}`.toLowerCase();
  const wordCount = text.split(' ').length;
  
  // Calculate keyword matches with weighting
  let totalMatches = 0;
  Object.entries(SUSTAINABILITY_KEYWORDS).forEach(([pillar, keywords]) => {
    keywords.forEach(keyword => {
      const matches = (text.match(new RegExp(keyword, 'gi')) || []).length;
      if (matches > 0) {
        const weight = keyword.split(' ').length; // Longer keywords get higher weight
        totalMatches += matches * weight;
      }
    });
  });
  
  // Calculate confidence based on keyword density
  const confidence = totalMatches / wordCount;
  
  // Skip if confidence is too low
  if (confidence < 0.02 || totalMatches < 2) return null;
  
  return { confidence, /* ... other analysis results */ };
}
```

## 🚀 Running the Selenium Scraper

### Prerequisites
```bash
# Install dependencies
npm install selenium-webdriver chromedriver

# Ensure Chrome is installed on your system
# For Ubuntu/Debian:
sudo apt-get install google-chrome-stable

# For macOS:
brew install --cask google-chrome
```

### Execution
```bash
# Run the Selenium scraper
npm run scrape

# Test mode (limited articles)
npm run scrape:test
```

### Programmatic Usage
```javascript
import { scrapeAllSourcesWithSelenium } from './src/scraper/seleniumScraper.js';

try {
  const articles = await scrapeAllSourcesWithSelenium();
  console.log(`Successfully scraped ${articles.length} articles`);
} catch (error) {
  console.error('Scraping failed:', error);
}
```

## 💾 Database Integration

### Current Implementation
```javascript
function saveToDatabase(articles) {
  const dbPath = join(process.cwd(), 'src', 'data', 'database.json');
  let database = { articles: [], lastUpdated: null, metadata: {} };
  
  if (existsSync(dbPath)) {
    database = JSON.parse(readFileSync(dbPath, 'utf8'));
  }
  
  // Remove duplicates based on source URL
  const existingUrls = new Set(database.articles.map(a => a.sourceUrl));
  const newArticles = articles.filter(a => !existingUrls.has(a.sourceUrl));
  
  // Add metadata
  database.metadata = {
    totalArticles: database.articles.length,
    lastScrapingRun: new Date().toISOString(),
    newArticlesAdded: newArticles.length,
    sources: [...new Set(database.articles.map(a => a.source))],
    pillarDistribution: /* calculate distribution */
  };
  
  writeFileSync(dbPath, JSON.stringify(database, null, 2));
}
```

### Production Database Schema
```sql
-- PostgreSQL schema for production use
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
  confidence DECIMAL(5,4),
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_articles_pillar ON articles(pillar);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_confidence ON articles(confidence DESC);
CREATE INDEX idx_articles_source_url ON articles(source_url);
CREATE INDEX idx_articles_sdgs ON articles USING GIN(sdgs);
```

## 🔍 Real Sources Implementation

### 1. **Economic Times**
- **URL**: `https://economictimes.indiatimes.com/topic/sustainability`
- **Content**: Indian business sustainability news
- **Selectors**: `.eachStory` containers with `.story-title` links
- **Special**: Requires scrolling to load more articles

### 2. **UNEP News**
- **URL**: `https://www.unep.org/news-and-stories/news`
- **Content**: Official UN environmental news
- **Selectors**: `.card` containers with `.card-title` links
- **Special**: Dynamic loading with JavaScript

### 3. **World Economic Forum**
- **URL**: `https://www.weforum.org/agenda/archive/sustainability/`
- **Content**: Global sustainability insights
- **Selectors**: `.article-card` containers
- **Special**: Complex JavaScript-based navigation

### 4. **NITI Aayog**
- **URL**: `https://www.niti.gov.in/content/sustainable-development-goals`
- **Content**: Indian government SDG updates
- **Selectors**: `.view-content .views-row` containers
- **Special**: Government portal with specific structure

### 5. **Reuters Sustainability**
- **URL**: `https://www.reuters.com/business/sustainable-business/`
- **Content**: Global business sustainability news
- **Selectors**: `[data-testid="MediaStoryCard"]` containers
- **Special**: React-based components with data attributes

## 🛡️ Error Handling & Resilience

### 1. **Robust Error Recovery**
```javascript
async function scrapeSourceWithSelenium(driver, source) {
  try {
    await driver.get(source.searchUrl);
    
    // Multiple fallback strategies
    try {
      await driver.wait(until.elementLocated(By.css(source.waitForElement)), 15000);
    } catch (waitError) {
      console.log(`⚠️  Primary wait failed, trying alternative...`);
      // Try alternative selectors or continue without waiting
    }
    
    // Continue with scraping even if some elements fail
    
  } catch (error) {
    console.error(`❌ Error scraping ${source.name}:`, error.message);
    return []; // Return empty array instead of crashing
  }
}
```

### 2. **Rate Limiting & Respect**
```javascript
// Respectful scraping with proper delays
for (const source of SELENIUM_SOURCES) {
  try {
    const articles = await scrapeSourceWithSelenium(driver, source);
    allArticles.push(...articles);
    
    // 5-second delay between sources
    console.log(`⏳ Waiting 5 seconds before next source...`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (error) {
    console.error(`❌ Failed to scrape ${source.name}:`, error.message);
    continue; // Continue with next source
  }
}
```

### 3. **Resource Management**
```javascript
async function scrapeAllSourcesWithSelenium() {
  let driver;
  
  try {
    driver = await setupDriver();
    // ... scraping logic
    
  } catch (error) {
    console.error('Scraping failed:', error);
    throw error;
  } finally {
    // Always clean up resources
    if (driver) {
      await driver.quit();
      console.log('🔧 Selenium WebDriver closed');
    }
  }
}
```

## 📈 Performance Optimization

### 1. **Browser Optimization**
```javascript
const options = new chrome.Options();

// Performance optimizations
options.addArguments('--disable-images');      // Don't load images
options.addArguments('--disable-plugins');     // Disable plugins
options.addArguments('--disable-extensions');  // Disable extensions
options.addArguments('--disable-dev-shm-usage'); // Overcome limited resource problems
options.addArguments('--no-sandbox');          // Bypass OS security model
```

### 2. **Parallel Processing (Advanced)**
```javascript
// Process multiple sources in parallel with controlled concurrency
async function scrapeSourcesInParallel() {
  const concurrency = 2; // Max 2 browsers at once
  const chunks = [];
  
  for (let i = 0; i < SELENIUM_SOURCES.length; i += concurrency) {
    chunks.push(SELENIUM_SOURCES.slice(i, i + concurrency));
  }
  
  const allArticles = [];
  
  for (const chunk of chunks) {
    const promises = chunk.map(async (source) => {
      const driver = await setupDriver();
      try {
        return await scrapeSourceWithSelenium(driver, source);
      } finally {
        await driver.quit();
      }
    });
    
    const results = await Promise.all(promises);
    allArticles.push(...results.flat());
    
    // Delay between chunks
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  return allArticles;
}
```

## 🔄 Automated Scheduling

### 1. **Cron Job Setup**
```bash
# Add to crontab (crontab -e)
# Run every 6 hours
0 */6 * * * cd /path/to/project && npm run scrape >> /var/log/scraper.log 2>&1

# Run daily at 6 AM
0 6 * * * cd /path/to/project && npm run scrape
```

### 2. **Node.js Scheduler**
```javascript
import cron from 'node-cron';
import { scrapeAllSourcesWithSelenium } from './seleniumScraper.js';

// Schedule scraping every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('🕐 Starting scheduled Selenium scraping...');
  try {
    const articles = await scrapeAllSourcesWithSelenium();
    console.log(`✅ Scheduled scraping completed: ${articles.length} articles`);
  } catch (error) {
    console.error('❌ Scheduled scraping failed:', error);
  }
});
```

## 🚀 Production Deployment

### 1. **Docker Setup**
```dockerfile
FROM node:18-alpine

# Install Chrome and dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set Chrome path
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S scraper -u 1001
USER scraper

CMD ["npm", "run", "scrape"]
```

### 2. **Environment Configuration**
```bash
# .env file
SELENIUM_HEADLESS=true
SELENIUM_TIMEOUT=30000
SCRAPER_DELAY=5000
SCRAPER_MAX_ARTICLES=100
DATABASE_URL=postgresql://user:password@localhost:5432/sustainability_news
LOG_LEVEL=info
CHROME_BIN=/usr/bin/google-chrome
```

### 3. **Health Monitoring**
```javascript
// Health check endpoint
app.get('/api/scraper/health', async (req, res) => {
  try {
    const lastRun = await getLastScrapingRun();
    const hoursAgo = (Date.now() - lastRun.timestamp) / (1000 * 60 * 60);
    
    res.json({
      status: hoursAgo < 12 ? 'healthy' : 'stale',
      lastRun: lastRun.timestamp,
      articlesScraped: lastRun.count,
      sources: lastRun.sources,
      averageConfidence: lastRun.averageConfidence,
      nextScheduledRun: getNextScheduledRun()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});
```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Chrome/Chromium Not Found**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install google-chrome-stable

# Alpine Linux (Docker)
apk add --no-cache chromium

# Set environment variable
export CHROME_BIN=/usr/bin/google-chrome
```

#### 2. **Memory Issues**
```javascript
// Increase memory limits
options.addArguments('--max_old_space_size=4096');
options.addArguments('--disable-dev-shm-usage');

// Use smaller window size
options.addArguments('--window-size=1280,720');
```

#### 3. **Timeout Issues**
```javascript
// Increase timeouts
await driver.manage().setTimeouts({
  implicit: 15000,    // Wait for elements
  pageLoad: 45000,    // Page load timeout
  script: 30000       // Script execution timeout
});
```

#### 4. **Selector Issues**
```javascript
// Use multiple fallback selectors
const selectors = [
  '.primary-selector',
  '.fallback-selector',
  '.alternative-selector'
];

for (const selector of selectors) {
  try {
    const elements = await driver.findElements(By.css(selector));
    if (elements.length > 0) {
      // Use this selector
      break;
    }
  } catch (error) {
    continue;
  }
}
```

This Selenium implementation provides a robust, production-ready solution for scraping real sustainability news articles with proper error handling, rate limiting, and scalability considerations.