// components/problem/ProblemList.jsx
import React from 'react';
import ProblemCard from './ProblemCard';
import { motion } from 'framer-motion';

const ProblemList = ({ problems, isLoading, onSelectProblem }) => {
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading problems...</p>
        </div>
      </div>
    );
  }
  
  if (problems.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-2">No problems found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters or add a new problem</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {problems.map((problem, index) => (
        <motion.div
          key={problem._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProblemCard problem={problem} onSelectProblem={onSelectProblem} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProblemList;