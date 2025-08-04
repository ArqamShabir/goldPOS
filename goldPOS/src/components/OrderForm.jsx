import React, { useState, useEffect } from 'react';
import styles from "../css/Form.module.css"; 
import axios from 'axios';

const OrderForm = ({ userId }) => {  
  const defaultCategories = [
    "Gold Ring",
    "Gold Necklace"
  ];

  const [itemName, setItemName] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [karat, setKarat] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pieces, setPieces] = useState('');
  const [waste, setWaste] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [makingPerGram, setMakingPerGram] = useState('');
  const [totalMaking, setTotalMaking] = useState('');
  const [customerName , setCustomerName] = useState('');

  const fetchNextTag = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/next-tag`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTagNumber(res.data.nextTagNumber);
    } catch (err) {
      console.error("Error fetching next tag:", err);
    }
  };
        
const [customCategories, setCustomCategories] = useState([]);

useEffect(() => {
  const token = localStorage.getItem("token");
  axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories/custom`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => setCustomCategories(res.data))
  .catch(err => {
    console.error("Error fetching custom categories", err);
    if (err.response) {
      console.error("Server responded with:", err.response.data);
    }
  });

  fetchNextTag();
}, [userId]);


  const postOrder = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        itemName,
        karat,
        quantity,
        pieces,
        waste,
        totalWeight,
        itemPrice,
        makingPerGram,
        totalMaking,
        customerName
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        alert("Order item submitted successfully!");
        setItemName('');
        setTagNumber('');
        setKarat('');
        setQuantity('');
        setPieces('');
        setWaste('');
        setTotalWeight('');
        setItemPrice('');
        setMakingPerGram('');
        setTotalMaking('');
        fetchNextTag();
        setCustomerName('');
      }

    } catch (error) {
      console.error("Error submitting order:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      }
    }
  }
  

  return (
    <div>
      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="itemName">Item Name</label>
         <select id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)}>
  <option value="">Select Item</option>
  {[...defaultCategories, ...customCategories].map((item, index) => (
    <option key={index} value={item}>{item}</option>
  ))}
</select>

        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="tagNumber">Tag Number</label>
          <input type="text" id="tagNumber" value={tagNumber} onChange={(e) => setTagNumber(e.target.value)} readOnly />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="karat">Karat</label>
          <select id="karat" value={karat} onChange={(e) => setKarat(e.target.value)}>
            <option value="">Select Karat</option>
            {[18, 21, 22, 24].map((k, index) => (
              <option key={index} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="quantity">Quantity</label>
          <input type="number" id="quantity" min="1" value={quantity} onChange={(e) => { const value = e.target.value; if (value === '' || Number(value) >= 0) { setQuantity(value); }}}/>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="pieces">Pieces</label>
          <input type="number" id="pieces" min="1" value={pieces} onChange={(e) => {const value = e.target.value; if (value === '' || Number(value) >= 0) { setPieces(value); }}} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="price">Item Price (PKR)</label>
          <input type="number" id="price" value={itemPrice} min="1" onChange={(e) => { const value = e.target.value; if (value === '' || Number(value) >= 0) { setItemPrice(value); }}} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="waste">Waste (grams)</label>
          <input type="number" id="waste" min="0" value={waste} onChange={(e) => { const value = e.target.value; if (value === '' || Number(value) >= 0) { setWaste(value); }}} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="totalWeight">Total Weight</label>
          <input type="number" id="totalWeight" min="0" value={totalWeight} onChange={(e) => { const value = e.target.value; if (value === '' || Number(value) >= 0) { setTotalWeight(value); }}} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="makingPerGram">Making / gram (PKR)</label>
          <input type="number" id="makingPerGram" min="0" value={makingPerGram} onChange={(e) => { const value = e.target.value; if (value === '' || Number(value) >= 0) { setMakingPerGram(value); }}} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="totalMaking">Total Making</label>
          <input type="number" id="totalMaking" min="0" value={totalMaking} onChange={(e) => { const value = e.target.value; if (value === '' || Number(value) >= 0) { setTotalMaking(value); }}} />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="customerName">Customer Name</label>
          <textarea id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} rows={1} />
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button type="button" className={styles.submitButton} onClick={postOrder}> Submit </button>
      </div>
    </div>
  );
};

export default OrderForm;
