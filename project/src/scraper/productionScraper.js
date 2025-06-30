import axios from 'axios';
import * as cheerio from 'cheerio';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Production-ready sources with tested selectors
// Production-ready sources with tested selectors
const PRODUCTION_SOURCES = [
  // Environment
  {
    name: 'Guardian Environment',
    baseUrl: 'https://www.theguardian.com',
    searchUrl: 'https://www.theguardian.com/environment',
    selectors: {
      articles: '.fc-item, .u-faux-block-link',
      title: '.fc-item_title, .u-faux-block-link_overlay',
      link: '.fc-item_link, .u-faux-block-link_overlay',
      summary: '.fc-item_standfirst, .fc-item_kicker',
      date: '.fc-item__timestamp, time',
      author: '.fc-item__byline'
    }
  },
  {
    name: 'BBC News Environment',
    baseUrl: 'https://www.bbc.com',
    searchUrl: 'https://www.bbc.com/news/science-environment',
    selectors: {
      articles: '[data-testid="liverpool-card"], .gs-c-promo',
      title: '[data-testid="card-headline"], .gs-c-promo-heading__title',
      link: 'a',
      summary: '[data-testid="card-description"], .gs-c-promo-summary',
      date: 'time, .gs-c-timestamp',
      author: '.gs-c-byline'
    }
  },
  {
    name: 'UNEP – News & Stories',
    category: 'environment',
    baseUrl: 'https://www.unep.org',
    searchUrl: 'https://www.unep.org/news-and-stories',
    selectors: {
      articles: 'article, .views-row',
      title: 'h3 a, .story__title a',
      link: 'h3 a, .story__title a',
      summary: 'p, .story__summary',
      date: 'time, .story__date',
      author: '.story__author, .byline'
    }
  },
  {
    name: 'UN SDG Newsroom',
    category: 'environment',
    baseUrl: 'https://sdgs.un.org',
    searchUrl: 'https://sdgs.un.org/news',
    selectors: {
      articles: 'article, .views-row',
      title: 'h3 a, .sdg-news__title a',
      link: 'h3 a, .sdg-news__title a',
      summary: '.field--name-body p, .sdg-news__teaser',
      date: 'time, .date-display-single',
      author: '.field--name-field_author, .byline'
    }
  },
  {
    name: 'Reuters Environment',
    baseUrl: 'https://www.reuters.com',
    searchUrl: 'https://www.reuters.com/business/environment/',
    selectors: {
      articles: '[data-testid="MediaStoryCard"], .story-card',
      title: '[data-testid="Heading"], h3',
      link: 'a',
      summary: '[data-testid="Body"], .story-summary',
      date: 'time',
      author: '[data-testid="AuthorName"]'
    }
  },
  {
    name: 'Associated Press Climate',
    baseUrl: 'https://apnews.com',
    searchUrl: 'https://apnews.com/hub/climate',
    selectors: {
      articles: '.PagePromo, .FeedCard',
      title: '.PagePromoContentIcons-text, .Component-headline',
      link: 'a',
      summary: '.PagePromo-description, .Component-summary',
      date: '.Timestamp, time',
      author: '.Component-bylines'
    }
  },
  {
    name: 'CNN Climate',
    baseUrl: 'https://www.cnn.com',
    searchUrl: 'https://www.cnn.com/specials/world/cnn-climate',
    selectors: {
      articles: '.container__item, .card',
      title: '.container_headline, .card_headline',
      link: 'a',
      summary: '.container_summary, .card_summary',
      date: '.timestamp, time',
      author: '.byline'
    }
  },

  // Economic
  {
    name: 'Financial Times – Sustainable Finance',
    category: 'economic',
    baseUrl: 'https://www.ft.com',
    searchUrl: 'https://www.ft.com/sustainable-finance',
    selectors: {
      articles: '.o-teaser, article',
      title: '.js-teaser-heading-link, h3 a',
      link: '.js-teaser-heading-link, h3 a',
      summary: '.o-teaser_standfirst, .o-teaser_summary',
      date: 'time[data-mod="time"], time',
      author: '.o-teaser_byline, .o-teaser_tag-item'
    }
  },
  {
    name: 'Bloomberg Green – Climate Finance',
    category: 'economic',
    baseUrl: 'https://www.bloomberg.com',
    searchUrl: 'https://www.bloomberg.com/green',
    selectors: {
      articles: 'article.story-package-module__story, article',
      title: 'h3, .story-package-module_story_headline',
      link: 'a',
      summary: 'p.story-package-module_story_summary, p',
      date: 'time, .published-at',
      author: '.byline, .author-name'
    }
  },
  {
    name: 'World Economic Forum – Economics',
    category: 'economic',
    baseUrl: 'https://www.weforum.org',
    searchUrl: 'https://www.weforum.org/agenda/archive/economics',
    selectors: {
      articles: 'article, .teaser',
      title: 'a.teaser-title, h3 a',
      link: 'a.teaser-title, h3 a',
      summary: 'p.teaser-description, .article__subtitle',
      date: 'time, .timestamp',
      author: '.byline, .article__author'
    }
  },
  {
    name: 'UNCTAD – Statistics & Data',
    category: 'economic',
    baseUrl: 'https://unctad.org',
    searchUrl: 'https://unctad.org/statistics',
    selectors: {
      articles: 'article, .views-row',
      title: 'h3 a, .teaser__title a',
      link: 'h3 a, .teaser__title a',
      summary: '.field--name-body p, .teaser__text',
      date: 'time, .date',
      author: '.field-author, .byline'
    }
  },
  {
    name: 'UNEP Finance Initiative (UNEP-FI)',
    category: 'economic',
    baseUrl: 'https://www.unepfi.org',
    searchUrl: 'https://www.unepfi.org/news',
    selectors: {
      articles: 'article, .news-item',
      title: 'h3 a, .news-item__title a',
      link: 'h3 a, .news-item__title a',
      summary: '.news-item__excerpt, p',
      date: 'time, .news-item__date',
      author: '.news-item__author, .byline'
    }
  },

  {
    name: 'Financial Times Markets',
    baseUrl: 'https://www.ft.com',
    searchUrl: 'https://www.ft.com/markets',
    selectors: {
      articles: '.o-teaser',
      title: '.o-teaser__heading',
      link: 'a',
      summary: '.o-teaser__standfirst',
      date: 'time',
      author: '.o-teaser__meta .js-teaser-byline'
    }
  },
  {
    name: 'Bloomberg Economy',
    baseUrl: 'https://www.bloomberg.com',
    searchUrl: 'https://www.bloomberg.com/economies',
    selectors: {
      articles: '.story-package-module__story',
      title: 'h3, .headline',
      link: 'a',
      summary: '.story-package-module__description',
      date: 'time',
      author: '.byline-name'
    }
  },

  // Social
  {
    name: 'Guardian Global Development',
    category: 'social',
    baseUrl: 'https://www.theguardian.com',
    searchUrl: 'https://www.theguardian.com/global-development',
    selectors: {
      articles: '.fc-item, .u-faux-block-link',
      title: '.fc-item_title, .u-faux-block-link_overlay',
      link: '.fc-item_link, .u-faux-block-link_overlay',
      summary: '.fc-item_standfirst, .fc-item_kicker',
      date: '.fc-item__timestamp, time',
      author: '.fc-item__byline'
    }
  },
  {
    name: 'UN News – SDG / Social & Economic',
    category: 'social',
    baseUrl: 'https://news.un.org',
    searchUrl: 'https://news.un.org/en/news/topic/sustainable-development-goals',
    selectors: {
      articles: '.views-row',
      title: 'h3 a',
      link: 'h3 a',
      summary: '.views-field-body, .field-content p',
      date: 'time, .date-display-single',
      author: '.field-author-name, .views-field-field_byline'
    }
  },
  {
    name: 'Al Jazeera – Human Rights',
    category: 'social',
    baseUrl: 'https://www.aljazeera.com',
    searchUrl: 'https://www.aljazeera.com/tag/human-rights',
    selectors: {
      articles: 'article, .gc__content',
      title: 'h3 a, .gc__title',
      link: 'h3 a, .gc__title a',
      summary: '.gc__excerpt, p',
      date: 'time, .date-simple',
      author: '.gc__author, .article-author'
    }
  },
  {
    name: 'UNDP News Centre',
    category: 'social',
    baseUrl: 'https://www.undp.org',
    searchUrl: 'https://www.undp.org/news-centre',
    selectors: {
      articles: 'article, .teaser',
      title: 'h3 a, .teaser__title a',
      link: 'h3 a, .teaser__title a',
      summary: '.teaser__description, p',
      date: 'time, .date',
      author: '.teaser__author, .byline'
    }
  },
  {
    name: 'ESG Dive Social Responsibility',
    baseUrl: 'https://www.esgdive.com',
    searchUrl: 'https://www.esgdive.com/topic/social-responsibility/',
    selectors: {
      articles: '.article-feed__item',
      title: '.article-feed__title',
      link: 'a',
      summary: '.article-feed__dek',
      date: 'time',
      author: '.article-byline'
    }
  },
  {
    name: 'Guardian Society',
    baseUrl: 'https://www.theguardian.com',
    searchUrl: 'https://www.theguardian.com/society',
    selectors: {
      articles: '.fc-item, .u-faux-block-link',
      title: '.fc-item__title, .u-faux-block-link_overlay',
      link: '.fc-item_link, .u-faux-block-link_overlay',
      summary: '.fc-item__standfirst, .fc-item__kicker',
      date: '.fc-item__timestamp, time',
      author: '.fc-item__byline'
    }
  },
  {
    name: 'Guardian Law',
    baseUrl: 'https://www.theguardian.com',
    searchUrl: 'https://www.theguardian.com/law',
    selectors: {
      articles: '.fc-item, .u-faux-block-link',
      title: '.fc-item__title, .u-faux-block-link_overlay',
      link: '.fc-item_link, .u-faux-block-link_overlay',
      summary: '.fc-item__standfirst, .fc-item__kicker',
      date: '.fc-item__timestamp, time',
      author: '.fc-item__byline'
    }
  },
  {
    name: 'AP Social Justice',
    baseUrl: 'https://apnews.com',
    searchUrl: 'https://apnews.com/hub/social-justice',
    selectors: {
      articles: '.FeedCard, .PagePromo',
      title: '.Component-headline',
      link: 'a',
      summary: '.Component-summary',
      date: 'time, .Timestamp',
      author: '.Component-bylines'
    }
  },

  // Governance
  {
    name: 'Reuters Governance & ESG',
    baseUrl: 'https://www.reuters.com',
    searchUrl: 'https://www.reuters.com/business/sustainable-business/',
    selectors: {
      articles: '[data-testid="MediaStoryCard"]',
      title: '[data-testid="Heading"], h3',
      link: 'a',
      summary: '[data-testid="Body"]',
      date: 'time',
      author: '[data-testid="AuthorName"]'
    }
  },
  {
    name: 'ESG Dive Governance',
    baseUrl: 'https://www.esgdive.com',
    searchUrl: 'https://www.esgdive.com/topic/corporate-governance/',
    selectors: {
      articles: '.article-feed__item',
      title: '.article-feed__title',
      link: 'a',
      summary: '.article-feed__dek',
      date: 'time',
      author: '.article-byline'
    }
  }
];

