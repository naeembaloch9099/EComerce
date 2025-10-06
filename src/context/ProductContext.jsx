import React, { createContext, useContext, useState, useCallback } from "react";
import toast from "react-hot-toast";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  const API_URL = "http://localhost:5000";

  // Fetch all products (public endpoint)
  const fetchPublicProducts = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 ProductContext: Fetching public products...");

      const response = await fetch(`${API_URL}/api/products`);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ ProductContext: Public products fetched:", data);
        setProducts(data.data.products || []);
        setLastUpdate(new Date());
        return data.data.products || [];
      } else {
        console.error("❌ ProductContext: Failed to fetch public products");
        return [];
      }
    } catch (error) {
      console.error(
        "❌ ProductContext: Error fetching public products:",
        error
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // Fetch new arrivals
  const fetchNewArrivals = useCallback(async () => {
    try {
      console.log("🔍 ProductContext: Fetching new arrivals...");

      const response = await fetch(`${API_URL}/api/products/new-arrivals/list`);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ ProductContext: New arrivals fetched:", data);
        return data.data.products || [];
      } else {
        console.error("❌ ProductContext: Failed to fetch new arrivals");
        return [];
      }
    } catch (error) {
      console.error("❌ ProductContext: Error fetching new arrivals:", error);
      return [];
    }
  }, [API_URL]);

  // Trigger real-time update notification
  const notifyProductUpdate = useCallback((type, productName) => {
    setLastUpdate(new Date());

    switch (type) {
      case "created":
        toast.success(`🎉 New product "${productName}" is now LIVE!`, {
          duration: 5000,
          icon: "🔥",
        });
        break;
      case "updated":
        toast.success(`🔄 Product "${productName}" has been updated!`, {
          duration: 4000,
          icon: "✨",
        });
        break;
      case "deleted":
        toast.success(`🗑️ Product "${productName}" has been removed!`, {
          duration: 3000,
          icon: "👋",
        });
        break;
      default:
        toast.success("🔄 Products updated!", {
          duration: 2000,
        });
    }
  }, []);

  // Force refresh for all components
  const refreshAllProducts = useCallback(async () => {
    console.log("🔄 ProductContext: Force refreshing all products...");

    // Trigger a custom event that components can listen to
    window.dispatchEvent(
      new CustomEvent("productsUpdated", {
        detail: { timestamp: new Date(), source: "admin" },
      })
    );

    toast.success("🔄 All product displays updated!", {
      duration: 2000,
      icon: "🎯",
    });
  }, []);

  const value = {
    products,
    loading,
    lastUpdate,
    fetchPublicProducts,
    fetchNewArrivals,
    notifyProductUpdate,
    refreshAllProducts,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};
