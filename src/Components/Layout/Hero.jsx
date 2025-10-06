import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiShoppingBag, FiArrowRight, FiPlay, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
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

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const HeroContainer = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="%23ffffff" opacity="0.1"><polygon points="1000,100 1000,0 0,100"/></svg>');
    background-size: cover;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 30% 20%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 70% 80%,
        rgba(255, 255, 255, 0.08) 0%,
        transparent 50%
      );
    z-index: 1;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
  width: 100%;
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
`;

const TextContent = styled.div`
  animation: ${slideIn} 1s ease-out;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  animation: ${float} 3s ease-in-out infinite;

  svg {
    color: #fbbf24;
  }
`;

const MainHeading = styled.h1`
  font-size: 4.5rem;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 1.5rem;

  background: linear-gradient(
    135deg,
    #ffffff 0%,
    #f0f9ff 25%,
    #e0f2fe 50%,
    #ffffff 75%,
    #f0f9ff 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 3s linear infinite;

  @media (max-width: 968px) {
    font-size: 3rem;
  }

  @media (max-width: 568px) {
    font-size: 2.5rem;
  }

  .highlight {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SubHeading = styled.p`
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 500px;

  @media (max-width: 968px) {
    margin: 0 auto 3rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 568px) {
    flex-direction: column;
    width: 100%;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1f2937;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(251, 191, 36, 0.4);
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  }

  @media (max-width: 568px) {
    width: 100%;
    justify-content: center;
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: 568px) {
    width: 100%;
    justify-content: center;
  }
`;

const ImageContent = styled.div`
  position: relative;
  animation: ${slideIn} 1s ease-out 0.3s both;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  height: 600px;

  @media (max-width: 968px) {
    height: 400px;
  }
`;

const ImageCard = styled.div`
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  animation: ${float} 4s ease-in-out infinite;
  animation-delay: ${(props) => props.$delay || "0s"};

  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  }

  &:first-child {
    grid-row: 1 / 3;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 1rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  ${ImageCard}:hover & {
    transform: translateY(0);
  }

  h4 {
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const StatsBar = styled.div`
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 3rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem 3rem;
  border-radius: 2rem;
  z-index: 3;
  animation: ${slideIn} 1s ease-out 0.6s both;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem 2rem;
    bottom: 2rem;
  }

  @media (max-width: 568px) {
    display: none;
  }
`;

const StatItem = styled.div`
  text-align: center;
  color: white;

  .number {
    font-size: 2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
  }

  .label {
    font-size: 0.875rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;

  .floating-shape {
    position: absolute;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    animation: ${float} 6s ease-in-out infinite;
  }

  .shape-1 {
    width: 100px;
    height: 100px;
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  .shape-2 {
    width: 60px;
    height: 60px;
    top: 60%;
    right: 15%;
    animation-delay: 2s;
  }

  .shape-3 {
    width: 80px;
    height: 80px;
    bottom: 30%;
    left: 20%;
    animation-delay: 4s;
  }
`;

const Hero = () => {
  const [currentImageSet, setCurrentImageSet] = useState(0);

  const imageSets = [
    [
      {
        src: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "Summer Collection",
        description: "Light & Breezy",
      },
      {
        src: "https://images.unsplash.com/photo-1506629905607-d90e2edc14d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "Casual Wear",
        description: "Everyday Comfort",
      },
      {
        src: "https://images.unsplash.com/photo-1582142306909-195724d33ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "Formal Attire",
        description: "Professional Look",
      },
    ],
    [
      {
        src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "Winter Collection",
        description: "Warm & Stylish",
      },
      {
        src: "https://images.unsplash.com/photo-1583743089695-4b816a340f82?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "Accessories",
        description: "Perfect Finishing",
      },
      {
        src: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        title: "Premium Line",
        description: "Luxury Fashion",
      },
    ],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageSet((prev) => (prev + 1) % imageSets.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [imageSets.length]);

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Premium Products" },
    { number: "25+", label: "Countries Served" },
    { number: "99%", label: "Satisfaction Rate" },
  ];

  return (
    <HeroContainer>
      <FloatingElements>
        <div className="floating-shape shape-1" />
        <div className="floating-shape shape-2" />
        <div className="floating-shape shape-3" />
      </FloatingElements>

      <ContentWrapper>
        <HeroContent>
          <TextContent>
            <Badge>
              <FiStar size={16} />
              Rated #1 Fashion Destination
            </Badge>

            <MainHeading>
              Discover Your <span className="highlight">Perfect</span> Style
            </MainHeading>

            <SubHeading>
              Explore our curated collection of premium fashion pieces designed
              for the modern lifestyle. From casual comfort to elegant
              sophistication.
            </SubHeading>

            <ButtonGroup>
              <PrimaryButton to="/collection">
                <FiShoppingBag size={20} />
                Shop Collection
                <FiArrowRight size={16} />
              </PrimaryButton>

              <SecondaryButton>
                <FiPlay size={16} />
                Watch Story
              </SecondaryButton>
            </ButtonGroup>
          </TextContent>

          <ImageContent>
            <ImageGrid>
              {imageSets[currentImageSet].map((image, index) => (
                <ImageCard
                  key={`${currentImageSet}-${index}`}
                  $delay={`${index * 0.2}s`}
                >
                  <img src={image.src} alt={image.title} />
                  <ImageOverlay>
                    <h4>{image.title}</h4>
                    <p>{image.description}</p>
                  </ImageOverlay>
                </ImageCard>
              ))}
            </ImageGrid>
          </ImageContent>
        </HeroContent>
      </ContentWrapper>

      <StatsBar>
        {stats.map((stat, index) => (
          <StatItem key={index}>
            <span className="number">{stat.number}</span>
            <span className="label">{stat.label}</span>
          </StatItem>
        ))}
      </StatsBar>
    </HeroContainer>
  );
};

export default Hero;
