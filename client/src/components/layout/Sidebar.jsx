// components/layout/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authState } from '../../recoil/atoms/authAtom';
import { threadState } from '../../recoil/atoms/threadAtom';
import { getThreads } from '../../services/threadService';
import { logoutUser } from '../../services/authService';
import ThreadItem from '../thread/ThreadItem';
import { PlusIcon, LogOutIcon, XIcon, HashIcon, BookIcon, CodeIcon } from 'lucide-react';

const Sidebar = ({ closeSidebar }) => {
  const [threads, setThreads] = useRecoilState(threadState);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true);
      try {
        const response = await getThreads();
        if (response.success) {
          setThreads(prev => ({
            ...prev,
            threads: response.data.threads
          }));
        }
      } catch (error) {
        console.error('Failed to fetch threads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThreads();
  }, [setThreads]);
  
  const handleLogout = () => {
    logoutUser();
    window.location.href = '/auth';
  };
  
  return (
    <div className="flex flex-col h-full py-6">
      {/* Sidebar header */}
      <div className="px-6 mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CodeIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-xl font-bold">DSA Assistant</h1>
        </div>
        {closeSidebar && (
          <button onClick={closeSidebar} className="text-gray-400 hover:text-white">
            <XIcon className="h-6 w-6" />
          </button>
        )}
      </div>
      
      {/* New Thread Button */}
      <div className="px-4 mb-6">
        <Link 
          to="/problems" 
          className="w-full py-3 px-4 flex items-center justify-center space-x-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white"
          onClick={closeSidebar}
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Thread</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="px-4 mb-6">
        <nav className="space-y-1">
          <Link 
            to="/" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${location.pathname === '/' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
            onClick={closeSidebar}
          >
            <HashIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link 
            to="/problems" 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${location.pathname === '/problems' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
            onClick={closeSidebar}
          >
            <BookIcon className="h-5 w-5" />
            <span>Problems</span>
          </Link>
        </nav>
      </div>
      
      {/* Threads List */}
      <div className="px-4 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-2 px-2">Recent Threads</h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 border-2 border-t-blue-500 border-gray-500 rounded-full animate-spin"></div>
          </div>
        ) : threads.threads.length > 0 ? (
          <div className="space-y-1">
            {threads.threads.map(thread => (
              <ThreadItem 
                key={thread._id} 
                thread={thread} 
                isActive={location.pathname === `/thread/${thread._id}`}
                onClick={closeSidebar}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No threads yet</p>
            <p className="text-sm mt-1">Start by creating a new thread</p>
          </div>
        )}
      </div>
      
      {/* User Info */}
      <div className="px-4 mt-6">
        <div className="flex items-center space-x-3 border-t border-gray-800 pt-4 px-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <span className="text-white font-semibold">{auth.user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{auth.user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{auth.user?.email || 'user@example.com'}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white">
            <LogOutIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;