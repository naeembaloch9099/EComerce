const express = require("express");
const { asyncHandler } = require("../middleware/errorHandler");
const { handleValidationErrors } = require("../middleware/errorHandler");
const { protect, authorize } = require("../middleware/auth");
const Contact = require("../models/Contact");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to generate PDF
const generateContactPDF = (contactData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `contact_${contactData._id}_${Date.now()}.pdf`;
      const filePath = path.join(__dirname, "../temp", fileName);

      // Ensure temp directory exists
      const tempDir = path.join(__dirname, "../temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(24).fillColor("#667eea").text("RABBIT FASHION", 50, 50);

      doc.fontSize(16).fillColor("#666").text("Contact Message Report", 50, 80);

      // Line separator
      doc
        .moveTo(50, 110)
        .lineTo(550, 110)
        .strokeColor("#667eea")
        .lineWidth(2)
        .stroke();

      // Message details
      doc
        .fontSize(14)
        .fillColor("#333")
        .text("Message Details", 50, 130, { underline: true });

      const details = [
        { label: "Name:", value: contactData.name },
        { label: "Email:", value: contactData.email },
        { label: "Subject:", value: contactData.subject },
        { label: "Date Received:", value: contactData.formattedDate },
        { label: "Status:", value: contactData.status.toUpperCase() },
        { label: "Priority:", value: contactData.priority.toUpperCase() },
      ];

      let yPosition = 160;
      details.forEach((detail) => {
        doc
          .fontSize(12)
          .fillColor("#666")
          .text(detail.label, 50, yPosition)
          .fillColor("#333")
          .text(detail.value, 150, yPosition);
        yPosition += 25;
      });

      // Message content
      doc
        .fontSize(14)
        .fillColor("#333")
        .text("Message Content:", 50, yPosition + 20, { underline: true });

      doc
        .fontSize(12)
        .fillColor("#333")
        .text(contactData.message, 50, yPosition + 50, {
          width: 500,
          align: "justify",
        });

      // Footer
      doc
        .fontSize(10)
        .fillColor("#999")
        .text(
          `Generated on ${new Date().toLocaleString()} | Rabbit Fashion Contact System`,
          50,
          doc.page.height - 50,
          { align: "center" }
        );

      doc.end();

      stream.on("finish", () => {
        resolve({ fileName, filePath });
      });

      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Get client info
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    // Create contact message
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
    });

    console.log("📧 New contact message received:", {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
    });

    // Generate PDF
    let pdfInfo = null;
    try {
      pdfInfo = await generateContactPDF(contact);
      console.log("📄 PDF generated:", pdfInfo.fileName);
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
    }

    // Send email notification to admin
    try {
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Message</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Rabbit Fashion Contact System</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Message Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${contact.name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0; color: #333;">${contact.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0; color: #333;">${
                    contact.subject
                  }</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                  <td style="padding: 8px 0; color: #333;">${
                    contact.formattedDate
                  }</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #333; margin-top: 0;">Message:</h3>
              <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${
                contact.message
              }</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; font-size: 14px;">
                📧 Reply to: <a href="mailto:${
                  contact.email
                }" style="color: #667eea;">${contact.email}</a>
              </p>
              <p style="color: #666; font-size: 14px;">
                🔗 View in admin panel: <a href="${
                  process.env.FRONTEND_URL || "http://localhost:5173"
                }/admin" style="color: #667eea;">Admin Dashboard</a>
              </p>
            </div>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"Rabbit Fashion Contact" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || "admin@rabbitfashion.com",
        subject: `🆕 New Contact Message: ${contact.subject}`,
        html: emailHtml,
        attachments: pdfInfo
          ? [
              {
                filename: pdfInfo.fileName,
                path: pdfInfo.filePath,
              },
            ]
          : [],
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Admin email notification sent");

      // Send confirmation email to user
      try {
        const userEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0;">Thank You for Contacting Us!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Rabbit Fashion</p>
            </div>
            
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello ${contact.name},</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for reaching out to us! We have received your message and will get back to you as soon as possible.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">Your Message Summary:</h3>
                <p style="color: #666; margin: 5px 0;"><strong>Subject:</strong> ${contact.subject}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Message:</strong></p>
                <p style="color: #666; background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">${contact.message}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Our team typically responds within 24-48 hours. If you have any urgent questions, please don't hesitate to contact us directly.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #333; font-weight: bold;">Best regards,</p>
                <p style="color: #667eea; font-weight: bold;">The Rabbit Fashion Team</p>
              </div>
            </div>
            
            <div style="background: #333; padding: 20px; text-align: center;">
              <p style="color: #999; margin: 0; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this email.
              </p>
            </div>
          </div>
        `;

        const userMailOptions = {
          from: `"Rabbit Fashion" <${process.env.SMTP_USER}>`,
          to: contact.email,
          subject: `✅ Message Received - Thank You for Contacting Rabbit Fashion`,
          html: userEmailHtml,
        };

        await transporter.sendMail(userMailOptions);
        console.log(`✅ Confirmation email sent to user: ${contact.email}`);
      } catch (error) {
        console.error("❌ Error sending user confirmation email:", error);
      }

      // Clean up PDF file after sending
      if (pdfInfo && fs.existsSync(pdfInfo.filePath)) {
        setTimeout(() => {
          fs.unlinkSync(pdfInfo.filePath);
          console.log("🗑️ Temporary PDF file deleted");
        }, 10000); // Delete after 10 seconds
      }
    } catch (error) {
      console.error("❌ Error sending email:", error);
    }

    res.status(201).json({
      status: "success",
      message: "Message sent successfully! We'll get back to you soon.",
      data: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject,
        createdAt: contact.createdAt,
      },
    });
  })
);

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact
// @access  Private/Admin
router.get(
  "/",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);
    const unreadCount = await Contact.getUnreadCount();

    res.status(200).json({
      status: "success",
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          total,
          limit,
        },
        unreadCount,
      },
    });
  })
);

// @desc    Get single contact message (Admin)
// @route   GET /api/contact/:id
// @access  Private/Admin
router.get(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact message not found",
      });
    }

    // Mark as read if it's new
    if (contact.status === "new") {
      await contact.markAsRead();
    }

    res.status(200).json({
      status: "success",
      data: { contact },
    });
  })
);

// @desc    Download contact message as PDF (Admin)
// @route   GET /api/contact/:id/pdf
// @access  Private/Admin
router.get(
  "/:id/pdf",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact message not found",
      });
    }

    try {
      const pdfInfo = await generateContactPDF(contact);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${pdfInfo.fileName}"`
      );

      const fileStream = fs.createReadStream(pdfInfo.filePath);
      fileStream.pipe(res);

      // Clean up file after download
      fileStream.on("end", () => {
        setTimeout(() => {
          if (fs.existsSync(pdfInfo.filePath)) {
            fs.unlinkSync(pdfInfo.filePath);
            console.log("🗑️ PDF file deleted after download");
          }
        }, 5000);
      });
    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to generate PDF",
      });
    }
  })
);

