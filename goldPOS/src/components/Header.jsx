import React from 'react'
import styles from '../css/Header.module.css'
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const navigate = useNavigate();
  return (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
            <div className={styles.logoText}>AURICPOS</div>
            </div>
            <nav className={styles.headerNav}>
                <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#testimonial">Testimonial</a></li>
                <li><a href="#faq">FAQ</a></li>
                </ul>
            </nav>
            <button className={styles.loginBtn} onClick={() => navigate('/login')}>
                  Login
                </button>
        </header>
  )
}

export default  Header
