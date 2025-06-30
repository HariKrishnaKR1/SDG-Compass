import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  theme?: 'light' | 'dark';
}

export function LoadingSpinner({ message = 'Loading...', theme = 'light' }: LoadingSpinnerProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <div className="relative mb-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-white dark:bg-slate-800 shadow-lg">
            <img 
              src="/CompassSDGICON.png" 
              alt="SDG Compass" 
              className="w-16 h-16 object-contain animate-spin"
              style={{ animationDuration: '2s' }}
            />
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {message}
        </h2>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>🔍 Scanning sustainability news sources...</p>
          <p>📊 Analyzing content for ESG relevance...</p>
          <p>🎯 Mapping articles to UN SDGs...</p>
        </div>
        
        <div className="mt-6 w-64 bg-gray-200 dark:bg-slate-700 rounded-full h-2 mx-auto">
          <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          This may take 30-60 seconds for fresh content
        </p>
      </div>
    </div>
  );
}