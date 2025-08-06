import React, { useEffect, useMemo, useState } from "react";
import { Mail, CalendarDays, User2 } from "lucide-react";
import styles from "../css/InnerDashboard.module.css";
import axios from 'axios';
import jsPDF from "jspdf"; 
import OrderDetailsModal from "../components/OrderDetailsModal.jsx"; 
import UpdateOrderFormModal from "../components/UpdateOrderFormModal";

export default function Home() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phoneNumber: "",
    username: "",
    createdAt: "",
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [selectedOrderForUpdate, setSelectedOrderForUpdate] = useState(null);

  const [goldRates, setGoldRates] = useState(null);
  const [loadingGoldRate, setLoadingGoldRate] = useState(true);
  const [errorGoldRate, setErrorGoldRate] = useState(null);

  useEffect(() => {
    const fetchGoldRate = async () => {
      try {
        setLoadingGoldRate(true);
        setErrorGoldRate(null);

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/gold-rate-live`);

        if (response.data && response.data.prices) {
          setGoldRates(response.data.prices); 
          console.log("Live gold rate data fetched:", response.data.prices);
        } else {
          throw new Error("Invalid response from gold rate API.");
        }
      } catch (error) {
        console.error("Error fetching live gold rate:", error);
        setErrorGoldRate(error.message || "Could not fetch live gold rate.");
      } finally {
        setLoadingGoldRate(false);
      }
    };

    fetchGoldRate();
    const intervalId = setInterval(fetchGoldRate, 21600000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoadingUser(true);
        setErrorUser(null)

        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error("Please log in.");
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/getUserInfo`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setUserInfo(response.data.user);

      } catch (error) {
        console.error("Error fetching user info:", error);
        setErrorUser(error.response?.data?.message || "An unexpected error occurred.");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        setErrorOrders(null);

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
          setErrorOrders(err.response.data.message || `Server responded with status: ${err.response.status}`);
        } else if (err.request) {
          setErrorOrders("Please check your internet connection.");
        } else {
          setErrorOrders(err.message);
        }
      } finally {
        setLoadingOrders(false);
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
        const orderDate = new Date(item.createdAt); 
        return orderDate.toDateString() === today.toDateString();
      });
    } else if (currentFilter === "Weekly") {
      const week = new Date();
      week.setDate(today.getDate() - 7);
      result = orders.filter((item) => {
        const orderDate = new Date(item.createdAt);
        return orderDate >= week && orderDate <= today;
      });
    } else if (currentFilter === "Monthly") {
      result = orders.filter((item) => {
        const orderDate = new Date(item.createdAt);
        return (
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      });
    }

    return result;
  }, [currentFilter, orders]);

  const openDetailsModal = (order) => {
    setSelectedOrderForDetails(order);
  };

  const openUpdateModal = (order, e) => {
    e.stopPropagation();
    setSelectedOrderForUpdate(order);
  };

  const handleUpdateSuccess = (updatedOrder) => {
    setOrders(orders.map(order => order._id === updatedOrder._id ? updatedOrder : order));
    setSelectedOrderForUpdate(null);
  };

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

return (
  <div className={styles.container}>
    <div className={styles.headerWidgets}>

      {loadingGoldRate ? (
        <div className={`${styles.loadingContainer} ${styles.goldRateTableCard}`}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Fetching live gold rate...</p>
        </div>
      ) : errorGoldRate ? (
        <div className={`${styles.errorContainer} ${styles.goldRateTableCard}`}>
          <p>{errorGoldRate}</p>
        </div>
      ) : (
        <div className={styles.goldRateTableCard}>
          <h2 className={styles.goldRateTitle}>Live Gold Rates</h2>
          <table className={styles.goldRateTable}>
            <thead className={styles.tableHeader}>
              <tr >
                <th>Unit</th>
                <th>24K Price</th>
                <th>22K Price</th>
                <th>21K Price</th>
                <th>18K Price</th>
              </tr>
            </thead>
            <tbody>
              {goldRates && Object.entries(goldRates).map(([unit, prices]) => (
                <tr key={unit}>
                  <td>{unit}</td>
                  <td>PKR {prices['24K'].toLocaleString()}</td>
                  <td>PKR {prices['22K'].toLocaleString()}</td>
                  <td>PKR {prices['21K'].toLocaleString()}</td>
                  <td>PKR {prices['18K'].toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.profileWrapper}>
        {loadingUser ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading user info...</p>
          </div>
        ) : errorUser ? (
          <div className={styles.errorContainer}>
            <p>{errorUser}</p>
          </div>
        ) : (
          <div className={styles.profileCard}>
            <User2 size={48} className={styles.avatarIcon} />
            <h3 className={styles.name}>{userInfo.name}</h3>
            <p className={styles.phone}>+{userInfo.phoneNumber}</p>
            <div className={styles.infoBox}>
              <Mail size={20} className={styles.icon} />
              <div>
                <div className={styles.label}>Email</div>
                <div className={styles.text}>{userInfo.username}</div>
              </div>
            </div>
            <div className={styles.infoBox}>
              <CalendarDays size={20} className={styles.icon} />
              <div>
                <div className={styles.label}>Registered Since</div>
                <div className={styles.text}>{new Date(userInfo.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    <div className={styles.header}>
      <h2 className={styles.title}>Recent Orders</h2>
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

    {loadingOrders ? (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading orders data...</p>
      </div>
    ) : errorOrders ? (
      <div className={styles.errorContainer}>
        <p>{errorOrders}</p>
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
