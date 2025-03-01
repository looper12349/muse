// components/thread/ThreadList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThreadItem from './ThreadItem';
import { PlusCircle } from 'lucide-react';

const ThreadList = ({ threads, isLoading }) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-8 h-8 border-2 border-t-blue-500 border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (threads.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/20 mb-4">
          <MessageSquare className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No threads yet</h3>
        <p className="text-gray-400 mb-6">Start a new thread to chat with the DSA Assistant</p>
        <button
          onClick={() => navigate('/problems')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Thread
        </button>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {threads.map(thread => (
        <ThreadItem key={thread._id} thread={thread} />
      ))}
    </div>
  );
};

import { MessageSquare } from 'lucide-react';

export default ThreadList;