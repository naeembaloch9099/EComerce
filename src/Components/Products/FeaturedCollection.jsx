import React from "react";
import styled, { keyframes } from "styled-components";
import {
  FiArrowRight,
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiEye,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const FeaturedContainer = styled.section`
  padding: 6rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 20%,
        rgba(59, 130, 246, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(139, 92, 246, 0.1) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const Badge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937 0%, #3b82f6 50%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
`;

const ViewAllButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    color: #1d4ed8;
    transform: translateX(5px);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  animation: ${fadeInUp} 0.8s ease-out;
  animation-delay: ${(props) => props.$delay || "0s"};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 400px;
  background: #f8fafc;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${ProductCard}:hover & {
    transform: scale(1.1);
  }
`;

const ProductBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${(props) =>
    props.$type === "featured"
      ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      : props.$type === "new"
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s ease;

  ${ProductCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ActionButton = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${(props) =>
      props.$favorite ? "#ef4444" : props.$cart ? "#3b82f6" : "#1f2937"};
    color: white;
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }
`;

const QuickViewOverlay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 1rem;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;

  ${ProductCard}:hover & {
    transform: translateY(0);
    opacity: 1;
  }
`;

const QuickViewButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
  }
`;

const ProductInfo = styled.div`
  padding: 2rem;
`;

const ProductBrand = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CurrentPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: #059669;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const Discount = styled.span`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RatingStars = styled.div`
  display: flex;
  gap: 0.125rem;
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.25rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FeaturedCollection = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Mock featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      brand: "Rabbit Fashion",
      price: 29.99,
      originalPrice: 39.99,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.8,
      reviews: 124,
      badge: "featured",
      stock: 15,
    },
    {
      id: 2,
      name: "Elegant Summer Dress",
      brand: "Rabbit Fashion",
      price: 79.99,
      originalPrice: 99.99,
      image:
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.9,
      reviews: 89,
      badge: "new",
      stock: 8,
    },
    {
      id: 3,
      name: "Classic Denim Jacket",
      brand: "Rabbit Fashion",
      price: 89.99,
      originalPrice: 120.0,
      image:
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 4.7,
      reviews: 156,
      badge: "sale",
      stock: 12,
    },
    {
      id: 4,
      name: "Luxury Cashmere Sweater",
      brand: "Rabbit Fashion",
      price: 149.99,
      originalPrice: 199.99,
      image:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      rating: 5.0,
      reviews: 78,
      badge: "featured",
      stock: 5,
    },
  ];

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    // Toast notification is now handled in CartContext
    addToCart(product, "M", 1);
  };

  const handleFavoriteToggle = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }
    toggleFavorite(product);
  };

  const handleQuickView = (product) => {
    toast.success(`Quick view for ${product.name} - Coming soon!`);
  };

  const calculateDiscount = (original, current) => {
    return Math.round(((original - current) / original) * 100);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        size={14}
        fill={index < Math.floor(rating) ? "#fbbf24" : "none"}
        color={index < Math.floor(rating) ? "#fbbf24" : "#d1d5db"}
      />
    ));
  };

  return (
    <FeaturedContainer>
      <Container>
        <SectionHeader>
          <Badge>Handpicked for You</Badge>
          <SectionTitle>Featured Collection</SectionTitle>
          <SectionDescription>
            Discover our most popular and trending items, carefully curated for
            style and quality.
          </SectionDescription>
          <ViewAllButton to="/collection">
            View All Products
            <FiArrowRight size={16} />
          </ViewAllButton>
        </SectionHeader>

        <ProductGrid>
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} $delay={`${index * 0.1}s`}>
              <ImageContainer>
                <ProductImage src={product.image} alt={product.name} />
                <ProductBadge $type={product.badge}>
                  {product.badge === "featured"
                    ? "Featured"
                    : product.badge === "new"
                    ? "New"
                    : `${calculateDiscount(
                        product.originalPrice,
                        product.price
                      )}% Off`}
                </ProductBadge>

                <ActionButtons>
                  <ActionButton
                    $favorite
                    onClick={() => handleFavoriteToggle(product)}
                    title="Add to Favorites"
                  >
                    <FiHeart
                      size={16}
                      fill={isFavorite(product.id) ? "#ef4444" : "none"}
                    />
                  </ActionButton>
                  <ActionButton
                    $cart
                    onClick={() => handleAddToCart(product)}
                    title="Add to Cart"
                  >
                    <FiShoppingCart size={16} />
                  </ActionButton>
                </ActionButtons>

                <QuickViewOverlay>
                  <QuickViewButton onClick={() => handleQuickView(product)}>
                    <FiEye size={16} />
                    Quick View
                  </QuickViewButton>
                </QuickViewOverlay>
              </ImageContainer>

              <ProductInfo>
                <ProductBrand>{product.brand}</ProductBrand>
                <ProductName>{product.name}</ProductName>

                <ProductPrice>
                  <PriceGroup>
                    <CurrentPrice>${product.price}</CurrentPrice>
                    {product.originalPrice > product.price && (
                      <>
                        <OriginalPrice>${product.originalPrice}</OriginalPrice>
                        <Discount>
                          -
                          {calculateDiscount(
                            product.originalPrice,
                            product.price
                          )}
                          %
                        </Discount>
                      </>
                    )}
                  </PriceGroup>

                  <Rating>
                    <RatingStars>{renderStars(product.rating)}</RatingStars>
                    <RatingText>({product.reviews})</RatingText>
                  </Rating>
                </ProductPrice>

                <AddToCartButton
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  <FiShoppingCart size={16} />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </AddToCartButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      </Container>
    </FeaturedContainer>
  );
};

export default FeaturedCollection;
