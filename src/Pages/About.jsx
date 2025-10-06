import React from "react";
import styled from "styled-components";
import {
  FiAward,
  FiHeart,
  FiShield,
  FiTruck,
  FiUsers,
  FiStar,
} from "react-icons/fi";

const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
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
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(45deg, #ffffff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled.section`
  padding: 5rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StoryContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const StoryText = styled.div`
  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1.125rem;
    line-height: 1.8;
    color: #4b5563;
    margin-bottom: 1.5rem;
  }
`;

const StoryImage = styled.div`
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  transform: rotate(-2deg);
  transition: transform 0.3s ease;

  &:hover {
    transform: rotate(0deg) scale(1.02);
  }

  img {
    width: 100%;
    height: 500px;
    object-fit: cover;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ValueCard = styled.div`
  background: white;
  padding: 3rem 2rem;
  border-radius: 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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
    background: linear-gradient(90deg, #667eea, #764ba2);
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
`;

const ValueTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const ValueDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  padding: 5rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  text-align: center;
`;

const StatCard = styled.div`
  h3 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 1.125rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const TeamSection = styled.section`
  background: white;
  padding: 5rem 0;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TeamCard = styled.div`
  text-align: center;
  background: #f8fafc;
  padding: 2rem;
  border-radius: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const TeamImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const TeamName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const TeamRole = styled.p`
  color: #667eea;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TeamDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  font-size: 0.9rem;
`;

const About = () => {
  const values = [
    {
      icon: <FiHeart size={32} />,
      title: "Passion for Fashion",
      description:
        "We live and breathe fashion, bringing you the latest trends and timeless classics with love and dedication.",
    },
    {
      icon: <FiAward size={32} />,
      title: "Premium Quality",
      description:
        "Every piece in our collection is carefully selected for its superior quality, craftsmanship, and attention to detail.",
    },
    {
      icon: <FiShield size={32} />,
      title: "Trust & Security",
      description:
        "Your trust is our foundation. We ensure secure transactions and protect your personal information at all times.",
    },
    {
      icon: <FiTruck size={32} />,
      title: "Fast Delivery",
      description:
        "Get your fashion fix faster with our reliable shipping network and express delivery options worldwide.",
    },
    {
      icon: <FiUsers size={32} />,
      title: "Customer First",
      description:
        "Our customers are at the heart of everything we do. Your satisfaction drives our continuous improvement.",
    },
    {
      icon: <FiStar size={32} />,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect - from product curation to customer service and beyond.",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "10K+", label: "Products Sold" },
    { number: "25+", label: "Countries Served" },
    { number: "99%", label: "Customer Satisfaction" },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      initial: "SJ",
      description:
        "Visionary leader with 15+ years in fashion retail, passionate about bringing style to everyone.",
    },
    {
      name: "Michael Chen",
      role: "Creative Director",
      initial: "MC",
      description:
        "Award-winning designer with an eye for emerging trends and timeless elegance.",
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      initial: "ER",
      description:
        "Operations expert ensuring smooth delivery and exceptional customer experience.",
    },
    {
      name: "David Kim",
      role: "Technology Lead",
      initial: "DK",
      description:
        "Tech innovator building the future of online fashion shopping experiences.",
    },
  ];

  return (
    <AboutContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>About Rabbit Fashion</HeroTitle>
          <HeroSubtitle>
            Crafting exceptional fashion experiences since 2020, we're
            passionate about bringing you the finest clothing and accessories
            from around the world.
          </HeroSubtitle>
        </HeroContent>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>Our Story</SectionTitle>
          <StoryContent>
            <StoryText>
              <h3>Where Fashion Meets Passion</h3>
              <p>
                Founded in 2020, Rabbit Fashion emerged from a simple belief:
                everyone deserves access to high-quality, stylish clothing that
                makes them feel confident and beautiful.
              </p>
              <p>
                What started as a small online boutique has grown into a global
                fashion destination, serving customers in over 25 countries.
                We've carefully curated our collection to include both emerging
                designers and established brands, ensuring there's something
                special for every style and occasion.
              </p>
              <p>
                Our commitment to sustainability, ethical sourcing, and
                exceptional customer service has made us a trusted name in
                online fashion retail.
              </p>
            </StoryText>
            <StoryImage>
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Fashion store interior"
              />
            </StoryImage>
          </StoryContent>
        </Container>
      </Section>

      <Section style={{ background: "white" }}>
        <Container>
          <SectionTitle>Our Values</SectionTitle>
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard key={index}>
                <ValueIcon>{value.icon}</ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </Container>
      </Section>

      <StatsSection>
        <Container>
          <SectionTitle style={{ color: "white" }}>Our Impact</SectionTitle>
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index}>
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </StatCard>
            ))}
          </StatsGrid>
        </Container>
      </StatsSection>

      <TeamSection>
        <Container>
          <SectionTitle>Meet Our Team</SectionTitle>
          <TeamGrid>
            {team.map((member, index) => (
              <TeamCard key={index}>
                <TeamImage>{member.initial}</TeamImage>
                <TeamName>{member.name}</TeamName>
                <TeamRole>{member.role}</TeamRole>
                <TeamDescription>{member.description}</TeamDescription>
              </TeamCard>
            ))}
          </TeamGrid>
        </Container>
      </TeamSection>
    </AboutContainer>
  );
};

export default About;
