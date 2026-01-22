"use client";

import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import styles from "./PdfFlipbook.module.css";

// Fuente única del PDF (evita duplicar strings)
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
 * OPTIMIZACIÓN PARA PDF PESADO (SIN “REINICIO”)
 * ============================================
 * 1) Render Window: renderiza solo páginas cercanas a la actual (±N).
 * 2) Placeholder: evita pantalla blanca mientras PDF.js pinta el canvas.
 * 3) Retry controlado + Watchdog: si una página falla o se queda “en blanco”, forzamos re-render
 *    SOLO de esa página (sin repintar todo el libro en cada flip).
 */

const RENDER_WINDOW = 3; // actual ± 3 (ajusta 2..5 según potencia)

const PAGE_MAX_RETRIES = 2;
const PAGE_RETRY_DELAY_MS = 250;
const PAGE_RENDER_TIMEOUT_MS = 3500;

const BookPage = React.forwardRef(function BookPage(
  { pageNumber, pageWidth, enableMagnifier = false, shouldRender = true },
  forwardedRef
) {
  const localRef = useRef(null);

  // Lupa
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);

  // Throttle pointer move
  const rafIdRef = useRef(null);
  const pendingPosRef = useRef(null);

  // Retry
  const [retryKey, setRetryKey] = useState(0);
  const retryCountRef = useRef(0);

  // Watchdog render (anti “página en blanco” colgada)
  const renderTimeoutRef = useRef(null);

  const setRefs = (node) => {
    localRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
    };
  }, []);

  const scheduleLensPosUpdate = (pos) => {
    pendingPosRef.current = pos;
    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      if (pendingPosRef.current) setLensPos(pendingPosRef.current);
    });
  };

  const handleMove = (e) => {
    if (!enableMagnifier || !localRef.current) return;

    const rect = localRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Clamp visual (evita que el círculo se corte por borde)
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

  const stopRenderWatchdog = () => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
      renderTimeoutRef.current = null;
    }
  };

  const forceRetry = () => {
    if (retryCountRef.current >= PAGE_MAX_RETRIES) return;
    retryCountRef.current += 1;

    stopRenderWatchdog();

    setTimeout(() => {
      setRetryKey((k) => k + 1);
    }, PAGE_RETRY_DELAY_MS);
  };

  const startRenderWatchdog = () => {
    stopRenderWatchdog();
    renderTimeoutRef.current = setTimeout(() => {
      // si no confirmó onRenderSuccess en X ms, reintenta
      forceRetry();
    }, PAGE_RENDER_TIMEOUT_MS);
  };

  // Arranca watchdog cuando esta página entra a renderizarse (sin repintar todo el libro)
  useEffect(() => {
    if (!shouldRender) return;
    startRenderWatchdog();
    return () => stopRenderWatchdog();
    // Se rearma en cada retryKey/pageWidth/pageNumber
  }, [shouldRender, pageNumber, pageWidth, retryKey]);

  // Si está fuera de ventana: placeholder ligero (evita sobrecarga)
  if (!shouldRender) {
    return (
      <div ref={setRefs} className={styles.page}>
        <div className={styles.pagePlaceholder}>
          <p className={styles.pagePlaceholderText}>Cargando…</p>
        </div>
      </div>
    );
  }

  // Offset para que (x,y) quede al centro del lente
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
      {/* Página normal */}
      <PdfPage
        key={`p-${pageNumber}-${pageWidth}-${retryKey}`}
        pageNumber={pageNumber}
        width={pageWidth}
        renderTextLayer={false}
        renderAnnotationLayer={false}
        devicePixelRatio={1}
        loading={
          <div className={styles.pagePlaceholder}>
            <p className={styles.pagePlaceholderText}>Renderizando página…</p>
          </div>
        }
        onRenderError={forceRetry}
        onRenderSuccess={stopRenderWatchdog}
      />

      {/* Lupa */}
      {enableMagnifier && showLens && (
        <div
          className={styles.magnifier}
          style={{
            width: `${LENS_SIZE}px`,
            height: `${LENS_SIZE}px`,
            left: `${lensPos.x - LENS_SIZE / 2}px`,
            top: `${lensPos.y - LENS_SIZE / 2}px`,
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
              key={`m-${pageNumber}-${pageWidth}-${retryKey}`}
              pageNumber={pageNumber}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              devicePixelRatio={1}
              onRenderError={forceRetry}
            />
          </div>
        </div>
      )}
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
  const [currentInteriorIndex, setCurrentInteriorIndex] = useState(0);
  const [bookStartIndex, setBookStartIndex] = useState(0);

  // Lupa ON/OFF (solo laptop)
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);

  // Sonido
  const [isMuted, setIsMuted] = useState(false);

  const bookRef = useRef(null);

  // sonidos
  const flipSoundsRef = useRef([]);
  const flipSoundIndexRef = useRef(0);
  const lastStateRef = useRef("read");

  // Lock de flip
  const [isFlipLocked, setIsFlipLocked] = useState(false);
  const flipLockTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (flipLockTimeoutRef.current) clearTimeout(flipLockTimeoutRef.current);
    };
  }, []);

  // Precargar sonidos
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
      // ignore
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  // Evita capturar flechas si escriben en inputs
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

  // Calcular tamaños según viewport
  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      const laptop = w >= 1024;
      setIsLaptop(laptop);

      let newPageWidth;
      if (laptop) newPageWidth = (w * 0.8) / 2;
      else newPageWidth = w * 0.9;

      newPageWidth = Math.min(newPageWidth, 700);

      const rawPageHeight = newPageWidth * ASPECT_RATIO;
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
    setMode("cover");
  }

  const totalPages = numPages || 0;
  const hasInteriorPages = totalPages > 2 ? totalPages - 2 : 0;

  // Teclado
  useEffect(() => {
    if (!numPages) return;

    function handleKeyDown(e) {
      if (isFlipLocked) return;
      if (isTypingTarget(document.activeElement)) return;

      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, numPages, currentInteriorIndex, hasInteriorPages, isFlipLocked]);

  function handleFlip(e) {
    // IMPORTANTE: no forzamos repintado global aquí (evita “reinicios”)
    setCurrentInteriorIndex(e.data);
  }

  function handleChangeState(e) {
    const state = e.data;

    // sonido al entrar a flipping
    if (state === "flipping" && lastStateRef.current !== "flipping") {
      playFlipSound();
    }
    lastStateRef.current = state;

    if (state === "flipping" || state === "user_fold") {
      setIsFlipping(true);
      setIsFlipLocked(true);

      if (typeof window !== "undefined") {
        if (flipLockTimeoutRef.current) clearTimeout(flipLockTimeoutRef.current);
        flipLockTimeoutRef.current = window.setTimeout(() => {
          setIsFlipLocked(false);
        }, FLIP_LOCK_MS);
      }
    } else {
      setIsFlipping(false);
    }
  }

  const handlePrev = () => {
    if (isFlipLocked) return;

    if (mode === "book") {
      if (!bookRef.current) return;
      const api = bookRef.current.pageFlip?.();
      if (!api) return;

      if (currentInteriorIndex <= 0) {
        setMode("cover");
        playFlipSound();
      } else {
        api.flipPrev();
      }
    } else if (mode === "backCover") {
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
      if (hasInteriorPages > 0) {
        setBookStartIndex(0);
        setMode("book");
        playFlipSound();
      } else if (totalPages > 1) {
        setMode("backCover");
        playFlipSound();
      }
    } else if (mode === "book") {
      if (!bookRef.current) return;
      const api = bookRef.current.pageFlip?.();
      if (!api) return;

      if (currentInteriorIndex >= hasInteriorPages - 1) {
        setMode("backCover");
        playFlipSound();
      } else {
        api.flipNext();
      }
    }
  };

  // Sin tamaño calculado
  if (!pageWidth || !pageHeight) {
    return (
      <section className={styles.section}>
        <h1 className={styles.title}>Catálogo PED</h1>
        <p className={styles.status}>Calculando tamaño del visor…</p>
      </section>
    );
  }

  // wrapper libro: 2 páginas en laptop, 1 en móvil
  const wrapperWidth = isLaptop ? pageWidth * 2 : pageWidth;

  // indicador
  let currentDisplayPage = 1;
  if (mode === "cover") currentDisplayPage = 1;
  else if (mode === "book") currentDisplayPage = currentInteriorIndex + 2;
  else if (mode === "backCover") currentDisplayPage = totalPages || 1;

  const hasLoaded = !!numPages;

  // Lupa solo laptop
  const magnifierEffective = magnifierEnabled && isLaptop;

  // “grosor”
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
          error={<p className={styles.statusError}>No se pudo cargar el archivo PED.</p>}
        >
          {!hasLoaded ? (
            <p className={styles.status}>Preparando páginas…</p>
          ) : totalPages === 1 ? (
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <BookPage
                  pageNumber={1}
                  pageWidth={pageWidth}
                  enableMagnifier={magnifierEffective}
                  shouldRender={true}
                />
              </div>
            </div>
          ) : mode === "cover" ? (
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <BookPage
                  pageNumber={1}
                  pageWidth={pageWidth}
                  enableMagnifier={magnifierEffective}
                  shouldRender={true}
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
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <BookPage
                  pageNumber={totalPages}
                  pageWidth={pageWidth}
                  enableMagnifier={magnifierEffective}
                  shouldRender={true}
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
                // laptop: “book view” (2 páginas), móvil: 1 página
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
                {Array.from({ length: hasInteriorPages }, (_, index) => {
                  const shouldRender =
                    Math.abs(index - currentInteriorIndex) <= RENDER_WINDOW;

                  return (
                    <BookPage
                      key={index + 2}
                      pageNumber={index + 2}
                      pageWidth={pageWidth}
                      enableMagnifier={magnifierEffective}
                      shouldRender={shouldRender}
                    />
                  );
                })}
              </HTMLFlipBook>

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
            <div
              className={styles.singleCoverWrapper}
              style={{ width: pageWidth, height: pageHeight }}
            >
              <div className={styles.singleCoverInner}>
                <BookPage
                  pageNumber={1}
                  pageWidth={pageWidth}
                  enableMagnifier={magnifierEffective}
                  shouldRender={true}
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
