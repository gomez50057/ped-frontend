"use client";

import { useState } from "react";
import Hero from "@/components/ped_pdf/hero/Hero";
import PedPdfViewerModal from "@/components/landing/modal/PedPdfViewerModal";
import styles from "@/styles/PedPdfHeroSection.module.css";

const PDF_FILE = "/pdf/Actualizacion_PED_2025_2028_opt.pdf";

export default function PedPdfHeroSection() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <section
        aria-label="Consulta y descarga del Plan Estatal de Desarrollo"
        className={styles.section}
      >
        <div className={styles.stage}>
          <div className={styles.copyColumn}>
            <div className={styles.contentCard}>
              <span className={styles.eyebrow}>PED 2025-2028</span>
              <h2 className={styles.title}>Consulta el <span className="spanDoaradoClr">Plan Estatal de Desarrollo</span></h2>
              <p className={styles.description}>
                Explora el Plan Estatal de Desarrollo o llévatelo en PDF con un solo clic.
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
            </div>
          </div>

          <div className={styles.visualColumn}>
            <div className={styles.heroFrame}>
              <Hero onBookClick={() => setIsViewerOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      <PedPdfViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
}
