'use client';

import React from 'react';
import ThemeSwitch from '../theme/ThemeSwitch';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  model?: string;
  onModelChange?: (model: string) => void;
  isPremiumUser?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  model = 'deepseek-chat', 
  onModelChange,
  isPremiumUser = false
}) => {
  // Format model name for display
  const formatModelName = (modelName: string) => {
    return modelName
      .replace('deepseek-', '')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle model switch
  const handleModelSwitch = () => {
    if (onModelChange) {
      const newModel = model === 'deepseek-chat' ? 'deepseek-reasoner' : 'deepseek-chat';
      onModelChange(newModel);
    }
  };

  return (
    <div className={styles.chatHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.headerLogo}>
          <span className={styles.logoSpin}>F</span>
          <span className={styles.logoText}>actCheck</span>
        </div>
      </div>
      
      <div className={styles.headerRight}>
        {/* Model indicator */}
        <div 
          className={`${styles.modelBadge} ${model === 'deepseek-reasoner' ? styles.reasonerModel : ''}`}
          onClick={handleModelSwitch}
          title={isPremiumUser ? "Click to switch model" : "Premium feature"}
        >
          {formatModelName(model)}
          {!isPremiumUser && model === 'deepseek-reasoner' && <span className={styles.lockIcon}>🔒</span>}
        </div>
        
        {/* Version indicator */}
        <div className={styles.versionBadge}>v1.2</div>
        
        {/* Theme switch */}
        <div className={styles.themeSwitchContainer}>
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader; 