import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateOrderPDF = (orderData) => {
  const doc = new jsPDF();

  // The autoTable plugin should be available after import
  console.log("autoTable available:", typeof doc.autoTable);

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

  // Products Table
  yPosition += 20;
  let finalY;

  // Check if autoTable is available
  if (typeof doc.autoTable === "function") {
    const tableColumns = ["Product", "Size", "Color", "Qty", "Price", "Total"];
    const tableRows = [];

    orderData.items?.forEach((item) => {
      tableRows.push([
        item.name || "N/A",
        item.size || "N/A",
        item.color || "N/A",
        item.quantity?.toString() || "1",
        `$${item.price?.toFixed(2) || "0.00"}`,
        `$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
      ]);
    });

    doc.autoTable({
      startY: yPosition,
      head: [tableColumns],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: 20, right: 20 },
    });

    finalY = doc.lastAutoTable.finalY + 20;
  } else {
    // Fallback: Create table manually if autoTable is not available
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("ORDER ITEMS:", 20, yPosition);

    yPosition += 15;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    orderData.items?.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name || "N/A"}`, 20, yPosition);
      doc.text(`Size: ${item.size || "N/A"}`, 100, yPosition);
      doc.text(`Color: ${item.color || "N/A"}`, 130, yPosition);
      doc.text(`Qty: ${item.quantity || 1}`, 160, yPosition);
      doc.text(
        `$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`,
        170,
        yPosition
      );
      yPosition += 8;
    });

    finalY = yPosition + 20;
  }

  // Order Summary

  // Summary box
  doc.setFillColor(248, 250, 252);
  doc.rect(120, finalY, 70, 40, "F");
  doc.setDrawColor(229, 231, 235);
  doc.rect(120, finalY, 70, 40);

  const subtotal = orderData.subtotal || 0;
  const shipping = orderData.shipping || 0;
  const tax = orderData.tax || 0;
  const total = orderData.total || subtotal + shipping + tax;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:", 125, finalY + 8);
  doc.text(`$${subtotal.toFixed(2)}`, 175, finalY + 8);

  doc.text("Shipping:", 125, finalY + 16);
  doc.text(`$${shipping.toFixed(2)}`, 175, finalY + 16);

  doc.text("Tax:", 125, finalY + 24);
  doc.text(`$${tax.toFixed(2)}`, 175, finalY + 24);

  doc.setFont("helvetica", "bold");
  doc.text("Total:", 125, finalY + 32);
  doc.text(`$${total.toFixed(2)}`, 175, finalY + 32);

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

export const downloadOrderPDF = (orderData, filename) => {
  const doc = generateOrderPDF(orderData);
  doc.save(filename || `order-${orderData.orderNumber || Date.now()}.pdf`);
};
