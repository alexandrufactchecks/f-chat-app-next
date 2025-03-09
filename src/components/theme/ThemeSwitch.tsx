'use client';

import React from 'react';
import { useTheme } from './ThemeContext';
import styles from './ThemeSwitch.module.css';

const ThemeSwitch: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.themeSwitchWrapper}>
      <label className={styles.themeSwitch} htmlFor="checkbox">
        <input
          type="checkbox"
          id="checkbox"
          checked={theme === 'light'}
          onChange={toggleTheme}
        />
        <div className={`${styles.slider} ${styles.round}`}></div>
      </label>
    </div>
  );
};

export default ThemeSwitch; 