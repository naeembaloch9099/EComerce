import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsDetails from "../../Components/Products/ProductsDetails";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";

const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0 2rem 2rem 2rem;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    margin: 0 1rem 1rem 1rem;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the product by ID from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data.data.product);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Error loading product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
          Back
        </BackButton>
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <p style={{ color: "#6b7280" }}>Loading product...</p>
        </div>
      </Container>
    );
  }

  // If product not found, show error
  if (!product || error) {
    return (
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft size={20} />
          Back
        </BackButton>
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <h2 style={{ color: "#374151", marginBottom: "1rem" }}>
            Product Not Found
          </h2>
          <p style={{ color: "#6b7280" }}>
            The product you're looking for doesn't exist.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft size={20} />
        Back
      </BackButton>
      <ProductsDetails product={product} />
    </Container>
  );
};

export default ProductDetail;
