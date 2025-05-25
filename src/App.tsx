import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Customers from './pages/customers/Customer';
import CustomerAdd from './pages/customers/CustomerAdd';
import CustomerEdit from './pages/customers/CustomerEdit';
import Profile from './pages/Profile';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));

  const handleLogin = (newToken: string, newUsername: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  return (
    <Router>
      <NavigationBar
        isLoggedIn={!!token}
        username={username || undefined}
        onLogout={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          setToken(null);
          setUsername(null);
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/add" element={<CustomerAdd />} />
        <Route path="/customers/edit/:id" element={<CustomerEdit />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
