import React from "react";
import styles from "./FeedbackSection.module.css";

export default function FeedbackSection({ id, acuerdo, comentarios, onAcuerdoChange, onComentarioChange }) {
  return (
    <div className={styles.feedbackSection}>
      <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
      <div className={styles.radioGroup}>
        <label>
          <input type="radio" name={`${id}-acuerdo`} value="yes" checked={acuerdo === "yes"} onChange={() => onAcuerdoChange(id, "yes")} /> Sí
        </label>
        <label className={styles.radioSpacing}>
          <input type="radio" name={`${id}-acuerdo`} value="no" checked={acuerdo === "no"} onChange={() => onAcuerdoChange(id, "no")} /> No
        </label>
      </div>
      {acuerdo === "no" && (
        <div className={styles.commentArea}>
          <textarea placeholder="Cómo debería decir..." value={comentarios?.comoDecir || ""} onChange={e => onComentarioChange(id, "comoDecir", e.target.value)} />
          <textarea placeholder="Justificación..." value={comentarios?.justificacion || ""} onChange={e => onComentarioChange(id, "justificacion", e.target.value)} />
        </div>
      )}
    </div>
  );
}
