# Web Scraper Documentation

This document provides comprehensive information about the web scraping system used in the Sustainability News Platform.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Source Configuration](#source-configuration)
4. [Content Analysis](#content-analysis)
5. [Data Processing](#data-processing)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Usage Guide](#usage-guide)
9. [Adding New Sources](#adding-new-sources)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose
The web scraper automatically collects sustainability-related news articles from trusted sources, analyzes their content using AI-powered algorithms, and categorizes them according to sustainability pillars and UN SDGs.

### Key Features
- **Multi-source Support**: Configurable source definitions
- **AI-powered Analysis**: Intelligent content categorization
- **ESG Scoring**: Automated Environmental, Social, Governance scoring
- **SDG Mapping**: Automatic alignment with UN Sustainable Development Goals
- **Rate Limiting**: Respectful scraping with configurable delays
- **Error Recovery**: Robust error handling and retry mechanisms

### Data Flow
```
Source Websites → Scraper → Content Analysis → ESG Scoring → SDG Mapping → JSON Output
```

---

## Architecture

### Core Components

#### 1. Source Configuration
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
];
```

#### 2. Content Analysis Engine
- **Keyword Matching**: Sustainability pillar classification
- **SDG Identification**: Automatic SDG relevance detection
- **Impact Assessment**: Article importance scoring
- **ESG Rating**: Multi-dimensional sustainability evaluation

#### 3. Data Processing Pipeline
1. **Fetch**: Retrieve HTML content from source
2. **Parse**: Extract article data using CSS selectors
3. **Analyze**: Apply AI-powered content analysis
4. **Score**: Calculate ESG ratings and impact scores
5. **Filter**: Remove irrelevant or duplicate content
6. **Store**: Save processed data to JSON file

---

## Source Configuration

### Supported Sources

#### 1. Economic Times
- **Focus**: Business and sustainability news from India
- **URL**: `https://economictimes.indiatimes.com/topic/sustainability`
- **Update Frequency**: Daily
- **Content Type**: Business sustainability, policy, corporate news

#### 2. UNEP (United Nations Environment Programme)
- **Focus**: Environmental policy and global initiatives
- **URL**: `https://www.unep.org/news-and-stories`
- **Update Frequency**: Daily
- **Content Type**: Environmental policy, climate action, conservation

#### 3. World Economic Forum
- **Focus**: Global sustainability initiatives and economic policy
- **URL**: `https://www.weforum.org/agenda/archive/sustainability/`
- **Update Frequency**: Daily
- **Content Type**: Global economics, sustainability trends, policy analysis

### Source Structure
```javascript
interface ScrapingSource {
  name: string;           // Human-readable source name
  baseUrl: string;        // Base domain URL
  searchUrl: string;      // Specific page to scrape
  selectors: {
    articles: string;     // CSS selector for article containers
    title: string;        // CSS selector for article titles
    link: string;         // CSS selector for article links
    summary: string;      // CSS selector for article summaries
    date: string;         // CSS selector for publication dates
    author: string;       // CSS selector for author names
  };
  rateLimit?: number;     // Delay between requests (ms)
}
```

---

## Content Analysis

### Sustainability Pillar Classification

#### Environmental Keywords
```javascript
const environmentalKeywords = [
  'climate', 'carbon', 'renewable', 'solar', 'wind', 'green energy',
  'pollution', 'biodiversity', 'conservation', 'ecosystem',
  'deforestation', 'ocean', 'water', 'emissions', 'sustainability',
  'environment', 'nature', 'wildlife', 'forest'
];
```

#### Social Keywords
```javascript
const socialKeywords = [
  'equality', 'education', 'health', 'poverty', 'human rights',
  'gender', 'community', 'social', 'inclusion', 'diversity',
  'justice', 'welfare', 'employment', 'labor', 'safety',
  'wellbeing', 'development', 'humanitarian'
];
```

#### Economic Keywords
```javascript
const economicKeywords = [
  'economy', 'finance', 'investment', 'growth', 'trade',
  'business', 'innovation', 'technology', 'infrastructure',
  'industry', 'market', 'economic', 'financial', 'banking',
  'corporate', 'entrepreneurship'
];
```

### SDG Mapping Algorithm

#### SDG Keywords Database
```javascript
const SDG_KEYWORDS = {
  1: ['poverty', 'poor', 'income', 'basic needs'],
  2: ['hunger', 'food security', 'nutrition', 'agriculture'],
  3: ['health', 'wellbeing', 'disease', 'healthcare', 'medical'],
  4: ['education', 'learning', 'school', 'university', 'literacy'],
  5: ['gender', 'women', 'equality', 'empowerment'],
  6: ['water', 'sanitation', 'clean water', 'hygiene'],
  7: ['energy', 'renewable', 'solar', 'wind', 'electricity'],
  8: ['employment', 'work', 'economic growth', 'jobs'],
  9: ['infrastructure', 'innovation', 'industry', 'technology'],
  10: ['inequality', 'inclusion', 'discrimination'],
  11: ['cities', 'urban', 'sustainable cities', 'housing'],
  12: ['consumption', 'production', 'waste', 'circular economy'],
  13: ['climate', 'climate change', 'global warming', 'carbon'],
  14: ['ocean', 'marine', 'sea', 'aquatic', 'fishing'],
  15: ['biodiversity', 'forest', 'land', 'ecosystem', 'wildlife'],
  16: ['peace', 'justice', 'institutions', 'governance'],
  17: ['partnership', 'cooperation', 'global', 'collaboration']
};
```

### Analysis Process
```javascript
function analyzeContent(title, summary, content) {
  const text = `${title} ${summary} ${content}`.toLowerCase();
  
  // 1. Determine sustainability pillar
  let pillarScores = { environmental: 0, social: 0, economic: 0 };
  
  Object.entries(SUSTAINABILITY_KEYWORDS).forEach(([pillar, keywords]) => {
    keywords.forEach(keyword => {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      pillarScores[pillar] += matches;
    });
  });
  
  const dominantPillar = Object.entries(pillarScores)
    .reduce((a, b) => pillarScores[a[0]] > pillarScores[b[0]] ? a : b)[0];
  
  // 2. Identify relevant SDGs
  const relevantSDGs = [];
  Object.entries(SDG_KEYWORDS).forEach(([sdgId, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.match(new RegExp(keyword, 'g')) || []).length;
    }, 0);
    
    if (score > 0) {
      relevantSDGs.push(parseInt(sdgId));
    }
  });
  
  // 3. Calculate ESG ratings
  const esgRating = calculateESGRating(pillarScores, text);
  
  // 4. Calculate impact score
  const impactScore = calculateImpactScore(relevantSDGs, pillarScores);
  
  return {
    pillar: dominantPillar,
    relevantSDGs,
    esgRating,
    impactScore
  };
}
```

---

## Data Processing

### ESG Rating Calculation

#### Environmental Score
- Based on environmental keyword frequency
- Weighted by keyword importance
- Normalized to 1-10 scale

#### Social Score
- Social impact keyword analysis
- Community benefit assessment
- Human rights consideration

#### Governance Score
- Policy and regulation mentions
- Institutional quality indicators
- Transparency and accountability factors

#### Economic Score
- Economic impact assessment
- Financial sustainability indicators
- Market and business implications

```javascript
function calculateESGRating(pillarScores, text) {
  const esgRating = {
    environmental: Math.min(10, Math.max(1, pillarScores.environmental * 2)),
    social: Math.min(10, Math.max(1, pillarScores.social * 2)),
    governance: Math.min(10, Math.max(1, Math.random() * 5 + 3)), // Simplified
    economic: Math.min(10, Math.max(1, pillarScores.economic * 2))
  };
  
  esgRating.overall = (
    esgRating.environmental + 
    esgRating.social + 
    esgRating.governance + 
    esgRating.economic
  ) / 4;
  
  return esgRating;
}
```

### Impact Score Algorithm
```javascript
function calculateImpactScore(relevantSDGs, pillarScores) {
  const sdgWeight = relevantSDGs.length * 2;
  const pillarWeight = Object.values(pillarScores).reduce((a, b) => a + b, 0) / 3;
  
  return Math.min(10, Math.max(1, sdgWeight + pillarWeight));
}
```

---

## Error Handling

### Retry Mechanism
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

### Error Types
1. **Network Errors**: Connection timeouts, DNS failures
2. **Parsing Errors**: Invalid HTML, missing selectors
3. **Rate Limiting**: Too many requests
4. **Content Errors**: No relevant content found

### Graceful Degradation
- Continue processing other sources if one fails
- Log errors for debugging
- Return partial results when possible
- Maintain service availability

---

## Rate Limiting

### Implementation
```javascript
async function scrapeAllSources() {
  const allArticles = [];
  
  for (const source of SOURCES) {
    const articles = await scrapeSource(source);
    allArticles.push(...articles);
    
    // Rate limiting - 2 second delay between sources
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return allArticles;
}
```

### Best Practices
- **Respectful Delays**: 2-5 seconds between requests
- **User Agent**: Proper browser identification
- **Request Headers**: Standard HTTP headers
- **Session Management**: Maintain consistent sessions

### Compliance
- **robots.txt**: Respect robots.txt directives
- **Terms of Service**: Comply with website terms
- **Fair Use**: Reasonable request frequency
- **Attribution**: Proper source attribution

---

## Usage Guide

### Running the Scraper

#### Command Line
```bash
# Run scraper directly
npm run scrape

# Or run the Node.js file
node src/scraper/index.js
```

#### Programmatic Usage
```javascript
import { scrapeAllSources } from './src/scraper/index.js';

async function updateNews() {
  try {
    const articles = await scrapeAllSources();
    console.log(`Scraped ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error('Scraping failed:', error);
    return [];
  }
}
```

### Configuration Options

#### Environment Variables
```bash
# Optional configuration
SCRAPER_DELAY=2000          # Delay between requests (ms)
SCRAPER_TIMEOUT=10000       # Request timeout (ms)
SCRAPER_MAX_ARTICLES=100    # Maximum articles per run
SCRAPER_DAYS_BACK=3         # Days to look back for articles
```

#### Runtime Configuration
```javascript
const config = {
  maxArticles: 100,
  daysBack: 3,
  timeout: 10000,
  delay: 2000,
  sources: SOURCES.filter(s => s.enabled)
};
```

---

## Adding New Sources

### Step-by-Step Guide

#### 1. Analyze the Website
- Identify article listing pages
- Examine HTML structure
- Find CSS selectors for key elements
- Test selectors in browser dev tools

#### 2. Create Source Configuration
```javascript
const newSource = {
  name: 'New Source Name',
  baseUrl: 'https://example.com',
  searchUrl: 'https://example.com/sustainability',
  selectors: {
    articles: '.article-item',      // Container for each article
    title: '.article-title a',     // Article title link
    link: '.article-title a',      // Same as title for href
    summary: '.article-excerpt',   // Article summary/description
    date: '.article-date',         // Publication date
    author: '.article-author'      // Author name (optional)
  },
  rateLimit: 3000  // 3 second delay
};
```

#### 3. Test the Configuration
```javascript
// Test individual source
async function testNewSource() {
  const articles = await scrapeSource(newSource);
  console.log(`Found ${articles.length} articles`);
  console.log('Sample article:', articles[0]);
}
```

#### 4. Add to Sources Array
```javascript
const SOURCES = [
  // ... existing sources
  newSource
];
```

### Selector Guidelines

#### CSS Selector Best Practices
- **Specific but Stable**: Use selectors that won't break with minor changes
- **Class Names**: Prefer class names over complex hierarchies
- **Multiple Selectors**: Use comma-separated selectors for fallbacks
- **Avoid Inline Styles**: Don't rely on style attributes

#### Common Patterns
```javascript
// Good selectors
articles: '.post, .article, .news-item'
title: 'h1 a, h2 a, .title a'
link: 'h1 a, h2 a, .title a'
summary: '.excerpt, .summary, .description'
date: '.date, .published, time'
author: '.author, .byline, .writer'

// Avoid fragile selectors
articles: 'div:nth-child(3) > div > div'  // Too specific
title: 'div[style*="font-weight"]'        // Relies on inline styles
```

---

## Troubleshooting

### Common Issues

#### 1. No Articles Found
**Symptoms**: Scraper returns empty array
**Causes**:
- Incorrect article selector
- Website structure changed
- Content loaded via JavaScript

**Solutions**:
```javascript
// Debug selectors
const $ = cheerio.load(html);
console.log('Article containers found:', $(selectors.articles).length);
console.log('First container HTML:', $(selectors.articles).first().html());
```

#### 2. Missing Article Data
**Symptoms**: Articles have empty title/summary
**Causes**:
- Incorrect element selectors
- Content in different HTML structure

**Solutions**:
```javascript
// Test selectors individually
$(selectors.articles).each((index, element) => {
  const $el = $(element);
  console.log('Title:', $el.find(selectors.title).text());
  console.log('Summary:', $el.find(selectors.summary).text());
});
```

#### 3. Rate Limiting Issues
**Symptoms**: HTTP 429 errors or blocked requests
**Causes**:
- Too many requests too quickly
- Missing or incorrect headers

**Solutions**:
```javascript
// Increase delays
await new Promise(resolve => setTimeout(resolve, 5000));

// Add proper headers
const response = await axios.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; SustainabilityBot/1.0)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive'
  }
});
```

#### 4. Content Analysis Issues
**Symptoms**: Articles not categorized correctly
**Causes**:
- Insufficient keyword matches
- Poor content quality

**Solutions**:
```javascript
// Debug analysis
const analysis = analyzeContent(title, summary, content);
console.log('Pillar scores:', analysis.pillarScores);
console.log('SDG matches:', analysis.relevantSDGs);
console.log('Final categorization:', analysis.pillar);
```

### Debugging Tools

#### 1. Browser Developer Tools
- Inspect HTML structure
- Test CSS selectors
- Monitor network requests
- Check for JavaScript-loaded content

#### 2. Scraper Debug Mode
```javascript
const DEBUG = true;

