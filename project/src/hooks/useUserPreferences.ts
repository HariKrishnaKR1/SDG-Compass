import { useState, useEffect } from 'react';
import { UserPreferences } from '../types';

const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'en',
  bookmarkedArticles: [],
  followedSDGs: [],
  notificationSettings: {
    email: false,
    push: false,
    frequency: 'weekly'
  }
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('sustainability-news-preferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('sustainability-news-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const toggleBookmark = (articleId: string) => {
    setPreferences(prev => ({
      ...prev,
      bookmarkedArticles: prev.bookmarkedArticles.includes(articleId)
        ? prev.bookmarkedArticles.filter(id => id !== articleId)
        : [...prev.bookmarkedArticles, articleId]
    }));
  };

  const toggleSDGFollow = (sdgId: number) => {
    setPreferences(prev => ({
      ...prev,
      followedSDGs: prev.followedSDGs.includes(sdgId)
        ? prev.followedSDGs.filter(id => id !== sdgId)
        : [...prev.followedSDGs, sdgId]
    }));
  };

  return {
    preferences,
    updatePreferences,
    toggleBookmark,
    toggleSDGFollow
  };
}