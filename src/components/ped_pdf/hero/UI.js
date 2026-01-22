"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useRef, useCallback } from "react";
import styles from "./UI.module.css";

const pictures = [
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "C10",
];

export const pageAtom = atom(0);

// Definición de páginas del libro
export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];

for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

const MIN_PAGE = 0;
const MAX_PAGE = pages.length; // índice especial para "Contraportada"
const FLIP_LOCK_MS = 600; // bloqueo corto para evitar bug visual al spamear

// Lock global de flip (compartido con Book)
export const flipLockAtom = atom(false);

// Timeout a nivel módulo para no acumular temporizadores
let flipLockTimeoutId = null;

/**
 * Atom controlador:
 *  - read: { page, isFlipLocked }
 *  - write: targetPage => hace clamp + respeta lock + activa/desactiva lock
 */
export const pageControllerAtom = atom(
  (get) => ({
    page: get(pageAtom),
    isFlipLocked: get(flipLockAtom),
  }),
  (get, set, targetPage) => {
    const currentPage = get(pageAtom);
    const isFlipLocked = get(flipLockAtom);

    const clampedTarget = Math.max(MIN_PAGE, Math.min(MAX_PAGE, targetPage));

    // Si ya está bloqueado o la página es la misma, no hacemos nada
    if (isFlipLocked) return;
    if (clampedTarget === currentPage) return;

    // Activar lock y cambiar página global
    set(flipLockAtom, true);
    set(pageAtom, clampedTarget);

    // Liberar lock tras un tiempo aproximado al flip 3D
    if (typeof window !== "undefined") {
      if (flipLockTimeoutId) {
        window.clearTimeout(flipLockTimeoutId);
      }
      flipLockTimeoutId = window.setTimeout(() => {
        set(flipLockAtom, false);
        flipLockTimeoutId = null;
      }, FLIP_LOCK_MS);
    } else {
      // SSR / fallback
      set(flipLockAtom, false);
    }
  }
);

/**
 * showOnlyEnds = true  -> solo Portada / Contraportada
 * showOnlyEnds = false -> todas las páginas
 */