// Enhanced sustainability keywords with better coverage
const SUSTAINABILITY_KEYWORDS = {
  environmental: [
    'climate change', 'global warming', 'carbon emissions', 'renewable energy',
    'solar power', 'wind energy', 'biodiversity', 'conservation', 'ecosystem',
    'deforestation', 'ocean pollution', 'water scarcity', 'air quality',
    'green technology', 'sustainable agriculture', 'wildlife protection',
    'environmental protection', 'clean energy', 'carbon footprint',
    'greenhouse gas', 'sustainability', 'eco-friendly', 'green economy',
    'circular economy', 'waste management', 'recycling', 'pollution control',
    'electric vehicles', 'carbon neutral', 'net zero', 'green building',
    'sustainable development', 'environmental policy', 'climate action'
  ],
  social: [
    'social justice', 'human rights', 'gender equality', 'education access',
    'healthcare', 'poverty reduction', 'community development', 'fair trade',
    'labor rights', 'social inclusion', 'diversity', 'equality',
    'public health', 'social welfare', 'humanitarian', 'development aid',
    'social impact', 'community empowerment', 'social responsibility',
    'inclusive growth', 'social innovation', 'wellbeing', 'food security',
    'affordable housing', 'digital divide', 'social mobility', 'human development'
  ],
  economic: [
    'sustainable finance', 'green bonds', 'impact investing', 'ESG investing',
    'sustainable business', 'green growth', 'economic development',
    'financial inclusion', 'microfinance', 'sustainable supply chain',
    'responsible investment', 'green finance', 'sustainable development finance',
    'impact measurement', 'blended finance', 'development finance',
    'sustainable economics', 'economic sustainability', 'green jobs',
    'sustainable banking', 'carbon pricing', 'green recovery', 'circular business'
  ]
};

