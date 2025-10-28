"use client";

import React from "react";
import CarouselSlider from "@/components/landing/CarouselSlider";
import styles from "@/styles/PublicKnowledgeSection.module.css";
import Link from "next/link";
const imgConsultaDigital = "/img/page_links/consulta_digital/";
const imgBibliotecaDigital = "/img/page_links/biblioteca_digital/";
const imgBconvocatoriaIA = "/img/page_links/convocatoria_IA/";
import PodcastSlider from "@/components/landing/PodcastSlider";
import ForosRegionalesSlider from "@/components/landing/ForosRegionalesSlider";

const imgBasePath = "/img/page_links/";
const videoBasePath = "/video/";

const info = [
  {
    title: "Consulta Digital",
    subtitle:
      "Participa en la consulta digital y forma parte de la transformación de Hidalgo, es muy fácil, sólo tienes que llenar un sencillo formulario. Tu voz es importante para construir propuestas y proyectos que permitan mejorar la calidad de vida de los hidalguenses.",
    href: "/consulta-digital",
  },
  {
    title: "Espacios de Encuentro y Diálogo en Hidalgo",
    subtitle:
      "Te invitamos a estar pendiente de los foros que se estarán llevando a cabo próximamente en las regiones de Hidalgo. Tu participación es fundamental para fortalecer el diálogo y construir juntos un futuro con inclusión y respeto a la diversidad. ¡Súmate a este espacio de encuentro y diálogo abierto para todas y todos!",
    href: "",
  },
  {
    title: "Convocatoria al Reto IA: Visión Prospectiva",
    subtitle:
      "Únete al Reto IA: Visión Prospectiva. Imagina el futuro de Hidalgo utilizando de manera creativa herramientas de inteligencia artificial. ¡Construyamos juntos las visiones que transformarán nuestro Estado!",
    href: "/pdf/Reto_IA.pdf",
  },
  {
    title: "Consulta a pueblos y comunidades indígenas",
    subtitle:
      "Conocer las fechas, formas de participación y toda la información relevante sobre la Consulta Pública a Pueblos y Comunidades Indígenas.",
    href: "https://cedspi.hidalgo.gob.mx/Consulta",
  },
  {
    title: "Biblioteca Digital de Planeación",
    subtitle:
      "Accede a nuestra biblioteca digital, una plataforma en donde podrás consultar y descargar distintos instrumentos de planeación de una manera sencilla y dinámica.",
    href: "https://bibliotecadigitaluplaph.hidalgo.gob.mx/",
  },
  {
    title: "Foros Regionales",
    subtitle: "",
    href: "",
  },
];

const forosItems = [
  { id: "Reg01Tula", name: "Region 01: Tula", img: "Reg01Tula.png" },
  { id: "Reg06Tizayuca", name: "Region 06: Tizayuca", img: "Reg06Tizayuca.png" },
  { id: "Reg07Actopan", name: "Region 07: Actopan", img: "Reg07Actopan.png" },
  { id: "Reg11Huichapan", name: "Region 11: Huichapan", img: "Reg11Huichapan.png" },
  { id: "Reg10Apan", name: "Region 10: Apan", img: "Reg10Apan.png" },
  { id: "Reg02Tulancingo", name: "Region 02: Tulancingo", img: "Reg02Tulancingo.png" },
  { id: "Reg12Jacala", name: "Region 12 Jacala", img: "Reg12Jacala.png" },
  { id: "Reg09Zacualtipan", name: "Region 09: Zacualtipan", img: "Reg09Zacualtipan.png" },
  { id: "Reg04Huejutla", name: "Region 04: Huejutla", img: "Reg04Huejutla.png" },
  { id: "Reg08Ixmiquilpan", name: "Region 08: Ixmiquilpan", img: "Reg08Ixmiquilpan.png" },
  { id: "Reg03Pachuca", name: "Region 03: Pachuca", img: "Reg03Pachuca.png" },
  { id: "Reg05MR", name: "Region 05: Mineral de la Reforma", img: "Reg05MR.png" },
];

