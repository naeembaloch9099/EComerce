import React from "react";
import styled from "styled-components";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const TopbarContainer = styled.div`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 10px rgba(220, 38, 38, 0.2);
`;

const TopbarContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const SocialSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;

  @media (min-width: 640px) {
    margin-bottom: 0;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialLink = styled.a`
  color: white;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 50%;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
    transform: scale(1.2) rotate(5deg);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ShippingMessage = styled.div`
  text-align: center;
  flex: 1;
  margin-bottom: 0.5rem;
  font-weight: 600;

  @media (min-width: 640px) {
    margin-bottom: 0;
  }
`;

const ContactSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PhoneLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;

  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
`;

const PhoneIcon = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: inline;
    margin-right: 0.5rem;
  }
`;

const Topbar = () => {
  return (
    <TopbarContainer>
      <TopbarContent>
        {/* Left Section - Social Icons */}
        <SocialSection>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              <FaFacebookF size={14} />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <FaInstagram size={14} />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <FaTwitter size={14} />
            </SocialLink>
          </SocialLinks>
        </SocialSection>

        {/* Center Section - Free Shipping */}
        <ShippingMessage>🚚 Free shipping on orders over $50!</ShippingMessage>

        {/* Right Section - Phone */}
        <ContactSection>
          <PhoneLink href="tel:+1234567890">
            <PhoneIcon>📞</PhoneIcon>
            +1 (234) 567-890
          </PhoneLink>
        </ContactSection>
      </TopbarContent>
    </TopbarContainer>
  );
};

export default Topbar;