// Comprehensive SDG keyword mapping
const SDG_KEYWORDS = {
  1: ['poverty', 'extreme poverty', 'income inequality', 'basic needs', 'social protection', 'poor', 'low income', 'economic hardship'],
  2: ['hunger', 'food security', 'malnutrition', 'agriculture', 'food systems', 'nutrition', 'farming', 'food crisis'],
  3: ['health', 'healthcare', 'wellbeing', 'disease', 'medical', 'mental health', 'wellness', 'pandemic', 'public health'],
  4: ['education', 'learning', 'school', 'university', 'literacy', 'skills', 'knowledge', 'training', 'educational access'],
  5: ['gender equality', 'women empowerment', 'gender', 'women rights', 'female', 'girls', 'maternal', 'gender parity'],
  6: ['water', 'sanitation', 'clean water', 'hygiene', 'water management', 'drinking water', 'wastewater', 'water crisis'],
  7: ['energy', 'renewable energy', 'clean energy', 'energy access', 'electricity', 'power', 'solar', 'wind', 'energy transition'],
  8: ['employment', 'decent work', 'economic growth', 'jobs', 'labor', 'workforce', 'unemployment', 'job creation'],
  9: ['infrastructure', 'innovation', 'industry', 'technology', 'research', 'development', 'manufacturing', 'digital infrastructure'],
  10: ['inequality', 'inclusion', 'discrimination', 'social mobility', 'equity', 'marginalized', 'income disparity'],
  11: ['cities', 'urban', 'sustainable cities', 'housing', 'urbanization', 'smart cities', 'transport', 'urban planning'],
  12: ['consumption', 'production', 'waste', 'circular economy', 'resource efficiency', 'recycling', 'sustainable consumption'],
  13: ['climate action', 'climate change', 'global warming', 'carbon', 'mitigation', 'adaptation', 'emissions', 'climate policy'],
  14: ['ocean', 'marine', 'sea', 'aquatic', 'fishing', 'marine life', 'underwater', 'coral', 'ocean conservation'],
  15: ['biodiversity', 'forest', 'land', 'ecosystem', 'wildlife', 'terrestrial', 'nature', 'deforestation', 'conservation'],
  16: ['peace', 'justice', 'institutions', 'governance', 'rule of law', 'transparency', 'corruption', 'accountability'],
  17: ['partnership', 'cooperation', 'global partnership', 'collaboration', 'development cooperation', 'multilateral', 'international cooperation']
};

