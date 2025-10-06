const nodemailer = require("nodemailer");

// Email configuration
const createTransporter = () => {
  // For development, you can use Gmail or other SMTP
  // For production, use services like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: "gmail", // Change this based on your email provider
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-app-password",
    },
  });
};

// Send order confirmation email with PDF
const sendOrderConfirmationEmail = async (orderData, pdfBuffer) => {
  try {
    const transporter = createTransporter();

    // Handle both direct order object and wrapped order object
    const order = orderData.order || orderData;
    const customerEmail = orderData.customerEmail || order.customerEmail;
    const customerName = orderData.customerName || order.customerName;

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Rabbit Store" <nbcuilahore@gmail.com>',
      to: customerEmail,
      subject: `🎉 Order Confirmation - ${order.orderNumber}`,
      html: generateOrderConfirmationHTML(order, customerName),
      attachments: [
        {
          filename: `invoice-${order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    console.log("📧 Sending order confirmation email to:", customerEmail);
    await transporter.sendMail(mailOptions);
    console.log("✅ Order confirmation email sent successfully");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send order confirmation email:", error);
    return { success: false, error: error.message };
  }
};

// Send status change email
const sendStatusChangeEmail = async (orderData) => {
  try {
    const transporter = createTransporter();

    const {
      customerEmail,
      customerName,
      oldStatus,
      newStatus,
      orderTotal,
      orderNumber,
    } = orderData;

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Rabbit Store" <nbcuilahore@gmail.com>',
      to: customerEmail,
      subject: getStatusEmailSubject(newStatus, orderNumber),
      html: generateStatusChangeHTML(orderData),
    };

    console.log(
      `📧 Sending status change email (${oldStatus} → ${newStatus}) to:`,
      customerEmail
    );
    await transporter.sendMail(mailOptions);
    console.log("✅ Status change email sent successfully");

    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send status change email:", error);
    return { success: false, error: error.message };
  }
};

// Generate order confirmation HTML
const generateOrderConfirmationHTML = (order, customerName) => {
  const baseStyle = `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  const headerStyle = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
    border-radius: 10px 10px 0 0;
  `;

  const contentStyle = `
    padding: 2rem;
    line-height: 1.6;
    color: #333;
  `;

  return `
    <div style="${baseStyle}">
      <div style="${headerStyle}">
        <h1 style="margin: 0; font-size: 2rem;">🎉 Thank You for Your Order!</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9; font-size: 1.1rem;">Order ${
          order.orderNumber
        }</p>
      </div>
      <div style="${contentStyle}">
        <p style="font-size: 1.1rem;">Dear ${customerName},</p>
        
        <p>Thank you for choosing Rabbit Store! Your order has been successfully placed and is now being processed.</p>
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
          <h3 style="margin: 0 0 1rem 0; color: #059669;">📦 Order Summary:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 0.5rem 0; font-weight: bold;">Order Number:</td>
              <td style="padding: 0.5rem 0;">${order.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: bold;">Order Date:</td>
              <td style="padding: 0.5rem 0;">${new Date(
                order.createdAt
              ).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: bold;">Total Amount:</td>
              <td style="padding: 0.5rem 0; font-size: 1.2rem; color: #059669; font-weight: bold;">$${
                order.totalPrice
              }</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: bold;">Items:</td>
              <td style="padding: 0.5rem 0;">${
                order.orderItems?.length || 0
              } item(s)</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; font-weight: bold;">Status:</td>
              <td style="padding: 0.5rem 0; color: #f59e0b; font-weight: bold;">PENDING</td>
            </tr>
          </table>
        </div>

        <div style="background: #ecfdf5; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #10b981;">
          <h4 style="margin: 0 0 0.5rem 0; color: #059669;">📋 Invoice Attached</h4>
          <p style="margin: 0; color: #047857;">Please find your detailed invoice attached as a PDF. Keep this for your records.</p>
        </div>

        <div style="background: #fef3c7; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #f59e0b;">
          <h4 style="margin: 0 0 0.5rem 0; color: #d97706;">🚚 What's Next?</h4>
          <ul style="margin: 0; padding-left: 1.2rem; color: #92400e;">
            <li>We'll confirm your order within 24 hours</li>
            <li>You'll receive tracking information once shipped</li>
            <li>Estimated delivery: 3-5 business days</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 2rem 0;">
          <p style="color: #6b7280;">Questions? Contact us at support@rabbitstore.com</p>
        </div>

        <p style="margin-top: 2rem;">Best regards,<br><strong>The Rabbit Team 🐰</strong></p>
      </div>
    </div>
  `;
};

// Get email subject based on status
const getStatusEmailSubject = (status, orderNumber) => {
  switch (status) {
    case "confirmed":
      return `✅ Order Confirmed - ${orderNumber}`;
    case "shipped":
      return `🚚 Order Shipped - ${orderNumber}`;
    case "delivered":
      return `🎉 Order Delivered - ${orderNumber}`;
    case "cancelled":
      return `❌ Order Cancelled - Refund Processed - ${orderNumber}`;
    default:
      return `📋 Order Update - ${orderNumber}`;
  }
};

// Generate status change HTML
const generateStatusChangeHTML = (orderData) => {
  const { customerName, oldStatus, newStatus, orderTotal, orderNumber } =
    orderData;

  const baseStyle = `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

  const getHeaderStyle = (status) => {
    const colors = {
      confirmed: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      shipped: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      delivered: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      cancelled: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    };
    return `
      background: ${
        colors[status] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      };
      color: white;
      padding: 2rem;
      text-align: center;
      border-radius: 10px 10px 0 0;
    `;
  };

  const contentStyle = `
    padding: 2rem;
    line-height: 1.6;
    color: #333;
  `;

  const getStatusContent = (status) => {
    switch (status) {
      case "confirmed":
        return {
          icon: "🎉",
          title: "Order Confirmed!",
          subtitle: "We're preparing your order",
          message:
            "Great news! Your order has been confirmed and is now being prepared for shipment.",
          nextSteps:
            "We'll notify you once your order has been shipped with tracking information.",
        };
      case "shipped":
        return {
          icon: "📦",
          title: "Order Shipped!",
          subtitle: "Your package is on its way",
          message:
            "Exciting news! Your order has been shipped and is on its way to you.",
          nextSteps:
            "You can track your package using the tracking information provided separately.",
        };
      case "delivered":
        return {
          icon: "🎊",
          title: "Order Delivered!",
          subtitle: "Enjoy your purchase",
          message: "Wonderful! Your order has been successfully delivered.",
          nextSteps:
            "We hope you love your purchase! Please consider leaving a review.",
        };
      case "cancelled":
        return {
          icon: "💰",
          title: "Order Cancelled & Refunded",
          subtitle: "Your money has been returned",
          message: `Your order has been cancelled as requested. Your refund of $${orderTotal} has been processed!`,
          nextSteps:
            "The amount will appear back in your account within 3-5 business days.",
        };
      default:
        return {
          icon: "📋",
          title: "Order Update",
          subtitle: "Status changed",
          message: `Your order status has been updated to: ${status}`,
          nextSteps: "We'll keep you informed of any further updates.",
        };
    }
  };

  const statusInfo = getStatusContent(newStatus);

  return `
    <div style="${baseStyle}">
      <div style="${getHeaderStyle(newStatus)}">
        <h1 style="margin: 0; font-size: 1.8rem;">${statusInfo.icon} ${
    statusInfo.title
  }</h1>
        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">${
          statusInfo.subtitle
        }</p>
      </div>
      <div style="${contentStyle}">
        <p>Dear ${customerName},</p>
        <p>${statusInfo.message}</p>
        
        <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
          <h3 style="margin: 0 0 1rem 0; color: #059669;">Order Details:</h3>
          <p style="margin: 0.5rem 0;"><strong>Order Number:</strong> ${orderNumber}</p>
          <p style="margin: 0.5rem 0;"><strong>Previous Status:</strong> ${oldStatus.toUpperCase()}</p>
          <p style="margin: 0.5rem 0;"><strong>New Status:</strong> ${newStatus.toUpperCase()}</p>
          <p style="margin: 0.5rem 0;"><strong>Order Total:</strong> $${orderTotal}</p>
        </div>

        ${
          newStatus === "cancelled"
            ? `
          <div style="background: #ecfdf5; padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #10b981;">
            <h4 style="margin: 0 0 0.5rem 0; color: #059669;">💳 Refund Processed</h4>
            <p style="margin: 0; color: #047857;">Your refund of $${orderTotal} has been processed and will appear in your account within 3-5 business days.</p>
          </div>
        `
            : ""
        }

        <p>${statusInfo.nextSteps}</p>
        <p>Thank you for choosing Rabbit Store!</p>
        <p style="margin-top: 2rem;">Best regards,<br>The Rabbit Team 🐰</p>
      </div>
    </div>
  `;
};

module.exports = {
  sendOrderConfirmationEmail,
  sendStatusChangeEmail,
};
