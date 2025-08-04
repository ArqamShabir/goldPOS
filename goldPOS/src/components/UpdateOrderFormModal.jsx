import React, { useState, useEffect } from 'react';
import formStyles from "../css/Form.module.css";
import axios from 'axios';
import Modal from 'react-modal';
import modalStyles from "../css/UpdateOrderFormModal.module.css";

const UpdateOrderFormModal = ({ orderData, onUpdateSuccess, isOpen, onClose }) => {

  const [formData, setFormData] = useState({
    itemName: '',
    customerName: '',
    karat: '',
    quantity: '',
    pieces: '',
    waste: '',
    totalWeight: '',
    itemPrice: '',
    makingPerGram: '',
    totalMaking: '',
  });

  const [customCategories, setCustomCategories] = useState([]);
  const karatOptions = [18, 21, 22, 24];
  const defaultCategories = [
    "Gold Ring",
    "Gold Necklace"
  ];
  // const statusOptions = ['Pending', 'Complete'];

  useEffect(() => {
    if (orderData) {
      setFormData({
        itemName: orderData.itemName,
        customerName: orderData.customerName,
        karat: orderData.karat,
        quantity: orderData.quantity,
        pieces: orderData.pieces,
        waste: orderData.waste,
        totalWeight: orderData.totalWeight,
        itemPrice: orderData.itemPrice,
        makingPerGram: orderData.makingPerGram,
        totalMaking: orderData.totalMaking,
      });
    }
  }, [orderData]);

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

  const updateOrder = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderData._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        alert("Order updated successfully!");
        onUpdateSuccess(response.data);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      }
    }
  };

  if (!orderData) return null;

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className={modalStyles.modalContent}
    overlayClassName={modalStyles.modalOverlay}
    contentLabel="Update Order"
  >
    {/* <div className={formStyles.formContainer}> */}
      <h2 className={formStyles.formTitle}>Update Order: {orderData.tagNumber}</h2>
      <div className={formStyles.inputRow}>
        
        {/* Read-only fields */}
        <div className={formStyles.inputGroup}>
          <label htmlFor="tagNumber">Tag Number</label>
          <input type="text" id="tagNumber" value={orderData.tagNumber} readOnly />
        </div>
        <div className={formStyles.inputGroup}>
          <label htmlFor="date">Date Created</label>
          <input type="text" id="date" value={new Date(orderData.date).toLocaleDateString()} readOnly />
        </div>

        {/* Editable fields */}
        <div className={formStyles.inputGroup}>
          <label htmlFor="customerName">Customer Name</label>
          <input 
            type="text" 
            id="customerName" 
            name="customerName"
            value={formData.customerName} 
            onChange={handleChange} 
          />
        </div>
        
        <div className={formStyles.inputGroup}>
          <label htmlFor="itemName">Item Name</label>
          <select id="itemName" name="itemName" value={formData.itemName} onChange={handleChange}>
            <option value="">Select an Item</option>
            {[...defaultCategories, ...customCategories].map((item, index) => (
              <option key={index} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="karat">Karat</label>
          <select 
            id="karat" 
            name="karat"
            value={formData.karat} 
            onChange={handleChange}
          >
            <option value="">Select Karat</option>
            {karatOptions.map((k, index) => (
              <option key={index} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="quantity">Quantity</label>
          <input 
            type="number" 
            id="quantity" 
            name="quantity"
            min="1" 
            value={formData.quantity} 
            onChange={handleChange} 
          />
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="pieces">Pieces</label>
          <input 
            type="number" 
            id="pieces" 
            name="pieces"
            min="1" 
            value={formData.pieces} 
            onChange={handleChange} 
          />
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="itemPrice">Item Price (PKR)</label>
          <input 
            type="number" 
            id="itemPrice" 
            name="itemPrice"
            min="1" 
            value={formData.itemPrice} 
            onChange={handleChange} 
          />
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="waste">Waste (grams)</label>
          <input 
            type="number" 
            id="waste" 
            name="waste"
            min="0" 
            value={formData.waste} 
            onChange={handleChange} 
          />
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="totalWeight">Total Weight</label>
          <input 
            type="number" 
            id="totalWeight" 
            name="totalWeight"
            min="0" 
            value={formData.totalWeight} 
            onChange={handleChange} 
          />
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="makingPerGram">Making / gram (PKR)</label>
          <input 
            type="number" 
            id="makingPerGram" 
            name="makingPerGram"
            min="0" 
            value={formData.makingPerGram} 
            onChange={handleChange} 
          />
        </div>

        <div className={formStyles.inputGroup}>
          <label htmlFor="totalMaking">Total Making</label>
          <input 
            type="number" 
            id="totalMaking" 
            name="totalMaking"
            min="0" 
            value={formData.totalMaking} 
            onChange={handleChange} 
          />
        </div>

      </div>

      <div className={formStyles.buttonRow}>
        <button type="button" className={formStyles.submitButton} onClick={updateOrder}>Update Order</button>
        <button type="button" className={formStyles.cancelButton} onClick={onClose}>Cancel</button>
      </div>
    {/* </div> */}
  </Modal>
  );
};

export default UpdateOrderFormModal;
