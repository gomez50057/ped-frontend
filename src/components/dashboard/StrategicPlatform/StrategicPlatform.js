"use client";

import React, { useState } from "react";
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

export default function StrategicPlatform({ onChange }) {
  const [checkedItems, setCheckedItems] = useState(() =>
    ITEMS.reduce((acc, label) => ({ ...acc, [label]: false }), {})
  );

  const handleToggle = (label) => {
    const updated = { ...checkedItems, [label]: !checkedItems[label] };
    setCheckedItems(updated);
    if (onChange) onChange(updated);
  };

  return (
    <div className={styles.StrategicPlatform}>
      <h2><span className="spanDoarado">Plataforma </span><span className="spanVino">Estratégica</span> </h2>
      <ul>
        {ITEMS.map((label) => (
          <li key={label} className={styles.item}>
            <label className={styles.container}>
              <input
                type="checkbox"
                checked={checkedItems[label]}
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
    </div>
  );
}
