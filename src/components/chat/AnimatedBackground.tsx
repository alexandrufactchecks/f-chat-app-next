'use client';

import React from 'react';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground: React.FC = () => {
  return (
    <div className={styles.cityBackground}>
      <div className={styles.gradientOverlay}></div>
      <div className={styles.grid}></div>
      <div className={styles.particles}></div>
      <div className={styles.circle1}></div>
      <div className={styles.circle2}></div>
      <div className={styles.circle3}></div>
    </div>
  );
};

export default AnimatedBackground; 