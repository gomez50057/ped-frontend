'use client';

import React, { useState, useEffect } from 'react';
import styles from './FeedbackSection.module.css';

export default function Qualify({ id, acuerdo, onChange, motivo, onMotivoChange }) {
  // Estado interno para reflejar la selección
  const [localAcuerdo, setLocalAcuerdo] = useState(acuerdo || '');
  const [localMotivo, setLocalMotivo] = useState(motivo || '');

  // Si el prop cambia (por ejemplo al cargar feedback), sincronizamos
  useEffect(() => {
    setLocalAcuerdo(acuerdo || '');
  }, [acuerdo]);

  useEffect(() => {
    setLocalMotivo(motivo || '');
  }, [motivo]);

  const handleAcuerdo = (value) => {
    setLocalAcuerdo(value);
    onChange(value);
    // Si selecciona “Sí”, limpiamos el motivo
    if (value !== 'no') {
      setLocalMotivo('');
      onMotivoChange('');
    }
  };

  const handleMotivoChange = (value) => {
    setLocalMotivo(value);
    onMotivoChange(value);
  };

  return (
    <div className={styles.qualifySection}>
      <p>¿Es aceptado el cambio?</p>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="si"
            checked={localAcuerdo === 'si'}
            onChange={() => handleAcuerdo('si')}
          />
          Sí
        </label>
        <label>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="no"
            checked={localAcuerdo === 'no'}
            onChange={() => handleAcuerdo('no')}
          />
          No
        </label>
      </div>

      {localAcuerdo === 'no' && (
        <div className={styles.textareaContainer}>
          <label htmlFor={`${id}-motivo`}>¿Por qué no?</label>
          <textarea
            id={`${id}-motivo`}
            value={localMotivo}
            onChange={(e) => handleMotivoChange(e.target.value)}
            className={styles.textarea}
            rows={4}
            placeholder="Escribe el motivo aquí..."
          />
        </div>
      )}
    </div>
  );
}
