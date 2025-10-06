import React from "react";
import styled from "styled-components";
import { FiDownload, FiEye, FiX, FiFileText } from "react-icons/fi";

const PreviewContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
`;

const PreviewTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InvoiceHeader = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
`;

const CompanyName = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const CompanyTagline = styled.p`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DetailSection = styled.div``;

const DetailTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #4b5563;
  min-width: 120px;
`;

const DetailValue = styled.span`
  color: #1f2937;
`;

const ProductsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8fafc;
  }

  &:hover {
    background-color: #e2e8f0;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
`;

const SummarySection = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  max-width: 300px;
  margin-left: auto;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
    padding-top: 0.5rem;
    border-top: 2px solid #d1d5db;
    font-weight: 700;
    font-size: 1.1rem;
    color: #1f2937;
  }
`;

const SummaryLabel = styled.span`
  color: ${(props) => (props.total ? "#1f2937" : "#6b7280")};
  font-weight: ${(props) => (props.total ? "700" : "500")};
`;

const SummaryValue = styled.span`
  color: ${(props) => (props.total ? "#1f2937" : "#374151")};
  font-weight: ${(props) => (props.total ? "700" : "500")};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;

  ${(props) =>
    props.primary
      ? `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
    }
  `
      : `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    }
  `}
`;

const OrderPreview = ({ orderData, onDownloadPDF }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>
          <FiFileText />
          Order Invoice Preview
        </PreviewTitle>
      </PreviewHeader>

      <InvoiceHeader>
        <CompanyName>RABBIT STORE</CompanyName>
        <CompanyTagline>Premium Fashion & Lifestyle</CompanyTagline>
      </InvoiceHeader>

      <OrderDetails>
        <DetailSection>
          <DetailTitle>Order Information</DetailTitle>
          <DetailRow>
            <DetailLabel>Order Number:</DetailLabel>
            <DetailValue>{orderData.orderNumber}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Order Date:</DetailLabel>
            <DetailValue>{formatDate(orderData.orderDate)}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Status:</DetailLabel>
            <DetailValue>Confirmed</DetailValue>
          </DetailRow>
        </DetailSection>

        <DetailSection>
          <DetailTitle>Customer Details</DetailTitle>
          <DetailRow>
            <DetailLabel>Name:</DetailLabel>
            <DetailValue>{orderData.customerInfo.name}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Email:</DetailLabel>
            <DetailValue>{orderData.customerInfo.email}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Phone:</DetailLabel>
            <DetailValue>{orderData.customerInfo.phone}</DetailValue>
          </DetailRow>
        </DetailSection>
      </OrderDetails>

      <DetailSection>
        <DetailTitle>Shipping Address</DetailTitle>
        <DetailRow>
          <DetailValue>
            {orderData.shippingAddress.street}
            <br />
            {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{" "}
            {orderData.shippingAddress.zipCode}
            <br />
            {orderData.shippingAddress.country}
          </DetailValue>
        </DetailRow>
      </DetailSection>

      <DetailTitle style={{ marginTop: "2rem" }}>Order Items</DetailTitle>
      <ProductsTable>
        <thead>
          <tr>
            <TableHeader>Product</TableHeader>
            <TableHeader>Size</TableHeader>
            <TableHeader>Color</TableHeader>
            <TableHeader>Qty</TableHeader>
            <TableHeader>Price</TableHeader>
            <TableHeader>Total</TableHeader>
          </tr>
        </thead>
        <tbody>
          {orderData.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <ProductImage src={item.image} alt={item.name} />
                  <div>
                    <div style={{ fontWeight: "600" }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                      {item.brand}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>
                {formatCurrency(item.price * item.quantity)}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </ProductsTable>

      <SummarySection>
        <SummaryRow>
          <SummaryLabel>Subtotal:</SummaryLabel>
          <SummaryValue>{formatCurrency(orderData.subtotal)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Shipping:</SummaryLabel>
          <SummaryValue>{formatCurrency(orderData.shipping)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>Tax:</SummaryLabel>
          <SummaryValue>{formatCurrency(orderData.tax)}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel total>Total:</SummaryLabel>
          <SummaryValue total>{formatCurrency(orderData.total)}</SummaryValue>
        </SummaryRow>
      </SummarySection>

      <ActionButtons>
        <ActionButton primary onClick={onDownloadPDF}>
          <FiDownload />
          Download PDF Invoice
        </ActionButton>
      </ActionButtons>
    </PreviewContainer>
  );
};

export default OrderPreview;
