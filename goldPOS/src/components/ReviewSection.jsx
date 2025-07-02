import React from 'react'
import styles from '../css/Review.module.css'
import Review from './Review';
const ReviewSection = () => {


const reviews = [
  {
    id: 1,
    stars: 5,
    text: "Implementing Glamoura's POS system has transformed our gold retail operations. It's incredibly intuitive for managing inventory, sales, and customer data. A must-have for any modern jewelry business!",
    name: "Omar Ali, Gemstone Emporium"
  },
  {
    id: 2,
    stars: 5,
    text: "The precision and speed of Glamoura's Gold POS are unmatched. Transaction processing is incredibly smooth, and the integrated reporting features give us clear insights into our daily sales. Highly efficient!",
    name: "Fatima Zahra, Royal Gold Co."
  },
  {
    id: 3,
    stars: 5,
    text: "We struggled with outdated systems until we switched to Glamoura's POS. Its robust security features for high-value transactions and effortless weighing scale integration have been game-changers for our gold shop.",
    name: "Ahmed Hassan, Prestige Jewels"
  },
  {
    id: 4,
    stars: 5,
    text: "Glamoura's POS system truly understands the unique needs of a gold business. From managing karats to detailed customer history for loyalty programs, it handles everything seamlessly. Support is fantastic too!",
    name: "Sana Rizvi, The Gold Standard"
  },
  

];

  return (
    <section className={styles.testimonialsSection} id='testimonial'>
      <h2 className={styles.sectionTitle}>Testimonial</h2>
      <p className={styles.sectionSubtitle}>Learn the feedback from our users who have tried our services.</p>

      <div className={styles.reviewsGridContainer}>
        {reviews.map((review) => (
        <Review key={review.id} review={review} />
        ))}
      </div>
    </section>
    
  )
}

export default ReviewSection
