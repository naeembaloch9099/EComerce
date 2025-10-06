import React, { useState } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import {
  FiCreditCard,
  FiShield,
  FiGlobe,
  FiLock,
  FiTrendingUp,
  FiSmartphone,
} from "react-icons/fi";
import { SiStripe, SiGooglepay, SiApplepay } from "react-icons/si";
import StripeCardPayment from "./StripeCardPayment";
import StripeDigitalWallet from "./StripeDigitalWallet";
import { useCart } from "../../context/CartContext";

// ------------------ Styled Components ------------------

const PaymentGateway = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const PaymentHeader = styled.div`
  background: linear-gradient(135deg, #635bff 0%, #4f46e5 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
`;

const HeaderTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const HeaderSubtitle = styled.p`
  opacity: 0.9;
  font-size: 0.875rem;
`;

const PaymentTabs = styled.div`
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
`;

const PaymentTab = styled.button`
  flex: 1;
  padding: 1rem;
  background: ${(props) => (props.$active ? "white" : "transparent")};
  border: none;
  border-bottom: 3px solid
    ${(props) => (props.$active ? "#635BFF" : "transparent")};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: ${(props) => (props.$active ? "#635BFF" : "#6b7280")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${(props) => (props.$active ? "white" : "#f1f5f9")};
    color: #635bff;
  }
`;

const PaymentContent = styled.div`
  padding: 2rem;
`;

const SecurityFeatures = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

const SecurityFeature = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.75rem;
`;

const SecurityIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #10b981;
`;

const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const TrustBadge = styled.div`
  background: #f8fafc;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  border: 1px solid #e5e7eb;
`;

const TabDescription = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.5;
`;

// ------------------ Main Component ------------------

const PaymentGatewayComponent = ({
  amount,
  currency = "USD",
  onSuccess,
  onError,
}) => {
  const [activeTab, setActiveTab] = useState("express");
  const { clearCart, cartItems } = useCart();

  const handleStripeSuccess = (paymentData) => {
    console.log("Payment successful:", paymentData);

    // Clear the cart immediately after successful payment
    if (cartItems.length > 0) {
      clearCart();
      console.log("🛒 PaymentGateway: Cart cleared after successful payment");
      toast.success("Payment completed successfully! Cart cleared.");
    } else {
      toast.success("Payment completed successfully!");
    }

    onSuccess && onSuccess(paymentData);
  };

  const handleStripeError = (error) => {
    console.error("Payment error:", error);
    toast.error("Payment failed. Please try again.");
    onError && onError(error);
  };

  const renderExpressTab = () => {
    // Check if any digital wallets are available
    const isAndroidDevice = /Android/.test(navigator.userAgent);
    const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
    const hasDigitalWallets = isAndroidDevice || isAppleDevice;

    return (
      <div>
        <TabDescription>
          Choose your preferred payment method. All options are secured by
          Stripe's industry-leading payment infrastructure.
        </TabDescription>

        {/* Only show digital wallets if device supports them */}
        {hasDigitalWallets && (
          <>
            <StripeDigitalWallet
              amount={amount}
              currency={currency}
              onSuccess={handleStripeSuccess}
              onError={handleStripeError}
              activeTab={activeTab}
            />

            {/* Or Separator */}
            <div
              style={{
                textAlign: "center",
                margin: "1.5rem 0",
                color: "#6b7280",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "#e5e7eb",
                }}
              ></div>
              <span
                style={{
                  background: "white",
                  padding: "0 1rem",
                  position: "relative",
                }}
              >
                or pay with card
              </span>
            </div>
          </>
        )}

        {/* Card Payment */}
        <StripeCardPayment
          amount={amount}
          currency={currency}
          onSuccess={handleStripeSuccess}
          onError={handleStripeError}
        />
      </div>
    );
  };

  const renderCardTab = () => (
    <div>
      <TabDescription>
        Pay securely with your credit or debit card. All transactions are
        encrypted and protected by Stripe's advanced security.
      </TabDescription>
      <StripeCardPayment
        amount={amount}
        currency={currency}
        onSuccess={handleStripeSuccess}
        onError={handleStripeError}
      />
    </div>
  );

  const renderDigitalWalletTab = () => (
    <div>
      <TabDescription>
        Pay instantly with Google Pay or Apple Pay. Quick, secure, and
        convenient - no need to enter card details.
      </TabDescription>
      <StripeDigitalWallet
        amount={amount}
        currency={currency}
        onSuccess={handleStripeSuccess}
        onError={handleStripeError}
        activeTab={activeTab}
      />
    </div>
  );

  return (
    <PaymentGateway>
      <PaymentHeader>
        <HeaderTitle>
          <FiLock /> Secure Payment
        </HeaderTitle>
        <HeaderSubtitle>
          Powered by Stripe - Your payment information is protected with
          industry-standard encryption
        </HeaderSubtitle>
      </PaymentHeader>

      <PaymentTabs>
        <PaymentTab
          $active={activeTab === "express"}
          onClick={() => setActiveTab("express")}
        >
          <SiStripe /> Express
        </PaymentTab>
        <PaymentTab
          $active={activeTab === "card"}
          onClick={() => setActiveTab("card")}
        >
          <FiCreditCard /> Card
        </PaymentTab>
        <PaymentTab
          $active={activeTab === "wallet"}
          onClick={() => setActiveTab("wallet")}
        >
          <FiSmartphone /> Digital Wallet
        </PaymentTab>
      </PaymentTabs>

      <PaymentContent>
        {activeTab === "express" && renderExpressTab()}
        {activeTab === "card" && renderCardTab()}
        {activeTab === "wallet" && renderDigitalWalletTab()}

        <SecurityFeatures>
          <SecurityFeature>
            <SecurityIcon>
              <FiShield />
            </SecurityIcon>
            256-bit SSL
          </SecurityFeature>
          <SecurityFeature>
            <SecurityIcon>
              <FiGlobe />
            </SecurityIcon>
            PCI Compliant
          </SecurityFeature>
          <SecurityFeature>
            <SecurityIcon>
              <FiTrendingUp />
            </SecurityIcon>
            99.9% Uptime
          </SecurityFeature>
        </SecurityFeatures>

        <TrustBadges>
          <TrustBadge>Stripe Verified</TrustBadge>
          <TrustBadge>SSL Secured</TrustBadge>
          <TrustBadge>Money Back Guarantee</TrustBadge>
        </TrustBadges>
      </PaymentContent>
    </PaymentGateway>
  );
};

export default PaymentGatewayComponent;
