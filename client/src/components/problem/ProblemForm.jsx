// components/problem/ProblemForm.jsx
import React, { useState } from 'react';
import { Link2 } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const ProblemForm = ({ onSubmit, isLoading }) => {
  const [leetcodeUrl, setLeetcodeUrl] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!leetcodeUrl) {
      setError('LeetCode URL is required');
      return;
    }
    
    // Basic validation
    if (!leetcodeUrl.includes('leetcode.com/problems/')) {
      setError('Please enter a valid LeetCode problem URL');
      return;
    }
    
    setError('');
    onSubmit(leetcodeUrl);
  };
  
  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
      <h3 className="text-lg font-medium text-white mb-4">Add New Problem</h3>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-200">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <Input
            type="url"
            label="LeetCode Problem URL"
            placeholder="https://leetcode.com/problems/two-sum/"
            value={leetcodeUrl}
            onChange={(e) => setLeetcodeUrl(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-gray-400">
            Enter the full URL of a LeetCode problem (e.g., https://leetcode.com/problems/two-sum/)
          </p>
        </div>
        
        <Button
          type="submit"
          isLoading={isLoading}
          fullWidth
          icon={<Link2 className="h-4 w-4" />}
        >
          Add Problem
        </Button>
      </form>
    </div>
  );
};

export default ProblemForm;