import React from 'react';
import { Calendar, MapPin, BarChart3, SlidersHorizontal, X, Target } from 'lucide-react';
import { FilterState, DateRange } from '../types';
import { format } from 'date-fns';
import { SDGS } from '../data/sdgs';

interface AdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  isVisible: boolean;
  onClose: () => void;
}

const regions = [
  'Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 
  'Middle East', 'Africa', 'Nordic Countries', 'BRICS'
];

const impactLevels = [
  { value: 'all', label: 'All Impact Levels' },
  { value: 'high', label: 'High Impact' },
  { value: 'medium', label: 'Medium Impact' },
  { value: 'low', label: 'Low Impact' }
];

const sortOptions = [
  { value: 'date', label: 'Most Recent' },
  { value: 'impact', label: 'Highest Impact' },
  { value: 'popularity', label: 'Most Popular' }
];

export function AdvancedFilters({ filters, onFiltersChange, isVisible, onClose }: AdvancedFiltersProps) {
  if (!isVisible) return null;

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const newDateRange: DateRange = {
      ...filters.dateRange,
      [field]: value ? new Date(value) : null
    };
    onFiltersChange({ dateRange: newDateRange });
  };

  const formatDateForInput = (date: Date | null) => {
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  const toggleSDG = (sdgId: number) => {
    const newSDGs = filters.sdgs.includes(sdgId)
      ? filters.sdgs.filter(id => id !== sdgId)
      : [...filters.sdgs, sdgId];
    onFiltersChange({ sdgs: newSDGs });
  };

  const clearAllSDGs = () => {
    onFiltersChange({ sdgs: [] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SlidersHorizontal className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* SDG Filter Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Target className="w-4 h-4" />
                <span>UN Sustainable Development Goals</span>
              </label>
              {filters.sdgs.length > 0 && (
                <button
                  onClick={clearAllSDGs}
                  className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1"
                >
                  <X className="w-3 h-3" />
                  <span>Clear all SDGs</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {SDGS.map((sdg) => {
                const isSelected = filters.sdgs.includes(sdg.id);
                
                return (
                  <button
                    key={sdg.id}
                    onClick={() => toggleSDG(sdg.id)}
                    className={`p-2 rounded-lg border-2 transition-all duration-200 text-xs font-medium text-center ${
                      isSelected
                        ? 'border-current text-white shadow-md transform scale-105'
                        : 'border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500 hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: isSelected ? sdg.color : 'transparent',
                      borderColor: isSelected ? sdg.color : undefined,
                    }}
                    title={sdg.description}
                  >
                    <div className="font-bold">{sdg.id}</div>
                    <div className="leading-tight mt-1" style={{ fontSize: '10px' }}>
                      {sdg.title.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Calendar className="w-4 h-4" />
              <span>Date Range</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={formatDateForInput(filters.dateRange.start)}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={formatDateForInput(filters.dateRange.end)}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <MapPin className="w-4 h-4" />
              <span>Region</span>
            </label>
            <select
              value={filters.region}
              onChange={(e) => onFiltersChange({ region: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Impact Level */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <BarChart3 className="w-4 h-4" />
              <span>Impact Level</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {impactLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => onFiltersChange({ impactLevel: level.value as any })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.impactLevel === level.value
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-2 border-blue-300 dark:border-blue-700'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 border-2 border-transparent'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Sort By
            </label>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.value}
                    checked={filters.sortBy === option.value}
                    onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              onClick={() => {
                onFiltersChange({
                  sdgs: [],
                  dateRange: { start: null, end: null },
                  region: 'Global',
                  impactLevel: 'all',
                  sortBy: 'date'
                });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}