'use client';

import React from 'react';
import styles from './AnimatedBackground.module.css';

const AnimatedBackground: React.FC = () => {
  return (
    <div className={styles.cityBackground}>
      <div className={styles.stars}></div>
      <div className={styles.citySkyline}></div>
      <div className={styles.citySkylineFront}></div>
      <div className={styles.citySkylineClosest}></div>
      <div className={styles.cityLights}></div>
      <div className={styles.fog}></div>
      <div className={styles.blurOverlay}></div>
    </div>
  );
};

export default AnimatedBackground; 