import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiX,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiTag,
  FiStar,
  FiDroplet,
  FiBox,
  FiRefreshCw,
} from "react-icons/fi";

// Responsive Icon Component
const ResponsiveIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    /* Mobile Portrait */
    @media (max-width: 480px) {
      width: 18px;
      height: 18px;
    }

    /* Mobile Landscape */
    @media (min-width: 481px) and (max-width: 768px) {
      width: 20px;
      height: 20px;
    }

    /* Tablet and up */
    @media (min-width: 769px) {
      width: ${(props) => props.$size || 20}px;
      height: ${(props) => props.$size || 20}px;
    }
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(4px);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;

  /* Only show backdrop on mobile and tablet */
  @media (min-width: 1025px) {
    display: none;
  }
`;

const FilterContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 400px;
  background: white;
  z-index: 1001;
  overflow-y: auto;
  animation: ${(props) => (props.$isOpen ? slideIn : slideOut)} 0.4s ease-out;
  animation-fill-mode: both;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);

  /* Improve touch scrolling on mobile */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;

  /* Mobile Portrait (320px - 480px) */
  @media (max-width: 480px) {
    width: 100vw;
    max-width: 320px;
  }

  /* Mobile Landscape (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    width: 350px;
  }

  /* Tablet Portrait (769px - 1024px) */
  @media (min-width: 769px) and (max-width: 1024px) {
    width: 380px;
  }

  /* Desktop (1025px+) */
  @media (min-width: 1025px) {
    width: 400px;
  }

  /* Extra Large Screens (1440px+) */
  @media (min-width: 1440px) {
    width: 420px;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #2563eb 0%, #db2777 100%);
  }
`;

const FilterHeader = styled.div`
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    padding: 1.25rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.5rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    padding: 2rem;
  }
`;

const FilterTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    font-size: 1.25rem;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 1.375rem;
    gap: 0.625rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    font-size: 1.5rem;
    gap: 0.75rem;
  }
`;

const FilterSubtitle = styled.p`
  opacity: 0.9;
  font-size: 0.875rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    font-size: 0.75rem;
    display: none; /* Hide subtitle on very small screens to save space */
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.8125rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    font-size: 0.875rem;
    display: block;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  /* Mobile Portrait */
  @media (max-width: 480px) {
    top: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    top: 1.25rem;
    right: 1.25rem;
    width: 38px;
    height: 38px;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    top: 1.5rem;
    right: 1.5rem;
    width: 40px;
    height: 40px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const FilterContent = styled.div`
  padding: 2rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    padding: 1rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.5rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    padding: 2rem;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 2rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.75rem 0;
  margin-bottom: 1rem;
  user-select: none;
  transition: all 0.3s ease;

  /* Mobile Portrait - Larger touch targets */
  @media (max-width: 480px) {
    padding: 1rem 0;
    min-height: 44px; /* Minimum touch target size */
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 0.875rem 0;
    min-height: 40px;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    padding: 0.75rem 0;
  }

  &:hover {
    color: #3b82f6;
  }

  /* Add tap highlight for mobile */
  @media (max-width: 768px) {
    -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    font-size: 1rem;
    gap: 0.375rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 1.0625rem;
    gap: 0.4375rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    font-size: 1.125rem;
    gap: 0.5rem;
  }
`;

const SectionContent = styled.div`
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: ${(props) => (props.$isOpen ? "500px" : "0")};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
`;

const PriceRange = styled.div`
  margin-bottom: 1rem;
`;

const PriceInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 0.625rem;
    margin-bottom: 0.875rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const PriceInput = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.8125rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 0.625rem;
    font-size: 0.8438rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PriceSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  appearance: none;
  margin: 1rem 0;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    gap: 0.5rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 0.625rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    gap: 0.75rem;
  }
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0.375rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 0.625rem;
    padding: 0.4375rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    gap: 0.75rem;
    padding: 0.5rem;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #3b82f6;
  cursor: pointer;

  /* Mobile Portrait - Larger touch targets */
  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    min-width: 44px; /* Minimum touch target size */
    min-height: 44px;
    margin: -13px; /* Center the actual checkbox */
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    width: 19px;
    height: 19px;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    width: 18px;
    height: 18px;
  }
