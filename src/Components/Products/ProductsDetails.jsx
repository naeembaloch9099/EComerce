import React, { useState, useContext, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiHeart,
  FiShare2,
  FiStar,
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiEye,
  FiZoomIn,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { CartContext } from "../../context/CartContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import { AuthContext } from "../../context/AuthContext";
import ProductReviews from "./ProductReviews";
import toast from "react-hot-toast";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ProductContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 1rem;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const MainImageContainer = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  background: #f8fafc;
  margin-bottom: 1rem;
  aspect-ratio: 1;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  cursor: zoom-in;

  &:hover {
    transform: scale(1.05);
  }
`;

const ImageControls = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ImageButton = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #374151;

  &:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
`;

const Thumbnail = styled.div`
  aspect-ratio: 1;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$isActive ? "#3b82f6" : "transparent")};
  transition: all 0.3s ease;
  background: #f8fafc;

  &:hover {
    border-color: #3b82f6;
    transform: scale(1.05);
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  animation: ${scaleIn} 0.8s ease-out 0.2s both;
`;

const ProductBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductSubtitle = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 1rem;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const Star = styled(FiStar)`
  fill: ${(props) => (props.$filled ? "#fbbf24" : "none")};
  color: #fbbf24;
`;

const RatingText = styled.span`
  color: #374151;
  font-weight: 500;
`;

const ReviewCount = styled.span`
  color: #6b7280;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #3b82f6;
  }
`;

const PriceSection = styled.div`
  margin-bottom: 2rem;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
`;

const OriginalPrice = styled.span`
  font-size: 1.25rem;
  color: #6b7280;
  text-decoration: line-through;
`;

const Discount = styled.span`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const SaveAmount = styled.p`
  color: #10b981;
  font-weight: 600;
  font-size: 0.875rem;
`;

const VariantSection = styled.div`
  margin-bottom: 2rem;
`;

const VariantLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
`;

const VariantOptions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const VariantOption = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${(props) => (props.$isSelected ? "#3b82f6" : "#e5e7eb")};
  border-radius: 0.5rem;
  background: ${(props) => (props.$isSelected ? "#eff6ff" : "white")};
  color: ${(props) => (props.$isSelected ? "#3b82f6" : "#374151")};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ColorOption = styled.button`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 3px solid ${(props) => (props.$isSelected ? "#3b82f6" : "#e5e7eb")};
  background: ${(props) => props.$color};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

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
  `}
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuantityLabel = styled.span`
  font-weight: 600;
  color: #374151;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 45px;
  height: 45px;
  border: none;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #374151;

  &:hover {
    background: #e2e8f0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 45px;
  border: none;
  text-align: center;
  font-weight: 600;
  color: #374151;

  &:focus {
    outline: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SecondaryButton = styled.button`
  width: 60px;
  height: 60px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6b7280;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-2px);
  }

  ${(props) =>
    props.$isActive &&
    `
    border-color: #3b82f6;
    color: #3b82f6;
    background: #eff6ff;
  `}
`;

const Features = styled.div`
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const FeatureList = styled.div`
  display: grid;
  gap: 1rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const FeatureText = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h4`
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const Description = styled.div`
  margin-top: 2rem;
`;

const DescriptionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const DescriptionText = styled.p`
  color: #6b7280;
  line-height: 1.8;
  font-size: 1rem;
`;

