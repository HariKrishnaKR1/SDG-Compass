import React from 'react';
import { X, Target, BarChart3, Globe, Zap, Users, TrendingUp, Award, Shield, Lightbulb } from 'lucide-react';

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function InfoModal({ isVisible, onClose, theme }: InfoModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
                <img 
                  src="/CompassSDGICON.png" 
                  alt="SDG Compass" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About SDG Compass</h2>
                <p className="text-gray-600 dark:text-gray-400">Navigate sustainability news with AI-powered insights</p>
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

        <div className="p-6 space-y-8">
          {/* Platform Overview */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-600" />
              Platform Overview
            </h3>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                SDG Compass is your navigation tool for sustainability news. We aggregate real-time articles from trusted global sources, 
                analyzing each through AI-powered algorithms to provide E2SG scoring, SDG mapping, and impact assessment. 
                Navigate toward a more sustainable future with comprehensive insights and data-driven analysis.
              </p>
            </div>
          </section>

          {/* How Scraping Works */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Real-Time News Discovery
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Trusted Sources</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• Guardian Environment</li>
                  <li>• BBC News Environment</li>
                  <li>• Reuters Environment</li>
                  <li>• Associated Press Climate</li>
                  <li>• CNN Climate</li>
                  <li>• Financial Times</li>
                  <li>• Washington Post</li>
                  <li>• New York Times</li>
                </ul>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Smart Process</h4>
                <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
                  <li>• Google Search with site: operators</li>
                  <li>• Multi-keyword sustainability filtering</li>
                  <li>• E2SG synergy scoring (15%+ threshold)</li>
                  <li>• Top 10 articles per source</li>
                  <li>• Real-time content analysis</li>
                </ul>
              </div>
            </div>
          </section>

          {/* E2SG Scoring System */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              E2SG Framework
            </h3>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Enhanced E2SG Framework:</strong> We've evolved beyond traditional ESG to include Economic context as a core dimension, 
                providing a more comprehensive view of sustainability impact.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">E2SG Methodology</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Environmental (E)</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Climate action, pollution, resource use</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Economic (E2)</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sustainable finance, economic impact, growth</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Social (S)</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Human rights, community impact, equality</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Governance (G)</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Transparency, ethics, accountability</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quality Filtering</h4>
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>1. Keyword Analysis:</strong> 100+ sustainability keywords across all pillars
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>2. Minimum Threshold:</strong> 2+ keywords required for inclusion
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>3. E2SG Synergy:</strong> 15%+ relevance score required
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>4. Source Diversity:</strong> Top 10 articles per news source
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SDG Mapping */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              UN SDG Navigation
            </h3>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Each article is automatically mapped to relevant UN Sustainable Development Goals, helping you navigate toward specific sustainability targets:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900 dark:text-white">Comprehensive Coverage:</strong>
                  <p className="text-gray-600 dark:text-gray-400">All 17 SDGs with 8+ keywords each</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">Smart Mapping:</strong>
                  <p className="text-gray-600 dark:text-gray-400">Context-aware analysis with confidence scoring</p>
                </div>
                <div>
                  <strong className="text-gray-900 dark:text-white">Priority Focus:</strong>
                  <p className="text-gray-600 dark:text-gray-400">Top 3 most relevant SDGs per article</p>
                </div>
              </div>
            </div>
          </section>

          {/* Impact Scoring */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-red-600" />
              Impact Assessment
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">8-10</div>
                <div className="font-semibold text-red-900 dark:text-red-300">High Impact</div>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">Global significance</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">6-7</div>
                <div className="font-semibold text-orange-900 dark:text-orange-300">Medium Impact</div>
                <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">Regional importance</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">3-5</div>
                <div className="font-semibold text-yellow-900 dark:text-yellow-300">Emerging Impact</div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">Local or developing</p>
              </div>
            </div>
          </section>

          {/* Technical Features */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
              Navigation Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Quality Assurance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Multi-stage filtering, confidence scoring, source verification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">User Experience</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Personalized bookmarks, advanced filters, responsive design</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">AI Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Natural language processing, sentiment analysis, topic modeling</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Performance</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Google Search integration, real-time processing, optimized delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Transparency */}
          <section>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Transparency</h3>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                SDG Compass aggregates and analyzes but never modifies original content. All articles link directly to their sources.
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Update Frequency:</strong> Daily scraping with real-time processing<br/>
                <strong>Quality Control:</strong> 15%+ E2SG synergy threshold, 2+ keyword minimum<br/>
                <strong>Source Diversity:</strong> Top 10 articles per major news source<br/>
                <strong>Data Retention:</strong> Last 1000 articles maintained for optimal performance
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}