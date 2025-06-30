import React from 'react';
import { Leaf, Users, TrendingUp, Globe } from 'lucide-react';
import { SustainabilityPillar } from '../types';

interface PillarTabsProps {
  activePillar: SustainabilityPillar | 'all';
  onPillarChange: (pillar: SustainabilityPillar | 'all') => void;
}

const pillars = [
  { id: 'all' as const, name: 'All News', icon: Globe, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  { id: 'environmental' as const, name: 'Environmental', icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: 'social' as const, name: 'Social', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 'economic' as const, name: 'Economic', icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

export function PillarTabs({ activePillar, onPillarChange }: PillarTabsProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 py-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const isActive = activePillar === pillar.id;
            
            return (
              <button
                key={pillar.id}
                onClick={() => onPillarChange(pillar.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? `${pillar.bgColor} ${pillar.color} ring-2 ring-opacity-20`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{pillar.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}