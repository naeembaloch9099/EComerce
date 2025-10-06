import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiStar, FiUser, FiCalendar, FiCheck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const ReviewContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ReviewForm = styled.form`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${(props) => (props.$filled ? "#fbbf24" : "#d1d5db")};
  transition: color 0.2s ease;
  padding: 0.25rem;

  &:hover {
    color: #fbbf24;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px;
    ring-color: rgba(59, 130, 246, 0.2);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ReviewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ReviewItem = styled.div`
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ReviewerAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const ReviewerDetails = styled.div``;

const ReviewerName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const ReviewDate = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ReviewRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
`;

const ReviewText = styled.p`
  color: #374151;
  line-height: 1.6;
  margin: 0;
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
`;

const ProductReviews = ({ productId, userHasPurchased }) => {
  console.log("🔍 ProductReviews: Received props:");
  console.log("📦 productId:", productId);
  console.log("🛒 userHasPurchased:", userHasPurchased);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  console.log("🔐 ProductReviews: isAuthenticated:", isAuthenticated);
  console.log("👤 ProductReviews: user:", user?.name || "No user");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/products/${productId}/reviews`
        );
        if (response.ok) {
          const data = await response.json();
          setReviews(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId, API_URL]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to leave a review");
      return;
    }

    if (!userHasPurchased) {
      toast.error("You can only review products you've purchased");
      return;
    }

    if (newReview.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setSubmitting(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetch(
        `${API_URL}/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
          body: JSON.stringify(newReview),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setReviews((prev) => [data.data, ...prev]);
        setNewReview({ rating: 0, comment: "" });
        toast.success("Review submitted successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, index) => (
      <StarButton
        key={index}
        type="button"
        $filled={index < rating}
        onClick={interactive ? () => onStarClick(index + 1) : undefined}
        style={{ cursor: interactive ? "pointer" : "default" }}
      >
        <FiStar size={20} fill={index < rating ? "currentColor" : "none"} />
      </StarButton>
    ));
  };

  const canReview =
    isAuthenticated &&
    userHasPurchased &&
    !reviews.some((review) => review.user?._id === user?._id);

  return (
    <ReviewContainer>
      <SectionTitle>
        <FiStar />
        Customer Reviews ({reviews.length})
      </SectionTitle>

      {canReview && (
        <ReviewForm onSubmit={handleSubmitReview}>
          <FormGroup>
            <Label>Your Rating</Label>
            <StarRating>
              {renderStars(newReview.rating, true, (rating) =>
                setNewReview((prev) => ({ ...prev, rating }))
              )}
            </StarRating>
          </FormGroup>

          <FormGroup>
            <Label>Your Review</Label>
            <TextArea
              value={newReview.comment}
              onChange={(e) =>
                setNewReview((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Share your experience with this product..."
              maxLength={500}
            />
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                textAlign: "right",
              }}
            >
              {newReview.comment.length}/500
            </div>
          </FormGroup>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </SubmitButton>
        </ReviewForm>
      )}

      {!isAuthenticated && (
        <div
          style={{
            background: "#fef3c7",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
            color: "#92400e",
          }}
        >
          Please login to leave a review
        </div>
      )}

      {isAuthenticated && !userHasPurchased && (
        <div
          style={{
            background: "#fee2e2",
            padding: "1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
            color: "#991b1b",
          }}
        >
          You can only review products you've purchased
        </div>
      )}

      <ReviewsList>
        {loading ? (
          <div>Loading reviews...</div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewItem key={review._id}>
              <ReviewHeader>
                <ReviewerInfo>
                  <ReviewerAvatar>
                    {review.user?.name?.charAt(0).toUpperCase() || "?"}
                  </ReviewerAvatar>
                  <ReviewerDetails>
                    <ReviewerName>
                      {review.user?.name || "Anonymous"}
                    </ReviewerName>
                    <ReviewDate>
                      <FiCalendar size={14} />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </ReviewDate>
                  </ReviewerDetails>
                </ReviewerInfo>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <ReviewRating>{renderStars(review.rating)}</ReviewRating>
                  {/* Since backend now verifies purchases, all reviews are from verified purchasers */}
                  <VerifiedBadge>
                    <FiCheck size={12} />
                    Verified Purchase
                  </VerifiedBadge>
                </div>
              </ReviewHeader>
              <ReviewText>{review.comment}</ReviewText>
            </ReviewItem>
          ))
        ) : (
          <EmptyState>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💭</div>
            <h4>No Reviews Yet</h4>
            <p>Be the first to review this product!</p>
          </EmptyState>
        )}
      </ReviewsList>
    </ReviewContainer>
  );
};

export default ProductReviews;
