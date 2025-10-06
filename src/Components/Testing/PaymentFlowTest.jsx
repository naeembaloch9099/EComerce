import React, { useState } from "react";
import styled from "styled-components";
import { useOrder } from "../../context/OrderContext";
import { ORDER_STATES } from "../../constants/orderConstants";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const TestContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 1rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;

const StateDisplay = styled.div`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  font-family: monospace;
  white-space: pre-wrap;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  background: ${(props) => {
    switch (props.status) {
      case ORDER_STATES.IDLE:
        return "#f3f4f6";
      case ORDER_STATES.PROCESSING:
        return "#fef3c7";
      case ORDER_STATES.PAYMENT_PENDING:
        return "#fbbf24";
      case ORDER_STATES.PAYMENT_PROCESSING:
        return "#f59e0b";
      case ORDER_STATES.PAYMENT_SUCCESS:
        return "#10b981";
      case ORDER_STATES.PAYMENT_FAILED:
        return "#ef4444";
      case ORDER_STATES.ORDER_CONFIRMED:
        return "#059669";
      case ORDER_STATES.ORDER_FAILED:
        return "#dc2626";
      default:
        return "#6b7280";
    }
  }};
  color: ${(props) => {
    switch (props.status) {
      case ORDER_STATES.IDLE:
        return "#374151";
      case ORDER_STATES.PROCESSING:
        return "#92400e";
      case ORDER_STATES.PAYMENT_PENDING:
        return "#92400e";
      case ORDER_STATES.PAYMENT_PROCESSING:
        return "#92400e";
      case ORDER_STATES.PAYMENT_SUCCESS:
        return "white";
      case ORDER_STATES.PAYMENT_FAILED:
        return "white";
      case ORDER_STATES.ORDER_CONFIRMED:
        return "white";
      case ORDER_STATES.ORDER_FAILED:
        return "white";
      default:
        return "white";
    }
  }};
`;

