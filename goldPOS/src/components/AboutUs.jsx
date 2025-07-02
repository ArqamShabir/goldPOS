import React from 'react';
import styles from '../css/AboutUs.module.css';
import Jewlery from '../assets/Jewlery.png'; 

const AboutUs = () => {
  return (
    <section className={styles.about} id='about'>
      <div className={styles.content}>
         <div className={styles.left}>
          <img src={Jewlery} alt="Jewlery" className={styles.image} />
         
        </div> 

        <div className={styles.right}>
          <h2>About Us</h2>
          <div className={styles.underline}></div>

          <p>
            At Auric POS, we are a dedicated team of skilled programmers and digital creators with years of
            experience on leading freelance platforms like Fiverr and Upwork. After successfully completing
            hundreds of projects worldwide, we joined forces to form a single, strong agency — built on trust,
            talent, and a passion for innovation.
          </p>

          <p>
            Our goal is simple: to provide powerful and flexible
            POS solutions that solve real business problems and help our clients grow.
          </p>

        

          <div className={styles.stats}>
            <div className={styles.statBox}>
              <h3>125+</h3>
              <span>Satisfied Clients</span>
            </div>
            <div className={styles.statBox}>
              <h3>224+</h3>
              <span>Projects Worked</span>
            </div>
            <div className={styles.statBox}>
              <h3>5+</h3>
              <span>Years Completed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
