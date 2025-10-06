import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  FiUsers,
  FiShoppingBag,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from "recharts";

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 3rem;
  text-align: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
    border-radius: 2px;
  }
`;

const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const BrandLogo = styled.div`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "Arial Black", sans-serif;
  letter-spacing: -2px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(props) =>
      props.gradient || "linear-gradient(90deg, #3b82f6, #8b5cf6)"};
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.color || "#3b82f6"};
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 1rem;
    background: ${(props) => props.color || "#3b82f6"};
    opacity: 0.3;
    filter: blur(8px);
    z-index: -1;
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${(props) => (props.$positive ? "#10b981" : "#ef4444")};
  background: ${(props) =>
    props.$positive ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)"};
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: 1px solid
    ${(props) =>
      props.$positive ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-style: italic;
`;

const RecentActivity = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8) 0%,
    rgba(248, 250, 252, 0.4) 100%
  );
  border-radius: 0.75rem;
  border: 1px solid rgba(241, 245, 249, 0.8);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.9) 0%,
      rgba(248, 250, 252, 0.8) 100%
    );
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(props) => props.color || "#3b82f6"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: ${(props) => props.color || "#3b82f6"};
    opacity: 0.3;
    filter: blur(6px);
    z-index: -1;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  color: #374151;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  line-height: 1.4;
`;

const ActivityTime = styled.div`
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 500;
`;

const OrderStatusSummary = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #f59e0b, #10b981, #3b82f6);
  }
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StatusCard = styled.div`
  background: ${(props) => props.bgColor || "#f8fafc"};
  padding: 1.5rem;
  border-radius: 1rem;
  border-left: 5px solid ${(props) => props.borderColor || "#e5e7eb"};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    background: ${(props) => props.borderColor || "#e5e7eb"};
    opacity: 0.1;
    border-radius: 50%;
    transform: translate(20px, -20px);
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

const StatusNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${(props) => props.color || "#1f2937"};
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
`;