`;

const CheckboxLabel = styled.span`
  font-size: 0.875rem;
  color: #374151;
  flex: 1;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.8438rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    font-size: 0.875rem;
  }
`;

const CheckboxCount = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    font-size: 0.6875rem;
    padding: 0.1875rem 0.375rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.7188rem;
    padding: 0.2188rem 0.4375rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 0.625rem;
  }

  /* Tablet */
  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem;
  }

  /* Desktop and up */
  @media (min-width: 1025px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem;
  }
`;

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${(props) => (props.$isSelected ? "#3b82f6" : "#e5e7eb")};
  background: ${(props) => props.$color};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    border-width: 2px;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-width: 2.5px;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }

  &:hover {
    transform: scale(1.1);
    border-color: #3b82f6;
  }

  ${(props) =>
    props.$isSelected &&
    `
    &::after {
      content: "✓";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }

    /* Mobile Portrait */
    @media (max-width: 480px) {
      &::after {
        font-size: 0.75rem;
      }
    }

    /* Mobile Landscape */
    @media (min-width: 481px) and (max-width: 768px) {
      &::after {
        font-size: 0.875rem;
      }
    }

    /* Tablet and up */
    @media (min-width: 769px) {
      &::after {
        font-size: 1rem;
      }
    }
  `}
`;

const RatingStars = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RatingOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Star = styled(FiStar)`
  fill: ${(props) => (props.$filled ? "#fbbf24" : "none")};
  color: #fbbf24;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    width: 14px;
    height: 14px;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    width: 15px;
    height: 15px;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    width: 16px;
    height: 16px;
  }
`;

const FilterActions = styled.div`
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 1rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.75rem;
    flex-direction: column;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 1.5rem;
    gap: 0.875rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    padding: 2rem;
    gap: 1rem;
    flex-direction: row;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    gap: 0.375rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    padding: 0.8125rem 1.25rem;
    font-size: 0.9375rem;
    gap: 0.4375rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    gap: 0.5rem;
  }

  ${(props) =>
    props.$primary
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
    color: white;
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    }
  `
      : `
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;

    &:hover {
      border-color: #3b82f6;
      color: #3b82f6;
    }
  `}
`;

const RatingText = styled.span`
  color: #374151;

  /* Mobile Portrait */
  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }

  /* Mobile Landscape */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.8438rem;
  }

  /* Tablet and up */
  @media (min-width: 769px) {
    font-size: 0.875rem;
  }
`;

