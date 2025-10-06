import React from "react";
import styled, { keyframes } from "styled-components";
import { FiArrowRight, FiUsers, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router-dom";

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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const GenderSectionContainer = styled.section`
  padding: 6rem 0;
  background: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 25% 25%,
        rgba(59, 130, 246, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 75% 75%,
        rgba(236, 72, 153, 0.05) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const Badge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const SectionTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937 0%, #ec4899 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const CollectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CollectionCard = styled(Link)`
  position: relative;
  display: block;
  border-radius: 2rem;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.4s ease;
  animation: ${scaleIn} 0.8s ease-out;
  animation-delay: ${(props) => props.$delay || "0s"};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
  }

  &:hover .image {
    transform: scale(1.1);
  }

  &:hover .overlay {
    background: ${(props) =>
      props.$gender === "men"
        ? "linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.9) 100%)"
        : "linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(190, 24, 93, 0.9) 100%)"};
  }

  &:hover .content {
    transform: translateY(-10px);
  }

  &:hover .button {
    transform: translateX(10px);
    background: white;
    color: ${(props) => (props.$gender === "men" ? "#3b82f6" : "#ec4899")};
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 500px;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 400px;
  }
`;

const CollectionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${(props) =>
    props.$gender === "men"
      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.7) 100%)"
      : "linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(190, 24, 93, 0.7) 100%)"};
  transition: all 0.4s ease;
`;

const ContentOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem;
  color: white;
  transition: all 0.4s ease;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const CollectionBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const CollectionTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CollectionDescription = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CollectionButton = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 3rem;
  border-radius: 2rem;
  animation: ${fadeInUp} 1s ease-out 0.5s both;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) =>
    props.$color || "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
`;

const StatNumber = styled.h4`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
`;

const GenderCollectionSection = () => {
  const collections = [
    {
      gender: "men",
      title: "Men's Collection",
      description:
        "Discover sophisticated styles for the modern gentleman. From sharp suits to casual weekend wear.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/collection?category=men",
      badge: "500+ Styles",
    },
    {
      gender: "women",
      title: "Women's Collection",
      description:
        "Elegant and empowering fashion for every occasion. Express your unique style with confidence.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616c2dee8d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      link: "/collection?category=women",
      badge: "750+ Styles",
    },
  ];

  const stats = [
    {
      icon: <FiUsers size={24} />,
      number: "50K+",
      label: "Satisfied Customers",
      color: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    },
    {
      icon: <FiShoppingBag size={24} />,
      number: "1.2K+",
      label: "Products Available",
      color: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    },
    {
      icon: <FiArrowRight size={24} />,
      number: "99%",
      label: "Customer Satisfaction",
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    },
    {
      icon: <FiUsers size={24} />,
      number: "25+",
      label: "Countries Served",
      color: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    },
  ];

  return (
    <GenderSectionContainer>
      <Container>
        <SectionHeader>
          <Badge>Shop by Category</Badge>
          <SectionTitle>Curated Collections</SectionTitle>
          <SectionDescription>
            Explore our carefully curated collections designed specifically for
            men and women. Each piece tells a story of craftsmanship and style.
          </SectionDescription>
        </SectionHeader>

        <CollectionGrid>
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.gender}
              to={collection.link}
              $gender={collection.gender}
              $delay={`${index * 0.2}s`}
            >
              <ImageContainer>
                <CollectionImage
                  className="image"
                  src={collection.image}
                  alt={collection.title}
                />
                <ImageOverlay className="overlay" $gender={collection.gender} />

                <ContentOverlay className="content">
                  <CollectionBadge>
                    <FiUsers size={16} />
                    {collection.badge}
                  </CollectionBadge>

                  <CollectionTitle>{collection.title}</CollectionTitle>
                  <CollectionDescription>
                    {collection.description}
                  </CollectionDescription>

                  <CollectionButton className="button">
                    Explore Collection
                    <FiArrowRight size={20} />
                  </CollectionButton>
                </ContentOverlay>
              </ImageContainer>
            </CollectionCard>
          ))}
        </CollectionGrid>

        <StatsSection>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon $color={stat.color}>{stat.icon}</StatIcon>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsSection>
      </Container>
    </GenderSectionContainer>
  );
};

export default GenderCollectionSection;
