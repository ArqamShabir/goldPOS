import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/PaymentPage.module.css';

const PaymentPage = () => {
  const { state } = useLocation();
  const plan = state?.plan;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const createUserAfterPayment = async ({ name, email, password }) => {
    try {
      const response = await fetch('http://localhost:5000/api/create-user-after-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ User created after payment");
        alert(`✅ Payment done\nYour login password: ${password}`);
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        alert("⚠️ User creation failed: User already exists");
      }
    } catch (err) {
      console.error("❌ Error creating user:", err);
      alert("❌ An error occurred while creating user.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double click

    setLoading(true);

    const fullName = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const card = e.target.card.value.trim().replace(/\s+/g, '');
    const expiry = e.target.expiry.value.trim();
    const cvv = e.target.cvv.value.trim();
    const phone = '03000000000';

    if (card === '4242424242424242' && cvv === '123') {
      const generatedPassword = Math.random().toString(36).slice(-8);
      await createUserAfterPayment({
        name: fullName,
        email,
        password: generatedPassword,
        phoneNumber: phone,
      });
    } else {
      alert('❌ Payment Failed: Use test card 4242 4242 4242 4242 and CVV 123');
    }

    setLoading(false);
  };

  if (!plan) return <div className={styles.wrapper}>No plan selected</div>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Complete Payment for: {plan.title}</h2>
      <p className={styles.price}>Amount: Rs {plan.price}</p>

      <form className={styles.paymentForm} onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" required />
        <input type="text" name="email" placeholder="Email" required />
        <input type="text" name="card" placeholder="Card Number (4242 4242 4242 4242)" required />
        <input type="date" name="expiry" placeholder="MM/YY" required />
        <input type="text" name="cvv" placeholder="CVV (123)" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : `Pay Rs ${plan.price}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
