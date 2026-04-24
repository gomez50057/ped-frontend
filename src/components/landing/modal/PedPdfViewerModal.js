"use client";

import { useEffect } from "react";
import PdfFlipbook from "@/components/ped_pdf/PdfFlipbook";
import styles from "./PedPdfViewerModal.module.css";

export default function PedPdfViewerModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
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
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="Visor del Plan Estatal de Desarrollo"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
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
          onClick={onClose}
          aria-label="Cerrar visor"
        >
          Cerrar
        </button>

        <div className={styles.modalContent}>
          <PdfFlipbook />
        </div>
      </div>
    </div>
  );
}
