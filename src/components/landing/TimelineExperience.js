"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LanguageIcon from "@mui/icons-material/Language";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MicIcon from "@mui/icons-material/Mic";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SchoolIcon from "@mui/icons-material/School";
import Groups3Icon from "@mui/icons-material/Groups3";
import ForumIcon from "@mui/icons-material/Forum";
import SouthIcon from "@mui/icons-material/South";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimelinePhotoGallery from "@/components/landing/TimelinePhotoGallery";
import styles from "@/styles/TimelineExperience.module.css";

gsap.registerPlugin(ScrollTrigger);

const timelineData = [
  {
    id: "junio",
    month: "JUNIO",
    year: "2025",
    colorClass: "junio",
    topEvents: [
      {
        tag: "CONSULTA DIGITAL",
        title: "Espacio digital abierto",
        date: "Junio -> Octubre 2025",
        text: "Espacio para identificar temas de mayor interes social y propuestas de atencion.",
        stat: "5,343 propuestas",
        icon: "digital",
        galleryKey: "consulta-digital",
      },
    ],
    bottomEvents: [
      {
        tag: "RETO IA",
        title: "Inteligencia Artificial",
        date: "Junio -> Octubre 2025",
        text: "Uso de herramientas de inteligencia artificial para representar una vision prospectiva de Hidalgo.",
        stat: "15 insumos para vision a largo plazo",
        icon: "ia",
        galleryKey: "reto-ia",
      },
    ],
  },
  {
    id: "agosto",
    month: "AGOSTO",
    year: "2025",
    colorClass: "agosto",
    topEvents: [
      {
        tag: "PODCAST",
        title: "Dialogos con autoridades",
        date: "Agosto -> Septiembre 2025",
        text: "Serie de podcasts con entrevistas a autoridades para conocer sus propuestas y preocupaciones.",
        stat: "20 participantes · 6 eventos",
        icon: "podcast",
        galleryKey: "podcast",
      },
    ],
    bottomEvents: [
      {
        tag: "PUEBLOS Y COMUNIDADES INDIGENAS",
        title: "Foros regionales en 45 municipios",
        date: "Agosto -> Octubre 2025",
        text: "Espacio para conocer las propuestas e inquietudes de pueblos originarios y comunidades indigenas de Hidalgo.",
        stat: "7,319 propuestas ciudadanas",
        icon: "indigenas",
        galleryKey: "indigenas",
      },
    ],
  },
  {
    id: "septiembre",
    month: "SEPTIEMBRE",
    year: "2025",
    colorClass: "septiembre",
    topEvents: [
      {
        tag: "CONSULTA INFANTIL",
        title: "9 eventos en escuelas",
        date: "23 Sep -> 8 Oct 2025",
        text: "Consulta dirigida a ninas y ninos para conocer sus propuestas e inquietudes.",
        stat: "175 propuestas · 1,100 expresiones graficas",
        icon: "infantil",
        galleryKey: "infantil",
      },
    ],
    bottomEvents: [],
  },
  {
    id: "octubre",
    month: "OCTUBRE",
    year: "2025",
    colorClass: "octubre",
    topEvents: [
      {
        tag: "CONSULTA CON JUVENTUDES",
        title: "320 bachilleratos + 6 IES UAEH",
        date: "29 Sep -> 4 Nov 2025",
        text: "Consulta dirigida a jovenes en bachillerato y educacion superior para conocer sus propuestas e inquietudes.",
        stat: "2,483 propuestas EMS · 2,025 propuestas UAEH",
        icon: "juventudes",
        galleryKey: "juventudes",
      },
    ],
    bottomEvents: [
      {
        tag: "FOROS CIUDADANOS",
        title: "18 foros en 12 universidades",
        date: "29 Sep -> 25 Nov 2025",
        text: "Foros de dialogo con la sociedad civil para conocer sus propuestas e inquietudes.",
        stat: "6,915 propuestas",
        icon: "foros",
        galleryKey: "foros-ciudadanos",
      },
    ],
  },
  {
    id: "noviembre",
    month: "NOVIEMBRE",
    year: "2025",
    colorClass: "noviembre",
    topEvents: [],
    bottomEvents: [
      {
        tag: "GRUPOS FOCALES",
        title: "8 debates especializados con 69 participantes",
        date: "8 Ago -> 21 Nov 2025",
        text: "Grupos focales con expertos para profundizar en temas clave para el desarrollo de Hidalgo.",
        stat: "583 propuestas con enfoque sectorial",
        icon: "focales",
        galleryKey: "grupos-focales",
      },
    ],
  },
];

