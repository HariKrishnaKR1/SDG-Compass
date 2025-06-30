import { useState, useMemo } from 'react';
import { NewsArticle, FilterState, SustainabilityPillar } from '../types';

export function useNewsFilter(articles: NewsArticle[]) {
  const [filters, setFilters] = useState<FilterState>({
    pillar: 'all',
    sdgs: [],
    searchQuery: '',
    dateRange: { start: null, end: null },
    impactLevel: 'all',
    region: 'Global',
    sortBy: 'date'
  });

  const filteredArticles = useMemo(() => {
    let filtered = articles.filter((article) => {
      // Filter by pillar
      if (filters.pillar !== 'all' && article.pillar !== filters.pillar) {
        return false;
      }

      // Filter by SDGs
      if (filters.sdgs.length > 0) {
        const hasMatchingSDG = article.sdgs.some(sdg => 
          filters.sdgs.includes(sdg.id)
        );
        if (!hasMatchingSDG) {
          return false;
        }
      }

      // Filter by search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesSummary = article.summary.toLowerCase().includes(query);
        const matchesTags = article.tags.some(tag => 
          tag.toLowerCase().includes(query)
        );
        const matchesAuthor = article.author.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesSummary && !matchesTags && !matchesAuthor) {
          return false;
        }
      }

      // Filter by date range
      if (filters.dateRange.start || filters.dateRange.end) {
        const articleDate = new Date(article.publishedAt);
        if (filters.dateRange.start && articleDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && articleDate > filters.dateRange.end) {
          return false;
        }
      }

      // Filter by impact level
      if (filters.impactLevel !== 'all') {
        const impactScore = article.impactScore;
        switch (filters.impactLevel) {
          case 'high':
            if (impactScore < 8) return false;
            break;
          case 'medium':
            if (impactScore < 6 || impactScore >= 8) return false;
            break;
          case 'low':
            if (impactScore >= 6) return false;
            break;
        }
      }

      // Filter by region
      if (filters.region !== 'Global' && article.region !== filters.region) {
        return false;
      }

      return true;
    });

    // Sort articles
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'impact':
          return b.impactScore - a.impactScore;
        case 'popularity':
          return b.viewCount - a.viewCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [articles, filters]);

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const updatePillar = (pillar: SustainabilityPillar | 'all') => {
    setFilters(prev => ({ ...prev, pillar }));
  };

  const updateSDGs = (sdgs: number[]) => {
    setFilters(prev => ({ ...prev, sdgs }));
  };

  const updateSearchQuery = (searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  };

  const toggleSDG = (sdgId: number) => {
    setFilters(prev => ({
      ...prev,
      sdgs: prev.sdgs.includes(sdgId)
        ? prev.sdgs.filter(id => id !== sdgId)
        : [...prev.sdgs, sdgId]
    }));
  };

  const clearSDGs = () => {
    setFilters(prev => ({ ...prev, sdgs: [] }));
  };

  return {
    filters,
    filteredArticles,
    updateFilters,
    updatePillar,
    updateSDGs,
    updateSearchQuery,
    toggleSDG,
    clearSDGs
  };
}