const PaymentFlowTest = () => {
  const {
    orderState,
    startOrder,
    initiatePayment,
    setPaymentProcessing,
    setPaymentSuccess,
    setPaymentFailed,
    confirmOrder,
    resetOrder,
    isOrderInProgress,
    canClearCart,
    isPaymentPending,
    isPaymentComplete,
  } = useOrder();

  const { cartItems, clearCart } = useCart();
  const [testData, setTestData] = useState({
    customerName: "John Doe",
    email: "john@example.com",
    amount: 99.99,
  });

  const mockOrderData = {
    orderNumber: `TEST-${Date.now()}`,
    orderDate: new Date().toISOString(),
    customerInfo: {
      name: testData.customerName,
      email: testData.email,
      phone: "+1 (555) 123-4567",
    },
    total: testData.amount,
    items:
      cartItems.length > 0
        ? cartItems
        : [
            {
              name: "Test Product",
              price: testData.amount,
              quantity: 1,
              image: "/placeholder-image.jpg",
            },
          ],
  };

  const mockPaymentData = {
    id: `STRIPE_${Date.now()}`,
    status: "COMPLETED",
    amount: testData.amount,
    currency: "USD",
    payer: {
      email: testData.email,
      name: testData.customerName,
    },
    timestamp: new Date().toISOString(),
    method: "Stripe Card",
  };

  const simulateCompleteFlow = async () => {
    try {
      // Step 1: Start Order
      startOrder(mockOrderData);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 2: Initiate Payment
      initiatePayment("stripe", { amount: testData.amount });
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 3: Set Payment Processing
      setPaymentProcessing();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 4: Payment Success
      setPaymentSuccess(mockPaymentData);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 5: Confirm Order
      confirmOrder({
        orderId: mockOrderData.orderNumber,
        confirmation: mockOrderData,
      });

      toast.success("Complete payment flow simulated successfully!");
    } catch (error) {
      toast.error("Flow simulation failed: " + error.message);
    }
  };

  const simulatePaymentFailure = async () => {
    try {
      startOrder(mockOrderData);
      await new Promise((resolve) => setTimeout(resolve, 500));

      initiatePayment("stripe", { amount: testData.amount });
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPaymentProcessing();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPaymentFailed({ message: "Payment declined by bank" });

      toast.error("Payment failure simulated");
    } catch (error) {
      toast.error("Failure simulation failed: " + error.message);
    }
  };

  const testCartClearing = () => {
    if (canClearCart()) {
      clearCart();
      toast.success("Cart cleared - Order was confirmed!");
    } else {
      toast.warning("Cannot clear cart - Order not confirmed yet");
    }
  };

  return (
    <TestContainer>
      <h1
        style={{ textAlign: "center", marginBottom: "2rem", color: "#1f2937" }}
      >
        🧪 Payment Flow Testing Dashboard
      </h1>

      <Section>
        <SectionTitle>Current Order State</SectionTitle>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <strong>Status:</strong>
          <StatusBadge status={orderState.status}>
            {orderState.status.toUpperCase().replace("_", " ")}
          </StatusBadge>
        </div>

        <StateDisplay>{JSON.stringify(orderState, null, 2)}</StateDisplay>
      </Section>

      <Section>
        <SectionTitle>Flow Control</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          <Button
            onClick={() => startOrder(mockOrderData)}
            disabled={isOrderInProgress()}
          >
            1️⃣ Start Order
          </Button>

          <Button
            onClick={() =>
              initiatePayment("stripe", { amount: testData.amount })
            }
            disabled={orderState.status === ORDER_STATES.IDLE}
          >
            2️⃣ Initiate Payment
          </Button>

          <Button onClick={setPaymentProcessing} disabled={!isPaymentPending()}>
            3️⃣ Set Processing
          </Button>

          <Button
            onClick={() => setPaymentSuccess(mockPaymentData)}
            disabled={orderState.status !== ORDER_STATES.PAYMENT_PROCESSING}
          >
            4️⃣ Payment Success
          </Button>

          <Button
            onClick={() =>
              confirmOrder({
                orderId: mockOrderData.orderNumber,
                confirmation: mockOrderData,
              })
            }
            disabled={!isPaymentComplete()}
          >
            5️⃣ Confirm Order
          </Button>

          <Button onClick={resetOrder} style={{ background: "#6b7280" }}>
            🔄 Reset Flow
          </Button>
        </div>
      </Section>

      <Section>
        <SectionTitle>Automated Tests</SectionTitle>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            onClick={simulateCompleteFlow}
            style={{ background: "#10b981" }}
            disabled={isOrderInProgress()}
          >
            ✅ Simulate Success Flow
          </Button>

          <Button
            onClick={simulatePaymentFailure}
            style={{ background: "#ef4444" }}
            disabled={isOrderInProgress()}
          >
            ❌ Simulate Payment Failure
          </Button>

          <Button onClick={testCartClearing} style={{ background: "#f59e0b" }}>
            🛒 Test Cart Clearing
          </Button>
        </div>
      </Section>

      <Section>
        <SectionTitle>Helper Functions Status</SectionTitle>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <strong>isOrderInProgress():</strong>
            <span
              style={{
                color: isOrderInProgress() ? "#10b981" : "#ef4444",
                marginLeft: "0.5rem",
              }}
            >
              {isOrderInProgress() ? "TRUE" : "FALSE"}
            </span>
          </div>

          <div>
            <strong>canClearCart():</strong>
            <span
              style={{
                color: canClearCart() ? "#10b981" : "#ef4444",
                marginLeft: "0.5rem",
              }}
            >
              {canClearCart() ? "TRUE" : "FALSE"}
            </span>
          </div>

          <div>
            <strong>isPaymentPending():</strong>
            <span
              style={{
                color: isPaymentPending() ? "#10b981" : "#ef4444",
                marginLeft: "0.5rem",
              }}
            >
              {isPaymentPending() ? "TRUE" : "FALSE"}
            </span>
          </div>

          <div>
            <strong>isPaymentComplete():</strong>
            <span
              style={{
                color: isPaymentComplete() ? "#10b981" : "#ef4444",
                marginLeft: "0.5rem",
              }}
            >
              {isPaymentComplete() ? "TRUE" : "FALSE"}
            </span>
          </div>
        </div>
      </Section>

      <Section>
        <SectionTitle>Cart Information</SectionTitle>
        <p>
          <strong>Cart Items:</strong> {cartItems.length}
        </p>
        {cartItems.length > 0 && (
          <StateDisplay>
            {JSON.stringify(
              cartItems.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })),
              null,
              2
            )}
          </StateDisplay>
        )}
      </Section>
    </TestContainer>
  );
};

export default PaymentFlowTest;
