import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCommentDots,
  FaMapMarkerAlt,
  FaClock,
  FaHeadset,
  FaPaperPlane,
  FaHeart,
  FaRocket,
  FaStar,
  FaGem,
  FaCheckCircle,
  FaQuoteLeft,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Styled Components
const ContactContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.1;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const HeaderIcon = styled(motion.div)`
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: 26px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    z-index: -1;
    opacity: 0.8;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FormCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  height: fit-content;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const FormSubtitle = styled.p`
  color: #6b7280;
  font-size: 1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled(motion.div)`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: #667eea;
  font-size: 1.1rem;
  z-index: 2;
`;

const TextAreaIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: #667eea;
  font-size: 1.1rem;
  z-index: 2;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  min-height: 150px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: fit-content;
`;

const InfoCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
`;

const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InfoCardIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${(props) => props.$gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
`;

const InfoCardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ContactInfoGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ContactInfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(4px);
  }
`;

const ContactIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: ${(props) => props.$gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-weight: 700;
  color: #1f2937;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ContactValue = styled.div`
  color: #6b7280;
  font-size: 0.85rem;
  line-height: 1.4;
`;

const FeaturesList = styled.div`
  display: grid;
  gap: 1rem;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(16, 185, 129, 0.1);
    transform: translateX(4px);
  }
`;

const FeatureIcon = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
  flex-shrink: 0;
`;

const FeatureText = styled.span`
  font-weight: 600;
  color: #1f2937;
  font-size: 0.9rem;
`;

const LoadingSpinner = styled(motion.div)`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if response is ok first
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        toast.success(
          "Thank you! Your message has been sent successfully. We'll get back to you soon! 🚀"
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(
          data.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      <BackgroundPattern />

      <ContentWrapper>
        {/* Header Section */}
        <Header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeaderIcon
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <FaHeadset size={40} color="white" />
          </HeaderIcon>

          <Title
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Get In Touch ✨
          </Title>

          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Ready to start something amazing? We'd love to hear from you! Drop
            us a message and let's create magic together.
          </Subtitle>
        </Header>

        <MainGrid>
          {/* Contact Form */}
          <FormCard
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ y: -5 }}
          >
            <FormHeader>
              <FormTitle>Send Message</FormTitle>
              <FormSubtitle>
                Fill out the form below and we'll get back to you as soon as
                possible.
              </FormSubtitle>
            </FormHeader>

            <form onSubmit={handleSubmit}>
              <FormGrid>
                <InputGroup
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                  />
                </InputGroup>

                <InputGroup
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <InputIcon>
                    <FaEnvelope />
                  </InputIcon>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                  />
                </InputGroup>
              </FormGrid>

              <InputGroup
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                style={{ marginBottom: "1.5rem" }}
              >
                <InputIcon>
                  <FaPhone />
                </InputIcon>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Phone (Optional)"
                />
              </InputGroup>

              <InputGroup
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                style={{ marginBottom: "1.5rem" }}
              >
                <InputIcon>
                  <FaCommentDots />
                </InputIcon>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </InputGroup>

              <InputGroup
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                style={{ marginBottom: "2rem" }}
              >
                <TextAreaIcon>
                  <FaCommentDots />
                </TextAreaIcon>
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  required
                  rows={6}
                />
              </InputGroup>

              <SubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaRocket />
                    Send Message
                    <FaStar />
                  </>
                )}
              </SubmitButton>
            </form>
          </FormCard>

          {/* Contact Information */}
          <InfoSection>
            {/* Contact Info Card */}
            <InfoCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ y: -5 }}
            >
              <InfoCardHeader>
                <InfoCardIcon $gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                  <FaMapMarkerAlt />
                </InfoCardIcon>
                <InfoCardTitle>Contact Information</InfoCardTitle>
              </InfoCardHeader>

              <ContactInfoGrid>
                {[
                  {
                    icon: FaMapMarkerAlt,
                    label: "Address",
                    value: "123 Fashion Street, Style City, SC 12345",
                    gradient:
                      "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  },
                  {
                    icon: FaPhone,
                    label: "Phone",
                    value: "+1 (555) 123-4567",
                    gradient:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  },
                  {
                    icon: FaEnvelope,
                    label: "Email",
                    value: "hello@fashionstore.com",
                    gradient:
                      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  },
                  {
                    icon: FaClock,
                    label: "Business Hours",
                    value: "Mon - Fri: 9AM - 6PM",
                    gradient:
                      "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  },
                ].map((item, index) => (
                  <ContactInfoItem
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <ContactIcon $gradient={item.gradient}>
                      <item.icon />
                    </ContactIcon>
                    <ContactDetails>
                      <ContactLabel>{item.label}</ContactLabel>
                      <ContactValue>{item.value}</ContactValue>
                    </ContactDetails>
                  </ContactInfoItem>
                ))}
              </ContactInfoGrid>
            </InfoCard>

            {/* Why Choose Us Card */}
            <InfoCard
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              whileHover={{ y: -5 }}
            >
              <InfoCardHeader>
                <InfoCardIcon $gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)">
                  <FaHeart />
                </InfoCardIcon>
                <InfoCardTitle>Why Choose Us?</InfoCardTitle>
              </InfoCardHeader>

              <FeaturesList>
                {[
                  { icon: FaHeadset, text: "24/7 Customer Support" },
                  { icon: FaRocket, text: "Lightning Fast Response" },
                  { icon: FaGem, text: "Premium Quality Service" },
                  { icon: FaCheckCircle, text: "100% Satisfaction Guarantee" },
                  { icon: FaStar, text: "5-Star Customer Reviews" },
                ].map((feature, index) => (
                  <FeatureItem
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                  >
                    <FeatureIcon>
                      <feature.icon />
                    </FeatureIcon>
                    <FeatureText>{feature.text}</FeatureText>
                  </FeatureItem>
                ))}
              </FeaturesList>
            </InfoCard>
          </InfoSection>
        </MainGrid>
      </ContentWrapper>
    </ContactContainer>
  );
};

export default Contact;
