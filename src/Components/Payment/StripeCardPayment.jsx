import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiCreditCard,
  FiLock,
  FiCheck,
  FiShield,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import {
  SiVisa,
  SiMastercard,
  SiAmericanexpress,
  SiDiscover,
} from "react-icons/si";
import stripeService from "../../services/stripeService";
import toast from "react-hot-toast";

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const StripeContainer = styled.div`
  background: linear-gradient(135deg, #635bff 0%, #4f46e5 100%);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #00d4ff, #635bff, #00d4ff);
    animation: ${pulseAnimation} 2s ease-in-out infinite;
  }
`;

const PaymentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const PaymentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
`;

const PaymentBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const CardForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const CardInputGroup = styled.div`
  position: relative;
`;

const CardInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CardInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-family: "Courier New", monospace;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }

  &.error {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  &.valid {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }
`;

const CardIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
`;

const CardTypeIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  font-size: 1.5rem;
  color: white;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  opacity: 0.9;
  display: block;
`;

const SecurityFeatures = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
`;

const SecurityFeature = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.9;
`;

const SecurityIcon = styled.div`
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PayButton = styled.button`
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  padding: 1rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #fca5a5;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.3s ease;

  &:hover {
    color: white;
  }
`;

const StripeCardPayment = ({
  amount = 50,
  currency = "USD",
  onSuccess,
  onError,
  disabled = false,
}) => {
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [showCvv, setShowCvv] = useState(false);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardType, setCardType] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let newErrors = { ...errors };

    switch (name) {
      case "number": {
        // Remove all non-digits
        const cleanNumber = value.replace(/\D/g, "");
        // Format with spaces
        formattedValue = stripeService
          .formatCardNumber(cleanNumber)
          .substring(0, 23);
        // Detect card type
        setCardType(stripeService.getCardType(cleanNumber));
        // Validate
        if (
          cleanNumber.length > 0 &&
          !stripeService.validateCardNumber(cleanNumber)
        ) {
          newErrors.number = "Invalid card number";
        } else {
          delete newErrors.number;
        }
        break;
      }

      case "expiry": {
        // Format as MM/YY
        const cleanExpiry = value.replace(/\D/g, "");
        if (cleanExpiry.length >= 2) {
          formattedValue =
            cleanExpiry.substring(0, 2) + "/" + cleanExpiry.substring(2, 4);
        } else {
          formattedValue = cleanExpiry;
        }

        // Validate expiry
        if (formattedValue.length === 5) {
          const [month, year] = formattedValue.split("/");
          const currentDate = new Date();
          const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);

          if (parseInt(month) < 1 || parseInt(month) > 12) {
            newErrors.expiry = "Invalid month";
          } else if (expiry < currentDate) {
            newErrors.expiry = "Card expired";
          } else {
            delete newErrors.expiry;
          }
        }
        break;
      }

      case "cvv": {
        formattedValue = value
          .replace(/\D/g, "")
          .substring(0, cardType === "amex" ? 4 : 3);

        // Validate CVV
        const expectedLength = cardType === "amex" ? 4 : 3;
        if (
          formattedValue.length > 0 &&
          formattedValue.length !== expectedLength
        ) {
          newErrors.cvv = `CVV must be ${expectedLength} digits`;
        } else {
          delete newErrors.cvv;
        }
        break;
      }

      case "name": {
        formattedValue = value.toUpperCase();

        // Validate name
        if (formattedValue.length > 0 && formattedValue.length < 2) {
          newErrors.name = "Name too short";
        } else {
          delete newErrors.name;
        }
        break;
      }
    }

    setCardData({
      ...cardData,
      [name]: formattedValue,
    });
    setErrors(newErrors);
  };

  const getCardTypeIcon = () => {
    switch (cardType) {
      case "visa":
        return <SiVisa />;
      case "mastercard":
        return <SiMastercard />;
      case "amex":
        return <SiAmericanexpress />;
      case "discover":
        return <SiDiscover />;
      default:
        return <FiCreditCard />;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (
      !cardData.number ||
      !stripeService.validateCardNumber(cardData.number.replace(/\s/g, ""))
    ) {
      newErrors.number = "Valid card number required";
    }

    if (!cardData.expiry || cardData.expiry.length !== 5) {
      newErrors.expiry = "Valid expiry date required";
    }

    const expectedCvvLength = cardType === "amex" ? 4 : 3;
    if (!cardData.cvv || cardData.cvv.length !== expectedCvvLength) {
      newErrors.cvv = `${expectedCvvLength}-digit CVV required`;
    }

    if (!cardData.name || cardData.name.length < 2) {
      newErrors.name = "Cardholder name required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast.error("Please correct the errors below");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create payment intent
      toast.loading("Creating payment intent...", { id: "stripe-payment" });
      const paymentIntent = await stripeService.createPaymentIntent(
        amount,
        currency
      );

      // Step 2: Process payment
      toast.loading("Processing payment...", { id: "stripe-payment" });
      const result = await stripeService.processCardPayment(
        cardData,
        paymentIntent.id
      );

      // Step 3: Success
      const receiptData = stripeService.generateReceiptData(
        result.paymentIntent
      );

      toast.success("Payment successful!", { id: "stripe-payment" });
      onSuccess &&
        onSuccess({
          ...receiptData,
          stripePaymentIntent: result.paymentIntent,
        });
    } catch (error) {
      console.error("Stripe payment error:", error);
      toast.error(error.error?.message || "Payment failed", {
        id: "stripe-payment",
      });
      onError && onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getInputClassName = (fieldName) => {
    if (errors[fieldName]) return "error";
    if (cardData[fieldName] && !errors[fieldName]) return "valid";
    return "";
  };

  return (
    <StripeContainer>
      <PaymentHeader>
        <PaymentTitle>
          <FiCreditCard />
          Stripe Payment
        </PaymentTitle>
        <PaymentBadge>Secure</PaymentBadge>
      </PaymentHeader>

      <CardForm>
        <CardInputGroup>
          <FormLabel>Card Number</FormLabel>
          <CardInputWrapper>
            <CardIcon>
              <FiCreditCard />
            </CardIcon>
            <CardInput
              type="text"
              name="number"
              value={cardData.number}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className={getInputClassName("number")}
              maxLength={23}
            />
            <CardTypeIcon>{getCardTypeIcon()}</CardTypeIcon>
          </CardInputWrapper>
          {errors.number && <ErrorMessage>{errors.number}</ErrorMessage>}
        </CardInputGroup>

        <FormRow>
          <CardInputGroup>
            <FormLabel>Expiry Date</FormLabel>
            <CardInputWrapper>
              <CardIcon>
                <FiCheck />
              </CardIcon>
              <CardInput
                type="text"
                name="expiry"
                value={cardData.expiry}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className={getInputClassName("expiry")}
                maxLength={5}
              />
            </CardInputWrapper>
            {errors.expiry && <ErrorMessage>{errors.expiry}</ErrorMessage>}
          </CardInputGroup>

          <CardInputGroup>
            <FormLabel>CVV</FormLabel>
            <CardInputWrapper>
              <CardIcon>
                <FiShield />
              </CardIcon>
              <CardInput
                type={showCvv ? "text" : "password"}
                name="cvv"
                value={cardData.cvv}
                onChange={handleInputChange}
                placeholder={cardType === "amex" ? "1234" : "123"}
                className={getInputClassName("cvv")}
                maxLength={cardType === "amex" ? 4 : 3}
              />
              <ToggleButton type="button" onClick={() => setShowCvv(!showCvv)}>
                {showCvv ? <FiEyeOff /> : <FiEye />}
              </ToggleButton>
            </CardInputWrapper>
            {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
          </CardInputGroup>
        </FormRow>

        <CardInputGroup>
          <FormLabel>Cardholder Name</FormLabel>
          <CardInputWrapper>
            <CardIcon>
              <FiLock />
            </CardIcon>
            <CardInput
              type="text"
              name="name"
              value={cardData.name}
              onChange={handleInputChange}
              placeholder="JOHN DOE"
              className={getInputClassName("name")}
            />
          </CardInputWrapper>
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </CardInputGroup>
      </CardForm>

      <SecurityFeatures>
        <SecurityFeature>
          <SecurityIcon>
            <FiShield />
          </SecurityIcon>
          <div>256-bit SSL</div>
        </SecurityFeature>
        <SecurityFeature>
          <SecurityIcon>
            <FiLock />
          </SecurityIcon>
          <div>Encrypted</div>
        </SecurityFeature>
        <SecurityFeature>
          <SecurityIcon>
            <FiCheck />
          </SecurityIcon>
          <div>PCI Compliant</div>
        </SecurityFeature>
      </SecurityFeatures>

      <PayButton
        onClick={handlePayment}
        disabled={isProcessing || disabled || Object.keys(errors).length > 0}
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            <FiLock />
            Pay ${amount.toFixed(2)} {currency}
          </>
        )}
      </PayButton>
    </StripeContainer>
  );
};

export default StripeCardPayment;
