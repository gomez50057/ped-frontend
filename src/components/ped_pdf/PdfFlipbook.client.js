"use client";

import React, { useState, useEffect } from "react";
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

useEffect(() => {
  function handleResize() {
    if (typeof window === "undefined") return;

    const w = window.innerWidth;
    const h = window.innerHeight;       // 👈 alto del viewport
    const laptop = w >= 1024;
    setIsLaptop(laptop);

    let newPageWidth;

    if (laptop) {
      // En laptop/desktop: el LIBRO (2 páginas) usa ~80% del ancho
      newPageWidth = (w * 0.8) / 2;
    } else {
      // En móvil/tablet: una página usa ~90% del ancho
      newPageWidth = w * 0.9;
    }

    // No dejar que la página sea gigantesca en monitores enormes
    newPageWidth = Math.min(newPageWidth, 700);

    // Altura base por relación de aspecto
    const rawPageHeight = newPageWidth * ASPECT_RATIO;

    // 🔥 Máximo: 96% de la altura de la ventana
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
  }

  // Mientras no tenemos tamaño calculado
  if (!pageWidth || !pageHeight) {
    return (
      <section className={styles.section}>
        <h1 className={styles.title}>Catálogo PED – Flipbook</h1>
        <p className={styles.status}>Calculando tamaño del visor…</p>
      </section>
    );
  }

  // Truco:
  // - En laptop: wrapper = 2 * pageWidth  → 2 páginas visibles
  // - En móvil:  wrapper = 1 * pageWidth  → 1 página visible
  const wrapperWidth = isLaptop ? pageWidth * 2 : pageWidth;

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
          ) : (
            <div
              className={styles.bookWrapper}
              style={{ width: wrapperWidth, height: pageHeight }}
            >
              <HTMLFlipBook
                width={pageWidth}          // ancho de UNA página
                height={pageHeight}
                size="fixed"
                showCover={true}          // ✅ portada sola
                usePortrait={true}        // cambia a modo 1 página cuando el libro es “alto”
                maxShadowOpacity={0.3}
                mobileScrollSupport={true}
                className={styles.flipbook}
              >
                {Array.from({ length: numPages }, (_, index) => (
                  <BookPage
                    key={index + 1}
                    pageNumber={index + 1}
                    pageWidth={pageWidth}
                  />
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </Document>
      </div>
    </section>
  );
}
