// pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { threadState } from '../recoil/atoms/threadAtom';
import { getThreads } from '../services/threadService';
import { SparklesCore } from '../lib/aceternity-ui/sparkles';
import { PlusCircle, MessageSquare, Brain } from 'lucide-react';
import Button from '../components/common/Button';
import ThreadList from '../components/thread/ThreadList';

const Home = () => {
  const [threads, setThreads] = useRecoilState(threadState);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
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
  
  return (
    <div className="min-h-screen">
      {/* Hero section for empty state or welcome */}
      {threads.threads.length === 0 && !isLoading ? (
        <div className="relative min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="absolute inset-0 z-0">
            <SparklesCore
              id="tsparticlesfull"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={40}
              className="w-full h-full"
              particleColor="#3b82f6"
            />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-600/20 mb-6">
              <Brain className="h-12 w-12 text-blue-500" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to DSA Teaching Assistant</h1>
            <p className="text-xl text-gray-300 mb-8">
              Your AI-powered companion for learning data structures and algorithms. Get help with LeetCode problems, understand concepts, and improve your coding skills.
            </p>
            
            <Button 
              onClick={() => navigate('/problems')}
              size="lg"
              icon={<PlusCircle className="h-5 w-5" />}
            >
              Start a New Thread
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Your Threads</h1>
            
            <Button 
              onClick={() => navigate('/problems')}
              variant="primary"
              icon={<PlusCircle className="h-5 w-5" />}
            >
              New Thread
            </Button>
          </div>
          
          {/* Recent threads */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-500 mr-3" />
              <h2 className="text-lg font-medium text-white">Recent Conversations</h2>
            </div>
            
            <div className="divide-y divide-gray-800">
              <ThreadList threads={threads.threads} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;