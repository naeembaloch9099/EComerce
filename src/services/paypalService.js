// PayPal API Service for Frontend
class PayPalService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  }

  // Create PayPal payment
  async createPayment(paymentData) {
    try {
      const response = await fetch(`${this.baseURL}/paypal/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Payment creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("PayPal payment creation error:", error);
      throw error;
    }
  }

  // Execute PayPal payment
  async executePayment(paymentId, payerId) {
    try {
      const response = await fetch(`${this.baseURL}/paypal/execute-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentId, payerId }),
      });

      if (!response.ok) {
        throw new Error(`Payment execution failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("PayPal payment execution error:", error);
      throw error;
    }
  }

  // Create PayPal order (for newer integration)
  async createOrder(orderData) {
    try {
      const response = await fetch(`${this.baseURL}/paypal/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("PayPal order creation error:", error);
      throw error;
    }
  }

  // Capture PayPal order
  async captureOrder(orderId) {
    try {
      const response = await fetch(`${this.baseURL}/paypal/capture-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error(`Order capture failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("PayPal order capture error:", error);
      throw error;
    }
  }

  // Verify payment status
  async verifyPayment(transactionId) {
    try {
      const response = await fetch(
        `${this.baseURL}/paypal/verify-payment/${transactionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("PayPal payment verification error:", error);
      throw error;
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      const response = await fetch(
        `${this.baseURL}/paypal/payment/${paymentId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to get payment details: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("PayPal get payment details error:", error);
      throw error;
    }
  }

  // Format currency for PayPal
  formatCurrency(amount, currency = "USD") {
    return {
      currency_code: currency,
      value: amount.toFixed(2),
    };
  }

  // Format items for PayPal
  formatItems(items) {
    return items.map((item) => ({
      name: item.name,
      unit_amount: this.formatCurrency(item.price),
      quantity: item.quantity.toString(),
      description: `${item.brand || "Rabbit Store"} - ${item.size} - ${
        item.color
      }`,
      sku:
        item.id ||
        `${item.name.replace(/\s+/g, "-").toLowerCase()}-${item.size}-${
          item.color
        }`,
      category: "PHYSICAL_GOODS",
    }));
  }

  // Calculate totals for PayPal
  calculateTotals(items, shipping = 0, tax = 0) {
    const itemTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalAmount = itemTotal + shipping + tax;

    return {
      item_total: this.formatCurrency(itemTotal),
      shipping: this.formatCurrency(shipping),
      tax_total: this.formatCurrency(tax),
      total_amount: this.formatCurrency(totalAmount),
    };
  }
}

// Export singleton instance
export const paypalService = new PayPalService();
export default PayPalService;
