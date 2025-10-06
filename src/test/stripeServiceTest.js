// Quick test to verify Stripe service works in dummy mode
import stripeService from "../services/stripeService.js";

console.log("🧪 Testing Stripe Service in Dummy Mode");

// Test card validation
console.log("✅ Card validation test:");
console.log(
  "Valid card (4242424242424242):",
  stripeService.validateCardNumber("4242424242424242")
);
console.log("Invalid card (123):", stripeService.validateCardNumber("123"));

// Test card type detection
console.log("✅ Card type detection test:");
console.log("Visa:", stripeService.getCardType("4242424242424242"));
console.log("Mastercard:", stripeService.getCardType("5555555555554444"));
console.log("Amex:", stripeService.getCardType("378282246310005"));

// Test card formatting
console.log("✅ Card formatting test:");
console.log("Formatted:", stripeService.formatCardNumber("4242424242424242"));

// Test simulated payment
console.log("✅ Testing simulated payment...");
const testPayment = async () => {
  try {
    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent(50.0, "USD");
    console.log("Payment intent created:", paymentIntent);

    // Process card payment
    const cardDetails = {
      number: "4242 4242 4242 4242",
      expiry: "12/30",
      cvv: "123",
      name: "TEST USER",
    };

    const result = await stripeService.processCardPayment(
      cardDetails,
      paymentIntent.id
    );
    console.log("Payment successful:", result);

    // Generate receipt
    const receipt = stripeService.generateReceiptData(result.paymentIntent);
    console.log("Receipt generated:", receipt);
  } catch (error) {
    console.error("Payment failed:", error);
  }
};

testPayment();

export default {};
