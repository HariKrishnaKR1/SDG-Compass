import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Target, Globe, Users, X, BarChart3, Zap, Heart, GraduationCap, Droplets, Building, Scale, Building2, Recycle, Thermometer, Fish, TreePine, Scale3d, Handshake, HandHeart, Wheat, Leaf, DollarSign, Shield, ExternalLink, Star } from 'lucide-react';
import { SDGProgress, NewsArticle } from '../types';

interface ImpactDashboardProps {
  sdgProgress: SDGProgress[];
  articles: NewsArticle[];
  isVisible: boolean;
  onClose: () => void;
}

// E2SG Framework Colors
const E2SG_COLORS = {
  environmental: '#10B981', // Green
  economic: '#8B5CF6',      // Purple
  social: '#3B82F6',        // Blue
  governance: '#F59E0B'     // Orange
};

// E2SG Framework Icons
const E2SG_ICONS = {
  environmental: Leaf,
  economic: DollarSign,
  social: Users,
  governance: Shield
};

export function ImpactDashboard({ sdgProgress, articles, isVisible, onClose }: ImpactDashboardProps) {
  if (!isVisible) return null;

  // Find best performing article for each pillar
  const getBestArticleByPillar = (pillar: string) => {
    const pillarArticles = articles.filter(article => {
      if (pillar === 'governance') {
        // For governance, look for articles with high governance E2SG rating
        return article.e2sgRating.governance >= 7;
      }
      return article.pillar === pillar;
    });

    if (pillarArticles.length === 0) return null;

    // Sort by E2SG rating for the specific pillar, then by impact score
    return pillarArticles.sort((a, b) => {
      const aScore = pillar === 'environmental' ? a.e2sgRating.environmental :
                    pillar === 'economic' ? a.e2sgRating.economic :
                    pillar === 'social' ? a.e2sgRating.social :
                    a.e2sgRating.governance;
      
      const bScore = pillar === 'environmental' ? b.e2sgRating.environmental :
                    pillar === 'economic' ? b.e2sgRating.economic :
                    pillar === 'social' ? b.e2sgRating.social :
                    b.e2sgRating.governance;

      if (bScore !== aScore) return bScore - aScore;
      return b.impactScore - a.impactScore;
    })[0];
  };

  // Calculate E2SG metrics from actual article data
  const calculateE2SGMetrics = () => {
    const environmentalArticles = articles.filter(a => a.pillar === 'environmental');
    const socialArticles = articles.filter(a => a.pillar === 'social');
    const economicArticles = articles.filter(a => a.pillar === 'economic');
    const governanceArticles = articles.filter(a => a.e2sgRating.governance >= 7);

    const avgScore = (articles: NewsArticle[], dimension: keyof NewsArticle['e2sgRating']) => {
      if (articles.length === 0) return 0;
      return articles.reduce((acc, article) => acc + article.e2sgRating[dimension], 0) / articles.length;
    };

    return {
      environmental: {
        score: Number(avgScore(environmentalArticles, 'environmental').toFixed(1)),
        articles: environmentalArticles.length,
        trend: environmentalArticles.length > socialArticles.length ? 'up' as const : 'stable' as const,
        description: 'Climate action, pollution control, resource management',
        bestArticle: getBestArticleByPillar('environmental')
      },
      economic: {
        score: Number(avgScore(economicArticles, 'economic').toFixed(1)),
        articles: economicArticles.length,
        trend: economicArticles.length > 0 ? 'up' as const : 'stable' as const,
        description: 'Sustainable finance, green growth, economic development',
        bestArticle: getBestArticleByPillar('economic')
      },
      social: {
        score: Number(avgScore(socialArticles, 'social').toFixed(1)),
        articles: socialArticles.length,
        trend: socialArticles.length > 0 ? 'up' as const : 'stable' as const,
        description: 'Human rights, community impact, social equity',
        bestArticle: getBestArticleByPillar('social')
      },
      governance: {
        score: Number(avgScore(governanceArticles, 'governance').toFixed(1)),
        articles: governanceArticles.length,
        trend: governanceArticles.length > 0 ? 'stable' as const : 'down' as const,
        description: 'Transparency, accountability, institutional quality',
        bestArticle: getBestArticleByPillar('governance')
      }
    };
  };

  const e2sgMetrics = calculateE2SGMetrics();

  // Prepare chart data for E2SG
  const chartData = Object.entries(e2sgMetrics).map(([dimension, data]) => ({
    name: dimension.charAt(0).toUpperCase() + dimension.slice(1),
    score: data.score,
    articles: data.articles,
    color: E2SG_COLORS[dimension as keyof typeof E2SG_COLORS]
  }));

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const overallStats = {
    averageE2SG: Object.values(e2sgMetrics).reduce((acc, metric) => acc + metric.score, 0) / 4,
    improvingDimensions: Object.values(e2sgMetrics).filter(metric => metric.trend === 'up').length,
    totalArticles: Object.values(e2sgMetrics).reduce((acc, metric) => acc + metric.articles, 0),
    activeDimensions: Object.values(e2sgMetrics).filter(metric => metric.articles > 0).length
  };

  const handleBestArticleClick = (article: NewsArticle) => {
    if (article.sourceUrl) {
      window.open(article.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">E2SG Impact Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Enhanced Environmental, Economic, Social & Governance Framework Analysis</p>
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
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Average E2SG Score</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{overallStats.averageE2SG.toFixed(1)}/10</p>
                </div>
                <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium">Improving Dimensions</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-300">{overallStats.improvingDimensions}/4</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Articles</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">{overallStats.totalArticles.toLocaleString()}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Active Dimensions</p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-300">{overallStats.activeDimensions}/4</p>
                </div>
                <Zap className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* E2SG Performance Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              E2SG Framework Performance
            </h3>
            <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'score' ? `${value}/10` : value,
                      name === 'score' ? 'Score' : 'Articles'
                    ]}
                    labelFormatter={(label) => `${label} Dimension`}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed E2SG Analysis */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detailed E2SG Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(e2sgMetrics).map(([dimension, data]) => {
                const IconComponent = E2SG_ICONS[dimension as keyof typeof E2SG_ICONS];
                const color = E2SG_COLORS[dimension as keyof typeof E2SG_COLORS];
                
                return (
                  <div key={dimension} className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <IconComponent className="w-6 h-6" style={{ color }} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                            {dimension}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {data.description}
                          </p>
                        </div>
                      </div>
                      {getTrendIcon(data.trend)}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Performance Score</span>
                        <span>{data.score}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${data.score * 10}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {data.articles} articles analyzed
                      </span>
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          data.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          data.trend === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {data.trend === 'up' ? 'Improving' : data.trend === 'down' ? 'Declining' : 'Stable'}
                      </span>
                    </div>

                    {/* Best Article Button */}
                    {data.bestArticle ? (
                      <button
                        onClick={() => handleBestArticleClick(data.bestArticle!)}
                        className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-dashed transition-all duration-200 hover:shadow-md"
                        style={{ 
                          borderColor: color,
                          backgroundColor: `${color}10`
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4" style={{ color }} />
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Best Performing Article
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                              {data.bestArticle.title}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </button>
                    ) : (
                      <div className="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-600">
                        <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">No articles available</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* E2SG Framework Info */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              About the E2SG Framework
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-400">
              <div>
                <p className="mb-2">
                  <strong>Enhanced ESG Framework:</strong> E2SG expands traditional ESG by separating Economic as a distinct pillar alongside Environmental, Social, and Governance dimensions.
                </p>
                <p>
                  This provides more granular analysis of sustainability impact across all four critical dimensions of sustainable development.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong>Methodology:</strong> Scores are calculated using AI-powered content analysis of sustainability news articles, measuring keyword density, impact assessment, and trend analysis.
                </p>
                <p>
                  Each dimension is scored 1-10 based on article content relevance, frequency, and measured impact on sustainability goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}