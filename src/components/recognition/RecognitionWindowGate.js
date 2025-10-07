"use client";

import styles from "@/styles/recognition/Recognition.module.css";
import { useRecognitionWindow } from "./UseRecognitionWindow";

export default function RecognitionWindowGate({
  children,
  startISO,
  endISO,
  tz,
  block = true,
  notStartedSlot,
  expiredSlot,
  invalidSlot,
}) {
  const win = useRecognitionWindow({ startISO, endISO, tz });

  // UI por defecto
  const DefaultNotStarted = (
    <div className={styles.containerNoticeCard}>
      <div className={styles.noticeCard} role="status" aria-live="polite">
        <h3 className={styles.noticeTitle}>Periodo aún no disponible</h3>
        <p className={styles.noticeBody}>
          Abre el <strong>{win.fmt(win.start)}</strong> y cierra el{" "}
          <strong>{win.fmt(win.end)}</strong>.
        </p>
      </div>
    </div>

  );

  const DefaultExpired = (
    <div className={styles.containerNoticeCard}>
      <div className={styles.noticeCard} role="alert" aria-live="polite">
        <h3 className={styles.noticeTitle}>Periodo de emisión cerrado</h3>
        <p className={styles.noticeBody}>
          Estuvo disponible del <strong>{win.fmt(win.start)}</strong> al{" "}
          <strong>{win.fmt(win.end)}</strong>.
        </p>
      </div>
    </div>
  );

  const DefaultInvalid = (
    <div className={styles.containerNoticeCard}>
      <div className={styles.noticeCard} role="alert">
        <h3 className={styles.noticeTitle}>Configuración incompleta</h3>
        <p className={styles.noticeBody}>
          Define correctamente las fechas de apertura y cierre.
        </p>
      </div>
    </div>
  );

  if (win.isInvalid) {
    const node = invalidSlot ?? DefaultInvalid;
    return block ? node : <>{node}{children}</>;
  }

  if (win.isNotStarted) {
    const node = notStartedSlot ?? DefaultNotStarted;
    return block ? node : <>{node}{children}</>;
  }

  if (win.isExpired) {
    const node = expiredSlot ?? DefaultExpired;
    return block ? node : <>{node}{children}</>;
  }

  // Abierto → renderiza el flujo normal
  return <>{children}</>;
}
