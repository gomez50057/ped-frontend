"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import * as objetivos from '@/utils/plataformaEstrategicaData';
import { updateById, removeById, pushToArrayById, pushToNestedMapArray } from '@/utils/arrayHelpers';
import { useFeedback } from '@/hooks/useFeedback';
import { v4 as uuidv4 } from 'uuid';
import styles from './PlataformaEstrategicaReview.module.css';
import FeedbackSection from '../components/FeedbackSection/FeedbackSection';
import EditDeleteButtons from '../components/EditDeleteButtons/EditDeleteButtons';
import InputModal from '../components/InputModal/InputModal';
import { fetchWithAuth } from '@/utils/auth';

// 1. Datos centrales y mapeos
const AXES = [
  { id: 1, code: "EG01" },
  { id: 2, code: "EG02" },
  { id: 3, code: "EG03" },
  { id: 4, code: "EG04" },
  { id: 5, code: "EG05" },
  { id: 6, code: "EG06" },
  { id: 7, code: "EG07" },
  { id: 8, code: "EG08" },
  { id: 9, code: "EG09" },
  { id: 10, code: "ET01" },
  { id: 11, code: "ET02" },
  { id: 12, code: "ET03" }
];

const AXES_MAP = Object.fromEntries(AXES.map(a => [a.id, a.code]));

// 2. Custom hook para cargar ejes seleccionados
function useSelectedAxes() {
  const [selectedAxesIds, setSelectedAxesIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function loadEjes() {
      setLoading(true);
      try {
        const response = await fetchWithAuth('/api/plataforma/user-axis-selection/');
        if (response.ok) {
          const data = await response.json();
          let ids = [];
          if (Array.isArray(data)) {
            ids = data[0]?.axes || [];
          } else if (typeof data === 'object' && data !== null) {
            ids = data.axes || [];
          }
          if (!ignore) setSelectedAxesIds(Array.isArray(ids) ? ids : []);
        } else if (!ignore) {
          setSelectedAxesIds([]);
        }
      } catch (err) {
        if (!ignore) setSelectedAxesIds([]);
      }
      if (!ignore) setLoading(false);
    }
    loadEjes();
    return () => { ignore = true };
  }, []);

  const selectedCodes = useMemo(
    () => selectedAxesIds.map(id => AXES_MAP[id]).filter(Boolean),
    [selectedAxesIds]
  );

  return { selectedAxesIds, selectedCodes, loading };
}

// 3. Memoizar datos estáticos con IDs únicos
function useStaticWithId() {
  return useMemo(() => {
    return AXES.map(({ code }) => ({
      eje: code,
      propuestas: (objetivos[`dataObjetivo${code}`] || []).map(prop => ({
        ...prop,
        id: uuidv4(),
        Estrategias: (prop.Estrategias || []).map(estr => ({
          ...estr,
          id: uuidv4(),
          lineas: (estr['Lineas de acción'] || []).map(lin => ({ id: uuidv4(), text: lin })),
        })),
      })),
    }));
  }, []);
}

export default function PlataformaEstrategicaReview() {
  const { selectedCodes, loading } = useSelectedAxes();
  const staticWithId = useStaticWithId();

  const { feedback, setAcuerdo, setComentario } = useFeedback();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDefault, setModalDefault] = useState('');
  const [modalCallback, setModalCallback] = useState(() => () => { });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [nuevoContenido, setNuevoContenido] = useState({ propuestas: [] });
  const [nuevasEstrategias, setNuevasEstrategias] = useState({});
  const [nuevasLineas, setNuevasLineas] = useState({});

  // --- Helpers UI y feedback ---
  const openInputModal = (title, defaultValue, callback) => {
    setModalTitle(title);
    setModalDefault(defaultValue);
    setModalCallback(() => callback);
    setModalOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleGuardarAvance = () => setSnackbar({ open: true, message: '¡Avance guardado!', severity: 'info' });
  const handleGuardarComentarios = () => setSnackbar({ open: true, message: '¡Comentarios enviados!', severity: 'success' });

  // --- CRUD Handlers para propuestas, estrategias y líneas ---
  const agregarElemento = (promptText, callback) => {
    openInputModal(promptText, '', (valor) => {
      const cleaned = valor.trim();
      if (cleaned) callback(cleaned);
    });
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
    agregarElemento('Agregar Nuevo Lineamiento', (text) => {
      const nuevaLinea = { id: uuidv4(), text };
      setNuevasLineas(prev =>
        pushToNestedMapArray(prev, propuestaId, estrategiaId, nuevaLinea)
      );
    });
  };

  // --- Renders auxiliares ---
  const handleAcuerdoChange = (id, valor) => setAcuerdo(id, valor);
  const handleComentarioChange = (id, campo, valor) => setComentario(id, campo, valor);

  const renderLineas = (prefix, originales, propId, estrId) => {
    const extra = nuevasLineas[propId]?.[estrId] || [];

    const isDynamicLinea = (lineaId) => {
      const propuesta = nuevoContenido.propuestas.find(p => p.id === propId);
      if (!propuesta) return false;
      const estrategia = propuesta.estrategias.find(e => e.id === estrId);
      if (!estrategia) return false;
      return estrategia.lineas.some(l => l.id === lineaId);
    };

    const handleEditLinea = (lineaId, currentText) => {
      openInputModal('Editar Línea de Acción', currentText, (nuevoTexto) => {
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
      });
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

    const handleEditLineaStatic = (lineaId, currentText) => {
      openInputModal('Editar Línea de Acción', currentText, (nuevoTexto) => {
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
      });
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
                  ? handleEditLinea(l.id, l.text)
                  : handleEditLineaStatic(l.id, l.text)
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
              <EditDeleteButtons
                onEdit={() => {
                  openInputModal('Editar Estrategia', estr.Estrategia || estr.nombre, (nuevoNombre) => {
                    if (nuevoNombre.trim()) {
                      handleEditEstrategia(nuevoNombre.trim());
                    }
                  });
                }}
                onDelete={handleDeleteEstrategia}
              />
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
              onEdit={() =>
                openInputModal('Editar Propuesta', p.nombre, (nombre) => {
                  setNuevoContenido(prev => ({
                    ...prev,
                    propuestas: updateById(prev.propuestas, p.id, x => ({ ...x, nombre }))
                  }));
                })
              }
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

  // --- Render principal ---
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
              {block?.propuestas.length
                ? renderPropuestas(ejeCode, block.propuestas)
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

      <InputModal
        open={modalOpen}
        title={modalTitle}
        defaultValue={modalDefault}
        onClose={() => setModalOpen(false)}
        onConfirm={(value) => {
          modalCallback(value);
          setModalOpen(false);
        }}
      />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
