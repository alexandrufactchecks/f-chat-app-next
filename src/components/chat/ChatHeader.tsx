'use client';

import React from 'react';
import ThemeSwitch from '../theme/ThemeSwitch';
import styles from './ChatHeader.module.css';

const ChatHeader: React.FC = () => {
  return (
    <div className={styles.chatHeader}>
      <ThemeSwitch />
      <div className={styles.headerLogo}>F</div>
    </div>
  );
};

export default ChatHeader; 