'use client';

import React from 'react';
import styles from './FeedbackSection.module.css';

export default function Qualify({ id, acuerdo, onChange, motivo, onMotivoChange }) {
  return (
    <div className={styles.qualifySection}>
      <p>¿Es aceptado el cambio?</p>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="si"
            checked={acuerdo === 'si'}
            onChange={(e) => onChange(e.target.value)}
          />
          Sí
        </label>
        <label>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="no"
            checked={acuerdo === 'no'}
            onChange={(e) => onChange(e.target.value)}
          />
          No
        </label>
      </div>

      {acuerdo === 'no' && (
        <div className={styles.textareaContainer}>
          <label htmlFor={`${id}-motivo`}>¿Por qué no?</label>
          <textarea
            id={`${id}-motivo`}
            value={motivo}
            onChange={(e) => onMotivoChange(e.target.value)}
            className={styles.textarea}
            rows={4}
            placeholder="Escribe el motivo aquí..."
          />
        </div>
      )}
    </div>
  );
}
