import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingCart, FiStar, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem 0;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
  background: #f8fafc;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;

  ${ProductCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;

  &:hover {
    background: white;
    transform: scale(1.1);
    color: ${(props) => props.color || "#3b82f6"};
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${(props) =>
    props.type === "new"
      ? "#10b981"
      : props.type === "sale"
      ? "#ef4444"
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

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductCategory = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const Price = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const Stars = styled.div`
  display: flex;
  color: #fbbf24;
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  margin-left: 0.5rem;
`;

const ColorsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ColorOption = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${(props) => props.color};
  border: 2px solid ${(props) => (props.selected ? "#3b82f6" : "#e5e7eb")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    border-color: #3b82f6;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
`;

const ProductsGrid = ({ products, loading }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      return;
    }
    addToCart(product);
  };

  const handleToggleFavorite = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to save favorites!");
      return;
    }
    toggleFavorite(product);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FiStar key={i} fill="currentColor" />);
    }

    if (hasHalfStar) {
      stars.push(<FiStar key="half" style={{ opacity: 0.5 }} />);
    }

    for (let i = stars.length; i < 5; i++) {
      stars.push(<FiStar key={i} style={{ opacity: 0.3 }} />);
    }

    return stars;
  };

  if (loading) {
    return (
      <GridContainer>
        {[...Array(8)].map((_, index) => (
          <ProductCard key={index}>
            <ImageContainer style={{ background: "#f3f4f6" }}>
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#9ca3af",
                }}
              >
                Loading...
              </div>
            </ImageContainer>
            <ProductInfo>
              <div
                style={{
                  height: "20px",
                  background: "#f3f4f6",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              ></div>
              <div
                style={{
                  height: "24px",
                  background: "#f3f4f6",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              ></div>
              <div
                style={{
                  height: "20px",
                  background: "#f3f4f6",
                  borderRadius: "4px",
                  width: "60%",
                }}
              ></div>
            </ProductInfo>
          </ProductCard>
        ))}
      </GridContainer>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
        <h3
          style={{
            fontSize: "1.5rem",
            marginBottom: "0.5rem",
            color: "#374151",
          }}
        >
          No Products Found
        </h3>
        <p>Try adjusting your filters or check back later for new arrivals.</p>
      </EmptyState>
    );
  }

  return (
    <GridContainer>
      {products.map((product) => (
        <ProductCard
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleViewProduct(product._id)}
        >
          <ImageContainer>
            {product.isNew && <Badge type="new">New</Badge>}
            {product.featured && <Badge type="featured">Featured</Badge>}
            {product.comparePrice && product.comparePrice > product.price && (
              <Badge type="sale">Sale</Badge>
            )}

            <ProductImage
              src={
                product.images?.[0]?.url ||
                "https://via.placeholder.com/280x250?text=No+Image"
              }
              alt={product.images?.[0]?.alt || product.name}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/280x250?text=No+Image";
              }}
            />

            <ActionButtons onClick={(e) => e.stopPropagation()}>
              <ActionButton
                color="#ef4444"
                onClick={() => handleToggleFavorite(product)}
                title={
                  isFavorite(product._id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <FiHeart
                  fill={isFavorite(product._id) ? "currentColor" : "none"}
                  color={isFavorite(product._id) ? "#ef4444" : "currentColor"}
                />
              </ActionButton>
              <ActionButton
                color="#3b82f6"
                onClick={() => handleViewProduct(product._id)}
                title="View details"
              >
                <FiEye />
              </ActionButton>
            </ActionButtons>
          </ImageContainer>

          <ProductInfo>
            <ProductCategory>{product.category}</ProductCategory>
            <ProductName>{product.name}</ProductName>

            <ProductPrice>
              <Price>${product.price}</Price>
              {product.comparePrice && product.comparePrice > product.price && (
                <OriginalPrice>${product.comparePrice}</OriginalPrice>
              )}
            </ProductPrice>

            <Rating>
              <Stars>{renderStars(product.rating)}</Stars>
              <RatingText>
                ({product.rating?.toFixed(1) || "0.0"}) •{" "}
                {product.reviewCount || 0} reviews
              </RatingText>
            </Rating>

            {product.colors && product.colors.length > 0 && (
              <ColorsContainer>
                {product.colors.slice(0, 4).map((color, index) => (
                  <ColorOption
                    key={index}
                    color={color.code}
                    title={color.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      alignSelf: "center",
                    }}
                  >
                    +{product.colors.length - 4} more
                  </span>
                )}
              </ColorsContainer>
            )}

            <AddToCartButton
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              <FiShoppingCart size={18} />
              Add to Cart
            </AddToCartButton>
          </ProductInfo>
        </ProductCard>
      ))}
    </GridContainer>
  );
};

export default ProductsGrid;
