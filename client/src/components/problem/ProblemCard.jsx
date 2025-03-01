// components/problem/ProblemCard.jsx
import React from 'react';
import { Code, ExternalLink } from 'lucide-react';
import Badge from '../common/Badge';
import { DIFFICULTY_COLORS } from '../../utils/constants';
import { motion } from 'framer-motion';
import { HoverCard } from '../../lib/aceternity-ui/card-hover';
import Button from '../common/Button';

const ProblemCard = ({ problem, onSelectProblem }) => {
  const tagList = problem.tags.slice(0, 3);
  const additionalTags = problem.tags.length > 3 ? problem.tags.length - 3 : 0;
  
  return (
    <HoverCard
      title={problem.title}
      subtitle={`Problem #${problem.problemId}`}
      className="h-full"
    >
      <div className="flex-1">
        <div className="flex items-center mt-2 mb-3">
          <Badge 
            variant="default" 
            className={DIFFICULTY_COLORS[problem.difficulty]}
          >
            {problem.difficulty}
          </Badge>
          
          <a 
            href={problem.leetcodeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ml-auto text-xs text-gray-400 hover:text-blue-400 flex items-center"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            LeetCode
          </a>
        </div>
        
        <div className="text-xs flex flex-wrap gap-1 mb-4">
          {tagList.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-800 rounded-md text-gray-300">
              {tag}
            </span>
          ))}
          {additionalTags > 0 && (
            <span className="px-2 py-1 bg-gray-800 rounded-md text-gray-400">
              +{additionalTags} more
            </span>
          )}
        </div>
      </div>
      
      <Button
        onClick={() => onSelectProblem(problem)}
        variant="primary"
        size="sm"
        fullWidth
        icon={<Code className="h-4 w-4" />}
      >
        Start Thread
      </Button>
    </HoverCard>
  );
};

export default ProblemCard;