import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { categories, colors, sizes, materials } from "../../data/dummyData";
import {
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiStar,
  FiHeart,
  FiShoppingCart,
  FiPlus,
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import FilterSidebar from "../../Components/Products/FilterSidebar";
import NewArrival from "../../Components/Products/NewArrival";

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.75rem;
  opacity: 0;
  transform: translateY(10px);

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
  }
`;

const ProductCardContainer = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

    ${AddToCartButton} {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProductImage = styled.div`
  position: relative;
  overflow: hidden;
  height: 12rem;
  background: #f8fafc;
`;

const ProductImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProductCardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const BestsellerBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StockBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${(props) =>
    props.$stock === 0
      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      : props.$stock <= 5
      ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      : "linear-gradient(135deg, #10b981 0%, #059669 100%)"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;

  ${ProductCardContainer}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  line-height: 1.4;
`;

const ProductBrand = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const Price = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: #1f2937;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ColorOptions = styled.div`
  margin-bottom: 1rem;
`;

const SizeOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ProductSizeButton = styled.button`
  font-size: 0.75rem;
  background: ${(props) => (props.$isSelected ? "#3b82f6" : "#f3f4f6")};
  color: ${(props) => (props.$isSelected ? "white" : "#374151")};
  padding: 0.375rem 0.75rem;
  border: 2px solid
    ${(props) => (props.$isSelected ? "#3b82f6" : "transparent")};
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$isSelected ? "#2563eb" : "#e5e7eb")};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #f3f4f6;
    color: #9ca3af;
    border-color: transparent;
  }
`;

const StockInfo = styled.div`
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: ${(props) =>
    props.$stock === 0 ? "#ef4444" : props.$stock <= 5 ? "#f59e0b" : "#10b981"};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${(props) =>
      props.$stock === 0
        ? "#ef4444"
        : props.$stock <= 5
        ? "#f59e0b"
        : "#10b981"};
  }
`;

// Filter Styled Components
const FilterContainer = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  padding: 2rem;
  position: sticky;
  top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px) rotateX(2deg);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid transparent;
  background: linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb);
  background-size: 200% 2px;
  background-repeat: no-repeat;
  background-position: 0 100%;
  animation: shimmer 2s ease-in-out infinite;

  @keyframes shimmer {
    0% {
      background-position: -200% 100%;
    }
    100% {
      background-position: 200% 100%;
    }
  }
`;

const FilterTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937 0%, #4f46e5 50%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ClearButton = styled.button`
  font-size: 0.875rem;
  font-weight: 600;
  color: #3b82f6;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(147, 51, 234, 0.1) 100%
  );
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    color: #1d4ed8;
    transform: translateY(-1px) scale(1.05);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

    &::before {
      left: 100%;
    }
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const FilterSectionTitle = styled.h3`
  font-weight: 700;
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 1px;
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ColorButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 3px solid
    ${(props) => (props.$isSelected ? "#1f2937" : "rgba(255, 255, 255, 0.8)")};
  background-color: ${(props) => props.$color};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  &:hover {
    transform: translateY(-2px) scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${(props) => (props.$isSelected ? "60%" : "0")};
    height: ${(props) => (props.$isSelected ? "60%" : "0")};
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
  }
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SizeButton = styled.button`
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 2px solid ${(props) => (props.$isSelected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 0.5rem;
  background: ${(props) =>
    props.$isSelected ? "rgba(59, 130, 246, 0.1)" : "white"};
  color: ${(props) => (props.$isSelected ? "#1d4ed8" : "#374151")};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: ${(props) => (props.$isSelected ? "0" : "-100%")};
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(59, 130, 246, 0.1),
      rgba(147, 51, 234, 0.1)
    );
    transition: left 0.3s ease;
  }

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);

    &::before {
      left: 0;
    }
  }
`;

const PriceRangeContainer = styled.div`
  margin-top: 1rem;
`;

const PriceSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    #e5e7eb 0%,
    #3b82f6 ${(props) => props.value / 3}%,
    #e5e7eb ${(props) => props.value / 3}%
  );
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1200px;
    margin: 0 auto;
  }
`;

