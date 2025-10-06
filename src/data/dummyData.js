// This file previously contained dummy data - now removed
// All data will come from the backend API

// Empty products array as fallback (components should use API calls instead)
export const products = [];

// Static filter options for frontend use
export const categories = [
  { id: "men", name: "MEN" },
  { id: "women", name: "WOMEN" },
  { id: "kids", name: "KIDS" },
  { id: "accessories", name: "ACCESSORIES" },
  { id: "shoes", name: "SHOES" },
  { id: "electronics", name: "ELECTRONICS" },
  { id: "home", name: "HOME" },
  { id: "sports", name: "SPORTS" },
];

export const colors = [
  { id: "red", name: "Red", hex: "#ef4444" },
  { id: "blue", name: "Blue", hex: "#3b82f6" },
  { id: "black", name: "Black", hex: "#000000" },
  { id: "green", name: "Green", hex: "#22c55e" },
  { id: "yellow", name: "Yellow", hex: "#eab308" },
  { id: "gray", name: "Gray", hex: "#6b7280" },
  { id: "white", name: "White", hex: "#ffffff" },
  { id: "pink", name: "Pink", hex: "#ec4899" },
  { id: "beige", name: "Beige", hex: "#d2b48c" },
  { id: "navy", name: "Navy", hex: "#1e40af" },
  { id: "cream", name: "Cream", hex: "#fffdd0" },
];

export const sizes = [
  { id: "XS", name: "XS" },
  { id: "S", name: "S" },
  { id: "M", name: "M" },
  { id: "L", name: "L" },
  { id: "XL", name: "XL" },
  { id: "XXL", name: "XXL" },
];

export const materials = [
  { id: "cotton", name: "Cotton" },
  { id: "denim", name: "Denim" },
  { id: "wool", name: "Wool" },
  { id: "silk", name: "Silk" },
  { id: "polyester", name: "Polyester" },
  { id: "fleece", name: "Fleece" },
  { id: "chiffon", name: "Chiffon" },
  { id: "linen", name: "Linen" },
  { id: "leather", name: "Leather" },
];

export const brands = [
  { id: "rabbit", name: "Rabbit" },
  { id: "urban-threads", name: "Urban Threads" },
  { id: "modern-fit", name: "Modern Fit" },
  { id: "street-style", name: "Street Style" },
  { id: "beach-breeze", name: "Beach Breeze" },
  { id: "fashionista", name: "Fashionista" },
  { id: "chicstyle", name: "ChicStyle" },
];

// API endpoints for frontend to use
export const API_ENDPOINTS = {
  products: "/api/products",
  auth: "/api/auth",
  users: "/api/users",
  orders: "/api/orders",
  cart: "/api/cart",
  payments: "/api/payments",
  admin: "/api/admin",
};