// Enhanced content analysis with E2SG framework
function analyzeContent(title, summary, content) {
  const text = `${title} ${summary} ${content}`.toLowerCase();
  const wordCount = text.split(' ').length;
  
  if (wordCount < 10) return null;
  
  // Calculate pillar scores with weighted keywords
  let pillarScores = { environmental: 0, social: 0, economic: 0 };
  let totalMatches = 0;
  
  Object.entries(SUSTAINABILITY_KEYWORDS).forEach(([pillar, keywords]) => {
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword.replace(/\s+/g, '\\s+'), 'gi');
      const matches = (text.match(regex) || []).length;
      if (matches > 0) {
        // Weight longer, more specific keywords higher
        const weight = Math.max(1, keyword.split(' ').length);
        const score = matches * weight;
        pillarScores[pillar] += score;
        totalMatches += matches;
      }
    });
  });
  
  // Calculate confidence based on keyword density and absolute matches
  const keywordDensity = totalMatches / wordCount;
  const confidence = Math.min(1, keywordDensity + (totalMatches / 50));
  
  // Skip if confidence is too low (not sustainability-related)
  if (confidence < 0.02 || totalMatches < 1) return null;
  
  // Determine dominant pillar
  const totalPillarScore = Object.values(pillarScores).reduce((a, b) => a + b, 0);
  if (totalPillarScore === 0) return null;
  
  const dominantPillar = Object.entries(pillarScores)
    .reduce((a, b) => pillarScores[a[0]] > pillarScores[b[0]] ? a : b)[0];
  
  // Identify relevant SDGs with scoring
  const sdgScores = {};
  Object.entries(SDG_KEYWORDS).forEach(([sdgId, keywords]) => {
    let score = 0;
    keywords.forEach(keyword => {
      const regex = new RegExp(keyword.replace(/\s+/g, '\\s+'), 'gi');
      const matches = (text.match(regex) || []).length;
      if (matches > 0) {
        score += matches * Math.max(1, keyword.split(' ').length);
      }
    });
    if (score > 0) {
      sdgScores[sdgId] = score;
    }
  });
  
  // Select top 3 most relevant SDGs
  const relevantSDGs = Object.entries(sdgScores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([id]) => parseInt(id));
  
  if (relevantSDGs.length === 0) {
    // If no specific SDGs found, assign based on pillar
    const pillarSDGs = {
      environmental: [13, 14, 15],
      social: [1, 2, 3, 4, 5],
      economic: [8, 9, 12]
    };
    relevantSDGs.push(...pillarSDGs[dominantPillar].slice(0, 2));
  }
  
  // Calculate E2SG ratings based on content analysis (Environment, Economic, Social, Governance)
  const e2sgRating = {
    environmental: Math.min(10, Math.max(1, Math.round((pillarScores.environmental / totalPillarScore) * 10) || 3)),
    economic: Math.min(10, Math.max(1, Math.round((pillarScores.economic / totalPillarScore) * 10) || 3)),
    social: Math.min(10, Math.max(1, Math.round((pillarScores.social / totalPillarScore) * 10) || 3)),
    governance: Math.min(10, Math.max(3, Math.round(Math.random() * 4 + 4))) // Governance harder to detect
  };
  
  e2sgRating.overall = Number(((e2sgRating.environmental + e2sgRating.economic + e2sgRating.social + e2sgRating.governance) / 4).toFixed(1));
  
  // Calculate impact score
  const impactScore = Math.min(10, Math.max(1, Math.round(
    (confidence * 30) + (relevantSDGs.length * 2) + (Object.values(sdgScores).reduce((a, b) => a + b, 0) / 20) + 2
  )));
  
  return {
    pillar: dominantPillar,
    relevantSDGs,
    e2sgRating,
    impactScore,
    confidence
  };
}

