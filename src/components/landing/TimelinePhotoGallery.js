"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [transitionDirection, setTransitionDirection] = useState("next");
  const [imageOrientation, setImageOrientation] = useState("landscape");
  const [isMounted, setIsMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);
  const scrollYRef = useRef(0);
  const totalImages = images.length;

  const activeImage = useMemo(
    () => images[activeIndex] || images[0] || null,
    [activeIndex, images]
  );

  const goToPrevious = () => {
    setTransitionDirection("previous");
    setActiveIndex((current) => (current === 0 ? totalImages - 1 : current - 1));
  };

  const goToNext = () => {
    setTransitionDirection("next");
    setActiveIndex((current) => (current + 1) % totalImages);
  };

  const handleImageLoad = (event) => {
    const image = event.currentTarget;

    if (image.naturalHeight > image.naturalWidth) {
      setImageOrientation("portrait");
    } else if (image.naturalWidth > image.naturalHeight) {
      setImageOrientation("landscape");
    } else {
      setImageOrientation("square");
    }
  };

  useEffect(() => {
    setIsMounted(true);
    setPortalContainer(
      document.querySelector(".home-theme-scope") || document.body
    );
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    scrollYRef.current = window.scrollY;

    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    };
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.setAttribute("data-timeline-gallery-open", "true");
    window.dispatchEvent(
      new CustomEvent("ped-viewer-toggle", { detail: { open: true } })
    );

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

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
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.removeAttribute("data-timeline-gallery-open");
      window.dispatchEvent(
        new CustomEvent("ped-viewer-toggle", { detail: { open: false } })
      );

      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.left = previousBodyStyles.left;
      document.body.style.right = previousBodyStyles.right;
      document.body.style.width = previousBodyStyles.width;
      window.scrollTo(0, scrollYRef.current);
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
            setTransitionDirection("next");
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

                    <div
                      key={`${activeImage.src}-${activeIndex}`}
                      className={`${styles.heroImageFrame} ${
                        imageOrientation === "portrait"
                          ? styles.heroImageFramePortrait
                          : imageOrientation === "square"
                            ? styles.heroImageFrameSquare
                            : styles.heroImageFrameLandscape
                      } ${
                        transitionDirection === "previous"
                          ? styles.heroImageFramePrevious
                          : styles.heroImageFrameNext
                      }`}
                    >
                      <Image
                        src={activeImage.src}
                        alt={activeImage.alt}
                        fill
                        sizes="(max-width: 900px) 100vw, 70vw"
                        className={styles.heroImage}
                        onLoad={handleImageLoad}
                      />
                    </div>

                    <div className={styles.photoCounter} aria-live="polite">
                      {activeIndex + 1} de {totalImages}
                    </div>

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

             
              </div>
            </div>,
            portalContainer || document.body
          )
        : null}
    </>
  );
}
