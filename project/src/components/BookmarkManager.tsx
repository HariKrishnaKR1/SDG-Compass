import React from 'react';
import { Bookmark, X, Calendar, User, Tag, ExternalLink } from 'lucide-react';
import { NewsArticle } from '../types';
import { format } from 'date-fns';

interface BookmarkManagerProps {
  bookmarkedArticles: NewsArticle[];
  isVisible: boolean;
  onClose: () => void;
  onRemoveBookmark: (articleId: string) => void;
}

export function BookmarkManager({ bookmarkedArticles, isVisible, onClose, onRemoveBookmark }: BookmarkManagerProps) {
  if (!isVisible) return null;

  const groupedBookmarks = bookmarkedArticles.reduce((acc, article) => {
    const pillar = article.pillar;
    if (!acc[pillar]) acc[pillar] = [];
    acc[pillar].push(article);
    return acc;
  }, {} as Record<string, NewsArticle[]>);

  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'environmental': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'social': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'economic': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bookmark className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Bookmarks</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{bookmarkedArticles.length} saved articles</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {bookmarkedArticles.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookmarks yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Start bookmarking articles to build your personal collection</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedBookmarks).map(([pillar, articles]) => (
                <div key={pillar}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                    {pillar} ({articles.length})
                  </h3>
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <div key={article.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPillarColor(article.pillar)}`}>
                                {article.pillar.charAt(0).toUpperCase() + article.pillar.slice(1)}
                              </span>
                              <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                              </div>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                              {article.title}
                            </h4>
                            
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                              {article.summary}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <User className="w-3 h-3" />
                                  <span>{article.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Tag className="w-3 h-3" />
                                  <span>{article.tags.slice(0, 2).join(', ')}</span>
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <a
                                  href={article.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                                >
                                  <span>Read</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <button
                                  onClick={() => onRemoveBookmark(article.id)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}