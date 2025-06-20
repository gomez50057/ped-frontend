import HeroSection from "@/components/landing/Hero";
import AboutSection from "@/components/landing/About";
import PublicKnowledgeSection from "@/components/landing/PublicKnowledgeSection";
import CarouselSlider from "@/components/landing/CarouselSlider";


export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <CarouselSlider />
      <PublicKnowledgeSection />
    </main>
  );
}