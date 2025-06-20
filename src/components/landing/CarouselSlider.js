"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import styles from "@/styles/CarouselSlider.module.css";

const slides = [
  {
    title: "Plan Nacional de Desarrollo",
    description:
      "Consulta el documento rector de la política pública a nivel federal, que orienta las prioridades del desarrollo nacional y funge como marco de referencia para la planeación estatal y municipal.",
    image: "/img/slider/PND.jpg",
    href: "/pdf/Plan Nacional de Desarrollo 2025 - 2030.pdf"
  },
  {
    title: "Plan Estatal de Desarrollo del Estado de Hidalgo (vigente)",
    description:
      "Revisa el Plan Estatal de Desarrollo actualmente en vigor, que contiene la visión, estrategias y acciones que han guiado la administración pública del estado.",
    image: "/img/slider/PED.jpg",
    href: "/pdf/Plan Estatal de Desarrollo 2022-2028.pdf"
  },
  {
    title: "Lineamientos para la actualización del Plan Estatal de Desarrollo",
    description:
      "Conoce el documento que establece el enfoque, principios y etapas metodológicas que guían el proceso de actualización del PED 2025–2028, garantizando transparencia, participación e inclusión.",
    image: "/img/slider/lineamientos_PED.jpg",
    href: "/pdf/Lineamientos del PED.pdf"
  },
];

const CarouselSlider = () => {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className={styles.mySwiper}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className={styles.swiperSlide}>
            <div className={styles.slideContent}>
              <img
                src={slide.image}
                alt={slide.title}
                className={styles.slideImage}
              />
              <div className={styles.overlay}></div>
              <div className={styles.carouselContainerText}>
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
                <div className={styles.buttonWrapper}>
                  <Link href={slide.href} target="_blank" rel="noopener noreferrer" className={styles.slideButton}>
                    Saber más
                  </Link>
                </div>
              </div>
            </div>
          
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselSlider;
