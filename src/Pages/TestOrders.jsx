import React from "react";

const TestOrders = () => {
  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "white",
        minHeight: "50vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          color: "#1f2937",
          marginBottom: "1rem",
        }}
      >
        🛍️ Orders Page Working!
      </h1>
      <p
        style={{
          fontSize: "1.125rem",
          color: "#6b7280",
        }}
      >
        The /orders route is now functional.
      </p>
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#f0f9ff",
          borderRadius: "0.5rem",
          border: "1px solid #0ea5e9",
        }}
      >
        <p>✅ Route: /orders</p>
        <p>✅ Component: TestOrders</p>
        <p>✅ Status: Working</p>
      </div>
    </div>
  );
};

export default TestOrders;
