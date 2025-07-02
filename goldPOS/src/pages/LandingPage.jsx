import React from 'react';
import styles from '../css/LandingPage.module.css';
import Header from '../components/Header';
import AboutUs from '../components/AboutUs';
import HeroSection from '../components/HeroSection';
import ReviewSection from '../components/ReviewSection'
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const plansData = [
  {
    title: 'Per Month',
    price: 5000,
    features: [
      'Attendance Management',
      'Leave System Management',
      'Employee Management',
      'Invoice Generate',
      'Purchase Generate',
      'Payroll',
    ],
  },
  {
    title: 'Per 6 Months',
    price: 29400,
    originalPrice: 30000,
    discount: '2.5%',
    highlight: true,
    features: [
      'Attendance Management',
      'Leave System Management',
      'Employee Management',
      'Invoice Generate',
      'Purchase Generate',
      'Payroll',
    ],
  },
  {
    title: 'Per Year',
    price: 57000,
    originalPrice: 60000,
    discount: '5%',
    features: [
      'Attendance Management',
      'Leave System Management',
      'Employee Management',
      'Invoice Generate',
      'Purchase Generate',
      'Payroll',
    ],
  },
];

const LandingPage = () => {
  return (
    <>
    <Header/>
    <HeroSection/>
    <AboutUs/>
    <section className={styles.pricingSection} style={{padding:'80px 0'}} id='pricing'>
      <div className={styles.planHeader}>
        <h2>Choose Your Plan</h2>
      </div>

      <div className={styles.plans}>
        {plansData.map((plan) => (
          <div
            key={plan.title}
            className={`${styles.plan} ${plan.highlight ? styles.highlight : ''}`}
          >
            <div  >

              <div className={styles.header} >

              <div className={styles.planTitle}>{plan.title}</div>
              <div> {plan.discount && (
                <div className={`${styles.saveLabel} ${plan.highlight ? styles.saveHighlighted : ''}` }>(Save {plan.discount})</div>
              )}
              </div>

              </div>



              <div className={styles.planPrice}>
                {plan.originalPrice && (
                  <span className={`${styles.originalPrice} ${plan.highlight ? styles.originalPriceHighlighted : ''} `}>Rs {plan.originalPrice}</span>
                )}
                <span className={`${styles.discountedPrice}  ${plan.highlight ? styles.discountedPriceHighlighted :''} `}> Rs {plan.price}</span>
              </div>



              <div className={`${styles.planDesc} ${plan.highlight ? styles.planDescHighlighted : ''}`}>
                User/{plan.title === 'Per Month' ? 'Month' : plan.title === 'Per 6 Months' ? '6 Months' : 'Year'}
              </div>

              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <button
              className={`${styles.chooseBtn} ${plan.highlight ? styles.highlightedButton : ''}`}
            >
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </section>
    <ReviewSection/>
    <FAQ/>
    <Footer/>
        </>
  );
};

export default LandingPage;
