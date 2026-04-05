import React, { createContext, useContext, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// 1. Define Contexts
const CartContext = createContext();
const AuthContext = createContext(); // New: For Login state

// 2. Auth Provider (The "Memory" for your Login)
// inside AuthProvider in main.jsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as loading

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // 1. Set global header so this and future calls work
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // 2. Ask the server: "Who owns this token?"
      const { data } = await axios.get('http://localhost:3000/api/v1/users/me');
      
      setUser(data.data); // Store the user in React memory
    } catch (err) {
      console.error("Session expired or invalid");
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false); // Stop showing the loading spinner
    }
  };

  // 3. This is the "Magic" that runs when you click Back or Refresh
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Cart Provider
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

// 4. Custom Hooks
export const useCart = () => useContext(CartContext);
export const useAuth = () => useContext(AuthContext); // New: use this in Profile.jsx

// 5. Render with Nested Providers
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)