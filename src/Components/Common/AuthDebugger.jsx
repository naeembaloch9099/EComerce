import React, { useState } from "react";
import { validateToken, makeAuthenticatedRequest } from "../../utils/authUtils";
import { useAuth } from "../../context/AuthContext";

const AuthDebugger = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [testResults, setTestResults] = useState({});
  const { user, isAuthenticated } = useAuth();

  const runDiagnostics = () => {
    console.log("🔍 Running authentication diagnostics...");

    // Check token
    const tokenValidation = validateToken();

    // Check auth context
    const authContextInfo = {
      isAuthenticated,
      user: user
        ? {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          }
        : null,
    };

    setDebugInfo({
      tokenValidation,
      authContextInfo,
      localStorage: {
        hasToken: !!localStorage.getItem("token"),
        tokenLength: localStorage.getItem("token")?.length || 0,
      },
    });
  };

  const testBackendConnection = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const tests = {};

    try {
      // Test 1: Health check
      console.log("Testing backend health...");
      const healthResponse = await fetch(`${API_URL}/api/health`);
      tests.health = {
        status: healthResponse.ok ? "PASS" : "FAIL",
        statusCode: healthResponse.status,
        message: healthResponse.ok
          ? "Backend is running"
          : "Backend not responding",
      };
    } catch (error) {
      tests.health = {
        status: "FAIL",
        error: error.message,
        message: "Backend server is not running",
      };
    }

    try {
      // Test 2: Auth me endpoint
      console.log("Testing auth/me endpoint...");
      const response = await makeAuthenticatedRequest(`${API_URL}/api/auth/me`);
      const data = await response.json();
      tests.authMe = {
        status: "PASS",
        user: data.data?.user,
        message: "Authentication successful",
      };
    } catch (error) {
      tests.authMe = {
        status: "FAIL",
        error: error.message,
        message: "Authentication failed",
      };
    }

    try {
      // Test 3: Admin dashboard endpoint
      console.log("Testing admin dashboard endpoint...");
      await makeAuthenticatedRequest(`${API_URL}/api/admin/dashboard`);
      tests.adminDashboard = {
        status: "PASS",
        message: "Admin access successful",
      };
    } catch (error) {
      tests.adminDashboard = {
        status: "FAIL",
        error: error.message,
        message: "Admin access failed",
      };
    }

    try {
      // Test 4: Admin products endpoint
      console.log("Testing admin products endpoint...");
      await makeAuthenticatedRequest(`${API_URL}/api/products/admin/all`);
      tests.adminProducts = {
        status: "PASS",
        message: "Admin products access successful",
      };
    } catch (error) {
      tests.adminProducts = {
        status: "FAIL",
        error: error.message,
        message: "Admin products access failed",
      };
    }

    setTestResults(tests);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#f8f9fa",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "400px",
        zIndex: 9999,
        fontSize: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", color: "#333" }}>🔧 Auth Debugger</h4>

      <div style={{ marginBottom: "12px" }}>
        <button
          onClick={runDiagnostics}
          style={{
            marginRight: "8px",
            padding: "4px 8px",
            fontSize: "11px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Check Token
        </button>
        <button
          onClick={testBackendConnection}
          style={{
            padding: "4px 8px",
            fontSize: "11px",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Test Backend
        </button>
      </div>

      {debugInfo && (
        <div style={{ marginBottom: "12px" }}>
          <strong>Token Status:</strong>
          <div
            style={{
              padding: "8px",
              background: debugInfo.tokenValidation.valid
                ? "#d4edda"
                : "#f8d7da",
              borderRadius: "4px",
              margin: "4px 0",
            }}
          >
            {debugInfo.tokenValidation.valid ? "✅ Valid" : "❌ Invalid"}
            {debugInfo.tokenValidation.error && (
              <div>Error: {debugInfo.tokenValidation.error}</div>
            )}
          </div>
        </div>
      )}

      {Object.keys(testResults).length > 0 && (
        <div>
          <strong>Backend Tests:</strong>
          {Object.entries(testResults).map(([test, result]) => (
            <div
              key={test}
              style={{
                padding: "4px",
                background: result.status === "PASS" ? "#d4edda" : "#f8d7da",
                borderRadius: "4px",
                margin: "2px 0",
                fontSize: "11px",
              }}
            >
              <strong>{test}:</strong> {result.status === "PASS" ? "✅" : "❌"}{" "}
              {result.message}
              {result.error && (
                <div style={{ color: "#721c24" }}>Error: {result.error}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthDebugger;
