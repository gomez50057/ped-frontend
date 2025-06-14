"use client";

import React, { useState, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { dataObjetivoEG01, dataObjetivoEG02, dataObjetivoEG03, dataObjetivoEG04, dataObjetivoEG05, dataObjetivoEG06, dataObjetivoEG07, dataObjetivoEG08, dataObjetivoEG09, dataObjetivoET01, dataObjetivoET02, dataObjetivoET03, } from '@/utils/plataformaEstrategicaData';
import { updateById, removeById, pushToArrayById, pushToNestedMapArray } from '@/utils/arrayHelpers';
import { usePlatform } from '@/context/PlatformContext';
import { useFeedback } from '@/hooks/useFeedback';
import { v4 as uuidv4 } from 'uuid';
import styles from './PlataformaEstrategicaReview.module.css';
import FeedbackSection from '../components/FeedbackSection/FeedbackSection';
import EditDeleteButtons from '../components/EditDeleteButtons/EditDeleteButtons';

const allData = [
  { id: 'EG01', data: dataObjetivoEG01 },
  { id: 'EG02', data: dataObjetivoEG02 },
  { id: 'EG03', data: dataObjetivoEG03 },
  { id: 'EG04', data: dataObjetivoEG04 },
  { id: 'EG05', data: dataObjetivoEG05 },
  { id: 'EG06', data: dataObjetivoEG06 },
  { id: 'EG07', data: dataObjetivoEG07 },
  { id: 'EG08', data: dataObjetivoEG08 },
  { id: 'EG09', data: dataObjetivoEG09 },
  { id: 'ET01', data: dataObjetivoET01 },
  { id: 'ET02', data: dataObjetivoET02 },
  { id: 'ET03', data: dataObjetivoET03 },
];

export default function PlataformaEstrategicaReview() {
  const { selectedEjes } = usePlatform();
  const { feedback, setAcuerdo, setComentario } = useFeedback();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [nuevoContenido, setNuevoContenido] = useState({ propuestas: [] });
  // Para nuevas estrategias de datos estáticos
  const [nuevasEstrategias, setNuevasEstrategias] = useState({});
  // Para nuevas líneas de acción (estáticos y dinámicos unificados)
  const [nuevasLineas, setNuevasLineas] = useState({});

  // Generar IDs para datos estáticos
  const staticWithId = useMemo(() =>
    allData.map(({ id: eje, data }) => ({
      eje,
      propuestas: data.map(prop => ({
        ...prop,
        id: uuidv4(),
        Estrategias: (prop.Estrategias || []).map(estr => ({
          ...estr,
          id: uuidv4(),
          lineas: (estr['Lineas de acción'] || []).map(lin => ({ id: uuidv4(), text: lin })),
        })),
      })),
    })), []
  );

  const handleAcuerdoChange = (id, valor) => setAcuerdo(id, valor);
  const handleComentarioChange = (id, campo, valor) => setComentario(id, campo, valor);

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleGuardarAvance = () => setSnackbar({ open: true, message: '¡Avance guardado!', severity: 'info' });
  const handleGuardarComentarios = () => setSnackbar({ open: true, message: '¡Comentarios enviados!', severity: 'success' });

  const agregarElemento = (promptText, callback) => {
    const nombre = prompt(promptText);
    if (!nombre) return;
    callback(nombre);
  };

  const handleAgregarPropuesta = () => {
    agregarElemento('Nueva Propuesta', (nombre) => {
      setNuevoContenido(prev => ({
        propuestas: [...prev.propuestas, { id: uuidv4(), nombre, estrategias: [] }]
      }));
    });
  };

  const handleAgregarEstrategiaGeneral = (propuestaId, isStatic) => {
    const promptText = isStatic ? 'Proponer nueva Estrategia' : 'Nueva Estrategia';
    agregarElemento(promptText, (nombre) => {
      const nuevaEstrategia = { id: uuidv4(), nombre, lineas: [] };

      if (isStatic) {
        setNuevasEstrategias(prev => ({
          ...prev,
          [propuestaId]: [...(prev[propuestaId] || []), nuevaEstrategia]
        }));
      } else {
        setNuevoContenido(prev => ({
          ...prev,
          propuestas: pushToArrayById(prev.propuestas, propuestaId, 'estrategias', nuevaEstrategia)
        }));
      }
    });
  };

  const handleAgregarLineaStatic = (propuestaId, estrategiaId) => {
    agregarElemento('Agregar nuevo Lineamiento', (text) => {
      const nuevaLinea = { id: uuidv4(), text };
      setNuevasLineas(prev =>
        pushToNestedMapArray(prev, propuestaId, estrategiaId, nuevaLinea)
      );
    });
  };

  const renderLineas = (prefix, originales, propId, estrId) => {
    const extra = nuevasLineas[propId]?.[estrId] || [];

    const isDynamicLinea = (lineaId) => {
      const propuesta = nuevoContenido.propuestas.find(p => p.id === propId);
      if (!propuesta) return false;
      const estrategia = propuesta.estrategias.find(e => e.id === estrId);
      if (!estrategia) return false;
      return estrategia.lineas.some(l => l.id === lineaId);
    };

    const handleEditLinea = (lineaId) => {
      const nuevoTexto = prompt('Editar línea de acción');
      if (nuevoTexto !== null) {
        setNuevoContenido(prev => ({
          ...prev,
          propuestas: updateById(prev.propuestas, propId, p => ({
            ...p,
            estrategias: updateById(p.estrategias, estrId, e => ({
              ...e,
              lineas: updateById(e.lineas, lineaId, l => ({
                ...l,
                text: nuevoTexto
              }))
            }))
          }))
        }));
      }
    };

    const handleDeleteLinea = (lineaId) => {
      setNuevoContenido(prev => ({
        ...prev,
        propuestas: updateById(prev.propuestas, propId, p => ({
          ...p,
          estrategias: updateById(p.estrategias, estrId, e => ({
            ...e,
            lineas: removeById(e.lineas, lineaId)
          }))
        }))
      }));
    };

    const handleEditLineaStatic = (lineaId) => {
      const nuevoTexto = prompt('Editar línea de acción');
      if (nuevoTexto !== null) {
        setNuevasLineas(prev => {
          const prop = prev[propId] || {};
          const lineas = prop[estrId] || [];
          return {
            ...prev,
            [propId]: {
              ...prop,
              [estrId]: lineas.map(l =>
                l.id === lineaId ? { ...l, text: nuevoTexto } : l
              )
            }
          };
        });
      }
    };

    const handleDeleteLineaStatic = (lineaId) => {
      setNuevasLineas(prev => {
        const prop = prev[propId] || {};
        const lineas = prop[estrId] || [];
        return {
          ...prev,
          [propId]: {
            ...prop,
            [estrId]: lineas.filter(l => l.id !== lineaId)
          }
        };
      });
    };

    return [...originales, ...extra].map(l => {
      const fid = `${prefix}-linea-${l.id}`;
      const esOriginal = originales.find(o => o.id === l.id);
      const esDinamica = isDynamicLinea(l.id);
      const esExtraStatic = extra.find(e => e.id === l.id);

      return (
        <li key={l.id} className={styles.lineaAccion}>
          <p>{l.text}</p>
          {(esDinamica || (esExtraStatic && !esDinamica)) && (
            <EditDeleteButtons
              onEdit={() =>
                esDinamica
                  ? handleEditLinea(l.id)
                  : handleEditLineaStatic(l.id)
              }
              onDelete={() =>
                esDinamica
                  ? handleDeleteLinea(l.id)
                  : handleDeleteLineaStatic(l.id)
              }
            />
          )}
          {esOriginal && (
            <FeedbackSection
              id={fid}
              acuerdo={feedback[fid]?.acuerdo}
              comentarios={feedback[fid]?.comentarios}
              onAcuerdoChange={handleAcuerdoChange}
              onComentarioChange={handleComentarioChange}
            />
          )}
        </li>
      );
    });
  };

  const renderEstrategias = (propId, prefix, estrategias = [], showQuestion = false) =>
    estrategias.map(estr => {
      const fid = `${prefix}-estrategia-${estr.id}`;
      const lineas = estr.lineas || [];

      const esDinamica = nuevoContenido.propuestas.some(p =>
        p.id === propId && p.estrategias.some(e => e.id === estr.id)
      );

      const esExtraStatic = nuevasEstrategias[propId]?.some(e => e.id === estr.id);

      const handleEditEstrategia = (nuevoNombre) => {
        if (esDinamica) {
          setNuevoContenido(prev => ({
            ...prev,
            propuestas: updateById(prev.propuestas, propId, p => ({
              ...p,
              estrategias: updateById(p.estrategias, estr.id, e => ({
                ...e,
                nombre: nuevoNombre
              }))
            }))
          }));
        } else if (esExtraStatic) {
          setNuevasEstrategias(prev => ({
            ...prev,
            [propId]: prev[propId].map(e =>
              e.id === estr.id ? { ...e, nombre: nuevoNombre } : e
            )
          }));
        }
      };

      const handleDeleteEstrategia = () => {
        if (esDinamica) {
          setNuevoContenido(prev => ({
            ...prev,
            propuestas: updateById(prev.propuestas, propId, p => ({
              ...p,
              estrategias: removeById(p.estrategias, estr.id)
            }))
          }));
        } else if (esExtraStatic) {
          setNuevasEstrategias(prev => ({
            ...prev,
            [propId]: removeById(prev[propId], estr.id)
          }));
        }
      };

      return (
        <div key={estr.id} className={styles.estrategia}>
          <h4>
            {estr.Estrategia || estr.nombre}
            {!showQuestion && (
              <>
                <EditDeleteButtons
                  onEdit={() => {
                    const nuevoNombre = prompt('Editar estrategia', estr.Estrategia || estr.nombre);
                    if (nuevoNombre !== null) {
                      handleEditEstrategia(nuevoNombre);
                    }
                  }}
                  onDelete={handleDeleteEstrategia}
                />
              </>
            )}
          </h4>

          {showQuestion && (
            <FeedbackSection
              id={fid}
              acuerdo={feedback[fid]?.acuerdo}
              comentarios={feedback[fid]?.comentarios}
              onAcuerdoChange={handleAcuerdoChange}
              onComentarioChange={handleComentarioChange}
            />
          )}

          <ul>{renderLineas(fid, lineas, propId, estr.id)}</ul>

          <button
            className={styles.addButton}
            onClick={() => handleAgregarLineaStatic(propId, estr.id)}
          >
            Agregar Línea de Acción
          </button>
        </div>
      );
    });

  const renderPropuestas = (eje, propuestas) =>
    propuestas.map(prop => {
      const prefix = `${eje}-propuesta-${prop.id}`;
      const isStatic = !!prop['Propuesta Objetivo'];
      const estrategiasExistentes = prop.Estrategias || [];
      const estrategiasNuevas = nuevasEstrategias[prop.id] || [];

      return (
        <div key={prop.id} className={styles.propuesta}>
          <h3>{prop['Propuesta Objetivo'] || prop.nombre}</h3>

          {isStatic && (
            <FeedbackSection
              id={prefix}
              acuerdo={feedback[prefix]?.acuerdo}
              comentarios={feedback[prefix]?.comentarios}
              onAcuerdoChange={handleAcuerdoChange}
              onComentarioChange={handleComentarioChange}
            />
          )}

          {renderEstrategias(prop.id, prefix, estrategiasExistentes, isStatic)}
          {renderEstrategias(prop.id, prefix, estrategiasNuevas, false)}

          <button
            className={styles.addButton}
            onClick={() => handleAgregarEstrategiaGeneral(prop.id, isStatic)}
          >
            {isStatic ? 'Proponer Estrategia' : 'Agregar Estrategia'}
          </button>
        </div>
      );
    });

  const renderNuevasPropuestas = () =>
    nuevoContenido.propuestas.map(p => {
      const prefix = `${p.id}-propuesta`;

      return (
        <div key={p.id} className={styles.propuesta}>
          <h3>
            {p.nombre}
            <EditDeleteButtons
              onEdit={() => {
                const nombre = prompt('Editar propuesta', p.nombre);
                if (nombre !== null) {
                  setNuevoContenido(prev => ({
                    ...prev,
                    propuestas: updateById(prev.propuestas, p.id, x => ({ ...x, nombre }))
                  }));
                }
              }}
              onDelete={() =>
                setNuevoContenido(prev => ({
                  ...prev,
                  propuestas: removeById(prev.propuestas, p.id)
                }))
              }
            />
          </h3>
          <button
            className={styles.addButton}
            onClick={() => handleAgregarEstrategiaGeneral(p.id, false)}
          >
            Agregar Estrategia
          </button>

          {renderEstrategias(p.id, prefix, p.estrategias, false)}
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

        {selectedEjes.length === 0 ? (
          <p>No hay ejes seleccionados.</p>
        ) : selectedEjes.map(eje => {
          const block = staticWithId.find(b => b.eje === eje);
          return (
            <div key={eje} className={styles.propuesta}>
              <h3 className={styles.ejeActivo}>Observación eje: {eje}</h3>
              {block?.propuestas.length
                ? renderPropuestas(eje, block.propuestas)
                : <p>No hay datos.</p>}
            </div>
          );
        })}

        {renderNuevasPropuestas()}

        <div className={styles.buttonWrapper}>
          <button className={styles.slideButton} onClick={handleAgregarPropuesta}>Agregar nueva propuesta</button>
        </div>
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
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
