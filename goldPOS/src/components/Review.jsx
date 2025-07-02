import React from 'react'
import styles from '../css/Review.module.css'

const Review = ({review}) => {
  return (
    <div className={styles.reviewCard}>
        <div className={styles.starRating}>
            {'⭐'.repeat(review.stars)}
        </div>

            <p className={styles.reviewText}>
                {review.text}
            </p>

        <div className={styles.reviewInfo}>
            <p className={styles.reviewName}>
                {review.name}
            </p>

        </div>
    </div>
  )
}

export default Review
