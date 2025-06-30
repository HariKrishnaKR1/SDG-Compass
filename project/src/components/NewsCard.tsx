import React from 'react';
import { Clock, User, Tag, Bookmark, Share2, TrendingUp, Star, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  onBookmarkToggle: (articleId: string) => void;
  onShare: (article: NewsArticle) => void;
  onArticleClick?: (article: NewsArticle) => void;
}

export function NewsCard({ article, onBookmarkToggle, onShare, onArticleClick }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'environmental': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'social': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'economic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
    if (score >= 6) return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
  };

  const getImpactLabel = (score: number) => {
    if (score >= 8) return 'High Impact';
    if (score >= 6) return 'Medium Impact';
    if (score >= 4) return 'Low Impact';
    return 'Minimal Impact';
  };

  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPillarColor(article.pillar)}`}>
            {article.pillar.charAt(0).toUpperCase() + article.pillar.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(article.impactScore)}`}>
            {getImpactLabel(article.impactScore)}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkToggle(article.id);
            }}
            className={`p-2 rounded-full transition-colors ${
              article.isBookmarked 
                ? 'bg-blue-600 text-white' 
                : 'bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime} min read</span>
            </div>
          </div>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        
        <h2 
          className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 cursor-pointer"
          onClick={() => onArticleClick?.(article)}
        >
          {article.title}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {article.summary}
        </p>
        
        {/* E2SG Rating */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">E2SG Rating</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">{article.e2sgRating.overall.toFixed(1)}/10</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">E</div>
              <div className="font-semibold text-gray-900 dark:text-white">{article.e2sgRating.environmental}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Ec</div>
              <div className="font-semibold text-gray-900 dark:text-white">{article.e2sgRating.economic}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">S</div>
              <div className="font-semibold text-gray-900 dark:text-white">{article.e2sgRating.social}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">G</div>
              <div className="font-semibold text-gray-900 dark:text-white">{article.e2sgRating.governance}</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {article.sdgs.map((sdg) => (
            <span
              key={sdg.id}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: sdg.color }}
            >
              SDG {sdg.id}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="w-3 h-3 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs text-gray-500 dark:text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <TrendingUp className="w-3 h-3" />
              <span>{article.viewCount}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare(article);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm transition-colors duration-200"
            >
              <span>Read</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}