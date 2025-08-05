import React from "react";
import Modal from "react-modal";
import styles from "../css/OrderDetailsModal.module.css";

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      contentLabel="Order Details"
    >
      <h2 className={styles.modalTitle}>Order Details</h2>

      <div className={styles.modalGrid}>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Tag Number</span>
          <span className={styles.attrValue}>{order.tagNumber}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Item Name</span>
          <span className={styles.attrValue}>{order.itemName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Karat</span>
          <span className={styles.attrValue}>{order.karat}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Quantity</span>
          <span className={styles.attrValue}>{order.quantity}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Pieces</span>
          <span className={styles.attrValue}>{order.pieces}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Waste</span>
          <span className={styles.attrValue}>{order.waste}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Total Weight</span>
          <span className={styles.attrValue}>{order.totalWeight}g</span>
        </div>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Item Price</span>
          <span className={styles.attrValue}>PKR {order.itemPrice}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Making / gram</span>
          <span className={styles.attrValue}>{order.makingPerGram}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.attrLabel}>Total Making</span>
          <span className={styles.attrValue}>{order.totalMaking}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.attrLabel}>Customer Name</span>
          <span className={styles.attrValue}>{order.customerName}</span>
        </div>
        {order.createdAt && (
          <div className={styles.field}>
            <span className={styles.attrLabel}>Created At</span>
            <span className={styles.attrValue}>
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        )}

        {order.updatedAt && (
          <div className={styles.field}>
            <span className={styles.attrLabel}>Updated At</span>
            <span className={styles.attrValue}>
              {new Date(order.updatedAt).toLocaleString()}
            </span>
          </div>
        )}
        
      </div>

      <button onClick={onClose} className={styles.closeButton}>
        Close
      </button>
    </Modal>
  );
};

export default OrderDetailsModal;
