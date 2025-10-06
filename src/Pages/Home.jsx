import React from "react";
import styled from "styled-components";
import Hero from "../Components/Products/Hero";
import FeaturedCollection from "../Components/Products/FeaturedCollection";
import NewArrival from "../Components/Products/NewArrival";
import GenderCollectionSection from "../Components/Products/GenderCollectionSection";

const HomeContainer = styled.div`
  min-height: 100vh;
  background: white;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    #e5e7eb 50%,
    transparent 100%
  );
  margin: 4rem 0;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Hero />

      <SectionDivider />

      <FeaturedCollection />

      <SectionDivider />

      <NewArrival />

      <SectionDivider />

      <GenderCollectionSection />
    </HomeContainer>
  );
};

export default Home;
