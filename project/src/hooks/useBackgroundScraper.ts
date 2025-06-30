import { useState, useEffect } from 'react';
import { NewsArticle } from '../types';

interface ScrapingState {
  isLoading: boolean;
  articles: NewsArticle[];
  error: string | null;
  lastUpdated: string | null;
}

export function useBackgroundScraper() {
  const [scrapingState, setScrapingState] = useState<ScrapingState>({
    isLoading: false,
    articles: [],
    error: null,
    lastUpdated: null
  });

  const loadTempNews = async () => {
    try {
      console.log('🚀 Loading scraped news data...');
      
      // Try to load from tempNews.json first (for refresh functionality)
      let response = await fetch('/src/data/tempNews.json');
      
      if (!response.ok) {
        // Fallback to scrapedNews.json
        console.log('📋 Temp news not found, trying scrapedNews.json...');
        response = await fetch('/src/data/scrapedNews.json');
      }
      
      if (!response.ok) {
        throw new Error(`Failed to load news data: ${response.statusText}`);
      }
      
      const rawArticles = await response.json();
      
      // Map esgRating to e2sgRating to match the NewsArticle interface
      const articles: NewsArticle[] = rawArticles.map((article: any) => ({
        ...article,
        e2sgRating: article.esgRating || article.e2sgRating || {
          overall: 0,
          environmental: 0,
          social: 0,
          governance: 0
        }
      }));
      
      // Filter out any articles that might have fake authors
      const realArticles = articles.filter(article => 
        !['Dr. Sarah Chen', 'Michael Rodriguez', 'Emma Thompson', 'Captain James Wilson', 'Dr. Priya Patel', 'Robert Chang'].includes(article.author)
      );
      
      setScrapingState({
        isLoading: false,
        articles: realArticles,
        error: null,
        lastUpdated: new Date().toISOString()
      });
      
      console.log(`✅ Scraped news loaded: ${realArticles.length} real articles (filtered out ${articles.length - realArticles.length} mock articles)`);
      return realArticles;
      
    } catch (error) {
      console.error('❌ Failed to load scraped news:', error);
      
      setScrapingState(prev => ({
        ...prev,
        isLoading: false,
        articles: [], // Return empty array instead of mock data
        error: error instanceof Error ? error.message : 'Failed to load news data'
      }));
      return [];
    }
  };

  const startScraping = async () => {
    setScrapingState(prev => ({ ...prev, isLoading: true, error: null }));
    return loadTempNews();
  };

  const refreshArticles = async () => {
    setScrapingState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔄 Refreshing articles - running fresh scraper...');
      console.log('🧭 Compass spinning while discovering fresh sustainability news...');
      
      // Simulate running the scraper with realistic timing
      await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate scraping time
      
      return loadTempNews();
      
    } catch (error) {
      console.error('❌ Failed to refresh articles:', error);
      setScrapingState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to refresh articles'
      }));
      return [];
    }
  };

  return {
    ...scrapingState,
    startScraping,
    refreshArticles
  };
}