const Home = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  // const [showFilters, setShowFilters] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    priceMin: "",
    priceMax: "",
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    rating: 0,
  });

  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleAddToCart = (
    product,
    selectedSize = "M",
    selectedColor = null
  ) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Check if product uses new array-based structure (colors and sizes arrays)
    const hasColorSizeStructure =
      product.colors &&
      Array.isArray(product.colors) &&
      product.sizes &&
      Array.isArray(product.sizes);

    if (hasColorSizeStructure) {
      const color =
        selectedColor ||
        (product.colors && product.colors[0]?.name) ||
        "default";

      // Find the color object and check its stock
      const colorObj = product.colors.find((c) => c.name === color);
      if (!colorObj || colorObj.stock === 0) {
        toast.error(`0 items available for ${color} color`);
        return;
      }

      // Find the size object and check its stock
      const sizeObj = product.sizes.find((s) => s.size === selectedSize);
      if (!sizeObj || sizeObj.stock === 0) {
        toast.error(`0 items available for size ${selectedSize}`);
        return;
      }

      // Check if we have enough stock (minimum of color and size stock)
      const availableStock = Math.min(colorObj.stock, sizeObj.stock);
      if (availableStock === 0) {
        toast.error(
          `0 items available for ${color} color in size ${selectedSize}`
        );
        return;
      }

      // Toast notification is now handled in CartContext
      addToCart(product, selectedSize, 1, color);
    } else if (
      product.stock &&
      typeof product.stock === "object" &&
      product.colors
    ) {
      // Legacy nested stock structure
      const color =
        selectedColor ||
        (product.colors && product.colors[0]?.name) ||
        "default";
      const stockCount =
        (product.stock[color] && product.stock[color][selectedSize]) || 0;

      if (stockCount === 0) {
        toast.error(
          `0 items available for ${color} color in size ${selectedSize}`
        );
        return;
      }

      // Toast notification is now handled in CartContext
      addToCart(product, selectedSize, 1, color);
    } else {
      // Simple structure fallback
      if (product.totalStock === 0) {
        toast.error("This item is out of stock");
        return;
      }

      // Toast notification is now handled in CartContext
      addToCart(product, selectedSize, 1);
    }
  };

  const handleFavoriteToggle = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }
    toggleFavorite(product);
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        console.log(
          "🔄 Home: Fetching products from:",
          `${API_URL}/api/products`
        );
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Home: Fetched products:", data);
          console.log(
            "📦 Home: Number of products:",
            data.data?.products?.length || 0
          );
          setProducts(data.data.products || []);
          setFilteredProducts(data.data.products || []);
        } else {
          console.error(
            "❌ Home: Failed to fetch products, status:",
            response.status
          );
          toast.error("Failed to load products");
        }
      } catch (error) {
        console.error("❌ Home: Error fetching products:", error);
        toast.error("Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Listen for real-time product updates (including deletions)
    const handleProductUpdate = (event) => {
      console.log("🔄 Home: Received product update event:", event.detail);
      // Refresh products when admin makes changes (including deletions)
      setTimeout(() => {
        fetchProducts();
      }, 300);
    };

    window.addEventListener("productsUpdated", handleProductUpdate);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("productsUpdated", handleProductUpdate);
    };
  }, []);

  // Filter products based on selected filters
  useEffect(() => {
    console.log("🔍 Home: Starting product filtering...");
    console.log("📊 Home: Total products:", products.length);
    console.log("🏷️ Home: Selected category:", selectedCategory);
    console.log("🎨 Home: Selected colors:", selectedColors);
    console.log("📏 Home: Selected sizes:", selectedSizes);
    console.log("💰 Home: Price range:", priceRange);

    let filtered = products;

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category === selectedCategory ||
          product.subcategory === selectedCategory
      );
      console.log("📋 Home: After category filter:", filtered.length);
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(
        (product) => product.color && selectedColors.includes(product.color)
      );
      console.log("🎨 Home: After color filter:", filtered.length);
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.size &&
          Array.isArray(product.size) &&
          product.size.some((size) => selectedSizes.includes(size))
      );
      console.log("📏 Home: After size filter:", filtered.length);
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.material && selectedMaterials.includes(product.material)
      );
      console.log("🏗️ Home: After material filter:", filtered.length);
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product.brand &&
          selectedBrands.some((brand) =>
            product.brand.toLowerCase().includes(brand.toLowerCase())
          )
      );
      console.log("🏢 Home: After brand filter:", filtered.length);
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );
    console.log("💰 Home: After price filter:", filtered.length);

    // Bestseller filter
    if (showBestsellers) {
      filtered = filtered.filter((product) => product.bestseller);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    console.log("✅ Home: Final filtered products:", filtered.length);
    setFilteredProducts(filtered);
  }, [
    products,
    selectedCategory,
    selectedColors,
    selectedSizes,
    selectedMaterials,
    selectedBrands,
    priceRange,
    showBestsellers,
    sortBy,
  ]);

  // Handle route-based category filtering
  useEffect(() => {
    const path = location.pathname;
    switch (path) {
      case "/men":
        setSelectedCategory("men");
        break;
      case "/women":
        setSelectedCategory("women");
        break;
      case "/topwear":
        setSelectedCategory("topwear");
        break;
      case "/bottomwear":
        setSelectedCategory("bottomwear");
        break;
      case "/collection":
        setSelectedCategory("");
        break;
      default:
        // For home page, show all products
        if (path === "/") {
          setSelectedCategory("");
        }
        break;
    }
  }, [location.pathname]);

  const toggleColorFilter = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSizeFilter = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleMaterialFilter = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory("");
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 50000 });
    setShowBestsellers(false);
    setActiveFilters({
      priceMin: "",
      priceMax: "",
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      rating: 0,
    });
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);

    // Apply filters to local state
    if (newFilters.priceMin) {
      setPriceRange((prev) => ({
        ...prev,
        min: parseFloat(newFilters.priceMin),
      }));
    }

    if (newFilters.priceMax) {
      setPriceRange((prev) => ({
        ...prev,
        max: parseFloat(newFilters.priceMax),
      }));
    }

    if (newFilters.categories && newFilters.categories.length > 0) {
      setSelectedCategory(newFilters.categories[0] || "");
    }

    if (newFilters.colors && newFilters.colors.length > 0) {
      setSelectedColors(newFilters.colors);
    }

    if (newFilters.sizes && newFilters.sizes.length > 0) {
      setSelectedSizes(newFilters.sizes);
    }

    if (newFilters.brands && newFilters.brands.length > 0) {
      setSelectedBrands(newFilters.brands);
    }
  };

  const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    // Check if product uses new structure with colors
    const hasColors = product.colors && product.colors.length > 0;
    const availableSizes = hasColors
      ? product.sizes?.map((s) => s.size) || []
      : product.size || [];

    const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "M");
    const [selectedColor, setSelectedColor] = useState(
      hasColors ? product.colors[0]?.name : null
    );

    const getStockStatus = (product, color = null, size = null) => {
      if (hasColors && color && size) {
        // Find the color and size objects in the real product structure
        const colorObj = product.colors?.find((c) => c.name === color);
        const sizeObj = product.sizes?.find((s) => s.size === size);

        const colorStock = colorObj?.stock || 0;
        const sizeStock = sizeObj?.stock || 0;
        const minStock = Math.min(colorStock, sizeStock);

        if (minStock === 0) return "Out of Stock";
        if (minStock <= 5) return `Only ${minStock} left`;
        return "In Stock";
      } else {
        // Use totalStock for products without color/size variations
        const totalStock = product.totalStock || 0;
        if (totalStock === 0) return "Out of Stock";
        if (totalStock <= 5) return `Only ${totalStock} left`;
        return "In Stock";
      }
    };

    const isAvailable = (color, size) => {
      if (!hasColors) return true;

      // Find the color object in the products colors array
      const colorObj = product.colors?.find((c) => c.name === color);
      if (!colorObj || !colorObj.stock || colorObj.stock <= 0) return false;

      // Find the size object in the products sizes array
      const sizeObj = product.sizes?.find((s) => s.size === size);
      if (!sizeObj || !sizeObj.stock || sizeObj.stock <= 0) return false;

      return true;
    };

    const getAvailableSizesForColor = (color) => {
      if (!hasColors) return availableSizes;
      return availableSizes.filter((size) => isAvailable(color, size));
    };

    const handleColorChange = (newColor) => {
      setSelectedColor(newColor);
      const availableSizesForColor = getAvailableSizesForColor(newColor);
      if (
        availableSizesForColor.length > 0 &&
        !availableSizesForColor.includes(selectedSize)
      ) {
        setSelectedSize(availableSizesForColor[0]);
      }
    };

    const handleCardClick = (e) => {
      // Don't navigate if clicking on buttons or interactive elements
      if (e.target.closest("button") || e.target.closest('[role="button"]')) {
        return;
      }
      navigate(`/product/${product.id}`);
    };

    return (
      <ProductCardContainer
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        <ProductImage>
          <ProductImg
            src={product.images?.[0]?.url || product.image}
            alt={product.images?.[0]?.alt || product.name}
          />
          {product.bestseller && <BestsellerBadge>Bestseller</BestsellerBadge>}
          <StockBadge
            $stock={
              hasColors
                ? isAvailable(selectedColor, selectedSize)
                  ? 1
                  : 0
                : product.totalStock > 0
                ? 1
                : 0
            }
          >
            {getStockStatus(product, selectedColor, selectedSize)}
          </StockBadge>
          <ActionButtons>
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteToggle(product);
              }}
            >
              <FiHeart
                size={16}
                fill={isFavorite(product.id) ? "#ef4444" : "none"}
                color={isFavorite(product.id) ? "#ef4444" : "#374151"}
              />
            </ActionButton>
          </ActionButtons>
        </ProductImage>
        <ProductInfo>
          <ProductName>{product.name}</ProductName>
          <ProductBrand>{product.brand}</ProductBrand>
          <ProductPrice>
            <Price>${product.price}</Price>
            <Rating>
              <FiStar className="text-yellow-400 fill-current" size={14} />
              <RatingText>{product.averageRating || 4.5}</RatingText>
            </Rating>
          </ProductPrice>

          <StockInfo
            $stock={
              hasColors
                ? isAvailable(selectedColor, selectedSize)
                  ? 1
                  : 0
                : product.totalStock > 0
                ? 1
                : 0
            }
          >
            {getStockStatus(product, selectedColor, selectedSize)}
          </StockInfo>

          {/* Color Selection */}
          {hasColors && (
            <ColorOptions>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#374151",
                }}
              >
                Color:
              </div>
              {product.colors.map((color) => (
                <ColorButton
                  key={color.name}
                  color={color.code}
                  $isSelected={selectedColor === color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleColorChange(color.name);
                  }}
                  title={color.name}
                />
              ))}
            </ColorOptions>
          )}

          <SizeOptions>
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
                color: "#374151",
              }}
            >
              Size:
            </div>
            {getAvailableSizesForColor(selectedColor).map((size) => (
              <ProductSizeButton
                key={size}
                $isSelected={selectedSize === size}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                disabled={!isAvailable(selectedColor, size)}
              >
                {size}
              </ProductSizeButton>
            ))}
          </SizeOptions>

          <AddToCartButton
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product, selectedSize, selectedColor);
            }}
            disabled={
              hasColors
                ? !isAvailable(selectedColor, selectedSize)
                : product.stock === 0
            }
            style={{
              opacity: hasColors
                ? !isAvailable(selectedColor, selectedSize)
                  ? 0.5
                  : 1
                : product.stock === 0
                ? 0.5
                : 1,
              cursor: hasColors
                ? !isAvailable(selectedColor, selectedSize)
                  ? "not-allowed"
                  : "pointer"
                : product.stock === 0
                ? "not-allowed"
                : "pointer",
            }}
          >
            <FiPlus size={16} />
            {hasColors
              ? !isAvailable(selectedColor, selectedSize)
                ? "Out of Stock"
                : "Add to Cart"
              : product.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </AddToCartButton>
        </ProductInfo>
      </ProductCardContainer>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Fashion That Speaks
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover the latest trends and timeless classics
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>
      </div>

      {/* New Arrivals Slider */}
      <NewArrival />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - HIDDEN */}
          <div className="lg:w-1/4 hidden lg:block" style={{ display: "none" }}>
            <FilterContainer>
              <FilterHeader>
                <FilterTitle>Filters</FilterTitle>
                <ClearButton onClick={clearAllFilters}>Clear All</ClearButton>
              </FilterHeader>

              {/* Categories */}
              <FilterSection>
                <FilterSectionTitle>Categories</FilterSectionTitle>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                        {category.name} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Colors */}
              <FilterSection>
                <FilterSectionTitle>Colors</FilterSectionTitle>
                <ColorGrid>
                  {colors.map((color) => (
                    <ColorButton
                      key={color.id}
                      $color={color.hex}
                      $isSelected={selectedColors.includes(color.id)}
                      onClick={() => toggleColorFilter(color.id)}
                      title={color.name}
                    />
                  ))}
                </ColorGrid>
              </FilterSection>

              {/* Sizes */}
              <FilterSection>
                <FilterSectionTitle>Sizes</FilterSectionTitle>
                <SizeGrid>
                  {sizes.map((size) => (
                    <SizeButton
                      key={size.id}
                      $isSelected={selectedSizes.includes(size.id)}
                      onClick={() => toggleSizeFilter(size.id)}
                    >
                      {size.name}
                    </SizeButton>
                  ))}
                </SizeGrid>
              </FilterSection>

              {/* Materials */}
              <FilterSection>
                <FilterSectionTitle>Materials</FilterSectionTitle>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <label
                      key={material.id}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(material.id)}
                        onChange={() => toggleMaterialFilter(material.id)}
                        className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                        {material.name}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection>
                <FilterSectionTitle>Price Range</FilterSectionTitle>
                <PriceRangeContainer>
                  <PriceSlider
                    type="range"
                    min="0"
                    max="300"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: parseInt(e.target.value),
                      }))
                    }
                  />
                  <PriceDisplay>
                    <span>$0</span>
                    <span>${priceRange.max}</span>
                  </PriceDisplay>
                </PriceRangeContainer>
              </FilterSection>

              {/* Bestsellers */}
              <FilterSection>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showBestsellers}
                    onChange={(e) => setShowBestsellers(e.target.checked)}
                    className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    Bestsellers Only
                  </span>
                </label>
              </FilterSection>
            </FilterContainer>
          </div>

          {/* Products Section - Full Width */}
          <div className="w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  All Products
                </h2>
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Filter Toggle Button */}
                <button
                  onClick={() => setIsFilterSidebarOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <FiFilter size={16} />
                  Advanced Filters
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* View Mode */}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory ||
              selectedColors.length > 0 ||
              selectedSizes.length > 0 ||
              selectedMaterials.length > 0 ||
              showBestsellers) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {categories.find((c) => c.id === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory("")}>
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                  {selectedColors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {colors.find((c) => c.id === color)?.name}
                      <button onClick={() => toggleColorFilter(color)}>
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                  {selectedSizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      Size {size}
                      <button onClick={() => toggleSizeFilter(size)}>
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                  {selectedMaterials.map((material) => (
                    <span
                      key={material}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {materials.find((m) => m.id === material)?.name}
                      <button onClick={() => toggleMaterialFilter(material)}>
                        <FiX size={14} />
                      </button>
                    </span>
                  ))}
                  {showBestsellers && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Bestsellers
                      <button onClick={() => setShowBestsellers(false)}>
                        <FiX size={14} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {viewMode === "grid" ? (
              <ProductsGrid>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductsGrid>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-4">
                  No products found matching your filters
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FilterSidebar Component */}
      <FilterSidebar
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={activeFilters}
        onFilterChange={handleFilterChange}
        productCounts={{
          clothing: 245,
          shoes: 187,
          accessories: 156,
          bags: 89,
          jewelry: 67,
        }}
      />
    </div>
  );
};

export default Home;