const iconMap = {
  digital: LanguageIcon,
  ia: AutoAwesomeIcon,
  podcast: MicIcon,
  indigenas: Diversity3Icon,
  infantil: ChildCareIcon,
  juventudes: SchoolIcon,
  foros: Groups3Icon,
  focales: ForumIcon,
};

const eventGalleries = {
  "consulta-digital": [
    {
      src: "/img/page_links/consulta_digital/persona.png",
      alt: "Consulta digital del PED",
      label: "Participacion digital",
      caption: "Vista representativa del acceso ciudadano a la consulta digital.",
    },
    {
      src: "/img/page_links/consulta_digital/boton.png",
      alt: "Boton de consulta digital",
      label: "Acceso al formulario",
      caption: "Entrada principal para compartir propuestas dentro de la plataforma.",
    },
    {
      src: "/og-image.png",
      alt: "Imagen principal del Plan Estatal de Desarrollo",
      label: "Difusion general",
      caption: "Material grafico utilizado para comunicar la actualizacion del PED.",
    },
  ],
  "reto-ia": [
    {
      src: "/img/page_links/convocatoria_IA/mano.png",
      alt: "Convocatoria de inteligencia artificial",
      label: "Convocatoria IA",
      caption: "Elemento visual del reto enfocado en vision prospectiva e innovacion.",
    },
    {
      src: "/img/page_links/convocatoria_IA/boton.png",
      alt: "Acceso al reto de inteligencia artificial",
      label: "Registro del reto",
      caption: "Pieza de acceso para las personas participantes en la convocatoria.",
    },
    {
      src: "/img/headertxt.png",
      alt: "Comunicacion del PED",
      label: "Difusion institucional",
      caption: "Apoyo grafico para la comunicacion institucional del ejercicio.",
    },
  ],
  podcast: [
    {
      src: "/img/Podcast/la-voz-de-hidalgo-portada.png",
      alt: "Portada del podcast",
      label: "Portada del podcast",
      caption: "Identidad visual de la serie de dialogos con autoridades.",
    },
    {
      src: "/img/Podcast/mic.png",
      alt: "Microfono del podcast",
      label: "Sesion de grabacion",
      caption: "Recurso visual asociado a las entrevistas y mensajes clave.",
    },
    {
      src: "/img/logo.png",
      alt: "Logo institucional",
      label: "Identidad institucional",
      caption: "Imagen de respaldo usada para la presencia institucional del contenido.",
    },
  ],
  indigenas: [
    {
      src: "/img/forosRegionales/Reg04Huejutla.png",
      alt: "Foro regional Huejutla",
      label: "Region Huejutla",
      caption: "Concentrado visual de la participacion en la region Huasteca.",
    },
    {
      src: "/img/forosRegionales/Reg09Zacualtipan.png",
      alt: "Foro regional Zacualtipan",
      label: "Region Zacualtipan",
      caption: "Sede vinculada a la escucha territorial en comunidades del estado.",
    },
    {
      src: "/img/forosRegionales/Reg12Jacala.png",
      alt: "Foro regional Jacala",
      label: "Region Jacala",
      caption: "Registro grafico de actividades en zonas con presencia de pueblos originarios.",
    },
  ],
  infantil: [
    {
      src: "/img/page_links/biblioteca_digital/personas.png",
      alt: "Participacion infantil",
      label: "Expresion grafica",
      caption: "Material visual para representar la participacion de infancias en el proceso.",
    },
    {
      src: "/img/slider/PED.png",
      alt: "Presentacion del PED",
      label: "Material didactico",
      caption: "Recurso de apoyo para comunicar el ejercicio en espacios escolares.",
    },
    {
      src: "/img/slider/PND.jpg",
      alt: "Planeacion y desarrollo",
      label: "Contexto de planeacion",
      caption: "Imagen de apoyo usada como referencia institucional del proceso.",
    },
  ],
  juventudes: [
    {
      src: "/img/reconocimiento/UAEH.jpg",
      alt: "Participacion de juventudes en UAEH",
      label: "Universidades",
      caption: "Referencia visual de instituciones de educacion superior participantes.",
    },
    {
      src: "/img/reconocimiento/UPP.jpg",
      alt: "Participacion juvenil en UPP",
      label: "Bachillerato y superior",
      caption: "Vinculacion con espacios formativos para captar propuestas de juventudes.",
    },
    {
      src: "/img/reconocimiento/EDUCACIÓN.jpg",
      alt: "Participacion educativa",
      label: "Red educativa",
      caption: "Soporte visual de la colaboracion con instituciones educativas del estado.",
    },
  ],
  "foros-ciudadanos": [
    {
      src: "/img/forosRegionales/Reg01Tula.png",
      alt: "Foro ciudadano Tula",
      label: "Foro Tula",
      caption: "Participacion ciudadana regional en uno de los principales foros.",
    },
    {
      src: "/img/forosRegionales/Reg03Pachuca.png",
      alt: "Foro ciudadano Pachuca",
      label: "Foro Pachuca",
      caption: "Concentrado de actividades de dialogo en la capital del estado.",
    },
    {
      src: "/img/forosRegionales/Reg06Tizayuca.png",
      alt: "Foro ciudadano Tizayuca",
      label: "Foro Tizayuca",
      caption: "Ejemplo de participacion territorial en los foros ciudadanos.",
    },
  ],
  "grupos-focales": [
    {
      src: "/img/ped_document/Mesa de trabajo 1-100.jpg",
      alt: "Mesa de trabajo 1",
      label: "Mesa de trabajo 1",
      caption: "Sesion de trabajo para profundizar en propuestas sectoriales.",
    },
    {
      src: "/img/ped_document/Mesa de trabajo 2-100.jpg",
      alt: "Mesa de trabajo 2",
      label: "Mesa de trabajo 2",
      caption: "Registro visual de una dinamica de dialogo especializado.",
    },
    {
      src: "/img/slider/lineamientos_PED.jpg",
      alt: "Lineamientos del PED",
      label: "Lineamientos base",
      caption: "Documento de referencia para orientar el analisis y la discusion tecnica.",
    },
  ],
};

