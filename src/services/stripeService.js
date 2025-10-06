// Stripe Payment Service - Simulation Mode
// This service handles all Stripe payment operations using dummy data

class StripeService {
  constructor() {
    this.publishableKey =
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_demo_key";
    this.apiVersion = "2023-10-16";
    this.demoMode = true;
  }

  // Create payment intent (simulated)
  async createPaymentIntent(amount, currency = "usd", metadata = {}) {
    try {
      console.log("Creating payment intent (simulated):", {
        amount,
        currency,
        metadata,
      });

      const response = await this.simulateBackendCall(
        "/create-payment-intent",
        {
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          metadata,
          automatic_payment_methods: {
            enabled: true,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  // Process card payment (simulated)
  async processCardPayment(cardDetails, paymentIntentId) {
    try {
      console.log("Processing card payment (simulated):", {
        cardDetails,
        paymentIntentId,
      });

      // Validate card details
      if (!this.validateCardNumber(cardDetails.number.replace(/\s/g, ""))) {
        throw new Error("Invalid card number");
      }

      // Simulate payment confirmation
      const result = await this.simulateStripeConfirm(
        paymentIntentId,
        cardDetails
      );
      return result;
    } catch (error) {
      console.error("Error processing card payment:", error);
      throw error;
    }
  }

  // Process Google Pay (simulated)
  async processGooglePay(amount, currency, paymentIntentId) {
    try {
      console.log("Processing Google Pay (simulated)");

      const isAvailable = await this.isGooglePayAvailable();
      if (!isAvailable) {
        throw new Error("Google Pay is not available on this device");
      }

      const result = await this.simulateGooglePayment({
        amount,
        currency,
        paymentIntentId,
      });
      return result;
    } catch (error) {
      console.error("Error processing Google Pay:", error);
      throw error;
    }
  }

  // Process Apple Pay (simulated)
  async processApplePay(amount, currency, paymentIntentId) {
    try {
      console.log("Processing Apple Pay (simulated)");

      const isAvailable = await this.isApplePayAvailable();
      if (!isAvailable) {
        throw new Error("Apple Pay is not available on this device");
      }

      const result = await this.simulateApplePayment({
        amount,
        currency,
        paymentIntentId,
      });
      return result;
    } catch (error) {
      console.error("Error processing Apple Pay:", error);
      throw error;
    }
  }

  // Check Google Pay availability (simulated)
  async isGooglePayAvailable() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAndroidDevice = /Android/.test(navigator.userAgent);
        resolve(isAndroidDevice);
      }, 300);
    });
  }

  // Check Apple Pay availability (simulated)
  async isApplePayAvailable() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
        resolve(isAppleDevice);
      }, 300);
    });
  }

  // Validate card number using Luhn algorithm
  validateCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");

    if (!/^\d+$/.test(cleaned)) return false;
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let alternate = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let n = parseInt(cleaned.charAt(i), 10);

      if (alternate) {
        n *= 2;
        if (n > 9) {
          n = (n % 10) + 1;
        }
      }

      sum += n;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }

  // Get card type from number
  getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, "");

    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    if (/^6(?:011|5)/.test(cleaned)) return "discover";

    return "unknown";
  }

  // Format card number with spaces
  formatCardNumber(value) {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  }

  // Simulate backend API call
  async simulateBackendCall(endpoint, data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);

        const response = {
          id: "pi_" + timestamp + "_" + randomId,
          amount: data.amount,
          currency: data.currency,
          status: "requires_payment_method",
          client_secret: "pi_" + timestamp + "_secret_" + randomId,
          created: Math.floor(timestamp / 1000),
          metadata: data.metadata || {},
        };

        console.log("Simulated backend response:", response);
        resolve(response);
      }, 800);
    });
  }

  // Simulate Stripe payment confirmation
  async simulateStripeConfirm(paymentIntentId, cardDetails) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.05; // 95% success rate

        if (isSuccess) {
          const timestamp = Date.now();

          const result = {
            paymentIntent: {
              id: paymentIntentId,
              status: "succeeded",
              amount: Math.round(Math.random() * 10000 + 1000),
              currency: "usd",
              payment_method: {
                id: "pm_" + timestamp,
                type: "card",
                card: {
                  brand: this.getCardType(cardDetails.number),
                  last4: cardDetails.number.replace(/\s/g, "").slice(-4),
                  exp_month: parseInt(cardDetails.expiry.split("/")[0]),
                  exp_year: parseInt("20" + cardDetails.expiry.split("/")[1]),
                },
              },
              created: Math.floor(timestamp / 1000),
              receipt_email: null,
            },
          };

          console.log("Simulated payment success:", result);
          resolve(result);
        } else {
          const error = {
            error: {
              code: "card_declined",
              message: "Your card was declined.",
              type: "card_error",
            },
          };

          console.log("Simulated payment failure:", error);
          reject(error);
        }
      }, 2000);
    });
  }

  // Simulate Google Pay payment
  async simulateGooglePayment(paymentRequest) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.02; // 98% success rate
        const timestamp = Date.now();

        if (isSuccess) {
          const result = {
            paymentIntent: {
              id: paymentRequest.paymentIntentId || "pi_googlepay_" + timestamp,
              status: "succeeded",
              amount: Math.round(paymentRequest.amount * 100),
              currency: paymentRequest.currency.toLowerCase(),
              payment_method: {
                id: "pm_googlepay_" + timestamp,
                type: "google_pay",
                google_pay: {
                  brand: "visa",
                  last4: "4242",
                },
              },
              created: Math.floor(timestamp / 1000),
            },
          };

          console.log("Simulated Google Pay success:", result);
          resolve(result);
        } else {
          const error = {
            error: {
              code: "payment_failed",
              message: "Google Pay payment failed.",
              type: "payment_error",
            },
          };

          console.log("Simulated Google Pay failure:", error);
          reject(error);
        }
      }, 1500);
    });
  }

  // Simulate Apple Pay payment
  async simulateApplePayment(paymentRequest) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isSuccess = Math.random() > 0.02; // 98% success rate
        const timestamp = Date.now();

        if (isSuccess) {
          const result = {
            paymentIntent: {
              id: paymentRequest.paymentIntentId || "pi_applepay_" + timestamp,
              status: "succeeded",
              amount: Math.round(paymentRequest.amount * 100),
              currency: paymentRequest.currency.toLowerCase(),
              payment_method: {
                id: "pm_applepay_" + timestamp,
                type: "apple_pay",
                apple_pay: {
                  brand: "visa",
                  last4: "4242",
                },
              },
              created: Math.floor(timestamp / 1000),
            },
          };

          console.log("Simulated Apple Pay success:", result);
          resolve(result);
        } else {
          const error = {
            error: {
              code: "payment_failed",
              message: "Apple Pay payment failed.",
              type: "payment_error",
            },
          };

          console.log("Simulated Apple Pay failure:", error);
          reject(error);
        }
      }, 1500);
    });
  }

  // Generate receipt data
  generateReceiptData(paymentIntent) {
    const timestamp = Date.now();

    return {
      transactionId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      paymentMethod: paymentIntent.payment_method?.type || "card",
      timestamp: new Date(paymentIntent.created * 1000).toISOString(),
      receipt: {
        id: "receipt_" + timestamp,
        number: "REC-" + timestamp,
        url: "https://stripe.com/receipts/" + paymentIntent.id,
      },
    };
  }
}

// Export singleton instance
const stripeService = new StripeService();
export default stripeService;
