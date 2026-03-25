"use client";

import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page as PdfPage, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import styles from "./PdfFlipbook.module.css";

// ==============================
// CONFIG GENERAL
// ==============================
const PDF_FILE = "/pdf/Actualizacion_PED_2025_2028_opt.pdf";
const PDF_DOWNLOAD_NAME = "Actualizacion_PED_2025_2028.pdf";

// Worker de pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Opciones para mejorar compatibilidad con imágenes embebidas
const PDF_OPTIONS = {
  wasmUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/wasm/`,
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
  maxImageSize: -1,
};

// Relación alto/ancho aproximada A4 vertical
const ASPECT_RATIO = 1.414;

// Parámetros de lupa
const LENS_SIZE = 200;
const LENS_ZOOM = 2;

// Lock tras flip
const FLIP_LOCK_MS = 900;

// Render conservador para PDF pesado
const RENDER_WINDOW_DESKTOP = 2;
const RENDER_WINDOW_MOBILE = 0;

// Reintento por página si falla render
const PAGE_MAX_RETRIES = 1;
const PAGE_RETRY_DELAY_MS = 300;

// ==============================
// PÁGINA INDIVIDUAL
// ==============================
const BookPage = React.memo(
  React.forwardRef(function BookPage(
    { pageNumber, pageWidth, enableMagnifier = false, shouldRender = true },
    forwardedRef
  ) {
    const localRef = useRef(null);

    const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
    const [showLens, setShowLens] = useState(false);
    const [retryKey, setRetryKey] = useState(0);

    const rafIdRef = useRef(null);
    const pendingPosRef = useRef(null);
    const retryCountRef = useRef(0);

    const setRefs = (node) => {
      localRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    useEffect(() => {
      retryCountRef.current = 0;
      setRetryKey(0);
      setShowLens(false);
    }, [pageNumber, pageWidth]);

    useEffect(() => {
      return () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
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

    const handleMove = (e) => {
      if (!enableMagnifier || !localRef.current) return;

      const rect = localRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

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

    const forceRetry = (err) => {
      if (err) {
        console.error(`Error renderizando página ${pageNumber}:`, err);
      }

      if (!shouldRender) return;
      if (retryCountRef.current >= PAGE_MAX_RETRIES) return;

      retryCountRef.current += 1;

      window.setTimeout(() => {
        setRetryKey((k) => k + 1);
      }, PAGE_RETRY_DELAY_MS);
    };

    if (!shouldRender) {
      return (
        <div ref={setRefs} className={styles.page}>
          <div className={styles.pagePlaceholder}>
            <p className={styles.pagePlaceholderText}>Página en espera…</p>
          </div>
        </div>
      );
    }

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
        <PdfPage
          key={`p-${pageNumber}-${pageWidth}-${retryKey}`}
          pageNumber={pageNumber}
          width={pageWidth}
          renderMode="canvas"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          devicePixelRatio={1}
          loading={
            <div className={styles.pagePlaceholder}>
              <p className={styles.pagePlaceholderText}>Renderizando página…</p>
            </div>
          }
          onRenderError={forceRetry}
        />

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
                renderMode="canvas"
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
  }),
  (prev, next) =>
    prev.pageNumber === next.pageNumber &&
    prev.pageWidth === next.pageWidth &&
    prev.enableMagnifier === next.enableMagnifier &&
    prev.shouldRender === next.shouldRender
);

BookPage.displayName = "BookPage";

// ==============================
// COMPONENTE PRINCIPAL
// ==============================
export default function PdfFlipbookClient() {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [isLaptop, setIsLaptop] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const [isFlipping, setIsFlipping] = useState(false);
  const [mode, setMode] = useState("cover"); // cover | book | backCover
  const [currentInteriorIndex, setCurrentInteriorIndex] = useState(0);
  const [bookStartIndex, setBookStartIndex] = useState(0);

  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [isFlipLocked, setIsFlipLocked] = useState(false);

  const bookRef = useRef(null);
  const flipSoundsRef = useRef([]);
  const flipSoundIndexRef = useRef(0);
  const lastStateRef = useRef("read");
  const flipLockTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (flipLockTimeoutRef.current) clearTimeout(flipLockTimeoutRef.current);
    };
  }, []);

  // Precarga sonidos
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

  // Resize
  useEffect(() => {
    function handleResize() {
      if (typeof window === "undefined") return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      const laptop = w >= 1024;
      setIsLaptop(laptop);

      let newPageWidth = laptop ? (w * 0.8) / 2 : w * 0.9;
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

  // Teclado
  useEffect(() => {
    if (!numPages) return;

    function isTypingTarget(el) {
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        el.isContentEditable
      );
    }

    function handleKeyDown(e) {
      if (isFlipLocked) return;
      if (isTypingTarget(document.activeElement)) return;

      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages, isFlipLocked, mode, currentInteriorIndex]);

  const playFlipSound = () => {
    const arr = flipSoundsRef.current;
    if (!arr?.length || isMuted) return;

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

  function onDocumentLoadSuccess({ numPages: loadedPages }) {
    setNumPages(loadedPages);
    setCurrentInteriorIndex(0);
    setBookStartIndex(0);
    setMode("cover");
  }

  function handleFlip(e) {
    setCurrentInteriorIndex(e.data);
  }

  function handleChangeState(e) {
    const state = e.data;

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

  const totalPages = numPages || 0;
  const hasInteriorPages = totalPages > 2 ? totalPages - 2 : 0;
  const renderWindow = isLaptop ? RENDER_WINDOW_DESKTOP : RENDER_WINDOW_MOBILE;

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

  if (!pageWidth || !pageHeight) {
    return (
      <section className={styles.section}>
        <p className={styles.status}>Calculando tamaño del visor…</p>
      </section>
    );
  }

  const wrapperWidth = isLaptop ? pageWidth * 2 : pageWidth;
  const hasLoaded = !!numPages;
  const magnifierEffective = magnifierEnabled && isLaptop;

  let currentDisplayPage = 1;
  if (mode === "cover") currentDisplayPage = 1;
  else if (mode === "book") currentDisplayPage = currentInteriorIndex + 2;
  else if (mode === "backCover") currentDisplayPage = totalPages || 1;

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

  const interiorPages = hasInteriorPages
    ? Array.from({ length: hasInteriorPages }, (_, index) => {
        const shouldRender = isLaptop
          ? index >= currentInteriorIndex - renderWindow &&
            index <= currentInteriorIndex + 1 + renderWindow
          : Math.abs(index - currentInteriorIndex) <= renderWindow;

        return (
          <BookPage
            key={index + 2}
            pageNumber={index + 2}
            pageWidth={pageWidth}
            enableMagnifier={magnifierEffective}
            shouldRender={shouldRender}
          />
        );
      })
    : null;

  return (
    <section className={styles.section}>
      <div className={styles.viewer} id="pdf-viewer" data-ped-viewer="true">
        <Document
          file={PDF_FILE}
          options={PDF_OPTIONS}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadProgress={({ loaded, total }) => {
            if (!total) return;
            setLoadProgress(Math.round((loaded / total) * 100));
          }}
          loading={
            <p className={styles.status}>
              Cargando PED… {loadProgress > 0 ? `${loadProgress}%` : ""}
            </p>
          }
          error={
            <p className={styles.statusError}>
              No se pudo cargar el archivo PED.
            </p>
          }
          onLoadError={(err) => {
            console.error("Error cargando PDF:", err);
          }}
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
                  Abrir el PED
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
              className={`${styles.bookWrapper} ${
                isFlipping ? styles.bookWrapperFlipping : ""
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
                usePortrait={!isLaptop}
                flippingTime={1200}
                drawShadow={true}
                maxShadowOpacity={0.7}
                showPageCorners={true}
                swipeDistance={20}
                useMouseEvents={true}
                mobileScrollSupport={true}
                startPage={bookStartIndex}
                className={`${styles.flipbook} ${
                  isFlipping ? styles.flipbookFlipping : ""
                }`}
                onFlip={handleFlip}
                onChangeState={handleChangeState}
              >
                {interiorPages}
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

        <div className={styles.controlsBar}>
          <div className={styles.controlsGroup}>
            <button
              type="button"
              className={`${styles.iconButton} ${
                magnifierEffective ? styles.iconButtonActive : ""
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
            className={`${styles.iconButton} ${
              isMuted ? styles.iconButtonMuted : ""
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