'use client';

import React, { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.log('LoadingScreen mounted');
    
    // Hide loading screen after delay
    const timer = setTimeout(() => {
      console.log('Hiding loading screen');
      setIsVisible(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  console.log('Rendering LoadingScreen, isVisible:', isVisible);

  return (
    <div className={`${styles.loadingScreen} ${!isVisible ? styles.hidden : ''}`}>
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