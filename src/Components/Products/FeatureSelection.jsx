import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiCheck,
  FiStar,
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiHeart,
} from "react-icons/fi";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const FeatureContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  animation: ${fadeInUp} 0.8s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #ec4899, #10b981);
    background-size: 200% 100%;
    animation: ${shimmer} 2s infinite;
  }
`;

const FeatureHeader = styled.div`
  margin-bottom: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FeatureCard = styled.div`
  padding: 1.5rem;
  border: 2px solid ${(props) => (props.$isActive ? "#3b82f6" : "#e5e7eb")};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) =>
    props.$isActive
      ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
      : "white"};
  position: relative;

  &:hover {
    border-color: #3b82f6;
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
  }

  ${(props) =>
    props.$isActive &&
    `
    animation: ${pulse} 2s infinite;
  `}
`;

const FeatureIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${(props) =>
    props.$isActive
      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
      : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: ${(props) => (props.$isActive ? "white" : "#6b7280")};
  transition: all 0.3s ease;
`;

const FeatureLabel = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => (props.$isActive ? "#1d4ed8" : "#374151")};
  margin-bottom: 0.5rem;
`;

const FeatureValue = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
`;

const CheckIcon = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: ${(props) => (props.$isActive ? 1 : 0)};
  transform: scale(${(props) => (props.$isActive ? 1 : 0.8)});
  transition: all 0.3s ease;
`;

const SelectionSummary = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 2px dashed #cbd5e1;
  animation: ${scaleIn} 0.5s ease-out;
`;

const SummaryTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SummaryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const SummaryItem = styled.div`
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FeatureSelection = ({
  title = "Customize Your Experience",
  description = "Select the features that matter most to you",
  features = [
    {
      id: "premium_quality",
      icon: <FiStar size={20} />,
      label: "Premium Quality",
      value: "Handcrafted materials",
      description: "Made with the finest materials and attention to detail",
    },
    {
      id: "fast_shipping",
      icon: <FiTruck size={20} />,
      label: "Fast Shipping",
      value: "2-day delivery",
      description: "Express shipping to your doorstep within 48 hours",
    },
    {
      id: "warranty",
      icon: <FiShield size={20} />,
      label: "Warranty Protection",
      value: "2-year coverage",
      description: "Comprehensive warranty against manufacturing defects",
    },
    {
      id: "easy_returns",
      icon: <FiRefreshCw size={20} />,
      label: "Easy Returns",
      value: "30-day policy",
      description: "Hassle-free returns within 30 days of purchase",
    },
    {
      id: "customer_support",
      icon: <FiHeart size={20} />,
      label: "24/7 Support",
      value: "Always available",
      description: "Round-the-clock customer service and assistance",
    },
    {
      id: "eco_friendly",
      icon: <FiCheck size={20} />,
      label: "Eco-Friendly",
      value: "Sustainable choice",
      description: "Environmentally conscious manufacturing processes",
    },
  ],
  onSelectionChange,
}) => {
  const [selectedFeatures, setSelectedFeatures] = useState(new Set());

  const handleFeatureToggle = (featureId) => {
    const newSelection = new Set(selectedFeatures);

    if (newSelection.has(featureId)) {
      newSelection.delete(featureId);
    } else {
      newSelection.add(featureId);
    }

    setSelectedFeatures(newSelection);

    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelection));
    }
  };

  const getSelectedFeatureLabels = () => {
    return features
      .filter((feature) => selectedFeatures.has(feature.id))
      .map((feature) => ({
        id: feature.id,
        label: feature.label,
        value: feature.value,
      }));
  };

  return (
    <FeatureContainer>
      <FeatureHeader>
        <FeatureTitle>{title}</FeatureTitle>
        <FeatureDescription>{description}</FeatureDescription>
      </FeatureHeader>

      <FeatureGrid>
        {features.map((feature, index) => {
          const isActive = selectedFeatures.has(feature.id);

          return (
            <FeatureCard
              key={feature.id}
              $isActive={isActive}
              onClick={() => handleFeatureToggle(feature.id)}
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: "both",
              }}
            >
              <CheckIcon $isActive={isActive}>
                <FiCheck size={14} />
              </CheckIcon>

              <FeatureIcon $isActive={isActive}>{feature.icon}</FeatureIcon>

              <FeatureLabel $isActive={isActive}>{feature.label}</FeatureLabel>

              <FeatureValue>
                <strong>{feature.value}</strong>
                <br />
                {feature.description}
              </FeatureValue>
            </FeatureCard>
          );
        })}
      </FeatureGrid>

      {selectedFeatures.size > 0 && (
        <SelectionSummary>
          <SummaryTitle>
            <FiCheck size={20} style={{ color: "#10b981" }} />
            Selected Features ({selectedFeatures.size})
          </SummaryTitle>

          <SummaryList>
            {getSelectedFeatureLabels().map((item) => (
              <SummaryItem key={item.id}>
                <FiCheck size={14} style={{ color: "#10b981" }} />
                {item.label}
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    fontWeight: "normal",
                  }}
                >
                  ({item.value})
                </span>
              </SummaryItem>
            ))}
          </SummaryList>
        </SelectionSummary>
      )}
    </FeatureContainer>
  );
};

export default FeatureSelection;
