// components/thread/ChatMessage.jsx
import React, { useState } from 'react';
import { formatDate } from '../../utils/formatDate';
import { Code, UserCircle, Bot, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatMessage = ({ message, isLastUserMessage = false }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const isUser = message.sender === 'user';
  const formattedDate = formatDate(message.createdAt);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  // Extract code blocks for separate handling
  const splitContentWithCodeBlocks = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add the text before the code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }
      
      // Add the code block
      parts.push({
        type: 'code',
        language: match[1] || 'javascript',
        content: match[2]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }
    
    return parts;
  };
  
  const contentParts = splitContentWithCodeBlocks(message.content);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`px-4 py-6 ${isUser ? '' : 'bg-gray-900/50'}`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-2">
          <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3">
            {isUser ? (
              <UserCircle className="h-8 w-8 text-blue-400" />
            ) : (
              <Bot className="h-8 w-8 text-green-400" />
            )}
          </div>
          
          <div>
            <p className="font-medium text-white">
              {isUser ? 'You' : 'DSA Assistant'}
            </p>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>
        
        <div className="pl-11 pr-4 prose prose-invert prose-gray max-w-none">
          {contentParts.map((part, index) => {
            if (part.type === 'text') {
              return (
                <ReactMarkdown key={index}>
                  {part.content}
                </ReactMarkdown>
              );
            } else {
              // Code block
              return (
                <div key={index} className="relative my-4 group">
                  <div className="absolute right-2 top-2 z-10">
                    <button
                      onClick={() => copyToClipboard(part.content)}
                      className="p-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      {isCopied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  
                  <SyntaxHighlighter
                    language={part.language}
                    style={oneDark}
                    showLineNumbers
                    customStyle={{
                      borderRadius: '0.5rem',
                      margin: '1rem 0',
                    }}
                  >
                    {part.content}
                  </SyntaxHighlighter>
                </div>
              );
            }
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;