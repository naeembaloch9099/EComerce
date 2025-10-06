import React, { useState } from "react";
import styled from "styled-components";
import { FiShoppingCart, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import StripePaymentGateway from "../Components/Payment/StripePaymentGateway";
import toast, { Toaster } from "react-hot-toast";

const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: white;
`;

const DemoTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const DemoSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CartPreview = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  height: fit-content;
`;

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #374151;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const ItemDescription = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ItemPrice = styled.div`
  font-weight: 700;
  color: #111827;
`;

const CartTotal = styled.div`
  border-top: 2px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  &.total {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #e5e7eb;
  }
`;

const PaymentSection = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const StatusMessage = styled.div`
  background: ${(props) =>
    props.type === "success"
      ? "#10B981"
      : props.type === "error"
      ? "#EF4444"
      : "#3B82F6"};
  color: white;
  padding: 1rem 2rem;
  margin: 1rem 0;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
`;

const ResetButton = styled.button`
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem auto;
  transition: all 0.3s ease;

  &:hover {
    background: #4b5563;
    transform: translateY(-1px);
  }
`;

const FeatureList = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const FeatureItem = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  margin: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

const PaymentDemo = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  const cartItems = [
    {
      id: 1,
      name: "Premium Sneakers",
      description: "High-quality running shoes",
      price: 129.99,
    },
    {
      id: 2,
      name: "Casual T-Shirt",
      description: "100% cotton, comfortable fit",
      price: 24.99,
    },
    {
      id: 3,
      name: "Denim Jeans",
      description: "Classic blue jeans",
      price: 79.99,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = 9.99;
  const total = subtotal + tax + shipping;

  const handlePaymentSuccess = (data) => {
    console.log("Payment successful:", data);
    setPaymentStatus("success");
    setPaymentData(data);
    toast.success("🎉 Payment completed successfully!");
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    setPaymentStatus("error");
    setPaymentData(error);
    toast.error("❌ Payment failed. Please try again.");
  };

  const resetDemo = () => {
    setPaymentStatus(null);
    setPaymentData(null);
    toast.success("Demo reset successfully!");
  };

  return (
    <DemoContainer>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <DemoHeader>
        <DemoTitle>Stripe Payment Demo</DemoTitle>
        <DemoSubtitle>
          Experience our new Stripe-powered payment system with advanced card
          processing, digital wallets (Google Pay, Apple Pay), and enhanced
          security features.
        </DemoSubtitle>

        <FeatureList>
          <FeatureItem>✨ Real-time card validation</FeatureItem>
          <FeatureItem>🔒 256-bit SSL encryption</FeatureItem>
          <FeatureItem>📱 Google Pay & Apple Pay</FeatureItem>
          <FeatureItem>💳 All major card types</FeatureItem>
          <FeatureItem>🛡️ PCI compliant</FeatureItem>
          <FeatureItem>⚡ Lightning fast</FeatureItem>
        </FeatureList>
      </DemoHeader>

      <DemoGrid>
        <CartPreview>
          <CartHeader>
            <FiShoppingCart />
            Shopping Cart
          </CartHeader>

          {cartItems.map((item) => (
            <CartItem key={item.id}>
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemInfo>
              <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
            </CartItem>
          ))}

          <CartTotal>
            <TotalRow>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </TotalRow>
            <TotalRow>
              <span>Tax (8%):</span>
              <span>${tax.toFixed(2)}</span>
            </TotalRow>
            <TotalRow>
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </TotalRow>
            <TotalRow className="total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </TotalRow>
          </CartTotal>

          {paymentStatus && (
            <StatusMessage type={paymentStatus}>
              {paymentStatus === "success" ? (
                <>
                  <FiCheck />
                  Payment Successful!
                </>
              ) : (
                <>
                  <FiX />
                  Payment Failed
                </>
              )}
            </StatusMessage>
          )}

          {paymentData && (
            <div
              style={{
                background: "#f8fafc",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginTop: "1rem",
                fontSize: "0.875rem",
              }}
            >
              <strong>Payment Details:</strong>
              <pre
                style={{
                  marginTop: "0.5rem",
                  fontSize: "0.75rem",
                  background: "white",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  overflow: "auto",
                }}
              >
                {JSON.stringify(paymentData, null, 2)}
              </pre>
            </div>
          )}

          {paymentStatus && (
            <ResetButton onClick={resetDemo}>
              <FiRefreshCw />
              Reset Demo
            </ResetButton>
          )}
        </CartPreview>

        <PaymentSection>
          <StripePaymentGateway
            amount={total}
            currency="USD"
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </PaymentSection>
      </DemoGrid>
    </DemoContainer>
  );
};

export default PaymentDemo;
