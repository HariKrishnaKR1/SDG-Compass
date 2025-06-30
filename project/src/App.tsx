import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PillarTabs } from './components/PillarTabs';
import { NewsGrid } from './components/NewsGrid';
import { ImpactDashboard } from './components/ImpactDashboard';
import { BookmarkManager } from './components/BookmarkManager';
import { AdvancedFilters } from './components/AdvancedFilters';
import { ArticleModal } from './components/ArticleModal';
import { InfoModal } from './components/InfoModal';
import { SustainabilityGuide } from './components/SustainabilityGuide';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useNewsFilter } from './hooks/useNewsFilter';
import { useUserPreferences } from './hooks/useUserPreferences';
import { useBackgroundScraper } from './hooks/useBackgroundScraper';
import { useSDGProgress } from './hooks/useSDGProgress';
import { NewsArticle } from './types';

function App() {
  const { preferences, updatePreferences, toggleBookmark } = useUserPreferences();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  
  // Background scraper hook - only use scraped articles
  const { isLoading, articles: scrapedArticles, startScraping, refreshArticles } = useBackgroundScraper();

  // Only use scraped articles, no mock data
  const allNews = scrapedArticles;

  // Calculate SDG progress from real data
  const sdgProgress = useSDGProgress(allNews);

  const {
    filters,
    filteredArticles,
    updateFilters,
    updatePillar,
    updateSearchQuery,
    toggleSDG,
    clearSDGs
  } = useNewsFilter(allNews);

  const [showDashboard, setShowDashboard] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Start scraping on app load
  useEffect(() => {
    startScraping();
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Apply bookmark status to articles
  const articlesWithBookmarks = filteredArticles.map(article => ({
    ...article,
    isBookmarked: preferences.bookmarkedArticles.includes(article.id)
  }));

  const bookmarkedArticles = allNews.filter(article => 
    preferences.bookmarkedArticles.includes(article.id)
  );

  const handleBookmarkToggle = (articleId: string) => {
    toggleBookmark(articleId);
  };

  const handleShare = async (article: NewsArticle) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: article.sourceUrl
        });
      } else {
        // Fallback to clipboard
        const shareText = `${article.title}\n\n${article.summary}\n\nRead more: ${article.sourceUrl}`;
        await navigator.clipboard.writeText(shareText);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.textContent = 'Article link copied to clipboard!';
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Error sharing article:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.textContent = 'Unable to share article. Please try again.';
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    updatePreferences({ theme: newTheme });
  };

  const handleArticleClick = (article: NewsArticle) => {
    setSelectedArticle(article);
    setShowArticleModal(true);
  };

  const handleRefreshData = async () => {
    await refreshArticles();
  };

  const getResultsText = () => {
    const total = filteredArticles.length;
    const pillarText = filters.pillar === 'all' ? 'all pillars' : `${filters.pillar} pillar`;
    return `${total} article${total !== 1 ? 's' : ''} found in ${pillarText}`;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.sdgs.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.impactLevel !== 'all') count++;
    if (filters.region !== 'Global') count++;
    return count;
  };

  // Show loading spinner if scraping is in progress and no articles yet
  if (isLoading && allNews.length === 0) {
    return (
      <LoadingSpinner 
        message="Navigating to Latest Sustainability News" 
        theme={preferences.theme}
      />
    );
  }

  return (
    <div className={`min-h-screen ${preferences.theme === 'dark' ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
      <Header 
        searchQuery={filters.searchQuery}
        onSearchChange={updateSearchQuery}
        onShowBookmarks={() => setShowBookmarks(true)}
        onShowDashboard={() => setShowDashboard(true)}
        onShowAdvancedFilters={() => setShowAdvancedFilters(true)}
        onShowInfo={() => setShowInfoModal(true)}
        onShowGuide={() => setShowGuideModal(true)}
        onRefreshData={handleRefreshData}
        isRefreshing={isLoading}
        bookmarkCount={preferences.bookmarkedArticles.length}
        theme={preferences.theme}
        onThemeToggle={handleThemeToggle}
      />
      
      <PillarTabs 
        activePillar={filters.pillar}
        onPillarChange={updatePillar}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Navigate Sustainability News
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{getResultsText()}</p>
            {allNews.length === 0 && !isLoading && (
              <p className="text-orange-600 dark:text-orange-400 mt-2 text-sm">
                No articles available. Click refresh to discover fresh content from news sources.
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {getActiveFiltersCount() > 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                </span>
              </div>
            )}
            
            {(filters.searchQuery || filters.sdgs.length > 0) && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filters.searchQuery && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded mr-2">
                    Search: "{filters.searchQuery}"
                  </span>
                )}
                {filters.sdgs.length > 0 && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    {filters.sdgs.length} SDG{filters.sdgs.length !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <NewsGrid 
          articles={articlesWithBookmarks} 
          onBookmarkToggle={handleBookmarkToggle}
          onShare={handleShare}
          onArticleClick={handleArticleClick}
        />
      </main>
      
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/CompassSDGICON.png" 
                alt="SDG Compass" 
                className="w-8 h-8 mr-3"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                SDG Compass
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Navigate sustainability news with AI-powered insights. Our platform aggregates real-time content from trusted sources worldwide, 
              providing ESG scoring, UN SDG mapping, and impact assessment to guide you toward a more sustainable future.
            </p>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              © 2024 SDG Compass. Navigating toward the UN Sustainable Development Goals.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ImpactDashboard
        sdgProgress={sdgProgress}
        articles={allNews}
        isVisible={showDashboard}
        onClose={() => setShowDashboard(false)}
      />

      <BookmarkManager
        bookmarkedArticles={bookmarkedArticles}
        isVisible={showBookmarks}
        onClose={() => setShowBookmarks(false)}
        onRemoveBookmark={handleBookmarkToggle}
      />

      <AdvancedFilters
        filters={filters}
        onFiltersChange={updateFilters}
        isVisible={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
      />

      <ArticleModal
        article={selectedArticle}
        isVisible={showArticleModal}
        onClose={() => setShowArticleModal(false)}
        theme={preferences.theme}
      />

      <InfoModal
        isVisible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        theme={preferences.theme}
      />

      <SustainabilityGuide
        isVisible={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        theme={preferences.theme}
      />
    </div>
  );
}

export default App;