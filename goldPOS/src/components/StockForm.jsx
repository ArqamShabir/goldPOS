import React from 'react'
import { useState, useEffect } from 'react';
import styles from "../css/Form.module.css"; 
import axios from 'axios';
import Modal from 'react-modal';

const StockForm = ({ userId }) => {
  const defaultCategories = [
    "Gold Ring", "Gold Necklace"
  ];
  const karatOptions = [18, 21, 22, 24];

  const [customCategories, setCustomCategories] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [newCustomCategory, setNewCustomCategory] = useState('');
  
  // State variables for form fields
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
  const [description, setDescription] = useState('');

  // States for validation errors and messages
  const [validationErrors, setValidationErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchNextTag = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/next-tag`, {
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
    .then(res => setCustomCategories(res.data.map(cat => cat.name)))
    .catch(err => {
      console.error("Error fetching custom categories", err);
      if (err.response) {
        console.error("Server responded with:", err.response.data);
      }
    });
 
    fetchNextTag();
  }, [userId]);
 
  // useEffect to handle message timeout
  useEffect(() => {
    if (isSuccess && message) {
      const timer = setTimeout(() => {
        setMessage('');
        setIsSuccess(false);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [isSuccess, message]);

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!itemName || itemName === "__custom__" || itemName === "__custom__del") errors.itemName = "Item Name is required.";
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
  
  const postStock = async () => {
    setMessage('');
    setIsSuccess(false);

    if (!validateForm()) {
      setMessage("Please correct the errors in the form.");
      setIsSuccess(false);
      return;
    }

    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/stocks`, {
        itemName,
        karat,
        quantity,
        pieces,
        waste,
        totalWeight,
        itemPrice,
        makingPerGram,
        totalMaking,
        description
      }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });

      if (response.status === 201) {
        setMessage("Stock item submitted successfully!");
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
        setDescription('');
        fetchNextTag();
      }

    } catch (error) {
      console.error("Error submitting stock:", error);
      setIsSuccess(false);
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState([]);

  const toggleDeleteModal = () => {
    setSelectedToDelete([]);
    setShowDeleteModal(prev => !prev);
  };

  const handleDeleteSelected = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/categories/custom`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { names: selectedToDelete }
      });
      setCustomCategories(prev => prev.filter(name => !selectedToDelete.includes(name)));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("Failed to delete selected categories.");
      setIsSuccess(false);
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
            value={itemName}
            onChange={(e) => {
              if (e.target.value === "__custom__") {
                setShowCustomInput(true);
              } else if (e.target.value === "__custom__del") {
                toggleDeleteModal();
              } else {
                setItemName(e.target.value);
                setShowCustomInput(false);
              }
            }}
            className={validationErrors.itemName ? styles.inputError : ''}
          >
            <option value="">Select Item</option>
            {[...defaultCategories, ...customCategories].map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
            <option value="__custom__">+ Add Custom Category</option>
            <option value="__custom__del">Delete Categories</option>
          </select>
          {validationErrors.itemName && <span className={styles.errorText}>{validationErrors.itemName}</span>}
        </div>

        <Modal
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
          contentLabel="Delete Categories"
          className="custom-modal"
          overlayClassName="custom-overlay"
        >
          <h2 style={{ marginBottom: '1rem' }}>Delete Categories</h2>
          {customCategories.length === 0 ? (
            <p>No custom categories available.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, maxHeight: '200px', overflowY: 'auto' }}>
              {customCategories.map((cat, index) => (
                <li key={index}>
                  <label>
                    <input
                      type="checkbox"
                      value={cat}
                      checked={selectedToDelete.includes(cat)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedToDelete(prev => [...prev, cat]);
                        } else {
                          setSelectedToDelete(prev => prev.filter(name => name !== cat));
                        }
                      }}
                    />
                    {cat}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleDeleteSelected} disabled={selectedToDelete.length === 0} style={{ marginRight: '1rem' }}>
              Delete Selected
            </button>
            <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
          </div>
        </Modal>

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
            > Save Category </button>
          </div>
        )}
          
        <div className={styles.inputGroup}>
          <label htmlFor="tagNumber">Tag Number</label>
          <input type="text" id="tagNumber" readOnly value={tagNumber} onChange={(e) => setTagNumber(e.target.value)} />
        </div>
 
        <div className={styles.inputGroup}>
          <label htmlFor="karat">Karat</label>
          <select 
            id="karat" 
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
            min="1" 
            value={pieces} 
            onChange={(e) => setPieces(e.target.value)} 
            className={validationErrors.pieces ? styles.inputError : ''}
          />
          {validationErrors.pieces && <span className={styles.errorText}>{validationErrors.pieces}</span>}
        </div>
 
        <div className={styles.inputGroup}>
          <label htmlFor="price">Item Price (PKR)</label>
          <input 
            type="number" 
            id="price" 
            value={itemPrice} 
            min="1" 
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
            min="0" 
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
            min="0" 
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
            min="0" 
            value={totalMaking} 
            onChange={(e) => setTotalMaking(e.target.value)}
            className={validationErrors.totalMaking ? styles.inputError : ''}
          />
          {validationErrors.totalMaking && <span className={styles.errorText}>{validationErrors.totalMaking}</span>}
        </div>
 
        <div className={styles.inputGroup}>
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={1}
            className={validationErrors.description ? styles.inputError : ''}
          />
          {validationErrors.description && <span className={styles.errorText}>{validationErrors.description}</span>}
        </div>
      </div>
 
      <div className={styles.buttonRow}>
        <button type="button" className={styles.submitButton} onClick={postStock}> Submit </button>
      </div>
    </div>
  );
};

export default StockForm;
