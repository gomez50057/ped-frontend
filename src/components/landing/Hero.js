"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import AnimatePath from "./AnimatePath";
import PedPdfViewerModal from "@/components/landing/modal/PedPdfViewerModal";
import styles from "@/styles/Hero.module.css";

const imgBasePath = "/img/";

gsap.registerPlugin(ScrollTrigger);

const numberFormatter = new Intl.NumberFormat("es-MX");

const statsData = [
  {
    icon: <LightbulbOutlinedIcon fontSize="inherit" />,
    endValue: 26367,
    label: "propuestas recibidas",
  },
  {
    icon: <Groups2OutlinedIcon fontSize="inherit" />,
    endValue: 8,
    label: "mecanismos de participación ciudadana",
  },
  {
    icon: <ForumOutlinedIcon fontSize="inherit" />,
    endValue: 18,
    label: "foros ciudadanos",
  },
];

export default function Hero() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const rootRef = useRef(null);
  const txtRef = useRef(null);
  const imgRef = useRef(null);
  const statsRef = useRef(null);
  const statValueRefs = useRef([]);
  const circlePathId = "hero-consult-circle-path";

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const animateCounters = () => {
        statValueRefs.current.forEach((node, index) => {
          if (!node) return;

          const counter = { value: 0 };

          gsap.to(counter, {
            value: statsData[index].endValue,
            duration: 2,
            ease: "power3.out",
            onUpdate: () => {
              node.textContent = numberFormatter.format(
                Math.round(counter.value)
              );
            },
          });
        });
      };

      if (txtRef.current) {
        const headerSection = rootRef.current;
        const nextSection = headerSection?.nextElementSibling;

        const headerTxtEl = txtRef.current;
        const headerTxtRect = headerTxtEl.getBoundingClientRect();
        const headerTxtCenter =
          window.scrollY + headerTxtRect.top + headerTxtRect.height / 2;

        let distance = 0;
        let innerContainer = null;

        if (nextSection) {
          const nextSectionRect = nextSection.getBoundingClientRect();
          innerContainer = nextSection.querySelector('[class*="logoAcuerdo"]');

          let targetCenter = 0;

          if (innerContainer) {
            const innerRect = innerContainer.getBoundingClientRect();
            targetCenter =
              window.scrollY + innerRect.top + innerRect.height / 2;
          } else {
            targetCenter =
              window.scrollY + nextSectionRect.top + nextSectionRect.height / 2;
          }

          distance = targetCenter - headerTxtCenter;
        }

        gsap.set(txtRef.current, {
          y: 0,
          opacity: 1,
          filter: "none",
        });

        gsap.to(txtRef.current, {
          x: "-13vw",
          y: distance,
          scale: 0.6,
          opacity: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: headerSection,
            start: "top top",
            endTrigger: innerContainer || nextSection,
            end: "center center",
            scrub: true,
            markers: false,
          },
        });
      }

      if (imgRef.current) {
        gsap.set(imgRef.current, { opacity: 0 });

        gsap.to(imgRef.current, {
          delay: 0.1,
          opacity: 1,
          duration: 1,
          ease: "power1.out",
        });
      }

      mm.add("(min-width: 901px)", () => {
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
          onEnter: animateCounters,
        });
      });

      mm.add("(max-width: 900px)", () => {
        ScrollTrigger.create({
          trigger: statsRef.current || rootRef.current,
          start: "top 85%",
          once: true,
          onEnter: animateCounters,
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section id="header" ref={rootRef}>
      <div className={styles.contentHeader}>
        <div className={`${styles.contentTren} ${styles.fadeInTarget}`}>
          <AnimatePath />
        </div>

        <div
          className={`${styles.headerTxt} ${styles.fadeInTarget}`}
          ref={txtRef}
        >
          <img src={`${imgBasePath}headertxt.png`} alt="img_representativa" />
        </div>

        <div
          className={`${styles.headerImg} ${styles.fadeInTarget}`}
          ref={imgRef}
        >
          <img
            src={`${imgBasePath}headerimg.svg`}
            alt="img_representativa"
            className={styles.floatingImg}
          />
        </div>

        <div className={styles.statsFloating} ref={statsRef}>
          {statsData.map((item, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon} aria-hidden="true">
                {item.icon}
              </div>

              <div className={styles.statInfo}>
                <strong
                  ref={(el) => {
                    statValueRefs.current[index] = el;
                  }}
                >
                  0
                </strong>
                <span>{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/ped/"
          className={styles.consultCircleLink}
          aria-haspopup="dialog"
          onClick={(event) => {
            event.preventDefault();
            setIsViewerOpen(true);
          }}
        >
          <div className={styles.consultCircle}>
            <svg
              viewBox="0 0 200 200"
              className={styles.circleTextSvg}
              aria-hidden="true"
            >
              <defs>
                <path
                  id={circlePathId}
                  d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                />
              </defs>
              <text className={styles.circleText}>
                <textPath href={`#${circlePathId}`} startOffset="0%">
                  Consulta la Actualización • Consulta la Actualización •
                </textPath>
              </text>
            </svg>

            <div className={styles.consultCircleInner}>
              <img
                src={`${imgBasePath}headerimg.svg`}
                alt="Consulta la Actualización"
              />
            </div>
          </div>
        </a>
      </div>

      <PedPdfViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </section>
  );
}
