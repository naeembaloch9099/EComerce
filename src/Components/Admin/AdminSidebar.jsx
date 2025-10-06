import React from "react";
import styled from "styled-components";
import {
  FiUsers,
  FiShoppingBag,
  FiShoppingCart,
  FiLogOut,
  FiHome,
  FiStar,
  FiMessageSquare,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Logo = styled.div`
  padding: 2rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  border-bottom: 1px solid #374151;
  text-align: center;
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 1rem 0;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${(props) => (props.$active ? "#10b981" : "#d1d5db")};
  background: ${(props) =>
    props.$active ? "rgba(16, 185, 129, 0.1)" : "transparent"};
  border-right: ${(props) =>
    props.$active ? "3px solid #10b981" : "3px solid transparent"};

  &:hover {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    transform: translateX(5px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const LogoutSection = styled.div`
  padding: 1rem;
  border-top: 1px solid #374151;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showAdminLogoutToast } = useToast();

  const menuItems = [
    { id: "dashboard", label: "Admin Dashboard", icon: FiHome },
    { id: "users", label: "Users", icon: FiUsers },
    { id: "products", label: "Products", icon: FiShoppingBag },
    { id: "orders", label: "Orders", icon: FiShoppingCart },
    { id: "reviews", label: "Reviews", icon: FiStar },
    { id: "messages", label: "Messages", icon: FiMessageSquare },
  ];

  const handleLogout = () => {
    logout();
    showAdminLogoutToast();
    navigate("/");
  };

  return (
    <SidebarContainer>
      <Logo>Rabbit</Logo>

      <Navigation>
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            $active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon />
            {item.label}
          </NavItem>
        ))}
      </Navigation>

      <LogoutSection>
        <LogoutButton onClick={handleLogout}>
          <FiLogOut />
          Logout
        </LogoutButton>
      </LogoutSection>
    </SidebarContainer>
  );
};

export default AdminSidebar;
