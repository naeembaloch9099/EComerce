import React from "react";
import styled from "styled-components";
import {
  FiX,
  FiShoppingBag,
  FiCreditCard,
  FiTrash2, // ✅ delete icon
} from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease;
`;

const DrawerContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  max-width: 480px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const DrawerTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #374151;

  /* Ensure X icon is always visible */
  svg {
    width: 24px !important;
    height: 24px !important;
    color: #374151 !important;
    stroke-width: 2.5 !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: rotate(90deg) scale(1.1);
    color: #1f2937;

    svg {
      color: #1f2937 !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  }

  /* Fallback using CSS pseudo-elements if icon doesn't load */
  &::before,
  &::after {
    content: "";
    position: absolute;
    background: #374151;
    border-radius: 1px;
  }

  &::before {
    width: 16px;
    height: 2px;
    transform: rotate(45deg);
  }

  &::after {
    width: 16px;
    height: 2px;
    transform: rotate(-45deg);
  }

  &:hover::before,
  &:hover::after {
    background: #1f2937;
  }
`;

const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f3f4f6;
  position: relative;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid #f3f4f6;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
`;

const ItemInfo = styled.div``;

const ItemName = styled.h3`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const ItemMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ItemPrice = styled.div`
  font-weight: 700;
  color: #3b82f6;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalPrice = styled.span`
  font-weight: 700;
  color: #059669;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    color: #dc2626;
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #6b7280;
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const DrawerFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: white;
`;

const TotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    toggleCart,
    removeFromCart,
    getCartTotal,
    getCartCount,
  } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Restrict admin from checkout
    if (isAuthenticated && user?.role === "admin") {
      toast.error(
        "Admin accounts cannot place orders. Please use a customer account."
      );
      return;
    }

    toggleCart();
    navigate("/checkout");
    toast.success("Proceeding to checkout");
  };

  const handleDelete = (item) => {
    // Toast notification is now handled in CartContext
    removeFromCart(item.id, item.size, item.color);
  };

  return (
    <>
      <Overlay $isOpen={isCartOpen} onClick={toggleCart} />
      <DrawerContainer $isOpen={isCartOpen}>
        <DrawerHeader>
          <DrawerTitle>
            <FiShoppingBag />
            Shopping Cart ({getCartCount()})
          </DrawerTitle>
          <CloseButton onClick={toggleCart}>
            <FiX size={24} />
          </CloseButton>
        </DrawerHeader>

        <DrawerContent>
          {cartItems.length === 0 ? (
            <EmptyCart>
              <EmptyCartIcon>🛒</EmptyCartIcon>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </EmptyCart>
          ) : (
            cartItems.map((item) => (
              <CartItem key={`${item.id}-${item.size}-${item.color}`}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemDetails>
                  <ItemInfo>
                    <ItemName>{item.name}</ItemName>
                    <ItemMeta>
                      <div>
                        <span style={{ marginRight: "0.5rem" }}>Color:</span>
                        <span
                          style={{
                            fontWeight: "600",
                            color: "#374151",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.color || "Default"}
                        </span>
                      </div>
                      <div>
                        <span style={{ marginRight: "0.5rem" }}>Size:</span>
                        <span
                          style={{
                            fontWeight: "600",
                            color: "#374151",
                          }}
                        >
                          {item.size}
                        </span>
                      </div>
                    </ItemMeta>
                    <ItemPrice>
                      <span>${item.price}</span>
                      <TotalPrice>
                        ${(item.price * item.quantity).toFixed(2)}
                      </TotalPrice>
                    </ItemPrice>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#6b7280",
                        fontWeight: "600",
                        marginTop: "0.25rem",
                      }}
                    >
                      Qty: X{item.quantity}
                    </div>
                  </ItemInfo>
                </ItemDetails>

                {/* ✅ Delete button */}
                <DeleteButton onClick={() => handleDelete(item)}>
                  <FiTrash2 size={16} />
                </DeleteButton>
              </CartItem>
            ))
          )}
        </DrawerContent>

        {cartItems.length > 0 && (
          <DrawerFooter>
            <TotalSection>
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </TotalSection>
            <CheckoutButton onClick={handleCheckout}>
              <FiCreditCard size={20} />
              Proceed to Checkout
            </CheckoutButton>
          </DrawerFooter>
        )}
      </DrawerContainer>
    </>
  );
};

export default CartDrawer;
