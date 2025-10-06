import React, { useState } from "react";
import styled from "styled-components";
import AdminSidebar from "./AdminSidebar";
import UserManagement from "./UserManagement";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import DashboardOverview from "./DashboardOverview";
import ReviewManagement from "./ReviewManagement";
import ContactManagement from "./ContactManagement";
import AuthDebugger from "../Common/AuthDebugger";

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 250px;
  min-height: 100vh;
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "users":
        return <UserManagement />;
      case "products":
        return <ProductManagement />;
      case "orders":
        return <OrderManagement />;
      case "reviews":
        return <ReviewManagement />;
      case "messages":
        return <ContactManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AdminContainer>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainContent>{renderContent()}</MainContent>
    </AdminContainer>
  );
};

export default AdminDashboard;
