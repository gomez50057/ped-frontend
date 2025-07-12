"use client";

import React, { useState, useEffect } from "react";
import styles from "./SupportingDocuments.module.css";
import { fetchWithAuth } from "@/utils/auth";

const Empty = () => null;

const GENERAL_FILES = [
  {
    label: "Plan Estatal de Desarrollo vigente",
    img: "PED.webp",
    alt: "Plan Estatal de Desarrollo vigente",
    pdf: "Plan Estatal de Desarrollo 2022-2028.pdf",
  },
  {
    label: "Lineamientos",
    img: "Lineamientos-del-PED.jpg",
    alt: "Lineamientos",
    pdf: "Lineamientos del PED.pdf",
  },
];

const BASES_FILES_BY_USER = {
  pru: {
    label: "Bases de datos de las propuestas ciudadanas",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas",
    pdf: "archivo_01.pdf",
  },
  user2: {
    label: "Bases de datos de las propuestas ciudadanas",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas",
    pdf: "archivo_052.pdf",
  },
};

const imgFeaturedPath = "/img/dashboard/SupportingDocuments/caratulas/";
const pdfPath = "/pdf/";

const SupportingDocuments = ({
  children,
  Tooltip = Empty,
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar, obtiene usuario logueado
  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetchWithAuth("/api/auth/current_user/");
        if (!res.ok) throw new Error("No autorizado");
        const data = await res.json();
        setCurrentUser(data.username);
      } catch (error) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  const filesToShow = [
    ...GENERAL_FILES,
    ...(currentUser && BASES_FILES_BY_USER[currentUser]
      ? [BASES_FILES_BY_USER[currentUser]]
      : []),
  ];

  const handleClick = (item) => {
    if (item.pdf) {
      const link = document.createElement("a");
      link.href = `${pdfPath}${item.pdf}`;
      link.download = item.pdf;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading)
    return (
      <section className={styles.featured}>
        <div className={styles.containerSubTi}>
          <h2 className={styles.subtitulo}>Documentos Apoyo</h2>
        </div>
        <div style={{ padding: "3rem", textAlign: "center" }}>Cargando...</div>
      </section>
    );

  if (!currentUser)
    return (
      <section className={styles.featured}>
        <div className={styles.containerSubTi}>
          <h2 className={styles.subtitulo}>Documentos Apoyo</h2>
        </div>
        <div style={{ padding: "3rem", textAlign: "center" }}>
          No autorizado.
        </div>
      </section>
    );

  return (
    <section className={styles.featured}>
      <div className={styles.containerSubTi}>
        <h2 className={styles.subtitulo}>Documentos Apoyo</h2>
      </div>
      <div className={styles.containerFeatured}>
        <Tooltip />
        {filesToShow.map((item) => (
          <div key={item.label} className={styles.cardWrapper}>
            <div
              className={styles.item}
              onClick={() => handleClick(item)}
              tabIndex={0}
              aria-label={item.label}
              style={{ cursor: "pointer" }}
              title={`Descargar PDF: ${item.label}`}
            >
              <img
                src={`${imgFeaturedPath}${item.img}`}
                alt={item.alt}
                loading="lazy"
              />
            </div>
            <div className={styles.docLabel}>{item.label}</div>
          </div>
        ))}
      </div>
      {children}
    </section>
  );
};

export default SupportingDocuments;
