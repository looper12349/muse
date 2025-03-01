// components/problem/ProblemDisplay.jsx
import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import Badge from '../common/Badge';
import { DIFFICULTY_COLORS } from '../../utils/constants';
import Button from '../common/Button';

const ProblemDisplay = ({ problem, isLoading, onRefresh }) => {
  if (!problem) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">Select a problem to view its details</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{problem.title}</h2>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            isLoading={isLoading}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
          
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-white rounded-lg transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open on LeetCode
          </a>
        </div>
      </div>
      
      <div className="flex items-center mb-6">
        <Badge 
          variant="default" 
          size="md"
          className={DIFFICULTY_COLORS[problem.difficulty]}
        >
          {problem.difficulty}
        </Badge>
        
        <span className="ml-3 text-sm text-gray-400">Problem #{problem.problemId}</span>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {problem.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-4">Problem Description</h3>
        <div 
          className="prose prose-invert prose-gray max-w-none prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700"
          dangerouslySetInnerHTML={{ __html: problem.description }}
        />
      </div>
    </div>
  );
};

export default ProblemDisplay;