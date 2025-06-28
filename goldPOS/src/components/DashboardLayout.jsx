import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from '../css/Sidebar.module.css'; 

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
   const navigate = useNavigate(); 

     const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={`${styles.dashboard} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>AURICPOS</div>
        <nav>
          <ul>
            <li>
              <NavLink to="/dashboard"  onClick={handleCloseSidebar} className={({ isActive }) => isActive ? styles.active : ''}>
                🏠 Home
              </NavLink>
            </li>
            <li>
              <NavLink to="record"  onClick={handleCloseSidebar} className={({ isActive }) => isActive ? styles.active : ''}>
                ⚙️ Create Record
              </NavLink>
            </li>
            <li>
              <NavLink to="customers"  onClick={handleCloseSidebar} className={({ isActive }) => isActive ? styles.active : ''}>
                👤 Customers
              </NavLink>
            </li>
            <li>
              <NavLink to="retailers"  onClick={handleCloseSidebar} className={({ isActive }) => isActive ? styles.active : ''}>
                ⚙️ Retailers
              </NavLink>
            </li>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
          </ul>
        </nav>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={handleCloseSidebar}></div>}

      <main className={styles.content}>
        <div className={styles.topbar}>
          <div className={styles.logo2}>AURICPOS</div>
          <button className={styles.menuBtn} onClick={handleToggleSidebar}>☰</button>
        </div>
        <div className={styles.mainContent}>
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
