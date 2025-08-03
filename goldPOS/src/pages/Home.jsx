import React, { useEffect, useMemo, useState } from "react";
import { Mail, CalendarDays, User2 } from "lucide-react";
import styles from "../css/InnerDashboard.module.css";
import axios from 'axios';

export default function Home() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phoneNumber: "",
    username: "",
    createdAt: "",
  });

  // State for orders data and its loading/error status
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [errorOrders, setErrorOrders] = useState(null);

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

  // Use useMemo to filter the fetched orders
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


  return (
    <div className={styles.container}>
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
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((item) => (
                  <tr key={item.tagNumber}>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
