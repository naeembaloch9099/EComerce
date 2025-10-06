/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

export const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (product) => {
    setFavorites((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      const newFavorites = [...prev, product];
      toast.success(`${product.name} added to favorites!`);
      return newFavorites;
    });
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => {
      const product = prev.find((item) => item.id === productId);
      if (product) {
        toast.success(`${product.name} removed from favorites!`);
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const toggleFavorite = (product) => {
    const isInFavorites = favorites.find((item) => item.id === product.id);
    if (isInFavorites) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  const getFavoritesCount = () => favorites.length;

  const clearFavorites = () => {
    setFavorites([]);
    toast.success("All favorites cleared!");
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
