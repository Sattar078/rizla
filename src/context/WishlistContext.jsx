import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const GUEST_WISHLIST_KEY = 'rizla_guest_wishlist';

const WishlistContext = createContext(null);

const getGuestWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_WISHLIST_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveGuestWishlist = (ids) => {
  localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(ids));
};

export const WishlistProvider = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [items, setItems] = useState([]);
  const { isAuthenticated } = useAuth();

  const refreshWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const data = await api.wishlist.get();
        setItems(data.items || []);
        setWishlistIds(new Set((data.items || []).map((i) => i.product.id)));
      } catch {
        setItems([]);
        setWishlistIds(new Set());
      }
    } else {
      const guestIds = getGuestWishlist();
      setWishlistIds(new Set(guestIds));
      if (guestIds.length > 0) {
        try {
          const productPromises = guestIds.map((id) => api.products.getById(id));
          const results = await Promise.allSettled(productPromises);
          const products = results
            .filter((r) => r.status === 'fulfilled')
            .map((r, i) => ({ id: guestIds[i], product: r.value.product }));
          setItems(products);
        } catch {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      const isInWishlist = wishlistIds.has(productId);

      if (isAuthenticated) {
        if (isInWishlist) {
          await api.wishlist.remove(productId);
        } else {
          await api.wishlist.add(productId);
        }
        await refreshWishlist();
      } else {
        const guestIds = getGuestWishlist();
        let updated;
        if (isInWishlist) {
          updated = guestIds.filter((id) => id !== productId);
        } else {
          updated = [...guestIds, productId];
        }
        saveGuestWishlist(updated);
        setWishlistIds(new Set(updated));
        await refreshWishlist();
      }

      return !isInWishlist;
    },
    [isAuthenticated, wishlistIds, refreshWishlist]
  );

  const isInWishlist = useCallback((productId) => wishlistIds.has(productId), [wishlistIds]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistIds,
        count: wishlistIds.size,
        toggleWishlist,
        isInWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
