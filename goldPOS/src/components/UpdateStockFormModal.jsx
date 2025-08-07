import React, { useState, useEffect } from "react";
import formStyles from "../css/Form.module.css";
import axios from "axios";
import Modal from "react-modal";
import modalStyles from "../css/UpdateOrderFormModal.module.css";

const UpdateStockFormModal = ({
  stockData,
  onUpdateSuccess,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    itemName: "",
    karat: "",
    quantity: "",
    pieces: "",
    waste: "",
    totalWeight: "",
    itemPrice: "",
    makingPerGram: "",
    totalMaking: "",
    description: "",
    status: "",
  });

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

  useEffect(() => {
    if (stockData) {
      setFormData({
        itemName: stockData.itemName || "",
        karat: stockData.karat || "",
        quantity: stockData.quantity || "",
        pieces: stockData.pieces || "",
        waste: stockData.waste || "",
        totalWeight: stockData.totalWeight || "",
        itemPrice: stockData.itemPrice || "",
        makingPerGram: stockData.makingPerGram || "",
        totalMaking: stockData.totalMaking || "",
        description: stockData.description || "",
        status: stockData.status || "Pending",
      });

      setMessage("");
      setValidationErrors({});
      setPasswordError("");
      setShowPasswordPrompt(false); // Reset this state when a new stock is selected
      setVerificationPassword("");
    }
  }, [stockData]);

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

        setCustomCategories(response.data.map((cat) => cat.itemName));
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

    if (validationErrors[name]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

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

  const validateForm = () => {
    const errors = {};
    if (!formData.itemName) errors.itemName = "Item Name is required.";
    if (!formData.karat) errors.karat = "Karat is required.";
    if (
      !formData.quantity ||
      isNaN(formData.quantity) ||
      parseInt(formData.quantity, 10) <= 0
    )
      errors.quantity = "Quantity must be a positive integer.";
    if (
      !formData.pieces ||
      isNaN(formData.pieces) ||
      parseInt(formData.pieces, 10) <= 0
    )
      errors.pieces = "Pieces must be a positive integer.";
    if (
      !formData.itemPrice ||
      isNaN(formData.itemPrice) ||
      formData.itemPrice <= 0
    )
      errors.itemPrice = "Item Price must be a positive number.";
    if (!formData.waste || isNaN(formData.waste) || formData.waste <= 0)
      errors.waste = "Waste must be a positive number.";
    if (
      !formData.totalWeight ||
      isNaN(formData.totalWeight) ||
      formData.totalWeight <= 0
    )
      errors.totalWeight = "Total Weight must be a positive number.";
    if (
      !formData.makingPerGram ||
      isNaN(formData.makingPerGram) ||
      formData.makingPerGram <= 0
    )
      errors.makingPerGram = "Making per Gram must be a positive number.";
    if (
      !formData.totalMaking ||
      isNaN(formData.totalMaking) ||
      formData.totalMaking <= 0
    )
      errors.totalMaking = "Total Making must be a positive number.";
    if (!formData.description || formData.description.length > 200)
      errors.description = "Description should be less than 200 letters.";
    if (!formData.status) errors.status = "Status is required.";

    // Mongoose integer validation for karat, quantity, and pieces
    if (formData.karat && !Number.isInteger(Number(formData.karat)))
      errors.karat = "Karat must be an integer.";
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
    setPasswordError(""); // Clear previous password errors

    if (!verificationPassword) {
      setPasswordError("Password is required for verification.");
      return;
    }

    setIsVerifying(true);

    try {
      const token = localStorage.getItem("token");
      // Assuming a backend endpoint for password verification
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/verify-password`, // This endpoint needs to be implemented on your backend
        { password: verificationPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Password verified, now proceed with stock update
        await updateStock();
        setShowPasswordPrompt(false); // Close password prompt
        setVerificationPassword(""); // Clear password input
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      if (error.response && error.response.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setPasswordError("An error occurred during password verification.");
      }
    } finally {
      // Reset loading state, regardless of success or failure
      setIsVerifying(false);
    }
  };

  const updateStock = async () => {
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
        `${import.meta.env.VITE_API_BASE_URL}/api/stocks/${stockData._id}`,
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
        setMessage("Stock updated successfully!");
        setIsSuccess(true);
        onUpdateSuccess(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      setIsSuccess(false);
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Reset loading state
      setIsUpdating(false);
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
      {!showPasswordPrompt ? (
        // This is the main update form content
        <>
          <h2 className={formStyles.formTitle}>
            Update Stock: {stockData?.tagNumber || ""}
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
                value={stockData?.tagNumber || ""}
                readOnly
              />
            </div>
            <div className={formStyles.inputGroup}>
              <label htmlFor="date">Date Created</label>
              <input
                type="text"
                id="date"
                value={
                  stockData?.createdAt
                    ? new Date(stockData.createdAt).toLocaleDateString()
                    : ""
                }
                readOnly
              />
            </div>

            {/* Editable fields */}
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
                {[...defaultCategories, ...customCategories].map(
                  (item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
                )}
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
                min="0"
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
                min="0"
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

            <div className={formStyles.inputGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={1}
                className={
                  validationErrors.description ? formStyles.inputError : ""
                }
              />
              {validationErrors.description && (
                <span className={formStyles.errorText}>
                  {validationErrors.description}
                </span>
              )}
            </div>
            
          </div>

          <div className={formStyles.buttonRow}>
            <button
              type="button"
              className={formStyles.submitButton}
              onClick={handleUpdateClick}
              disabled={isUpdating} // Disable button while updating
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
        // This is the password prompt content
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
              disabled={isVerifying} // Disable button while verifying
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

export default UpdateStockFormModal;
