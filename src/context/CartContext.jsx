/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

// Prevent duplicate toasts with a simple debounce
let lastToastTime = 0;
let lastToastMessage = "";

const showToast = (type, message, options = {}) => {
  const now = Date.now();
  if (now - lastToastTime < 100 && lastToastMessage === message) {
    return; // Skip duplicate toast within 100ms
  }

  lastToastTime = now;
  lastToastMessage = message;

  if (type === "success") {
    toast.success(message, options);
  } else if (type === "error") {
    toast.error(message, options);
  } else {
    toast(message, options);
  }
};

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = "M", quantity = 1, color = null) => {
    const itemColor =
      color || (product.colors && product.colors[0]?.name) || "default";

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) =>
          item.id === (product._id || product.id) &&
          item.size === size &&
          item.color === itemColor
      );

      if (existingItem) {
        showToast("success", `Updated ${product.name} quantity in cart!`, {
          duration: 2000,
          position: "top-right",
        });
        return prevItems.map((item) =>
          item.id === (product._id || product.id) &&
          item.size === size &&
          item.color === itemColor
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        showToast("success", `${product.name} added to cart!`, {
          duration: 2000,
          position: "top-right",
        });
        return [
          ...prevItems,
          {
            ...product,
            id: product._id || product.id, // ✅ normalize ID
            productId: product._id || product.id, // ✅ keep for backend
            _id: product._id || product.id, // ✅ ensure _id exists
            size,
            quantity,
            color: itemColor,
            // Ensure we have image data
            image:
              product.image ||
              product.images?.[0]?.url ||
              product.images?.[0] ||
              "/placeholder-image.jpg",
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, size, color = null) => {
    const itemToRemove = cartItems.find(
      (item) =>
        item.id === productId &&
        item.size === size &&
        (color === null || item.color === color)
    );

    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.size === size &&
            (color === null || item.color === color)
          )
      )
    );

    if (itemToRemove) {
      showToast("error", `${itemToRemove.name} removed from cart`, {
        duration: 2000,
        position: "top-right",
      });
    }
  };

  const updateQuantity = (productId, size, newQuantity, color = null) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const item = cartItems.find(
      (item) =>
        item.id === productId &&
        item.size === size &&
        (color === null || item.color === color)
    );

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId &&
        item.size === size &&
        (color === null || item.color === color)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    if (item) {
      showToast("success", `Updated ${item.name} quantity to ${newQuantity}`, {
        duration: 1500,
        position: "top-right",
      });
    }
  };

  const clearCart = () => {
    const itemCount = cartItems.length;
    setCartItems([]);

    if (itemCount > 0) {
      showToast(
        "success",
        `Cart cleared! ${itemCount} item${itemCount > 1 ? "s" : ""} removed`,
        {
          duration: 2000,
          position: "top-right",
        }
      );
    }
  };

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    toggleCart,
    setIsCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
