import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshCart = useCallback(async () => {
    try {
      const data = await api.cart.get();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setItemCount(data.itemCount || 0);
    } catch {
      setItems([]);
      setTotal(0);
      setItemCount(0);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [user, refreshCart]);

  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      setLoading(true);
      try {
        const data = await api.cart.addItem(productId, quantity);
        setItems(data.items || []);
        setTotal(data.total || 0);
        setItemCount(data.itemCount || 0);
        return data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateQuantity = useCallback(async (itemId, quantity) => {
    const data = await api.cart.updateItem(itemId, quantity);
    setItems(data.items || []);
    setTotal(data.total || 0);
    setItemCount(data.itemCount || 0);
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    const data = await api.cart.removeItem(itemId);
    setItems(data.items || []);
    setTotal(data.total || 0);
    setItemCount(data.itemCount || 0);
  }, []);

  const clearCart = useCallback(async () => {
    await api.cart.clear();
    setItems([]);
    setTotal(0);
    setItemCount(0);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
