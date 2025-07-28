
"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFeedback } from '@/hooks/useFeedback';
import styles from './PlataformaEstrategicaReview.module.css';
import FeedbackSection from '../components/FeedbackSection/FeedbackSection';
import { fetchWithAuth } from '@/utils/auth';
import { useSelectedAxes } from '@/hooks/StrategicPlatform/useSelectedAxes';
import { useStaticWithId } from '@/hooks/StrategicPlatform/useStaticWithId';

export default function PlataformaEstrategicaReview() {
  const { selectedCodes } = useSelectedAxes();
  const bloques = useStaticWithId();
  const { feedback, setAcuerdo, setComentario, setFeedback } = useFeedback();

  const [dinamicos, setDinamicos] = useState({ estrategias: {}, lineas: {} });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Carga inicial: feedback y dinámicos
  useEffect(() => {
    async function loadAll() {
      try {
        const [fbRes, objRes] = await Promise.all([
          fetchWithAuth('/api/objetivos/feedback-avance/'),
          fetchWithAuth('/api/objetivos/mis-objetivos/')
        ]);
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          const loadedFeedback = {};
          fbData.forEach(fb => {
            const id = fb.clave;
            loadedFeedback[id] = {
              acuerdo: fb.acuerdo,
              comentarios: { comoDecir: fb.comoDecir, justificacion: fb.justificacion }
            };
          });
          setFeedback(loadedFeedback);
        }
        if (objRes.ok) {
          const { objetivos = [] } = await objRes.json();
          const estrMap = {};
          const linMap = {};
          objetivos.forEach(o => {
            const pid = o.clave;
            o.estrategias.forEach(est => {
              if (est.clave.startsWith('dinamico_')) {
                estrMap[pid] = estrMap[pid] || [];
                estrMap[pid].push(est);
                if (est.lineas?.length) {
                  linMap[pid] = linMap[pid] || {};
                  linMap[pid][est.clave] = est.lineas;
                }
              } else {
                est.lineas?.filter(l => l.clave.startsWith('dinamico_')).forEach(l => {
                  linMap[pid] = linMap[pid] || {};
                  linMap[pid][est.clave] = linMap[pid][est.clave] || [];
                  linMap[pid][est.clave].push(l);
                });
              }
            });
          });
          setDinamicos({ estrategias: estrMap, lineas: linMap });
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    }
    loadAll();
  }, [setFeedback]);

  const handleAcuerdo = useCallback((id, val) => setAcuerdo(id, val), [setAcuerdo]);
  const handleComentario = useCallback((id, campo, val) => setComentario(id, campo, val), [setComentario]);

  const renderLineas = useCallback((prefix, pid, eid, estaticas = []) => {
    const nuevas = dinamicos.lineas[pid]?.[eid] || [];
    return (
      <ul>
        {estaticas.map(l => (
          <li key={l.pk || l.clave || l.id} className={styles.lineaAccion}>
            <p>{l.text}</p>
            <FeedbackSection
              id={`${prefix}-linea-${l.id}`}
              acuerdo={feedback[`${prefix}-linea-${l.id}`]?.acuerdo}
              comentarios={feedback[`${prefix}-linea-${l.id}`]?.comentarios}
              onAcuerdoChange={handleAcuerdo}
              onComentarioChange={handleComentario}
            />
          </li>
        ))}
        {nuevas.map(l => (
          <li key={l.clave} className={styles.lineaAccion} style={{ color: '#0055a7' }}>
            <p>{l.text}</p>
            <div className={styles.nuevaAportacion}><p>Nueva aportación</p></div>
          </li>
        ))}
      </ul>
    );
  }, [dinamicos.lineas, feedback, handleAcuerdo, handleComentario]);

  const renderEstrategias = useCallback((pid, prefix, estaticas = []) => {
    const nuevas = dinamicos.estrategias[pid] || [];
    return (
      <>
        {estaticas.map(est => (
          <div key={est.pk || est.clave || est.id} className={styles.estrategia}>
            <h4>{est.nombre}</h4>
            <FeedbackSection
              id={`${prefix}-estrategia-${est.id}`}
              acuerdo={feedback[`${prefix}-estrategia-${est.id}`]?.acuerdo}
              comentarios={feedback[`${prefix}-estrategia-${est.id}`]?.comentarios}
              onAcuerdoChange={handleAcuerdo}
              onComentarioChange={handleComentario}
            />
            {renderLineas(`${prefix}-estrategia-${est.id}`, pid, est.id, est.lineas || [])}
          </div>
        ))}
        {nuevas.map(est => (
          <div key={est.clave} className={styles.estrategia}>
            <h4>{est.nombre}</h4>
            <div className={styles.nuevaAportacion}><p>Nueva aportación</p></div>
            {renderLineas(`${prefix}-estrategia-${est.clave}`, pid, est.clave, est.lineas || [])}
          </div>
        ))}
      </>
    );
  }, [dinamicos.estrategias, feedback, handleAcuerdo, handleComentario, renderLineas]);

  const renderPropuestas = useMemo(() => {
    return (eje, propuestas = []) => (
      propuestas.map(prop => {
        const prefix = `${eje}-propuesta-${prop.id}`;
        return (
          <div key={prop.id} className={styles.propuesta}>
            <h3>{prop['Propuesta Objetivo']}</h3>
            <FeedbackSection
              id={prefix}
              acuerdo={feedback[prefix]?.acuerdo}
              comentarios={feedback[prefix]?.comentarios}
              onAcuerdoChange={handleAcuerdo}
              onComentarioChange={handleComentario}
            />
            {renderEstrategias(prop.id, prefix, prop.Estrategias)}
          </div>
        );
      })
    );
  }, [feedback, handleAcuerdo, handleComentario, renderEstrategias]);

  return (
    <div className={styles.container}>
      <div className={styles.containerReview}>
        <h2><span className="spanDoarado">Revisión</span> de la <span className="spanVino">Plataforma Estratégica</span></h2>
        {selectedCodes.length === 0
          ? <p>No hay ejes seleccionados.</p>
          : selectedCodes.map(eje => (
            <div key={eje} className={styles.propuesta}>
              <h3 className={styles.ejeActivo}>Observación eje: {eje}</h3>
              {bloques.find(b => b.eje === eje)?.propuestas?.length
                ? renderPropuestas(eje, bloques.find(b => b.eje === eje).propuestas)
                : <p>No hay datos estáticos.</p>
              }
            </div>
          ))
        }
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={8000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
