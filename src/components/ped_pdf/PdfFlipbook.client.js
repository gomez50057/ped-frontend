"use client";

import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import styles from "./PdfFlipbook.module.css";

// Worker de pdf.js (misma versión que pdfjs-dist)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Relación alto/ancho aproximada del PED (A4 vertical)
const ASPECT_RATIO = 1.414; // alto = ancho * 1.414

const BookPage = React.forwardRef(function BookPage(
  { pageNumber, pageWidth },
  ref
) {
  return (
    <div ref={ref} className={styles.page}>
      <PdfPage
        pageNumber={pageNumber}
        width={pageWidth}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      />
    </div>
  );
});

export default function PdfFlipbookClient() {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [isLaptop, setIsLaptop] = useState(false);

  const [isFlipping, setIsFlipping] = useState(false);
  const [mode, setMode] = useState("cover"); // "cover" | "book" | "backCover"
  const [currentInteriorIndex, setCurrentInteriorIndex] = useState(0); // índice 0-based de páginas interiores
  const [bookStartIndex, setBookStartIndex] = useState(0); // para decidir desde dónde abre el flipbook

  const bookRef = useRef(null);

  // sonidos de pasar página (3 variantes)
  const flipSoundsRef = useRef([]);       // Array<Audio>
  const flipSoundIndexRef = useRef(0);    // para ir rotando
  const lastStateRef = useRef("read");

  // Pre-cargar sonidos solo en cliente
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sources = [
      "/audio/flip1.mp3",
      "/audio/flip2.mp3",
      "/audio/flip3.mp3",
    ];

    const audios = sources.map((src) => {
      const a = new Audio(src);
      a.volume = 0.5; // Volumen
      return a;
    });

    flipSoundsRef.current = audios;

    return () => {
      audios.forEach((a) => a.pause());
      flipSoundsRef.current = [];
    };
  }, []);

  const playFlipSound = () => {
    const arr = flipSoundsRef.current;
    if (!arr || arr.length === 0) return;

    const idx = flipSoundIndexRef.current % arr.length;
    const audio = arr[idx];

    flipSoundIndexRef.current = (idx + 1) % arr.length; // siguiente para la próxima vez

    try {
      audio.currentTime = 0;
      void audio.play();
    } catch {
      // ignoramos errores de autoplay
    }
  };

  // Calcula tamaño de página según viewport
  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const laptop = w >= 1024;
      setIsLaptop(laptop);

      let newPageWidth;

      if (laptop) {
        // En laptop/desktop: el LIBRO (2 páginas) usaría ~80% del ancho
        newPageWidth = (w * 0.8) / 2;
      } else {
        // En móvil/tablet: una página usa ~90% del ancho
        newPageWidth = w * 0.9;
      }

      // No dejar que la página sea gigantesca en pantallas enormes
      newPageWidth = Math.min(newPageWidth, 700);

      // Altura base por relación de aspecto
      const rawPageHeight = newPageWidth * ASPECT_RATIO;

      // Máximo: 96% de la altura de la ventana
      const maxPageHeight = h * 0.96;
      const newPageHeight = Math.min(rawPageHeight, maxPageHeight);

      setPageWidth(newPageWidth);
      setPageHeight(newPageHeight);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCurrentInteriorIndex(0);
    setBookStartIndex(0);
    setMode("cover"); // siempre arrancamos en portada
  }

  const totalPages = numPages || 0;
  const hasInteriorPages = totalPages > 2 ? totalPages - 2 : 0; // quitamos portada (1) y contra (N)

  // Navegación con teclado (cuando NO estamos en portada)
  useEffect(() => {
    if (!numPages) return;
    if (mode === "cover" && hasInteriorPages <= 0) return;

    function handleKeyDown(e) {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, numPages, currentInteriorIndex, hasInteriorPages]);

  // Evento al cambiar de hoja en el flipbook interior
  function handleFlip(e) {
    // e.data es el índice 0-based dentro del flipbook interior
    setCurrentInteriorIndex(e.data);
  }

  function handleChangeState(e) {
    const state = e.data; // "user_fold" | "fold_corner" | "flipping" | "read"

    // 🔊 reproducimos sonido cuando entra en estado "flipping"
    if (state === "flipping" && lastStateRef.current !== "flipping") {
      playFlipSound();
    }
    lastStateRef.current = state;

    if (state === "flipping" || state === "user_fold") {
      setIsFlipping(true);
    } else {
      setIsFlipping(false);
    }
  }

  const handlePrev = () => {
    if (mode === "book") {
      if (!bookRef.current) return;
      const api = bookRef.current.pageFlip?.();
      if (!api) return;

      if (currentInteriorIndex === 0) {
        // Estamos en la primera página interior → regresar a portada sola
        setMode("cover");
        playFlipSound(); // sonido al regresar a la portada
      } else {
        api.flipPrev();
        // el sonido lo dispara handleChangeState cuando entra a "flipping"
      }
    } else if (mode === "backCover") {
      // De contra-portada regresamos al libro (última interior)
      if (hasInteriorPages > 0) {
        setBookStartIndex(hasInteriorPages - 1);
        setMode("book");
        playFlipSound(); // sonido al re-abrir el libro desde la contra-portada
      } else {
        // Si no hay interiores, volvemos a portada
        setMode("cover");
        playFlipSound();
      }
    }
    // En "cover" no hacemos nada con prev
  };

  const handleNext = () => {
    if (mode === "cover") {
      // De portada → abrir libro en primera interior (página 2)
      if (hasInteriorPages > 0) {
        setBookStartIndex(0);
        setMode("book");
        playFlipSound(); // sonido al abrir el libro desde portada
      } else if (totalPages > 1) {
        // PDF de 2 páginas sin interiores: ir directo a contra-portada
        setMode("backCover");
        playFlipSound();
      }
    } else if (mode === "book") {
      if (!bookRef.current) return;
      const api = bookRef.current.pageFlip?.();
      if (!api) return;

      if (currentInteriorIndex === hasInteriorPages - 1) {
        // Última interior → contra-portada sola
        setMode("backCover");
        playFlipSound(); // sonido al ir a la contra-portada
      } else {
        api.flipNext();
        // el sonido lo dispara handleChangeState
      }
    } else if (mode === "backCover") {
      // De contra-portada hacia adelante: sin acción
    }
  };

  // Mientras no tenemos tamaño calculado
  if (!pageWidth || !pageHeight) {
    return (
      <section className={styles.section}>
        <h1 className={styles.title}>Catálogo PED – Flipbook</h1>
        <p className={styles.status}>Calculando tamaño del visor…</p>
      </section>
    );
  }

  // Para el libro abierto: 2 páginas en laptop, 1 en móvil
  const wrapperWidth = isLaptop ? pageWidth * 2 : pageWidth;

  // Página mostrada para el indicador, según el modo
  let currentDisplayPage = 1;
  if (mode === "cover") {
    currentDisplayPage = 1;
  } else if (mode === "book") {
    currentDisplayPage = currentInteriorIndex + 2; // interiores empiezan en la página 2 del PDF
  } else if (mode === "backCover") {
    currentDisplayPage = totalPages || 1;
  }

  const hasLoaded = !!numPages;

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Catálogo PED – Flipbook</h1>

      <div className={styles.viewer}>
        <Document
          file="/pdf/Actualización_PED_2025_2028.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<p className={styles.status}>Cargando PED…</p>}
          error={
            <p className={styles.statusError}>
              No se pudo cargar el archivo PED.
            </p>
          }
        >
          {!hasLoaded ? (
            <p className={styles.status}>Preparando páginas…</p>
          ) : totalPages === 1 ? (
            // PDF de 1 sola página: siempre portada centrada
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <PdfPage
                  pageNumber={1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </div>
          ) : mode === "cover" ? (
            // 1) PORTADA SOLA SIEMPRE en el centro (hoja única)
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <PdfPage
                  pageNumber={1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                <button
                  type="button"
                  className={styles.openButton}
                  onClick={handleNext}
                >
                  Abrir catálogo
                </button>
              </div>
            </div>
          ) : mode === "backCover" ? (
            // 2) CONTRA-PORTADA SOLA en el centro (hoja única)
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <PdfPage
                  pageNumber={totalPages}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
                {/* Flecha para volver al interior */}
                <button
                  type="button"
                  className={`${styles.navButton} ${styles.navButtonLeft}`}
                  onClick={handlePrev}
                  aria-label="Volver al interior"
                >
                  ‹
                </button>
              </div>
              {/* Indicador de página también aquí */}
              <div className={styles.pageIndicator}>
                Página {currentDisplayPage} de {totalPages}
              </div>
            </div>
          ) : hasInteriorPages > 0 ? (
            // 3) LIBRO ABIERTO: solo páginas interiores (2..N-1)
            <div
              className={styles.bookWrapper}
              style={{ width: wrapperWidth, height: pageHeight }}
            >
              <HTMLFlipBook
                key={bookStartIndex}
                ref={bookRef}
                width={pageWidth}
                height={pageHeight}
                size="fixed"
                showCover={false}
                usePortrait={true}
                flippingTime={1200}
                drawShadow={true}
                maxShadowOpacity={0.7}
                showPageCorners={true}
                swipeDistance={20}
                useMouseEvents={true}
                mobileScrollSupport={true}
                startPage={bookStartIndex}
                className={`${styles.flipbook} ${isFlipping ? styles.flipbookFlipping : ""
                  }`}
                onFlip={handleFlip}
                onChangeState={handleChangeState}
              >
                {Array.from({ length: hasInteriorPages }, (_, index) => (
                  <BookPage
                    key={index + 2}
                    pageNumber={index + 2} // páginas 2..numPages-1 del PDF
                    pageWidth={pageWidth}
                  />
                ))}
              </HTMLFlipBook>

              {/* Controles de navegación dentro del libro */}
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={handlePrev}
                aria-label="Página anterior / Portada"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={handleNext}
                aria-label="Página siguiente / Contra-portada"
              >
                ›
              </button>

              {/* Indicador de página */}
              <div className={styles.pageIndicator}>
                Página {currentDisplayPage} de {totalPages}
              </div>
            </div>
          ) : (
            // Caso raro: hay más de 1 página pero sin interiores (ej. 2 páginas)
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <PdfPage
                  pageNumber={1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </div>
          )}
        </Document>
      </div>
    </section>
  );
}
