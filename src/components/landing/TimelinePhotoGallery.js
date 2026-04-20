"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import styles from "./TimelinePhotoGallery.module.css";

export default function TimelinePhotoGallery({
  title,
  galleryLabel = "Memoria fotografica",
  images = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const totalImages = images.length;

  const activeImage = useMemo(
    () => images[activeIndex] || images[0] || null,
    [activeIndex, images]
  );

  const goToPrevious = () => {
    setActiveIndex((current) => (current === 0 ? totalImages - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % totalImages);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, totalImages]);

  if (!images.length) {
    return null;
  }

  return (
    <>
      <div className={styles.galleryLauncher}>
        <div className={styles.galleryMeta}>
          <span className={styles.galleryKicker}>Memoria fotografica</span>
        </div>

        <button
          type="button"
          className={styles.galleryButton}
          onClick={() => {
            setActiveIndex(0);
            setIsOpen(true);
          }}
        >
          Ver galeria
        </button>
      </div>

      {isMounted && isOpen
        ? createPortal(
            <div
              className={styles.modalOverlay}
              role="dialog"
              aria-modal="true"
              aria-label={`Galeria de ${title}`}
              onClick={() => setIsOpen(false)}
            >
              <div
                className={styles.modal}
                onClick={(event) => event.stopPropagation()}
              >
                <div className={styles.modalHeader}>
                  <div className={styles.modalHeaderCopy}>
                    <p className={styles.modalKicker}>{galleryLabel}</p>
                    <h4 className={styles.modalTitle}>{title}</h4>
                  </div>

                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => setIsOpen(false)}
                    aria-label="Cerrar galeria"
                  >
                    x
                  </button>
                </div>

                {activeImage ? (
                  <div className={styles.heroMedia}>
                    <button
                      type="button"
                      className={`${styles.navButton} ${styles.navButtonLeft}`}
                      onClick={goToPrevious}
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>

                    <Image
                      src={activeImage.src}
                      alt={activeImage.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 70vw"
                      className={styles.heroImage}
                    />

                    <button
                      type="button"
                      className={`${styles.navButton} ${styles.navButtonRight}`}
                      onClick={goToNext}
                      aria-label="Imagen siguiente"
                    >
                      ›
                    </button>
                  </div>
                ) : null}

                {activeImage?.caption ? (
                  <p className={styles.heroCaption}>{activeImage.caption}</p>
                ) : null}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
