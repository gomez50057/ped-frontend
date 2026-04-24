import HeroSection from "@/components/landing/Hero";
import AboutSection from "@/components/landing/About";
import TimelineSection from "@/components/landing/TimelineExperience";
// import ParticipationMechanisms from "@/components/landing/ParticipationMechanisms";
import PodcastSlider from "@/components/landing/PodcastSlider";
import CarouselSlider from "@/components/landing/CarouselSlider";
import BibliotecaDigital from "@/components/landing/BibliotecaDigital";
import PedPdfHeroSection from "@/components/landing/DownloadViewPED";

// import PublicKnowledgeSection from "@/components/landing/PublicKnowledgeSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <TimelineSection />
      <PedPdfHeroSection />
      {/* <ParticipationMechanisms /> */}
      <div style={{ paddingInline: "clamp(1rem, 4vw, 2.5rem)" }}>
        <CarouselSlider />
      </div>
      <div style={{ paddingInline: "clamp(1rem, 4vw, 2.5rem)" }}>
        <PodcastSlider
          imageSrc="/img/Podcast/la-voz-de-hidalgo-portada.png"
          overlaySrc="/img/Podcast/mic.png"
          videos={[
            "https://www.youtube.com/watch?v=qi-FdqmiR8I&t",
            "https://www.youtube.com/watch?v=_l3sRO1uMqU",
            "https://youtu.be/e-qnFtpk8ts?si=dK325LjxkIHmphmj",
            "https://www.youtube.com/watch?v=HDdBLUVHDDQ",
            "https://youtu.be/yPSDhApY5sU?si=-J9WfVbRc5CZkrFJ",
            "https://www.youtube.com/watch?v=ewvWBVDHjoc",
          ]}
          title="La Voz de Hidalgo • Podcast"
        />
      </div>
      <div style={{ paddingInline: "clamp(1rem, 4vw, 2.5rem)" }}>
        <BibliotecaDigital />
      </div>


      {/* <PublicKnowledgeSection /> */}
    </main>
  );
}