function EventCard({ event, position, colorClass }) {
  const IconComponent = iconMap[event.icon] || AutoAwesomeIcon;
  const galleryImages = eventGalleries[event.galleryKey] || [];

  return (
    <article
      className={`${styles.card} ${
        position === "top" ? styles.topCard : styles.bottomCard
      } ${styles[colorClass]}`}
    >
      <div className={styles.cardGlow} />

      <div className={styles.cardHeader}>
        <div className={styles.iconBadge}>
          <IconComponent className={styles.cardIcon} />
        </div>

        <span className={styles.cardTag}>{event.tag}</span>
      </div>

      <h3 className={styles.cardTitle}>{event.title}</h3>
      <p className={styles.cardDate}>{event.text}</p>
      <TimelinePhotoGallery
        title={event.title}
        galleryLabel={event.tag}
        images={galleryImages}
      />

      {/* <p className={styles.cardDate}>{event.date}</p> */}
      <p className={styles.cardStat}>{event.stat}</p>

      <div className={styles.cardFooter}>
        <span className={styles.cardMiniLine} />
        <span className={styles.cardMiniLabel}>Participacion</span>
      </div>
    </article>
  );
}

export default function TimelineExperience() {
  const rootRef = useRef(null);
  const pinWrapRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(min-width: 901px)", () => {
        const panels = gsap.utils.toArray(`.${styles.monthPanel}`);
        const badges = gsap.utils.toArray(`.${styles.monthBadge}`);

        gsap.set(trackRef.current, { x: 0 });

        const getHorizontalDistance = () => {
          const track = trackRef.current;
          if (!track) return 0;
          return Math.max(track.scrollWidth - window.innerWidth, 0);
        };

        const horizontalTween = gsap.to(trackRef.current, {
          x: () => -getHorizontalDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: pinWrapRef.current,
            start: "top top",
            end: () => `+=${getHorizontalDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        gsap.from(`.${styles.introInner}`, {
          opacity: 0,
          y: 48,
          duration: 1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 82%",
          },
        });

        gsap.from(`.${styles.scrollHint}`, {
          opacity: 0,
          y: 18,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
        });

        gsap.fromTo(
          `.${styles.progressFill}`,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pinWrapRef.current,
              start: "top top",
              end: () => `+=${getHorizontalDistance()}`,
              scrub: 0.15,
              invalidateOnRefresh: true,
            },
          }
        );

        gsap.fromTo(
          `.${styles.progressPulse}`,
          {
            xPercent: -120,
          },
          {
            xPercent: 520,
            ease: "none",
            scrollTrigger: {
              trigger: pinWrapRef.current,
              start: "top top",
              end: () => `+=${getHorizontalDistance()}`,
              scrub: 0.15,
              invalidateOnRefresh: true,
            },
          }
        );

        gsap.to(`.${styles.progressRail}`, {
          filter:
            "drop-shadow(0 0 12px color-mix(in srgb, var(--home-timeline-glow-base) 18%, transparent))",
          repeat: -1,
          yoyo: true,
          duration: 1.8,
          ease: "sine.inOut",
        });

        panels.forEach((panel) => {
          const node = panel.querySelector(`.${styles.node}`);
          const monthBadge = panel.querySelector(`.${styles.monthBadge}`);
          const panelTopCards = panel.querySelectorAll(`.${styles.topCard}`);
          const panelBottomCards = panel.querySelectorAll(`.${styles.bottomCard}`);
          const connectorTop = panel.querySelectorAll(`.${styles.connectorTop}`);
          const connectorBottom = panel.querySelectorAll(
            `.${styles.connectorBottom}`
          );
          const cardGlows = panel.querySelectorAll(`.${styles.cardGlow}`);

          ScrollTrigger.create({
            trigger: panel,
            containerAnimation: horizontalTween,
            start: "left center",
            end: "right center",
            onEnter: () => panel.classList.add(styles.isActive),
            onEnterBack: () => panel.classList.add(styles.isActive),
            onLeave: () => panel.classList.remove(styles.isActive),
            onLeaveBack: () => panel.classList.remove(styles.isActive),
          });

          if (node) {
            gsap.from(node, {
              scale: 0,
              duration: 0.6,
              ease: "back.out(1.9)",
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 60%",
              },
            });

            gsap.to(node, {
              boxShadow:
                "0 0 0 14px var(--home-timeline-node-ring), 0 0 35px currentColor",
              repeat: -1,
              yoyo: true,
              duration: 1.4,
              ease: "sine.inOut",
            });
          }

          if (monthBadge) {
            gsap.from(monthBadge, {
              opacity: 0,
              y: 20,
              scale: 0.92,
              duration: 0.65,
              ease: "power3.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 70%",
              },
            });
          }

          if (connectorTop.length) {
            gsap.from(connectorTop, {
              scaleY: 0,
              transformOrigin: "bottom center",
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 66%",
              },
            });
          }

          if (connectorBottom.length) {
            gsap.from(connectorBottom, {
              scaleY: 0,
              transformOrigin: "top center",
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 66%",
              },
            });
          }

          if (panelTopCards.length) {
            gsap.from(panelTopCards, {
              opacity: 0,
              y: -50,
              rotateX: -18,
              scale: 0.92,
              duration: 0.9,
              stagger: 0.14,
              ease: "power3.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 62%",
              },
            });
          }

          if (panelBottomCards.length) {
            gsap.from(panelBottomCards, {
              opacity: 0,
              y: 50,
              rotateX: 18,
              scale: 0.92,
              duration: 0.9,
              stagger: 0.14,
              ease: "power3.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 62%",
              },
            });
          }

          if (cardGlows.length) {
            gsap.from(cardGlows, {
              opacity: 0,
              scale: 0.6,
              duration: 1,
              stagger: 0.1,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: horizontalTween,
                start: "left 62%",
              },
            });
          }
        });

        gsap.to(badges, {
          y: -4,
          repeat: -1,
          yoyo: true,
          duration: 2.1,
          stagger: 0.18,
          ease: "sine.inOut",
        });
      });

      mm.add("(max-width: 900px)", () => {
        gsap.from(`.${styles.mobileCard}`, {
          opacity: 0,
          y: 36,
          scale: 0.96,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 78%",
          },
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className={styles.timelineSection}>
      <div className={styles.bgOrbOne} />
      <div className={styles.bgOrbTwo} />
      <div className={styles.gridTexture} />

      <div className={styles.intro}>
        <div className={styles.introInner}>
          <p className={styles.kicker}>RUTA DE TRABAJO</p>
          <h2 className={styles.title}>
            Actualizacion del <span className="spanDoarado">Plan Estatal de Desarrollo</span>
          </h2>
          <p className={styles.subtitle}>
            Franja de participacion ciudadana en Hidalgo
          </p>

          <div className={styles.pill}>
            Un recorrido por los mecanismos de participacion que enriquecieron la
            actualizacion del PED 2022-2028
          </div>

          <div className={styles.scrollHint}>
            <SouthIcon className={styles.scrollHintIcon} />
            <span>Desplaza para explorar la experiencia</span>
          </div>
        </div>
      </div>

      <div ref={pinWrapRef} className={styles.pinWrap}>
        <div className={styles.railBackdrop} />

        <div className={styles.globalRail}>
          <div className={styles.progressRail}>
            <div className={styles.progressFill} />
            <div className={styles.progressPulse} />
          </div>
        </div>

        <div ref={trackRef} className={styles.track}>
          {timelineData.map((item) => (
            <div
              key={item.id}
              className={`${styles.monthPanel} ${styles[item.colorClass]}`}
            >
              <div className={styles.panelInner}>
                <div className={styles.topZone}>
                  {item.topEvents.length > 0 ? (
                    item.topEvents.map((event, eventIndex) => (
                      <div
                        key={`${item.id}-top-${eventIndex}`}
                        className={styles.eventWrapTop}
                      >
                        <div className={styles.connectorTop} />
                        <EventCard
                          event={event}
                          position="top"
                          colorClass={item.colorClass}
                        />
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptySlot} />
                  )}
                </div>

                <div className={styles.centerLineZone}>
                  <div className={styles.nodeWrap}>
                    <span className={styles.node} />
                  </div>

                  {/* <div className={styles.monthBadge}>
                    <strong>{item.month}</strong>
                    <small>{item.year}</small>
                  </div> */}
                </div>

                <div className={styles.bottomZone}>
                  {item.bottomEvents.length > 0 ? (
                    item.bottomEvents.map((event, eventIndex) => (
                      <div
                        key={`${item.id}-bottom-${eventIndex}`}
                        className={styles.eventWrapBottom}
                      >
                        <div className={styles.connectorBottom} />
                        <EventCard
                          event={event}
                          position="bottom"
                          colorClass={item.colorClass}
                        />
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptySlot} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mobileFallback}>
        {timelineData.map((item) => (
          <div
            key={`mobile-${item.id}`}
            className={`${styles.mobileMonth} ${styles[item.colorClass]}`}
          >
            <div className={styles.mobileMonthHeader}>
              <span className={styles.mobileDot} />
              <div>
                <strong>{item.month}</strong>
                <small>{item.year}</small>
              </div>
            </div>

            {[...item.topEvents, ...item.bottomEvents].map((event, idx) => (
              <div key={`${item.id}-mobile-${idx}`} className={styles.mobileCard}>
                <EventCard
                  event={event}
                  position="bottom"
                  colorClass={item.colorClass}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendPill}>
          <span className={styles.legendItem}>
            <LanguageIcon className={styles.legendIcon} />
            <span>Digital / Tecnologia</span>
          </span>

          <span className={styles.legendItem}>
            <MicIcon className={styles.legendIcon} />
            <span>Medios</span>
          </span>

          <span className={styles.legendItem}>
            <ChildCareIcon className={styles.legendIcon} />
            <span>Infancias</span>
          </span>

          <span className={styles.legendItem}>
            <Diversity3Icon className={styles.legendIcon} />
            <span>Pueblos originarios</span>
          </span>

          <span className={styles.legendItem}>
            <Groups3Icon className={styles.legendIcon} />
            <span>Foros y dialogos</span>
          </span>

          <span className={styles.legendItem}>
            <SchoolIcon className={styles.legendIcon} />
            <span>Juventudes</span>
          </span>

          <span className={styles.legendItem}>
            <CalendarMonthIcon className={styles.legendIcon} />
            <span>2025 - Hidalgo</span>
          </span>
        </div>

        <p className={styles.legendText}>
          Cada voz cuenta: se integraron propuestas de todo el estado para fortalecer la
          actualizacion del Plan Estatal de Desarrollo 2022-2028.
        </p>
      </div>
    </section>
  );
}