// @desc    Update contact message status (Admin)
// @route   PUT /api/contact/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const { status, priority, adminNotes } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact message not found",
      });
    }

    if (status) contact.status = status;
    if (priority) contact.priority = priority;
    if (adminNotes !== undefined) contact.adminNotes = adminNotes;

    if (status === "replied" && contact.status !== "replied") {
      contact.repliedAt = new Date();
    }

    await contact.save();

    res.status(200).json({
      status: "success",
      message: "Contact message updated successfully",
      data: { contact },
    });
  })
);

// @desc    Delete contact message (Admin)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact message not found",
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Contact message deleted successfully",
    });
  })
);

// @desc    Get unread count for notifications (Admin)
// @route   GET /api/contact/admin/unread-count
// @access  Private/Admin
router.get(
  "/admin/unread-count",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const unreadCount = await Contact.getUnreadCount();

    res.status(200).json({
      status: "success",
      data: { unreadCount },
    });
  })
);

// @desc    Send reply to contact message
// @route   POST /api/contact/reply
// @access  Private/Admin
router.post(
  "/reply",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const {
      contactId,
      replySubject,
      replyMessage,
      customerEmail,
      customerName,
    } = req.body;

    // Validation
    if (!contactId || !replySubject || !replyMessage || !customerEmail) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
      });
    }

    // Find the original contact message
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Contact message not found",
      });
    }

    try {
      // Send reply email
      const mailOptions = {
        from: `"Rabbit Fashion Support" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: replySubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reply from Rabbit Fashion</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 2rem; font-weight: bold;">RABBIT FASHION</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 1.1rem;">Customer Support Reply</p>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <div style="margin-bottom: 30px;">
                  <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 1.5rem;">Hello ${
                    customerName || "Valued Customer"
                  },</h2>
                  <p style="color: #4b5563; margin: 0 0 20px 0; font-size: 1rem; line-height: 1.6;">
                    Thank you for contacting Rabbit Fashion. We have received your message and here is our response:
                  </p>
                </div>

                <!-- Original Message Reference -->
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #667eea;">
                  <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 1rem;">Your Original Message:</h4>
                  <p style="color: #6b7280; margin: 0; font-size: 0.9rem; font-style: italic;">"${
                    contact.subject
                  }"</p>
                </div>

                <!-- Reply Message -->
                <div style="background-color: #fefefe; padding: 25px; border-radius: 12px; border: 2px solid #e5e7eb; margin-bottom: 30px;">
                  <h4 style="color: #1f2937; margin: 0 0 15px 0; font-size: 1.2rem;">Our Response:</h4>
                  <div style="color: #374151; line-height: 1.7; font-size: 1rem; white-space: pre-wrap;">${replyMessage}</div>
                </div>

                <!-- Contact Info -->
                <div style="background-color: #eff6ff; padding: 20px; border-radius: 12px; border: 1px solid #dbeafe;">
                  <h4 style="color: #1e40af; margin: 0 0 15px 0; font-size: 1.1rem;">Need Further Assistance?</h4>
                  <p style="color: #1e3a8a; margin: 0 0 10px 0; font-size: 0.95rem;">
                    📧 Email: ${
                      process.env.SMTP_USER || "support@rabbitfashion.com"
                    }<br>
                    🌐 Website: <a href="http://localhost:5173" style="color: #2563eb; text-decoration: none;">Visit Our Store</a><br>
                    ⏰ Response Time: Within 24 hours
                  </p>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #1f2937; padding: 30px; text-align: center;">
                <p style="color: #9ca3af; margin: 0 0 10px 0; font-size: 0.9rem;">
                  © 2025 Rabbit Fashion. All rights reserved.
                </p>
                <p style="color: #6b7280; margin: 0; font-size: 0.8rem;">
                  This is an automated response from our customer support system.
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`📧 Reply sent to ${customerEmail} for contact ${contactId}`);

      // Update contact status and add reply info
      await Contact.findByIdAndUpdate(contactId, {
        status: "replied",
        replyInfo: {
          repliedAt: new Date(),
          replySubject,
          replyMessage,
          repliedBy: req.user.email,
        },
      });

      res.status(200).json({
        status: "success",
        message: "Reply sent successfully",
      });
    } catch (error) {
      console.error("Error sending reply:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to send reply",
        error: error.message,
      });
    }
  })
);

module.exports = router;
