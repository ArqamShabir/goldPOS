import React, { useState, useEffect } from 'react';
import formStyles from "../css/Form.module.css";
import axios from 'axios';
import Modal from 'react-modal';
import modalStyles from "../css/UpdateOrderFormModal.module.css";

const UpdateStockFormModal = ({ stockData, onUpdateSuccess, isOpen, onClose }) => {
  // Initialize state with empty values to avoid the initial error.
  const [formData, setFormData] = useState({
    itemName: '',
    karat: '',
    quantity: '',
    pieces: '',
    waste: '',
    totalWeight: '',
    itemPrice: '',
    makingPerGram: '',
    totalMaking: '',
    description: '',
  });

  const [customCategories, setCustomCategories] = useState([]);
  const karatOptions = [18, 21, 22, 24];
  const defaultCategories = ["Gold Ring", "Gold Necklace"];

  // Use a useEffect to populate the form data when a new stock item is selected.
  useEffect(() => {
    if (stockData) {
      setFormData({
        itemName: stockData.itemName || '',
        karat: stockData.karat || '',
        quantity: stockData.quantity || '',
        pieces: stockData.pieces || '',
        waste: stockData.waste || '',
        totalWeight: stockData.totalWeight || '',
        itemPrice: stockData.itemPrice || '',
        makingPerGram: stockData.makingPerGram || '',
        totalMaking: stockData.totalMaking || '',
        description: stockData.description || '',
      });
    }
  }, [stockData]);

  useEffect(() => {
    // Fetch custom categories on component mount
    const fetchCustomCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/categories/custom`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        // Assuming the response is an array of objects with an "itemName" property
        setCustomCategories(response.data);
      } catch (err) {
        console.error("Error fetching custom categories", err);
        if (err.response) {
          console.error("Server responded with:", err.response.data);
        }
      }
    };
    fetchCustomCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateStock = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/stocks/${stockData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        console.log("Stock updated successfully!");
        onUpdateSuccess(response.data);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      if (error.response) {
        // Use a custom message box instead of alert()
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={modalStyles.modalContent}
      overlayClassName={modalStyles.modalOverlay}
      contentLabel="Update Stock"
    >
      {/* <div className={formStyles.formContainer}> */}
        <h2 className={formStyles.formTitle}>Update Stock: {stockData?.tagNumber || ''}</h2>
        <div className={formStyles.inputRow}>
          
          {/* Read-only fields */}
          <div className={formStyles.inputGroup}>
            <label htmlFor="tagNumber">Tag Number</label>
            <input type="text" id="tagNumber" value={stockData?.tagNumber || ''} readOnly />
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="date">Date Created</label>
            <input type="text" id="date" value={stockData?.createdAt ? new Date(stockData.createdAt).toLocaleDateString() : ''} readOnly />
          </div>
          
          {/* Editable fields */}
          <div className={formStyles.inputGroup}>
            <label htmlFor="itemName">Item Name</label>
            <select 
              id="itemName" 
              name="itemName" 
              value={formData.itemName} 
              onChange={handleChange}
            >
              <option value="">Select an Item</option>
              {[...defaultCategories, ...customCategories].map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="karat">Karat</label>
            <select id="karat" name="karat" value={formData.karat} onChange={handleChange}>
              <option value="">Select Karat</option>
              {karatOptions.map((k, index) => (
                <option key={index} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="pieces">Pieces</label>
            <input type="number" id="pieces" name="pieces" min="1" value={formData.pieces} onChange={handleChange} />
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="quantity">Quantity</label>
            <input type="number" id="quantity" name="quantity" min="1" value={formData.quantity} onChange={handleChange} />
          </div>
          <div className={formStyles.inputGroup}>
            <label htmlFor="itemPrice">Item Price (PKR)</label>
            <input type="number" id="itemPrice" name="itemPrice" value={formData.itemPrice} min="1" onChange={handleChange} />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="waste">Waste (grams)</label>
            <input type="number" id="waste" name="waste" min="0" value={formData.waste} onChange={handleChange} />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="totalWeight">Total Weight</label>
            <input type="number" id="totalWeight" name="totalWeight" min="0" value={formData.totalWeight} onChange={handleChange} />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="makingPerGram">Making / gram (PKR)</label>
            <input type="number" id="makingPerGram" name="makingPerGram" value={formData.makingPerGram} onChange={handleChange} />
          </div>

          <div className={formStyles.inputGroup}>
            <label htmlFor="totalMaking">Total Making</label>
            <input type="number" id="totalMaking" name="totalMaking" value={formData.totalMaking} onChange={handleChange} />
          </div>
          
          <div className={formStyles.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={1} />
          </div>
        </div>

        <div className={formStyles.buttonRow}>
          <button type="button" className={formStyles.submitButton} onClick={updateStock}>Update Stock</button>
          <button type="button" className={formStyles.cancelButton} onClick={onClose}>Cancel</button>
        </div>
      {/* </div> */}
    </Modal>
  );
};

export default UpdateStockFormModal;