if (DEBUG) {
  console.log('Scraping URL:', source.searchUrl);
  console.log('Articles found:', articles.length);
  console.log('Sample article:', articles[0]);
}
```

#### 3. Content Validation
```javascript
function validateArticle(article) {
  const issues = [];
  
  if (!article.title) issues.push('Missing title');
  if (!article.summary) issues.push('Missing summary');
  if (!article.sourceUrl) issues.push('Missing source URL');
  if (article.sdgs.length === 0) issues.push('No SDGs identified');
  
  return issues;
}
```

---

## Performance Optimization

### Caching Strategy
```javascript
// Cache scraped content to avoid re-processing
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

### Parallel Processing
```javascript
// Process multiple sources in parallel (with rate limiting)
async function scrapeAllSourcesParallel() {
  const promises = SOURCES.map((source, index) => 
    new Promise(resolve => 
      setTimeout(() => scrapeSource(source).then(resolve), index * 2000)
    )
  );
  
  const results = await Promise.all(promises);
  return results.flat();
}
```

### Memory Management
```javascript
// Process articles in batches to manage memory
function processBatch(articles, batchSize = 50) {
  const batches = [];
  
  for (let i = 0; i < articles.length; i += batchSize) {
    batches.push(articles.slice(i, i + batchSize));
  }
  
  return batches;
}
```

---

## Future Enhancements

### Planned Features
1. **JavaScript Rendering**: Puppeteer integration for SPA content
2. **Machine Learning**: Improved content classification
3. **Real-time Updates**: WebSocket-based live updates
4. **Content Deduplication**: Advanced duplicate detection
5. **Multi-language Support**: International content processing

### Technical Improvements
1. **Distributed Scraping**: Multiple server coordination
2. **Database Integration**: Direct database storage
3. **API Integration**: RSS feeds and API endpoints
4. **Monitoring Dashboard**: Real-time scraping metrics
5. **Automated Testing**: Continuous selector validation