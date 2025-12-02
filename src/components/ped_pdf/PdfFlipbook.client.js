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
  const [currentLeaf, setCurrentLeaf] = useState(0); // índice interno del flipbook (0-based)
  const [hasOpened, setHasOpened] = useState(false); // ⬅️ ¿ya abrimos el libro?

  const bookRef = useRef(null);

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

  // Navegación con teclado SOLO cuando el libro ya está abierto
  useEffect(() => {
    if (!hasOpened || !numPages) return;

    function handleKeyDown(e) {
      if (!bookRef.current) return;
      const api = bookRef.current.pageFlip?.();
      if (!api) return;

      if (e.key === "ArrowRight") {
        api.flipNext();
      } else if (e.key === "ArrowLeft") {
        api.flipPrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasOpened, numPages]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCurrentLeaf(0);
  }

  // Evento al cambiar de hoja en el flipbook interior
  function handleFlip(e) {
    // e.data es el índice de la "hoja" interna (0-based)
    setCurrentLeaf(e.data);
  }

  function handleChangeState(e) {
    const state = e.data; // "user_fold" | "fold_corner" | "flipping" | "read"
    if (state === "flipping" || state === "user_fold") {
      setIsFlipping(true);
    } else {
      setIsFlipping(false);
    }
  }

  const handlePrev = () => {
    if (!bookRef.current) return;
    const api = bookRef.current.pageFlip?.();
    api?.flipPrev();
  };

  const handleNext = () => {
    if (!bookRef.current) return;
    const api = bookRef.current.pageFlip?.();
    api?.flipNext();
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

  // Páginas interiores (saltamos la portada = página 1 del PDF)
  const totalInteriorPages = Math.max((numPages || 0) - 1, 0);

  // Página mostrada para el indicador
  const currentDisplayPage = hasOpened
    ? Math.min(currentLeaf + 2, numPages || 1) // +2 porque empezamos en la página 2 del PDF
    : 1;

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
          {!numPages ? (
            <p className={styles.status}>Preparando páginas…</p>
          ) : !hasOpened ? (
            // 🔥 1) VISTA INICIAL: SOLO PORTADA CENTRADA
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
                  onClick={() => setHasOpened(true)}
                >
                  Abrir catálogo
                </button>
              </div>
            </div>
          ) : totalInteriorPages > 0 ? (
            // 🔥 2) LIBRO ABIERTO: 2 HOJAS EN LAPTOP
            <div
              className={styles.bookWrapper}
              style={{ width: wrapperWidth, height: pageHeight }}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={pageWidth} // ancho de UNA página
                height={pageHeight}
                size="fixed"
                showCover={false}      // interior: ya no hay portada
                usePortrait={true}
                flippingTime={1200}
                drawShadow={true}
                maxShadowOpacity={0.7}
                showPageCorners={true}
                swipeDistance={20}
                useMouseEvents={true}
                mobileScrollSupport={true}
                startPage={0}          // empezamos en la página 2 del PDF (índice 0 del interior)
                className={`${styles.flipbook} ${
                  isFlipping ? styles.flipbookFlipping : ""
                }`}
                onFlip={handleFlip}
                onChangeState={handleChangeState}
              >
                {Array.from({ length: totalInteriorPages }, (_, index) => (
                  <BookPage
                    key={index + 2}
                    pageNumber={index + 2} // páginas 2..numPages del PDF
                    pageWidth={pageWidth}
                  />
                ))}
              </HTMLFlipBook>

              {/* Controles de navegación */}
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={handlePrev}
                aria-label="Página anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={handleNext}
                aria-label="Página siguiente"
              >
                ›
              </button>

              {/* Indicador de página */}
              <div className={styles.pageIndicator}>
                Página {currentDisplayPage} de {numPages}
              </div>
            </div>
          ) : (
            // Caso extremo: PDF de solo 1 página
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
