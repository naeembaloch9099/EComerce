import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiImage,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { useProducts } from "../../context/ProductContext";
import { fileToBase64, optimizeBase64Image } from "../../utils/imageUtils";

// Categories for product management
const categories = [
  { id: "men", name: "MEN" },
  { id: "women", name: "WOMEN" },
  { id: "kids", name: "KIDS" },
  { id: "accessories", name: "ACCESSORIES" },
  { id: "shoes", name: "SHOES" },
  { id: "electronics", name: "ELECTRONICS" },
  { id: "home", name: "HOME" },
  { id: "sports", name: "SPORTS" },
];

const Container = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 280px;
  flex-shrink: 1;
  min-width: 200px;
  margin-right: 1rem;

  @media (max-width: 1024px) {
    width: 250px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
  min-width: 0;
  flex-shrink: 1;

  @media (max-width: 1024px) {
    justify-content: center;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    align-items: stretch;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  min-width: 110px;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  width: 18px;
  height: 18px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  white-space: nowrap;
  flex-shrink: 0;
  margin-left: 1rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    transform: scale(0.95);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-left: 0;
    margin-top: 0.5rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: #3b82f6;
  }

  ${(props) =>
    props.isNewProduct &&
    `
    border-color: #10b981;
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
    animation: gentle-glow 2s ease-in-out infinite alternate;
    
    @keyframes gentle-glow {
      from { box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2); }
      to { box-shadow: 0 12px 35px rgba(16, 185, 129, 0.3); }
    }
  `}
`;

const ProductBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${(props) =>
    props.type === "new"
      ? "#10b981"
      : props.type === "featured"
      ? "#f59e0b"
      : "#6b7280"};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 2;
`;

const ProductImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 3rem;
  position: relative;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`;

const ProductStock = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  min-height: 36px;

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.85rem;
  }

  &:active {
    transform: scale(0.95);
  }

  &.edit {
    background: #3b82f6;
    color: white;

    &:hover {
      background: #2563eb;
      transform: translateY(-1px);
    }
  }

  &.delete {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;

  &:hover {
    color: #1f2937;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => (props.$isDragActive ? "#f8fafc" : "white")};
  border-color: ${(props) => (props.$isDragActive ? "#3b82f6" : "#d1d5db")};

  &:hover {
    border-color: #3b82f6;
    background: #f8fafc;
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewImage = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
`;

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.75rem;

  &:hover {
    background: #dc2626;
  }
`;

const ColorInputsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const ColorInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.5rem;
  border-radius: 0.5rem;
`;

const ColorInput = styled.input`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const ColorNameInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-size: 0.8rem;
`;

const RemoveColorButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;

  &:hover {
    background: #dc2626;
  }
`;

const AddColorButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;

  &:hover {
    background: #2563eb;
  }
`;

const SizeCheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const SizeCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  background: #f8fafc;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 2px solid ${(props) => (props.$checked ? "#3b82f6" : "#e5e7eb")};
  color: ${(props) => (props.$checked ? "#3b82f6" : "#374151")};

  input {
    margin: 0;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &.primary {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }
  }

  &.secondary {
    background: #f3f4f6;
    color: #374151;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [realTimeUpdate, setRealTimeUpdate] = useState(null);

  // Use product context for real-time updates
  const { notifyProductUpdate, refreshAllProducts } = useProducts();

  // Function to calculate actual available stock based on color/size combinations
  const calculateActualStock = (product) => {
    // If no colors or sizes, use totalStock
    if (
      !product.colors ||
      !product.sizes ||
      !Array.isArray(product.colors) ||
      !Array.isArray(product.sizes)
    ) {
      return product.totalStock || 0;
    }

    // Calculate available combinations
    let availableCombinations = 0;
    product.colors.forEach((color) => {
      if (color.stock > 0) {
        product.sizes.forEach((size) => {
          if (size.stock > 0) {
            // Each combination has stock equal to minimum of color and size stock
            const combinationStock = Math.min(color.stock, size.stock);
            if (combinationStock > 0) {
              availableCombinations += combinationStock;
            }
          }
        });
      }
    });

    return availableCombinations;
  };

  // API URL constant
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch products from backend with enhanced real-time feedback
  const fetchProducts = useCallback(
    async (showNotification = true) => {
      try {
        console.log("🔍 ProductManagement: Starting to fetch products...");
        setLoading(true);
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.error("❌ ProductManagement: No refresh token found");
          toast.error("Please login again");
          return;
        }

        console.log(
          "🔑 ProductManagement: Using refresh token:",
          refreshToken.substring(0, 50) + "..."
        );

        const response = await fetch(`${API_URL}/api/products/admin/all`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log(
          "📡 ProductManagement: API response status:",
          response.status
        );

        if (response.ok) {
          const data = await response.json();
          console.log(
            "✅ ProductManagement: Products fetched successfully:",
            data
          );
          setProducts(data.data.products || []);

          if (showNotification) {
            toast.success(
              `🎯 ${
                data.data.products?.length || 0
              } products loaded and ready!`,
              {
                duration: 3000,
                icon: "🔥",
              }
            );
          }

          // Show real-time update animation
          setRealTimeUpdate("refreshed");
          setTimeout(() => setRealTimeUpdate(null), 2000);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error(
            "❌ ProductManagement: Failed to fetch products:",
            errorData
          );
          toast.error(errorData.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("❌ ProductManagement: Error fetching products:", error);
        toast.error("Error loading products");
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Load products on component mount
  useEffect(() => {
    console.log(
      "🚀 ProductManagement: Component mounted, fetching products..."
    );
    fetchProducts();
  }, [fetchProducts]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "men",
    subcategory: "T-Shirts",
    brand: "RabbitWear",
    images: [],
    colors: [{ name: "Black", code: "#000000", stock: 30 }],
    sizes: [{ size: "M", stock: 25 }],
    totalStock: 0,
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    tags: [],
  });
  const [uploadedImages, setUploadedImages] = useState([]);

  // Create or update product
  const handleSaveProduct = async () => {
    try {
      console.log("🔍 ProductManagement: Starting to save product...");
      setSavingProduct(true);

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.error("❌ ProductManagement: No refresh token found");
        toast.error("Please login again");
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        totalStock: parseInt(formData.totalStock) || 0,
        images: formData.images.length > 0 ? formData.images : [],
        sku:
          editingProduct?.sku ||
          `${formData.category.toUpperCase()}-${Date.now()}`, // Preserve existing SKU
      };

      console.log("📦 ProductManagement: Product data to save:", productData);

      const isEdit = editingProduct !== null;
      const url = isEdit
        ? `${API_URL}/api/products/${editingProduct._id}`
        : `${API_URL}/api/products`;

      const method = isEdit ? "PUT" : "POST";

      console.log("📡 ProductManagement: Making API call:", { method, url });
      console.log(
        "🔑 ProductManagement: Using refresh token:",
        refreshToken ? `${refreshToken.substring(0, 20)}...` : "NO TOKEN"
      );
      console.log(
        "📦 ProductManagement: Request payload:",
        JSON.stringify(productData, null, 2)
      );

      // Show loading toast for better user experience
      const loadingToast = toast.loading(
        `${isEdit ? "Updating" : "Creating"} product...`
      );

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      console.log(
        "📡 ProductManagement: Save response status:",
        response.status
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        const responseData = await response.json();
        console.log(
          "✅ ProductManagement: Product saved successfully:",
          responseData
        );

        // Enhanced success notification
        toast.success(
          `🎉 Product "${productData.name}" ${
            isEdit ? "updated" : "created"
          } successfully!`,
          {
            duration: 4000,
            icon: "🚀",
          }
        );

        // Show real-time update animation
        setRealTimeUpdate(isEdit ? "updated" : "created");
        setTimeout(() => setRealTimeUpdate(null), 3000);

        // Notify other components about the update
        notifyProductUpdate(isEdit ? "updated" : "created", productData.name);

        // Refresh products with no notification to avoid spam
        await fetchProducts(false);

        // Trigger global product refresh for all components
        setTimeout(() => {
          refreshAllProducts();
        }, 1000);

        handleCloseModal();
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error(
            "❌ ProductManagement: Failed to parse error response as JSON:",
            jsonError
          );
          errorData = {
            message: `Server error: ${response.status} ${response.statusText}`,
          };
        }

        console.error("❌ ProductManagement: Failed to save product:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });

        // Show validation errors in detail
        if (response.status === 400 && errorData.errors) {
          console.error("🚫 ProductManagement: Validation Errors:");
          errorData.errors.forEach((error, index) => {
            console.error(
              `   ${index + 1}. Field: "${error.field}" - ${
                error.message
              } (Value: ${JSON.stringify(error.value)})`
            );
          });

          // Show first validation error to user
          const firstError = errorData.errors[0];
          toast.error(
            `Validation Error: ${firstError.message} (Field: ${firstError.field})`
          );
        } else if (response.status === 401) {
          toast.error("Session expired - please login again");
        } else if (response.status === 403) {
          toast.error("Access denied - admin privileges required");
        } else if (response.status >= 500) {
          toast.error("Server error - please try again later");
        } else {
          toast.error(
            errorData.message ||
              `Failed to save product (Error: ${response.status})`
          );
        }
      }
    } catch (error) {
      console.error("❌ ProductManagement: Error saving product:", error);
      console.error("❌ ProductManagement: Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Dismiss loading toast if it exists
      toast.dismiss();

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error(
          "❌ Cannot connect to server - please check if backend is running on " +
            API_URL
        );
      } else if (error.message.includes("JSON")) {
        toast.error("❌ Server response error - please try again");
      } else {
        toast.error("❌ Error saving product: " + error.message);
      }
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete product with immediate UI update
  const handleDeleteProduct = async (productId) => {
    console.log("🗑️ ProductManagement: Delete clicked for product:", productId);

    if (!productId) {
      console.error("❌ ProductManagement: No product ID provided");
      toast.error("Invalid product ID");
      return;
    }

    // Find the product to get its name for notifications
    const productToDelete = products.find((p) => p._id === productId);
    const productName = productToDelete?.name || "Unknown Product";

    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      console.log("🚫 ProductManagement: Delete cancelled by user");
      return;
    }

    // Store original products list for potential rollback
    const originalProducts = [...products];

    try {
      console.log(
        "🔍 ProductManagement: Starting to delete product:",
        productId
      );

      // STEP 1: Immediate UI update (Optimistic Update)
      console.log("⚡ ProductManagement: Removing product from UI immediately");
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );

      // Show immediate feedback
      toast.loading(`Deleting "${productName}"...`, {
        id: `delete-${productId}`,
      });

      // STEP 2: API Call to backend
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found - please login again");
      }

      console.log(
        "📡 ProductManagement: Making DELETE request to:",
        `${API_URL}/api/products/${productId}`
      );

      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(
        "📡 ProductManagement: Delete response status:",
        response.status
      );

      if (response.ok) {
        // STEP 3: Success - Dismiss loading and show success
        toast.dismiss(`delete-${productId}`);
        console.log(
          "✅ ProductManagement: Product deleted successfully from backend"
        );

        // STEP 4: Notify about deletion and trigger global refresh
        notifyProductUpdate("deleted", productName);

        // STEP 5: Trigger immediate refresh for client-side components
        console.log(
          "🔄 ProductManagement: Triggering global product refresh for client components"
        );
        setTimeout(() => {
          refreshAllProducts();
        }, 100); // Very short delay to ensure UI update

        // STEP 6: Refresh admin list to ensure consistency
        setTimeout(async () => {
          console.log("🔄 ProductManagement: Refreshing admin product list");
          await fetchProducts(false);
        }, 500);
      } else {
        // STEP 7: API Error - Rollback optimistic update
        console.error(
          "❌ ProductManagement: Backend delete failed, rolling back"
        );
        setProducts(originalProducts);
        toast.dismiss(`delete-${productId}`);

        const errorData = await response.json().catch(() => ({}));
        console.error("❌ ProductManagement: Delete API error:", errorData);
        toast.error(errorData.message || `Failed to delete "${productName}"`);
      }
    } catch (error) {
      // STEP 8: Network/Other Error - Rollback optimistic update
      console.error("❌ ProductManagement: Delete operation failed:", error);
      console.log("🔄 ProductManagement: Rolling back optimistic update");
      setProducts(originalProducts);
      toast.dismiss(`delete-${productId}`);

      if (error.message.includes("login")) {
        toast.error("Session expired - please login again");
      } else {
        toast.error(`Error deleting "${productName}" - please try again`);
      }
    }
  };

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  // Function to upload files to Cloudinary (currently unused)
  /*
  const uploadFilesToCloudinary = async (files) => {
    const uploadPromises = files.map(async (fileObj) => {
      if (!fileObj.file) return null; // Skip if not a file

      const formData = new FormData();
      formData.append("image", fileObj.file);

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await fetch(`${API_URL}/api/upload/single`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return {
          url: result.data.isCloudinary
            ? result.data.url
            : `${API_URL}${result.data.url}`,
          alt: result.data.originalName,
          isPrimary: false,
          publicId: result.data.publicId,
          isCloudinary: result.data.isCloudinary,
        };
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${fileObj.file.name}`);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages.filter((img) => img !== null);
  };
  */

  const filteredProducts = (products || []).filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    onDrop: async (acceptedFiles) => {
      toast.loading("Converting images for permanent storage...", {
        id: "upload-toast",
      });

      try {
        // Convert files to base64 for permanent storage
        const base64Images = await Promise.all(
          acceptedFiles.map(async (file, index) => {
            try {
              const base64 = await fileToBase64(file);
              const optimized = await optimizeBase64Image(base64, 800, 0.8);

              return {
                url: optimized, // Base64 data URL - persists permanently!
                alt: `${formData.name || "Product"} - Image ${index + 1}`,
                isPrimary: formData.images.length === 0 && index === 0,
                fileName: file.name,
                size: file.size,
                isBase64: true, // Flag to indicate this is a base64 image
              };
            } catch (error) {
              console.error(`Failed to process ${file.name}:`, error);
              toast.error(`Failed to process ${file.name}`);
              return null;
            }
          })
        );

        // Filter out failed conversions
        const validImages = base64Images.filter((img) => img !== null);

        if (validImages.length > 0) {
          // Add to formData.images for permanent storage
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...validImages],
          }));

          toast.success(
            `✅ ${validImages.length} images converted and ready for permanent storage!`,
            { id: "upload-toast" }
          );

          // Clear uploaded images since we're using formData.images now
          setUploadedImages([]);
        } else {
          toast.error("No images could be processed", { id: "upload-toast" });
        }
      } catch (error) {
        console.error("Error processing images:", error);
        toast.error("Failed to process images", { id: "upload-toast" });
      }
    },
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "men",
      subcategory: "T-Shirts",
      brand: "RabbitWear",
      images: [],
      colors: [{ name: "Black", code: "#000000", stock: 30 }],
      sizes: [{ size: "M", stock: 25 }],
      totalStock: 0,
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
      tags: [],
    });
    setUploadedImages([]);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    console.log("🔧 ProductManagement: Editing product:", product);
    try {
      setEditingProduct(product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        category: product.category || "men",
        subcategory: product.subcategory || "T-Shirts",
        brand: product.brand || "RabbitWear",
        images: product.images || [],
        colors: product.colors || [
          { name: "Black", code: "#000000", stock: 30 },
        ],
        sizes: product.sizes || [{ size: "M", stock: 25 }],
        totalStock: product.totalStock || 0,
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false,
        isNewArrival: product.isNewArrival || false,
        tags: product.tags || [],
      });
      setUploadedImages(
        product.images?.map((img) => ({ preview: img.url })) || []
      );
      setIsModalOpen(true);
      console.log("✅ ProductManagement: Edit modal opened successfully");
    } catch (error) {
      console.error("❌ ProductManagement: Error in handleEditProduct:", error);
      toast.error("Error opening edit form");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "men",
      subcategory: "T-Shirts",
      brand: "RabbitWear",
      sku: "",
      images: [],
      colors: [{ name: "Black", code: "#000000", stock: 30 }],
      sizes: [{ size: "M", stock: 25 }],
      totalStock: 0,
      isActive: true,
      isFeatured: false,
      isNewArrival: false,
      tags: [],
    });
    setUploadedImages([]);
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData((prev) => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", code: "#000000", stock: 0 }],
    }));
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, colors: newColors }));
    }
  };

  const handleSizeChange = (size) => {
    const existingSizeIndex = formData.sizes.findIndex((s) => s.size === size);
    if (existingSizeIndex >= 0) {
      // Remove the size
      const newSizes = formData.sizes.filter((s) => s.size !== size);
      setFormData((prev) => ({ ...prev, sizes: newSizes }));
    } else {
      // Add the size
      const newSizes = [...formData.sizes, { size, stock: 25 }];
      setFormData((prev) => ({ ...prev, sizes: newSizes }));
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to remove image from formData.images (for URL-based images)
  const removeFormDataImage = async (index) => {
    const imageToRemove = formData.images[index];

    // If it's a Cloudinary image, try to delete it from cloud storage
    if (imageToRemove.publicId) {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        await fetch(`${API_URL}/api/upload/by-url`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
          body: JSON.stringify({ imageUrl: imageToRemove.url }),
        });
        console.log(
          "✅ Image deleted from Cloudinary:",
          imageToRemove.publicId
        );
      } catch (error) {
        console.warn("⚠️ Could not delete image from Cloudinary:", error);
        // Continue with removal from form even if cloud deletion fails
      }
    }

    const updatedImages = formData.images.filter((_, i) => i !== index);

    // If we removed the primary image and there are still images left,
    // make the first remaining image primary
    if (imageToRemove.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
      toast.info(
        "Primary image removed. First remaining image is now primary."
      );
    }

    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));

    toast.success("Image removed!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    handleSaveProduct();
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>
            Product Management
            {realTimeUpdate && (
              <span
                style={{
                  marginLeft: "1rem",
                  fontSize: "0.8rem",
                  background:
                    realTimeUpdate === "created"
                      ? "#10b981"
                      : realTimeUpdate === "updated"
                      ? "#3b82f6"
                      : "#f59e0b",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "1rem",
                  animation: "pulse 1s infinite",
                }}
              >
                {realTimeUpdate === "created" && "🎉 NEW PRODUCT LIVE!"}
                {realTimeUpdate === "updated" && "🔄 PRODUCT UPDATED!"}
                {realTimeUpdate === "refreshed" && "🔥 PRODUCTS REFRESHED!"}
              </span>
            )}
          </Title>
          <div
            style={{
              fontSize: "0.9rem",
              color: "#6b7280",
              marginTop: "0.25rem",
            }}
          >
            {products.length > 0 ? (
              <>
                🎯 {products.length} products loaded • 🔄 Real-time sync active
              </>
            ) : (
              "No products found"
            )}
          </div>
        </div>
        <FilterSection>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <AddButton onClick={handleAddProduct} disabled={savingProduct}>
            <FiPlus />
            {savingProduct ? "Creating..." : "Add Product"}
          </AddButton>
        </FilterSection>
      </Header>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            color: "#6b7280",
            fontSize: "1.1rem",
          }}
        >
          Loading products...
        </div>
      ) : (
        <ProductGrid>
          {filteredProducts.map((product) => {
            // Check if product is newly created (within last 5 minutes)
            const isNewProduct =
              product.createdAt &&
              new Date() - new Date(product.createdAt) < 5 * 60 * 1000;

            return (
              <ProductCard key={product._id} isNewProduct={isNewProduct}>
                <ProductImage>
                  {isNewProduct && (
                    <ProductBadge type="new">🔥 NEW</ProductBadge>
                  )}
                  {product.featured && (
                    <ProductBadge type="featured">⭐ FEATURED</ProductBadge>
                  )}
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <FiImage />
                  )}
                </ProductImage>
                <ProductInfo>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <ProductName>{product.name}</ProductName>
                    {product.isNewArrival && (
                      <span
                        style={{
                          background: "#ef4444",
                          color: "white",
                          fontSize: "0.6rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.5rem",
                          fontWeight: "600",
                        }}
                      >
                        NEW ARRIVAL
                      </span>
                    )}
                  </div>
                  <ProductPrice>
                    ${product.price}
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span
                          style={{
                            fontSize: "0.9rem",
                            color: "#6b7280",
                            textDecoration: "line-through",
                            marginLeft: "0.5rem",
                          }}
                        >
                          ${product.originalPrice}
                        </span>
                      )}
                  </ProductPrice>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      {product.category} • {product.subcategory}
                    </span>
                    <span
                      style={{
                        background:
                          calculateActualStock(product) > 0
                            ? "#dcfce7"
                            : "#fecaca",
                        color:
                          calculateActualStock(product) > 0
                            ? "#166534"
                            : "#dc2626",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.7rem",
                        fontWeight: "600",
                      }}
                    >
                      {calculateActualStock(product) > 0
                        ? `${calculateActualStock(
                            product
                          )} combinations available`
                        : "OUT OF STOCK"}
                    </span>
                  </div>
                  {product.colors && (
                    <div
                      style={{
                        display: "flex",
                        gap: "0.25rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div
                          key={index}
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            backgroundColor: color.code,
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
                          +{product.colors.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  {product.sizes && (
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#6b7280",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Sizes: {product.sizes.map((s) => s.size).join(", ")}
                    </div>
                  )}
                  <ActionButtons>
                    <ActionButton
                      className="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(
                          "🔧 Edit button clicked for product:",
                          product._id
                        );
                        handleEditProduct(product);
                      }}
                    >
                      <FiEdit3 size={14} />
                      Edit
                    </ActionButton>
                    <ActionButton
                      className="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(
                          "🗑️ Delete button clicked for product:",
                          product._id
                        );
                        handleDeleteProduct(product._id);
                      }}
                    >
                      <FiTrash2 size={14} />
                      Delete
                    </ActionButton>
                  </ActionButtons>
                </ProductInfo>
              </ProductCard>
            );
          })}
        </ProductGrid>
      )}

      {isModalOpen && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Product Name *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description..."
                />
              </FormGroup>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <FormGroup>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Brand</Label>
                  <Input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <FormGroup>
                  <Label>Category</Label>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Subcategory</Label>
                  <Select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                  >
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Casual">Casual</option>
                    <option value="Bags">Bags</option>
                    <option value="Sports">Sports</option>
                  </Select>
                </FormGroup>
              </div>

              <FormGroup>
                <Label>Product Images</Label>
                <DropzoneContainer
                  {...getRootProps()}
                  $isDragActive={isDragActive}
                >
                  <input {...getInputProps()} />
                  <FiUpload size={24} color="#6b7280" />
                  <p style={{ margin: "0.5rem 0", color: "#6b7280" }}>
                    {isDragActive
                      ? "Drop images here..."
                      : "Drag & drop images or click to select"}
                  </p>
                </DropzoneContainer>

                {uploadedImages.length > 0 && (
                  <ImagePreview>
                    {uploadedImages.map((img, index) => (
                      <PreviewImage key={index}>
                        <PreviewImg
                          src={img.preview}
                          alt={`Preview ${index}`}
                        />
                        <RemoveImageButton onClick={() => removeImage(index)}>
                          <FiX />
                        </RemoveImageButton>
                      </PreviewImage>
                    ))}
                  </ImagePreview>
                )}
              </FormGroup>

              {/* Image URL Input as alternative to file upload */}
              <FormGroup>
                <Label>Image URLs (Recommended for permanent images)</Label>
                <div style={{ marginBottom: "0.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <Input
                      id="imageUrlInput"
                      type="url"
                      placeholder="https://example.com/image1.jpg"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const url = e.target.value.trim();
                          if (url) {
                            const newImage = {
                              url: url,
                              alt: formData.name || "Product Image",
                              isPrimary: formData.images.length === 0,
                            };
                            setFormData((prev) => ({
                              ...prev,
                              images: [...prev.images, newImage],
                            }));
                            e.target.value = "";
                            toast.success("Image URL added!");
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("imageUrlInput");
                        const url = input.value.trim();
                        if (url) {
                          const newImage = {
                            url: url,
                            alt: formData.name || "Product Image",
                            isPrimary: formData.images.length === 0,
                          };
                          setFormData((prev) => ({
                            ...prev,
                            images: [...prev.images, newImage],
                          }));
                          input.value = "";
                          toast.success("Image URL added!");
                        } else {
                          toast.error("Please enter a valid image URL");
                        }
                      }}
                      style={{
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        padding: "0.75rem 1rem",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Add Image
                    </button>
                  </div>
                  <small style={{ color: "#6b7280", fontSize: "0.8rem" }}>
                    Press Enter or click "Add Image" to add permanent image
                    URLs.
                  </small>
                </div>

                {/* Display added image URLs */}
                {formData.images.length > 0 && (
                  <ImagePreview>
                    {formData.images.map((img, index) => (
                      <PreviewImage key={index}>
                        <img
                          src={img.url}
                          alt={img.alt}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/150x150?text=Invalid+URL";
                          }}
                        />
                        <RemoveImageButton
                          onClick={() => removeFormDataImage(index)}
                        >
                          <FiX />
                        </RemoveImageButton>

                        {/* Set as Primary button */}
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = formData.images.map(
                                (image, i) => ({
                                  ...image,
                                  isPrimary: i === index, // Set only this image as primary
                                })
                              );
                              setFormData((prev) => ({
                                ...prev,
                                images: updatedImages,
                              }));
                              toast.success("Primary image updated!");
                            }}
                            style={{
                              position: "absolute",
                              bottom: "4px",
                              left: "4px",
                              background: "#3b82f6",
                              color: "white",
                              border: "none",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              fontWeight: "600",
                              cursor: "pointer",
                            }}
                          >
                            SET PRIMARY
                          </button>
                        )}

                        {img.isPrimary && (
                          <div
                            style={{
                              position: "absolute",
                              top: "4px",
                              left: "4px",
                              background: "#10b981",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              fontWeight: "600",
                            }}
                          >
                            PRIMARY
                          </div>
                        )}
                      </PreviewImage>
                    ))}
                  </ImagePreview>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Colors</Label>
                <ColorInputsContainer>
                  {formData.colors.map((color, index) => (
                    <ColorInputGroup key={index}>
                      <ColorInput
                        type="color"
                        value={color.code}
                        onChange={(e) =>
                          handleColorChange(index, "code", e.target.value)
                        }
                      />
                      <ColorNameInput
                        type="text"
                        placeholder="Color name"
                        value={color.name}
                        onChange={(e) =>
                          handleColorChange(index, "name", e.target.value)
                        }
                      />
                      <ColorNameInput
                        type="number"
                        placeholder="Stock"
                        value={color.stock}
                        onChange={(e) =>
                          handleColorChange(
                            index,
                            "stock",
                            parseInt(e.target.value) || 0
                          )
                        }
                        style={{ width: "80px" }}
                      />
                      {formData.colors.length > 1 && (
                        <RemoveColorButton onClick={() => removeColor(index)}>
                          Remove
                        </RemoveColorButton>
                      )}
                    </ColorInputGroup>
                  ))}
                </ColorInputsContainer>
                <AddColorButton type="button" onClick={addColor}>
                  Add Color
                </AddColorButton>
              </FormGroup>

              <FormGroup>
                <Label>Available Sizes</Label>
                <SizeCheckboxContainer>
                  {availableSizes.map((size) => (
                    <SizeCheckbox
                      key={size}
                      $checked={formData.sizes.some((s) => s.size === size)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.sizes.some((s) => s.size === size)}
                        onChange={() => handleSizeChange(size)}
                      />
                      {size}
                    </SizeCheckbox>
                  ))}
                </SizeCheckboxContainer>
              </FormGroup>

              <FormGroup>
                <Label>Total Stock</Label>
                <Input
                  type="number"
                  name="totalStock"
                  value={formData.totalStock}
                  onChange={handleInputChange}
                  min="0"
                />
              </FormGroup>

              <FormGroup>
                <SizeCheckbox $checked={formData.isFeatured}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  Mark as Featured
                </SizeCheckbox>
              </FormGroup>

              <FormGroup>
                <SizeCheckbox $checked={formData.isNewArrival}>
                  <input
                    type="checkbox"
                    name="isNewArrival"
                    checked={formData.isNewArrival}
                    onChange={handleInputChange}
                  />
                  Mark as New Arrival
                </SizeCheckbox>
              </FormGroup>

              <FormGroup>
                <SizeCheckbox $checked={formData.isActive}>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  Active Product
                </SizeCheckbox>
              </FormGroup>

              <ModalButtons>
                <Button
                  type="button"
                  className="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="primary">
                  {editingProduct ? "Update" : "Add"} Product
                </Button>
              </ModalButtons>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default ProductManagement;
