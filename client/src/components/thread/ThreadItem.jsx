// components/thread/ThreadItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatDate';
import { Code, MessageSquare } from 'lucide-react';

const ThreadItem = ({ thread, isActive = false, onClick }) => {
  return (
    <Link
      to={`/thread/${thread._id}`}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-gray-800 text-white' 
          : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
      }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
          <Code className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium truncate">{thread.title}</h3>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-400">
          <MessageSquare className="h-3 w-3 mr-1" />
          <span>{formatRelativeTime(thread.lastMessageAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default ThreadItem;