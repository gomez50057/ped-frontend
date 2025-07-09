'use client';

import React, { useState, useEffect } from 'react';
import * as indicators from '@/utils/indicatorsData';
import { EJE_GROUPS } from '@/utils/indicatorsDataGroups';
import { fetchWithAuth } from '@/utils/auth';
import styles from './IndicatorsReview.module.css';
import FeedbackSection from '../components/FeedbackSection/IndicatorsFeedbackSection';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import ConfirmDialog from "@/components/dashboard/components/ConfirmDialog/ConfirmDialog";

export default function IndicatorsReview() {
  const [feedback, setFeedback] = useState({});
  const [axes, setAxes] = useState([]);
  const [loadingAxes, setLoadingAxes] = useState(true);
  const [isFinal, setIsFinal] = useState(false);
  const [feedbackId, setFeedbackId] = useState(null); // <-- Nuevo: para decidir POST/PUT
  const [confirmFinalOpen, setConfirmFinalOpen] = useState(false);
  const [pendingFinalState, setPendingFinalState] = useState(null); // true (marcar) o false (desmarcar)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  useEffect(() => {
    async function fetchAxesAndFeedback() {
      try {
        // 1. Cargar ejes del usuario
        const ejeRes = await fetchWithAuth("/api/indicadores/user-indicator-selection/");
        const ejeData = await ejeRes.json();
        if (Array.isArray(ejeData) && ejeData.length > 0 && ejeData[0].axes) {
          setAxes(ejeData[0].axes);
        } else {
          setAxes([]);
        }

        // 2. Cargar feedback existente del usuario
        const fbRes = await fetchWithAuth("/api/indicadores-feedback/feedback/");
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          if (fbData.feedback) setFeedback(fbData.feedback);
          if (typeof fbData.envioFinal === "boolean") setIsFinal(fbData.envioFinal);
          if (fbData.id) setFeedbackId(fbData.id);
        }
      } catch (err) {
        // En caso de error, deja los estados por defecto
        setAxes([]);
        setFeedback({});
      } finally {
        setLoadingAxes(false);
      }
    }
    fetchAxesAndFeedback();
  }, []);

  const filteredEjeGroups = EJE_GROUPS.filter((_, idx) => axes.includes(idx + 1));

  if (loadingAxes) return <div>Cargando ejes...</div>;
  if (filteredEjeGroups.length === 0) return <div>No tienes ejes asignados para revisar.</div>;


  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(s => ({ ...s, open: false }));
  };

  function handleAcuerdoChange(id, value) {
    setFeedback(prev => {
      if (value === "yes") {
        return {
          ...prev,
          [id]: {
            ...prev[id],
            acuerdo: "yes",
            comentarios: {
              ...prev[id]?.comentarios,
              justificacion: "No Aplica",
              meta2028: "",
              meta2040: ""
            }
          }
        };
      } else if (value === "no") {
        return {
          ...prev,
          [id]: {
            ...prev[id],
            acuerdo: "no",
            metas: "",
            comentarios: {
              ...prev[id]?.comentarios,
              justificacion: "",
              meta2028: "",
              meta2040: ""
            }
          }
        };
      } else {
        return prev;
      }
    });
  }

  function handleMetasChange(id, value) {
    setFeedback(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        metas: value,
        comentarios: {
          ...prev[id]?.comentarios,
          meta2028: value === "yes" ? "No Aplica" : "",
          meta2040: value === "yes" ? "No Aplica" : ""
        }
      }
    }));
  }

  function handleComentarioChange(id, field, value) {
    setFeedback(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        comentarios: {
          ...prev[id]?.comentarios,
          [field]: value
        }
      }
    }));
  }

  function handleAgregarPropuesta(fichaId) {
    // Aquí pon la lógica que necesites (abrir modal, etc)
    alert(`Agregar propuesta para el indicador: ${fichaId}`);
  }

  function sanitizeFeedback(feedback) {
    const result = {};
    Object.entries(feedback).forEach(([key, value]) => {
      let { acuerdo, metas, comentarios } = value;

      if (acuerdo === "no") {
        result[key] = {
          acuerdo,
          metas: "No Aplica",
          comentarios: {
            justificacion: comentarios.justificacion || "",
            meta2028: "No Aplica",
            meta2040: "No Aplica"
          }
        };
      } else if (acuerdo === "yes" && metas === "yes") {
        result[key] = {
          acuerdo,
          metas,
          comentarios: {
            justificacion: "No Aplica",
            meta2028: "No Aplica",
            meta2040: "No Aplica"
          }
        };
      } else if (acuerdo === "yes" && metas === "no") {
        result[key] = {
          acuerdo,
          metas,
          comentarios: {
            justificacion: "No Aplica",
            meta2028: comentarios.meta2028 || "",
            meta2040: comentarios.meta2040 || ""
          }
        };
      }
    });
    return result;
  }

  async function handleSaveFeedback(cleanedFeedback, envioFinal) {
    try {
      let res;
      if (feedbackId) {
        // PUT
        res = await fetchWithAuth('/api/indicadores-feedback/feedback/', {
          method: 'PUT',
          body: JSON.stringify({
            feedback: cleanedFeedback,
            envioFinal
          })
        });
      } else {
        // POST
        res = await fetchWithAuth('/api/indicadores-feedback/feedback/', {
          method: 'POST',
          body: JSON.stringify({
            feedback: cleanedFeedback,
            envioFinal
          })
        });
      }
      if (res.ok) {
        setSnackbar({
          open: true,
          message: feedbackId ? "Avance actualizado correctamente" : "Avance guardado correctamente",
          severity: "success"
        });
        if (!feedbackId) {
          const data = await res.json();
          if (data.id) setFeedbackId(data.id);
        }
      } else {
        let msg = "Error al guardar el avance";
        try {
          const data = await res.json();
          if (data.detail) msg = data.detail;
        } catch { }
        setSnackbar({
          open: true,
          message: msg,
          severity: "error"
        });
      }
    } catch (e) {
      setSnackbar({
        open: true,
        message: "Error inesperado al guardar el avance",
        severity: "error"
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerReview}>
        {filteredEjeGroups.map(eje => {
          const indicatorsInGroup = eje.keys.map(key => indicators[key]).filter(Boolean);
          if (indicatorsInGroup.length === 0) return null;
          return (
            <div key={eje.title} className={styles.ejeContainer}>
              <h2 className={styles.ejeTitle}>{eje.title}</h2>
              {indicatorsInGroup.map(item => {
                const malId = item?.indicador?.id || item?.id || Math.random();
                if (!item || !item.indicador || !item.indicador.id) {
                  return <div key={malId} style={{ color: 'red' }}>Indicador mal definido</div>;
                }
                const fichaId = item.indicador.id;
                return (
                  <div key={fichaId} className={styles.indicatorCard}>
                    <div className={styles.header}>
                      <span className={styles.headerText}>
                        FICHA DEL INDICADOR {fichaId.replace('indicador_', '').replace(/_/g, '. ').toUpperCase()}
                      </span>
                    </div>
                    <div className={styles.contentGrid}>
                      {/* Columna Izquierda */}
                      <div className={styles.leftColumn}>
                        <div className={styles.fieldBlock}>
                          <div className={styles.labelL}>Nombre del indicador:</div>
                          <div className={styles.boldL}>{item.indicador.nombre}</div>
                        </div>

                        <div className={styles.fieldBlock}>
                          <div className={styles.labelL}>Alineación al PED 2025-2028 (Objetivo)</div>
                          <div className={styles.valueL}>
                            <span className={styles.keyObj}>
                              {item.alineacion_PED.objetivo_texto.split(' ')[0]}
                            </span>
                            {item.alineacion_PED.objetivo_texto.substring(item.alineacion_PED.objetivo_texto.indexOf(' ') + 1)}
                          </div>
                        </div>

                        <div className={styles.fieldBlock}>
                          <div className={styles.labelL}>Alineación al Plan Nacional de Desarrollo 2025 -2030 (Eje)</div>
                          <div className={styles.valueL}>
                            <span>{item.alineacion_plan_nacional.eje}</span>
                          </div>
                        </div>

                        <div className={styles.fieldBlock}>
                          <div className={styles.labelL}>Alineación a ODS:</div>
                          <div className={styles.odsContainer}>
                            {item.alineacion_ODS.ods.map((ods) => (
                              <div key={ods} className={styles.odsItem}>
                                <img
                                  src={`/img/dashboard/img-ods/S-WEB-Goal-${ods}.png`}
                                  alt={`ODS ${ods}`}
                                  className={styles.odsImg}
                                  onError={(e) => (e.target.style.display = 'none')}
                                />
                                <span className={styles.odsNumber}>{ods}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Columna Derecha */}
                      <div className={styles.rightColumn}>
                        <div className={styles.fieldBlock}>
                          <span className={styles.label}>Descripción:</span>
                          <span className={styles.value}>{item.descripcion.texto}</span>
                        </div>
                        <div className={styles.rowFields}>
                          <div>
                            <span className={styles.label}>Periodicidad:</span>
                            <span className={styles.value}>{item.periodicidad.valor}</span>
                          </div>
                          <div>
                            <span className={styles.label}>Sentido del indicador:</span>
                            <span className={styles.value}>{item.sentido_indicador.valor}</span>
                          </div>
                        </div>
                        <div className={styles.rowFields}>
                          <div>
                            <span className={styles.label}>Línea base:</span>
                            <div className={styles.value}>
                              <span className={styles.bold}>{item.linea_base.titulo}:</span> {item.linea_base.subtitulo}
                            </div>
                          </div>
                          <div>
                            <span className={styles.label}>Metas:</span>
                            <ul className={styles.goals}>
                              {item.metas.map((meta) => (
                                <li key={meta.id}>
                                  <span className={styles.bold}>{meta.titulo}:</span> {meta.subtitulo}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className={styles.fieldBlock}>
                          <span className={styles.label}>Fuente:</span>
                          <span className={styles.value}>
                            {item.fuente.organizaciones.join(', ')}
                            {item.fuente.url && (
                              <>
                                <br />
                                <a
                                  href={item.fuente.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.link}
                                >
                                  {item.fuente.url}
                                </a>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <FeedbackSection
                      id={fichaId}
                      acuerdo={feedback[fichaId]?.acuerdo || ""}
                      metas={feedback[fichaId]?.metas || ""}
                      comentarios={feedback[fichaId]?.comentarios || {}}
                      onAcuerdoChange={handleAcuerdoChange}
                      onMetasChange={handleMetasChange}
                      onComentarioChange={handleComentarioChange}
                      onAgregarPropuesta={handleAgregarPropuesta}
                      indicadorInfo={item.indicador}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className={styles.buttonsContainer}>
        <div className={styles.buttonsContainerfixed}>
          <div className={styles.buttonWrapper}>
            <button
              type="button"
              className={styles.slideButton}
              onClick={() => setConfirmOpen(true)}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar avance'}
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
              <p className={styles.checkboxLabel}>
                Confirmo que estas son mis aportaciones finales. <br />
                (<b>Aún puedes modificar hasta la fecha límite</b>)
              </p>
            </label>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSnackbar({
            open: true,
            message: "Acción cancelada por el usuario",
            severity: "warning"
          });
        }}
        onConfirm={async () => {
          setIsSaving(true);
          setConfirmOpen(false);
          const cleanedFeedback = sanitizeFeedback(feedback);
          await handleSaveFeedback(cleanedFeedback, isFinal);
          setIsSaving(false);
        }}
        title="¿Estás seguro de que quieres guardar tu avance?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
      />

      <ConfirmDialog
        open={confirmFinalOpen}
        onClose={() => setConfirmFinalOpen(false)}
        onConfirm={() => {
          setIsFinal(pendingFinalState);
          setConfirmFinalOpen(false);
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

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
