'use client';

import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.logoContainer}>
        <div className={styles.upsideDownF}>F</div>
      </div>
      <div className={styles.loadingDots}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
};

export default LoadingScreen; 