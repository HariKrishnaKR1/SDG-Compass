import React, { useState } from 'react';
import { Search, Bookmark, BarChart3, SlidersHorizontal, Moon, Sun, Bell, Info, BookOpen, RefreshCw } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShowBookmarks: () => void;
  onShowDashboard: () => void;
  onShowAdvancedFilters: () => void;
  onShowInfo?: () => void;
  onShowGuide?: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  bookmarkCount: number;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

export function Header({ 
  searchQuery, 
  onSearchChange, 
  onShowBookmarks, 
  onShowDashboard, 
  onShowAdvancedFilters,
  onShowInfo,
  onShowGuide,
  onRefreshData,
  isRefreshing = false,
  bookmarkCount,
  theme,
  onThemeToggle
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden relative">
              <img 
                src="/CompassSDGICON.png" 
                alt="SDG Compass" 
                className={`w-full h-full object-contain transition-transform duration-1000 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
              {isRefreshing && (
                <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg animate-pulse"></div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                SDG Compass
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isRefreshing ? 'Refreshing News...' : 'Navigate Sustainability News'}
              </p>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search sustainability news..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isRefreshing}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isRefreshing
                    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 cursor-not-allowed'
                    : 'text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
                title={isRefreshing ? 'Refreshing articles...' : 'Refresh Articles'}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            
            {onShowGuide && (
              <button
                onClick={onShowGuide}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Sustainability Guide"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            )}
            
            {onShowInfo && (
              <button
                onClick={onShowInfo}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="About & How It Works"
              >
                <Info className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={onShowAdvancedFilters}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Advanced Filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            
            <button
              onClick={onShowDashboard}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Impact Dashboard"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            
            <button
              onClick={onShowBookmarks}
              className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="My Bookmarks"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bookmarkCount > 9 ? '9+' : bookmarkCount}
                </span>
              )}
            </button>
            
            <button
              onClick={onThemeToggle}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isRefreshing ? (
                <span className="text-green-600 dark:text-green-400 font-medium">Updating...</span>
              ) : (
                'Updated daily'
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}