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
    pathType: "general",
  },
  {
    label: "Lineamientos",
    img: "Lineamientos-del-PED.jpg",
    alt: "Lineamientos",
    pdf: "Lineamientos del PED.pdf",
    pathType: "general",
  },
  {
    label: "Preliminar del PED",
    img: "Preliminar-PED.jpg",
    alt: "Preliminar del PED",
    pdf: "Actualización_PED_2025_2028.pdf",
    pathType: "general",
  },
  {
    label: "Presentación 2025",
    img: "Presentacion-2025.jpg",
    alt: "Presentación 2025",
    pdf: "presentacion.pdf",
    pathType: "general",
  },
];

const BASES_FILES_BY_USER = {
  AdminAgricultura: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Agricultura y Desarrollo Rural",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Agricultura y Desarrollo Rural",
    pdf: "Secretaría de Agricultura y Desarrollo Rural/Agropecuario y campo.xlsx",
    pathType: "user",
  },
  AdminBienestar: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Bienestar e Inclusión Social",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Bienestar e Inclusión Social",
    pdf: "Secretaría de Bienestar e Inclusión Social/Bienestar Social.xlsx",
    pathType: "user",
  },
  AdminContraloria: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Contraloría",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Contraloría",
    pdf: "Secretaría de Contraloría/Transparencia y Combate a la corrupción.xlsx",
    pathType: "user",
  },
  AdminCultura: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Cultura",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Cultura",
    pdf: "Secretaría de Cultura/Cultura.xlsx",
    pathType: "user",
  },
  AdminDespacho: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría del Despacho",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría del Despacho",
    pdf: "Secretaría del Despacho/Despacho.xlsx",
    pathType: "user",
  },
  AdminEconomia: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Desarrollo Económico",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Desarrollo Económico",
    pdf: "Secretaría de Desarrollo Económico/Desarrollo Económico.xlsx",
    pathType: "user",
  },
  AdminEducacion: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Educación Pública",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Educación Pública",
    pdf: "Secretaría de Educación Pública/Educación.xlsx",
    pathType: "user",
  },
  AdminGobiemo: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Gobierno",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Gobierno",
    pdf: "Secretaría de Gobierno/Gobierno.xlsx",
    pathType: "user",
  },
  AdminHacienda: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Hacienda",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Hacienda",
    pdf: "Secretaría de Hacienda/Hacienda.xlsx",
    pathType: "user",
  },
  Adminlnfraestructura: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Infraestructura Pública y Desarrollo Urbano Sostenible",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Infraestructura Pública y Desarrollo Urbano Sostenible",
    pdf: "Secretaría de Infraestructura Pública y Desarrollo Urbano Sostenible/Infraestructura Publica y Equipamiento Urbano.xlsx",
    pathType: "user",
  },
  AdminMedioAmbiente: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Medio Ambiente y Recursos naturales",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Medio Ambiente y Recursos naturales",
    pdf: "Secretaría de Medio Ambiente y Recursos naturales/Medio Ambiente.xlsx",
    pathType: "user",
  },
  AdminMovilidad: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Movilidad y Transporte",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Movilidad y Transporte",
    pdf: "Secretaría de Movilidad y Transporte/Movilidad.xlsx",
    pathType: "user",
  },
  AdminOficialM: {
    label: "Bases de datos de las propuestas ciudadanas de la Oficialia mayor",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Oficialia mayor",
    pdf: "Oficialia mayor/Oficialia.xlsx",
    pathType: "user",
  },
  AdminPJusticia: {
    label: "Bases de datos de las propuestas ciudadanas de la Procuraduría de Justicia",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Procuraduría de Justicia",
    pdf: "Procuraduría de Justicia/Justicia.xlsx",
    pathType: "user",
  },
  AdminSalud: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Salud",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Salud",
    pdf: "Secretaría de Salud/Salud.xlsx",
    pathType: "user",
  },
  AdminSeguridad: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Seguridad Pública",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Seguridad Pública",
    pdf: "Secretaría de Seguridad Pública/Seguridad y Justicia, Seguridad Publica.xlsx",
    pathType: "user",
  },
  AdminTrabajo: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría del Trabajo y previsión Social",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría del Trabajo y previsión Social",
    pdf: "Secretaría del Trabajo y previsión Social/Empleo.xlsx",
    pathType: "user",
  },
  AdminTurismo: {
    label: "Bases de datos de las propuestas ciudadanas de la Secretaría de Turismo",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas de la Secretaría de Turismo",
    pdf: "Secretaría de Turismo/Turismo.xlsx",
    pathType: "user",
  },
};

const imgFeaturedPath = "/img/dashboard/SupportingDocuments/caratulas/";
const pdfPath = "/pdf/";
const archivosPath = "/pdf/dashboard/BD_propuestas_ciudadanas/";

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
      let pathBase = item.pathType === "user" ? archivosPath : pdfPath;
      const link = document.createElement("a");
      link.href = `${pathBase}${item.pdf}`;
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
