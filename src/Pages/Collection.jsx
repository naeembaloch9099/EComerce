import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import {
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiStar,
  FiHeart,
  FiShoppingCart,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { categories } from "../data/dummyData";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import FilterSidebar from "../Components/Products/FilterSidebar";

const CollectionContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 0;
`;

const HeroBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="%23ffffff" opacity="0.1"><polygon points="1000,100 1000,0 0,100"/></svg>');
    background-size: cover;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 2rem;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  justify-content: space-between;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${(props) => (props.$active ? "#3b82f6" : "#e5e7eb")};
  background: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
    color: ${(props) => (props.$active ? "white" : "#3b82f6")};
  }
`;

const MainFilterButton = styled.button`
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
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
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }
`;

const ViewControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ViewModeButton = styled.button`
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  background: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#2563eb" : "#f3f4f6")};
  }
`;

const SortSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  background: white;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 350px;
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

const ProductBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: ${(props) =>
    props.$type === "bestseller"
      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      : props.$type === "new"
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProductActions = styled.div`
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
  background: rgba(255, 255, 255, 0.9);
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    color: ${(props) => (props.$favorite ? "#ef4444" : "#3b82f6")};
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  background: ${(props) => (props.$active ? "#3b82f6" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: ${(props) => (props.$active ? "#2563eb" : "#f8fafc")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Collection = () => {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    priceMin: "",
    priceMax: "",
    categories: [],
    brands: [],
    colors: [],
    sizes: [],
    rating: 0,
  });

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        console.log(
          "🔄 Collection: Fetching products from:",
          `${API_URL}/api/products`
        );
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Collection: Fetched products:", data);
          console.log(
            "📦 Collection: Number of products:",
            data.data?.products?.length || 0
          );
          setProducts(data.data.products || []);
        } else {
          console.error(
            "❌ Collection: Failed to fetch products, status:",
            response.status
          );
        }
      } catch (error) {
        console.error("❌ Collection: Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Listen for real-time product updates (including deletions)
    const handleProductUpdate = (event) => {
      console.log(
        "🔄 Collection: Received product update event:",
        event.detail
      );
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

  // Get category from URL params
  useEffect(() => {
    const category = searchParams.get("category") || "";
    setSelectedCategory(category);
  }, [searchParams]);

  // Filter products based on category
  useEffect(() => {
    console.log("🔍 Collection: Filtering products...");
    console.log("📊 Collection: Total products:", products.length);
    console.log("🏷️ Collection: Selected category:", selectedCategory);
    console.log("🔧 Collection: Sort by:", sortBy);

    let filtered = products;

    if (selectedCategory) {
      filtered = products.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase() ||
          product.subcategory?.toLowerCase() === selectedCategory.toLowerCase()
      );
      console.log("📋 Collection: After category filter:", filtered.length);
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
        case "rating":
          return (b.rating || 4.5) - (a.rating || 4.5);
        default:
          return 0;
      }
    });

    console.log("✅ Collection: Final filtered products:", filtered.length);
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategory, sortBy]);

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    // Apply filters to products
    let filtered = products;

    if (selectedCategory) {
      filtered = products.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase() ||
          product.subcategory?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply additional filters
    if (newFilters.priceMin) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(newFilters.priceMin)
      );
    }

    if (newFilters.priceMax) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(newFilters.priceMax)
      );
    }

    if (newFilters.categories && newFilters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        newFilters.categories.some(
          (cat) =>
            product.category.toLowerCase().includes(cat) ||
            product.subcategory?.toLowerCase().includes(cat)
        )
      );
    }

    if (newFilters.brands && newFilters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        newFilters.brands.some((brand) =>
          product.brand?.toLowerCase().includes(brand)
        )
      );
    }

    if (newFilters.rating > 0) {
      filtered = filtered.filter(
        (product) => (product.rating || 4.5) >= newFilters.rating
      );
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
        case "rating":
          return (b.rating || 4.5) - (a.rating || 4.5);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart(product, "M", 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleFavoriteToggle = (product) => {
    if (!isAuthenticated) {
      toast.error("Please login to add favorites");
      return;
    }
    toggleFavorite(product);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const getCategoryTitle = () => {
    if (!selectedCategory) return "All Collections";
    return (
      categories.find((cat) => cat.id === selectedCategory)?.name ||
      selectedCategory.toUpperCase()
    );
  };

  return (
    <CollectionContainer>
      <HeroBanner>
        <HeroContent>
          <HeroTitle>{getCategoryTitle()}</HeroTitle>
          <HeroSubtitle>
            Discover our curated selection of premium fashion pieces designed
            for the modern lifestyle
          </HeroSubtitle>
        </HeroContent>
      </HeroBanner>

      <ContentWrapper>
        <FilterSection>
          <FilterGroup>
            <MainFilterButton onClick={() => setIsFilterSidebarOpen(true)}>
              <FiFilter size={20} />
              Advanced Filters
              {(activeFilters.categories.length > 0 ||
                activeFilters.brands.length > 0 ||
                activeFilters.colors.length > 0 ||
                activeFilters.sizes.length > 0 ||
                activeFilters.rating > 0 ||
                activeFilters.priceMin ||
                activeFilters.priceMax) && (
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "50%",
                    width: "8px",
                    height: "8px",
                    display: "block",
                    marginLeft: "0.25rem",
                  }}
                />
              )}
            </MainFilterButton>

            <FilterButton
              $active={!selectedCategory}
              onClick={() => setSelectedCategory("")}
            >
              All Products
            </FilterButton>
            {categories.map((category) => (
              <FilterButton
                key={category.id}
                $active={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </FilterButton>
            ))}
          </FilterGroup>

          <ViewControls></ViewControls>
        </FilterSection>

        {currentProducts.length > 0 ? (
          <>
            <ProductsGrid>
              {currentProducts.map((product) => (
                <ProductCard key={product._id}>
                  <ProductImageContainer>
                    <ProductImage
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      alt={product.images?.[0]?.alt || product.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x300?text=No+Image";
                      }}
                    />
                    {product.bestseller && (
                      <ProductBadge $type="bestseller">Bestseller</ProductBadge>
                    )}
                    <ProductActions>
                      <ActionButton
                        $favorite
                        onClick={() => handleFavoriteToggle(product)}
                      >
                        <FiHeart
                          size={16}
                          fill={isFavorite(product._id) ? "#ef4444" : "none"}
                          color={
                            isFavorite(product._id) ? "#ef4444" : "#374151"
                          }
                        />
                      </ActionButton>
                    </ProductActions>
                  </ProductImageContainer>

                  <ProductInfo>
                    <ProductBrand>
                      {product.brand || product.category}
                    </ProductBrand>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>
                      <Price>${product.price}</Price>
                      <Rating>
                        <FiStar fill="#fbbf24" color="#fbbf24" size={16} />
                        <span
                          style={{ color: "#6b7280", fontSize: "0.875rem" }}
                        >
                          {product.rating || "4.5"}
                        </span>
                      </Rating>
                    </ProductPrice>
                    <AddToCartButton
                      onClick={() => handleAddToCart(product)}
                      disabled={product.totalStock === 0}
                    >
                      <FiPlus size={16} />
                      {product.totalStock === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </AddToCartButton>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductsGrid>

            {totalPages > 1 && (
              <Pagination>
                <PaginationButton
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <FiArrowLeft size={16} />
                  Previous
                </PaginationButton>

                {[...Array(totalPages)].map((_, index) => (
                  <PaginationButton
                    key={index + 1}
                    $active={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationButton>
                ))}

                <PaginationButton
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <FiArrowRight size={16} />
                </PaginationButton>
              </Pagination>
            )}
          </>
        ) : (
          <NoProducts>
            <FiX size={64} color="#9ca3af" style={{ marginBottom: "1rem" }} />
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              No products found
            </h3>
            <p style={{ color: "#6b7280" }}>
              Try adjusting your filters or browse all products
            </p>
          </NoProducts>
        )}
      </ContentWrapper>

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
    </CollectionContainer>
  );
};

export default Collection;
