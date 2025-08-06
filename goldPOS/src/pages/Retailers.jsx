import React, { useEffect, useMemo, useState } from "react";
import styles from "../css/InnerDashboard.module.css";
import axios from 'axios';
import StockDetailsModal from "../components/StockDetailsModal.jsx";
import UpdateStockFormModal from "../components/UpdateStockFormModal";

export default function Retailers() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use separate state variables for each modal
  const [selectedStockForDetails, setSelectedStockForDetails] = useState(null);
  const [selectedStockForUpdate, setSelectedStockForUpdate] = useState(null);

  useEffect(()=>{
    const fetchStock = async () => {
      try{
        setLoading(true);
        setError(null)

        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error("Please log in.");
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stocks/getStocks`,{
          headers:{
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        setStocks(response.data.stocks); 
      }catch(err){
        console.error("Error fetching stocks:", err);
        if (err.response) {
          setError(err.response.data.message || `Server responded with status: ${err.response.status}`);
        } else if (err.request) {
          setError("Please check your internet connection.");
        } else {
          setError(err.message);
        }
      }finally {
        setLoading(false);
      }
    }

    fetchStock()
  },[])

  const filters = ["All", "Monthly", "Weekly", "Today"];
  const [currentFilter, setCurrentFilter] = useState("All");

  const handleFilter = (filter) => setCurrentFilter(filter);

  const filteredStocks = useMemo(() => {
    const today = new Date();
    let result = stocks;

    if (currentFilter === "Today") {
      result = stocks.filter((item) => {
        const saleDate = new Date(item.createdAt); 
        return saleDate.toDateString() === today.toDateString();
      });
    } else if (currentFilter === "Weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      result = stocks.filter((item) => {
        const saleDate = new Date(item.createdAt);
        return saleDate >= oneWeekAgo && saleDate <= today;
      });
    } else if (currentFilter === "Monthly") {
      result = stocks.filter((item) => {
        const saleDate = new Date(item.createdAt);
        return (
          saleDate.getMonth() === today.getMonth() &&
          saleDate.getFullYear() === today.getFullYear()
        );
      });
    }

    return result;
  }, [currentFilter, stocks]);

  // Function to open the details modal
  const openDetailsModal = (stock) => {
    setSelectedStockForDetails(stock);
  };

  // Function to open the update form modal
  const openUpdateModal = (stock, e) => {
    // Stop the event from propagating to the parent row
    e.stopPropagation();
    setSelectedStockForUpdate(stock);
  };

  const handleUpdateSuccess = (updatedStock) => {
    setStocks(stocks.map(stock => stock._id === updatedStock._id ? updatedStock : stock));
    // Close the update modal on success
    setSelectedStockForUpdate(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Retailers</h2>
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
          <p className={styles.loadingText}>Loading stocks...</p>
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
                <th>Item Name</th>
                <th>Total Weight</th>
                <th>Item Price</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                    No stocks found
                  </td>
                </tr>
              ) : (
                filteredStocks.map((item) => (
                  <tr key={item.tagNumber} onClick={() => openDetailsModal(item)} style={{ cursor: "pointer" }} >
                    <td>{item.tagNumber}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
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

      {/* Stock Details Modal */}
      <StockDetailsModal
        stock={selectedStockForDetails}
        isOpen={!!selectedStockForDetails}
        onClose={() => setSelectedStockForDetails(null)}
      />

      {/* Update Stock Form Modal */}
      <UpdateStockFormModal 
        stockData={selectedStockForUpdate}
        isOpen={!!selectedStockForUpdate}
        onClose={() => setSelectedStockForUpdate(null)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
