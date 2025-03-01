// components/common/Tabs.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Tabs = ({ tabs, defaultTab = 0, onChange = () => {} }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange(index);
  };
  
  return (
    <div>
      <div className="flex border-b border-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => handleTabChange(index)}
            className={`relative px-4 py-3 text-sm font-medium ${
              activeTab === index ? 'text-white' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label}
            {activeTab === index && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;