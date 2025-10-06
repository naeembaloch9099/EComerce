import React from "react";
import styled, { keyframes } from "styled-components";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

/* Animations */
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
`;

/* Styled Components */
const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(59,130,246,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const FooterContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 4rem 1rem 3rem;
  position: relative;
  z-index: 1;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 3rem;
  }
`;

const FooterSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const CompanySection = styled(FooterSection)`
  &:hover {
    animation: ${glow} 2s ease-in-out infinite;
  }
`;

const FooterTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
`;

const CompanyTitle = styled.h3`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: ${float} 3s ease-in-out infinite;
`;

const FooterDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SocialContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    color: white;
    transform: scale(1.1);
  }
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  display: block;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    color: #60a5fa;
    transform: translateX(5px);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ContactIcon = styled.div`
  color: #60a5fa;
`;

const ContactText = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
`;

const NewsletterSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;
  padding-top: 2rem;
`;

const NewsletterGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const EmailInputContainer = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  overflow: hidden;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  color: white;
`;

const SubscribeButton = styled.button`
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  color: rgba(255, 255, 255, 0.6);
`;

const BottomLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const BottomLink = styled.a`
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;

  &:hover {
    color: #60a5fa;
  }
`;

/* Footer Component */
const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          {/* Company Info */}
          <CompanySection>
            <CompanyTitle>FASHION</CompanyTitle>
            <FooterDescription>
              Discover the latest trends and timeless classics. Your style, your
              statement.
            </FooterDescription>
            <SocialContainer>
              <SocialLink href="#">
                <FaFacebookF size={18} />
              </SocialLink>
              <SocialLink href="#">
                <FaInstagram size={18} />
              </SocialLink>
              <SocialLink href="#">
                <FaTwitter size={18} />
              </SocialLink>
              <SocialLink href="#">
                <FaYoutube size={18} />
              </SocialLink>
            </SocialContainer>
          </CompanySection>

          {/* Quick Links */}
          <FooterSection>
            <FooterTitle>Quick Links</FooterTitle>
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/collection">New Arrivals</FooterLink>
            <FooterLink href="/sale">Sale</FooterLink>
          </FooterSection>

          {/* Categories */}
          <FooterSection>
            <FooterTitle>Categories</FooterTitle>
            <FooterLink href="/men">Men's Fashion</FooterLink>
            <FooterLink href="/women">Women's Fashion</FooterLink>
            <FooterLink href="/accessories">Accessories</FooterLink>
          </FooterSection>

          {/* Contact Info */}
          <FooterSection>
            <FooterTitle>Contact Us</FooterTitle>
            <ContactItem>
              <ContactIcon>
                <FiMapPin size={16} />
              </ContactIcon>
              <ContactText>123 Fashion Street, NY 10001</ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <FiPhone size={16} />
              </ContactIcon>
              <ContactText>+1 (234) 567-890</ContactText>
            </ContactItem>
            <ContactItem>
              <ContactIcon>
                <FiMail size={16} />
              </ContactIcon>
              <ContactText>info@fashion.com</ContactText>
            </ContactItem>
          </FooterSection>
        </FooterGrid>

        {/* Newsletter */}
        <NewsletterSection>
          <NewsletterGrid>
            <div>
              <h4>Subscribe to our newsletter</h4>
              <p>Get the latest updates on new products and offers.</p>
            </div>
            <EmailInputContainer>
              <EmailInput type="email" placeholder="Enter your email" />
              <SubscribeButton>
                <FiSend size={16} style={{ marginRight: "5px" }} /> Subscribe
              </SubscribeButton>
            </EmailInputContainer>
          </NewsletterGrid>
        </NewsletterSection>

        {/* Bottom Bar */}
        <BottomBar>
          <Copyright>© 2024 Fashion Store. All rights reserved.</Copyright>
          <BottomLinks>
            <BottomLink href="/privacy">Privacy Policy</BottomLink>
            <BottomLink href="/terms">Terms of Service</BottomLink>
            <BottomLink href="/support">Support</BottomLink>
          </BottomLinks>
        </BottomBar>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
