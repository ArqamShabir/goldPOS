import React from 'react';
import styles from '../css/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2>Auric Pos</h2>
          <p>
           Driving business growth through powerful, reliable technology.
          </p>
        </div>
        <div className={styles.right}>
          <h3>Contact Us</h3>
          <p>✉ info@auricpos.com</p>
          <p>📍 Gift University, Gujranwala – Pakistan</p>
        </div>
      </div>
      <div className={styles.bottom}>
        © 2025 <a href="https://auricpos.com">AuricPos.com</a>. All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
