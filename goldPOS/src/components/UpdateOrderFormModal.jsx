import React, { useState, useEffect } from "react";
import formStyles from "../css/Form.module.css";
import axios from "axios";
import Modal from "react-modal";
import modalStyles from "../css/UpdateOrderFormModal.module.css";

const UpdateOrderFormModal = ({
  orderData,
  onUpdateSuccess,
  isOpen,
  onClose,
}) => {
  // State for form data
  const [formData, setFormData] = useState({
    itemName: "",
    customerName: "",
    karat: "",
    quantity: "",
    pieces: "",
    waste: "",
    totalWeight: "",
    itemPrice: "",
    makingPerGram: "",
    totalMaking: "",
    status: "",
  });

  // State for validation errors and general messages
  const [validationErrors, setValidationErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [customCategories, setCustomCategories] = useState([]);
  const karatOptions = [18, 21, 22, 24];
  const defaultCategories = ["Gold Ring", "Gold Necklace"];
  const statusOptions = ["Pending", "Completed"];

  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [verificationPassword, setVerificationPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Populate form data when the modal is opened
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
        status: orderData.status || "Pending",
      });
      // Clear messages and errors when new data is loaded
      setMessage("");
      setValidationErrors({});
      setPasswordError("");
      setShowPasswordPrompt(false);
      setVerificationPassword("");
    }
  }, [orderData]);

  useEffect(() => {
    const weight = parseFloat(formData.totalWeight);
    const makingRate = parseFloat(formData.makingPerGram);

    if (
      !isNaN(weight) &&
      !isNaN(makingRate) &&
      weight >= 0 &&
      makingRate >= 0
    ) {
      setFormData((prevData) => ({
        ...prevData,
        totalMaking: (weight * makingRate).toFixed(2),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        totalMaking: "",
      }));
    }
  }, [formData.totalWeight, formData.makingPerGram]);

  // Fetch custom categories on component mount
  useEffect(() => {
    const fetchCustomCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/categories/custom`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear validation error for this field as the user types
    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.itemName) errors.itemName = "Item Name is required.";
    if (!formData.customerName || formData.customerName.length > 50)
      errors.customerName = "Customer Name should be less than 50 letters.";
    if (!formData.karat) errors.karat = "Karat is required.";
    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity, 10) < 1
    )
      errors.quantity = "Quantity must be a positive integer.";
    if (
      !formData.pieces ||
      isNaN(formData.pieces) ||
      parseInt(formData.pieces, 10) < 1
    )
      errors.pieces = "Pieces must be a positive integer.";
    if (
      !formData.itemPrice ||
      isNaN(formData.itemPrice) ||
      formData.itemPrice < 1
    )
      errors.itemPrice = "Item Price must be a positive number.";
    if (!formData.waste || isNaN(formData.waste) || formData.waste < 1)
      errors.waste = "Waste must be a positive number.";
    if (
      !formData.totalWeight ||
      isNaN(formData.totalWeight) ||
      formData.totalWeight < 1
    )
      errors.totalWeight = "Total Weight must be a positive number.";
    if (
      !formData.makingPerGram ||
      isNaN(formData.makingPerGram) ||
      formData.makingPerGram < 1
    )
      errors.makingPerGram = "Making per Gram must be a positive number.";
    if (
      !formData.totalMaking ||
      isNaN(formData.totalMaking) ||
      formData.totalMaking < 1
    )
      errors.totalMaking = "Total Making must be a positive number.";
    if (!formData.status) errors.status = "Status is required.";

    //if (formData.karat && !Number.isInteger(Number(formData.karat))) errors.karat = "Karat must be an integer.";
    if (formData.quantity && !Number.isInteger(Number(formData.quantity)))
      errors.quantity = "Quantity must be an integer.";
    if (formData.pieces && !Number.isInteger(Number(formData.pieces)))
      errors.pieces = "Pieces must be an integer.";

    const parsedItemPrice = parseFloat(formData.itemPrice);
    const parsedTotalMaking = parseFloat(formData.totalMaking);
    if (
      !isNaN(parsedItemPrice) &&
      !isNaN(parsedTotalMaking) &&
      parsedItemPrice <= parsedTotalMaking
    ) {
      errors.itemPrice = "Item Price must be greater than Total Making.";
    }

    const parsedWaste = parseFloat(formData.waste);
    const parsedTotalWeight = parseFloat(formData.totalWeight);
    if (
      !isNaN(parsedWaste) &&
      !isNaN(parsedTotalWeight) &&
      parsedWaste >= parsedTotalWeight
    ) {
      errors.waste = "Waste must be less than Total Weight.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateClick = () => {
    setMessage("");
    setIsSuccess(false);
    setPasswordError("");

    if (!validateForm()) {
      setMessage("Please correct the errors in the form.");
      setIsSuccess(false);
      return;
    }

    setShowPasswordPrompt(true);
  };

  const handleCancelPasswordPrompt = () => {
    setShowPasswordPrompt(false);
    setVerificationPassword("");
    setPasswordError("");
  };

  const handlePasswordVerify = async () => {
    setPasswordError("");

    if (!verificationPassword) {
      setPasswordError("Password is required for verification.");
      return;
    }

    setIsVerifying(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/verify-password`,
        { password: verificationPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Password verified, now proceed with order update
        await updateOrder();
        setShowPasswordPrompt(false);
        setVerificationPassword("");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      if (error.response && error.response.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setPasswordError("An error occurred during password verification.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const updateOrder = async () => {
    // setMessage('');
    // setIsSuccess(false);

    // if (!validateForm()) {
    //   setMessage("Please correct the errors in the form.");
    //   setIsSuccess(false);
    //   return;
    // }

    setIsUpdating(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderData._id}`,
        {
          ...formData,
          totalMaking: parseFloat(formData.totalMaking),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Order updated successfully!");
        setIsSuccess(true);
        onUpdateSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setIsSuccess(false);
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUpdating(false);
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
      {!showPasswordPrompt ? (
        <>
          <h2 className={formStyles.formTitle}>
            Update Order: {orderData.tagNumber}
          </h2>
          {message && (
            <div
              className={
                isSuccess ? formStyles.successMessage : formStyles.errorMessage
              }
            >
              {message}
            </div>
          )}
          <div className={formStyles.inputRow}>
            {/* Read-only fields */}
            <div className={formStyles.inputGroup}>
              <label htmlFor="tagNumber">Tag Number</label>
              <input
                type="text"
                id="tagNumber"
                value={orderData.tagNumber}
                readOnly
              />
            </div>
            <div className={formStyles.inputGroup}>
              <label htmlFor="date">Date Created</label>
              <input
                type="text"
                id="date"
                value={new Date(orderData.date).toLocaleDateString()}
                readOnly
              />
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
                className={
                  validationErrors.customerName ? formStyles.inputError : ""
                }
              />
              {validationErrors.customerName && (
                <span className={formStyles.errorText}>
                  {validationErrors.customerName}
                </span>
              )}
            </div>

            <div className={formStyles.inputGroup}>
              <label htmlFor="itemName">Item Name</label>
              <select
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                className={
                  validationErrors.itemName ? formStyles.inputError : ""
                }
              >
                <option value="">Select an Item</option>
                {[
                  ...defaultCategories,
                  ...customCategories.map((cat) => cat.itemName),
                ].map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              {validationErrors.itemName && (
                <span className={formStyles.errorText}>
                  {validationErrors.itemName}
                </span>
              )}
            </div>

            <div className={formStyles.inputGroup}>
              <label htmlFor="karat">Karat</label>
              <select
                id="karat"
                name="karat"
                value={formData.karat}
                onChange={handleChange}
                className={validationErrors.karat ? formStyles.inputError : ""}
              >
                <option value="">Select Karat</option>
                {karatOptions.map((k, index) => (
                  <option key={index} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              {validationErrors.karat && (
                <span className={formStyles.errorText}>
                  {validationErrors.karat}
                </span>
              )}
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
                className={
                  validationErrors.quantity ? formStyles.inputError : ""
                }
              />
              {validationErrors.quantity && (
                <span className={formStyles.errorText}>
                  {validationErrors.quantity}
                </span>
              )}
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
                className={validationErrors.pieces ? formStyles.inputError : ""}
              />
              {validationErrors.pieces && (
                <span className={formStyles.errorText}>
                  {validationErrors.pieces}
                </span>
              )}
            </div>

            <div className={formStyles.inputGroup}>
              <label htmlFor="itemPrice">Item Price (PKR)</label>
              <input
                type="number"
                id="itemPrice"
                name="itemPrice"
                min="0"
                value={formData.itemPrice}
                onChange={handleChange}
                className={
                  validationErrors.itemPrice ? formStyles.inputError : ""
                }
              />
              {validationErrors.itemPrice && (
                <span className={formStyles.errorText}>
                  {validationErrors.itemPrice}
                </span>
              )}
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
                className={validationErrors.waste ? formStyles.inputError : ""}
              />
              {validationErrors.waste && (
                <span className={formStyles.errorText}>
                  {validationErrors.waste}
                </span>
              )}
            </div>

            <div className={formStyles.inputGroup}>
              <label htmlFor="totalWeight">Total Weight (grams)</label>
              <input
                type="number"
                id="totalWeight"
                name="totalWeight"
                min="0"
                value={formData.totalWeight}
                onChange={handleChange}
                className={
                  validationErrors.totalWeight ? formStyles.inputError : ""
                }
              />
              {validationErrors.totalWeight && (
                <span className={formStyles.errorText}>
                  {validationErrors.totalWeight}
                </span>
              )}
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
                className={
                  validationErrors.makingPerGram ? formStyles.inputError : ""
                }
              />
              {validationErrors.makingPerGram && (
                <span className={formStyles.errorText}>
                  {validationErrors.makingPerGram}
                </span>
              )}
            </div>

            <div className={formStyles.inputGroup}>
              <label htmlFor="totalMaking">Total Making (PKR)</label>
              <input
                type="number"
                id="totalMaking"
                name="totalMaking"
                min="0"
                value={formData.totalMaking}
                onChange={handleChange}
                readOnly
                className={formStyles.inputGroup.input}
              />
              {validationErrors.totalMaking && (
                <span className={formStyles.errorText}>
                  {validationErrors.totalMaking}
                </span>
              )}
            </div>

            <div className={formStyles.inputGroup}>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={validationErrors.status ? formStyles.inputError : ""}
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {validationErrors.status && (
                <span className={formStyles.errorText}>
                  {validationErrors.status}
                </span>
              )}
            </div>
          </div>

          <div className={formStyles.buttonRow}>
            <button
              type="button"
              className={formStyles.submitButton}
              onClick={handleUpdateClick}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className={formStyles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        // Password prompt content
        <>
          <h2 className={formStyles.formTitle}>Verify Password</h2>
          <div className={formStyles.inputGroup}>
            <label htmlFor="verificationPassword">Enter Password</label>
            <input
              type="password"
              id="verificationPassword"
              value={verificationPassword}
              onChange={(e) => setVerificationPassword(e.target.value)}
              className={passwordError ? formStyles.inputError : ""}
              autoFocus
            />
            {passwordError && (
              <span className={formStyles.errorText}>{passwordError}</span>
            )}
          </div>

          <div className={formStyles.buttonRow}>
            <button
              type="button"
              className={formStyles.submitButton}
              onClick={handlePasswordVerify}
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify & Update"}
            </button>
            <button
              type="button"
              className={formStyles.cancelButton}
              onClick={handleCancelPasswordPrompt}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default UpdateOrderFormModal;
