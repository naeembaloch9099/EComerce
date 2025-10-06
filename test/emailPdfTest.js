const {
  sendOrderConfirmationEmail,
  sendStatusChangeEmail,
} = require("../services/emailService");
const { generateInvoicePDF } = require("../services/pdfService");

// Test data
const testOrder = {
  orderNumber: "ORD-20241224-001",
  status: "pending",
  customerEmail: "test@example.com",
  customerName: "John Doe",
  customerAddress: {
    street: "123 Main St",
    city: "Test City",
    state: "TC",
    zipCode: "12345",
    country: "USA",
  },
  items: [
    {
      name: "Test Product 1",
      quantity: 2,
      price: 29.99,
    },
    {
      name: "Test Product 2",
      quantity: 1,
      price: 49.99,
    },
  ],
  subtotal: 109.97,
  tax: 10.99,
  shipping: 9.99,
  total: 130.95,
  createdAt: new Date(),
};

async function testEmailAndPdfServices() {
  console.log("🧪 Testing Email and PDF Services...\n");

  try {
    // Test PDF Generation
    console.log("📄 Testing PDF Generation...");
    const pdfBuffer = await generateInvoicePDF(testOrder);
    console.log(
      `✅ PDF generated successfully! Size: ${pdfBuffer.length} bytes\n`
    );

    // Test Order Confirmation Email (with PDF attachment)
    console.log("📧 Testing Order Confirmation Email...");
    const confirmationResult = await sendOrderConfirmationEmail(
      testOrder,
      pdfBuffer
    );
    console.log("Order Confirmation Result:", confirmationResult);
    console.log("");

    // Test Status Change Email
    console.log("📧 Testing Status Change Email...");
    const statusResult = await sendStatusChangeEmail({
      customerEmail: testOrder.customerEmail,
      customerName: testOrder.customerName,
      oldStatus: "pending",
      newStatus: "confirmed",
      orderTotal: testOrder.total,
      orderNumber: testOrder.orderNumber,
    });
    console.log("Status Change Result:", statusResult);
    console.log("");

    console.log("🎉 All tests completed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (
      error.message.includes("ENOTFOUND") ||
      error.message.includes("authentication")
    ) {
      console.log(
        "\n💡 Note: This error is expected if email credentials are not configured."
      );
      console.log(
        "   To enable actual email sending, configure your .env file with valid email credentials."
      );
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testEmailAndPdfServices();
}

module.exports = { testEmailAndPdfServices };