export const UI = ({ showOnlyEnds = false }) => {
  // Ahora usamos el atom controlador (página + lock)
  const [{ page, isFlipLocked }, setControlledPage] = useAtom(pageControllerAtom);

  const audioRef = useRef(null);
  const prevPageRef = useRef(page);

  // Cargar audio una sola vez en cliente
  useEffect(() => {
    if (typeof window === "undefined") return;
    audioRef.current = new Audio("/audio/page-flip-01a.mp3");
  }, []);

  // Sonido de pasar página (se dispara en un efecto, no en cada handler)
  const playFlipSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // ignoramos errores de autoplay
      });
    } catch {
      // silenciosamente
    }
  }, []);

  // Cada vez que cambie `page`, reproducir sonido (botón o clic en el libro)
  useEffect(() => {
    if (prevPageRef.current === page) return; // primera vez o sin cambios
    prevPageRef.current = page;
    playFlipSound();
  }, [page, playFlipSound]);

  // Función central para solicitar cambio de página (usa el write del atom)
  const requestPageChange = useCallback(
    (targetPage) => {
      setControlledPage(targetPage);
    },
    [setControlledPage]
  );

  // helpers para siguiente / anterior
  const handlePrev = () => {
    setControlledPage(page - 1);
  };

  const handleNext = () => {
    setControlledPage(page + 1);
  };

  // helper de clases para botón activo
  const getPageButtonClass = useCallback(
    (targetPage) =>
      `${styles.pageButton} ${
        page === targetPage ? styles.pageButtonActive : ""
      }`,
    [page]
  );

  // Scroll suave con easing
  const animateScrollTo = (targetY, duration = 1400) => {
    if (typeof window === "undefined") return;

    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (timestamp) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutQuad(progress);

      window.scrollTo(0, startY + distance * eased);

      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  // Scroll hasta el visor PDF (PdfFlipbook)
  const handleScrollToDocument = useCallback(() => {
    if (typeof window === "undefined") return;

    const target =
      document.getElementById("pdf-viewer") ||
      document.querySelector('[data-ped-viewer="true"]') ||
      document.querySelector(".viewer");

    if (!target) return;

    const rect = target.getBoundingClientRect();
    const headerOffset = 10;
    const targetY = rect.top + window.scrollY - headerOffset;

    animateScrollTo(targetY, 1400);
  }, []);

  return (
    <>
      {/* Barra inferior: botón + navegación de páginas */}
      <div className={styles.uiRoot} aria-label="Navegación del libro PED">
        <nav
          className={styles.controlsOuter}
          aria-label="Páginas del libro del Plan Estatal de Desarrollo"
        >
          <div className={styles.controlsScroller}>
            {/* Botón "Leer el documento" */}
            <button
              type="button"
              className={styles.readmoreBtn}
              onClick={handleScrollToDocument}
            >
              <span className={styles.readmoreText}>Leer el documento</span>

              <span className={styles.bookWrapper}>
                {/* Libro base */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 126 75"
                  className={styles.bookIcon}
                >
                  <rect
                    strokeWidth={3}
                    stroke="#fff"
                    rx="7.5"
                    height={70}
                    width={121}
                    y="2.5"
                    x="2.5"
                  />
                  <line
                    strokeWidth={3}
                    stroke="#fff"
                    y2={75}
                    x2="63.5"
                    x1="63.5"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth={4}
                    stroke="#fff"
                    d="M25 20H50"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth={4}
                    stroke="#fff"
                    d="M101 20H76"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth={4}
                    stroke="#fff"
                    d="M16 30L50 30"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth={4}
                    stroke="#fff"
                    d="M110 30L76 30"
                  />
                </svg>

                {/* Página animada */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 65 75"
                  fill="none"
                  className={styles.bookPage}
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth={4}
                    stroke="#fff"
                    d="M40 20H15"
                  />
                  <path
                    strokeLinecap="round"
                    strokeWidth={4}
                    stroke="#fff"
                    d="M49 30L15 30"
                  />
                  <path
                    strokeWidth={3}
                    stroke="#fff"
                    d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"
                  />
                </svg>
              </span>
            </button>

            {/* Botón Anterior */}
            <button
              type="button"
              className={styles.pageButtonNav}
              onClick={handlePrev}
            >
              ⟨ Anterior
            </button>

            {/* Botones de páginas */}
            {showOnlyEnds ? (
              <>
                <button
                  type="button"
                  className={getPageButtonClass(0)}
                  onClick={() => requestPageChange(0)}
                >
                  Portada
                </button>
                <button
                  type="button"
                  className={getPageButtonClass(MAX_PAGE)}
                  onClick={() => requestPageChange(MAX_PAGE)}
                >
                  Contraportada
                </button>
              </>
            ) : (
              <>
                {pages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={getPageButtonClass(index)}
                    onClick={() => requestPageChange(index)}
                  >
                    {index === 0 ? "Portada" : `Página ${index}`}
                  </button>
                ))}

                <button
                  type="button"
                  className={getPageButtonClass(MAX_PAGE)}
                  onClick={() => requestPageChange(MAX_PAGE)}
                >
                  Contraportada
                </button>
              </>
            )}

            {/* Botón Siguiente */}
            <button
              type="button"
              className={styles.pageButtonNav}
              onClick={handleNext}
            >
              Siguiente ⟩
            </button>
          </div>
        </nav>
      </div>

      {/* Cinta de texto horizontal (ticker infinito) */}
      <div
        className={styles.tickerRoot}
        aria-label="Frases clave del Plan Estatal de Desarrollo"
      >
        <div className={styles.tickerInner}>
          <div className={styles.tickerRow}>
            <h1 className={`${styles.tickerTitle} ${styles.bold}`}>
              Actualización del Plan Estatal de Desarrollo 2025-2028
            </h1>
            <h2 className={styles.tickerSubtitle}>
              Planeación estatal con visión de largo plazo
            </h2>
            <h2 className={`${styles.tickerHuge} ${styles.bold}`}>
              Prioridades y metas claras
            </h2>
            <h2 className={`${styles.bold} ${styles.outline}`}>
              Bienestar y desarrollo para Hidalgo
            </h2>
            <h2 className={styles.tickerMedium}>
              Toma de decisiones con rumbo claro
            </h2>
            <h2 className={styles.tickerLight}>
              Escuchando a todas las personas
            </h2>
            <h2 className={`${styles.tickerHuge} ${styles.bold}`}>
              Estado · Municipios · Pueblo
            </h2>
            <h2 className={`${styles.bold} ${styles.outline}`}>
              Instrumento rector de la planeación
            </h2>
          </div>

          {/* Clon para efecto infinito */}
          <div className={`${styles.tickerRow} ${styles.tickerRowClone}`}>
            <h1 className={`${styles.tickerTitle} ${styles.bold}`}>
              Actualización del Plan Estatal de Desarrollo 2025-2028
            </h1>
            <h2 className={styles.tickerSubtitle}>
              Planeación estatal con visión de largo plazo
            </h2>
            <h2 className={`${styles.tickerHuge} ${styles.bold}`}>
              Prioridades y metas claras
            </h2>
            <h2 className={`${styles.bold} ${styles.outline}`}>
              Bienestar y desarrollo para Hidalgo
            </h2>
            <h2 className={styles.tickerMedium}>
              Toma de decisiones con rumbo claro
            </h2>
            <h2 className={styles.tickerLight}>
              Escuchando a todas las personas
            </h2>
            <h2 className={`${styles.tickerHuge} ${styles.bold}`}>
              Estado · Municipios · Pueblo
            </h2>
            <h2 className={`${styles.bold} ${styles.outline}`}>
              Instrumento rector de la planeación
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
