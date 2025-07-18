"use client";

import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFeedback } from '@/hooks/useFeedback';
import styles from './PlataformaEstrategicaReview.module.css';
import FeedbackSection from '../components/FeedbackSection/FeedbackSection';
import { fetchWithAuth } from '@/utils/auth';
import { useSelectedAxes } from '@/hooks/StrategicPlatform/useSelectedAxes';
import { useStaticWithId } from '@/hooks/StrategicPlatform/useStaticWithId';
import ConfirmDialog from "@/components/dashboard/components/ConfirmDialog/ConfirmDialog";

export default function PlataformaEstrategicaReview() {
  const { selectedCodes, loading } = useSelectedAxes();
  const staticWithId = useStaticWithId();
  const { feedback, setAcuerdo, setComentario, setFeedback } = useFeedback();

  // NUEVO: estados para dinámicos
  const [nuevasEstrategias, setNuevasEstrategias] = useState({}); // { propId: [{...}] }
  const [nuevasLineas, setNuevasLineas] = useState({}); // { propId: { estrId: [{...}] } }

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [finalConfirmOpen, setFinalConfirmOpen] = useState(false);
  const [finalUncheckConfirmOpen, setFinalUncheckConfirmOpen] = useState(false);
  const [envioFinalChecked, setEnvioFinalChecked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Cargar feedback existente y estado de envío final
  useEffect(() => {
    const cargarFeedbackUsuario = async () => {
      try {
        const response = await fetchWithAuth('/api/objetivos/feedback-avance/');
        if (!response.ok) return;
        const data = await response.json();
        const feedbackPreCargado = {};
        let algunoMarcadoFinal = false;
        for (const fb of data) {
          feedbackPreCargado[fb.clave] = {
            acuerdo: fb.acuerdo,
            comentarios: {
              comoDecir: fb.comoDecir,
              justificacion: fb.justificacion,
            },
            envio_final: fb.envio_final ?? false
          };
          if (fb.envio_final) algunoMarcadoFinal = true;
        }
        setFeedback(feedbackPreCargado);
        setEnvioFinalChecked(algunoMarcadoFinal);
      } catch (err) {}
    };
    cargarFeedbackUsuario();
  }, [setFeedback]);

  // ------- FUNCIONES AGREGAR --------
  const generarId = () => `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const handleAgregarEstrategia = (propId) => {
    const nombre = prompt('Nombre de la nueva Estrategia:');
    if (!nombre || !nombre.trim()) return;
    const nuevaEstrategia = {
      pk: generarId(),
      nombre,
      lineas: []
    };
    setNuevasEstrategias(prev => ({
      ...prev,
      [propId]: [...(prev[propId] || []), nuevaEstrategia]
    }));
  };

  const handleAgregarLinea = (propId, estrId) => {
    const text = prompt('Texto de la nueva Línea de Acción:');
    if (!text || !text.trim()) return;
    const nuevaLinea = {
      pk: generarId(),
      text
    };
    setNuevasLineas(prev => ({
      ...prev,
      [propId]: {
        ...(prev[propId] || {}),
        [estrId]: [...((prev[propId] || {})[estrId] || []), nuevaLinea]
      }
    }));
  };

  // ------- RENDER HELPERS --------
  const handleAcuerdoChange = (id, valor) => setAcuerdo(id, valor);
  const handleComentarioChange = (id, campo, valor) => setComentario(id, campo, valor);

  const renderLineas = (prefix, propId, estrId, lineasEstaticas = []) => {
    const lineasNuevas = ((nuevasLineas[propId] || {})[estrId]) || [];
    return (
      <ul>
        {/* Líneas estáticas */}
        {lineasEstaticas.map((l, idx) => {
          const fid = `${prefix}-linea-${l.id}`;
          return (
            <li key={l.pk || l.clave || `${l.id}-${idx}`} className={styles.lineaAccion}>
              <p>{l.text}</p>
              <FeedbackSection
                id={fid}
                acuerdo={feedback[fid]?.acuerdo}
                comentarios={feedback[fid]?.comentarios}
                onAcuerdoChange={handleAcuerdoChange}
                onComentarioChange={handleComentarioChange}
              />
            </li>
          );
        })}
        {/* Líneas nuevas */}
        {lineasNuevas.map((l, idx) => (
          <li key={l.pk || idx} className={styles.lineaAccion} style={{ color: "#0055a7" }}>
            <p>{l.text}</p>
          </li>
        ))}
        {/* Botón agregar línea */}
        <li>
          <button className={styles.addButton} onClick={() => handleAgregarLinea(propId, estrId)}>
            Agregar Línea de Acción
          </button>
        </li>
      </ul>
    );
  };

  const renderEstrategias = (propId, prefix, estrategiasEstaticas = []) => {
    const estrategiasNuevas = nuevasEstrategias[propId] || [];
    return (
      <>
        {/* Estrategias estáticas */}
        {estrategiasEstaticas.map((estr, idx) => {
          const fid = `${prefix}-estrategia-${estr.id}`;
          const lineas = estr.lineas || [];
          return (
            <div key={estr.pk || estr.clave || estr.id || idx} className={styles.estrategia}>
              <h4>{estr.nombre || estr.Estrategia}</h4>
              <FeedbackSection
                id={fid}
                acuerdo={feedback[fid]?.acuerdo}
                comentarios={feedback[fid]?.comentarios}
                onAcuerdoChange={handleAcuerdoChange}
                onComentarioChange={handleComentarioChange}
              />
              {renderLineas(fid, propId, estr.pk || estr.id, lineas)}
            </div>
          );
        })}
        {/* Estrategias nuevas */}
        {estrategiasNuevas.map((estr, idx) => {
          const fid = `${prefix}-estrategia-${estr.pk}`;
          return (
            <div key={estr.pk || idx} className={styles.estrategia} style={{ background: "#f7f7f7" }}>
              <h4>{estr.nombre}</h4>
              {renderLineas(fid, propId, estr.pk, estr.lineas)}
            </div>
          );
        })}
        {/* Botón agregar estrategia */}
        <button className={styles.addButton} onClick={() => handleAgregarEstrategia(propId)}>
          Agregar Estrategia
        </button>
      </>
    );
  };

  const renderPropuestasEstaticas = (eje, propuestas) =>
    propuestas.map(prop => {
      const prefix = `${eje}-propuesta-${prop.id}`;
      const estrategias = prop.Estrategias || [];
      return (
        <div key={prop.id} className={styles.propuesta}>
          <h3>{prop['Propuesta Objetivo']}</h3>
          <FeedbackSection
            id={prefix}
            acuerdo={feedback[prefix]?.acuerdo}
            comentarios={feedback[prefix]?.comentarios}
            onAcuerdoChange={handleAcuerdoChange}
            onComentarioChange={handleComentarioChange}
          />
          {renderEstrategias(prop.id, prefix, estrategias)}
        </div>
      );
    });

  return (
    <div className={styles.container}>
      <div className={styles.containerReview}>
        <h2>
          <span className="spanDoarado">Revisión</span> de la{' '}
          <span className="spanVino">Plataforma Estratégica</span>
        </h2>
        {loading ? (
          <p>Cargando ejes...</p>
        ) : selectedCodes.length === 0 ? (
          <p>No hay ejes seleccionados.</p>
        ) : selectedCodes.map(ejeCode => {
          const block = staticWithId.find(b => b.eje === ejeCode);
          return (
            <div key={ejeCode} className={styles.propuesta}>
              <h3 className={styles.ejeActivo}>Observación eje: {ejeCode}</h3>
              {block?.propuestas?.length
                ? renderPropuestasEstaticas(ejeCode, block.propuestas)
                : <p>No hay datos estáticos.</p>}
            </div>
          );
        })}
      </div>
      {/* Botón de guardar avance y checkbox de envío final */}
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
                checked={envioFinalChecked}
                onChange={() => {
                  if (!envioFinalChecked) {
                    setFinalConfirmOpen(true);
                  } else {
                    setFinalUncheckConfirmOpen(true);
                  }
                }}
                disabled={isSaving}
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
      {/* Diálogos de confirmación y feedback */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          // Aquí iría tu función para guardar feedback
          // await handleGuardarComentarios();
        }}
        title="¿Estás seguro de que quieres guardar tu avance?"
        confirmText="Sí, guardar"
        cancelText="Cancelar"
      />

      <ConfirmDialog
        open={finalConfirmOpen}
        onClose={() => setFinalConfirmOpen(false)}
        onConfirm={async () => {
          setEnvioFinalChecked(true);
          setFinalConfirmOpen(false);
          // await handleGuardarComentarios(true);
        }}
        title="¿Estás seguro de enviar como versión final?"
        confirmText="Sí, confirmar envío final"
        cancelText="Cancelar"
      />

      <ConfirmDialog
        open={finalUncheckConfirmOpen}
        onClose={() => setFinalUncheckConfirmOpen(false)}
        onConfirm={async () => {
          setEnvioFinalChecked(false);
          setFinalUncheckConfirmOpen(false);
          // await handleGuardarComentarios(false);
          setSnackbar({
            open: true,
            message: 'Entrega final desmarcada. Se considerará como entregable final el último envío con la fecha de finalización.',
            severity: 'info',
          });
        }}
        title="¿Estás seguro de quitar la entrega final?"
        confirmText="Sí, quitar entrega final"
        cancelText="Cancelar"
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
