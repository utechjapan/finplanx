'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { motion } from 'framer-motion';

export function DemoModeToggle() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isShowingTooltip, setIsShowingTooltip] = useState(false);

  // Check if demo mode is enabled on component mount
  useEffect(() => {
    const demoModeEnabled = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    setIsDemoMode(demoModeEnabled);
  }, []);

  const toggleTooltip = () => {
    setIsShowingTooltip(!isShowingTooltip);
  };

  const handleActivateDemoMode = async () => {
    try {
      // Call the demo-login API endpoint to activate demo mode
      const response = await fetch('/api/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsDemoMode(true);
        
        // Reload the page to apply demo mode
        window.location.reload();
      } else {
        console.error('Failed to activate demo mode');
      }
    } catch (error) {
      console.error('Error activating demo mode:', error);
    }
  };

  // If demo mode is not enabled at the environment level, don't render anything
  if (!isDemoMode && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
    return null;
  }

  return (
    <div className="relative">
      {isDemoMode ? (
        <div 
          className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300 px-4 py-2 rounded-md flex items-center"
          onMouseEnter={toggleTooltip}
          onMouseLeave={toggleTooltip}
        >
          <span className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>デモモード有効</span>
          </span>
          
          {isShowingTooltip && (
            <motion.div 
              className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="mb-2">デモモードでは、データベースを使用せずにアプリケーションの機能をお試しいただけます。</p>
              <p>一部の機能は制限されています。</p>
            </motion.div>
          )}
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
          onClick={handleActivateDemoMode}
        >
          デモモードを有効にする
        </Button>
      )}
    </div>
  );
}