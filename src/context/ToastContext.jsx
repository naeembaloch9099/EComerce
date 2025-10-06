/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import styled from "styled-components";
import CustomToast from "../Components/Common/CustomToast";

const ToastContext = createContext();

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type,
      message,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, duration) => {
      return addToast("success", message, duration);
    },
    [addToast]
  );

  const showError = useCallback(
    (message, duration) => {
      return addToast("error", message, duration);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (message, duration) => {
      return addToast("info", message, duration);
    },
    [addToast]
  );

  const showWarning = useCallback(
    (message, duration) => {
      return addToast("warning", message, duration);
    },
    [addToast]
  );

  // Special toast for login/logout with shorter duration and different styling
  const showAuthToast = useCallback(
    (type, message) => {
      return addToast(type, message, 2000); // 2 seconds for auth toasts
    },
    [addToast]
  );

  // Special logout toast with custom duration
  const showLogoutToast = useCallback(() => {
    return addToast(
      "success",
      "🚪 Logged out successfully! See you soon!",
      2500
    );
  }, [addToast]);

  // Special admin logout toast
  const showAdminLogoutToast = useCallback(() => {
    return addToast(
      "success",
      "🛡️ Admin session ended! Thanks for managing the system!",
      2500
    );
  }, [addToast]);

  // Special login toast with custom duration
  const showLoginToast = useCallback(
    (userName = "User") => {
      return addToast(
        "success",
        `🎉 Welcome back, ${userName}! Login successful!`,
        2500
      );
    },
    [addToast]
  );

  // Special admin login toast
  const showAdminLoginToast = useCallback(
    (userName = "Admin") => {
      return addToast(
        "success",
        `🛡️ Welcome back, ${userName}! Admin access granted!`,
        2500
      );
    },
    [addToast]
  );

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showAuthToast,
    showLogoutToast,
    showAdminLogoutToast,
    showLoginToast,
    showAdminLoginToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <CustomToast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export { ToastProvider, useToast };
export default ToastProvider;
