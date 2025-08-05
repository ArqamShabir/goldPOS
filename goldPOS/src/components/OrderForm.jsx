import React, { useState, useEffect } from 'react';
import styles from "../css/Form.module.css";
import axios from 'axios';

const OrderForm = ({ userId }) => {
  const defaultCategories = [
    "Gold Ring",
    "Gold Necklace"
  ];
  const karatOptions = [18, 21, 22, 24];

  // Original state variables
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
  const [customerName, setCustomerName] = useState('');

  // States for validation errors and messages
  const [validationErrors, setValidationErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [customCategories, setCustomCategories] = useState([]);

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

  // New useEffect to handle message timeout
  useEffect(() => {
    // If there's a success message, set a timer to clear it after 10 seconds.
    if (isSuccess && message) {
      const timer = setTimeout(() => {
        setMessage('');
        setIsSuccess(false);
      }, 4000); // 10 seconds

      // Cleanup function to clear the timer if the component unmounts
      // or if the message state changes before the timer finishes.
      return () => clearTimeout(timer);
    }
  }, [isSuccess, message]);

  // Validation function matching the UpdateOrderFormModal
  const validateForm = () => {
    const errors = {};
    if (!itemName) errors.itemName = "Item Name is required.";
    if (!customerName) errors.customerName = "Customer Name is required.";
    if (customerName && customerName.length > 50) errors.customerName = "Customer Name should be less than 50 letters.";
    if (!karat) errors.karat = "Karat is required.";
    if (!quantity || isNaN(quantity) || parseInt(quantity, 10) < 1) errors.quantity = "Quantity must be a positive integer.";
    if (!pieces || isNaN(pieces) || parseInt(pieces, 10) < 1) errors.pieces = "Pieces must be a positive integer.";
    if (!itemPrice || isNaN(itemPrice) || itemPrice < 1) errors.itemPrice = "Item Price must be a positive number.";
    if (waste === '' || isNaN(waste) || waste < 0) errors.waste = "Waste must be a non-negative number.";
    if (!totalWeight || isNaN(totalWeight) || totalWeight < 1) errors.totalWeight = "Total Weight must be a positive number.";
    if (!makingPerGram || isNaN(makingPerGram) || makingPerGram < 1) errors.makingPerGram = "Making per Gram must be a positive number.";
    if (!totalMaking || isNaN(totalMaking) || totalMaking < 1) errors.totalMaking = "Total Making must be a positive number.";

    // Integer validation checks
    if (quantity && !Number.isInteger(Number(quantity))) errors.quantity = "Quantity must be an integer.";
    if (pieces && !Number.isInteger(Number(pieces))) errors.pieces = "Pieces must be an integer.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const postOrder = async () => {
    setMessage('');
    setIsSuccess(false);

    if (!validateForm()) {
      setMessage("Please correct the errors in the form.");
      setIsSuccess(false);
      return;
    }

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
        setMessage("Order item submitted successfully!");
        setIsSuccess(true);
        // Reset form fields
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
        setCustomerName('');
        fetchNextTag();
      }

    } catch (error) {
      console.error("Error submitting order:", error);
      setIsSuccess(false);
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  };


  return (
    <div>
      {message && (
        <div className={isSuccess ? styles.successMessage : styles.errorMessage}>
          {message}
        </div>
      )}
      <div className={styles.inputRow}>
        <div className={styles.inputGroup}>
          <label htmlFor="itemName">Item Name</label>
          <select
            id="itemName"
            name="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className={validationErrors.itemName ? styles.inputError : ''}
          >
            <option value="">Select Item</option>
            {[...defaultCategories, ...customCategories.map(cat => cat.itemName)].map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
          {validationErrors.itemName && <span className={styles.errorText}>{validationErrors.itemName}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="tagNumber">Tag Number</label>
          <input type="text" id="tagNumber" value={tagNumber} readOnly />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="karat">Karat</label>
          <select
            id="karat"
            name="karat"
            value={karat}
            onChange={(e) => setKarat(e.target.value)}
            className={validationErrors.karat ? styles.inputError : ''}
          >
            <option value="">Select Karat</option>
            {karatOptions.map((k, index) => (
              <option key={index} value={k}>{k}</option>
            ))}
          </select>
          {validationErrors.karat && <span className={styles.errorText}>{validationErrors.karat}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={validationErrors.quantity ? styles.inputError : ''}
          />
          {validationErrors.quantity && <span className={styles.errorText}>{validationErrors.quantity}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="pieces">Pieces</label>
          <input
            type="number"
            id="pieces"
            name="pieces"
            min="1"
            value={pieces}
            onChange={(e) => setPieces(e.target.value)}
            className={validationErrors.pieces ? styles.inputError : ''}
          />
          {validationErrors.pieces && <span className={styles.errorText}>{validationErrors.pieces}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="itemPrice">Item Price (PKR)</label>
          <input
            type="number"
            id="itemPrice"
            name="itemPrice"
            min="1"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            className={validationErrors.itemPrice ? styles.inputError : ''}
          />
          {validationErrors.itemPrice && <span className={styles.errorText}>{validationErrors.itemPrice}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="waste">Waste (grams)</label>
          <input
            type="number"
            id="waste"
            name="waste"
            min="0"
            value={waste}
            onChange={(e) => setWaste(e.target.value)}
            className={validationErrors.waste ? styles.inputError : ''}
          />
          {validationErrors.waste && <span className={styles.errorText}>{validationErrors.waste}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="totalWeight">Total Weight</label>
          <input
            type="number"
            id="totalWeight"
            name="totalWeight"
            min="1"
            value={totalWeight}
            onChange={(e) => setTotalWeight(e.target.value)}
            className={validationErrors.totalWeight ? styles.inputError : ''}
          />
          {validationErrors.totalWeight && <span className={styles.errorText}>{validationErrors.totalWeight}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="makingPerGram">Making / gram (PKR)</label>
          <input
            type="number"
            id="makingPerGram"
            name="makingPerGram"
            min="1"
            value={makingPerGram}
            onChange={(e) => setMakingPerGram(e.target.value)}
            className={validationErrors.makingPerGram ? styles.inputError : ''}
          />
          {validationErrors.makingPerGram && <span className={styles.errorText}>{validationErrors.makingPerGram}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="totalMaking">Total Making</label>
          <input
            type="number"
            id="totalMaking"
            name="totalMaking"
            min="1"
            value={totalMaking}
            onChange={(e) => setTotalMaking(e.target.value)}
            className={validationErrors.totalMaking ? styles.inputError : ''}
          />
          {validationErrors.totalMaking && <span className={styles.errorText}>{validationErrors.totalMaking}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="customerName">Customer Name</label>
          <textarea
            id="customerName"
            name="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            rows={1}
            className={validationErrors.customerName ? styles.inputError : ''}
          />
          {validationErrors.customerName && <span className={styles.errorText}>{validationErrors.customerName}</span>}
        </div>
      </div>

      <div className={styles.buttonRow}>
        <button type="button" className={styles.submitButton} onClick={postOrder}> Submit </button>
      </div>
    </div>
  );
};

export default OrderForm;
