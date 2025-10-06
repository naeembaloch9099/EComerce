/* eslint-disable react-refresh/only-export-components */
// src/context/OrderContext.jsx
import React, { createContext, useContext, useReducer } from "react";
import { ORDER_STATES } from "../constants/orderConstants";

// Initial State
const initialState = {
  orderState: ORDER_STATES.IDLE,
  orderHistory: [],
  currentOrder: null,
  error: null,
};

// Reducer
function orderReducer(state, action) {
  switch (action.type) {
    case "START_ORDER":
      return {
        ...state,
        orderState: ORDER_STATES.ORDER_STARTED,
        currentOrder: action.payload,
        orderHistory: [...state.orderHistory, action.payload],
      };
    case "PAYMENT_INITIATED":
      return { ...state, orderState: ORDER_STATES.PAYMENT_INITIATED };
    case "PAYMENT_PROCESSING":
      return { ...state, orderState: ORDER_STATES.PAYMENT_PROCESSING };
    case "PAYMENT_SUCCESS":
      return {
        ...state,
        orderState: ORDER_STATES.PAYMENT_SUCCESS,
        currentOrder: {
          ...state.currentOrder,
          payment: action.payload,
        },
      };
    case "PAYMENT_FAILED":
      return {
        ...state,
        orderState: ORDER_STATES.PAYMENT_FAILED,
        error: action.payload,
      };
    case "CONFIRM_ORDER":
      return { ...state, orderState: ORDER_STATES.CONFIRMED };
    case "ORDER_FAILED":
      return {
        ...state,
        orderState: ORDER_STATES.ORDER_FAILED,
        error: action.payload,
      };
    case "RESET_ORDER":
      return initialState;
    default:
      return state;
  }
}

// Create Context
export const OrderContext = createContext();

// Custom Hook
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

// Provider
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  // Actions
  const startOrder = async (orderData) => {
    try {
      console.log("🚀 OrderContext: Starting order creation...");
      dispatch({ type: "START_ORDER", payload: orderData });

      // Save order to database
      const savedOrder = await saveOrderToDatabase(orderData);
      console.log("✅ OrderContext: Order saved to database:", savedOrder);

      return savedOrder;
    } catch (error) {
      console.error("❌ OrderContext: Failed to save order:", error);
      dispatch({ type: "ORDER_FAILED", payload: error.message });
      throw error;
    }
  };

  const saveOrderToDatabase = async (orderData) => {
    console.log("💾 OrderContext: Saving order to database...");

    // Get auth token
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");
    const token = localStorage.getItem("token");
    const authToken = accessToken || token || refreshToken;

    if (!authToken) {
      throw new Error("No authentication token found");
    }

    // Prepare order payload for backend
    const orderPayload = {
      orderItems:
        orderData.items?.map((item) => ({
          product: item.productId || item.id || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
        })) || [],
      shippingAddress: {
        firstName: orderData.customerInfo?.name?.split(" ")[0] || "Unknown",
        lastName:
          orderData.customerInfo?.name?.split(" ").slice(1).join(" ") ||
          "Customer",
        email: orderData.customerInfo?.email,
        phone: orderData.customerInfo?.phone,
        address: orderData.shippingAddress?.street,
        city: orderData.shippingAddress?.city,
        state: orderData.shippingAddress?.state || "N/A",
        zipCode: orderData.shippingAddress?.zipCode,
        country: orderData.shippingAddress?.country || "USA",
      },
      paymentMethod: orderData.paymentMethod || "stripe",
      paymentResult: {
        id: orderData.transactionId,
        status: orderData.paymentStatus || "completed",
        method: orderData.paymentMethod || "stripe",
      },
      itemsPrice: orderData.subtotal || 0,
      taxPrice: orderData.tax || 0,
      shippingPrice: orderData.shipping || 0,
      totalPrice: orderData.total || 0,
      discount: 0,
      couponCode: "",
    };

    console.log("📤 OrderContext: Sending order payload:", orderPayload);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ OrderContext: API error:", errorData);
      throw new Error(errorData.message || "Failed to save order");
    }

    const result = await response.json();
    console.log("✅ OrderContext: Order saved successfully:", result);
    return result.data?.order || result;
  };

  const initiatePayment = () => dispatch({ type: "PAYMENT_INITIATED" });
  const setPaymentProcessing = () => dispatch({ type: "PAYMENT_PROCESSING" });
  const setPaymentSuccess = (paymentResult) =>
    dispatch({ type: "PAYMENT_SUCCESS", payload: paymentResult });
  const setPaymentFailed = (error) =>
    dispatch({ type: "PAYMENT_FAILED", payload: error });
  const confirmOrder = () => dispatch({ type: "CONFIRM_ORDER" });
  const setOrderFailed = (error) =>
    dispatch({ type: "ORDER_FAILED", payload: error });
  const resetOrder = () => dispatch({ type: "RESET_ORDER" });

  // Helpers
  const isOrderInProgress =
    state.orderState !== ORDER_STATES.IDLE &&
    state.orderState !== ORDER_STATES.CONFIRMED &&
    state.orderState !== ORDER_STATES.ORDER_FAILED;

  const isPaymentPending =
    state.orderState === ORDER_STATES.PAYMENT_INITIATED ||
    state.orderState === ORDER_STATES.PAYMENT_PROCESSING;

  const isPaymentComplete = state.orderState === ORDER_STATES.PAYMENT_SUCCESS;
  const canClearCart = state.orderState === ORDER_STATES.CONFIRMED;

  return (
    <OrderContext.Provider
      value={{
        ...state,
        startOrder,
        initiatePayment,
        setPaymentProcessing,
        setPaymentSuccess,
        setPaymentFailed,
        confirmOrder,
        setOrderFailed,
        resetOrder,
        isOrderInProgress,
        isPaymentPending,
        isPaymentComplete,
        canClearCart,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
