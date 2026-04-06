import React, { createContext, useContext, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. IMPORT YOUR CENTRAL API TOOL
import api from './api' 

// Define Contexts
const CartContext = createContext();
const AuthContext = createContext(); 

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // 2. UPDATED: Using our custom 'api' instance 
      // The interceptor in api.js automatically attaches the 'Bearer ' token
      const { data } = await api.get('/users/me');
      
      setUser(data.data); 
    } catch (err) {
      console.error("Session expired or invalid:", err.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setIsOpen(true); 
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => item._id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isOpen, setIsOpen, total }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hooks
export const useCart = () => useContext(CartContext);
export const useAuth = () => useContext(AuthContext); 

// Render with Nested Providers
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)