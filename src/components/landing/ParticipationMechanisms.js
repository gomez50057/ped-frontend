"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Groups3Icon from "@mui/icons-material/Groups3";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SchoolIcon from "@mui/icons-material/School";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import LanguageIcon from "@mui/icons-material/Language";
import ForumIcon from "@mui/icons-material/Forum";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";

import styles from "@/styles/ParticipationMechanisms.module.css";

gsap.registerPlugin(ScrollTrigger);

const mechanisms = [
  {
    id: "foros",
    title: "FOROS DE PARTICIPACIÓN CIUDADANA",
    description:
      "18 foros ciudadanos\nEn 12 universidades e instituciones de educación superior",
    date: "29 de septiembre al\n25 de noviembre de 2025",
    stat: "6,915 propuestas",
    color: "blue",
    icon: "foros",
    size: "top",
  },
  {
    id: "indigenas",
    title: "FOROS DE CONSULTA A PUEBLOS Y COMUNIDADES INDÍGENAS",
    description:
      "Foros regionales de consulta\nen los 45 municipios con presencia\nde población indígena",
    date: "Agosto a octubre 2025",
    stat: "17,319 propuestas",
    color: "green",
    icon: "indigenas",
    size: "top",
  },
  {
    id: "juventudes",
    title: "CONSULTA CON JUVENTUDES",
    description:
      "Ejercicios de diálogo en\n320 instituciones de educación media superior\ny 6 institutos de educación superior",
    date: "29 de septiembre al 4 de noviembre de 2025",
    stat: "2,483 propuestas",
    color: "orange",
    icon: "juventudes",
    size: "top",
  },
  {
    id: "infantil",
    title: "CONSULTA INFANTIL",
    description:
      "9 eventos en escuelas\nde educación básica y otras\ninstituciones donde se\ndesarrollaron las infancias",
    date: "23 de septiembre al 8 de\noctubre de 2025",
    stat: "175 propuestas",
    color: "amber",
    icon: "infantil",
    size: "bottom",
  },
  {
    id: "digital",
    title: "CONSULTA DIGITAL",
    description:
      "Espacio para identificar\ntemas de mayor interés social\ny propuestas de atención",
    date: "Junio a octubre de 2025",
    stat: "5,343 propuestas",
    color: "cyan",
    icon: "digital",
    size: "bottom",
  },
  {
    id: "focales",
    title: "GRUPOS FOCALES",
    description:
      "Se realizaron 8 debates\nespecializados, con la\nparticipación de 69\npersonas con amplia\nexperiencia y preparación\nen los temas.",
    date: "6 de agosto al 21 de\nnoviembre de 2025",
    stat: "583 propuestas",
    color: "violet",
    icon: "focales",
    size: "bottom",
  },
  {
    id: "retoia",
    title: "RETO IA",
    description:
      "Uso de herramientas de\ninteligencia artificial para\nrepresentar una visión\nprospectiva de hidalgo",
    date: "Junio a octubre de 2025",
    stat: "20 participantes\n2,178 visualizaciones aproximadas",
    color: "purple",
    icon: "ia",
    size: "bottom",
  },
];

const legend = [
  { label: "Foros y diálogos", color: "blue", icon: "foros" },
  { label: "Pueblos originarios", color: "green", icon: "indigenas" },
  { label: "Juventudes", color: "orange", icon: "juventudes" },
  { label: "Digital / Tecnología", color: "cyan", icon: "digital" },
  { label: "Infancias", color: "amber", icon: "infantil" },
  { label: "Medios / IA", color: "purple", icon: "ia" },
];

function getIcon(icon, className) {
  const map = {
    foros: <Groups3Icon className={className} />,
    indigenas: <Diversity3Icon className={className} />,
    juventudes: <SchoolIcon className={className} />,
    infantil: <ChildCareIcon className={className} />,
    digital: <LanguageIcon className={className} />,
    focales: <ForumIcon className={className} />,
    ia: <PsychologyAltIcon className={className} />,
  };

  return map[icon] || <Groups3Icon className={className} />;
}

function isNumericToken(token) {
  return /^\d[\d,.]*$/.test(token.trim());
}

function formatCounterValue(value, original) {
  if (original.includes(",")) {
    return Math.round(value).toLocaleString("en-US");
  }

  return String(Math.round(value));
}

function renderAnimatedStat(text) {
  const lines = text.split("\n");

  return lines.map((line, lineIndex) => {
    const parts = line.split(/(\d[\d,.]*)/g);

    return (
      <span key={lineIndex}>
        {parts.map((part, partIndex) => {
          if (isNumericToken(part)) {
            const numericValue = Number(part.replace(/,/g, ""));
            return (
              <span
                key={`${lineIndex}-${partIndex}`}
                className={styles.countNumber}
                data-count-to={numericValue}
                data-count-original={part}
              >
                0
              </span>
            );
          }

          return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
        })}
        {lineIndex < lines.length - 1 && <br />}
      </span>
    );
  });
}

