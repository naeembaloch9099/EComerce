import React from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

const TestContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid #e5e7eb;
`;

const TestButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0.25rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;

  &.success {
    background: #10b981;
    color: white;
  }

  &.error {
    background: #ef4444;
    color: white;
  }

  &.cart {
    background: #3b82f6;
    color: white;
  }
`;

const ToastTester = () => {
  const { addToCart } = useCart();

  const testToasts = () => {
    toast.success("Success toast test!");
    toast.error("Error toast test!");
    toast("Info toast test!");
  };

  const testCartAdd = () => {
    const testProduct = {
      id: 999,
      name: "Test Product",
      price: 29.99,
      image: "/api/placeholder/100/100",
    };
    addToCart(testProduct, "M", 1);
  };

  return (
    <TestContainer>
      <div
        style={{
          fontSize: "0.75rem",
          marginBottom: "0.5rem",
          fontWeight: "bold",
        }}
      >
        Toast Tester
      </div>
      <div>
        <TestButton
          className="success"
          onClick={() => toast.success("Success!")}
        >
          Success
        </TestButton>
        <TestButton className="error" onClick={() => toast.error("Error!")}>
          Error
        </TestButton>
        <TestButton className="cart" onClick={testCartAdd}>
          Add to Cart
        </TestButton>
        <TestButton onClick={testToasts}>Test All</TestButton>
      </div>
    </TestContainer>
  );
};

export default ToastTester;
