import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const WorkingOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Mock orders data for demonstration
  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-10-01",
      status: "Delivered",
      total: 99.99,
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2024-09-28",
      status: "Shipped",
      total: 149.5,
      items: 2,
    },
  ];

  const containerStyle = {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "0 1rem",
  };

  const headerStyle = {
    marginBottom: "2rem",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "0.5rem",
  };

  const subtitleStyle = {
    fontSize: "1.125rem",
    color: "#6b7280",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: "2rem",
    marginBottom: "1rem",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  };

  const buttonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    marginRight: "1rem",
    fontSize: "1rem",
  };

  if (!isAuthenticated) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>My Orders</h1>
          <p style={subtitleStyle}>Please login to view your orders</p>
        </div>

        <div style={cardStyle}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Login Required
            </h3>
            <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
              You need to be logged in to view your order history.
            </p>
            <button style={buttonStyle} onClick={() => navigate("/login")}>
              Login to Account
            </button>
            <button
              style={{ ...buttonStyle, backgroundColor: "#6b7280" }}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Orders</h1>
        <p style={subtitleStyle}>
          Welcome {user?.name || "User"}! Here are your recent orders.
        </p>
      </div>

      {mockOrders.length === 0 ? (
        <div style={cardStyle}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              No Orders Yet
            </h3>
            <p style={{ marginBottom: "2rem", color: "#6b7280" }}>
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <button style={buttonStyle} onClick={() => navigate("/")}>
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div>
          {mockOrders.map((order) => (
            <div key={order.id} style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      color: "#1f2937",
                    }}
                  >
                    Order {order.id}
                  </h3>
                  <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                    <p>Date: {order.date}</p>
                    <p>Items: {order.items}</p>
                    <p>Total: ${order.total}</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "2rem",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      backgroundColor:
                        order.status === "Delivered" ? "#d1fae5" : "#dbeafe",
                      color:
                        order.status === "Delivered" ? "#065f46" : "#1e40af",
                    }}
                  >
                    {order.status}
                  </span>
                  <button
                    style={{
                      ...buttonStyle,
                      fontSize: "0.875rem",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              style={{ ...buttonStyle, backgroundColor: "#6b7280" }}
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingOrders;
