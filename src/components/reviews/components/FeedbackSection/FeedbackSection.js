'use client';

import React from "react";
import styles from "./FeedbackSection.module.css";

export default function FeedbackSection({ id, acuerdo, comentarios }) {
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
            disabled
          /> Sí
        </label>
        <label className={styles.radioSpacing}>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="no"
            checked={acuerdo === "no"}
            disabled
          /> No
        </label>
      </div>
      {acuerdo === "no" && (
        <div className={styles.commentArea}>
          <textarea
            placeholder="Cómo debería decir..."
            value={comentarios?.comoDecir || ""}
            readOnly
          />
          <textarea
            placeholder="Justificación..."
            value={comentarios?.justificacion || ""}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
