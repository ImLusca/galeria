import React from "react";
import { Helmet } from "react-helmet-async";
import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/HeroSection";
import PolaroidGallery from "@/components/PolaroidGallery";
import Footer from "@/components/Footer";
import VinylPlayer from "@/components/vinyl";

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Nossa galeria particular</title>
        <meta
          name="description"
          content="Celebrando dois meses amor, memórias e momentos inesquecíveis. Uma jornada escrita nas estrelas."
        />
      </Helmet>

      <main className="relative overflow-hidden">
        <ParticleBackground />

        <div className="content-layer">
          <HeroSection />
          <PolaroidGallery />
          <Footer />
        </div>
        <VinylPlayer audioSrc="/coracao.webm" coverImg="/cover.jpeg" />
      </main>
    </>
  );
};

export default Index;
