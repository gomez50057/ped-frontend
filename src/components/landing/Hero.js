"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import AnimatePath from "./AnimatePath";
import styles from "@/styles/Hero.module.css";
const imgBasePath = "/img/";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const txtRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (txtRef.current) {
      const headerSection = document.getElementById("header");
      const nextSection = headerSection?.nextElementSibling;

      const headerTxtEl = txtRef.current;
      const headerTxtRect = headerTxtEl.getBoundingClientRect();
      const headerTxtCenter = window.scrollY + headerTxtRect.top + headerTxtRect.height / 2;

      let distance = 0;
      let innerContainer = null;

      if (nextSection) {
        const nextSectionRect = nextSection.getBoundingClientRect();
        innerContainer = nextSection.querySelector('[class*="logoAcuerdo"]');
        let targetCenter = 0;

        if (innerContainer) {
          const innerRect = innerContainer.getBoundingClientRect();
          targetCenter = window.scrollY + innerRect.top + innerRect.height / 2;
        } else {
          targetCenter = window.scrollY + nextSectionRect.top + nextSectionRect.height / 2;
        }

        distance = targetCenter - headerTxtCenter;
      }

      gsap.set(txtRef.current, { y: 0, opacity: 1, filter: 'none' });

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
        }
      });
    }

    if (imgRef.current) {
      gsap.set(imgRef.current, { opacity: 0 });
      gsap.to(imgRef.current, {
        delay: 0.1,
        opacity: 1,
        duration: 1,
        ease: "power1.out"
      });
    }
  }, []);

  return (
    <section id="header">
      <div className={styles.contentHeader}>
        <div className={`${styles.contentTren} ${styles.fadeInTarget}`} >
            <AnimatePath />
        </div>
        <div className={`${styles.headerTxt} ${styles.fadeInTarget}`} ref={txtRef} >
          <img src={`${imgBasePath}headertxt.png`} alt="img_representativa" />
        </div>
        <div className={`${styles.headerImg} ${styles.fadeInTarget}`} ref={imgRef}>
          <img src={`${imgBasePath}headerimg.svg`} alt="img_representativa" className={styles.floatingImg} />
        </div>        
      </div>
    </section>
  );
}
