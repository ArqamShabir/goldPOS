import React from "react";
import Modal from "react-modal";
import styles from "../css/OrderDetailsModal.module.css"; // shared styles

const StockDetailsModal = ({ stock, isOpen, onClose }) => {
  if (!stock) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={styles.modalOverlay}
      className={styles.modalContent}
    >
      <h2 className={styles.modalTitle}>Stock Details</h2>

      <div className={styles.modalGrid}>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Tag Number</span>
          <span className={styles.attrValue}>{stock.tagNumber}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Item Name</span>
          <span className={styles.attrValue}>{stock.itemName}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Karat</span>
          <span className={styles.attrValue}>{stock.karat}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Quantity</span>
          <span className={styles.attrValue}>{stock.quantity}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Pieces</span>
          <span className={styles.attrValue}>{stock.pieces}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Waste</span>
          <span className={styles.attrValue}>{stock.waste} g</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Total Weight</span>
          <span className={styles.attrValue}>{stock.totalWeight} g</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Item Price</span>
          <span className={styles.attrValue}>PKR {stock.itemPrice}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Making Per Gram</span>
          <span className={styles.attrValue}>PKR {stock.makingPerGram}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Total Making</span>
          <span className={styles.attrValue}>PKR {stock.totalMaking}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Status</span>
          <span className={styles.attrValue}>{stock.status}</span>
        </div>
        
        <div className={styles.field}>
          <span className={styles.attrLabel}>Date Added</span>
          <span className={styles.attrValue}>
            {stock.createdAt && new Date(stock.createdAt).toLocaleString()}
          </span>
        </div>

        {stock.updatedAt && (
          <div className={styles.field}>
            <span className={styles.attrLabel}>Updated At</span>
            <span className={styles.attrValue}>
              {new Date(stock.updatedAt).toLocaleString()}
            </span>
          </div>
        )}
        
        {/* The description field now spans all columns to prevent overflow */}
        <div className={`${styles.field} ${styles.fullWidthField}`}>
          <span className={styles.attrLabel}>Description</span>
          <span className={styles.attrValue}>{stock.description}</span>
        </div>

      </div>

      <button className={styles.closeButton} onClick={onClose}>
        Close
      </button>
    </Modal>
  );
};

export default StockDetailsModal;