const ProductsDetails = ({
  product = {
    id: 1,
    name: "Premium Cotton T-Shirt",
    subtitle: "Comfortable everyday essential",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewCount: 234,
    description:
      "Crafted from premium 100% organic cotton, this versatile t-shirt combines comfort with style. Perfect for casual wear or as a layering piece, it features a classic fit and timeless design that works for any occasion.",
    colors: [
      { name: "white", hex: "#ffffff" },
      { name: "black", hex: "#000000" },
      { name: "navy", hex: "#1e40af" },
      { name: "gray", hex: "#6b7280" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    stock: {
      white: { XS: 5, S: 8, M: 10, L: 6, XL: 3, XXL: 2 },
      black: { XS: 3, S: 7, M: 9, L: 5, XL: 4, XXL: 1 },
      navy: { XS: 2, S: 6, M: 8, L: 7, XL: 3, XXL: 2 },
      gray: { XS: 4, S: 5, M: 7, L: 6, XL: 2, XXL: 1 },
    },
    badge: "Best Seller",
    category: "men",
    subcategory: "topwear",
    material: "cotton",
    brand: "Urban Threads",
    bestseller: true,
  },
}) => {
  // Extract context values first, before any useEffect hooks
  const { addToCart } = useContext(CartContext);
  const { addToFavorites, removeFromFavorites, favorites } =
    useContext(FavoritesContext);
  const { user, isAuthenticated } = useContext(AuthContext);

  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userHasPurchased, setUserHasPurchased] = useState(false);

  // Set initial size when component mounts or color changes
  useEffect(() => {
    if (selectedColor && product.stock && product.stock[selectedColor]) {
      const availableSizes = (product.sizes || []).filter((size) => {
        const stockCount = product.stock[selectedColor][size];
        return stockCount && stockCount > 0;
      });

      // If no size is selected and there are available sizes, select the first one
      if (availableSizes.length > 0 && !selectedSize) {
        setSelectedSize(availableSizes[0]);
      }
      // If current size is not available in the current color, select the first available one
      else if (selectedSize && !availableSizes.includes(selectedSize)) {
        setSelectedSize(availableSizes.length > 0 ? availableSizes[0] : "");
      }
    }
  }, [selectedColor, product.stock, product.sizes, selectedSize]);

  // Check if user has purchased this product
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      console.log("🔍 ProductsDetails: Checking purchase status...");
      console.log("🔐 isAuthenticated:", isAuthenticated);
      console.log("📦 product._id:", product._id);

      if (isAuthenticated && product._id) {
        try {
          const API_URL =
            import.meta.env.VITE_API_URL || "http://localhost:5000";
          const refreshToken = localStorage.getItem("refreshToken");

          console.log(
            "📡 ProductsDetails: Making API call to:",
            `${API_URL}/api/users/has-purchased/${product._id}`
          );
          console.log(
            "🔑 ProductsDetails: Using token:",
            refreshToken ? `${refreshToken.substring(0, 20)}...` : "NO TOKEN"
          );

          const response = await fetch(
            `${API_URL}/api/users/has-purchased/${product._id}`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          console.log("📡 ProductsDetails: Response status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("✅ ProductsDetails: Purchase check result:", data);
            console.log(
              "🛒 ProductsDetails: User has purchased:",
              data.data.hasPurchased
            );
            setUserHasPurchased(data.data.hasPurchased);
          } else {
            console.error(
              "❌ ProductsDetails: Failed to check purchase status, status:",
              response.status
            );
          }
        } catch (error) {
          console.error(
            "❌ ProductsDetails: Error checking purchase status:",
            error
          );
        }
      } else {
        console.log(
          "⚠️ ProductsDetails: Skipping purchase check - not authenticated or no product ID"
        );
      }
    };

    checkPurchaseStatus();
  }, [isAuthenticated, product._id]);

  // Helper function to check if a size is available for the selected color
  const isSizeAvailable = (size, color) => {
    // If no stock system, assume everything is available
    if (!color) return true;

    // Handle array-based structure (colors and sizes as arrays)
    if (
      product.colors &&
      Array.isArray(product.colors) &&
      product.sizes &&
      Array.isArray(product.sizes)
    ) {
      // Find the color object and check its stock
      const colorObj = product.colors.find((c) => c.name === color);
      if (!colorObj || colorObj.stock <= 0) return false;

      // Find the size object and check its stock
      const sizeObj = product.sizes.find((s) => s.size === size);
      if (!sizeObj || sizeObj.stock <= 0) return false;

      return true;
    }

    // Handle legacy nested stock structure
    if (product.stock && typeof product.stock === "object") {
      if (product.stock[color] && typeof product.stock[color] === "object") {
        return (product.stock[color][size] || 0) > 0;
      }
      // If color exists but no size breakdown, assume available
      if (product.stock[color]) {
        return true;
      }
    }

    // Handle simple stock number
    if (typeof product.stock === "number") {
      return product.stock > 0;
    }

    // Default to available if structure unclear
    return true;
  };

  // Get available sizes for the selected color
  const getAvailableSizes = () => {
    if (!selectedColor || !product.stock) {
      // Handle both string array and object array for sizes
      return (product.sizes || []).map((size) =>
        typeof size === "object" ? size.size || size.name || size.value : size
      );
    }
    return (product.sizes || [])
      .map((size) =>
        typeof size === "object" ? size.size || size.name || size.value : size
      )
      .filter((size) => isSizeAvailable(size, selectedColor));
  };

  // Check if current selection is in stock
  const isCurrentSelectionInStock = () => {
    if (!selectedColor || !selectedSize) return true; // Allow if no selection made yet

    // Handle array-based structure (colors and sizes as arrays)
    if (
      product.colors &&
      Array.isArray(product.colors) &&
      product.sizes &&
      Array.isArray(product.sizes)
    ) {
      // Find the color object and check its stock
      const colorObj = product.colors.find((c) => c.name === selectedColor);
      if (!colorObj || colorObj.stock <= 0) return false;

      // Find the size object and check its stock
      const sizeObj = product.sizes.find((s) => s.size === selectedSize);
      if (!sizeObj || sizeObj.stock <= 0) return false;

      return true;
    }

    // Handle legacy nested stock structure
    if (product.stock && typeof product.stock === "object") {
      if (
        product.stock[selectedColor] &&
        typeof product.stock[selectedColor] === "object"
      ) {
        const stockCount = product.stock[selectedColor][selectedSize] || 0;
        return stockCount > 0;
      }
      // If color exists but no size breakdown, assume available
      if (product.stock[selectedColor]) {
        return true;
      }
    }

    // Handle simple stock number
    if (typeof product.stock === "number") {
      return product.stock > 0;
    }

    // If no stock system, assume available
    if (!product.stock) return true;

    // Default to available
    return true;
  };

  const isFavorite = favorites.some((item) => item.id === product.id);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;
  const saveAmount = product.originalPrice
    ? product.originalPrice - product.price
    : 0;

  // Handle color change and update size if needed
  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);

    // If current size is not available in new color, reset size selection
    if (selectedSize && !isSizeAvailable(selectedSize, colorName)) {
      // Get available sizes for the new color (pass colorName, not selectedColor)
      const availableSizesForNewColor = (product.sizes || []).filter((size) =>
        isSizeAvailable(size, colorName)
      );
      setSelectedSize(
        availableSizesForNewColor.length > 0 ? availableSizesForNewColor[0] : ""
      );
    } else if (!selectedSize) {
      // If no size was selected, select the first available size for the new color
      const availableSizesForNewColor = (product.sizes || []).filter((size) =>
        isSizeAvailable(size, colorName)
      );
      setSelectedSize(
        availableSizesForNewColor.length > 0 ? availableSizesForNewColor[0] : ""
      );
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    // Handle array-based structure (colors and sizes as arrays)
    if (
      product.colors &&
      Array.isArray(product.colors) &&
      product.sizes &&
      Array.isArray(product.sizes)
    ) {
      // Find the color object and check its stock
      const colorObj = product.colors.find((c) => c.name === selectedColor);
      if (!colorObj || colorObj.stock <= 0) {
        toast.error(`0 items available for ${selectedColor} color`);
        return;
      }

      // Find the size object and check its stock
      const sizeObj = product.sizes.find((s) => s.size === selectedSize);
      if (!sizeObj || sizeObj.stock <= 0) {
        toast.error(`0 items available for size ${selectedSize}`);
        return;
      }

      // Check if we have enough stock for the requested quantity
      const availableStock = Math.min(colorObj.stock, sizeObj.stock);
      if (availableStock < quantity) {
        toast.error(
          `Only ${availableStock} items available for ${selectedColor} color in size ${selectedSize}`
        );
        return;
      }

      // Use the updated addToCart function with color parameter
      addToCart(product, selectedSize, quantity, selectedColor);
      return;
    }

    // Handle legacy nested stock structure
    if (product.stock && typeof product.stock === "object") {
      const stockCount = product.stock?.[selectedColor]?.[selectedSize] || 0;
      if (stockCount < quantity) {
        toast.error(
          stockCount === 0
            ? `0 items available for ${selectedColor} color in size ${selectedSize}`
            : `Only ${stockCount} items available for ${selectedColor} color in size ${selectedSize}`
        );
        return;
      }
    }

    // Use the updated addToCart function with color parameter
    // Toast notification is now handled in CartContext
    addToCart(product, selectedSize, quantity, selectedColor);
  };

  const handleFavoriteToggle = () => {
    if (!user) {
      toast.error("Please login to add to favorites");
      return;
    }

    if (isFavorite) {
      removeFromFavorites(product.id);
      toast.success("Removed from favorites");
    } else {
      addToFavorites(product);
      toast.success("Added to favorites");
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const features = [
    {
      icon: <FiTruck size={20} />,
      title: "Free Shipping",
      description: "Free delivery on orders over $50",
    },
    {
      icon: <FiShield size={20} />,
      title: "Quality Guarantee",
      description: "Premium materials and craftsmanship",
    },
    {
      icon: <FiRefreshCw size={20} />,
      title: "Easy Returns",
      description: "30-day hassle-free return policy",
    },
  ];

  return (
    <ProductContainer>
      <ImageSection>
        <MainImageContainer>
          <MainImage
            src={
              product.images?.[0]?.url ||
              product.image ||
              "/placeholder-image.jpg"
            }
            alt={product.name}
          />
          <ImageControls>
            <ImageButton>
              <FiZoomIn size={20} />
            </ImageButton>
            <ImageButton onClick={handleFavoriteToggle}>
              <FiHeart
                size={20}
                fill={isFavorite ? "#ec4899" : "none"}
                style={{ color: isFavorite ? "#ec4899" : "#374151" }}
              />
            </ImageButton>
            <ImageButton>
              <FiShare2 size={20} />
            </ImageButton>
          </ImageControls>
        </MainImageContainer>

        <ThumbnailGrid>
          {/* Since we have single image, create a single thumbnail */}
          <Thumbnail $isActive={true}>
            <ThumbnailImage
              src={
                product.images?.[0]?.url ||
                product.image ||
                "/placeholder-image.jpg"
              }
              alt={product.name}
            />
          </Thumbnail>
        </ThumbnailGrid>
      </ImageSection>

      <ProductInfo>
        {product.badge && <ProductBadge>{product.badge}</ProductBadge>}

        <ProductTitle>{product.name}</ProductTitle>
        <ProductSubtitle>{product.subtitle}</ProductSubtitle>

        <RatingSection>
          <Stars>
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                $filled={index < Math.floor(product.rating || 0)}
                size={20}
              />
            ))}
          </Stars>
          <RatingText>{product.rating || 0}</RatingText>
          <ReviewCount>({product.reviewCount || 0} reviews)</ReviewCount>
        </RatingSection>

        <PriceSection>
          <PriceContainer>
            <CurrentPrice>${product.price}</CurrentPrice>
            {product.originalPrice && (
              <>
                <OriginalPrice>${product.originalPrice}</OriginalPrice>
                <Discount>{discount}% OFF</Discount>
              </>
            )}
          </PriceContainer>
          {saveAmount > 0 && (
            <SaveAmount>You save ${saveAmount.toFixed(2)}</SaveAmount>
          )}
        </PriceSection>

        {product.colors && (
          <VariantSection>
            <VariantLabel>Color</VariantLabel>
            <ColorOptions>
              {product.colors.map((color) => (
                <ColorOption
                  key={color.name}
                  $color={color.hex}
                  $isSelected={selectedColor === color.name}
                  onClick={() => handleColorChange(color.name)}
                  title={color.name}
                />
              ))}
            </ColorOptions>
          </VariantSection>
        )}

        {product.sizes && (
          <VariantSection>
            <VariantLabel>Size</VariantLabel>
            <VariantOptions>
              {getAvailableSizes().map((size) => {
                // Handle both string and object size formats
                const sizeValue =
                  typeof size === "object"
                    ? size.size || size.name || size.value
                    : size;
                const sizeKey =
                  typeof size === "object"
                    ? size.id || size._id || sizeValue
                    : size;

                return (
                  <VariantOption
                    key={sizeKey}
                    $isSelected={selectedSize === sizeValue}
                    onClick={() => setSelectedSize(sizeValue)}
                    disabled={!isSizeAvailable(sizeValue, selectedColor)}
                  >
                    {sizeValue}
                  </VariantOption>
                );
              })}
            </VariantOptions>
          </VariantSection>
        )}

        <QuantitySection>
          <QuantityLabel>Quantity:</QuantityLabel>
          <QuantityControls>
            <QuantityButton
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <FiMinus size={16} />
            </QuantityButton>
            <QuantityInput
              type="number"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                )
              }
            />
            <QuantityButton
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= 10}
            >
              <FiPlus size={16} />
            </QuantityButton>
          </QuantityControls>
        </QuantitySection>

        <ActionButtons>
          <PrimaryButton
            onClick={handleAddToCart}
            disabled={!isCurrentSelectionInStock()}
          >
            <FiShoppingCart size={20} />
            {!selectedSize
              ? "Select Size"
              : !selectedColor
              ? "Select Color"
              : isCurrentSelectionInStock()
              ? "Add to Cart"
              : "Out of Stock"}
          </PrimaryButton>

          <SecondaryButton
            onClick={handleFavoriteToggle}
            $isActive={isFavorite}
          >
            <FiHeart size={20} fill={isFavorite ? "currentColor" : "none"} />
          </SecondaryButton>

          <SecondaryButton>
            <FiEye size={20} />
          </SecondaryButton>
        </ActionButtons>

        <Features>
          <FeatureList>
            {features.map((feature, index) => (
              <FeatureItem key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureText>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </Features>

        <Description>
          <DescriptionTitle>Product Description</DescriptionTitle>
          <DescriptionText>{product.description}</DescriptionText>
        </Description>

        {/* Reviews Section */}
        <ProductReviews
          productId={product._id}
          userHasPurchased={userHasPurchased}
        />
      </ProductInfo>
    </ProductContainer>
  );
};

export default ProductsDetails;
