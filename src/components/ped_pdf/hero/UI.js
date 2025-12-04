// components/UI.jsx
"use client";

import { atom, useAtom } from "jotai";
import { useEffect, useRef, useCallback } from "react";
import styles from "./UI.module.css";

const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
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

/**
 * showOnlyEnds = true  -> solo Portada / Contraportada
 * showOnlyEnds = false -> todas las páginas
 */
export const UI = ({ showOnlyEnds = false }) => {
  const [page, setPage] = useAtom(pageAtom);

  // referencia al audio
  const audioRef = useRef(null);

  // Crear el audio solo una vez cuando el componente se monta en el cliente
  useEffect(() => {
    if (typeof window === "undefined") return;
    audioRef.current = new Audio("/audio/page-flip-01a.mp3");
  }, []);

  // función para reproducir el audio SOLO cuando el usuario hace click
  const playFlipSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.currentTime = 0;
      audio.play().catch(() => { });
    } catch {
      // ignoramos errores de autoplay
    }
  }, []);

  const handleChangePage = (nextPage) => {
    if (nextPage === page) return;
    setPage(nextPage);
    playFlipSound();
  };

  return (
    <>
      {/* Barra inferior con botones de páginas */}
      <div className={styles.uiRoot} aria-label="Navegación del libro PED">
        <nav
          className={styles.controlsOuter}
          aria-label="Páginas del libro del Plan Estatal de Desarrollo"
        >
          <div className={styles.controlsScroller}>
            {showOnlyEnds ? (
              <>
                {/* Solo portada */}
                <button
                  type="button"
                  className={`${styles.pageButton} ${page === 0 ? styles.pageButtonActive : ""
                    }`}
                  onClick={() => handleChangePage(0)}
                >
                  Portada
                </button>

                {/* Solo contraportada (página virtual = pages.length) */}
                <button
                  type="button"
                  className={`${styles.pageButton} ${page === pages.length ? styles.pageButtonActive : ""
                    }`}
                  onClick={() => handleChangePage(pages.length)}
                >
                  Contraportada
                </button>
              </>
            ) : (
              <>
                {/* Todas las páginas */}
                {pages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.pageButton} ${index === page ? styles.pageButtonActive : ""
                      }`}
                    onClick={() => handleChangePage(index)}
                  >
                    {index === 0 ? "Portada" : `Página ${index}`}
                  </button>
                ))}

                <button
                  type="button"
                  className={`${styles.pageButton} ${page === pages.length ? styles.pageButtonActive : ""
                    }`}
                  onClick={() => handleChangePage(pages.length)}
                >
                  Contraportada
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Cinta de texto horizontal */}
      <div
        className={styles.tickerRoot}
        aria-label="Frases clave del Plan Estatal de Desarrollo"
      >
        <div className={styles.tickerInner}>
          {/* Fila 1 */}
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

          {/* Fila 2 (clon) */}
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
