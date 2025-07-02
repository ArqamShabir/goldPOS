import React, { useState } from 'react';
import styles from '../css/FAQ.module.css';
import up from '../assets/images/up.png';

export default function FAQ() {
  const faqData = [
    {
      id: 1,
      question: 'What is the Gold POS System?',
      answer: 'The Gold POS System is a comprehensive Point of Sale solution designed to streamline your business operations, including sales, inventory management, customer relations, and reporting. It\'s ideal for retail, restaurants, and various service industries.',
    },
    {
      id: 2,
      question: 'How do I subscribe to the Gold POS System?',
      answer: 'You can subscribe to the Gold POS System by visiting our "Pricing" page and choosing the subscription plan that best fits your business needs. Follow the on-screen instructions to complete your registration and payment.',
    },
    {
      id: 3,
      question: 'What are the different subscription plans available?',
      answer: 'We offer various subscription plans tailored to different business sizes and requirements. Details on features, pricing, and included services for each plan (e.g., Basic, Standard, Premium) are available on our "Pricing" page.',
    },
    {
      id: 4,
      question: 'Can I try the Gold POS System before subscribing?',
      answer: 'Yes, we offer a free trial period for new users to experience the full capabilities of the Gold POS System. You can sign up for a trial directly from our homepage without any commitment.',
    },
    {
      id: 5,
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription at any time through your account dashboard. Navigate to "Account Settings" or "Subscription Management" and follow the instructions to terminate your plan. Please note our cancellation policy regarding refunds.',
    },
    {
      id: 6,
      question: 'What kind of support is included with my subscription?',
      answer: 'All subscription plans include access to our dedicated customer support team. Depending on your plan, support may include email, live chat, phone support, and access to our extensive knowledge base and tutorials.',
    },
    {
      id: 7,
      question: 'Is my data secure with the Gold POS System?',
      answer: 'Absolutely. We prioritize the security of your business data. The Gold POS System uses industry-standard encryption, secure servers, and regular backups to ensure your information is protected.',
    },
    {
      id: 8,
      question: 'Can I upgrade or downgrade my subscription plan?',
      answer: 'Yes, you can easily upgrade or downgrade your subscription plan at any time through your account dashboard. Changes will be prorated and take effect immediately or at the start of your next billing cycle, depending on the change.',
    },
  ];

  const [opened, setOpened] = useState([]);

  const toggle = (id) => {
    setOpened((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.container} id="faq">

       <div className={styles.faqWrapper}>
      <h1 className={styles.faqTitle}>Frequently Asked Questions</h1>

      <div className={styles.faqList}>
        {faqData.map((item) => {
          const isOpen = opened.includes(item.id);
          return (
            <div key={item.id} className={`${styles.faqItem} ${isOpen ? styles.open : ''}`}>

              <div className={styles.faqQuestion} onClick={() => (toggle(item.id))}>

                <span className={styles.questionText}>
                  {item.id}. {item.question}
                </span>
                <img src={up} alt="toggle arrow" className={`${styles.arrowIcon} ${isOpen? styles.rotateUp : styles.rotateDown} `} />

              </div>

              {isOpen && (
              <div className={styles.faqAnswer}>{item.answer}</div>
              )}

            </div>
          );
        })}
      </div>
    </div>

    </div>
   
  );
}
