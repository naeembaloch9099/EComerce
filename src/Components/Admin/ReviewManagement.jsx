import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  FiStar,
  FiUser,
  FiCalendar,
  FiPackage,
  FiCheck,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const FilterBar = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px;
    ring-color: rgba(59, 130, 246, 0.2);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ReviewsTable = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f9fafb;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: 1fr 200px 150px 120px 150px 100px;
  gap: 1rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const ReviewRow = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: 1fr 200px 150px 120px 150px 100px;
  gap: 1rem;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f9fafb;
  }
`;

const ReviewContent = styled.div``;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const ProductName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
`;

const ReviewText = styled.div`
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.125rem;
  color: #fbbf24;
`;

const UserInfo = styled.div``;

const UserName = styled.div`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
`;

const UserEmail = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
`;

const DateInfo = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  justify-self: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &.view {
    background: #3b82f6;
    color: white;
    &:hover {
      background: #2563eb;
    }
  }

  &.delete {
    background: #ef4444;
    color: white;
    &:hover {
      background: #dc2626;
    }
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    fiveStars: 0,
    fourStars: 0,
    threeStars: 0,
    twoStars: 0,
    oneStar: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const refreshToken = localStorage.getItem("refreshToken");

        console.log("🔍 ReviewManagement: Fetching reviews for admin...");

        // Use dedicated admin endpoint for reviews
        const response = await fetch(`${API_URL}/api/products/admin/reviews`, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        console.log("📡 ReviewManagement: Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ ReviewManagement: Reviews data:", data);

          const allReviews = data.data.reviews || [];
          console.log(
            `📊 ReviewManagement: Found ${allReviews.length} reviews`
          );

          // Calculate stats
          const totalReviews = allReviews.length;
          const avgRating =
            totalReviews > 0
              ? allReviews.reduce((sum, review) => sum + review.rating, 0) /
                totalReviews
              : 0;

          const ratingCounts = allReviews.reduce((acc, review) => {
            acc[review.rating] = (acc[review.rating] || 0) + 1;
            return acc;
          }, {});

          setStats({
            total: totalReviews,
            averageRating: avgRating,
            fiveStars: ratingCounts[5] || 0,
            fourStars: ratingCounts[4] || 0,
            threeStars: ratingCounts[3] || 0,
            twoStars: ratingCounts[2] || 0,
            oneStar: ratingCounts[1] || 0,
          });

          setReviews(allReviews);
        } else {
          console.error(
            "❌ ReviewManagement: Failed to fetch reviews, status:",
            response.status
          );
          toast.error("Failed to load reviews");
        }
      } catch (error) {
        console.error("❌ ReviewManagement: Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [API_URL]);

  const filteredReviews = reviews.filter((review) => {
    const userName = review.user?.name || review.name || "";
    const userEmail = review.user?.email || "";

    const matchesSearch =
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "" || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesRating;
  });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        size={14}
        fill={index < rating ? "currentColor" : "none"}
      />
    ));
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <h3>Loading Reviews...</h3>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiStar />
          Review Management
        </Title>
      </Header>

      {/* Statistics */}
      <StatsGrid>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Reviews</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.averageRating.toFixed(1)}</StatValue>
          <StatLabel>Average Rating</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.fiveStars}</StatValue>
          <StatLabel>5 Star Reviews</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.fourStars}</StatValue>
          <StatLabel>4 Star Reviews</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.threeStars}</StatValue>
          <StatLabel>3 Star Reviews</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.twoStars + stats.oneStar}</StatValue>
          <StatLabel>Low Ratings (1-2★)</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Filters */}
      <FilterBar>
        <FiSearch style={{ color: "#6b7280" }} />
        <SearchInput
          type="text"
          placeholder="Search reviews, products, or customer names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </Select>
      </FilterBar>

      {/* Reviews Table */}
      <ReviewsTable>
        <TableHeader>
          <div>Review</div>
          <div>Product</div>
          <div>Customer</div>
          <div>Rating</div>
          <div>Date</div>
          <div>Status</div>
        </TableHeader>

        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewRow key={review._id}>
              <ReviewContent>
                <ReviewText>{review.comment}</ReviewText>
              </ReviewContent>

              <ProductInfo>
                {review.product.images && review.product.images[0] && (
                  <ProductImage
                    src={review.product.images[0].url}
                    alt={review.product.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <ProductName>{review.product.name}</ProductName>
              </ProductInfo>

              <UserInfo>
                <UserName>
                  {review.user?.name || review.name || "Anonymous"}
                </UserName>
                {review.user?.email && (
                  <UserEmail>{review.user.email}</UserEmail>
                )}
              </UserInfo>

              <StarRating>{renderStars(review.rating)}</StarRating>

              <DateInfo>
                {new Date(review.createdAt).toLocaleDateString()}
              </DateInfo>

              <StatusBadge>
                <FiCheck size={12} />
                Verified
              </StatusBadge>
            </ReviewRow>
          ))
        ) : (
          <EmptyState>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💭</div>
            <h3>No Reviews Found</h3>
            <p>
              {searchTerm || ratingFilter
                ? "Try adjusting your filters"
                : "No reviews have been submitted yet"}
            </p>
          </EmptyState>
        )}
      </ReviewsTable>
    </Container>
  );
};

export default ReviewManagement;
