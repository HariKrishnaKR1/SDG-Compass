import React from 'react';
import { X, ExternalLink, Clock, User, Tag } from 'lucide-react';
import { NewsArticle } from '../types';
import { format } from 'date-fns';

interface ArticleModalProps {
  article: NewsArticle | null;
  isVisible: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function ArticleModal({ article, isVisible, onClose, theme }: ArticleModalProps) {
  if (!isVisible || !article) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
  };

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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPillarColor(article.pillar)}`}>
                {article.pillar.charAt(0).toUpperCase() + article.pillar.slice(1)}
              </span>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {article.source}
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

        <div className="flex h-[calc(90vh-120px)]">
          {/* Article Info Sidebar */}
          <div className="w-1/3 p-6 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {article.title}
            </h1>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {article.summary}
            </p>

            {/* E2SG Ratings */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">E2SG Framework Rating</h3>
              <div className="space-y-2">
                {[
                  { label: 'Environmental', value: article.e2sgRating.environmental, color: 'bg-green-500', description: 'Climate, pollution, resources' },
                  { label: 'Economic', value: article.e2sgRating.economic, color: 'bg-purple-500', description: 'Financial sustainability, growth' },
                  { label: 'Social', value: article.e2sgRating.social, color: 'bg-blue-500', description: 'Human rights, community impact' },
                  { label: 'Governance', value: article.e2sgRating.governance, color: 'bg-orange-500', description: 'Transparency, accountability' }
                ].map((rating) => (
                  <div key={rating.label} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{rating.label}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{rating.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${rating.color} transition-all duration-300`}
                            style={{ width: `${rating.value * 10}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-6">
                          {rating.value}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Overall E2SG Score</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {article.e2sgRating.overall.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>

            {/* SDGs */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Related UN SDGs</h3>
              <div className="flex flex-wrap gap-2">
                {article.sdgs.map((sdg) => (
                  <span
                    key={sdg.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: sdg.color }}
                    title={sdg.description}
                  >
                    SDG {sdg.id}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Original Article</span>
            </a>
          </div>

          {/* Article Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="prose dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {article.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}