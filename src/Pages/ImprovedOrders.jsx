import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiCreditCard,
  FiDownload,
  FiEye,
  FiClock,
  FiCheck,
  FiTruck,
  FiBox,
  FiShoppingBag,
} from "react-icons/fi";

const OrdersContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const LoginIcon = styled.div`
  font-size: 4rem;
  color: #3b82f6;
  margin-bottom: 1rem;
`;

const LoginTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const LoginMessage = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const LoginButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;

  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
`;

const BrowseButton = styled.button`
  background: white;
  color: #374151;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const OrderMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${(props) => {
    switch (props.status) {
      case "confirmed":
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case "processing":
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case "shipped":
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case "delivered":
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

const OrderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${(props) =>
    props.primary
      ? `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
    }
  `
      : `
    background: white;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #f9fafb;
      border-color: #9ca3af;
    }
  `}
`;

const OrderItems = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
`;

const ItemMeta = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const EmptyMessage = styled.p`
  color: #6b7280;
  margin-bottom: 2rem;
`;

const ShopButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }
`;

const ImprovedOrders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // Mock orders data - in a real app, this would come from an API
        const mockOrders = [
          {
            id: "ORD-1699123456789",
            orderNumber: "ORD-1699123456789",
            date: "2024-10-01",
            status: "delivered",
            total: 159.97,
            items: [
              {
                id: 1,
                name: "Premium Cotton T-Shirt",
                brand: "Rabbit Store",
                image:
                  "https://via.placeholder.com/100x100/3b82f6/ffffff?text=T-Shirt",
                size: "M",
                color: "Navy Blue",
                quantity: 2,
                price: 29.99,
              },
              {
                id: 2,
                name: "Casual Denim Jeans",
                brand: "Rabbit Store",
                image:
                  "https://via.placeholder.com/100x100/1f2937/ffffff?text=Jeans",
                size: "32",
                color: "Dark Blue",
                quantity: 1,
                price: 79.99,
              },
            ],
            shippingAddress: {
              street: "123 Main Street",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "United States",
            },
            customerInfo: {
              name: user?.name || "John Doe",
              email: user?.email || "john.doe@example.com",
              phone: "+1 (555) 123-4567",
            },
          },
          {
            id: "ORD-1699023456789",
            orderNumber: "ORD-1699023456789",
            date: "2024-09-28",
            status: "shipped",
            total: 89.98,
            items: [
              {
                id: 3,
                name: "Wireless Headphones",
                brand: "Rabbit Store",
                image:
                  "https://via.placeholder.com/100x100/10b981/ffffff?text=Audio",
                size: "One Size",
                color: "Black",
                quantity: 1,
                price: 89.98,
              },
            ],
            shippingAddress: {
              street: "123 Main Street",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "United States",
            },
            customerInfo: {
              name: user?.name || "John Doe",
              email: user?.email || "john.doe@example.com",
              phone: "+1 (555) 123-4567",
            },
          },
        ];
        setOrders(mockOrders);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user]);

  const handleDownloadInvoice = (order) => {
    // Mock download functionality
    console.log("Downloading invoice for:", order.orderNumber);
    alert(`Invoice downloaded for order ${order.orderNumber}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FiCheck />;
      case "processing":
        return <FiClock />;
      case "shipped":
        return <FiTruck />;
      case "delivered":
        return <FiBox />;
      default:
        return <FiPackage />;
    }
  };

  if (loading) {
    return (
      <OrdersContainer>
        <PageHeader>
          <PageTitle>My Orders</PageTitle>
          <PageSubtitle>Loading your orders...</PageSubtitle>
        </PageHeader>
      </OrdersContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <OrdersContainer>
        <PageHeader>
          <PageTitle>My Orders</PageTitle>
          <PageSubtitle>Please login to view your orders</PageSubtitle>
        </PageHeader>

        <LoginPrompt>
          <LoginIcon>
            <FiPackage />
          </LoginIcon>
          <LoginTitle>Login Required</LoginTitle>
          <LoginMessage>
            You need to be logged in to view your order history.
          </LoginMessage>
          <LoginButton onClick={() => navigate("/login")}>
            Login to Account
          </LoginButton>
          <BrowseButton onClick={() => navigate("/")}>
            Continue Shopping
          </BrowseButton>
        </LoginPrompt>
      </OrdersContainer>
    );
  }

  if (orders.length === 0) {
    return (
      <OrdersContainer>
        <PageHeader>
          <PageTitle>My Orders</PageTitle>
          <PageSubtitle>Track and manage your orders</PageSubtitle>
        </PageHeader>

        <EmptyState>
          <EmptyIcon>
            <FiShoppingBag />
          </EmptyIcon>
          <EmptyTitle>No orders yet</EmptyTitle>
          <EmptyMessage>
            You haven't placed any orders yet. Start shopping to see your orders
            here!
          </EmptyMessage>
          <ShopButton onClick={() => navigate("/")}>Start Shopping</ShopButton>
        </EmptyState>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <PageHeader>
        <PageTitle>My Orders</PageTitle>
        <PageSubtitle>
          Track and manage your {orders.length} order
          {orders.length !== 1 ? "s" : ""}
        </PageSubtitle>
      </PageHeader>

      <OrdersList>
        {orders.map((order) => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <OrderInfo>
                <OrderNumber>
                  <FiPackage />
                  {order.orderNumber}
                </OrderNumber>
                <OrderMeta>
                  <MetaItem>
                    <FiCalendar />
                    {new Date(order.date).toLocaleDateString()}
                  </MetaItem>
                  <MetaItem>
                    <FiCreditCard />${order.total.toFixed(2)}
                  </MetaItem>
                  <MetaItem>
                    {getStatusIcon(order.status)}
                    <StatusBadge status={order.status}>
                      {order.status}
                    </StatusBadge>
                  </MetaItem>
                </OrderMeta>
              </OrderInfo>
              <OrderActions>
                <ActionButton onClick={() => handleDownloadInvoice(order)}>
                  <FiDownload />
                  Invoice
                </ActionButton>
                <ActionButton primary>
                  <FiEye />
                  Track Order
                </ActionButton>
              </OrderActions>
            </OrderHeader>

            <OrderItems>
              <ItemsGrid>
                {order.items.map((item) => (
                  <OrderItem key={item.id}>
                    <ItemImage src={item.image} alt={item.name} />
                    <ItemDetails>
                      <ItemName>{item.name}</ItemName>
                      <ItemMeta>
                        Size: {item.size} • Color: {item.color}
                      </ItemMeta>
                      <ItemMeta>Qty: {item.quantity}</ItemMeta>
                      <ItemPrice>
                        ${(item.price * item.quantity).toFixed(2)}
                      </ItemPrice>
                    </ItemDetails>
                  </OrderItem>
                ))}
              </ItemsGrid>
              <OrderTotal>
                <span>Order Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </OrderTotal>
            </OrderItems>
          </OrderCard>
        ))}
      </OrdersList>
    </OrdersContainer>
  );
};

export default ImprovedOrders;
