import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Login from './components/Login';
import Home from './pages/Home';
import Customers from './pages/Customers';
import Retailers from './pages/Retailers';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/"  element={<Login/>} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="" element={<Home />} />
          <Route path="customers" element={<Customers />} />
            <Route path="retailers" element={<Retailers />} />
        </Route>
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
