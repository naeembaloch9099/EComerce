import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RouteDebugger = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const testRoutes = [
    "/",
    "/orders",
    "/collection",
    "/about",
    "/contact",
    "/payment-demo",
    "/payment-test",
  ];

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "2rem auto",
        backgroundColor: "white",
        borderRadius: "1rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          color: "#1f2937",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        🔍 Route Debugging Dashboard
      </h1>

      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Current Route Information
        </h2>
        <div
          style={{
            background: "#f8fafc",
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
            fontFamily: "monospace",
          }}
        >
          <p>
            <strong>Current Path:</strong> {location.pathname}
          </p>
          <p>
            <strong>Search:</strong> {location.search || "None"}
          </p>
          <p>
            <strong>Hash:</strong> {location.hash || "None"}
          </p>
          <p>
            <strong>State:</strong>{" "}
            {location.state ? JSON.stringify(location.state) : "None"}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Route Navigation Tests
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {testRoutes.map((route) => (
            <button
              key={route}
              onClick={() => navigate(route)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  location.pathname === route ? "#3b82f6" : "#f3f4f6",
                color: location.pathname === route ? "white" : "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.25rem",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              {route === "/" ? "Home" : route.replace("/", "")}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Manual URL Test
        </h2>
        <div
          style={{
            background: "#fef3c7",
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #f59e0b",
          }}
        >
          <p style={{ margin: "0 0 0.5rem 0" }}>
            <strong>Instructions:</strong>
          </p>
          <ol style={{ margin: 0, paddingLeft: "1.5rem" }}>
            <li>
              Copy this URL: <code>http://localhost:5173/orders</code>
            </li>
            <li>Paste it directly in your browser address bar</li>
            <li>Press Enter to navigate</li>
            <li>Check if this debugging page loads</li>
          </ol>
        </div>
      </div>

      <div>
        <h2
          style={{
            fontSize: "1.25rem",
            marginBottom: "1rem",
            color: "#374151",
          }}
        >
          Component Status
        </h2>
        <div
          style={{
            background: "#d1fae5",
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #10b981",
          }}
        >
          <p style={{ margin: 0 }}>
            ✅ RouteDebugger component is rendering correctly
            <br />
            ✅ React Router is working
            <br />
            ✅ Route matching is functional
            <br />
            {location.pathname === "/orders" &&
              "✅ /orders route is accessible"}
          </p>
        </div>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          🔄 Reload Page
        </button>
      </div>
    </div>
  );
};

export default RouteDebugger;
