import React from "react";
import styled from "styled-components";
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiArrowRight,
  FiStar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const FavoritesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
`;

const FavoritesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const FavoritesCount = styled.div`
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const ClearAllButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FavoriteCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 300px;
  background: #f8fafc;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${FavoriteCard}:hover & {
    transform: scale(1.08);
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: scale(0.8);

  ${FavoriteCard}:hover & {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    background: #ef4444;
    color: white;
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductBrand = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
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

const Price = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  color: #059669;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 0.875rem;
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
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: #ef4444;
`;

const EmptyTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const EmptyDescription = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const ShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
  }
`;

const Favorites = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart(product, "M", 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRemoveFavorite = (product) => {
    removeFromFavorites(product.id);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all favorites?")) {
      clearFavorites();
    }
  };

  if (favorites.length === 0) {
    return (
      <FavoritesContainer>
        <Container>
          <Header>
            <Title>My Favorites</Title>
            <Subtitle>Save your favorite items and shop them later</Subtitle>
          </Header>

          <EmptyState>
            <EmptyIcon>
              <FiHeart size={48} />
            </EmptyIcon>
            <EmptyTitle>No Favorites Yet</EmptyTitle>
            <EmptyDescription>
              Start browsing our collection and add items to your favorites by
              clicking the heart icon. Your saved items will appear here for
              easy access.
            </EmptyDescription>
            <ShopButton to="/collection">
              Start Shopping
              <FiArrowRight size={20} />
            </ShopButton>
          </EmptyState>
        </Container>
      </FavoritesContainer>
    );
  }

  return (
    <FavoritesContainer>
      <Container>
        <Header>
          <Title>My Favorites</Title>
          <Subtitle>Your carefully curated collection of loved items</Subtitle>
        </Header>

        <FavoritesHeader>
          <FavoritesCount>
            <h2>
              {favorites.length} Item{favorites.length !== 1 ? "s" : ""}
            </h2>
            <p>Items you've saved for later</p>
          </FavoritesCount>
          <ClearAllButton
            onClick={handleClearAll}
            disabled={favorites.length === 0}
          >
            <FiTrash2 size={16} />
            Clear All
          </ClearAllButton>
        </FavoritesHeader>

        <FavoritesGrid>
          {favorites.map((product) => (
            <FavoriteCard key={product.id}>
              <ImageContainer>
                <ProductImage src={product.image} alt={product.name} />
                <RemoveButton onClick={() => handleRemoveFavorite(product)}>
                  <FiHeart size={18} fill="currentColor" />
                </RemoveButton>
              </ImageContainer>

              <ProductInfo>
                <ProductBrand>{product.brand}</ProductBrand>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>
                  <Price>${product.price}</Price>
                  <Rating>
                    <FiStar fill="#fbbf24" color="#fbbf24" size={16} />
                    <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      {product.rating || "4.5"}
                    </span>
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
            </FavoriteCard>
          ))}
        </FavoritesGrid>

        <div style={{ textAlign: "center" }}>
          <ShopButton to="/collection">
            Continue Shopping
            <FiArrowRight size={20} />
          </ShopButton>
        </div>
      </Container>
    </FavoritesContainer>
  );
};

export default Favorites;
