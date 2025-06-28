import { useEffect, useMemo, useState } from "react";
import styles from "../css/InnerDashboard.module.css";
import jsPDF from "jspdf"; 

export default function Customers() {
  const dummySales = [
    {
      id: "01015",
      datetime: "2025-05-20 22:00",
      type: "Rings",
      customer: "Masud Rana",
      status: "Complete",
      amount: 250,
    },
    {
      id: "01016",
      datetime: "2025-05-01 20:30",
      type: "Chains",
      customer: "Masud Rana",
      status: "Pending",
      amount: 180,
    },
    {
      id: "01017",
      datetime: "2025-05-23 15:15",
      type: "Set",
      customer: "Masud Rana",
      status: "Complete",
      amount: 300,
    },
  ];

  const [sales, setSales] = useState(dummySales);
  const [userInfo, setUserInfo] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    registerationDate: "",
  });

  useEffect(() => {
    setUserInfo({
      name: "Ali Ali",
      phoneNumber: "3232322234",
      email: "example@gmail.com",
      registerationDate: "22/6/25",
    });
  }, []);

  const filters = ["All", "Monthly", "Weekly", "Today"];
  const [currentFilter, setCurrentFilter] = useState("All");

  const handleFilter = (filter) => setCurrentFilter(filter);

  const filteredSales = useMemo(() => {
    const today = new Date();
    let result = sales;

    if (currentFilter === "Today") {
      result = sales.filter((item) => {
        const saleDate = new Date(item.datetime);
        return saleDate.toDateString() === today.toDateString();
      });
    } else if (currentFilter === "Weekly") {
      const week = new Date();
      week.setDate(today.getDate() - 7);
      result = sales.filter((item) => {
        const saleDate = new Date(item.datetime);
        return saleDate >= week && saleDate <= today;
      });
    } else if (currentFilter === "Monthly") {
      result = sales.filter((item) => {
        const saleDate = new Date(item.datetime);
        return (
          saleDate.getMonth() === today.getMonth() &&
          saleDate.getFullYear() === today.getFullYear()
        );
      });
    }

    return result;
  }, [currentFilter, sales]);

  const printTag = (item) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [32, 32],
    });

    doc.setFontSize(8);
    doc.text(`Type: ${item.type}`, 3, 8);
    doc.text(`ID: ${item.id}`, 3, 13);
    doc.text(`Amount: $${item.amount}`, 3, 18);
    doc.text(`Status: ${item.status}`, 3, 23);

    doc.save(`tag-${item.id}.pdf`);
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

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date/Time</th>
              <th>Type</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Print Tag</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                  No sales found
                </td>
              </tr>
            ) : (
              filteredSales.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.datetime}</td>
                  <td>{item.type}</td>
                  <td>{item.customer}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        styles[item.status.toLowerCase()]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>${item.amount}</td>
                  <td>
                    <button onClick={() => printTag(item)} style={{ padding: "4px 8px" }}>
                      🖨️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