export default function PublicKnowledgeSection() {
  const renderOrder = [0, 5, 1, 2, 3, 4];

  return (
    <section className={styles.sectionStack}>
      {renderOrder.map((originalIdx) => {
        const item = info[originalIdx];

        if (originalIdx === 0) {
          return (
            <React.Fragment key={originalIdx}>
              <div className={`${styles.sectionItem} ${styles.designA}`}>
                <div className={styles.containerDesignA}>
                  <div className={styles.bgImgDesignA}>
                    <img src={`${imgBasePath}bg.png`} alt={item.title} />
                  </div>
                  <div className={styles.imgRepresentationDesignA}>
                    <img src={`${imgConsultaDigital}persona.png`} alt={item.title} />
                  </div>
                  <div className={styles.imgeWrapperDesignA}>
                    <Link href={item.href}>
                      <div className={styles.imgBotonDesignA}>
                        <img src={`${imgConsultaDigital}boton.png`} alt={item.title} />
                      </div>
                    </Link>
                    <div className={styles.overlayTextDesignA}>
                      <p>{item.subtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
              <CarouselSlider />
            </React.Fragment>
          );
        }

        if (originalIdx === 1) {
          return (
            <React.Fragment key={originalIdx}>
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

              <div className={`${styles.sectionItem} ${styles.designB}`} style={{ position: "relative" }}>
                <video autoPlay loop muted playsInline className={styles.backgroundVideo}>
                  <source src={`${videoBasePath}foros_general.mp4`} type="video/mp4" />
                  Tu navegador no soporta la reproducción de video.
                </video>
                <div className={styles.overlayTextDesignB}>
                  <div className={styles.gradientOverlay}></div>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            </React.Fragment>
          );
        }

        if (originalIdx === 2) {
          return (
            <div key={originalIdx} className={`${styles.sectionItem} ${styles.designC}`}>
              <div className={styles.containerDesignC}>
                <div className={styles.bgImgDesignC}>
                  <img src={`${imgBasePath}bg.png`} alt={item.title} />
                </div>
                <div className={styles.imgRepresentationDesignC}>
                  <img src={`${imgBconvocatoriaIA}mano.png`} alt={item.title} />
                </div>
                <div className={styles.imgeWrapperDesignC}>
                  <Link href={item.href} target="_blank" rel="noopener noreferrer">
                    <div className={styles.imgBotonDesignC}>
                      <img src={`${imgBconvocatoriaIA}boton.png`} alt={item.title} />
                    </div>
                  </Link>
                  <div className={styles.overlayTextDesignC}>
                    <p>
                      {item.subtitle}{" "}
                      <Link
                        href="/pdf/formato_de_participacion.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.goldenLink}
                      >
                        <span>Descarga el formato de participación</span>
                      </Link>
                    </p>
                    <Link href={item.href} target="_blank" rel="noopener noreferrer" className={styles.buttonDesignC}>
                      <div className={styles.ctaLink}>Conoce más ↗</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (originalIdx === 3) {
          return (
            <div key={originalIdx} className={`${styles.sectionItem} ${styles.designB}`} style={{ position: "relative" }}>
              <video autoPlay loop muted playsInline className={styles.backgroundVideo}>
                <source src={`${videoBasePath}pueblos_comunidades_indigenas.mp4`} type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
              <div className={styles.overlayTextDesignB}>
                <div className={styles.gradientOverlay}></div>
                <p>{item.subtitle}</p>
              </div>
              <Link href={item.href} target="_blank" rel="noopener noreferrer" className={styles.buttonDesignC}>
                <div className={styles.ctaLink}>Conoce más ↗</div>
              </Link>
            </div>
          );
        }

        if (originalIdx === 4) {
          return (
            <div key={originalIdx} className={`${styles.sectionItem} ${styles.designE}`}>
              <div className={styles.containerDesignE}>
                <div className={styles.bgImgDesignE}>
                  <img src={`${imgBasePath}bg.png`} alt={item.title} />
                </div>
                <div className={styles.imgRepresentationDesignE}>
                  <img src={`${imgBibliotecaDigital}personas.png`} alt={item.title} />
                </div>
                <div className={styles.imgeWrapperDesignE}>
                  <Link href={item.href} target="_blank" rel="noopener noreferrer">
                    <div className={styles.imgBotonDesignE}>
                      <img src={`${imgBibliotecaDigital}boton.png`} alt={item.title} />
                    </div>
                  </Link>
                  <div className={styles.overlayTextDesignE}>
                    <p>{item.subtitle}</p>
                    <Link href={item.href} target="_blank" rel="noopener noreferrer" className={styles.buttonDesignE}>
                      <div className={styles.ctaLink}>Conoce más ↗</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (originalIdx === 5) {
          return <ForosRegionalesSlider key="foros-regionales" items={forosItems} />;
        }

        return null;
      })}
    </section>
  );
}
