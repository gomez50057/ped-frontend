import React from "react";
import styles from "./IndicatorsFeedbackSection.module.css";

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
            className={styles.radioInput}
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
            className={styles.radioInput}
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
        <>
          <div className={styles.commentArea}>
            <textarea
              placeholder="Justificación..."
              value={comentarios?.justificacion || ""}
              onChange={e =>
                onComentarioChange(id, "justificacion", e.target.value)
              }
            />
          </div>
          <button
            type="button"
            className={styles.addProposalButton}
            onClick={() => {
              // Lógica para agregar nueva propuesta (puedes conectar un modal, etc.)
              alert("Funcionalidad para agregar nueva propuesta de indicador (implementar)");
            }}
          >
            Agregar nueva propuesta de indicador
          </button>
        </>
      )}


      {/* Si respondió "sí", preguntar por metas */}
      {acuerdo === "yes" && (
        <div>
          <p>¿Estás de acuerdo con las metas propuestas?</p>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                className={styles.radioInput}
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
                className={styles.radioInput}
                name={`${id}-metas`}
                value="no"
                checked={metas === "no"}
                onChange={() => onMetasChange(id, "no")}
              />{" "}
              No
            </label>
          </div>

          {/* Si también respondió "no" a las metas, mostrar campo texto */}
          {metas === "no" && (
            <div className={styles.commentArea}>
              <label className={styles.inputLabel}>
                Ingresa tu nueva meta 2028:
                <input
                  type="text"
                  value={comentarios?.meta2028 || ""}
                  onChange={e =>
                    onComentarioChange(id, "meta2028", e.target.value)
                  }
                  placeholder="Nueva meta para 2028"
                  className={styles.inputField}
                />
              </label>
              <label className={styles.inputLabel}>
                Ingresa tu nueva meta 2040:
                <input
                  type="text"
                  value={comentarios?.meta2040 || ""}
                  onChange={e =>
                    onComentarioChange(id, "meta2040", e.target.value)
                  }
                  placeholder="Nueva meta para 2040"
                  className={styles.inputField}
                />
              </label>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
