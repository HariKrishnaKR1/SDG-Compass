import React from 'react';
import { NewsCard } from './NewsCard';
import { NewsArticle } from '../types';
import { RefreshCw, Globe } from 'lucide-react';

interface NewsGridProps {
  articles: NewsArticle[];
  loading?: boolean;
  onBookmarkToggle: (articleId: string) => void;
  onShare: (article: NewsArticle) => void;
  onArticleClick?: (article: NewsArticle) => void;
}

export function NewsGrid({ articles, loading = false, onBookmarkToggle, onShare, onArticleClick }: NewsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-slate-700 rounded-xl h-48 mb-4"></div>
            <div className="space-y-3">
              <div className="bg-gray-200 dark:bg-slate-700 h-4 rounded"></div>
              <div className="bg-gray-200 dark:bg-slate-700 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 dark:bg-slate-700 h-20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full mx-auto mb-6">
          <Globe className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Articles Available
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          No sustainability news articles have been scraped yet. Click the refresh button in the header to fetch the latest articles from news sources.
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <RefreshCw className="w-4 h-4" />
          <span>Use the refresh button to load fresh content</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard 
          key={article.id} 
          article={article} 
          onBookmarkToggle={onBookmarkToggle}
          onShare={onShare}
          onArticleClick={onArticleClick}
        />
      ))}
    </div>
  );
}