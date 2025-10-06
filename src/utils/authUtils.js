// Token validation utility for debugging (using refresh token)
export const validateToken = () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.error("❌ No refresh token found in localStorage");
    return { valid: false, error: "No refresh token found" };
  }

  try {
    // Decode JWT payload (without verification)
    const base64Payload = refreshToken.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));

    const now = Date.now() / 1000;
    const isExpired = payload.exp < now;

    console.log("🔑 Refresh Token Info:", {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
      issuedAt: new Date(payload.iat * 1000).toLocaleString(),
      expiresAt: new Date(payload.exp * 1000).toLocaleString(),
      isExpired,
      timeLeft: isExpired
        ? 0
        : Math.round((payload.exp - now) / (60 * 60 * 24)) + " days",
    });

    if (isExpired) {
      console.error("❌ Refresh token is expired");
      return { valid: false, error: "Refresh token expired" };
    }

    if (payload.role !== "admin") {
      console.error("❌ User is not admin, role:", payload.role);
      return { valid: false, error: "Not admin user" };
    }

    console.log("✅ Refresh token is valid for admin user");
    return { valid: true, payload };
  } catch (error) {
    console.error("❌ Invalid refresh token format:", error);
    return { valid: false, error: "Invalid refresh token format" };
  }
};

// API request with better error handling (using refresh token)
export const makeAuthenticatedRequest = async (url, options = {}) => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token found. Please login again.");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${refreshToken}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
      throw new Error("Access denied. Admin privileges required.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        "Backend server is not running. Please start the server."
      );
    }
    throw error;
  }
};
