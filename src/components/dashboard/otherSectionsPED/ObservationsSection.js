"use client";

import React, { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import styles from "./ObservationsSection.module.css";
import { fetchWithAuth } from '@/utils/auth';

const defaultObservation = {
  sectionName: "",
  page: "",
  asIs: "",
  shouldBe: "",
  justification: "",
};

const isObservationComplete = (obs) =>
  obs.sectionName.trim() !== "" &&
  obs.page.toString().trim() !== "" &&
  obs.asIs.trim() !== "" &&
  obs.shouldBe.trim() !== "" &&
  obs.justification.trim() !== "";

const areAllObservationsComplete = (obsList) =>
  obsList.every(isObservationComplete);

const API_URL = "/api/otro_apartados/elementos/";

const ObservationsSection = ({ observations = [], onChange }) => {
  const [obsList, setObsList] = useState([defaultObservation]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 1. Al montar, carga las observaciones existentes
  useEffect(() => {
    const fetchObservations = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(API_URL);
        if (!res.ok) throw new Error("Error al obtener las observaciones");
        const data = await res.json();
        setObsList(data.length > 0 ? data : [defaultObservation]);
      } catch (error) {
        setObsList([defaultObservation]);
        setSnackbar({
          open: true,
          message: error.message || "No se pudieron cargar observaciones.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchObservations();
  }, []);

  // 2. Handle de cambios
  const handleChange = (idx, field, value) => {
    const newObs = obsList.map((obs, i) =>
      i === idx ? { ...obs, [field]: value } : obs
    );
    setObsList(newObs);
    onChange && onChange(newObs);
  };

  // 3. Agregar nueva observación
  const handleAdd = () => {
    if (!isObservationComplete(obsList[obsList.length - 1])) {
      setSnackbar({
        open: true,
        message: "Completa todos los campos antes de agregar una nueva observación.",
        severity: "warning",
      });
      return;
    }
    const newObs = [...obsList, defaultObservation];
    setObsList(newObs);
    onChange && onChange(newObs);
  };

  // 4. Eliminar observación
  const handleRemove = (idx) => {
    if (obsList.length === 1) return;
    const newObs = obsList.filter((_, i) => i !== idx);
    setObsList(newObs);
    onChange && onChange(newObs);
  };

  // 5. Guardar avance local (opcional)
  const handleGuardarAvance = () => {
    if (!areAllObservationsComplete(obsList)) {
      setSnackbar({
        open: true,
        message: "Todos los campos de todas las observaciones son obligatorios.",
        severity: "error",
      });
      return;
    }
    setSnackbar({
      open: true,
      message: "¡Avance guardado!",
      severity: "info",
    });
    console.log("Observaciones actuales:", obsList);
  };

  // 6. Guardar/actualizar todas las observaciones en la API
  const handleGuardarComentarios = async () => {
    if (!areAllObservationsComplete(obsList)) {
      setSnackbar({
        open: true,
        message: "Todos los campos de todas las observaciones son obligatorios.",
        severity: "error",
      });
      return;
    }

    try {
      // PUT o POST según si hay id
      const reqs = obsList.map(obs => {
        // Si tiene id, actualiza con PUT
        if (obs.id) {
          return fetchWithAuth(`${API_URL}${obs.id}/`, {
            method: "PUT",
            body: JSON.stringify({
              sectionName: obs.sectionName,
              page: obs.page,
              asIs: obs.asIs,
              shouldBe: obs.shouldBe,
              justification: obs.justification,
            }),
          });
        } else {
          // Si no, crea nuevo con POST
          return fetchWithAuth(API_URL, {
            method: "POST",
            body: JSON.stringify({
              sectionName: obs.sectionName,
              page: obs.page,
              asIs: obs.asIs,
              shouldBe: obs.shouldBe,
              justification: obs.justification,
            }),
          });
        }
      });
      const responses = await Promise.all(reqs);

      const anyFail = responses.some(res => !res.ok);
      if (anyFail) {
        setSnackbar({
          open: true,
          message: "Ocurrió un error al actualizar/guardar una observación.",
          severity: "error",
        });
        return;
      }

      setSnackbar({
        open: true,
        message: "¡Comentarios guardados correctamente!",
        severity: "success",
      });

      const res = await fetchWithAuth(API_URL);
      if (res.ok) {
        const data = await res.json();
        setObsList(data.length > 0 ? data : [defaultObservation]);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.message || "Error de red o sesión expirada.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "2em" }}>Cargando observaciones...</div>
      ) : (
        <>
          <div className={styles.observationsContainer}>
            <h2 className={styles.title}>Observaciones</h2>
            {obsList.map((obs, idx) => (
              <div className={styles.observationCard} key={obs.id ? `id-${obs.id}` : `idx-${idx}`}>
                <div className={styles.formGroup}>
                  <label>Nombre del Apartado <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="text"
                    value={obs.sectionName}
                    onChange={e => handleChange(idx, "sectionName", e.target.value)}
                    placeholder="Ej. Introducción"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Página en la que se encuentra la observación <span style={{ color: 'red' }}>*</span></label>
                  <input
                    type="number"
                    value={obs.page}
                    min={1}
                    onChange={e =>
                      handleChange(idx, "page", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Ej. 12"
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Como dice <span style={{ color: 'red' }}>*</span></label>
                  <textarea
                    value={obs.asIs}
                    onChange={e => handleChange(idx, "asIs", e.target.value)}
                    placeholder="Texto actual..."
                    className={styles.textarea}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Como debe decir <span style={{ color: 'red' }}>*</span></label>
                  <textarea
                    value={obs.shouldBe}
                    onChange={e => handleChange(idx, "shouldBe", e.target.value)}
                    placeholder="Texto corregido..."
                    className={styles.textarea}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Justificación <span style={{ color: 'red' }}>*</span></label>
                  <textarea
                    value={obs.justification}
                    onChange={e =>
                      handleChange(idx, "justification", e.target.value)
                    }
                    placeholder="Motivo de la corrección..."
                    className={styles.textarea}
                    required
                  />
                </div>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemove(idx)}
                    disabled={obsList.length === 1}
                    title={
                      obsList.length === 1
                        ? "Debe haber al menos una observación"
                        : "Eliminar observación"
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAdd}
              disabled={!isObservationComplete(obsList[obsList.length - 1])}
              title={
                !isObservationComplete(obsList[obsList.length - 1])
                  ? "Completa la observación antes de agregar otra"
                  : "Agregar observación"
              }
            >
              + Agregar observación
            </button>
          </div>

          <div className={styles.buttonsContainer}>
            <div className={styles.buttonsContainerfixed}>
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.slideButton}
                  onClick={handleGuardarAvance}
                  disabled={!areAllObservationsComplete(obsList)}
                  title={
                    !areAllObservationsComplete(obsList)
                      ? "Completa todos los campos para guardar"
                      : "Guardar avance"
                  }
                >
                  Guardar avance
                </button>
              </div>
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.slideButton}
                  onClick={handleGuardarComentarios}
                  disabled={!areAllObservationsComplete(obsList)}
                  title={
                    !areAllObservationsComplete(obsList)
                      ? "Completa todos los campos para enviar"
                      : "Enviar comentarios"
                  }
                >
                  Enviar comentarios
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ObservationsSection;
