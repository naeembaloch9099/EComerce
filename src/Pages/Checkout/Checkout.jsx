import React, { useState } from "react";
import styled from "styled-components";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { ORDER_STATES } from "../../constants/orderConstants";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiCreditCard,
  FiLock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiChevronDown,
  FiShield,
} from "react-icons/fi";
import PaymentGateway from "../../Components/Payment/PaymentGateway";

const CheckoutContainer = styled.div`
  max-width: 1400px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 500px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 1fr 600px;
  }
`;

const CheckoutForm = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdminRestrictionContainer = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 3rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
  border-radius: 1rem;
  border: 2px solid #fecaca;
`;

const AdminRestrictionIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
`;

const AdminRestrictionTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #dc2626;
  margin-bottom: 1rem;
`;

const AdminRestrictionMessage = styled.p`
  font-size: 1.1rem;
  color: #7f1d1d;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const AdminButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: ${(props) => props.$columns || "1fr 1fr"};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const OrderSummary = styled.div`
  background: linear-gradient(145deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid #f3f4f6;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

const ItemMeta = styled.div`
  color: #6b7280;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.875rem;
`;

const TotalSection = styled.div`
  border-top: 2px solid #e5e7eb;
  padding-top: 1rem;
  margin-top: 1rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: ${(props) => (props.$isTotal ? "1.25rem" : "1rem")};
  font-weight: ${(props) => (props.$isTotal ? "700" : "500")};
  color: ${(props) => (props.$isTotal ? "#1f2937" : "#6b7280")};
`;

const PaymentSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  padding: 1.5rem;
  color: white;
  margin-top: 1rem;
`;

const PaymentButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
  }
`;

const CardButton = styled.button`
  width: 100%;
  background: #374151;
  color: white;
  border: none;
  border-radius: 0.75rem;
  padding: 1rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #1f2937;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(55, 65, 81, 0.3);
  }
`;

const PoweredBy = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 0.5rem;
`;

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { startOrder, setPaymentSuccess } = useOrder();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    address: "",
    city: "",
    postalCode: "",
    country: "USA",
    phone: user?.phone || "",
  });

  // Restrict admin access to checkout
  if (isAuthenticated && user?.role === "admin") {
    return (
      <AdminRestrictionContainer>
        <AdminRestrictionIcon>
          <FiShield size={40} color="white" />
        </AdminRestrictionIcon>
        <AdminRestrictionTitle>Admin Access Restricted</AdminRestrictionTitle>
        <AdminRestrictionMessage>
          As an administrator, you cannot place orders through the customer
          checkout process. This restriction is in place to maintain proper
          order management and prevent confusion between admin functions and
          customer operations.
        </AdminRestrictionMessage>
        <AdminRestrictionMessage>
          Please use the admin dashboard to manage orders, products, and other
          administrative tasks.
        </AdminRestrictionMessage>
        <div>
          <AdminButton onClick={() => navigate("/admin")}>
            Go to Admin Dashboard
          </AdminButton>
          <AdminButton
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)",
            }}
          >
            Return to Home
          </AdminButton>
        </div>
      </AdminRestrictionContainer>
    );
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentSuccess = async (transactionData) => {
    if (!isAuthenticated) {
      toast.error("Please login to complete your order");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/");
      return;
    }

    // Validate form
    const requiredFields = [
      "email",
      "firstName",
      "lastName",
      "address",
      "city",
      "postalCode",
      "phone",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Set payment success in order context
      setPaymentSuccess(transactionData);

      // Prepare order data with transaction details
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        orderDate: new Date().toISOString(),
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state || "",
          zipCode: formData.postalCode,
          country: formData.country || "USA",
        },
        items: cartItems.map((item) => ({
          name: item.name,
          brand: item.brand || "Rabbit Store",
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        paymentMethod: transactionData.method,
        transactionId: transactionData.id,
        paymentStatus: transactionData.status,
        paymentTimestamp: transactionData.timestamp,
      };

      // Start order processing and save to database
      console.log("💾 Checkout: Starting order process...");
      const savedOrder = await startOrder(orderData);
      console.log("✅ Checkout: Order saved successfully:", savedOrder);

      // Clear cart after successful order
      clearCart();
      console.log("🧹 Checkout: Cart cleared after successful order");

      // Navigate to order confirmation
      toast.success(`Order placed and saved successfully!`);
      navigate("/order-confirmation", {
        state: {
          orderData: { ...orderData, orderId: savedOrder._id },
          shouldClearCart: false,
        },
      });
    } catch (err) {
      console.error("Order processing error:", err);
      toast.error("Order processing failed. Please try again.");
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    toast.error("Payment failed. Please try again.");
  };

  const handlePaymentCancel = () => {
    toast.info("Payment cancelled");
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <CheckoutContainer>
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <h2>Your cart is empty</h2>
          <p>Add some items to checkout</p>
        </div>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <CheckoutForm>
        <SectionTitle>
          <FiLock />
          CHECKOUT
        </SectionTitle>

        <FormSection>
          <h3 style={{ marginBottom: "1rem", color: "#374151" }}>
            Contact Details
          </h3>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              required
            />
          </FormGroup>
        </FormSection>

        <FormSection>
          <h3 style={{ marginBottom: "1rem", color: "#374151" }}>Delivery</h3>
          <FormRow>
            <FormGroup>
              <Label>First name</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First name"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Last name</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last name"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Street address"
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Postal Code</Label>
              <Input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Postal code"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Country</Label>
            <Select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              required
            >
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Phone</Label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone number"
              required
            />
          </FormGroup>
        </FormSection>
      </CheckoutForm>

      <OrderSummary>
        <SectionTitle style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
          Order Summary
        </SectionTitle>

        {cartItems.map((item) => (
          <SummaryItem key={`${item.id}-${item.size}`}>
            <ItemImage src={item.image} alt={item.name} />
            <ItemDetails>
              <ItemName>{item.name}</ItemName>
              <ItemMeta>
                Size: {item.size} • Color: {item.color}
              </ItemMeta>
              <ItemPrice>€{item.price}</ItemPrice>
            </ItemDetails>
            <div style={{ fontWeight: "600", color: "#1f2937" }}>
              x{item.quantity}
            </div>
          </SummaryItem>
        ))}

        <TotalSection>
          <TotalRow>
            <span>Subtotal</span>
            <span>€{subtotal.toFixed(2)}</span>
          </TotalRow>
          <TotalRow>
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `€${shipping.toFixed(2)}`}</span>
          </TotalRow>
          <TotalRow>
            <span>Tax (8%)</span>
            <span>€{tax.toFixed(2)}</span>
          </TotalRow>
          <TotalRow $isTotal>
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </TotalRow>
        </TotalSection>

        <PaymentGateway
          amount={total}
          currency="EUR"
          items={cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={handlePaymentCancel}
        />
      </OrderSummary>
    </CheckoutContainer>
  );
};

export default Checkout;
