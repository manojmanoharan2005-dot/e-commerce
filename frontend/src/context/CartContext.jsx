import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { calculateCartTotals, getItemQuantity, getItemUnitPrice, normalizeCartItem } from '../utils/cartUtils';

const CartContext = createContext(null);

const sanitizeCart = (rawCart) => {
  if (!Array.isArray(rawCart)) return [];
  return rawCart
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      // Extract target product ID
      const targetId = item._id || item.id || item.product || item.product?._id;
      if (!targetId || typeof targetId !== 'string') return null;

      const price = getItemUnitPrice(item);
      const quantity = getItemQuantity(item);

      return {
        _id: String(targetId),
        name: String(item.name || item.product?.name || 'Agri Product'),
        price: isNaN(price) ? 0 : price,
        mrp: Number(item.mrp || price),
        imageUrl: String(item.imageUrl || item.product?.imageUrl || ''),
        category: String(item.category || item.product?.category || 'Organic'),
        unit: String(item.unit || item.product?.unit || 'unit'),
        stock: Number(item.stock || item.product?.stock || 99),
        quantity
      };
    })
    .filter(Boolean);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return sanitizeCart(parsed);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (productOrId, qty = 1) => {
    let productObj = productOrId;

    // If ID string was passed, fetch product object from backend
    if (typeof productOrId === 'string') {
      try {
        const { data } = await api.get(`/products/${productOrId}`);
        productObj = data.product;
      } catch (err) {
        console.error('Failed to fetch product for cart:', err);
        return;
      }
    }

    if (!productObj || typeof productObj !== 'object') return;

    const normalized = normalizeCartItem(productObj, qty);
    if (!normalized || !normalized._id) return;

    setCart((prev) => {
      const cleanPrev = sanitizeCart(prev);
      const existingIndex = cleanPrev.findIndex((item) => item._id === normalized._id);

      if (existingIndex >= 0) {
        const updated = [...cleanPrev];
        const currentItem = updated[existingIndex];
        const newQty = Math.min(currentItem.quantity + normalized.quantity, normalized.stock || 99);
        updated[existingIndex] = {
          ...currentItem,
          ...normalized,
          quantity: newQty
        };
        return updated;
      }
      return [...cleanPrev, normalized];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, qty) => {
    const validQty = Math.max(0, Number(qty) || 0);
    if (validQty < 1) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: validQty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => calculateCartTotals(cart).itemsTotal;

  const getCartCount = () => calculateCartTotals(cart).totalQuantity;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
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
