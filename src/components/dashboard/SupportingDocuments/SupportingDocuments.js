"use client";

import React, { useState } from "react";
import styles from "./SupportingDocuments.module.css";

const Empty = () => null;

const DEFAULT_FEATURED = [
  {
    label: "Plan Estatal de Desarrollo vigente",
    img: "PED.webp",
    alt: "Plan Estatal de Desarrollo vigente",
    pdf: "Plan Estatal de Desarrollo 2022-2028.pdf",
    useModal: false,
  },
  {
    label: "Lineamientos",
    img: "Lineamientos-del-PED.jpg",
    alt: "Lineamientos",
    pdf: "Lineamientos del PED.pdf",
    useModal: false,
  },
  {
    label: "Bases de datos de las propuestas ciudadanas",
    img: "Bases_propuestas.jpg",
    alt: "Bases de datos de las propuestas ciudadanas",
    useModal: true,
    files: [
      { label: "Descargar archivo 01", file: "archivo_01.pdf" },
      { label: "Descargar archivo 052", file: "archivo_052.pdf" },
    ],
  },
];

const imgFeaturedPath = "/img/dashboard/SupportingDocuments/caratulas/";
const pdfPath = "/pdf/";

const DefaultModal = ({ isOpen, onClose, files = [] }) =>
  isOpen ? (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        <h3>Bases de datos de las propuestas ciudadanas</h3>
        <div className={styles.filesList}>
          {files.map(({ label, file }) => (
            <a
              key={file}
              href={`${pdfPath}${file}`}
              download={file}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadBtn}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  ) : null;

const SupportingDocuments = ({
  children,
  featuredItems = DEFAULT_FEATURED,
  Tooltip = Empty,
  Modal, // Si quieres pasar tu propio modal, sino usa DefaultModal
}) => {
  const [selectedModalFiles, setSelectedModalFiles] = useState(null);

  const handleClick = (item) => {
    if (item.useModal) {
      setSelectedModalFiles(item.files || []);
    } else if (item.pdf) {
      // Descarga directa de PDF
      const link = document.createElement("a");
      link.href = `${pdfPath}${item.pdf}`;
      link.download = item.pdf;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const closeModal = () => setSelectedModalFiles(null);

  // Usa el modal custom si se pasa, si no, el default de este archivo
  const ModalComponent = Modal || DefaultModal;

  return (
    <section className={styles.featured}    >
      <div className={styles.containerSubTi}>
        <h2 className={styles.subtitulo}>Documentos Apoyo</h2>
      </div>
      <div className={styles.containerFeatured}>
        <Tooltip />
        {featuredItems.map((item) => (
          <div
            key={item.label}
            className={styles.item}
            onClick={() => handleClick(item)}
            tabIndex={0}
            aria-label={item.label}
            style={{ cursor: "pointer" }}
            title={
              item.useModal
                ? "Ver opciones de descarga"
                : item.pdf
                  ? `Descargar PDF: ${item.label}`
                  : ""
            }
          >
            <img
              src={`${imgFeaturedPath}${item.img}`}
              alt={item.alt}
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <ModalComponent
        isOpen={!!selectedModalFiles}
        onClose={closeModal}
        files={selectedModalFiles || []}
      />
      {children}
    </section>
  );
};

export default SupportingDocuments;
