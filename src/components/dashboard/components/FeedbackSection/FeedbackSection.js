import React from "react";
import styles from "./FeedbackSection.module.css";

const placeholders = {
  comoDecir: "Cómo debería decir...",
  justificacion: "Justificación..."
};

export default function FeedbackSection({
  id,
  acuerdo,
  comentarios,
  onAcuerdoChange,
  onComentarioChange,
  fields = ["comoDecir", "justificacion"]
}) {
  return (
    <div className={styles.feedbackSection}>
      <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="yes"
            checked={acuerdo === "yes"}
            onChange={() => onAcuerdoChange(id, "yes")}
          /> Sí
        </label>
        <label className={styles.radioSpacing}>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="no"
            checked={acuerdo === "no"}
            onChange={() => onAcuerdoChange(id, "no")}
          /> No
        </label>
      </div>
      {acuerdo === "no" && (
        <div className={styles.commentArea}>
          {fields.map((field) => (
            <textarea
              key={field}
              placeholder={placeholders[field] || ""}
              value={comentarios?.[field] || ""}
              onChange={e => onComentarioChange(id, field, e.target.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
