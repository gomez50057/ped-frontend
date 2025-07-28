
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

export default function PlataformaEstrategicaReview() {
  const { selectedCodes, loading } = useSelectedAxes();
  const staticWithId = useStaticWithId();
  const { feedback, setAcuerdo, setComentario, setFeedback } = useFeedback();
  const [nuevasEstrategias, setNuevasEstrategias] = useState({});
  const [nuevasLineas, setNuevasLineas] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [envioFinalChecked, setEnvioFinalChecked] = useState(false);

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
      } catch (err) { }
    };
    cargarFeedbackUsuario();
  }, [setFeedback]);


  // Función para precargar los dinámicos guardados
  const cargarMisObjetivos = async () => {
    try {
      const res = await fetchWithAuth('/api/objetivos/mis-objetivos/');
      if (!res.ok) {
        console.error('Error al cargar objetivos:', res.status);
        return;
      }
      const { objetivos: saved = [] } = await res.json();

      const initEstr = {};
      const initLine = {};

      saved.forEach(o => {
        const propId = o.clave;
        o.estrategias.forEach(est => {
          if (est.clave.startsWith('dinamico_')) {
            // Estrategia dinámica completa
            initEstr[propId] = initEstr[propId] || [];
            initEstr[propId].push({
              clave: est.clave,
              nombre: est.nombre,
              lineas: []
            });
            // Líneas propias de esta estrategia dinámica
            if (est.lineas && est.lineas.length) {
              initLine[propId] = initLine[propId] || {};
              initLine[propId][est.clave] = est.lineas.map(l => ({
                pk: l.clave,
                clave: l.clave,
                text: l.text
              }));
            }
          } else {
            // Estrategia estática: cargamos sólo líneas dinámicas anexas
            (est.lineas || []).forEach(l => {
              if (l.clave.startsWith('dinamico_')) {
                initLine[propId] = initLine[propId] || {};
                initLine[propId][est.clave] = initLine[propId][est.clave] || [];
                initLine[propId][est.clave].push({
                  pk: l.clave,
                  clave: l.clave,
                  text: l.text
                });
              }
            });
          }
        });
      });

      setNuevasEstrategias(initEstr);
      setNuevasLineas(initLine);
    } catch (err) {
      console.error('Error al precargar dinámicos:', err);
    }
  };

  useEffect(() => {
    cargarMisObjetivos();
  }, []);



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
        {lineasNuevas.map((l, idx) => {
          // detectamos si es línea dinámica
          const isDinamico = l.pk.startsWith('dinamico_') || l.pk.startsWith('temp_');
          return (
            <li key={l.pk} className={styles.lineaAccion} style={{ color: "#0055a7" }}>
              <p>{l.text}</p>

              {isDinamico && (
                <div className={styles.nuevaAportacion}>
                  <p>soy nueva aportación</p>
                </div>
              )}
            </li>
          );
        })}
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
        {estrategiasNuevas.map(estr => {
          // detectamos si esta estrategia es dinámica
          const isDinamico = estr.clave.startsWith('dinamico_');
          return (
            <div key={estr.clave} className={styles.estrategia}>
              <h4>{estr.nombre}</h4>

              {isDinamico && (
                <div className={styles.nuevaAportacion}>
                  <p>soy nueva aportación</p>
                </div>
              )}

              {renderLineas(
                `${prefix}-estrategia-${estr.clave}`,
                propId,
                estr.clave,
                estr.lineas
              )}
            </div>
          );
        })}
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

      <div className={styles.buttonsContainer}>
        
      </div>




      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}  // 8 segundos
        onClose={(event, reason) => {
          // no cerramos si el usuario hace click fuera
          if (reason === 'clickaway') return;
          setSnackbar(prev => ({ ...prev, open: false }));
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
