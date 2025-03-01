// components/thread/MessageComposer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const MessageComposer = ({ onSendMessage, isLoading, threadId }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message.trim());
    setMessage('');
  };
  
  return (
    <div className="pt-2 pb-4 px-4 border-t border-gray-800 bg-gray-900">
      <form 
        onSubmit={handleSubmit} 
        className="flex items-end space-x-2 bg-gray-800 rounded-xl p-3 border border-gray-700"
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a question about this problem..."
          className="w-full bg-transparent resize-none outline-none text-white placeholder-gray-400 max-h-[200px] min-h-[40px]"
          rows={1}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`p-2 rounded-lg ${
            !message.trim() || isLoading 
              ? 'text-gray-500 bg-gray-700 cursor-not-allowed' 
              : 'text-white bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </motion.button>
      </form>
      
      <div className="mt-2 text-center text-xs text-gray-500">
        <p>Press Shift + Enter for a new line</p>
      </div>
    </div>
  );
};

export default MessageComposer;