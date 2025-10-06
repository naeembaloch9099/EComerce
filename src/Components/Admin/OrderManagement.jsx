import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FiEye, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  width: 18px;
  height: 18px;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  color: #374151;
  vertical-align: middle;
`;

const OrderId = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const CustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomerName = styled.div`
  font-weight: 600;
  color: #1f2937;
`;

const CustomerEmail = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const StatusSelect = styled.select`
  padding: 0.4rem 0.8rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  /* Style the dropdown options */
  option {
    padding: 8px 12px;
    background: white;
    color: #1f2937;
    font-weight: 600;
    font-size: 0.9rem;
    border: none;

    &:hover {
      background: #f3f4f6;
    }

    &:checked,
    &:focus {
      background: #e0f2fe;
      color: #0d47a1;
    }
  }

  /* Status-specific option colors when selected */
  option[value="pending"] {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    color: #e65100;
  }

  option[value="confirmed"] {
    background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
    color: #1b5e20;
  }

  option[value="shipped"] {
    background: linear-gradient(135deg, #f3e5f5, #e1bee7);
    color: #4a148c;
  }

  option[value="delivered"] {
    background: linear-gradient(135deg, #e0f2f1, #b2dfdb);
    color: #004d40;
  }

  option[value="cancelled"] {
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    color: #b71c1c;
  }

  ${(props) => {
    switch (props.status) {
      case "pending":
        return `
          background: linear-gradient(135deg, #ff8c00 0%, #ff6b00 50%, #e55a00 100%);
          color: white;
          border-color: #ff6b00;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          box-shadow: 0 3px 6px rgba(255, 107, 0, 0.3);
        `;
      case "confirmed":
        return `
          background: linear-gradient(135deg, #00c851 0%, #00a844 50%, #007e33 100%);
          color: white;
          border-color: #00a844;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          box-shadow: 0 3px 6px rgba(0, 168, 68, 0.3);
        `;
      case "shipped":
        return `
          background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 50%, #ab47bc 100%);
          color: white;
          border-color: #8e24aa;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          box-shadow: 0 3px 6px rgba(142, 36, 170, 0.3);
        `;
      case "delivered":
        return `
          background: linear-gradient(135deg, #2e7d32 0%, #388e3c 50%, #43a047 100%);
          color: white;
          border-color: #388e3c;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          box-shadow: 0 3px 6px rgba(56, 142, 60, 0.3);
        `;
      case "cancelled":
        return `
          background: linear-gradient(135deg, #d32f2f 0%, #f44336 50%, #ff5722 100%);
          color: white;
          border-color: #f44336;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          box-shadow: 0 3px 6px rgba(244, 67, 54, 0.3);
        `;
      default:
        return `
          background: linear-gradient(135deg, #757575 0%, #616161 50%, #424242 100%);
          color: white;
          border-color: #616161;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        `;
    }
  }}
`;

const ConfirmedAmount = styled.div`
  font-weight: 700;
  color: #059669;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: "✅";
    font-size: 0.8rem;
  }
`;

const PendingAmount = styled.div`
  font-weight: 700;
  color: #6b7280;
  font-size: 1.1rem;
  opacity: 0.7;
`;

const Amount = styled.div`
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;

  &:hover {
    background: #2563eb;
    transform: scale(1.05);
  }
`;

// Invoice Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  color: #6b7280;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }
`;

const InvoiceHeader = styled.div`
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InvoiceTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const InvoiceSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 0.25rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoItem = styled.div`
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #1f2937;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
`;

const ItemRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
`;

const ItemCell = styled.td`
  padding: 0.75rem;
  text-align: ${(props) => props.align || "left"};
  font-size: 0.9rem;
`;

const ItemHeader = styled.th`
  padding: 0.75rem;
  text-align: ${(props) => props.align || "left"};
  font-weight: 600;
  color: #374151;
  background: #f8fafc;
  border-bottom: 2px solid #e5e7eb;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TotalSection = styled.div`
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  ${(props) =>
    props.isFinal &&
    `
    font-weight: 700;
    font-size: 1.1rem;
    color: #059669;
    border-top: 2px solid #e5e7eb;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
  `}
`;

const PrintButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
`;

// NO DUMMY DATA - Only real orders from database
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // API URL constant
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch real orders from backend - NO DUMMY DATA
  useEffect(() => {
    const fetchRealOrders = async () => {
      try {
        console.log("🔍 OrderManagement: Fetching orders from backend...");
        setLoading(true);

        // Check for available tokens
        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");
        const token = localStorage.getItem("token");

        console.log("🔑 Available tokens:", {
          refreshToken: refreshToken ? "exists" : "missing",
          accessToken: accessToken ? "exists" : "missing",
          token: token ? "exists" : "missing",
        });

        const authToken = accessToken || token || refreshToken;

        if (!authToken) {
          console.error("❌ OrderManagement: No auth token found");
          toast.error("Please login again to view orders");
          setOrders([]); // Keep empty - no dummy data
          return;
        }

        console.log(
          "🔑 Using token for request:",
          authToken.substring(0, 20) + "..."
        );

        const response = await fetch(`${API_URL}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ OrderManagement: Raw API response:", data);

          // Use array filtering for robust data processing
          let ordersArray = [];

          // Filter and validate the response structure
          const validatedData = [data].filter(
            (d) => d && typeof d === "object"
          )[0];

          if (validatedData && validatedData.status === "success") {
            // Multiple possible data structures - use array filtering to handle all
            const possibleOrdersData = [
              validatedData.data?.orders,
              validatedData.orders,
              validatedData.data,
            ].filter((d) => d !== null && d !== undefined);

            // Find the actual orders array
            const ordersData =
              possibleOrdersData.find((d) => Array.isArray(d)) || [];

            console.log(
              "📋 OrderManagement: Found orders data:",
              ordersData.length,
              "orders"
            );

            // Apply array filtering to clean and transform orders
            ordersArray = ordersData
              .filter((order) => {
                // Filter out invalid orders using array operations
                const isValidOrder =
                  order && typeof order === "object" && order._id && order.user;

                if (!isValidOrder) {
                  console.warn("⚠️ Filtering out invalid order:", order);
                }
                return isValidOrder;
              })
              .map((order) => {
                console.log("🔍 Processing order items:", {
                  orderItemsRaw: order.orderItems,
                  orderItemsLength: order.orderItems?.length || 0,
                  orderItemsType: Array.isArray(order.orderItems)
                    ? "array"
                    : typeof order.orderItems,
                });

                // Transform each order to consistent format
                const transformedOrder = {
                  // Preserve original ID fields for backend compatibility
                  _id: order._id,
                  orderKey: order.orderKey,
                  orderNumber: order.orderNumber,
                  id: order._id,
                  // Rest of the transformation
                  customer: {
                    name:
                      [
                        order.user?.name,
                        order.user?.firstName,
                        order.user?.lastName,
                      ]
                        .filter((name) => name && typeof name === "string")
                        .join(" ")
                        .trim() || "Unknown Customer",
                    email: order.user?.email || "No email provided",
                  },
                  status: order.status || "pending",
                  amount: parseFloat(
                    order.totalAmount || order.total || order.totalPrice || 0
                  ),
                  totalPrice: parseFloat(
                    order.totalPrice || order.totalAmount || order.total || 0
                  ),
                  date: order.createdAt
                    ? new Date(order.createdAt).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                  createdAt: order.createdAt,
                  // Preserve original user field for table display
                  user: order.user,
                  // Fix items counting - don't filter by product field, just count all valid items
                  items: Array.isArray(order.orderItems)
                    ? order.orderItems.filter(
                        (item) => item && typeof item === "object"
                      ).length
                    : 0,
                  orderItems: Array.isArray(order.orderItems)
                    ? order.orderItems.filter(
                        (item) => item && typeof item === "object"
                      )
                    : [],
                  shippingAddress: order.shippingAddress || {},
                  paymentMethod: order.paymentMethod || "Unknown",
                  paymentStatus: order.paymentStatus || "pending",
                };

                console.log(
                  "🔄 Transformed order:",
                  transformedOrder.id,
                  transformedOrder.customer.name
                );
                console.log("🆔 Order IDs available:", {
                  _id: transformedOrder._id,
                  orderKey: transformedOrder.orderKey,
                  orderNumber: transformedOrder.orderNumber,
                  id: transformedOrder.id,
                });
                console.log("📦 Order items info:", {
                  itemsCount: transformedOrder.items,
                  orderItemsLength: transformedOrder.orderItems?.length || 0,
                  orderItemsSample: transformedOrder.orderItems?.slice(0, 2), // Show first 2 items for debugging
                });
                return transformedOrder;
              })
              .filter((order) => order.id); // Final filter to ensure all orders have IDs

            console.log(
              "✅ OrderManagement: Successfully processed",
              ordersArray.length,
              "valid orders"
            );
          } else {
            console.warn(
              "⚠️ OrderManagement: API response not successful:",
              validatedData
            );
          }

          setOrders(ordersArray);

          // Enhanced success messaging with array filtering info
          if (ordersArray.length > 0) {
            toast.success(
              `✅ Loaded ${ordersArray.length} real orders from database`
            );
          } else {
            toast(
              "📋 No orders found in database - system ready for new orders",
              {
                icon: "ℹ️",
                duration: 3000,
              }
            );
          }
        } else {
          console.error("❌ OrderManagement: Failed to fetch orders");
          setOrders([]); // Keep empty - no dummy data
          toast.error("Failed to fetch orders from server");
        }
      } catch (error) {
        console.error("❌ OrderManagement: Error fetching orders:", error);
        setOrders([]); // Keep empty - no dummy data
        toast.error("Error loading orders from server");
      } finally {
        setLoading(false);
      }
    };

    fetchRealOrders();
  }, [API_URL]);

  // ADVANCED ARRAY FILTERING for search, status, and sorting
  // Multi-layer array filtering with error-safe operations
  const filteredOrders = [orders]
    .filter((ordersList) => Array.isArray(ordersList)) // Ensure we have array
    .flatMap((ordersList) => ordersList) // Flatten to individual orders
    .filter((order) => {
      // Search filtering using array operations
      if (!searchTerm) return true;

      const searchableFields = [
        order.customer?.name,
        order.customer?.email,
        order.id,
        order.status,
        order.paymentMethod,
      ]
        .filter((field) => field && typeof field === "string")
        .map((field) => field.toLowerCase());

      return searchableFields.some((field) =>
        field.includes(searchTerm.toLowerCase())
      );
    })
    .filter((order) => {
      // Status filtering
      return filterStatus === "all" || order.status === filterStatus;
    })
    .sort((a, b) => {
      // Array-safe sorting
      const getSortValue = (order, field) => {
        switch (field) {
          case "date":
            return new Date(order.date || 0).getTime();
          case "amount":
            return parseFloat(order.amount || 0);
          case "customer":
            return (order.customer?.name || "").toLowerCase();
          case "status":
            return (order.status || "").toLowerCase();
          case "items":
            return parseInt(order.items || 0);
          default:
            return 0;
        }
      };

      const aVal = getSortValue(a, sortBy);
      const bVal = getSortValue(b, sortBy);

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

  // Array filtering stats for debugging
  console.log("📊 OrderManagement Filter Stats:", {
    totalOrders: orders.length,
    filteredOrders: filteredOrders.length,
    searchTerm,
    filterStatus,
    sortBy,
    sortOrder,
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowInvoice(true);
  };

  const handleCloseInvoice = () => {
    setShowInvoice(false);
    setSelectedOrder(null);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateSubtotal = (items) => {
    console.log("💰 Calculating subtotal for items:", items);
    const subtotal = items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      console.log(
        `📦 Item: ${item.name}, Price: ${item.price}, Qty: ${item.quantity}, Total: ${itemTotal}`
      );
      return sum + itemTotal;
    }, 0);
    console.log("💰 Final subtotal:", subtotal);
    return subtotal;
  };

  // Invoice Modal Component
  const InvoiceModal = ({ order, onClose }) => {
    if (!order) return null;

    console.log("🧾 Invoice Modal - Order data:", order);
    console.log("📦 Invoice Modal - Order items:", order.orderItems);

    const subtotal = calculateSubtotal(order.orderItems || []);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = 10; // $10 shipping
    const total = subtotal + tax + shipping;

    return (
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>×</CloseButton>

          <InvoiceHeader>
            <InvoiceTitle>
              Invoice #{order.orderNumber || order.orderKey}
            </InvoiceTitle>
            <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Order Date: {formatDate(order.createdAt)}
            </div>
          </InvoiceHeader>

          <InvoiceSection>
            <SectionTitle>Customer Information</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Customer Name</InfoLabel>
                <InfoValue>
                  {order.user?.name || order.customer?.name || "N/A"}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>
                  {order.user?.email || order.customer?.email || "N/A"}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{order.shippingAddress?.phone || "N/A"}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Order Status</InfoLabel>
                <InfoValue
                  style={{
                    textTransform: "uppercase",
                    fontWeight: "bold",
                    color:
                      order.status === "delivered"
                        ? "#059669"
                        : order.status === "cancelled"
                        ? "#ef4444"
                        : "#3b82f6",
                  }}
                >
                  {order.status}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </InvoiceSection>

          <InvoiceSection>
            <SectionTitle>Shipping Address</SectionTitle>
            <InfoItem>
              <InfoValue>
                {order.shippingAddress?.firstName}{" "}
                {order.shippingAddress?.lastName}
                <br />
                {order.shippingAddress?.addressLine1}
                <br />
                {order.shippingAddress?.addressLine2 && (
                  <>
                    {order.shippingAddress.addressLine2}
                    <br />
                  </>
                )}
                {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                {order.shippingAddress?.zipCode}
                <br />
                {order.shippingAddress?.country}
              </InfoValue>
            </InfoItem>
          </InvoiceSection>

          <InvoiceSection>
            <SectionTitle>Order Items</SectionTitle>
            <ItemsTable>
              <thead>
                <tr>
                  <ItemHeader>Item</ItemHeader>
                  <ItemHeader align="center">Quantity</ItemHeader>
                  <ItemHeader align="right">Price</ItemHeader>
                  <ItemHeader align="right">Total</ItemHeader>
                </tr>
              </thead>
              <tbody>
                {(order.orderItems || []).map((item, index) => (
                  <ItemRow key={index}>
                    <ItemCell>
                      <div style={{ fontWeight: "600" }}>{item.name}</div>
                      {item.size && (
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          Size: {item.size}
                        </div>
                      )}
                      {item.color && (
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                          Color: {item.color}
                        </div>
                      )}
                    </ItemCell>
                    <ItemCell align="center">{item.quantity}</ItemCell>
                    <ItemCell align="right">${item.price.toFixed(2)}</ItemCell>
                    <ItemCell align="right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </ItemCell>
                  </ItemRow>
                ))}
              </tbody>
            </ItemsTable>
          </InvoiceSection>

          <InvoiceSection>
            <SectionTitle>Payment Information</SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Payment Method</InfoLabel>
                <InfoValue style={{ textTransform: "capitalize" }}>
                  {order.paymentMethod || "N/A"}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Payment Status</InfoLabel>
                <InfoValue
                  style={{
                    textTransform: "capitalize",
                    color:
                      order.paymentStatus === "paid" ? "#059669" : "#f59e0b",
                  }}
                >
                  {order.paymentStatus || "Pending"}
                </InfoValue>
              </InfoItem>
            </InfoGrid>
          </InvoiceSection>

          <TotalSection>
            <TotalRow>
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </TotalRow>
            <TotalRow>
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </TotalRow>
            <TotalRow>
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </TotalRow>
            <TotalRow isFinal>
              <span>Total Amount:</span>
              <span>${total.toFixed(2)}</span>
            </TotalRow>
          </TotalSection>

          <PrintButton onClick={handlePrintInvoice}>
            🖨️ Print Invoice
          </PrintButton>
        </ModalContent>
      </ModalOverlay>
    );
  };

  // Get allowed status transitions based on current status
  const getAllowedStatuses = (currentStatus) => {
    console.log(
      "🔄 Getting allowed statuses for current status:",
      currentStatus
    );

    let allowedStatuses;
    switch (currentStatus) {
      case "pending":
        allowedStatuses = ["pending", "confirmed", "shipped", "cancelled"];
        break;
      case "confirmed":
        allowedStatuses = ["confirmed", "shipped", "delivered"];
        break;
      case "shipped":
        allowedStatuses = ["shipped", "delivered"];
        break;
      case "delivered":
        allowedStatuses = ["delivered"]; // Final status - no changes allowed
        break;
      case "cancelled":
        allowedStatuses = ["cancelled"]; // Final status - no changes allowed
        break;
      default:
        allowedStatuses = ["pending"];
        break;
    }

    console.log("✅ Allowed statuses:", allowedStatuses);
    return allowedStatuses;
  };

  // Send email notification for status changes
  const sendStatusChangeEmail = async (order, oldStatus, newStatus) => {
    try {
      const authToken =
        localStorage.getItem("refreshToken") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (!authToken) return;

      await fetch(
        `${API_URL}/api/admin/orders/${order._id}/send-status-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            orderId: order._id,
            customerEmail: order.user?.email || order.customer?.email,
            customerName: order.user?.name || order.customer?.name,
            oldStatus,
            newStatus,
            orderTotal: order.totalPrice || order.amount,
            orderNumber: order.orderNumber || order.orderKey,
          }),
        }
      );
    } catch (error) {
      console.error("❌ Failed to send status email:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Changing order ${orderId} status to ${newStatus}`);
      console.log("🔍 Order ID type:", typeof orderId);
      console.log("🔍 Order ID value:", orderId);

      // Find the current order to validate status transition
      const currentOrder = orders.find(
        (order) =>
          order._id === orderId ||
          order.orderKey === orderId ||
          order.orderNumber === orderId ||
          order.id === orderId
      );

      if (!currentOrder) {
        toast.error("Order not found");
        return;
      }

      const allowedStatuses = getAllowedStatuses(currentOrder.status);
      if (!allowedStatuses.includes(newStatus)) {
        toast.error(
          `Cannot change status from ${currentOrder.status} to ${newStatus}`
        );
        return;
      }

      const authToken =
        localStorage.getItem("refreshToken") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token");

      if (!authToken) {
        toast.error("Authentication required");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            status: newStatus,
            notes: `Status changed to ${newStatus} by admin`,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Status updated:", result);

        const oldStatus = currentOrder.status;

        // Update the local orders state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ||
            order.orderKey === orderId ||
            order.orderNumber === orderId ||
            order.id === orderId
              ? { ...order, status: newStatus }
              : order
          )
        );

        // Send email notification
        await sendStatusChangeEmail(currentOrder, oldStatus, newStatus);

        // Show appropriate success message
        if (newStatus === "cancelled") {
          toast.success(
            `Order cancelled - Refund notification sent to customer`,
            {
              duration: 5000,
              icon: "💰",
            }
          );
        } else {
          toast.success(`Order status updated to ${newStatus}`, {
            icon: "📋",
          });
        }
      } else {
        const error = await response.json();
        console.error("❌ Status update failed:", error);
        toast.error(`Failed to update status: ${error.message}`);
      }
    } catch (error) {
      console.error("❌ Status update error:", error);
      toast.error("Error updating order status");
    }
  };

  return (
    <>
      <Container>
        <Header>
          <Title>Order Management</Title>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          {/* Filter and Sort Controls */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="customer">Sort by Customer</option>
              <option value="status">Sort by Status</option>
              <option value="items">Sort by Items</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ddd",
                background: "#f8f9fa",
              }}
            >
              {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
            </button>
          </div>
        </Header>

        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Order ID</TableHeaderCell>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Items</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan="7"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    <div style={{ color: "#6b7280", fontSize: "1.1rem" }}>
                      Loading orders...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan="7"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
                    <div style={{ color: "#6b7280", fontSize: "1.1rem" }}>
                      {orders.length === 0
                        ? "No orders found"
                        : "No orders match your search"}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow
                    key={
                      order._id ||
                      order.orderKey ||
                      order.orderNumber ||
                      order.id
                    }
                  >
                    <TableCell>
                      <OrderId>
                        {order.orderKey || order.orderNumber || order.id}
                      </OrderId>
                    </TableCell>
                    <TableCell>
                      <CustomerInfo>
                        <CustomerName>
                          {order.user?.name ||
                            order.customer?.name ||
                            "Unknown Customer"}
                        </CustomerName>
                        <CustomerEmail>
                          {order.user?.email ||
                            order.customer?.email ||
                            order.shippingAddress?.email ||
                            "No email"}
                        </CustomerEmail>
                      </CustomerInfo>
                    </TableCell>
                    <TableCell>
                      <StatusSelect
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(
                            order._id ||
                              order.orderKey ||
                              order.orderNumber ||
                              order.id,
                            e.target.value
                          )
                        }
                        status={order.status}
                        disabled={
                          order.status === "delivered" ||
                          order.status === "cancelled"
                        }
                      >
                        {getAllowedStatuses(order.status).map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </StatusSelect>
                    </TableCell>
                    <TableCell>
                      {["confirmed", "shipped", "delivered"].includes(
                        order.status
                      ) ? (
                        <ConfirmedAmount>
                          ${order.totalPrice || order.amount}
                        </ConfirmedAmount>
                      ) : order.status === "cancelled" ? (
                        <PendingAmount
                          style={{
                            color: "#ef4444",
                            textDecoration: "line-through",
                          }}
                        >
                          ${order.totalPrice || order.amount} (Refunded)
                        </PendingAmount>
                      ) : (
                        <PendingAmount>
                          ${order.totalPrice || order.amount}
                        </PendingAmount>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        order.createdAt || order.date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.orderItems?.length || order.items || 0} item
                      {(order.orderItems?.length || order.items || 0) !== 1
                        ? "s"
                        : ""}
                    </TableCell>
                    <TableCell>
                      <ActionButton onClick={() => handleViewOrder(order)}>
                        <FiEye size={14} />
                        View Invoice
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </TableContainer>
      </Container>

      {/* Invoice Modal */}
      {showInvoice && selectedOrder && (
        <InvoiceModal order={selectedOrder} onClose={handleCloseInvoice} />
      )}
    </>
  );
};

export default OrderManagement;
