"use client";

import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import styles from "./PdfFlipbook.module.css";

/**
 * ============================================
 * CONFIGURACIÓN GENERAL
 * ============================================
 */

// Fuente única del PDF (evita duplicar strings en Document y en Descargar)
const PDF_FILE = "/pdf/Actualizacion_PED_2025_2028.pdf";
const PDF_DOWNLOAD_NAME = "Actualizacion_PED_2025_2028.pdf";

// Worker de pdf.js (misma versión que pdfjs-dist)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Relación alto/ancho aproximada del PED (A4 vertical)
const ASPECT_RATIO = 1.414; // alto = ancho * 1.414

// Parámetros de la lupa
const LENS_SIZE = 200; // diámetro en px
const LENS_ZOOM = 2; // factor de zoom

// Tiempo de bloqueo de interacciones tras cada flip
const FLIP_LOCK_MS = 900;

/**
 * ============================================
 * COMPONENTE DE PÁGINA PARA FLIPBOOK
 * - Incluye lupa (limitada a laptop desde el padre)
 * - Optimiza eventos de movimiento con requestAnimationFrame
 * - Ajusta límites para que la lupa no se salga del contenedor
 * ============================================
 */
const BookPage = React.forwardRef(function BookPage(
  { pageNumber, pageWidth, enableMagnifier = false },
  forwardedRef
) {
  const localRef = useRef(null);

  // Posición del cursor dentro de la página (coordenadas locales)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);

  // Throttle con requestAnimationFrame para evitar re-render por cada pixel de movimiento
  const rafIdRef = useRef(null);
  const pendingPosRef = useRef(null);

  const setRefs = (node) => {
    localRef.current = node;
    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  // Limpieza del RAF al desmontar
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const scheduleLensPosUpdate = (pos) => {
    pendingPosRef.current = pos;
    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      if (pendingPosRef.current) {
        setLensPos(pendingPosRef.current);
      }
    });
  };

  /**
   * Nota: usamos Pointer Events para que funcione bien en distintos dispositivos.
   * Aunque la lupa la limitamos a laptop, Pointer Events sigue siendo correcto.
   */
  const handleMove = (e) => {
    if (!enableMagnifier || !localRef.current) return;

    const rect = localRef.current.getBoundingClientRect();

    // Coordenadas locales dentro de la página
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    /**
     * Clamp VISUAL: aseguramos que el centro de la lupa no acerque el borde fuera del contenedor.
     * Esto evita que la lupa “se corte” en el borde de la página.
     */
    const minLensCenterX = LENS_SIZE / 2;
    const maxLensCenterX = rect.width - LENS_SIZE / 2;
    const minLensCenterY = LENS_SIZE / 2;
    const maxLensCenterY = rect.height - LENS_SIZE / 2;

    x = Math.max(minLensCenterX, Math.min(maxLensCenterX, x));
    y = Math.max(minLensCenterY, Math.min(maxLensCenterY, y));

    scheduleLensPosUpdate({ x, y });
  };

  const handleEnter = () => {
    if (!enableMagnifier) return;
    setShowLens(true);
  };

  const handleLeave = () => {
    if (!enableMagnifier) return;
    setShowLens(false);
  };

  /**
   * Offset para que el punto (x,y) quede en el centro de la lupa.
   * Estamos renderizando una “copia” de la página escalada dentro de la lupa.
   */
  const offsetLeft = LENS_SIZE / 2 - lensPos.x * LENS_ZOOM;
  const offsetTop = LENS_SIZE / 2 - lensPos.y * LENS_ZOOM;

  return (
    <div
      ref={setRefs}
      className={styles.page}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      {/* Página “normal” */}
      <PdfPage
        pageNumber={pageNumber}
        width={pageWidth}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        /**
         * devicePixelRatio=1 reduce el costo de render en algunos equipos
         * (puedes subirlo a 1.5 si quieres más nitidez).
         */
        devicePixelRatio={1}
      />

      {/* Lupa (solo si enableMagnifier y el puntero está dentro) */}
      {enableMagnifier && showLens && (
        <div
          className={styles.magnifier}
          style={{
            width: `${LENS_SIZE}px`,
            height: `${LENS_SIZE}px`,
            left: `${lensPos.x - LENS_SIZE / 2}px`,
            top: `${lensPos.y - LENS_SIZE / 2}px`,
            /**
             * Importante: que la lupa NO capture eventos para no interferir
             * con la detección del movimiento.
             */
            pointerEvents: "none",
          }}
        >
          <div
            className={styles.magnifierInner}
            style={{
              transform: `scale(${LENS_ZOOM})`,
              transformOrigin: "top left",
              left: `${offsetLeft}px`,
              top: `${offsetTop}px`,
            }}
          >
            <PdfPage
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              devicePixelRatio={1}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default function PdfFlipbookClient() {
  /**
   * ============================================
   * STATE PRINCIPAL
   * ============================================
   */
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [isLaptop, setIsLaptop] = useState(false);

  const [isFlipping, setIsFlipping] = useState(false);
  const [mode, setMode] = useState("cover"); // "cover" | "book" | "backCover"
  const [currentInteriorIndex, setCurrentInteriorIndex] = useState(0); // índice 0-based de páginas interiores
  const [bookStartIndex, setBookStartIndex] = useState(0); // desde dónde abre el flipbook

  // Lupa ON/OFF (preferencia del usuario). Efectiva solo en laptop.
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);

  // Sonido
  const [isMuted, setIsMuted] = useState(false);

  const bookRef = useRef(null);

  // sonidos de pasar página (3 variantes)
  const flipSoundsRef = useRef([]); // Array<Audio>
  const flipSoundIndexRef = useRef(0); // para ir rotando
  const lastStateRef = useRef("read");

  // Lock para evitar spam de clics durante la animación
  const [isFlipLocked, setIsFlipLocked] = useState(false);
  const flipLockTimeoutRef = useRef(null);

  /**
   * ============================================
   * UTILIDADES
   * ============================================
   */

  const toggleMute = () => setIsMuted((prev) => !prev);

  // Evita capturar flechas cuando el usuario está escribiendo en inputs (UX)
  const isTypingTarget = (el) => {
    if (!el) return false;
    const tag = el.tagName?.toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      el.isContentEditable
    );
  };

  /**
   * ============================================
   * EFECTOS DE CICLO DE VIDA
   * ============================================
   */

  // Limpieza del timeout al desmontar
  useEffect(() => {
    return () => {
      if (flipLockTimeoutRef.current) {
        clearTimeout(flipLockTimeoutRef.current);
      }
    };
  }, []);

  // Pre-cargar sonidos solo en cliente
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sources = ["/audio/flip1.mp3", "/audio/flip2.mp3", "/audio/flip3.mp3"];

    const audios = sources.map((src) => {
      const a = new Audio(src);
      a.volume = 0.5;
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
    if (isMuted) return;

    const idx = flipSoundIndexRef.current % arr.length;
    const audio = arr[idx];
    flipSoundIndexRef.current = (idx + 1) % arr.length;

    try {
      audio.currentTime = 0;
      void audio.play();
    } catch {
      // Algunos navegadores bloquean autoplay sin interacción: no es crítico.
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
        // En laptop/desktop: el LIBRO (2 páginas) ~80% del ancho total
        newPageWidth = (w * 0.8) / 2;
      } else {
        // En móvil/tablet: una página ~90% del ancho
        newPageWidth = w * 0.9;
      }

      // Límite superior para no “inflar” en pantallas enormes
      newPageWidth = Math.min(newPageWidth, 700);

      // Altura por relación de aspecto
      const rawPageHeight = newPageWidth * ASPECT_RATIO;

      // Máximo: 96% de altura de ventana
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

  // Navegación con teclado (cuando hay contenido navegable)
  useEffect(() => {
    if (!numPages) return;

    function handleKeyDown(e) {
      if (isFlipLocked) return;
      if (isTypingTarget(document.activeElement)) return;

      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, numPages, currentInteriorIndex, hasInteriorPages, isFlipLocked]);

  // Evento al cambiar de hoja en el flipbook interior
  function handleFlip(e) {
    // e.data es el índice 0-based dentro del flipbook interior
    setCurrentInteriorIndex(e.data);
  }

  function handleChangeState(e) {
    const state = e.data; // "user_fold" | "fold_corner" | "flipping" | "read"

    // Sonido al entrar a estado "flipping" (no duplicar si ya estaba flipping)
    if (state === "flipping" && lastStateRef.current !== "flipping") {
      playFlipSound();
    }
    lastStateRef.current = state;

    if (state === "flipping" || state === "user_fold") {
      setIsFlipping(true);

      // Bloquear interacciones mientras dura la animación
      setIsFlipLocked(true);

      if (typeof window !== "undefined") {
        if (flipLockTimeoutRef.current) clearTimeout(flipLockTimeoutRef.current);

        flipLockTimeoutRef.current = window.setTimeout(() => {
          setIsFlipLocked(false);
        }, FLIP_LOCK_MS);
      }
    } else {
      setIsFlipping(false);
      // El lock se libera por timeout, no aquí (evita flicker)
    }
  }

  const handlePrev = () => {
    if (isFlipLocked) return;

    if (mode === "book") {
      if (!bookRef.current) return;
      const api = bookRef.current.pageFlip?.();
      if (!api) return;

      if (currentInteriorIndex === 0) {
        // Primera interior → regresar a portada
        setMode("cover");
        playFlipSound();
      } else {
        api.flipPrev();
      }
    } else if (mode === "backCover") {
      // Contra → volver al libro (última interior)
      if (hasInteriorPages > 0) {
        setBookStartIndex(hasInteriorPages - 1);
        setMode("book");
        playFlipSound();
      } else {
        setMode("cover");
        playFlipSound();
      }
    }
  };

  const handleNext = () => {
    if (isFlipLocked) return;

    if (mode === "cover") {
      // Portada → abrir libro en primera interior
      if (hasInteriorPages > 0) {
        setBookStartIndex(0);
        setMode("book");
        playFlipSound();
      } else if (totalPages > 1) {
        // PDF de 2 páginas sin interiores → contra
        setMode("backCover");
        playFlipSound();
      }
    } else if (mode === "book") {
      if (!bookRef.current) return;
      const api = bookRef.current.pageFlip?.();
      if (!api) return;

      if (currentInteriorIndex === hasInteriorPages - 1) {
        // Última interior → contra
        setMode("backCover");
        playFlipSound();
      } else {
        api.flipNext();
      }
    }
  };

  /**
   * ============================================
   * EARLY RETURN (mientras se calcula tamaño)
   * ============================================
   */
  if (!pageWidth || !pageHeight) {
    return (
      <section className={styles.section}>
        <h1 className={styles.title}>Catálogo PED</h1>
        <p className={styles.status}>Calculando tamaño del visor…</p>
      </section>
    );
  }

  /**
   * ============================================
   * DERIVADOS PARA RENDER
   * ============================================
   */

  // En laptop: el wrapper del libro será el doble; en móvil una página
  const wrapperWidth = isLaptop ? pageWidth * 2 : pageWidth;

  // Página mostrada para el indicador, según el modo
  let currentDisplayPage = 1;
  if (mode === "cover") currentDisplayPage = 1;
  else if (mode === "book") currentDisplayPage = currentInteriorIndex + 2; // interiores empiezan en la 2
  else if (mode === "backCover") currentDisplayPage = totalPages || 1;

  const hasLoaded = !!numPages;

  // Limitar la lupa a laptop únicamente (requisito)
  const magnifierEffective = magnifierEnabled && isLaptop;

  // Efecto visual del grosor (solo en libro)
  let leftStackCount = 0;
  let rightStackCount = 0;

  if (mode === "book" && totalPages > 0) {
    leftStackCount = currentDisplayPage;
    rightStackCount = Math.max(0, totalPages - currentDisplayPage - 1);
  }

  const leftStackRatio =
    totalPages > 0 ? Math.min(1, leftStackCount / totalPages) : 0;
  const rightStackRatio =
    totalPages > 0 ? Math.min(1, rightStackCount / totalPages) : 0;

  return (
    <section className={styles.section}>
      <div className={styles.viewer} id="pdf-viewer" data-ped-viewer="true">
        <Document
          file={PDF_FILE}
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
            // PDF de 1 sola página
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <BookPage
                  pageNumber={1}
                  pageWidth={pageWidth}
                  enableMagnifier={magnifierEffective}
                />
              </div>
            </div>
          ) : mode === "cover" ? (
            // 1) PORTADA (hoja única)
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <BookPage
                  pageNumber={1}
                  pageWidth={pageWidth}
                  enableMagnifier={magnifierEffective}
                />
                <button
                  type="button"
                  className={styles.openButton}
                  onClick={handleNext}
                  disabled={isFlipLocked}
                  aria-disabled={isFlipLocked}
                >
                  Abrir catálogo
                </button>
              </div>
            </div>
          ) : mode === "backCover" ? (
            // 2) CONTRA-PORTADA (hoja única)
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <BookPage
                  pageNumber={totalPages}
                  pageWidth={pageWidth}
                  enableMagnifier={magnifierEffective}
                />
                <button
                  type="button"
                  className={`${styles.navButton} ${styles.navButtonLeft}`}
                  onClick={handlePrev}
                  aria-label="Volver al interior"
                  disabled={isFlipLocked}
                  aria-disabled={isFlipLocked}
                >
                  ‹
                </button>
              </div>
              <div className={styles.pageIndicator}>
                Página {currentDisplayPage} de {totalPages}
              </div>
            </div>
          ) : hasInteriorPages > 0 ? (
            // 3) LIBRO ABIERTO: interiores (2..N-1)
            <div
              className={`${styles.bookWrapper} ${isFlipping ? styles.bookWrapperFlipping : ""
                }`}
              style={{
                width: wrapperWidth,
                height: pageHeight,
                "--stack-left": leftStackRatio,
                "--stack-right": rightStackRatio,
                pointerEvents: isFlipLocked ? "none" : "auto",
              }}
            >
              <HTMLFlipBook
                key={bookStartIndex}
                ref={bookRef}
                width={pageWidth}
                height={pageHeight}
                size="fixed"
                showCover={false}
                /**
                 * Mejora clave:
                 * - En laptop queremos “book view” (2 páginas).
                 * - En móvil/tablet queremos “portrait” (1 página).
                 */
                usePortrait={!isLaptop}
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
                    enableMagnifier={magnifierEffective}
                  />
                ))}
              </HTMLFlipBook>

              {/* Controles de navegación dentro del libro */}
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={handlePrev}
                aria-label="Página anterior / Portada"
                disabled={isFlipLocked}
                aria-disabled={isFlipLocked}
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={handleNext}
                aria-label="Página siguiente / Contra-portada"
                disabled={isFlipLocked}
                aria-disabled={isFlipLocked}
              >
                ›
              </button>

              <div className={styles.pageIndicator}>
                Página {currentDisplayPage} de {totalPages}
              </div>
            </div>
          ) : (
            // Caso raro: 2 páginas sin interiores
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <BookPage
                  pageNumber={1}
                  pageWidth={pageWidth}
                  enableMagnifier={magnifierEffective}
                />
              </div>
            </div>
          )}
        </Document>

        {/* Barra de controles: Lupa + Sonido + Descargar */}
        <div className={styles.controlsBar}>
          <div className={styles.controlsGroup}>
            <button
              type="button"
              className={`${styles.iconButton} ${magnifierEffective ? styles.iconButtonActive : ""
                }`}
              onClick={() => setMagnifierEnabled((v) => !v)}
              aria-pressed={magnifierEffective}
              /**
               * Requisito: la lupa solo funciona en laptop.
               * Por UX, deshabilitamos el botón en pantallas no-laptop.
               */
              disabled={!isLaptop}
              title={
                !isLaptop
                  ? "La lupa solo está disponible en laptop/desktop."
                  : "Activar/desactivar lupa"
              }
            >
              {magnifierEffective ? "🔍 Lupa ON" : "🔍 Lupa OFF"}
            </button>
          </div>

          <button
            type="button"
            className={`${styles.iconButton} ${isMuted ? styles.iconButtonMuted : ""
              }`}
            onClick={toggleMute}
            aria-pressed={isMuted}
            aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
          >
            {isMuted ? "🔇 Sonido" : "🔊 Sonido"}
          </button>

          {/* Descargar PED */}
          <a
            className={styles.iconButton}
            href={PDF_FILE}
            download={PDF_DOWNLOAD_NAME}
            target="_blank"
            rel="noreferrer"
            aria-label="Descargar PED en PDF"
          >
            ⬇️ Descargar PED (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
