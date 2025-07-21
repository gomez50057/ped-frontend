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
import { prepararObjetivoParaEnvio, transformarParaBackend } from '@/utils/objetivosHelper'
import { generarClaveDinamico } from '@/utils/objetivosHelper';
import EditDeleteButtons from '@/components/dashboard/components/EditDeleteButtons/EditDeleteButtons';

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

  //  // --- PRELOAD: traer dinámicos ya guardados ---
  //  useEffect(() => {
  //    const cargarMisObjetivos = async () => {
  //      try {
  //        const res = await fetchWithAuth('/api/objetivos/mis-objetivos/');
  //        if (!res.ok) return;
  //        const { objetivos: saved } = await res.json();

  //        const initEstr = {};
  //        const initLine = {};

  //        saved.forEach(o => {
  //          const propId = o.clave;
  //          o.estrategias.forEach(est => {
  //            if (est.clave.startsWith('dinamico_')) {
  //              // 1) Estrategia completamente nueva
  //              initEstr[propId] = initEstr[propId] || [];
  //              initEstr[propId].push({
  //                clave: est.clave,
  //                nombre: est.nombre,
  //                lineas: [] 
  //              });
  //              // 1.a) Si trae líneas propias
  //              if (est.lineas?.length) {
  //                initLine[propId] = initLine[propId] || {};
  //                initLine[propId][est.clave] = est.lineas.map(l => ({
  //                  clave: l.clave,
  //                  text:   l.text,
  //                  pk:     l.clave
  //                }));
  //              }
  //            } else {
  //              // 2) Estrategia estática: sólo cargamos líneas dinámicas
  //              est.lineas?.forEach(l => {
  //                if (l.clave.startsWith('dinamico_')) {
  //                  initLine[propId] = initLine[propId] || {};
  //                  initLine[propId][est.clave] = initLine[propId][est.clave] || [];
  //                  initLine[propId][est.clave].push({
  //                    clave: l.clave,
  //                    text:   l.text,
  //                    pk:     l.clave
  //                  });
  //                }
  //              });
  //            }
  //          });
  //        });

  //        setNuevasEstrategias(initEstr);
  //        setNuevasLineas(initLine);
  //      } catch (e) {
  //        console.error('Error al precargar dinámicos:', e);
  //      }
  //    };
  //    cargarMisObjetivos();
  //  }, []);  

  // se ejecuta una sola vez al montar

  // ------- FUNCIONES AGREGAR --------
  const generarId = () => `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const handleAgregarEstrategia = (propId) => {
    const nombre = prompt('Nombre de la nueva Estrategia:');
    if (!nombre?.trim()) return;
    const clave = generarClaveDinamico();            // → “dinamico_1”, “dinamico_2”, …
    const nuevaEstrategia = { clave, nombre, lineas: [] };
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

  function extraerNuevosObjetivos(staticWithId, nuevasEstrategias, nuevasLineas) {
    const resultado = [];

    staticWithId.forEach(eje => {
      (eje.propuestas || []).forEach(prop => {
        const propId = prop.id || prop.clave || prop.pk;

        // 1. cuáles claves de estrategia vienen completamente nuevas
        const clavesDyn = (nuevasEstrategias[propId] || []).map(e => e.clave);

        // 2. construir las estrategias dinámicas con sus propias líneas
        const nuevasEstras = (nuevasEstrategias[propId] || []).map(estr => {
          // líneas iniciales asociadas a la creación de la estrategia
          const lineasDesdeEstr = estr.lineas || [];
          // líneas adicionales que el usuario añadió después
          const lineasExtra = (nuevasLineas[propId]?.[estr.clave] || []);
          const todasLineas = [...lineasDesdeEstr, ...lineasExtra];

          return {
            nombre: estr.nombre,
            lineas: todasLineas.map(l => ({ text: l.text }))
          };
        });

        // 3. recopilar sólo las líneas nuevas de las estrategias estáticas
        const nuevasLineasPorEstrategia = [];
        Object.entries(nuevasLineas[propId] || {}).forEach(([estrId, arr]) => {
          if (!clavesDyn.includes(estrId) && arr.length > 0) {
            nuevasLineasPorEstrategia.push({
              estrategia_clave: estrId,
              lineas: arr.map(l => ({ text: l.text }))
            });
          }
        });

        // 4. solo si hay algo que enviar
        if (nuevasEstras.length > 0 || nuevasLineasPorEstrategia.length > 0) {
          resultado.push({
            clave: prop.clave || prop.id,
            nuevas_estrategias: nuevasEstras,
            nuevas_lineas: nuevasLineasPorEstrategia
          });
        }
      });
    });

    return resultado;
  }

  const handleGuardarNuevos = async () => {
    // 1) Extraemos y validamos cambios
    const nuevos = extraerNuevosObjetivos(staticWithId, nuevasEstrategias, nuevasLineas);
    if (nuevos.length === 0) {
      setSnackbar({ open: true, message: "No hay cambios nuevos que enviar.", severity: "info" });
      return;
    }
    setIsSaving(true);

    // 2) Preparamos el payload
    const objetivosPreparados = nuevos.map(o =>
      transformarParaBackend(prepararObjetivoParaEnvio(o))
    );

    try {
      // 3) Intentamos crear (POST)
      let res = await fetchWithAuth('/api/objetivos/mis-objetivos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objetivos: objetivosPreparados })
      });

      if (!res.ok) {
        const errorText = await res.text();
        let needPut = false;
        try {
          const errData = JSON.parse(errorText);
          if (errData.detail?.includes("usa PUT")) needPut = true;
        } catch { }

        if (needPut) {
          // 4) Si el servidor pide PUT
          res = await fetchWithAuth('/api/objetivos/mis-objetivos/', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ objetivos: objetivosPreparados })
          });
          if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`Error al actualizar: ${errBody}`);
          }
        } else {
          throw new Error(`Error al guardar: ${errorText}`);
        }
      }

      // 5) Éxito → recargamos los dinámicos guardados
      setSnackbar({ open: true, message: "¡Cambios guardados!", severity: "success" });
      setNuevasEstrategias({});  // limpiamos temporales
      setNuevasLineas({});       // limpiamos temporales
      await cargarMisObjetivos(); // recargamos desde el servidor

    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };


  const handleEditEstrategia = (propId, estrategiaEditada) => {
    setNuevasEstrategias(prev => ({
      ...prev,
      [propId]: prev[propId].map(e =>
        e.clave === estrategiaEditada.clave ? estrategiaEditada : e
      )
    }));
  };
  const handleDeleteEstrategia = (propId, claveDinamica) => {
    setNuevasEstrategias(prev => ({
      ...prev,
      [propId]: prev[propId].filter(e => e.clave !== claveDinamica)
    }));
  };

  // 2) Dentro de PlataformaEstrategicaReview, añade estos handlers:
  const handleEditLinea = (propId, estrId, lineaEditada) => {
    setNuevasLineas(prev => ({
      ...prev,
      [propId]: {
        ...prev[propId],
        [estrId]: prev[propId][estrId].map(l =>
          l.pk === lineaEditada.pk ? lineaEditada : l
        )
      }
    }));
  };

  const handleDeleteLinea = (propId, estrId, lineaPk) => {
    setNuevasLineas(prev => ({
      ...prev,
      [propId]: {
        ...prev[propId],
        [estrId]: prev[propId][estrId].filter(l => l.pk !== lineaPk)
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
        {lineasNuevas.map((l, idx) => {
          // detectamos si es línea dinámica
          const isDinamico = l.pk.startsWith('dinamico_') || l.pk.startsWith('temp_');
          return (
            <li key={l.pk} className={styles.lineaAccion} style={{ color: "#0055a7" }}>
              <p>{l.text}</p>

              {isDinamico && (
                <EditDeleteButtons
                  onEdit={() => {
                    const nuevaText = prompt('Editar Línea:', l.text) || l.text;
                    handleEditLinea(propId, estrId, { ...l, text: nuevaText });
                  }}
                  onDelete={() => handleDeleteLinea(propId, estrId, l.pk)}
                />
              )}
            </li>
          );
        })}
        {/* Botón agregar línea */}
        <li>
          <button className={styles.addButton}
            onClick={() => handleAgregarLinea(propId, estrId)}>
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
        {estrategiasNuevas.map(estr => {
          // detectamos si esta estrategia es dinámica
          const isDinamico = estr.clave.startsWith('dinamico_');
          return (
            <div key={estr.clave} className={styles.estrategia}>
              <h4>{estr.nombre}</h4>

              {isDinamico && (
                <EditDeleteButtons
                  isDinamico
                  estrategia={estr}
                  onEdit={(preparada) => handleEditEstrategia(propId, preparada)}
                  onDelete={() => handleDeleteEstrategia(propId, estr.clave)}
                />
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

          <div className={styles.buttonWrapper}>
            <button
              type="button"
              className={styles.slideButton}
              onClick={handleGuardarNuevos}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios agregados'}
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