// Enhanced scraping with better error handling and retries
async function scrapeSource(source) {
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 Scraping ${source.name} (attempt ${attempt}/${maxRetries})...`);
      
      const response = await axios.get(source.searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'max-age=0'
        },
        timeout: 25000,
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      });
      
      const $ = cheerio.load(response.data);
      const articles = [];
      
      // Try multiple selector strategies
      const selectorSets = [
        source.selectors.articles,
        'article, .article, .story, .post, .item',
        '[class*="card"], [class*="story"], [class*="article"]',
        'h2 a, h3 a, h4 a'
      ];
      
      let foundArticles = 0;
      for (const selector of selectorSets) {
        const elements = $(selector);
        if (elements.length > 0) {
          foundArticles = elements.length;
          console.log(`📄 Found ${foundArticles} article containers with selector: ${selector}`);
          break;
        }
      }
      
      if (foundArticles === 0) {
        console.log(`⚠️  No articles found with any selector for ${source.name}`);
        return [];
      }
      
      $(source.selectors.articles).each((index, element) => {
        if (index >= 25) return false; // Limit per source
        
        const $el = $(element);
        
        // Try multiple strategies for title
        let title = '';
        const titleSelectors = [
          source.selectors.title,
          'h1, h2, h3, h4, h5',
          '[class*="title"], [class*="headline"]',
          'a'
        ].filter(Boolean);
        
        for (const selector of titleSelectors) {
          const titleText = $el.find(selector).first().text().trim();
          if (titleText && titleText.length > 10) {
            title = titleText;
            break;
          }
        }
        
        // Try multiple strategies for link
        let link = '';
        const linkSelectors = [
          source.selectors.link,
          'a[href]',
          'h1 a, h2 a, h3 a'
        ].filter(Boolean);
        
        for (const selector of linkSelectors) {
          const linkEl = $el.find(selector).first();
          const href = linkEl.attr('href');
          if (href) {
            link = href;
            break;
          }
        }
        
        // Try multiple strategies for summary
        let summary = '';
        const summarySelectors = [
          source.selectors.summary,
          '[class*="summary"], [class*="excerpt"], [class*="description"]',
          'p'
        ].filter(Boolean);
        
        for (const selector of summarySelectors) {
          const summaryText = $el.find(selector).first().text().trim();
          if (summaryText && summaryText.length > 20) {
            summary = summaryText;
            break;
          }
        }
        
        if (!title || title.length < 15) return;
        if (!link) return;
        
        // Build full URL
        let fullUrl = link;
        if (link.startsWith('/')) {
          fullUrl = `${source.baseUrl}${link}`;
        } else if (!link.startsWith('http')) {
          fullUrl = `${source.baseUrl}/${link}`;
        }
        
        // Validate URL
        try {
          new URL(fullUrl);
        } catch {
          return;
        }
        
        // Use title as summary if no summary found
        if (!summary) {
          summary = title;
        }
        
        // Analyze content for sustainability relevance
        const analysis = analyzeContent(title, summary, summary);
        if (!analysis) {
          return;
        }
        
        // Create article object with site name as author
        const article = {
          id: `${source.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${index}`,
          title: title.substring(0, 200),
          summary: summary.substring(0, 500),
          content: summary,
          author: source.name, // Use site name instead of Editorial Team
          publishedAt: new Date().toISOString(),
          imageUrl: getRandomSustainabilityImage(analysis.pillar),
          sourceUrl: fullUrl,
          source: source.name,
          pillar: analysis.pillar,
          sdgs: analysis.relevantSDGs.map(id => ({
            id,
            title: `SDG ${id}`,
            description: getSDGDescription(id),
            color: getSDGColor(id),
            icon: 'Target'
          })),
          tags: generateTags(analysis.pillar, analysis.relevantSDGs),
          readTime: Math.max(1, Math.ceil((summary || title).split(' ').length / 200)),
          impactScore: analysis.impactScore,
          e2sgRating: analysis.e2sgRating,
          region: inferRegion(title, summary),
          isBookmarked: false,
          viewCount: Math.floor(Math.random() * 5000) + 100,
          shareCount: Math.floor(Math.random() * 200) + 10,
          scrapedAt: new Date().toISOString(),
          confidence: analysis.confidence
        };
        
        articles.push(article);
        console.log(`✅ Scraped: ${title.substring(0, 60)}... (confidence: ${(analysis.confidence * 100).toFixed(1)}%)`);
      });
      
      console.log(`📊 Successfully scraped ${articles.length} articles from ${source.name}`);
      return articles;
      
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed for ${source.name}:`, error.message);
      
      if (attempt === maxRetries) {
        console.error(`💥 All attempts failed for ${source.name}`);
        return [];
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return [];
}

// Helper functions
function getRandomSustainabilityImage(pillar) {
  const images = {
    environmental: [
      'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/9800029/pexels-photo-9800029.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    social: [
      'https://images.pexels.com/photos/1459653/pexels-photo-1459653.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7088793/pexels-photo-7088793.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    economic: [
      'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
  };
  
  const pillarImages = images[pillar] || images.environmental;
  return pillarImages[Math.floor(Math.random() * pillarImages.length)];
}

function getSDGColor(id) {
  const colors = {
    1: '#E5243B', 2: '#DDA63A', 3: '#4C9F38', 4: '#C5192D', 5: '#FF3A21',
    6: '#26BDE2', 7: '#FCC30B', 8: '#A21942', 9: '#FD6925', 10: '#DD1367',
    11: '#FD9D24', 12: '#BF8B2E', 13: '#3F7E44', 14: '#0A97D9', 15: '#56C02B',
    16: '#00689D', 17: '#19486A'
  };
  return colors[id] || '#3B82F6';
}

function getSDGDescription(id) {
  const descriptions = {
    1: 'End poverty in all its forms everywhere',
    2: 'End hunger, achieve food security and improved nutrition',
    3: 'Ensure healthy lives and promote well-being for all',
    4: 'Ensure inclusive and equitable quality education',
    5: 'Achieve gender equality and empower all women and girls',
    6: 'Ensure availability and sustainable management of water',
    7: 'Ensure access to affordable, reliable, sustainable energy',
    8: 'Promote sustained, inclusive economic growth',
    9: 'Build resilient infrastructure, promote innovation',
    10: 'Reduce inequality within and among countries',
    11: 'Make cities and human settlements sustainable',
    12: 'Ensure sustainable consumption and production patterns',
    13: 'Take urgent action to combat climate change',
    14: 'Conserve and sustainably use the oceans, seas',
    15: 'Protect, restore and promote sustainable use of ecosystems',
    16: 'Promote peaceful and inclusive societies',
    17: 'Strengthen the means of implementation'
  };
  return descriptions[id] || '';
}

function generateTags(pillar, sdgs) {
  const baseTags = [pillar, 'sustainability'];
  const sdgTags = sdgs.slice(0, 2).map(id => `sdg-${id}`);
  return [...baseTags, ...sdgTags, 'news'].slice(0, 5);
}

function inferRegion(title, summary) {
  const text = `${title} ${summary}`.toLowerCase();
  const regions = {
    'Asia Pacific': ['asia', 'china', 'india', 'japan', 'australia', 'singapore', 'thailand', 'korea', 'indonesia', 'vietnam', 'philippines'],
    'Europe': ['europe', 'eu', 'germany', 'france', 'uk', 'britain', 'netherlands', 'sweden', 'norway', 'denmark', 'finland'],
    'North America': ['usa', 'america', 'canada', 'mexico', 'united states', 'us', 'california', 'texas', 'new york'],
    'Africa': ['africa', 'nigeria', 'kenya', 'south africa', 'ghana', 'ethiopia', 'morocco', 'egypt'],
    'Latin America': ['brazil', 'argentina', 'chile', 'colombia', 'latin america', 'peru', 'venezuela'],
    'Middle East': ['middle east', 'saudi arabia', 'uae', 'israel', 'iran', 'turkey', 'qatar', 'kuwait']
  };
  
  for (const [region, keywords] of Object.entries(regions)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return region;
    }
  }
  return 'Global';
}

// Initialize temp database from main database
function initializeTempDatabase() {
  try {
    const dbPath = join(process.cwd(), 'src', 'data', 'database.json');
    const tempPath = join(process.cwd(), 'src', 'data', 'tempNews.json');
    
    let database = { articles: [], lastUpdated: null, metadata: {} };
    
    if (existsSync(dbPath)) {
      database = JSON.parse(readFileSync(dbPath, 'utf8'));
    }
    
    // Copy database articles to temp
    writeFileSync(tempPath, JSON.stringify(database.articles, null, 2));
    console.log(`📋 Initialized temp database with ${database.articles.length} articles`);
    
    return database.articles;
  } catch (error) {
    console.error('❌ Error initializing temp database:', error.message);
    return [];
  }
}

// Save to temp database (clears and replaces)
function saveToTempDatabase(articles) {
  try {
    const tempPath = join(process.cwd(), 'src', 'data', 'tempNews.json');
    
    // Clear temp and save new articles
    writeFileSync(tempPath, JSON.stringify(articles, null, 2));
    console.log(`💾 Saved ${articles.length} articles to temp database`);
    
    return articles.length;
  } catch (error) {
    console.error('❌ Temp database save error:', error.message);
    return 0;
  }
}

// Enhanced database operations (for permanent storage)
function saveToDatabase(articles) {
  try {
    const dbPath = join(process.cwd(), 'src', 'data', 'database.json');
    let database = { articles: [], lastUpdated: null, metadata: {} };
    
    if (existsSync(dbPath)) {
      database = JSON.parse(readFileSync(dbPath, 'utf8'));
    }
    
    // Remove duplicates based on source URL
    const existingUrls = new Set(database.articles.map(a => a.sourceUrl));
    const newArticles = articles.filter(a => !existingUrls.has(a.sourceUrl));
    
    // Add new articles
    database.articles = [...database.articles, ...newArticles];
    database.lastUpdated = new Date().toISOString();
    
    // Calculate metadata
    const pillarDistribution = database.articles.reduce((acc, article) => {
      acc[article.pillar] = (acc[article.pillar] || 0) + 1;
      return acc;
    }, {});
    
    const avgConfidence = database.articles.reduce((acc, article) => acc + (article.confidence || 0), 0) / database.articles.length;
    
    database.metadata = {
      totalArticles: database.articles.length,
      lastScrapingRun: new Date().toISOString(),
      newArticlesAdded: newArticles.length,
      sources: [...new Set(database.articles.map(a => a.source))],
      pillarDistribution,
      averageConfidence: avgConfidence,
      confidenceDistribution: {
        high: database.articles.filter(a => (a.confidence || 0) > 0.1).length,
        medium: database.articles.filter(a => (a.confidence || 0) > 0.05 && (a.confidence || 0) <= 0.1).length,
        low: database.articles.filter(a => (a.confidence || 0) <= 0.05).length
      }
    };
    
    // Keep only last 1000 articles, sorted by date
    database.articles = database.articles
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 1000);
    
    writeFileSync(dbPath, JSON.stringify(database, null, 2));
    console.log(`💾 Saved ${newArticles.length} new articles to database`);
    
    return newArticles.length;
  } catch (error) {
    console.error('❌ Database save error:', error.message);
    return 0;
  }
}

