// components/layout/AppLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { uiState } from '../../recoil/atoms/uiState';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { AnimatePresence, motion } from 'framer-motion';
import { BackgroundGradient } from '../../lib/aceternity-ui/background-gradient';

const AppLayout = () => {
  const [ui, setUi] = useRecoilState(uiState);
  const location = useLocation();
  
  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setUi(prev => ({
        ...prev,
        isMobileView: window.innerWidth < 768,
        sidebarOpen: window.innerWidth >= 768 ? prev.sidebarOpen : false
      }));
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setUi]);
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (ui.isMobileView) {
      setUi(prev => ({ ...prev, sidebarOpen: false }));
    }
  }, [location.pathname, ui.isMobileView, setUi]);

  const toggleSidebar = () => {
    setUi(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      <BackgroundGradient className="fixed inset-0 opacity-20" />
      
      {/* Mobile Navigation */}
      {ui.isMobileView && <MobileNav toggleSidebar={toggleSidebar} />}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {(ui.sidebarOpen || !ui.isMobileView) && (
            <motion.div
              initial={{ x: ui.isMobileView ? -300 : 0, opacity: ui.isMobileView ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`${ui.isMobileView ? 'fixed inset-y-0 left-0 z-40 w-80' : 'w-80'} border-r border-gray-800 bg-gray-900 bg-opacity-90 backdrop-blur-sm flex-shrink-0`}
            >
              <Sidebar closeSidebar={ui.isMobileView ? toggleSidebar : undefined} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Mobile Overlay */}
        {ui.isMobileView && ui.sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-30"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Main Content */}
        <motion.main 
          layout
          className="flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AppLayout;