const StatusText = styled.div`
  color: #6b7280;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log("🔍 DashboardOverview: Starting to fetch dashboard data...");
      setLoading(true);
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.error("❌ DashboardOverview: No refresh token found");
        toast.error("Please login again");
        return;
      }

      console.log("🔑 DashboardOverview: Using refresh token for API call");

      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(
        "📡 DashboardOverview: API response status:",
        response.status
      );

      if (response.ok) {
        const data = await response.json();
        console.log(
          "✅ DashboardOverview: Dashboard data fetched successfully:",
          data
        );
        setDashboardData(data.data);
        toast.success("Dashboard data loaded successfully");
      } else if (response.status === 401) {
        console.error("❌ DashboardOverview: Unauthorized - session expired");
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ DashboardOverview: API error:", errorData);
        toast.error(errorData.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error(
        "❌ DashboardOverview: Error fetching dashboard data:",
        error
      );
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Backend server is not running. Please start the server.");
      } else {
        toast.error("Error loading dashboard data");
      }
    } finally {
      setLoading(false);
      console.log("🏁 DashboardOverview: Fetch completed");
    }
  }, [API_URL]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Debug dashboard data
  useEffect(() => {
    if (dashboardData) {
      console.log(
        "📊 DashboardOverview: Dashboard data loaded:",
        dashboardData
      );
      console.log("👥 Users:", dashboardData.users);
      console.log("📦 Products:", dashboardData.products);
      console.log("🛒 Orders:", dashboardData.orders);
      console.log("📈 Daily Revenue:", dashboardData.dailyRevenue);
    }
  }, [dashboardData]);

  // Fallback data while loading or if API fails
  const defaultSalesData = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
    { name: "Jul", sales: 3490, revenue: 4300 },
  ];

  const defaultCategoryData = [
    { name: "Men", value: 400, color: "#3b82f6" },
    { name: "Women", value: 300, color: "#ec4899" },
    { name: "Kids", value: 200, color: "#10b981" },
    { name: "Accessories", value: 100, color: "#f59e0b" },
  ];

  const defaultOrderStatusData = [
    {
      name: "Mon",
      pending: 24,
      confirmed: 18,
      processing: 8,
      shipped: 15,
      delivered: 45,
      cancelled: 3,
    },
    {
      name: "Tue",
      pending: 13,
      confirmed: 22,
      processing: 12,
      shipped: 18,
      delivered: 52,
      cancelled: 2,
    },
    {
      name: "Wed",
      pending: 18,
      confirmed: 15,
      processing: 9,
      shipped: 14,
      delivered: 38,
      cancelled: 5,
    },
    {
      name: "Thu",
      pending: 22,
      confirmed: 19,
      processing: 11,
      shipped: 12,
      delivered: 41,
      cancelled: 1,
    },
    {
      name: "Fri",
      pending: 15,
      confirmed: 25,
      processing: 14,
      shipped: 16,
      delivered: 55,
      cancelled: 4,
    },
    {
      name: "Sat",
      pending: 28,
      confirmed: 16,
      processing: 7,
      shipped: 10,
      delivered: 33,
      cancelled: 2,
    },
    {
      name: "Sun",
      pending: 12,
      confirmed: 20,
      processing: 10,
      shipped: 12,
      delivered: 42,
      cancelled: 1,
    },
  ];

  // Process daily revenue data for charts
  const processedSalesData = dashboardData?.dailyRevenue
    ? dashboardData.dailyRevenue.map((item) => ({
        name: new Date(item._id).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        sales: item.orders || 0,
        revenue: item.revenue || 0,
      }))
    : defaultSalesData;

  // Process category data (could be enhanced with real data from backend)
  const processedCategoryData = dashboardData?.products
    ? [
        {
          name: "Active",
          value: dashboardData.products.active,
          color: "#10b981",
        },
        {
          name: "Out of Stock",
          value: dashboardData.products.outOfStock,
          color: "#ef4444",
        },
        {
          name: "Low Stock",
          value: dashboardData.products.lowStock,
          color: "#f59e0b",
        },
      ]
    : defaultCategoryData;

  // Process order status data from real dashboard data
  const processedOrderStatusData = dashboardData?.orders
    ? [
        {
          name: "Status",
          pending: dashboardData.orders.pending || 0,
          confirmed: dashboardData.orders.confirmed || 0,
          processing: dashboardData.orders.processing || 0,
          shipped: dashboardData.orders.shipped || 0,
          delivered: dashboardData.orders.delivered || 0,
          cancelled: dashboardData.orders.cancelled || 0,
        },
      ]
    : defaultOrderStatusData;

  // Use real data if available, otherwise use defaults
  const salesData = processedSalesData;
  const categoryData = processedCategoryData;
  const orderStatusData = processedOrderStatusData;

  const stats = [
    {
      icon: FiUsers,
      value: dashboardData?.users?.total?.toString() || "0",
      label: "Total Users",
      change:
        dashboardData?.users?.newUsers > 0
          ? `+${dashboardData.users.newUsers}`
          : "+0",
      positive: true,
      color: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      gradient: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
    },
    {
      icon: FiShoppingBag,
      value: dashboardData?.products?.total?.toString() || "0",
      label: "Total Products",
      change:
        dashboardData?.products?.active > 0
          ? `${dashboardData.products.active} active`
          : "0 active",
      positive: true,
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      gradient: "linear-gradient(90deg, #10b981, #059669)",
    },
    {
      icon: FiShoppingCart,
      value: dashboardData?.orders?.total?.toString() || "0",
      label: "Total Orders",
      change:
        dashboardData?.orders?.periodOrders > 0
          ? `+${dashboardData.orders.periodOrders}`
          : "+0",
      positive: true,
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      gradient: "linear-gradient(90deg, #f59e0b, #d97706)",
    },
    {
      icon: FiDollarSign,
      value: dashboardData?.orders?.totalRevenue
        ? `$${dashboardData.orders.totalRevenue.toLocaleString()}`
        : "$0",
      label: "Total Revenue",
      change:
        dashboardData?.orders?.periodRevenue > 0
          ? `+$${dashboardData.orders.periodRevenue.toLocaleString()}`
          : "+$0",
      positive: true,
      color: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      gradient: "linear-gradient(90deg, #8b5cf6, #7c3aed)",
    },
  ];

  // Process recent activities from real data
  const recentActivities = dashboardData
    ? [
        {
          icon: FiUsers,
          text: `Total of ${dashboardData.users?.total || 0} users registered`,
          time: `${dashboardData.users?.newUsers || 0} new users recently`,
          color: "#3b82f6",
        },
        {
          icon: FiShoppingBag,
          text: `${dashboardData.products?.total || 0} products in catalog`,
          time: `${dashboardData.products?.active || 0} active products`,
          color: "#10b981",
        },
        {
          icon: FiShoppingCart,
          text: `${dashboardData.orders?.total || 0} total orders placed`,
          time: `$${
            dashboardData.orders?.totalRevenue?.toLocaleString() || 0
          } total revenue`,
          color: "#f59e0b",
        },
        ...(dashboardData.products?.outOfStock > 0
          ? [
              {
                icon: FiActivity,
                text: `${dashboardData.products.outOfStock} products out of stock`,
                time: "Needs attention",
                color: "#ef4444",
              },
            ]
          : []),
        ...(dashboardData.products?.lowStock > 0
          ? [
              {
                icon: FiActivity,
                text: `${dashboardData.products.lowStock} products low on stock`,
                time: "Monitor inventory",
                color: "#f59e0b",
              },
            ]
          : []),
        ...(dashboardData.recentOrders?.length > 0
          ? dashboardData.recentOrders.slice(0, 2).map((order) => ({
              icon: FiShoppingCart,
              text: `Order #${order.orderNumber} - $${order.totalPrice}`,
              time: `Status: ${order.status} - ${new Date(
                order.createdAt
              ).toLocaleDateString()}`,
              color:
                order.status === "delivered"
                  ? "#10b981"
                  : order.status === "pending"
                  ? "#f59e0b"
                  : "#3b82f6",
            }))
          : [
              {
                icon: FiShoppingCart,
                text: "No orders yet",
                time: "Start promoting your products!",
                color: "#6b7280",
              },
            ]),
      ]
    : [
        {
          icon: FiUsers,
          text: "Loading user data...",
          time: "Please wait",
          color: "#6b7280",
        },
        {
          icon: FiShoppingBag,
          text: "Loading product data...",
          time: "Please wait",
          color: "#6b7280",
        },
        {
          icon: FiShoppingCart,
          text: "Loading order data...",
          time: "Please wait",
          color: "#6b7280",
        },
      ];

  if (loading) {
    return (
      <Container>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
            color: "#6b7280",
            fontSize: "1.1rem",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #f3f4f6",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "1rem",
            }}
          />
          <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
            Loading Rabbit Dashboard...
          </div>
          <div style={{ fontSize: "0.9rem", opacity: "0.7" }}>
            Fetching your store analytics
          </div>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BrandContainer>
          <BrandLogo>🐰 RABBIT</BrandLogo>
        </BrandContainer>
        <Title>Admin Dashboard</Title>
        <Subtitle>
          Welcome back to your Rabbit Store! Here's a comprehensive overview of
          your business performance, customer engagement, and growth metrics.
          Monitor your success and make data-driven decisions.
        </Subtitle>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index} gradient={stat.gradient}>
            <StatHeader>
              <StatIcon color={stat.color}>
                <stat.icon size={28} />
              </StatIcon>
              <StatChange $positive={stat.positive}>
                <FiTrendingUp size={16} />
                {stat.change}
              </StatChange>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      {/* Order Status Summary */}
      <OrderStatusSummary>
        <ChartTitle>
          📊 Order Status Overview - Rabbit Store Performance
        </ChartTitle>
        <div
          style={{
            color: "#6b7280",
            fontSize: "1rem",
            marginBottom: "1rem",
            fontWeight: "500",
          }}
        >
          Monitor your order processing pipeline and customer satisfaction
          metrics
        </div>
        <StatusGrid>
          <StatusCard bgColor="#fff7ed" borderColor="#f59e0b">
            <StatusNumber color="#d97706">
              {dashboardData?.orders?.pending || 0}
            </StatusNumber>
            <StatusText>Pending Orders</StatusText>
          </StatusCard>
          <StatusCard bgColor="#eff6ff" borderColor="#3b82f6">
            <StatusNumber color="#2563eb">
              {dashboardData?.orders?.confirmed || 0}
            </StatusNumber>
            <StatusText>Confirmed Orders</StatusText>
          </StatusCard>
          <StatusCard bgColor="#f0f9ff" borderColor="#6366f1">
            <StatusNumber color="#4f46e5">
              {dashboardData?.orders?.processing || 0}
            </StatusNumber>
            <StatusText>Processing Orders</StatusText>
          </StatusCard>
          <StatusCard bgColor="#faf5ff" borderColor="#8b5cf6">
            <StatusNumber color="#7c3aed">
              {dashboardData?.orders?.shipped || 0}
            </StatusNumber>
            <StatusText>Shipped Orders</StatusText>
          </StatusCard>
          <StatusCard bgColor="#f0fdf4" borderColor="#10b981">
            <StatusNumber color="#059669">
              {dashboardData?.orders?.delivered || 0}
            </StatusNumber>
            <StatusText>Delivered Orders</StatusText>
          </StatusCard>
          <StatusCard bgColor="#fef2f2" borderColor="#ef4444">
            <StatusNumber color="#dc2626">
              {dashboardData?.orders?.cancelled || 0}
            </StatusNumber>
            <StatusText>Cancelled Orders</StatusText>
          </StatusCard>
        </StatusGrid>
      </OrderStatusSummary>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>📈 Sales & Revenue Analytics</ChartTitle>
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            Track your Rabbit Store's sales performance and revenue growth
            trends
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis stroke="#6b7280" fontSize={12} fontWeight={500} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(10px)",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
                name="Sales"
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>🛍️ Product Categories</ChartTitle>
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            Distribution of products across your Rabbit Store catalog
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
                fontSize={12}
                fontWeight={600}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                  backdropFilter: "blur(10px)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>📋 Order Status Distribution</ChartTitle>
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            Detailed breakdown of order processing stages in your Rabbit Store
          </div>
          <ResponsiveContainer width="100%" height={320}>
            {dashboardData?.orders ? (
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  fontSize={12}
                  fontWeight={500}
                />
                <YAxis stroke="#6b7280" fontSize={12} fontWeight={500} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                />
                <Bar
                  dataKey="pending"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  name="Pending"
                />
                <Bar
                  dataKey="confirmed"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Confirmed"
                />
                <Bar
                  dataKey="processing"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Processing"
                />
                <Bar
                  dataKey="shipped"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  name="Shipped"
                />
                <Bar
                  dataKey="delivered"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Delivered"
                />
                <Bar
                  dataKey="cancelled"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  name="Cancelled"
                />
              </BarChart>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  fontStyle: "italic",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📊</div>
                <div>Loading order status data...</div>
              </div>
            )}
          </ResponsiveContainer>
        </ChartCard>

        <RecentActivity>
          <ChartTitle>🔔 Recent Activity</ChartTitle>
          <div
            style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              marginBottom: "1rem",
              fontWeight: "500",
            }}
          >
            Latest updates and activities in your Rabbit Store
          </div>
          <ActivityList>
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon color={activity.color}>
                  <activity.icon size={18} />
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.text}</ActivityText>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </RecentActivity>
      </ChartsGrid>
    </Container>
  );
};

export default DashboardOverview;
