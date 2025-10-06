import React from "react";
import styled from "styled-components";
import { FiDownload, FiEye } from "react-icons/fi";

const DemoContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
`;

const FeatureItem = styled.li`
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: "✓";
    color: #10b981;
    font-weight: bold;
  }
`;

const CodeBlock = styled.pre`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  margin: 1rem 0;
`;

const PDFDemo = () => {
  return (
    <DemoContainer>
      <Title>📄 PDF Invoice Generation Feature</Title>

      <p>
        Your checkout process now includes a beautiful PDF invoice generation
        system!
      </p>

      <FeatureList>
        <FeatureItem>
          Professional invoice layout with company branding
        </FeatureItem>
        <FeatureItem>
          Complete order details including customer information
        </FeatureItem>
        <FeatureItem>
          Product table with images, names, sizes, colors, and prices
        </FeatureItem>
        <FeatureItem>
          Order summary with subtotal, shipping, tax, and total
        </FeatureItem>
        <FeatureItem>Instant PDF download functionality</FeatureItem>
        <FeatureItem>Beautiful preview before download</FeatureItem>
        <FeatureItem>Mobile-responsive design</FeatureItem>
      </FeatureList>

      <h3>How it works:</h3>

      <CodeBlock>
        {`1. Customer completes checkout successfully
2. Order confirmation page displays with success message
3. "View Invoice" button shows beautiful preview
4. "Download PDF" button generates and downloads PDF
5. PDF includes all order details in professional format`}
      </CodeBlock>

      <h3>Technical Implementation:</h3>

      <FeatureList>
        <FeatureItem>
          Uses jsPDF and jspdf-autotable for PDF generation
        </FeatureItem>
        <FeatureItem>
          Order data passed from checkout to confirmation page
        </FeatureItem>
        <FeatureItem>
          Professional styling with company colors and branding
        </FeatureItem>
        <FeatureItem>Automated table generation for products</FeatureItem>
        <FeatureItem>Proper formatting for currency and dates</FeatureItem>
      </FeatureList>

      <h3>Files Modified/Created:</h3>

      <CodeBlock>
        {`• src/utils/pdfGenerator.js - PDF generation utility
• src/Components/Common/OrderPreview.jsx - Invoice preview component  
• src/Pages/OrderConfirmation/OrderConfirmation.jsx - Updated with PDF features
• src/Pages/Checkout/Checkout.jsx - Updated to pass order data`}
      </CodeBlock>

      <p
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#f0f9ff",
          borderRadius: "0.5rem",
          border: "1px solid #0ea5e9",
        }}
      >
        <strong>Note:</strong> To fully test this feature, you'll need to
        install the PDF dependencies:
        <br />
        <code>npm install jspdf jspdf-autotable</code>
      </p>
    </DemoContainer>
  );
};

export default PDFDemo;
