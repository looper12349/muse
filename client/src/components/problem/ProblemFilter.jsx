// components/problem/ProblemFilter.jsx
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import Badge from '../common/Badge';

const ProblemFilter = ({ 
  onFilterChange, 
  onSearch, 
  initialFilters = { difficulty: null, tag: null, search: '' } 
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');
  
  const handleDifficultyChange = (difficulty) => {
    const newFilters = {
      ...filters,
      difficulty: filters.difficulty === difficulty ? null : difficulty
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleTagClick = (tag) => {
    const newFilters = {
      ...filters,
      tag: filters.tag === tag ? null : tag
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchInput };
    setFilters(newFilters);
    onSearch(searchInput);
  };
  
  const clearFilters = () => {
    setFilters({ difficulty: null, tag: null, search: '' });
    setSearchInput('');
    onFilterChange({ difficulty: null, tag: null, search: '' });
  };
  
  const difficulties = [
    { name: 'Easy', color: 'bg-green-500' },
    { name: 'Medium', color: 'bg-yellow-500' },
    { name: 'Hard', color: 'bg-red-500' }
  ];
  
  // Common tags in LeetCode
  const commonTags = [
    'Array', 'String', 'Hash Table', 'Dynamic Programming', 
    'Math', 'Sorting', 'Greedy', 'Depth-First Search', 
    'Binary Search', 'Tree', 'Graph'
  ];
  
  const hasActiveFilters = filters.difficulty || filters.tag || filters.search;
  
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h3>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm flex items-center text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>
      
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </form>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Difficulty</h4>
        <div className="flex flex-wrap gap-2">
          {difficulties.map(difficulty => (
            <button
              key={difficulty.name}
              onClick={() => handleDifficultyChange(difficulty.name)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.difficulty === difficulty.name
                  ? `${difficulty.color} text-white`
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {difficulty.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-300 mb-2">Common Tags</h4>
        <div className="flex flex-wrap gap-2">
          {commonTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                filters.tag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProblemFilter;