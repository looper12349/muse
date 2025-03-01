// components/thread/ThreadHeader.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Hash, MoreVertical, Settings, Trash, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../common/Badge';
import { DIFFICULTY_COLORS, LLM_PROVIDER_NAMES } from '../../utils/constants';

const ThreadHeader = ({ 
  thread, 
  onChangeProvider, 
  availableLlmProviders, 
  onDeleteThread, 
  onRenameThread 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  
  const handleProviderChange = (provider) => {
    onChangeProvider(provider);
    setIsProviderMenuOpen(false);
  };
  
  return (
    <div className="px-4 py-3 border-b border-gray-800 bg-gray-900/70 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link 
            to="/" 
            className="mr-3 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div>
            <h2 className="text-lg font-medium flex items-center">
              <Hash className="h-5 w-5 mr-1.5 text-blue-500" />
              {thread.title}
            </h2>
            
            <div className="flex items-center mt-1 text-sm text-gray-400">
              <span>Problem:</span>
              <Link 
                to={thread.problem?.leetcodeUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-blue-400 hover:text-blue-300 truncate max-w-md"
              >
                {thread.problem?.title || 'Unknown Problem'}
              </Link>
              
              {thread.problem?.difficulty && (
                <Badge
                  variant="default"
                  size="sm"
                  className={`ml-2 ${DIFFICULTY_COLORS[thread.problem.difficulty]}`}
                >
                  {thread.problem.difficulty}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsProviderMenuOpen(!isProviderMenuOpen);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Change Model ({LLM_PROVIDER_NAMES[thread.llmProvider]})
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onRenameThread();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Rename Thread
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDeleteThread();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Thread
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {isProviderMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
              >
                <div className="py-1">
                  {availableLlmProviders.map(provider => (
                    <button
                      key={provider}
                      onClick={() => handleProviderChange(provider)}
                      className={`flex items-center w-full px-4 py-2 text-sm ${
                        thread.llmProvider === provider ? 'bg-blue-600 text-white' : 'text-gray-200 hover:bg-gray-700'
                      }`}
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d={LLM_PROVIDER_ICONS[provider]} />
                      </svg>
                      {LLM_PROVIDER_NAMES[provider]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ThreadHeader;