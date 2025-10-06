import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiCheckCircle,
  FiHome,
  FiPackage,
  FiDownload,
  FiFileText,
} from "react-icons/fi";
import { downloadOrderPDF } from "../../utils/pdfGenerator";
import { downloadSimpleOrderPDF } from "../../utils/simplePdfGenerator";
import OrderPreview from "../../Components/Common/OrderPreview";
import { useCart } from "../../context/CartContext";
import { useOrder } from "../../context/OrderContext";
import { ORDER_STATES } from "../../constants/orderConstants";
import toast from "react-hot-toast";

const ConfirmationContainer = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 2rem;
  animation: bounce 1s ease-in-out;

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${(props) =>
    props.$primary
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    }
  `
      : `
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
    
    &:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }
  `}
`;

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, clearCart } = useCart();
  const { confirmOrder, canClearCart } = useOrder();
  const [orderData, setOrderData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hasProcessedOrder, setHasProcessedOrder] = useState(false);

  // Handle order data initialization
  useEffect(() => {
    // Only process if we haven't already processed an order
    if (hasProcessedOrder) return;

    // Get order data from navigation state
    const { orderData: navOrderData, shouldClearCart } = location.state || {};

    // Use navigation order data if available
    if (navOrderData) {
      setOrderData(navOrderData);

      // Confirm the order in the order context
      confirmOrder({
        orderId: navOrderData.orderNumber,
        confirmation: navOrderData,
      });

      // Clear cart only after successful navigation and order confirmation
      if (shouldClearCart && cartItems.length > 0 && canClearCart()) {
        clearCart();
        toast.success("Order confirmed! Cart has been cleared.");
      }

      setHasProcessedOrder(true);
      return;
    }

    const createMockOrderData = () => {
      // Create sample order data if none is provided
      return {
        orderNumber: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        customerInfo: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
        },
        shippingAddress: {
          street: "123 Main Street",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
        },
        items:
          cartItems.length > 0
            ? cartItems.map((item) => ({
                name: item.name,
                brand: item.brand || "Rabbit Store",
                image: item.image,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.price,
              }))
            : [
                {
                  name: "Premium Cotton T-Shirt",
                  brand: "Rabbit Store",
                  image: "/api/placeholder/100/100",
                  size: "M",
                  color: "Navy Blue",
                  quantity: 2,
                  price: 29.99,
                },
                {
                  name: "Casual Denim Jeans",
                  brand: "Rabbit Store",
                  image: "/api/placeholder/100/100",
                  size: "32",
                  color: "Dark Blue",
                  quantity: 1,
                  price: 79.99,
                },
              ],
        subtotal: 139.97,
        shipping: 9.99,
        tax: 11.2,
        total: 161.16,
      };
    };

    // Get order data from location state or create mock data
    const orderInfo = location.state?.orderData || createMockOrderData();
    setOrderData(orderInfo);

    // Clear cart after successful order (only if we have items and haven't processed yet)
    if (cartItems.length > 0) {
      clearCart();
    }

    setHasProcessedOrder(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, hasProcessedOrder]); // Intentionally limited dependencies to prevent infinite loop

  const handleDownloadPDF = () => {
    if (orderData) {
      try {
        // Try the advanced PDF generator first
        downloadOrderPDF(orderData, `invoice-${orderData.orderNumber}.pdf`);
      } catch (error) {
        console.warn(
          "Advanced PDF generation failed, using simple version:",
          error
        );
        // Fallback to simple PDF generator
        downloadSimpleOrderPDF(
          orderData,
          `invoice-${orderData.orderNumber}.pdf`
        );
      }
    }
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ConfirmationContainer>
        <SuccessIcon>
          <FiCheckCircle />
        </SuccessIcon>

        <Title>Order Confirmed!</Title>

        <Message>
          Thank you for your purchase! Your order{" "}
          <strong>{orderData.orderNumber}</strong> has been successfully placed
          and will be processed shortly. You'll receive a confirmation email
          with tracking details once your order ships.
        </Message>

        <ButtonGroup>
          <Button $primary onClick={() => navigate("/")}>
            <FiHome size={20} />
            Continue Shopping
          </Button>

          <Button onClick={() => setShowPreview(!showPreview)}>
            <FiFileText size={20} />
            {showPreview ? "Hide" : "View"} Invoice
          </Button>

          <Button onClick={handleDownloadPDF}>
            <FiDownload size={20} />
            Download PDF
          </Button>
        </ButtonGroup>
      </ConfirmationContainer>

      {showPreview && (
        <OrderPreview orderData={orderData} onDownloadPDF={handleDownloadPDF} />
      )}
    </>
  );
};

export default OrderConfirmation;
