import HeroSection from "@/components/landing/Hero";
import AboutSection from "@/components/landing/About";
import TimelineSection from "@/components/landing/TimelineExperience";
import PublicKnowledgeSection from "@/components/landing/PublicKnowledgeSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <TimelineSection />
      <PublicKnowledgeSection />
    </main>
  );
}