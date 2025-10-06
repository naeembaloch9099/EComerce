import jsPDF from "jspdf";

export const generateSimpleOrderPDF = (orderData) => {
  const doc = new jsPDF();

  // Company Header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, 210, 40, "F");

  // Company Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("RABBIT STORE", 20, 25);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Fashion & Lifestyle", 20, 32);

  // Order Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("ORDER INVOICE", 20, 55);

  // Order Details Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");

  const orderInfo = [
    ["Order Number:", orderData.orderNumber || "ORD-" + Date.now()],
    ["Order Date:", new Date().toLocaleDateString()],
    ["Customer Name:", orderData.customerInfo?.name || "N/A"],
    ["Email:", orderData.customerInfo?.email || "N/A"],
    ["Phone:", orderData.customerInfo?.phone || "N/A"],
  ];

  let yPosition = 70;
  orderInfo.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 20, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(value, 80, yPosition);
    yPosition += 8;
  });

  // Shipping Address
  yPosition += 10;
  doc.setFont("helvetica", "bold");
  doc.text("SHIPPING ADDRESS:", 20, yPosition);
  yPosition += 8;

  doc.setFont("helvetica", "normal");
  const address = orderData.shippingAddress || {};
  doc.text(`${address.street || "N/A"}`, 20, yPosition);
  yPosition += 6;
  doc.text(
    `${address.city || "N/A"}, ${address.state || "N/A"} ${
      address.zipCode || "N/A"
    }`,
    20,
    yPosition
  );
  yPosition += 6;
  doc.text(`${address.country || "N/A"}`, 20, yPosition);

  // Products Section (Simple List)
  yPosition += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ORDER ITEMS:", 20, yPosition);

  yPosition += 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // Table headers
  doc.setFont("helvetica", "bold");
  doc.text("Product", 20, yPosition);
  doc.text("Size", 80, yPosition);
  doc.text("Color", 110, yPosition);
  doc.text("Qty", 140, yPosition);
  doc.text("Price", 160, yPosition);
  doc.text("Total", 185, yPosition);

  // Line under headers
  doc.line(20, yPosition + 2, 200, yPosition + 2);
  yPosition += 10;

  doc.setFont("helvetica", "normal");

  orderData.items?.forEach((item) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);

    doc.text(`${item.name || "N/A"}`, 20, yPosition);
    doc.text(`${item.size || "N/A"}`, 80, yPosition);
    doc.text(`${item.color || "N/A"}`, 110, yPosition);
    doc.text(`${item.quantity || 1}`, 140, yPosition);
    doc.text(`$${(item.price || 0).toFixed(2)}`, 160, yPosition);
    doc.text(`$${itemTotal.toFixed(2)}`, 185, yPosition);
    yPosition += 8;

    // Add a new page if we're running out of space
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Order Summary
  yPosition += 15;

  // Summary box
  doc.setFillColor(248, 250, 252);
  doc.rect(120, yPosition, 70, 40, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(120, yPosition, 70, 40);

  const subtotal = orderData.subtotal || 0;
  const shipping = orderData.shipping || 0;
  const tax = orderData.tax || 0;
  const total = orderData.total || subtotal + shipping + tax;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 125, yPosition + 8);
  doc.text(`$${subtotal.toFixed(2)}`, 175, yPosition + 8);

  doc.text("Shipping:", 125, yPosition + 16);
  doc.text(`$${shipping.toFixed(2)}`, 175, yPosition + 16);

  doc.text("Tax:", 125, yPosition + 24);
  doc.text(`$${tax.toFixed(2)}`, 175, yPosition + 24);

  doc.setFont("helvetica", "bold");
  doc.text("Total:", 125, yPosition + 32);
  doc.text(`$${total.toFixed(2)}`, 175, yPosition + 32);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Thank you for your business!", 20, pageHeight - 30);
  doc.text(
    "For support, contact us at support@rabbitstore.com",
    20,
    pageHeight - 22
  );
  doc.text("This is a computer-generated invoice.", 20, pageHeight - 14);

  return doc;
};

export const downloadSimpleOrderPDF = (orderData, filename) => {
  const doc = generateSimpleOrderPDF(orderData);
  doc.save(filename || `order-${orderData.orderNumber || Date.now()}.pdf`);
};
