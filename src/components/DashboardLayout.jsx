import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styles from '../css/Sidebar.module.css'; 

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
              <NavLink to="home" className={({ isActive }) => isActive ? styles.active : ''}>
                🏠 Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/record" className={({ isActive }) => isActive ? styles.active : ''}>
                ⚙️ Create Record
              </NavLink>
            </li>
            <li>
              <NavLink to="customers" className={({ isActive }) => isActive ? styles.active : ''}>
                👤 Customers
              </NavLink>
            </li>
            <li>
              <NavLink to="retailers" className={({ isActive }) => isActive ? styles.active : ''}>
                ⚙️ Retailers
              </NavLink>
            </li>
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
