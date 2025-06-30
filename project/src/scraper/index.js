import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Scraping sources configuration
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
  },
  {
    name: 'UNEP News',
    baseUrl: 'https://www.unep.org',
    searchUrl: 'https://www.unep.org/news-and-stories',
    selectors: {
      articles: '.card',
      title: '.card-title a',
      link: '.card-title a',
      summary: '.card-text',
      date: '.card-date'
    }
  },
  {
    name: 'WEF Sustainability',
    baseUrl: 'https://www.weforum.org',
    searchUrl: 'https://www.weforum.org/agenda/archive/sustainability/',
    selectors: {
      articles: '.article-card',
      title: '.article-card__title a',
      link: '.article-card__title a',
      summary: '.article-card__excerpt',
      date: '.article-card__date'
    }
  }
];

// Keywords for sustainability classification
const SUSTAINABILITY_KEYWORDS = {
  environmental: [
    'climate', 'carbon', 'renewable', 'solar', 'wind', 'green energy', 'pollution',
    'biodiversity', 'conservation', 'ecosystem', 'deforestation', 'ocean', 'water',
    'emissions', 'sustainability', 'environment', 'nature', 'wildlife', 'forest'
  ],
  social: [
    'equality', 'education', 'health', 'poverty', 'human rights', 'gender',
    'community', 'social', 'inclusion', 'diversity', 'justice', 'welfare',
    'employment', 'labor', 'safety', 'wellbeing', 'development', 'humanitarian'
  ],
  economic: [
    'economy', 'finance', 'investment', 'growth', 'trade', 'business',
    'innovation', 'technology', 'infrastructure', 'industry', 'market',
    'economic', 'financial', 'banking', 'corporate', 'entrepreneurship'
  ]
};

// SDG keywords mapping
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

// AI-powered content analysis
function analyzeContent(title, summary, content) {
  const text = `${title} ${summary} ${content}`.toLowerCase();
  
  // Determine sustainability pillar
  let pillarScores = { environmental: 0, social: 0, economic: 0 };
  
  Object.entries(SUSTAINABILITY_KEYWORDS).forEach(([pillar, keywords]) => {
    keywords.forEach(keyword => {
      const matches = (text.match(new RegExp(keyword, 'g')) || []).length;
      pillarScores[pillar] += matches;
    });
  });
  
  const dominantPillar = Object.entries(pillarScores)
    .reduce((a, b) => pillarScores[a[0]] > pillarScores[b[0]] ? a : b)[0];
  
  // Identify relevant SDGs
  const relevantSDGs = [];
  Object.entries(SDG_KEYWORDS).forEach(([sdgId, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.match(new RegExp(keyword, 'g')) || []).length;
    }, 0);
    
    if (score > 0) {
      relevantSDGs.push(parseInt(sdgId));
    }
  });
  
  // Calculate ESG ratings
  const esgRating = {
    environmental: Math.min(10, Math.max(1, pillarScores.environmental * 2)),
    social: Math.min(10, Math.max(1, pillarScores.social * 2)),
    governance: Math.min(10, Math.max(1, Math.random() * 5 + 3)), // Simplified
    economic: Math.min(10, Math.max(1, pillarScores.economic * 2))
  };
  
  esgRating.overall = (esgRating.environmental + esgRating.social + esgRating.governance + esgRating.economic) / 4;
  
  // Calculate impact score
  const impactScore = Math.min(10, Math.max(1, 
    (relevantSDGs.length * 2) + (Object.values(pillarScores).reduce((a, b) => a + b, 0) / 3)
  ));
  
  return {
    pillar: dominantPillar,
    relevantSDGs,
    esgRating,
    impactScore: Math.round(impactScore)
  };
}

// Scrape articles from a source
async function scrapeSource(source) {
  try {
    console.log(`Scraping ${source.name}...`);
    
    const response = await axios.get(source.searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const articles = [];
    
    $(source.selectors.articles).each((index, element) => {
      if (index >= 20) return false; // Limit to 20 articles per source
      
      const $el = $(element);
      const title = $el.find(source.selectors.title).text().trim();
      const link = $el.find(source.selectors.link).attr('href');
      const summary = $el.find(source.selectors.summary).text().trim();
      const dateText = $el.find(source.selectors.date).text().trim();
      const author = $el.find(source.selectors.author).text().trim() || 'Unknown';
      
      if (!title || !link) return;
      
      const fullUrl = link.startsWith('http') ? link : `${source.baseUrl}${link}`;
      
      // Parse date
      let publishedAt = new Date().toISOString();
      if (dateText) {
        const parsedDate = new Date(dateText);
        if (!isNaN(parsedDate.getTime())) {
          publishedAt = parsedDate.toISOString();
        }
      }
      
      // Analyze content
      const analysis = analyzeContent(title, summary, summary);
      
      // Skip if no relevant SDGs found
      if (analysis.relevantSDGs.length === 0) return;
      
      const article = {
        id: `${source.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
        title,
        summary: summary || title,
        content: summary || title,
        author,
        publishedAt,
        imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
        sourceUrl: fullUrl,
        source: source.name,
        pillar: analysis.pillar,
        sdgs: analysis.relevantSDGs.map(id => ({
          id,
          title: `SDG ${id}`,
          description: '',
          color: '#3B82F6',
          icon: 'Target'
        })),
        tags: [analysis.pillar, 'sustainability', 'news'],
        readTime: Math.ceil(summary.split(' ').length / 200) || 3,
        impactScore: analysis.impactScore,
        esgRating: analysis.esgRating,
        region: 'Global',
        isBookmarked: false,
        viewCount: Math.floor(Math.random() * 10000),
        shareCount: Math.floor(Math.random() * 500),
        scrapedAt: new Date().toISOString()
      };
      
      articles.push(article);
    });
    
    console.log(`Scraped ${articles.length} articles from ${source.name}`);
    return articles;
    
  } catch (error) {
    console.error(`Error scraping ${source.name}:`, error.message);
    return [];
  }
}

// Main scraping function
async function scrapeAllSources() {
  console.log('Starting sustainability news scraping...');
  
  const allArticles = [];
  
  for (const source of SOURCES) {
    const articles = await scrapeSource(source);
    allArticles.push(...articles);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Filter articles from last 3 days
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const recentArticles = allArticles.filter(article => 
    new Date(article.publishedAt) >= threeDaysAgo
  );
  
  // Sort by date and limit to 100 articles
  const finalArticles = recentArticles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 100);
  
  // Save to file
  const outputPath = join(process.cwd(), 'src', 'data', 'scrapedNews.json');
  writeFileSync(outputPath, JSON.stringify(finalArticles, null, 2));
  
  console.log(`Scraping complete! ${finalArticles.length} articles saved to ${outputPath}`);
  
  return finalArticles;
}

// Export for use in the app
export { scrapeAllSources, analyzeContent };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAllSources().catch(console.error);
}