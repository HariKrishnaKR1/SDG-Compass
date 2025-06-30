import { useMemo } from 'react';
import { NewsArticle, SDGProgress } from '../types';
import { SDGS } from '../data/sdgs';

export function useSDGProgress(articles: NewsArticle[]): SDGProgress[] {
  return useMemo(() => {
    // Calculate progress for each SDG based on article data
    const sdgData = SDGS.map(sdg => {
      // Find articles related to this SDG
      const relatedArticles = articles.filter(article => 
        article.sdgs.some(articleSDG => articleSDG.id === sdg.id)
      );

      // Calculate average impact score for this SDG
      const avgImpactScore = relatedArticles.length > 0 
        ? relatedArticles.reduce((sum, article) => sum + article.impactScore, 0) / relatedArticles.length
        : 0;

      // Calculate average E2SG environmental score for environmental SDGs
      const avgEnvironmentalScore = relatedArticles.length > 0
        ? relatedArticles.reduce((sum, article) => sum + article.e2sgRating.environmental, 0) / relatedArticles.length
        : 0;

      // Calculate progress based on impact scores and article count
      // Higher impact scores and more articles indicate better progress
      let progress = 0;
      if (relatedArticles.length > 0) {
        // Base progress on average impact score (scaled to 0-100)
        const impactProgress = (avgImpactScore / 10) * 100;
        
        // Bonus for having more articles (indicates more activity/attention)
        const articleBonus = Math.min(relatedArticles.length * 2, 20); // Max 20% bonus
        
        // Environmental SDGs get additional weight from environmental scores
        const environmentalSDGs = [6, 7, 12, 13, 14, 15];
        const environmentalBonus = environmentalSDGs.includes(sdg.id) 
          ? (avgEnvironmentalScore / 10) * 10 // Max 10% bonus
          : 0;

        progress = Math.min(100, Math.max(0, impactProgress + articleBonus + environmentalBonus));
      }

      // Determine trend based on recent article activity and scores
      let trend: 'up' | 'down' | 'stable' = 'stable';
      
      if (relatedArticles.length > 0) {
        // Sort articles by date (most recent first)
        const sortedArticles = relatedArticles.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );

        // Compare recent vs older articles
        const recentArticles = sortedArticles.slice(0, Math.ceil(sortedArticles.length / 2));
        const olderArticles = sortedArticles.slice(Math.ceil(sortedArticles.length / 2));

        if (recentArticles.length > 0 && olderArticles.length > 0) {
          const recentAvgImpact = recentArticles.reduce((sum, a) => sum + a.impactScore, 0) / recentArticles.length;
          const olderAvgImpact = olderArticles.reduce((sum, a) => sum + a.impactScore, 0) / olderArticles.length;

          if (recentAvgImpact > olderAvgImpact + 0.5) {
            trend = 'up';
          } else if (recentAvgImpact < olderAvgImpact - 0.5) {
            trend = 'down';
          }
        } else if (relatedArticles.length >= 3) {
          // If we have recent activity, trend up
          trend = 'up';
        }
      }

      return {
        id: sdg.id,
        progress: Math.round(progress),
        trend,
        lastUpdated: new Date().toISOString().split('T')[0],
        articles: relatedArticles.length
      };
    });

    return sdgData;
  }, [articles]);
}