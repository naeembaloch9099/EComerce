import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ auth context
import toast from "react-hot-toast";

// ✅ White background container
const NewArrivalContainer = styled.section`
  padding: 2rem 0;
  background: #ffffff;
  color: #1f2937;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
`;

const Slider = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  will-change: transform;
`;

const SliderWrapper = styled.div`
  overflow: hidden;
  margin: 0 -0.5rem;
  position: relative;
  width: 100%;
`;

const ProductCard = styled(motion.div)`
  flex: 0 0 auto;
  width: 260px;
  margin: 0 0.5rem;
  background: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 0.8rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 160px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
`;

const ProductPrice = styled.p`
  font-size: 0.9rem;
  font-weight: bold;
  color: #2563eb;
`;

const ProductRating = styled.p`
  font-size: 0.8rem;
  color: #f59e0b;
  margin-top: 0.25rem;
`;

// ✅ Progress lines
const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  width: 100%;
`;

const ProgressBar = styled.div`
  flex: 1;
  max-width: 50px;
  height: 4px;
  border-radius: 2px;
  background: ${(props) =>
    props.$active ? "#1f2937" : "rgba(31, 41, 55, 0.2)"};
  transition: all 0.2s ease;
`;

// ✅ Prev/Next buttons
const NavButton = styled.button`
  position: absolute;
  top: 40%;
  transform: translateY(-50%);
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(NavButton)`
  left: -1rem;
`;

const NextButton = styled(NavButton)`
  right: -1rem;
`;

const NewArrival = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch new arrivals from backend
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        console.log("🔄 NewArrival: Fetching new arrivals from backend...");
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/products/new-arrivals/list"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ NewArrival: Fetched new arrivals:", data);

        if (data.status === "success" && data.data) {
          setNewArrivals(data.data.products || []);
          console.log(
            "📊 NewArrival: Set products count:",
            data.data.products?.length || 0
          );
        } else {
          console.error("❌ NewArrival: Backend returned error:", data.message);
          setNewArrivals([]);
        }
      } catch (error) {
        console.error("❌ NewArrival: Error fetching new arrivals:", error);
        setNewArrivals([]);
      } finally {
        setLoading(false);
        console.log("🏁 NewArrival: Loading completed");
      }
    };

    fetchNewArrivals();

    // Listen for real-time product updates
    const handleProductUpdate = (event) => {
      console.log(
        "🔄 NewArrival: Received product update event:",
        event.detail
      );
      // Small delay to ensure backend is updated
      setTimeout(() => {
        fetchNewArrivals();
      }, 500);
    };

    window.addEventListener("productsUpdated", handleProductUpdate);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("productsUpdated", handleProductUpdate);
    };
  }, []);

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(newArrivals.length / itemsPerSlide);
  const maxIndex = Math.max(0, totalSlides - 1);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // ✅ Auth guard for actions
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart!");
      return;
    }
    // Toast notification is now handled in CartContext
    addToCart(product);
  };

  // Calculate item width for slider
  const itemWidth = 100 / itemsPerSlide;

  // Use newArrivals as products for consistency
  const products = newArrivals;

  const handleToggleFavorite = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to save favorites!");
      return;
    }
    toggleFavorite(product);
    toast.success(
      isFavorite(product._id)
        ? `${product.name} removed from favorites!`
        : `${product.name} added to favorites!`
    );
  };

  // Show loading or no products message
  if (loading) {
    return (
      <NewArrivalContainer>
        <Container>
          <SectionHeader>
            <SectionTitle>New Arrivals</SectionTitle>
          </SectionHeader>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading new arrivals...
          </div>
        </Container>
      </NewArrivalContainer>
    );
  }

  if (products.length === 0) {
    return (
      <NewArrivalContainer>
        <Container>
          <SectionHeader>
            <SectionTitle>New Arrivals</SectionTitle>
          </SectionHeader>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            No new arrivals available
          </div>
        </Container>
      </NewArrivalContainer>
    );
  }

  return (
    <NewArrivalContainer>
      <Container>
        <SectionHeader>
          <SectionTitle>New Arrivals</SectionTitle>
        </SectionHeader>

        <SliderWrapper>
          <Slider
            style={{
              transform: `translateX(-${currentIndex * itemWidth}px)`,
            }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} whileHover={{ scale: 1.03 }}>
                <ImageContainer
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <ProductImage
                    src={
                      product.images?.[0]?.url ||
                      "https://via.placeholder.com/260x160?text=No+Image"
                    }
                    alt={product.images?.[0]?.alt || product.name}
                    onError={(e) => {
                      console.log("❌ Image failed to load:", e.target.src);
                      e.target.src =
                        "https://via.placeholder.com/260x160?text=No+Image";
                    }}
                  />
                </ImageContainer>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>${product.price}</ProductPrice>
                  <ProductRating>
                    {"★".repeat(Math.floor(product.rating || 0))}
                    {"☆".repeat(5 - Math.floor(product.rating || 0))}
                  </ProductRating>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <button onClick={() => handleAddToCart(product)}>
                      <FaShoppingCart size={18} />
                    </button>
                    <button onClick={() => handleToggleFavorite(product)}>
                      {isFavorite(product._id) ? (
                        <FaHeart size={18} color="red" />
                      ) : (
                        <FaRegHeart size={18} />
                      )}
                    </button>
                  </div>
                </ProductInfo>
              </ProductCard>
            ))}
          </Slider>

          {/* Prev/Next buttons */}
          <PrevButton onClick={handlePrev} disabled={currentIndex === 0}>
            <FaArrowLeft />
          </PrevButton>
          <NextButton onClick={handleNext} disabled={currentIndex === maxIndex}>
            <FaArrowRight />
          </NextButton>
        </SliderWrapper>

        {/* ✅ Progress lines */}
        <ProgressContainer>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <ProgressBar key={index} $active={index === currentIndex} />
          ))}
        </ProgressContainer>
      </Container>
    </NewArrivalContainer>
  );
};

export default NewArrival;
