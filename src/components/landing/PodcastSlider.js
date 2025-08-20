"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/PodcastSlider.module.css";

// Acepta URL o ID de YouTube
function getYouTubeId(input = "") {
  if (!input) return "";
  const m =
    input.match(/youtu\.be\/([^?&]+)/) ||
    input.match(/[?&]v=([^?&]+)/) ||
    input.match(/\/embed\/([^?&]+)/);
  return m ? m[1] : input;
}

/**
 * Props
 * - imageSrc: string  (tarjeta izquierda)
 * - overlaySrc?: string (mic png con transparencia)
 * - videos: string[]   (URLs o IDs de YouTube)
 * - autoAdvanceMs?: number (0 = sin auto)
 * - title?: string
 */
export default function PodcastSlider({
  imageSrc,
  overlaySrc, // ej. "/img/Podcast/mic.png"
  videos = [],
  autoAdvanceMs = 0,
  title = "Podcast",
}) {
  const ids = useMemo(() => videos.map(getYouTubeId).filter(Boolean), [videos]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!autoAdvanceMs || ids.length <= 1) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % ids.length);
    }, autoAdvanceMs);
    return () => timerRef.current && clearInterval(timerRef.current);
  }, [autoAdvanceMs, ids.length]);

  if (!ids.length) return null;

  const currentId = ids[index];
  const goto = (i) => setIndex((i + ids.length) % ids.length);
  const prev = () => goto(index - 1);
  const next = () => goto(index + 1);

  return (
    <section className={styles.card}>

      <div className={styles.wrap} aria-label={title}>
        {/* Panel izquierdo (tarjeta) */}
        <div className={styles.leftCard}>
          <img className={styles.leftImg} src={imageSrc} alt="Portada del podcast" />
          {overlaySrc ? (
            <img className={styles.mic} src={overlaySrc} alt="" aria-hidden="true" />
          ) : null}
        </div>

        {/* Video a la derecha */}
        <div className={styles.rightVideo}>
          <div className={styles.aspect}>
            <iframe
              key={currentId}
              title={`YouTube ${index + 1} de ${ids.length}`}
              src={`https://www.youtube-nocookie.com/embed/${currentId}?rel=0&modestbranding=1&playsinline=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>

          {/* Controles estilo de tu captura */}
          <div className={styles.controls}>
            <button className={styles.round} onClick={prev} aria-label="Anterior">‹</button>
            <span className={styles.dot} aria-hidden="true" />
            <button className={styles.round} onClick={next} aria-label="Siguiente">›</button>
          </div>
        </div>
      </div >
    </section>

  );
}
