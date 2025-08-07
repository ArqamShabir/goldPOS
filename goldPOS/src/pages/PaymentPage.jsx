import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/PaymentPage.module.css';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PaymentPage = () => {
  const { state } = useLocation();
  const plan = state?.plan;
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const [loading, setLoading] = useState(false);

   const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    card: '',
    // expiry: '',
    expiry: null,
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [redirectAfterModal, setRedirectAfterModal] = useState(false);

  const validate = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value) error = 'Name is required';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email';
        break;
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (!/^\d{11}$/.test(value)) error = 'Must be 11 digits';
        break;
      case 'card':
        if (!value) error = 'Card number is required';
        else if (!/^4242424242424242$/.test(value.replace(/\s+/g, ''))) error = 'Use test card 4242 4242 4242 4242';
        break;
      case 'expiry':
        if (!value) error = 'Expiry date required';
        break;
      case 'cvv':
        if (!value) error = 'CVV is required';
        else if (!/^\d{3}$/.test(value)) error = 'Invalid CVV';
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

   const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => alert('Copied to clipboard!'))
    .catch(() => alert('Failed to copy.'));
};


  const createUserAfterPayment = async ({ name, email, password,phoneNumber}) => {
    try {
      const response = await fetch('http://localhost:5000/api/create-user-after-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username: email, password, phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedPassword(password);
        setShowPasswordModal(true);
        localStorage.setItem('token', data.token);
        setRedirectAfterModal(true);
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
    if (loading) return; 

    const hasErrors = Object.entries(form).some(([key, val]) => {
      validate(key, val);
      return !val || errors[key];
    });

    if (hasErrors) {
      alert('❌ Please correct the errors in the form.');
      return;
    }

    setLoading(true);

    const fullName = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const card = e.target.card.value.trim().replace(/\s+/g, '');
    // const expiry = e.target.expiry.value.trim();
    // const expiry = e.target.expiry.value
    const cvv = e.target.cvv.value.trim();
    const phone = e.target.phone.value.trim();

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
      <Modal
  isOpen={showPasswordModal}
  onRequestClose={() => setShowPasswordModal(false)}
  contentLabel="Password"
  className="custom-modal"
  overlayClassName="custom-overlay"
>
  <h3 style={{ textAlign: 'center', marginBottom: '1rem', color:'#3e3e3e' }}>Payment Completed</h3>
  <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1rem',  color:'#3e3e3e' }}>
    Password: {generatedPassword}
  </p>
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
    <button onClick={() => copyToClipboard(generatedPassword)} style={{ marginRight: '1rem' }}>
      Copy to Clipboard
    </button>
    <button
  onClick={() => {
    setShowPasswordModal(false);
    if (redirectAfterModal) navigate('/dashboard');
  }}
>
  Close
</button>
  </div>
</Modal>
      <h2 className={styles.heading}>Complete Payment for: {plan.title}</h2>
      <p className={styles.price}>Amount: Rs {plan.price}</p>

      <form className={styles.paymentForm} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className={styles.error}>{errors.name}</div>}

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <div className={styles.error}>{errors.email}</div>}

        <input
          type="text"
          name="phone"
          placeholder="Phone Number (03XXXXXXXXX)"
          value={form.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && <div className={styles.error}>{errors.phone}</div>}

        <input
          type="text"
          name="card"
          placeholder="Card Number (4242 4242 4242 4242)"
          value={form.card}
          onChange={handleChange}
          required
        />
        {errors.card && <div className={styles.error}>{errors.card}</div>}

        <DatePicker
  selected={form.expiry}
  onChange={(date) => setForm({ ...form, expiry: date })}
  placeholderText="Card Expiry Date"
  className={styles.datepic}
/>
        {errors.expiry && <div className={styles.error}>{errors.expiry}</div>}

        <input
          type="text"
          name="cvv"
          placeholder="CVV (123)"
          value={form.cvv}
          onChange={handleChange}
          required
        />
        {errors.cvv && <div className={styles.error}>{errors.cvv}</div>}        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : `Pay Rs ${plan.price}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
