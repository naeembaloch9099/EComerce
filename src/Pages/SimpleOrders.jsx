import React from "react";
import styled from "styled-components";

const TestContainer = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const TestTitle = styled.h1`
  color: #1f2937;
  margin-bottom: 1rem;
`;

const TestMessage = styled.p`
  color: #6b7280;
  font-size: 1.125rem;
`;

const SimpleOrders = () => {
  return (
    <TestContainer>
      <TestTitle>🛍️ Orders Page Test</TestTitle>
      <TestMessage>
        This is a simple test version of the Orders page to verify routing works
        correctly.
      </TestMessage>
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f8fafc",
          borderRadius: "0.5rem",
        }}
      >
        <p>
          <strong>Route:</strong> /orders
        </p>
        <p>
          <strong>Status:</strong> ✅ Working
        </p>
        <p>
          <strong>Component:</strong> Simple test version
        </p>
      </div>
    </TestContainer>
  );
};

export default SimpleOrders;
