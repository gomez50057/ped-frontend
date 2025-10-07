"use client";

import React, { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import styles from "./ObservationsSection.module.css";
import { fetchWithAuth } from '@/utils/auth';
import { contenidoPEDOpciones } from '@/utils/utils';
import ConfirmDialog from "@/components/dashboard/components/ConfirmDialog/ConfirmDialog";

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
  const [openConfirm, setOpenConfirm] = useState(false);
  const [obsList, setObsList] = useState([defaultObservation]);
  const [loading, setLoading] = useState(true);
  const [pendingFinalState, setPendingFinalState] = useState(null); // true (marcar) o false (desmarcar)
  const [confirmFinalOpen, setConfirmFinalOpen] = useState(false);
  const [isFinal, setIsFinal] = useState(false); // Para reflejar el estado visual del checkbox
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Al montar, carga las observaciones existentes
  useEffect(() => {
    const fetchObservations = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(API_URL);
        if (!res.ok) throw new Error("Error al obtener las observaciones");
        const data = await res.json();
        // Orden descendente por id (del más grande al más pequeño)
        data.sort((a, b) => b.id - a.id);
        setObsList(data.length > 0 ? data : [defaultObservation]);
        if (data.length > 0) setIsFinal(!!data[0].envio_final);
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

  // Handle de cambios
  const handleChange = (idx, field, value) => {
    const newObs = obsList.map((obs, i) =>
      i === idx ? { ...obs, [field]: value } : obs
    );
    setObsList(newObs);
    onChange && onChange(newObs);
  };

  // Agregar nueva observación
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

  // Eliminar observación
  const handleRemove = async (idx) => {
    if (obsList.length === 1) return;

    const obsToDelete = obsList[idx];
    if (obsToDelete.id) {
      try {
        const res = await fetchWithAuth(`${API_URL}${obsToDelete.id}/`, {
          method: "DELETE",
        });
        if (!res.ok) {
          setSnackbar({
            open: true,
            message: "No se pudo eliminar en el servidor.",
            severity: "error",
          });
          return;
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: error?.message || "Error de red o sesión expirada.",
          severity: "error",
        });
        return;
      }
    }

    const newObs = obsList.filter((_, i) => i !== idx);
    setObsList(newObs);
    onChange && onChange(newObs);
  };

  // Guardar/actualizar todas las observaciones en la API
  const handleGuardarComentarios = async (finalState = isFinal) => {
    if (!areAllObservationsComplete(obsList)) {
      setSnackbar({
        open: true,
        message: "Todos los campos de todas las observaciones son obligatorios.",
        severity: "error",
      });
      return;
    }

    try {
      const reqs = obsList.map(obs => {
        const body = JSON.stringify({
          sectionName: obs.sectionName,
          page: obs.page,
          asIs: obs.asIs,
          shouldBe: obs.shouldBe,
          justification: obs.justification,
          envio_final: finalState,
        });

        if (obs.id) {
          return fetchWithAuth(`${API_URL}${obs.id}/`, {
            method: "PUT",
            body,
          });
        } else {
          return fetchWithAuth(API_URL, {
            method: "POST",
            body,
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

      // Volver a cargar y reordenar
      const res = await fetchWithAuth(API_URL);
      if (res.ok) {
        const data = await res.json();
        // Orden descendente por id (del más grande al más pequeño)
        data.sort((a, b) => b.id - a.id);
        setObsList(data.length > 0 ? data : [defaultObservation]);
        if (data.length > 0) setIsFinal(!!data[0].envio_final);
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

  const onGuardarClick = () => {
    if (!areAllObservationsComplete(obsList)) {
      setSnackbar({
        open: true,
        message: "No se puede guardar: hay campos obligatorios sin completar.",
        severity: "warning",
      });
    } else {
      setOpenConfirm(true);
    }
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
              <div
                className={styles.observationCard}
                key={obs.id ? `id-${obs.id}` : `idx-${idx}`}
              >
                <div className={styles.formGroup}>
                  <label>Nombre del Apartado <span style={{ color: 'red' }}>*</span></label>
                  <select
                    value={obs.sectionName}
                    onChange={e => handleChange(idx, "sectionName", e.target.value)}
                    className={styles.input}
                    required
                  >
                    <option value="">Selecciona un apartado...</option>
                    {contenidoPEDOpciones.map(opcion => (
                      <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </option>
                    ))}
                  </select>
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
                  type="button"
                  className={styles.slideButton}
                  onClick={onGuardarClick}
                  title="Guardar avance"
                >
                  Guardar avance
                </button>
              </div>
              <div className={styles.envioFinalWrapper}>
                <label className={styles.containerChecked}>
                  <input
                    type="checkbox"
                    checked={isFinal}
                    onChange={e => {
                      setPendingFinalState(e.target.checked);
                      setConfirmFinalOpen(true);
                    }}
                  />
                  <div className={styles.checkmark}>
                    <svg
                      className={styles.checkboxSvg}
                      viewBox="0 0 200 200"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        className={styles.checkboxCircle}
                        strokeWidth="20"
                      />
                      <path
                        className={styles.checkboxTick}
                        d="M52 111.018L76.9867 136L149 64"
                        strokeWidth="15"
                      ></path>
                    </svg>
                  </div>
                </label>
                <p className={styles.checkboxLabel}>Confirmo que estas son mis aportaciones finales</p>
              </div>
            </div>
          </div>
        </>
      )}
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={async () => {
          setOpenConfirm(false);
          await handleGuardarComentarios();
        }}
        title="¿Estás seguro de que quieres enviar los comentarios?"
        confirmText="Sí, enviar"
        cancelText="Cancelar"
      />

      <ConfirmDialog
        open={confirmFinalOpen}
        onClose={() => setConfirmFinalOpen(false)}
        onConfirm={async () => {
          setIsFinal(pendingFinalState);
          setConfirmFinalOpen(false);
          await handleGuardarComentarios(pendingFinalState);
        }}
        title={
          pendingFinalState
            ? "¿Estás seguro de enviar como versión final?"
            : "¿Estás seguro de quitar la entrega final?"
        }
        confirmText={
          pendingFinalState
            ? "Sí, confirmar envío final"
            : "Sí, quitar entrega final"
        }
        cancelText="Cancelar"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 1500 }}
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
