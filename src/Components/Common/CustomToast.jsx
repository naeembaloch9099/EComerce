import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progressAnimation = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

const ToastContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  margin: 0.5rem 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 300px;
  max-width: 400px;
  animation: ${(props) => (props.$visible ? slideIn : slideOut)} 0.3s ease-out;

  background: ${(props) => {
    switch (props.$type) {
      case "success":
        return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      case "error":
        return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
      case "info":
        return "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)";
      case "warning":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      default:
        return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
    }
  }};

  color: white;
`;

const ToastIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
`;

const ToastContent = styled.div`
  flex: 1;
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  width: 100%;
  animation: ${progressAnimation} ${(props) => props.$duration}ms linear;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }
`;

const CustomToast = ({
  type = "info",
  message,
  duration = 3000,
  onClose,
  visible = true,
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FiCheckCircle size={20} />;
      case "error":
        return <FiXCircle size={20} />;
      case "warning":
        return <FiAlertTriangle size={20} />;
      default:
        return <FiInfo size={20} />;
    }
  };

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <ToastContainer $type={type} $visible={isVisible}>
      <ToastIcon>{getIcon()}</ToastIcon>
      <ToastContent>{message}</ToastContent>
      <CloseButton onClick={handleClose}>
        <FiXCircle size={16} />
      </CloseButton>
      <ProgressBar $duration={duration} />
    </ToastContainer>
  );
};

export default CustomToast;
