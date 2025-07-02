import React from 'react';
import styles from '../css/HeroSection.module.css';

export default function HeroSection() {
  return (
    <div className={styles.hero} id='home'>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <h1 className={styles.title}>Simplify, Sell, Succeed with Auric POS</h1>
          <p className={styles.subtitle}>Streamline your business with ease</p>
        </div>
      </div>
    </div>
  );
}
