import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Controls the "Velvet Drawer"

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    setIsOpen(true); // Open drawer automatically on add
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

export const useCart = () => useContext(CartContext);