function formatText(text) {
  return text.split("\n").map((line, index) => (
    <span key={index}>
      {line}
      {index < text.split("\n").length - 1 && <br />}
    </span>
  ));
}

function Card({ item }) {
  return (
    <article
      className={`${styles.card} ${styles[item.color]} ${item.size === "top" ? styles.cardTop : styles.cardBottom
        }`}
      data-card
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconCircle}>{getIcon(item.icon, styles.cardIcon)}</div>

        <div className={styles.titlePill}>
          <span>{item.title}</span>
        </div>
      </div>

      <div className={styles.leftAccent} />
      <div className={styles.dotAccent} />

      <div className={styles.cardBody}>
        <p className={styles.description}>{formatText(item.description)}</p>
        <div className={styles.divider} />
        {/* <p className={styles.date}>{formatText(item.date)}</p> */}
        <p className={styles.stat}>{renderAnimatedStat(item.stat)}</p>
      </div>
    </article>
  );
}

export default function ParticipationMechanisms() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const header = rootRef.current.querySelector(`.${styles.header}`);
      const line = rootRef.current.querySelector(`.${styles.timelineLine}`);
      const dots = rootRef.current.querySelectorAll(`.${styles.topDot}`);
      const cards = rootRef.current.querySelectorAll("[data-card]");
      const legendItems = rootRef.current.querySelectorAll(`.${styles.legendItem}`);

      gsap.from(header, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
        },
      });

      gsap.from(line, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
        },
      });

      gsap.from(dots, {
        opacity: 0,
        scale: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "back.out(1.8)",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 76%",
        },
      });

      gsap.from(cards, {
        opacity: 0,
        y: 36,
        stagger: {
          each: 0.1,
          from: "start",
        },
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
        },
      });

      gsap.from(legendItems, {
        opacity: 0,
        y: 12,
        stagger: 0.06,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "bottom 95%",
        },
      });

      cards.forEach((card) => {
        const pill = card.querySelector(`.${styles.titlePill}`);
        const counters = card.querySelectorAll(`.${styles.countNumber}`);

        if (counters.length) {
          counters.forEach((counter) => {
            const finalValue = Number(counter.dataset.countTo || 0);
            const originalValue = counter.dataset.countOriginal || String(finalValue);

            const counterState = { value: 0 };

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });

            // Anima primero hasta el 90% del valor final para un conteo inicial más rápido.
            tl.to(counterState, {
              value: finalValue * 0.9,
              duration: 1.9,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = formatCounterValue(counterState.value, originalValue);
              },
            });

            // Luego anima suavemente hasta el valor final para un efecto de conteo más natural.
            tl.to(counterState, {
              value: finalValue,
              duration: 2.5,
              ease: "power1.out",
              onUpdate: () => {
                counter.textContent = formatCounterValue(counterState.value, originalValue);
              },
            });
          });
        }

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -6,
            duration: 0.25,
            ease: "power2.out",
          });

          gsap.to(pill, {
            filter: "brightness(1.05)",
            duration: 0.25,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          });

          gsap.to(pill, {
            filter: "brightness(1)",
            duration: 0.25,
          });
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.section}>
      <div className={styles.bgTexture} />

      <div className={styles.header}>
        <h2 className={styles.title}>Mecanismos de <span className="spanDoarado">Participación Ciudadana</span></h2>
        <p className={styles.subtitle}>
          Diversos mecanismos recopilaron propuestas ciudadanas en todo el estado,
          mediante foros, consultas, diálogos y ejercicios creativos.
        </p>
      </div>

      <div className={styles.topTrack}>
        <div className={styles.timelineLine} />
        <span className={`${styles.topDot} ${styles.blueDot}`} />
        <span className={`${styles.topDot} ${styles.greenDot}`} />
        <span className={`${styles.topDot} ${styles.orangeDot}`} />
        <span className={`${styles.topDot} ${styles.cyanDot}`} />
        <span className={`${styles.topDot} ${styles.violetDot}`} />
      </div>

      <div className={styles.grid}>
        {mechanisms.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>

      <div className={styles.legend}>
        {legend.map((item) => (
          <span
            key={item.label}
            className={`${styles.legendItem} ${styles[item.color]}`}
          >
            <span className={styles.legendIconWrap}>
              {getIcon(item.icon, styles.legendIcon)}
            </span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}