import React from 'react'
import { useState, useEffect } from 'react';
import styles from "../css/Form.module.css"; 
import axios from 'axios';

 const OrderForm = ({ userId }) => {    

    const defaultCategories = [
    "Gold Ring",
    "Gold Necklace",
    "Gold Bracelet",
    "Gold Earrings",
    "Gold Pendant",
    "Gold Chain",
    "Gold Bangles",
    "Gold Anklet",
    "Gold Nose Pin",
    "Gold Locket Set"
  ];

      const [customCategories, setCustomCategories] = useState([]);
  const [itemName, setItemName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [newCustomCategory, setNewCustomCategory] = useState('');
     
      const [tagNumber, setTagNumber] = useState('');
      const [karat, setKarat] = useState('');
      const [quantity, setQuantity] = useState('');
      const [pieces, setPieces] = useState('');
      const [waste, setWaste] = useState('');
      const [totalWeight, setTotalWeight] = useState('');
      const [price, setPrice] = useState('');
      const [makingPerGram, setMakingPerGram] = useState('');
      const [totalMaking, setTotalMaking] = useState('');
    //   const [description, setDescription] = useState('');
      
useEffect(() => {
  const token = localStorage.getItem("token");
  axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories/custom`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => setCustomCategories(res.data))
  .catch(err => {
    console.error("Error fetching custom categories", err);
    if (err.response) {
      console.error("Server responded with:", err.response.data);
    }
  });
}, [userId]);



  return (
    <div>
         <div className={styles.inputRow}>
             
                
                <div className={styles.inputGroup}>
  <label htmlFor="itemName">Item Name</label>
  <select
    id="itemName"
    value={itemName}
    onChange={(e) => {
      if (e.target.value === "__custom__") {
        setShowCustomInput(true);
      } else {
        setItemName(e.target.value);
        setShowCustomInput(false);
      }
    }}
  >
    <option value="">Select Item</option>
    {[...defaultCategories, ...customCategories].map((item, index) => (
      <option key={index} value={item}>{item}</option>
    ))}
    <option value="__custom__">+ Add Custom Category</option>
  </select>
</div>

{showCustomInput && (
  <div className={styles.inputGroup}>
    <label htmlFor="newCategory">New Category Name</label>
    <input
      type="text"
      id="newCategory"
      value={newCustomCategory}
      onChange={(e) => setNewCustomCategory(e.target.value)}
    />
    <button
      type="button"
    onClick={() => {
  const token = localStorage.getItem("token");
  axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/categories/custom`, {
    userId,
    name: newCustomCategory
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(res => {
    setCustomCategories(prev => [...prev, newCustomCategory]);
    setItemName(newCustomCategory);
    setNewCustomCategory('');
    setShowCustomInput(false);
  }).catch(err => {
    console.error("Error saving category:", err);
    if (err.response) {
      console.error("Server responded with:", err.response.data);
    }
  });
}}
    >
      Save Category
    </button>
  </div>
)}
                <div className={styles.inputGroup}>
                  <label htmlFor="tagNumber">Tag Number</label>
                  <input type="text" id="tagNumber" value={tagNumber} onChange={(e) => setTagNumber(e.target.value)} />
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
                  <input type="number" id="quantity" min="1" value={quantity} onChange={(e) => { const value = e.target.value; if (value === '' || Number(value) >= 0) {  setQuantity(value); }}}/>
                </div>
        
                <div className={styles.inputGroup}>
                  <label htmlFor="pieces">Pieces</label>
                  <input type="number" id="pieces" min="1" value={pieces} onChange={(e) => {const value = e.target.value; if (value === '' || Number(value) >= 0) {  setPieces(value); }}} />
                </div>
        
                <div className={styles.inputGroup}>
                  <label htmlFor="price">Item Price (PKR)</label>
                  <input type="number" id="price" value={price} min="1" onChange={(e) => { const value = e.target.value;if (value === '' || Number(value) >= 0) {setPrice(value);}}} />
                </div>
        
                <div className={styles.inputGroup}>
                  <label htmlFor="waste">Waste (grams)</label>
                  <input type="number" id="waste" min="0" value={waste} onChange={(e) => {const value = e.target.value;if (value === '' || Number(value) >= 0) { setWaste(value);}}} />
                </div>
        
                <div className={styles.inputGroup}>
                  <label htmlFor="totalWeight">Total Weight</label>
                  <input type="number" id="totalWeight" min="0" value={totalWeight} onChange={(e) => {const value = e.target.value;if (value === '' || Number(value) >= 0) { setTotalWeight(value);}}} />
                </div>
        
                <div className={styles.inputGroup}>
                  <label htmlFor="makingPerGram">Making / gram (PKR)</label>
                  <input type="number" id="makingPerGram" min="0" value={makingPerGram} onChange={(e) => { const value = e.target.value;if (value === '' || Number(value) >= 0) {setMakingPerGram(value); }}} />
                </div>
        
                
                <div className={styles.inputGroup}>
                  <label htmlFor="totalMaking">Total Making</label>
                  <input type="number" id="totalMaking" min="0"  value={totalMaking} onChange={(e) => {const value = e.target.value;if (value === '' || Number(value) >= 0) { setTotalMaking(value);}}} />
                </div>
        
                {/* <div className={styles.inputGroup}>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={1} />
                </div> */}
        
        
        
              </div>
        
              <div className={styles.buttonRow}>
                <button type="button" className={styles.submitButton} onClick={() => { alert("Gold item submitted successfully!"); }}> Submit </button>
              </div>
        


    </div>
  )
}

export default OrderForm
