"use client";

import React from "react";
import { usePlatform } from "@/context/PlatformContext";
import styles from "./StrategicPlatform.module.css";

const ITEMS = [
  "Eje 1 Estado Planificado, Ordenado",
  "Eje 2 Estado Eficiente y Disciplinado",
  "Eje 3 Estado Seguro y Justo",
  "Eje 4 Estado Fraterno de Bienes",
  "Eje 5 Estado Educado y Humanista",
  "Eje 6 Estado Próspero y de Oportunidades",
  "Eje 7 Estado Orgulloso de su Cultura",
  "Eje 8 Estado Conectado y con Innovación",
  "Eje 9 Estado Sustentable y Productivo",
  "ET1 Estado Transparente y de Rendición",
  "ET2 Estado Tecnológico, Científico",
  "ET3 Estado de Igualdad Sustantiva",
];

export default function StrategicPlatform({ onNext }) {
  const { checkedItems, setCheckedItems, setSelectedEjes } = usePlatform();

  const handleToggle = (label) => {
    const updated = { ...checkedItems, [label]: !checkedItems[label] };
    setCheckedItems(updated);
  };

  const mapLabelToId = (label) => {
    const match = label.match(/(Eje (\d+)|ET(\d+))/i);
    if (match) {
      if (match[2]) {
        return `EG0${match[2]}`;
      } else if (match[3]) {
        return `ET0${match[3]}`;
      }
    }
    return null;
  };

  const handleVerMas = () => {
    const selectedLabels = Object.keys(checkedItems).filter((label) => checkedItems[label]);
    const ids = selectedLabels.map((label) => mapLabelToId(label)).filter(Boolean);
    setSelectedEjes(ids);
    onNext(); // Cambio de vista
  };

  return (
    <section className={styles.containerStrategicPlatform}>
      <div className={styles.StrategicPlatform}>
        <h2 className={styles.titule}>
          <span className="spanDoarado">Plataforma </span>
          <span className="spanVino">Estratégica</span>
        </h2>
        <ul>
          {ITEMS.map((label) => (
            <li key={label} className={styles.item}>
              <label className={styles.container}>
                <input
                  type="checkbox"
                  checked={checkedItems[label] ?? false}
                  onChange={() => handleToggle(label)}
                />
                <div className={styles.checkmark}>
                  <svg
                    className={styles.checkboxSvg}
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      className={styles.checkboxCircle}
                      strokeWidth="20"
                    />
                    <path
                      className={styles.checkboxTick}
                      d="M52 111.018L76.9867 136L149 64"
                      strokeWidth="15"
                    ></path>
                  </svg>
                </div>
              </label>
              <span className={styles.labelText}>{label}</span>
            </li>
          ))}
        </ul>
        <div className={styles.buttonWrapper}>
          <button className={styles.slideButton} onClick={handleVerMas}>
            Guardar elección
          </button>
        </div>
      </div>

      <div className={styles.containerAdvertising}>
        <h3>Impulsamos el Futuro</h3>
        <ul className={styles.adList}>
          <li>🌱 Desarrollo Sustentable</li>
          <li>🚀 Innovación y Tecnología</li>
          <li>📚 Educación y Cultura</li>
        </ul>
        <p>Únete a la transformación: juntos construimos el cambio.</p>

        <h3>Comprometidos con el Progreso</h3>
        <blockquote className={styles.adQuote}>
          "El futuro lo construimos con disciplina, equidad y compromiso. Los Ejes
          Estratégicos son nuestra guía para un estado próspero y justo."
        </blockquote>
        {/* <p>— Gobierno Estatal 2025</p> */}
      </div>
    </section>
  );
}