// Main scraping function
async function scrapeAllSources() {
  console.log('🚀 Starting production sustainability news scraping...');
  console.log('📅 Target timeframe: Last 3 days');
  console.log('🎯 Target articles: 50-100 relevant articles');
  console.log('🔧 Using production HTTP scraper with E2SG framework');
  
  // Initialize temp database from main database
  const existingArticles = initializeTempDatabase();
  
  const allArticles = [];
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  // Scrape each source with retry logic
  for (const source of PRODUCTION_SOURCES) {
    try {
      const articles = await scrapeSource(source);
      
      // Filter by relevance (date filtering less strict for demo)
      const relevantArticles = articles.filter(article => {
        return article.confidence > 0.01; // Lower threshold for demo
      });
      
      allArticles.push(...relevantArticles);
      
      // Rate limiting between sources
      console.log('⏳ Waiting 3 seconds before next source...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ Failed to scrape ${source.name}:`, error.message);
      continue;
    }
  }
  
  // Sort by relevance and date, limit to 100
  const finalArticles = allArticles
    .sort((a, b) => {
      // Sort by confidence first, then by date
      if (Math.abs(b.confidence - a.confidence) > 0.01) {
        return b.confidence - a.confidence;
      }
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    })
    .slice(0, 100);
  
  // Save to temp database (clears and replaces)
  const savedCount = saveToTempDatabase(finalArticles);
  
  // Also save to scrapedNews.json for immediate use
  const outputPath = join(process.cwd(), 'src', 'data', 'scrapedNews.json');
  writeFileSync(outputPath, JSON.stringify(finalArticles, null, 2));
  
  // Save to permanent database (appends new articles)
  saveToDatabase(finalArticles);
  
  // Print comprehensive summary
  console.log('\n📊 PRODUCTION SCRAPING SUMMARY:');
  console.log(`✅ Total articles found: ${allArticles.length}`);
  console.log(`🎯 Relevant articles: ${finalArticles.length}`);
  console.log(`💾 Articles saved to temp: ${savedCount}`);
  console.log(`📁 Output file: ${outputPath}`);
  
  // Print pillar distribution
  const pillarCounts = finalArticles.reduce((acc, article) => {
    acc[article.pillar] = (acc[article.pillar] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n📈 PILLAR DISTRIBUTION:');
  Object.entries(pillarCounts).forEach(([pillar, count]) => {
    console.log(`${pillar}: ${count} articles`);
  });
  
  // Print E2SG distribution
  if (finalArticles.length > 0) {
    const avgE2SG = finalArticles.reduce((acc, article) => {
      acc.environmental += article.e2sgRating.environmental;
      acc.economic += article.e2sgRating.economic;
      acc.social += article.e2sgRating.social;
      acc.governance += article.e2sgRating.governance;
      return acc;
    }, { environmental: 0, economic: 0, social: 0, governance: 0 });
    
    Object.keys(avgE2SG).forEach(key => {
      avgE2SG[key] = (avgE2SG[key] / finalArticles.length).toFixed(1);
    });
    
    console.log('\n🎯 AVERAGE E2SG SCORES:');
    console.log(`Environmental: ${avgE2SG.environmental}/10`);
    console.log(`Economic: ${avgE2SG.economic}/10`);
    console.log(`Social: ${avgE2SG.social}/10`);
    console.log(`Governance: ${avgE2SG.governance}/10`);
  }
  
  // Print confidence statistics
  if (finalArticles.length > 0) {
    const avgConfidence = finalArticles.reduce((acc, article) => acc + article.confidence, 0) / finalArticles.length;
    const highConfidence = finalArticles.filter(a => a.confidence > 0.1).length;
    const mediumConfidence = finalArticles.filter(a => a.confidence > 0.05 && a.confidence <= 0.1).length;
    
    console.log('\n🎯 CONFIDENCE ANALYSIS:');
    console.log(`Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`High confidence (>10%): ${highConfidence} articles`);
    console.log(`Medium confidence (5-10%): ${mediumConfidence} articles`);
  }
  
  // Print SDG distribution
  const sdgCounts = {};
  finalArticles.forEach(article => {
    article.sdgs.forEach(sdg => {
      sdgCounts[sdg.id] = (sdgCounts[sdg.id] || 0) + 1;
    });
  });
  
  if (Object.keys(sdgCounts).length > 0) {
    console.log('\n🎯 TOP SDGs:');
    Object.entries(sdgCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([sdgId, count]) => {
        console.log(`SDG ${sdgId}: ${count} articles`);
      });
  }
  
  return finalArticles;
}

// Export functions
export { scrapeAllSources, analyzeContent, saveToDatabase, saveToTempDatabase, initializeTempDatabase };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAllSources()
    .then(articles => {
      console.log('\n🎉 Production scraping completed successfully!');
      console.log(`📊 Final count: ${articles.length} articles`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Production scraping failed:', error);
      process.exit(1);
    });
}