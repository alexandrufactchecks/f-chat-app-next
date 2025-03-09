'use client';

import React from 'react';
import ThemeSwitch from '../theme/ThemeSwitch';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  model?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ model = 'deepseek-reasoner' }) => {
  // Format model name for display
  const formatModelName = (modelName: string) => {
    return modelName
      .replace('deepseek-', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`${styles.chatHeader} glass-effect`}>
      <div className={styles.headerLeft}>
        <div className={styles.headerLogo}>
          <span className={styles.logoSpin}>F</span>
          <span className={styles.logoText}>actCheck</span>
        </div>
      </div>
      
      <div className={styles.headerCenter}>
        <div className={styles.headerTitle}>
          <span className={styles.titleIcon}>🔍</span>
          <span>AI Fact-Checking Assistant</span>
        </div>
      </div>
      
      <div className={styles.headerRight}>
        {/* Make theme switch visible */}
        <div className={styles.themeSwitchContainer}>
          <ThemeSwitch />
        </div>
        
        {/* Model indicator */}
        <div className={styles.modelBadge}>
          {formatModelName(model)}
        </div>
        
        {/* Version indicator */}
        <div className={styles.versionBadge}>v1.1</div>
      </div>
    </div>
  );
};

export default ChatHeader; 