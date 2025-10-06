const PDFDocument = require("pdfkit");

// Generate PDF invoice
const generateInvoicePDF = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("📄 Generating PDF invoice for order:", order.orderNumber);

      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: `Invoice ${order.orderNumber}`,
          Author: "Rabbit Store",
          Subject: "Order Invoice",
          Creator: "Rabbit Store System",
        },
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        console.log(
          "✅ PDF generated successfully, size:",
          pdfData.length,
          "bytes"
        );
        resolve(pdfData);
      });
      doc.on("error", reject);

      // Header with company logo area
      doc
        .fontSize(24)
        .fillColor("#059669")
        .text("🐰 RABBIT STORE", 50, 50)
        .fontSize(12)
        .fillColor("#6b7280")
        .text("Premium Fashion & Lifestyle", 50, 80)
        .text("Email: support@rabbitstore.com", 50, 95)
        .text("Phone: +1 (555) 123-4567", 50, 110);

      // Invoice header
      doc
        .fontSize(28)
        .fillColor("#1f2937")
        .text("INVOICE", 400, 50)
        .fontSize(12)
        .fillColor("#6b7280")
        .text(`Invoice #${order.orderNumber}`, 400, 85)
        .text(
          `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
          400,
          100
        )
        .text(`Status: ${order.status.toUpperCase()}`, 400, 115);

      // Horizontal line
      doc
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .moveTo(50, 140)
        .lineTo(550, 140)
        .stroke();

      // Customer information
      const yPos = 160;
      doc
        .fontSize(16)
        .fillColor("#1f2937")
        .text("Bill To:", 50, yPos)
        .fontSize(12)
        .fillColor("#374151");

      const customerName =
        order.user?.name ||
        `${order.shippingAddress?.firstName || ""} ${
          order.shippingAddress?.lastName || ""
        }`.trim() ||
        "Valued Customer";

      doc
        .text(customerName, 50, yPos + 25)
        .text(
          order.user?.email || order.shippingAddress?.email || "N/A",
          50,
          yPos + 40
        );

      // Shipping address
      if (order.shippingAddress) {
        doc
          .text("Ship To:", 300, yPos)
          .text(
            `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            300,
            yPos + 25
          )
          .text(order.shippingAddress.addressLine1, 300, yPos + 40);

        if (order.shippingAddress.addressLine2) {
          doc.text(order.shippingAddress.addressLine2, 300, yPos + 55);
        }

        doc
          .text(
            `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
            300,
            yPos + 70
          )
          .text(order.shippingAddress.country, 300, yPos + 85);
      }

      // Items table
      const tableTop = 280;
      const tableHeaders = ["Item", "Qty", "Price", "Total"];
      const colWidths = [250, 60, 80, 80];
      let xPos = 50;

      // Table header
      doc
        .fontSize(12)
        .fillColor("#374151")
        .rect(50, tableTop, 470, 25)
        .fillAndStroke("#f8fafc", "#e5e7eb");

      tableHeaders.forEach((header, i) => {
        doc
          .fillColor("#1f2937")
          .font("Helvetica-Bold")
          .text(header, xPos + 5, tableTop + 8, {
            width: colWidths[i],
            align: i === 0 ? "left" : "center",
          });
        xPos += colWidths[i];
      });

      // Table rows
      let yPosition = tableTop + 25;
      let subtotal = 0;

      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach((item, index) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;

          // Alternate row colors
          if (index % 2 === 0) {
            doc
              .rect(50, yPosition, 470, 25)
              .fillAndStroke("#fafafa", "#f1f5f9");
          }

          xPos = 50;
          doc.fillColor("#374151").font("Helvetica").fontSize(10);

          // Item name with size/color
          let itemText = item.name;
          if (item.size) itemText += ` (Size: ${item.size})`;
          if (item.color) itemText += ` (Color: ${item.color})`;

          doc.text(itemText, xPos + 5, yPosition + 8, {
            width: colWidths[0] - 10,
          });
          xPos += colWidths[0];

          doc.text(item.quantity.toString(), xPos + 5, yPosition + 8, {
            width: colWidths[1] - 10,
            align: "center",
          });
          xPos += colWidths[1];

          doc.text(`$${item.price.toFixed(2)}`, xPos + 5, yPosition + 8, {
            width: colWidths[2] - 10,
            align: "center",
          });
          xPos += colWidths[2];

          doc.text(`$${itemTotal.toFixed(2)}`, xPos + 5, yPosition + 8, {
            width: colWidths[3] - 10,
            align: "center",
          });

          yPosition += 25;
        });
      }

      // Totals section
      yPosition += 20;
      const totalsXPos = 350;

      // Calculate totals
      const tax = subtotal * 0.1; // 10% tax
      const shipping = 10; // $10 shipping
      const totalAmount = subtotal + tax + shipping;

      doc.fontSize(11).fillColor("#6b7280");

      doc
        .text("Subtotal:", totalsXPos, yPosition)
        .text(`$${subtotal.toFixed(2)}`, totalsXPos + 120, yPosition, {
          align: "right",
        });
      yPosition += 20;

      doc
        .text("Tax (10%):", totalsXPos, yPosition)
        .text(`$${tax.toFixed(2)}`, totalsXPos + 120, yPosition, {
          align: "right",
        });
      yPosition += 20;

      doc
        .text("Shipping:", totalsXPos, yPosition)
        .text(`$${shipping.toFixed(2)}`, totalsXPos + 120, yPosition, {
          align: "right",
        });
      yPosition += 20;

      // Total line
      doc
        .strokeColor("#059669")
        .lineWidth(1)
        .moveTo(totalsXPos, yPosition)
        .lineTo(520, yPosition)
        .stroke();
      yPosition += 10;

      doc
        .fontSize(14)
        .fillColor("#059669")
        .font("Helvetica-Bold")
        .text("TOTAL:", totalsXPos, yPosition)
        .text(`$${totalAmount.toFixed(2)}`, totalsXPos + 120, yPosition, {
          align: "right",
        });

      // Payment information
      yPosition += 40;
      doc
        .fontSize(12)
        .fillColor("#1f2937")
        .font("Helvetica-Bold")
        .text("Payment Information:", 50, yPosition)
        .font("Helvetica")
        .fillColor("#374151");

      yPosition += 20;
      doc
        .text(
          `Payment Method: ${order.paymentMethod?.toUpperCase() || "N/A"}`,
          50,
          yPosition
        )
        .text(
          `Payment Status: ${order.paymentStatus?.toUpperCase() || "PENDING"}`,
          50,
          yPosition + 15
        );

      // Footer
      yPosition = 750;
      doc
        .fontSize(10)
        .fillColor("#6b7280")
        .text("Thank you for your business!", 50, yPosition, {
          align: "center",
          width: 500,
        })
        .text(
          "For questions about this invoice, contact support@rabbitstore.com",
          50,
          yPosition + 15,
          { align: "center", width: 500 }
        )
        .text(
          "🐰 Rabbit Store - Premium Fashion & Lifestyle",
          50,
          yPosition + 30,
          { align: "center", width: 500 }
        );

      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error("❌ PDF generation failed:", error);
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF,
};
