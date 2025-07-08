import React from "react";
import styles from "./FeedbackSection.module.css";

export default function IndicatorsFeedbackSection({
  id,
  acuerdo,
  metas,
  comentarios,
  onAcuerdoChange,
  onMetasChange,
  onComentarioChange,
}) {
  return (
    <div className={styles.feedbackSection}>
      {/* Pregunta sobre la estructura */}
      <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="yes"
            checked={acuerdo === "yes"}
            onChange={() => onAcuerdoChange(id, "yes")}
          />{" "}
          Sí
        </label>
        <label className={styles.radioSpacing}>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="no"
            checked={acuerdo === "no"}
            onChange={() => onAcuerdoChange(id, "no")}
          />{" "}
          No
        </label>
      </div>

      {/* Si respondió "no", pedir justificación */}
      {acuerdo === "no" && (
        <div className={styles.commentArea}>
          <textarea
            placeholder="Justificación..."
            value={comentarios?.justificacion || ""}
            onChange={e =>
              onComentarioChange(id, "justificacion", e.target.value)
            }
          />
        </div>
      )}

      {/* Si respondió "sí", preguntar por metas */}
      {acuerdo === "yes" && (
        <div>
          <p>¿Estás de acuerdo con las metas propuestas?</p>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name={`${id}-metas`}
                value="yes"
                checked={metas === "yes"}
                onChange={() => onMetasChange(id, "yes")}
              />{" "}
              Sí
            </label>
            <label className={styles.radioSpacing}>
              <input
                type="radio"
                name={`${id}-metas`}
                value="no"
                checked={metas === "no"}
                onChange={() => onMetasChange(id, "no")}
              />{" "}
              No
            </label>
          </div>

          {/* Si también respondió "sí" a las metas, mostrar campo texto */}
          {metas === "no" && (
            <div className={styles.commentArea}>
              <textarea
                placeholder="Comentario sobre metas..."
                value={comentarios?.metasComentario || ""}
                onChange={e =>
                  onComentarioChange(id, "metasComentario", e.target.value)
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
