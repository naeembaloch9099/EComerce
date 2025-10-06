import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiSmartphone, FiCheck, FiShield, FiCreditCard } from "react-icons/fi";
import { SiGooglepay, SiApplepay } from "react-icons/si";
import stripeService from "../../services/stripeService";
import toast from "react-hot-toast";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const DigitalWalletContainer = styled.div`
  margin-bottom: 1rem;
`;

const WalletOption = styled.div`
  background: ${(props) =>
    props.variant === "google"
      ? "linear-gradient(135deg, #4285F4 0%, #34A853 100%)"
      : "linear-gradient(135deg, #000000 0%, #1D1D1F 100%)"};
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const WalletTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.125rem;
`;

const WalletBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const WalletDescription = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const WalletFeatures = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const WalletFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
`;

const PayButton = styled.button`
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  color: ${(props) => (props.variant === "google" ? "#4285F4" : "#000000")};
  border: none;
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ButtonIcon = styled.div`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
`;

const UnavailableMessage = styled.div`
  background: linear-gradient(135deg, #6b7280 0%, #9ca3af 100%);
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
`;

const UnavailableTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const UnavailableText = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.4;
`;

const DeviceInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;

  strong {
    color: rgba(255, 255, 255, 0.9);
  }
`;

const StripeDigitalWallet = ({
  amount = 50,
  currency = "USD",
  onSuccess,
  onError,
  disabled = false,
  activeTab = null,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingWallet, setProcessingWallet] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState({
    isAppleDevice: false,
    isAndroidDevice: false,
    supportsGooglePay: false,
    supportsApplePay: false,
  });

  useEffect(() => {
    const checkDeviceCapabilities = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod|macintosh/.test(userAgent);
      const isAndroidDevice = /android/.test(userAgent);

      // Check for Google Pay support
      const supportsGooglePay = "PaymentRequest" in window && isAndroidDevice;

      // Check for Apple Pay support
      const supportsApplePay = "ApplePaySession" in window && isAppleDevice;

      setDeviceInfo({
        isAppleDevice,
        isAndroidDevice,
        supportsGooglePay,
        supportsApplePay,
      });
    };

    checkDeviceCapabilities();
  }, []);

  const handleGooglePay = async () => {
    setIsProcessing(true);
    setProcessingWallet("google");

    try {
      // Step 1: Create payment intent
      toast.loading("Initializing Google Pay...", { id: "google-pay" });
      const paymentIntent = await stripeService.createPaymentIntent(
        amount,
        currency
      );

      // Step 2: Process Google Pay
      toast.loading("Processing Google Pay payment...", { id: "google-pay" });
      const result = await stripeService.processGooglePay(
        amount,
        currency,
        paymentIntent.id
      );

      // Step 3: Success
      const receiptData = stripeService.generateReceiptData(
        result.paymentIntent
      );

      toast.success("Google Pay payment successful!", { id: "google-pay" });
      onSuccess &&
        onSuccess({
          ...receiptData,
          paymentMethod: "Google Pay",
          stripePaymentIntent: result.paymentIntent,
        });
    } catch (error) {
      console.error("Google Pay error:", error);
      toast.error(error.error?.message || "Google Pay payment failed", {
        id: "google-pay",
      });
      onError && onError(error);
    } finally {
      setIsProcessing(false);
      setProcessingWallet(null);
    }
  };

  const handleApplePay = async () => {
    setIsProcessing(true);
    setProcessingWallet("apple");

    try {
      // Step 1: Create payment intent
      toast.loading("Initializing Apple Pay...", { id: "apple-pay" });
      const paymentIntent = await stripeService.createPaymentIntent(
        amount,
        currency
      );

      // Step 2: Process Apple Pay
      toast.loading("Processing Apple Pay payment...", { id: "apple-pay" });
      const result = await stripeService.processApplePay(
        amount,
        currency,
        paymentIntent.id
      );

      // Step 3: Success
      const receiptData = stripeService.generateReceiptData(
        result.paymentIntent
      );

      toast.success("Apple Pay payment successful!", { id: "apple-pay" });
      onSuccess &&
        onSuccess({
          ...receiptData,
          paymentMethod: "Apple Pay",
          stripePaymentIntent: result.paymentIntent,
        });
    } catch (error) {
      console.error("Apple Pay error:", error);
      toast.error(error.error?.message || "Apple Pay payment failed", {
        id: "apple-pay",
      });
      onError && onError(error);
    } finally {
      setIsProcessing(false);
      setProcessingWallet(null);
    }
  };

  return (
    <DigitalWalletContainer>
      {/* Google Pay */}
      {deviceInfo.supportsGooglePay ? (
        <WalletOption variant="google">
          <WalletHeader>
            <WalletTitle>
              <SiGooglepay />
              Google Pay
            </WalletTitle>
            <WalletBadge>Fast</WalletBadge>
          </WalletHeader>

          <WalletDescription>
            Pay securely with your Google account. Your payment information is
            encrypted and protected.
          </WalletDescription>

          <WalletFeatures>
            <WalletFeature>
              <FiShield />
              Secure
            </WalletFeature>
            <WalletFeature>
              <FiCheck />
              One-tap
            </WalletFeature>
            <WalletFeature>
              <FiCreditCard />
              All cards
            </WalletFeature>
          </WalletFeatures>

          <PayButton
            variant="google"
            onClick={handleGooglePay}
            disabled={isProcessing || disabled}
          >
            {processingWallet === "google" ? (
              <>Processing...</>
            ) : (
              <>
                <ButtonIcon>
                  <SiGooglepay />
                </ButtonIcon>
                Pay ${amount.toFixed(2)} with Google Pay
              </>
            )}
          </PayButton>
        </WalletOption>
      ) : null}

      {/* Apple Pay */}
      {deviceInfo.supportsApplePay ? (
        <WalletOption variant="apple">
          <WalletHeader>
            <WalletTitle>
              <SiApplepay />
              Apple Pay
            </WalletTitle>
            <WalletBadge>Touch ID</WalletBadge>
          </WalletHeader>

          <WalletDescription>
            Pay with Touch ID or Face ID. Your card details are never shared
            with merchants.
          </WalletDescription>

          <WalletFeatures>
            <WalletFeature>
              <FiShield />
              Private
            </WalletFeature>
            <WalletFeature>
              <FiSmartphone />
              Biometric
            </WalletFeature>
            <WalletFeature>
              <FiCheck />
              Instant
            </WalletFeature>
          </WalletFeatures>

          <PayButton
            variant="apple"
            onClick={handleApplePay}
            disabled={isProcessing || disabled}
          >
            {processingWallet === "apple" ? (
              <>Processing...</>
            ) : (
              <>
                <ButtonIcon>
                  <SiApplepay />
                </ButtonIcon>
                Pay ${amount.toFixed(2)} with Apple Pay
              </>
            )}
          </PayButton>
        </WalletOption>
      ) : null}

      {/* Only show device info in development and only when relevant */}
      {import.meta.env.DEV &&
        (deviceInfo.supportsGooglePay || deviceInfo.supportsApplePay) && (
          <DeviceInfo>
            <strong>Device Info (Dev Mode):</strong>
            <br />
            Google Pay:{" "}
            {deviceInfo.supportsGooglePay ? "Available" : "Not Available"}
            <br />
            Apple Pay:{" "}
            {deviceInfo.supportsApplePay ? "Available" : "Not Available"}
          </DeviceInfo>
        )}

      {/* Show minimal fallback only when specifically in the digital wallet tab */}
      {!deviceInfo.supportsGooglePay &&
        !deviceInfo.supportsApplePay &&
        activeTab === "wallet" && (
          <UnavailableMessage>
            <UnavailableTitle>
              <FiSmartphone />
              Digital Wallets Not Available
            </UnavailableTitle>
            <UnavailableText>
              This device doesn't support Google Pay or Apple Pay. Please use
              the Card tab for payment.
            </UnavailableText>
          </UnavailableMessage>
        )}
    </DigitalWalletContainer>
  );
};

export default StripeDigitalWallet;
