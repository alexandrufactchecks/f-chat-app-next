'use client';

import React from 'react';
import ThemeSwitch from '../theme/ThemeSwitch';
import styles from './ChatHeader.module.css';

const ChatHeader: React.FC = () => {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.headerLeft}>
        <div className={styles.headerLogo}>
          <span className={styles.logoSpin}>F</span>
          <span>actChecks.eu</span>
        </div>
      </div>
      
      <div className={styles.headerCenter}>
        <div className={styles.headerTitle}>AI Fact-Checking Assistant</div>
      </div>
      
      <div className={styles.headerRight}>
        <div className={styles.themeSwitchContainer}>
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader; 