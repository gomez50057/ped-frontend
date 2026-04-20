"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/ped_pdf/hero/Hero";
import PdfFlipbook from "@/components/ped_pdf/PdfFlipbook";
import styles from "@/styles/PedPdfHeroSection.module.css";

const PDF_FILE = "/pdf/Actualizacion_PED_2025_2028_opt.pdf";

export default function PedPdfHeroSection() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (!isViewerOpen) {
      document.documentElement.removeAttribute("data-ped-viewer-open");
      window.dispatchEvent(
        new CustomEvent("ped-viewer-toggle", { detail: { open: false } })
      );
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-ped-viewer-open", "true");
    window.dispatchEvent(
      new CustomEvent("ped-viewer-toggle", { detail: { open: true } })
    );

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.removeAttribute("data-ped-viewer-open");
      window.dispatchEvent(
        new CustomEvent("ped-viewer-toggle", { detail: { open: false } })
      );
    };
  }, [isViewerOpen]);

  useEffect(() => {
    if (!isViewerOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsViewerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isViewerOpen]);

  return (
    <>
      <section
        aria-label="Consulta y descarga del Plan Estatal de Desarrollo"
        className={styles.section}
      >
        <div className={styles.stage}>
          <div className={styles.heroFrame}>
            <Hero onBookClick={() => setIsViewerOpen(true)} />
          </div>

          <div className={styles.overlay}>
            <div className={styles.contentCard}>
              <span className={styles.eyebrow}>PED 2025-2028</span>
              <h2 className={styles.title}>Míralo aquí mismo o descárgalo al instante</h2>
              <p className={styles.description}>
                Explora el Plan Estatal de Desarrollo en pantalla completa o llévatelo en PDF
                con un solo clic.
              </p>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => setIsViewerOpen(true)}
                >
                  Visualizar PED
                </button>

                <a
                  className={styles.secondaryButton}
                  href={PDF_FILE}
                  download="Actualizacion_PED_2025_2028.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Descargar PDF
                </a>
              </div>

              <p className={styles.hint}>
                También puedes hacer clic sobre el libro para abrir el visor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {isViewerOpen && (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Visor del Plan Estatal de Desarrollo"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsViewerOpen(false);
            }
          }}
        >
          <div
            className={styles.modalViewport}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsViewerOpen(false)}
              aria-label="Cerrar visor"
            >
              Cerrar
            </button>

            <div className={styles.modalContent}>
              <PdfFlipbook />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
