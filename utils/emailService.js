const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Rabbit E-commerce" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully:", {
      messageId: info.messageId,
      to: options.email,
      subject: options.subject,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

// Email templates
const emailTemplates = {
  // Welcome email template
  welcome: (name, verificationUrl) => ({
    subject: "Welcome to Rabbit E-commerce! Please verify your email",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Welcome to Rabbit E-commerce</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Rabbit E-commerce!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Thank you for joining Rabbit E-commerce! We're excited to have you as part of our community.</p>
            <p>To complete your registration and start shopping, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 3px;">
              ${verificationUrl}
            </p>
            <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Rabbit E-commerce. All rights reserved.</p>
            <p>Visit us at: <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Rabbit E-commerce!
    
Hello ${name},

Thank you for joining Rabbit E-commerce! To complete your registration, please verify your email address by visiting:

${verificationUrl}

This verification link will expire in 24 hours.

If you didn't create an account with us, please ignore this email.

Best regards,
Rabbit E-commerce Team`,
  }),

  // Password reset email template
  passwordReset: (name, resetUrl) => ({
    subject: "Password Reset Request - Rabbit E-commerce",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Password Reset - Rabbit E-commerce</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>We received a request to reset your password for your Rabbit E-commerce account.</p>
            <p>To reset your password, click the button below:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 3px;">
              ${resetUrl}
            </p>
            <div class="warning">
              <p><strong>Important Security Information:</strong></p>
              <ul>
                <li>This reset link will expire in 10 minutes for security purposes</li>
                <li>If you didn't request this password reset, please ignore this email</li>
                <li>Your password will remain unchanged until you create a new one</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 Rabbit E-commerce. All rights reserved.</p>
            <p>If you need help, contact us at: ${process.env.EMAIL_FROM}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Password Reset Request - Rabbit E-commerce

Hello ${name},

We received a request to reset your password for your Rabbit E-commerce account.

To reset your password, visit the following link:
${resetUrl}

IMPORTANT:
- This reset link will expire in 10 minutes
- If you didn't request this password reset, please ignore this email
- Your password will remain unchanged until you create a new one

Best regards,
Rabbit E-commerce Team`,
  }),

  // Order confirmation email template
  orderConfirmation: (name, order) => ({
    subject: `Order Confirmation #${order.orderNumber} - Rabbit E-commerce`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Order Confirmation - Rabbit E-commerce</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .item:last-child { border-bottom: none; }
          .total { background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmed!</h1>
            <p>Order #${order.orderNumber}</p>
          </div>
          <div class="content">
            <h2>Thank you for your order, ${name}!</h2>
            <p>We've received your order and will process it shortly. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order Information</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Order Date:</strong> ${new Date(
                order.createdAt
              ).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
              <p><strong>Status:</strong> ${
                order.status.charAt(0).toUpperCase() + order.status.slice(1)
              }</p>
            </div>

            <div class="order-details">
              <h3>Items Ordered</h3>
              ${order.orderItems
                .map(
                  (item) => `
                <div class="item">
                  <p><strong>${item.name}</strong></p>
                  <p>Quantity: ${item.quantity} × PKR ${item.price}</p>
                  ${item.size ? `<p>Size: ${item.size}</p>` : ""}
                  ${item.color ? `<p>Color: ${item.color}</p>` : ""}
                </div>
              `
                )
                .join("")}
            </div>

            <div class="total">
              <h3>Order Summary</h3>
              <p>Subtotal: PKR ${order.subtotal}</p>
              <p>Shipping: PKR ${order.shippingPrice}</p>
              <p>Tax: PKR ${order.taxPrice}</p>
              ${
                order.discount.amount > 0
                  ? `<p>Discount: -PKR ${order.discount.amount}</p>`
                  : ""
              }
              <p><strong>Total: PKR ${order.totalPrice}</strong></p>
            </div>

            <div class="order-details">
              <h3>Shipping Address</h3>
              <p>${order.shippingAddress.firstName} ${
      order.shippingAddress.lastName
    }</p>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city}, ${
      order.shippingAddress.state
    } ${order.shippingAddress.zipCode}</p>
              <p>${order.shippingAddress.country}</p>
              <p>Phone: ${order.shippingAddress.phone}</p>
            </div>

            <p>We'll send you another email when your order ships. You can track your order status in your account.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Rabbit E-commerce. All rights reserved.</p>
            <p>Questions? Contact us at: ${process.env.EMAIL_FROM}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Order Confirmation #${order.orderNumber} - Rabbit E-commerce

Thank you for your order, ${name}!

Order Details:
- Order Number: ${order.orderNumber}
- Order Date: ${new Date(order.createdAt).toLocaleDateString()}
- Status: ${order.status}
- Total: PKR ${order.totalPrice}

We'll send you another email when your order ships.

Best regards,
Rabbit E-commerce Team`,
  }),

  // OTP email template
  otpVerification: (name, otp) => ({
    subject: "Verification Code - Rabbit E-commerce",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Verification Code - Rabbit E-commerce</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .otp-code { background: #ddd6fe; color: #5b21b6; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-radius: 10px; letter-spacing: 8px; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verification Code</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>Here's your verification code for Rabbit E-commerce:</p>
            <div class="otp-code">${otp}</div>
            <p>Enter this code to complete your verification. This code will expire in 10 minutes.</p>
            <p><strong>Important:</strong> Never share this code with anyone. Our team will never ask for this code.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Rabbit E-commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Verification Code - Rabbit E-commerce

Hello ${name},

Your verification code is: ${otp}

Enter this code to complete your verification. This code will expire in 10 minutes.

Important: Never share this code with anyone.

Best regards,
Rabbit E-commerce Team`,
  }),
};

// Send specific email types
const sendWelcomeEmail = async (email, name, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
  const template = emailTemplates.welcome(name, verificationUrl);

  return await sendEmail({
    email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

const sendPasswordResetEmail = async (email, name, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const template = emailTemplates.passwordReset(name, resetUrl);

  return await sendEmail({
    email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

const sendOrderConfirmationEmail = async (email, name, order) => {
  const template = emailTemplates.orderConfirmation(name, order);

  return await sendEmail({
    email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

const sendOTPEmail = async (email, name, otp) => {
  const template = emailTemplates.otpVerification(name, otp);

  return await sendEmail({
    email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOTPEmail,
  emailTemplates,
};
