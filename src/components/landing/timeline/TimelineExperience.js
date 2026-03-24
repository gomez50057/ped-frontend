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
import styles from "./TimelineExperience.module.css";

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
        date: "Junio → Octubre 2025",
        stat: "5,343 propuestas",
        icon: "digital",
      },
    ],
    bottomEvents: [
      {
        tag: "RETO IA",
        title: "Inteligencia Artificial",
        date: "Junio → Octubre 2025",
        stat: "15 insumos para visión a largo plazo",
        icon: "ia",
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
        title: "Diálogos con autoridades",
        date: "Agosto → Septiembre 2025",
        stat: "20 participantes · 6 eventos",
        icon: "podcast",
      },
    ],
    bottomEvents: [
      {
        tag: "PUEBLOS Y COMUNIDADES INDÍGENAS",
        title: "Foros regionales en 45 municipios",
        date: "Agosto → Octubre 2025",
        stat: "17,319 propuestas ciudadanas",
        icon: "indigenas",
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
        date: "23 Sep → 8 Oct 2025",
        stat: "175 propuestas · 1,100 expresiones gráficas",
        icon: "infantil",
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
        date: "29 Sep → 4 Nov 2025",
        stat: "2,483 propuestas EMS · 2,025 propuestas UAEH",
        icon: "juventudes",
      },
    ],
    bottomEvents: [
      {
        tag: "FOROS CIUDADANOS",
        title: "18 foros en 12 universidades",
        date: "29 Sep → 25 Nov 2025",
        stat: "6,915 propuestas",
        icon: "foros",
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
        title: "8 debates especializados",
        date: "8 Ago → 21 Nov 2025",
        stat: "583 propuestas con enfoque sectorial",
        icon: "focales",
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

function EventCard({ event, position, colorClass }) {
  const IconComponent = iconMap[event.icon] || AutoAwesomeIcon;

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
      <p className={styles.cardDate}>{event.date}</p>
      <p className={styles.cardStat}>{event.stat}</p>

      <div className={styles.cardFooter}>
        <span className={styles.cardMiniLine} />
        <span className={styles.cardMiniLabel}>Participación</span>
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
        const rails = gsap.utils.toArray(`.${styles.progressRail}`);
        const badges = gsap.utils.toArray(`.${styles.monthBadge}`);

        gsap.set(trackRef.current, { x: 0 });

        const getScrollAmount = () => {
          const track = trackRef.current;
          if (!track) return 0;
          return -(track.scrollWidth - window.innerWidth);
        };

        const totalEnd = () =>
          trackRef.current?.scrollWidth - window.innerWidth + window.innerHeight * 0.45;

        const horizontalTween = gsap.to(trackRef.current, {
          x: getScrollAmount,
          ease: "none",
          scrollTrigger: {
            trigger: pinWrapRef.current,
            start: "top top",
            end: () => `+=${totalEnd()}`,
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
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pinWrapRef.current,
              start: "top top",
              end: () => `+=${totalEnd()}`,
              scrub: true,
            },
          }
        );

        gsap.to(`.${styles.progressPulse}`, {
          xPercent: 250,
          ease: "none",
          scrollTrigger: {
            trigger: pinWrapRef.current,
            start: "top top",
            end: () => `+=${totalEnd()}`,
            scrub: true,
          },
        });

        panels.forEach((panel) => {
          const node = panel.querySelector(`.${styles.node}`);
          const monthBadge = panel.querySelector(`.${styles.monthBadge}`);
          const panelTopCards = panel.querySelectorAll(`.${styles.topCard}`);
          const panelBottomCards = panel.querySelectorAll(`.${styles.bottomCard}`);
          const connectorTop = panel.querySelectorAll(`.${styles.connectorTop}`);
          const connectorBottom = panel.querySelectorAll(`.${styles.connectorBottom}`);
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
              boxShadow: "0 0 0 14px rgba(255,255,255,0.10), 0 0 35px currentColor",
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

        gsap.to(rails, {
          filter: "drop-shadow(0 0 12px rgba(255,255,255,0.25))",
          repeat: -1,
          yoyo: true,
          duration: 1.8,
          stagger: 0.15,
          ease: "sine.inOut",
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
          <p className={styles.kicker}>LÍNEA DE TIEMPO</p>
          <h2 className={styles.title}>Actualización del Plan Estatal de Desarrollo</h2>
          <p className={styles.subtitle}>
            Franja de participación ciudadana · Junio — Noviembre 2025
          </p>

          <div className={styles.pill}>
            Un recorrido por los mecanismos de participación que enriquecieron la
            actualización del PED 2022–2028
          </div>

          <div className={styles.scrollHint}>
            <SouthIcon className={styles.scrollHintIcon} />
            <span>Desplaza para explorar la experiencia</span>
          </div>
        </div>
      </div>

      <div ref={pinWrapRef} className={styles.pinWrap}>
        <div className={styles.railBackdrop} />
        <div ref={trackRef} className={styles.track}>
          {timelineData.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.monthPanel} ${styles[item.colorClass]}`}
            >
              <div className={styles.panelInner}>
                <div className={styles.topZone}>
                  {item.topEvents.length > 0 ? (
                    item.topEvents.map((event, eventIndex) => (
                      <div key={`${item.id}-top-${eventIndex}`} className={styles.eventWrapTop}>
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

                  <div className={styles.progressRail}>
                    {index === 0 && (
                      <>
                        <div className={styles.progressFill} />
                        <div className={styles.progressPulse} />
                      </>
                    )}
                  </div>

                  <div className={styles.monthBadge}>
                    <strong>{item.month}</strong>
                    <small>{item.year}</small>
                  </div>
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
          <span>Digital / Tecnología</span>
          <span>Medios</span>
          <span>Infancias</span>
          <span>Pueblos originarios</span>
          <span>Foros y diálogos</span>
          <span>Juventudes</span>
          <span>2025 — Hidalgo</span>
        </div>

        <p className={styles.legendText}>
          ✦ Cada voz cuenta: se integraron propuestas de todo el estado para fortalecer la
          actualización del Plan Estatal de Desarrollo 2022–2028.
        </p>
      </div>
    </section>
  );
}