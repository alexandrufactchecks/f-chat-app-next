'use client';

import React from 'react';
import ThemeSwitch from '../theme/ThemeSwitch';
import styles from './ChatHeader.module.css';

const ChatHeader: React.FC = () => {
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
        
        {/* Updated version indicator */}
        <div className={styles.versionBadge}>v1.1</div>
      </div>
    </div>
  );
};

export default ChatHeader; 