import HeroSection from "@/components/landing/Hero";
import AboutSection from "@/components/landing/About";
import PublicKnowledgeSection from "@/components/landing/PublicKnowledgeSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <PublicKnowledgeSection />
    </main>
  );
}