const FilterSidebar = ({
  isOpen,
  onClose,
  filters = {},
  onFilterChange,
  productCounts = {},
}) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    brand: false,
    color: false,
    size: false,
    rating: false,
  });

  const [localFilters, setLocalFilters] = useState({
    priceMin: "",
    priceMax: "",
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    rating: 0,
    ...filters,
  });

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterUpdate = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
  };

  const handleArrayFilterToggle = (filterType, value) => {
    const currentArray = localFilters[filterType] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    handleFilterUpdate(filterType, newArray);
  };

  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(localFilters);
    }
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      priceMin: "",
      priceMax: "",
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      rating: 0,
    };
    setLocalFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const categories = [
    { id: "clothing", label: "Clothing", count: productCounts.clothing || 245 },
    { id: "shoes", label: "Shoes", count: productCounts.shoes || 187 },
    {
      id: "accessories",
      label: "Accessories",
      count: productCounts.accessories || 156,
    },
    { id: "bags", label: "Bags", count: productCounts.bags || 89 },
    { id: "jewelry", label: "Jewelry", count: productCounts.jewelry || 67 },
  ];

  const brands = [
    { id: "nike", label: "Nike", count: 98 },
    { id: "adidas", label: "Adidas", count: 87 },
    { id: "zara", label: "Zara", count: 145 },
    { id: "hm", label: "H&M", count: 123 },
    { id: "uniqlo", label: "Uniqlo", count: 76 },
  ];

  const colors = [
    { id: "black", label: "Black", value: "#000000" },
    { id: "white", label: "White", value: "#ffffff" },
    { id: "red", label: "Red", value: "#ef4444" },
    { id: "blue", label: "Blue", value: "#3b82f6" },
    { id: "green", label: "Green", value: "#10b981" },
    { id: "yellow", label: "Yellow", value: "#f59e0b" },
    { id: "purple", label: "Purple", value: "#8b5cf6" },
    { id: "pink", label: "Pink", value: "#ec4899" },
    { id: "brown", label: "Brown", value: "#92400e" },
    { id: "gray", label: "Gray", value: "#6b7280" },
    { id: "orange", label: "Orange", value: "#f97316" },
    { id: "navy", label: "Navy", value: "#1e40af" },
  ];

  const sizes = [
    { id: "xs", label: "XS", count: 45 },
    { id: "s", label: "S", count: 123 },
    { id: "m", label: "M", count: 234 },
    { id: "l", label: "L", count: 198 },
    { id: "xl", label: "XL", count: 156 },
    { id: "xxl", label: "XXL", count: 87 },
  ];

  if (!isOpen) return null;

  return (
    <>
      <Backdrop $isOpen={isOpen} onClick={onClose} />
      <FilterContainer $isOpen={isOpen}>
        <FilterHeader>
          <FilterTitle>
            <ResponsiveIcon $size={24}>
              <FiFilter />
            </ResponsiveIcon>
            Filters
          </FilterTitle>
          <FilterSubtitle>
            Refine your search to find exactly what you're looking for
          </FilterSubtitle>
          <CloseButton onClick={onClose}>
            <ResponsiveIcon $size={20}>
              <FiX />
            </ResponsiveIcon>
          </CloseButton>
        </FilterHeader>

        <FilterContent>
          {/* Price Range */}
          <FilterSection>
            <SectionHeader onClick={() => toggleSection("price")}>
              <SectionTitle>
                <ResponsiveIcon $size={20}>
                  <FiDollarSign />
                </ResponsiveIcon>
                Price Range
              </SectionTitle>
              <ResponsiveIcon $size={20}>
                {openSections.price ? <FiChevronUp /> : <FiChevronDown />}
              </ResponsiveIcon>
            </SectionHeader>
            <SectionContent $isOpen={openSections.price}>
              <PriceRange>
                <PriceInputs>
                  <PriceInput
                    type="number"
                    placeholder="Min"
                    value={localFilters.priceMin}
                    onChange={(e) =>
                      handleFilterUpdate("priceMin", e.target.value)
                    }
                  />
                  <span style={{ color: "#6b7280" }}>to</span>
                  <PriceInput
                    type="number"
                    placeholder="Max"
                    value={localFilters.priceMax}
                    onChange={(e) =>
                      handleFilterUpdate("priceMax", e.target.value)
                    }
                  />
                </PriceInputs>
              </PriceRange>
            </SectionContent>
          </FilterSection>

          {/* Categories */}
          <FilterSection>
            <SectionHeader onClick={() => toggleSection("category")}>
              <SectionTitle>
                <ResponsiveIcon $size={20}>
                  <FiTag />
                </ResponsiveIcon>
                Categories
              </SectionTitle>
              <ResponsiveIcon $size={20}>
                {openSections.category ? <FiChevronUp /> : <FiChevronDown />}
              </ResponsiveIcon>
            </SectionHeader>
            <SectionContent $isOpen={openSections.category}>
              <CheckboxGroup>
                {categories.map((category) => (
                  <CheckboxItem key={category.id}>
                    <Checkbox
                      type="checkbox"
                      checked={localFilters.categories.includes(category.id)}
                      onChange={() =>
                        handleArrayFilterToggle("categories", category.id)
                      }
                    />
                    <CheckboxLabel>{category.label}</CheckboxLabel>
                    <CheckboxCount>{category.count}</CheckboxCount>
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            </SectionContent>
          </FilterSection>

          {/* Brands */}
          <FilterSection>
            <SectionHeader onClick={() => toggleSection("brand")}>
              <SectionTitle>
                <ResponsiveIcon $size={20}>
                  <FiBox />
                </ResponsiveIcon>
                Brands
              </SectionTitle>
              <ResponsiveIcon $size={20}>
                {openSections.brand ? <FiChevronUp /> : <FiChevronDown />}
              </ResponsiveIcon>
            </SectionHeader>
            <SectionContent $isOpen={openSections.brand}>
              <CheckboxGroup>
                {brands.map((brand) => (
                  <CheckboxItem key={brand.id}>
                    <Checkbox
                      type="checkbox"
                      checked={localFilters.brands.includes(brand.id)}
                      onChange={() =>
                        handleArrayFilterToggle("brands", brand.id)
                      }
                    />
                    <CheckboxLabel>{brand.label}</CheckboxLabel>
                    <CheckboxCount>{brand.count}</CheckboxCount>
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            </SectionContent>
          </FilterSection>

          {/* Colors */}
          <FilterSection>
            <SectionHeader onClick={() => toggleSection("color")}>
              <SectionTitle>
                <ResponsiveIcon $size={20}>
                  <FiDroplet />
                </ResponsiveIcon>
                Colors
              </SectionTitle>
              <ResponsiveIcon $size={20}>
                {openSections.color ? <FiChevronUp /> : <FiChevronDown />}
              </ResponsiveIcon>
            </SectionHeader>
            <SectionContent $isOpen={openSections.color}>
              <ColorGrid>
                {colors.map((color) => (
                  <ColorOption
                    key={color.id}
                    $color={color.value}
                    $isSelected={localFilters.colors.includes(color.id)}
                    onClick={() => handleArrayFilterToggle("colors", color.id)}
                    title={color.label}
                  />
                ))}
              </ColorGrid>
            </SectionContent>
          </FilterSection>

          {/* Sizes */}
          <FilterSection>
            <SectionHeader onClick={() => toggleSection("size")}>
              <SectionTitle>Sizes</SectionTitle>
              <ResponsiveIcon $size={20}>
                {openSections.size ? <FiChevronUp /> : <FiChevronDown />}
              </ResponsiveIcon>
            </SectionHeader>
            <SectionContent $isOpen={openSections.size}>
              <CheckboxGroup>
                {sizes.map((size) => (
                  <CheckboxItem key={size.id}>
                    <Checkbox
                      type="checkbox"
                      checked={localFilters.sizes.includes(size.id)}
                      onChange={() => handleArrayFilterToggle("sizes", size.id)}
                    />
                    <CheckboxLabel>{size.label}</CheckboxLabel>
                    <CheckboxCount>{size.count}</CheckboxCount>
                  </CheckboxItem>
                ))}
              </CheckboxGroup>
            </SectionContent>
          </FilterSection>

          {/* Rating */}
          <FilterSection>
            <SectionHeader onClick={() => toggleSection("rating")}>
              <SectionTitle>
                <ResponsiveIcon $size={20}>
                  <FiStar />
                </ResponsiveIcon>
                Customer Rating
              </SectionTitle>
              <ResponsiveIcon $size={20}>
                {openSections.rating ? <FiChevronUp /> : <FiChevronDown />}
              </ResponsiveIcon>
            </SectionHeader>
            <SectionContent $isOpen={openSections.rating}>
              <RatingStars>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <RatingOption key={rating}>
                    <Checkbox
                      type="radio"
                      name="rating"
                      checked={localFilters.rating === rating}
                      onChange={() => handleFilterUpdate("rating", rating)}
                    />
                    <Stars>
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} $filled={index < rating} />
                      ))}
                    </Stars>
                    <RatingText>{rating}+ Stars</RatingText>
                  </RatingOption>
                ))}
              </RatingStars>
            </SectionContent>
          </FilterSection>
        </FilterContent>

        <FilterActions>
          <ActionButton onClick={clearFilters}>
            <ResponsiveIcon $size={16}>
              <FiRefreshCw />
            </ResponsiveIcon>
            Clear All
          </ActionButton>
          <ActionButton $primary onClick={applyFilters}>
            <ResponsiveIcon $size={16}>
              <FiFilter />
            </ResponsiveIcon>
            Apply Filters
          </ActionButton>
        </FilterActions>
      </FilterContainer>
    </>
  );
};

export default FilterSidebar;
