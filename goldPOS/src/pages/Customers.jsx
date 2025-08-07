import { useEffect, useMemo, useState } from "react";
import styles from "../css/InnerDashboard.module.css";
import jsPDF from "jspdf"; 
import axios from 'axios';
import OrderDetailsModal from "../components/OrderDetailsModal.jsx"; 
import UpdateOrderFormModal from "../components/UpdateOrderFormModal";

export default function Customers() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use separate state variables for each modal
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Please log in.");
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/getOrders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        if (err.response) {
          setError(err.response.data.message || `Server responded with status: ${err.response.status}`);
        } else if (err.request) {
          setError("Please check your internet connection.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); 

  const filters = ["All", "Monthly", "Weekly", "Today"];
  const [currentFilter, setCurrentFilter] = useState("All");

  const handleFilter = (filter) => setCurrentFilter(filter);

  const filteredOrders = useMemo(() => {
    const today = new Date();
    let result = orders;

    if (currentFilter === "Today") {
      result = orders.filter((item) => {
        const saleDate = new Date(item.createdAt); 
        return saleDate.toDateString() === today.toDateString();
      });
    } else if (currentFilter === "Weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      result = orders.filter((item) => {
        const saleDate = new Date(item.createdAt);
        return saleDate >= oneWeekAgo && saleDate <= today;
      });
    } else if (currentFilter === "Monthly") {
      result = orders.filter((item) => {
        const saleDate = new Date(item.createdAt);
        return (
          saleDate.getMonth() === today.getMonth() &&
          saleDate.getFullYear() === today.getFullYear()
        );
      });
    }

    return result;
  }, [currentFilter, orders]);

  const printTag = (item) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [40, 40],
    });

    doc.setFontSize(8);
    doc.text(`Item: ${item.itemName}`, 3, 8);
    doc.text(`Tag #: ${item.tagNumber}`, 3, 13);
    doc.text(`Customer: ${item.customerName}`, 3, 18);
    doc.text(`Weight: ${item.totalWeight}g`, 3, 23);
    doc.text(`Price: PKR ${item.itemPrice}`, 3, 28);
    doc.text(`Status: ${item.status}`, 3, 33); 

    doc.save(`tag-${item.tagNumber}.pdf`);
  };

  // Function to open the details modal
  const openDetailsModal = (order) => {
    setSelectedOrderForDetails(order);
  };

  // Function to open the update form modal
  const openUpdateModal = (order, e) => {
    // Stop the event from propagating to the parent row
    e.stopPropagation();
    setSelectedOrderForUpdate(order);
  };

  const handleUpdateSuccess = (updatedOrder) => {
    setOrders(orders.map(order => order._id === updatedOrder._id ? updatedOrder : order));
    // Close the update modal on success
    setSelectedOrderForUpdate(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Customers</h2>
        <div className={styles.filters}>
          {filters.map((item) => (
            <button
              key={item}
              className={`${styles.filterButton} ${
                currentFilter === item ? styles.active : ""
              }`}
              onClick={() => handleFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading orders...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tag Number</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Item Name</th>
                <th>Total Weight</th>
                <th>Item Price</th>
                <th>Status</th>
                <th>Print Tag</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "1rem" }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((item) => (
                  <tr key={item.tagNumber} onClick={() => openDetailsModal(item)} style={{ cursor: "pointer" }} >
                    <td>{item.tagNumber}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>{item.customerName}</td>
                    <td>{item.itemName}</td>
                    <td>{item.totalWeight}g</td>
                    <td>PKR {item.itemPrice}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[item.status.toLowerCase()]
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={(e) => { e.stopPropagation(); printTag(item); }} style={{ padding: "4px 8px" }}>
                        🖨️
                      </button>
                    </td>
                    <td>
                      <button onClick={(e) => openUpdateModal(item, e)} style={{ padding: "4px 8px" }}>
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrderForDetails}
        isOpen={!!selectedOrderForDetails}
        onClose={() => setSelectedOrderForDetails(null)}
      />

      {/* Update Order Form Modal */}
      <UpdateOrderFormModal 
        orderData={selectedOrderForUpdate}
        isOpen={!!selectedOrderForUpdate}
        onClose={() => setSelectedOrderForUpdate(null)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}