// pages/Thread.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { threadState } from '../recoil/atoms/threadAtom';
import { 
  getThread, 
  sendMessage, 
  updateThread, 
  deleteThread, 
  updateLlmProvider 
} from '../services/threadService';
import ThreadHeader from '../components/thread/ThreadHeader';
import ChatMessage from '../components/thread/ChatMessage';
import MessageComposer from '../components/thread/MessageComposer';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Thread = () => {
  const { id } = useParams();
  const [threads, setThreads] = useRecoilState(threadState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Fetch thread data on mount or when ID changes
  useEffect(() => {
    fetchThreadData();
  }, [id]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [threads.messages]);
  
  const fetchThreadData = async () => {
    setIsLoading(true);
    try {
      const response = await getThread(id);
      if (response.success) {
        setThreads(prev => ({
          ...prev,
          currentThread: response.data.thread,
          messages: response.data.messages,
          llmProviders: response.data.availableLlmProviders,
          currentLlmProvider: response.data.thread.llmProvider
        }));
        setNewTitle(response.data.thread.title);
      }
    } catch (error) {
      console.error('Failed to fetch thread:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async (content) => {
    setIsSending(true);
    try {
      const response = await sendMessage(id, content);
      if (response.success) {
        setThreads(prev => ({
          ...prev,
          messages: [...prev.messages, response.data.userMessage, response.data.assistantMessage],
          currentLlmProvider: response.data.currentLlmProvider
        }));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleChangeProvider = async (provider) => {
    try {
      const response = await updateLlmProvider(id, provider);
      if (response.success) {
        setThreads(prev => ({
          ...prev,
          currentThread: response.data.thread,
          currentLlmProvider: provider
        }));
      }
    } catch (error) {
      console.error('Failed to update LLM provider:', error);
    }
  };
  
  const handleRenameThread = async () => {
    try {
      const response = await updateThread(id, newTitle);
      if (response.success) {
        setThreads(prev => ({
          ...prev,
          currentThread: response.data.thread,
          threads: prev.threads.map(t => 
            t._id === id ? { ...t, title: newTitle } : t
          )
        }));
        setIsRenameModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to rename thread:', error);
    }
  };
  
  const handleDeleteThread = async () => {
    try {
      const response = await deleteThread(id);
      if (response.success) {
        setThreads(prev => ({
          ...prev,
          threads: prev.threads.filter(t => t._id !== id)
        }));
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to delete thread:', error);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (isLoading) {
    return <Loader fullScreen text="Loading thread..." />;
  }
  
  return (
    <div className="flex flex-col h-screen">
      {/* Thread Header */}
      <ThreadHeader 
        thread={threads.currentThread}
        onChangeProvider={handleChangeProvider}
        availableLlmProviders={threads.llmProviders}
        onDeleteThread={() => setIsDeleteModalOpen(true)}
        onRenameThread={() => setIsRenameModalOpen(true)}
      />
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {threads.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <h3 className="text-xl font-medium text-white mb-2">Start Your Conversation</h3>
              <p className="text-gray-400 mb-6">
                Ask questions about the problem, request hints, or discuss algorithm approaches.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {threads.messages.map((message, index) => (
              <ChatMessage 
                key={message._id || index} 
                message={message} 
                isLastUserMessage={index === threads.messages.length - 2 && message.sender === 'user'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Composer */}
      <MessageComposer 
        onSendMessage={handleSendMessage} 
        isLoading={isSending} 
        threadId={id}
      />
      
      {/* Rename Thread Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Rename Thread"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Thread Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter a new title for this thread"
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setIsRenameModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameThread}
              disabled={!newTitle.trim()}
            >
              Rename
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Delete Thread Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Thread"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this thread? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setIsDeleteModalOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteThread}
              variant="danger"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Thread;