"use client";

import React, { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import styles from "./ObservationsSection.module.css";

const defaultObservation = {
  sectionName: "",
  page: "",
  asIs: "",
  shouldBe: "",
  justification: "",
};

const ObservationsSection = ({ observations = [], onChange }) => {
  const [obsList, setObsList] = useState(observations.length > 0 ? observations : [defaultObservation]);

  const handleChange = (idx, field, value) => {
    const newObs = obsList.map((obs, i) =>
      i === idx ? { ...obs, [field]: value } : obs
    );
    setObsList(newObs);
    onChange && onChange(newObs);
  };

  const handleAdd = () => {
    const newObs = [...obsList, defaultObservation];
    setObsList(newObs);
    onChange && onChange(newObs);
  };

  const handleRemove = (idx) => {
    if (obsList.length === 1) return; // Evita borrar el último
    const newObs = obsList.filter((_, i) => i !== idx);
    setObsList(newObs);
    onChange && onChange(newObs);
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleGuardarAvance = () => setSnackbar({ open: true, message: '¡Avance guardado!', severity: 'info' });
  const handleGuardarComentarios = () => setSnackbar({ open: true, message: '¡Comentarios enviados!', severity: 'success' });

  return (
    <><div className={styles.observationsContainer}>
      <h2 className={styles.title}>Observaciones</h2>
      {obsList.map((obs, idx) => (
        <div className={styles.observationCard} key={idx}>
          <div className={styles.formGroup}>
            <label>Nombre del Apartado</label>
            <input
              type="text"
              value={obs.sectionName}
              onChange={e => handleChange(idx, "sectionName", e.target.value)}
              placeholder="Ej. Introducción"
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Página en la que se encuentra la observación</label>
            <input
              type="number"
              value={obs.page}
              min={1} // evita negativos y cero, opcional
              onChange={e => handleChange(idx, "page", e.target.value.replace(/\D/g, ""))}
              placeholder="Ej. 12"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Como dice</label>
            <textarea
              value={obs.asIs}
              onChange={e => handleChange(idx, "asIs", e.target.value)}
              placeholder="Texto actual..."
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Como debe decir</label>
            <textarea
              value={obs.shouldBe}
              onChange={e => handleChange(idx, "shouldBe", e.target.value)}
              placeholder="Texto corregido..."
              className={styles.textarea}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Justificación</label>
            <textarea
              value={obs.justification}
              onChange={e => handleChange(idx, "justification", e.target.value)}
              placeholder="Motivo de la corrección..."
              className={styles.textarea}
            />
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.removeBtn}
              onClick={() => handleRemove(idx)}
              disabled={obsList.length === 1}
              title={obsList.length === 1 ? "Debe haber al menos una observación" : "Eliminar observación"}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
      <button type="button" className={styles.addBtn} onClick={handleAdd}>
        + Agregar observación
      </button>
    </div>

      <div className={styles.buttonsContainer}>
        <div className={styles.buttonsContainerfixed}>
          <div className={styles.buttonWrapper}>
            <button className={styles.slideButton} onClick={handleGuardarAvance}>Guardar avance</button>
          </div>
          <div className={styles.buttonWrapper}>
            <button className={styles.slideButton} onClick={handleGuardarComentarios}>Enviar comentarios</button>
          </div>
        </div>
      </div>

      
    </>

  );
};

export default ObservationsSection;
