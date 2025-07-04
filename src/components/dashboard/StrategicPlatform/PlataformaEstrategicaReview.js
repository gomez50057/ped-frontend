"use client";

import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { updateById, removeById, pushToArrayById, pushToNestedMapArray } from '@/utils/arrayHelpers';
import { useFeedback } from '@/hooks/useFeedback';
import styles from './PlataformaEstrategicaReview.module.css';
import FeedbackSection from '../components/FeedbackSection/FeedbackSection';
import EditDeleteButtons from '../components/EditDeleteButtons/EditDeleteButtons';
import InputModal from '../components/InputModal/InputModal';
import { useSelectedAxes } from '@/hooks/StrategicPlatform/useSelectedAxes';
import { useStaticWithId } from '@/hooks/StrategicPlatform/useStaticWithId';


// --- Component principal ---
export default function PlataformaEstrategicaReview() {
  const { selectedCodes, loading } = useSelectedAxes();
  // Memo de los datos estáticosF
  const staticWithId = useStaticWithId();

  // --- Datos de la BD ---
  const [datosBD, setDatosBD] = useState([]);
  const [loadingBD, setLoadingBD] = useState(true);

  async function cargarDesdeBD() {
    setLoadingBD(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('access') : null;
      const res = await fetch("/api/objetivos/mis-objetivos/", {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('No se pudo cargar');
      const data = await res.json();
      setDatosBD(data.objetivos || []);
    } catch {
      setDatosBD([]);
      setSnackbar({ open: true, message: "Error al cargar datos guardados.", severity: "error" });
    }
    setLoadingBD(false);
  }

  useEffect(() => {
    cargarDesdeBD();
  }, []);

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
  // const handleGuardarAvance = () => setSnackbar({ open: true, message: '¡Avance guardado!', severity: 'info' });
  const handleGuardarAvance = () => {
    const dinamicos = extraerTextoDinamico();
    console.log(JSON.stringify(dinamicos, null, 2));
    setSnackbar({ open: true, message: '¡Avance guardado!', severity: 'info' });
  };



  const handleGuardarComentarios = () => setSnackbar({ open: true, message: '¡Comentarios enviados!', severity: 'success' });

  // --- ENVÍA TODO (propuestas, estrategias, líneas) al backend
  const handleEnviarNuevosElementos = async () => {
    // 1. Construye los NUEVOS objetivos a enviar igual que ahora (como lo haces)
    let nuevosObjetivos = (nuevoContenido.propuestas || []).map(prop => {
      // ... mismo merge de estrategias y líneas que ya tienes ...
      let estrategias = (prop.estrategias || []).map(e => {
        const extraLineas = (nuevasLineas[prop.id]?.[e.id]) || [];
        const allLineasMap = {};
        [...(e.lineas || []), ...extraLineas].forEach(l => {
          if (l && l.id) allLineasMap[l.id] = l;
        });
        const allLineas = Object.values(allLineasMap);
        return {
          id: e.id,
          nombre: e.nombre,
          lineas: allLineas.map(l => ({
            id: l.id,
            text: l.text
          }))
        };
      });

      // Agrega estrategias creadas con el flujo especial
      if (nuevasEstrategias[prop.id]) {
        nuevasEstrategias[prop.id].forEach(estr => {
          if (!estrategias.some(e => e.id === estr.id)) {
            const extraLineas = (nuevasLineas[prop.id]?.[estr.id]) || [];
            const allLineasMap = {};
            [...(estr.lineas || []), ...extraLineas].forEach(l => {
              if (l && l.id) allLineasMap[l.id] = l;
            });
            estrategias.push({
              id: estr.id,
              nombre: estr.nombre,
              lineas: Object.values(allLineasMap).map(l => ({
                id: l.id,
                text: l.text
              }))
            });
          }
        });
      }

      // Agrega líneas a estrategias existentes desde nuevasLineas
      if (nuevasLineas[prop.id]) {
        Object.entries(nuevasLineas[prop.id]).forEach(([estrId, lineas]) => {
          const estr = estrategias.find(e => e.id === estrId);
          if (estr) {
            const allLineasMap = {};
            [...(estr.lineas || []), ...lineas].forEach(l => {
              if (l && l.id) allLineasMap[l.id] = l;
            });
            estr.lineas = Object.values(allLineasMap).map(l => ({
              id: l.id,
              text: l.text
            }));
          }
        });
      }

      return {
        id: prop.id,
        nombre: prop.nombre,
        estrategias: estrategias.filter(e => e.lineas && e.lineas.length)
      };
    }).filter(o => o.estrategias && o.estrategias.length);

    // 2. Los objetivos a enviar son los que ya están en la BD + los nuevos
    const objetivosTotales = [
      ...(datosBD || []), // <- esto son los que YA tiene el usuario
      ...nuevosObjetivos  // <- estos son los nuevos de la sesión actual
    ];

    // 🚨 No envíes si está vacío
    if (!objetivosTotales.length) {
      setSnackbar({
        open: true,
        message: "No hay objetivos para enviar.",
        severity: "warning"
      });
      return;
    }

    const payload = { objetivos: objetivosTotales };

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem('access') : null;
      let res = await fetch("/api/objetivos/mis-objetivos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (
          res.status === 400 &&
          errorData.detail &&
          errorData.detail.includes("usa PUT")
        ) {
          res = await fetch("/api/objetivos/mis-objetivos/", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` })
            },
            body: JSON.stringify(payload)
          });
        }
      }

      if (!res.ok) throw new Error(await res.text());

      setSnackbar({
        open: true,
        message: "¡Elementos enviados con éxito!",
        severity: "success"
      });

      setNuevoContenido({ propuestas: [] });
      setNuevasEstrategias({});
      setNuevasLineas({});
      await cargarDesdeBD(); // Recarga la lista

    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al enviar los elementos.",
        severity: "error"
      });
      console.error(error);
    }
  };

  // CRUD Handlers ... (sin cambios)
  const agregarElemento = (promptText, callback) => {
    openInputModal(promptText, '', (valor) => {
      const cleaned = valor.trim();
      if (cleaned) callback(cleaned);
    });
  };

  const generateTempId = () => `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const handleAgregarPropuesta = () => {
    agregarElemento('Nueva Propuesta', (nombre) => {
      setNuevoContenido(prev => ({
        propuestas: [
          ...prev.propuestas,
          { id: generateTempId(), nombre, estrategias: [] }
        ]
      }));
    });
  };

  const handleAgregarEstrategiaGeneral = (propuestaId, isStatic) => {
    const promptText = isStatic ? 'Proponer nueva Estrategia' : 'Nueva Estrategia';
    agregarElemento(promptText, (nombre) => {
      const nuevaEstrategia = { id: generateTempId(), nombre, lineas: [] };

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
    agregarElemento('Agregar Nueva Línea de Acción', (text) => {
      const nuevaLinea = { id: generateTempId(), text };
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

  const extraerTextoDinamico = () => {
    const dinamicos = {
      propuestas: [],
      estrategias: [],
      lineas: [],
    };

    // Propuestas dinámicas (las que tienen .nombre y NO tienen 'Propuesta Objetivo')
    for (const prop of nuevoContenido.propuestas) {
      dinamicos.propuestas.push({
        id: prop.id,
        nombre: prop.nombre
      });

      // Estrategias dinámicas dentro de propuestas dinámicas
      for (const estr of prop.estrategias || []) {
        dinamicos.estrategias.push({
          idObjetivo: prop.id,
          id: estr.id,
          nombre: estr.nombre
        });

        // Líneas dinámicas dentro de estrategias dinámicas
        for (const lin of estr.lineas || []) {
          dinamicos.lineas.push({
            idObjetivo: prop.id,
            idEstrategia: estr.id,
            id: lin.id,
            text: lin.text
          });
        }
      }
    }

    // Estrategias dinámicas propuestas sobre propuestas estáticas
    for (const [propId, estrategiasNuevas] of Object.entries(nuevasEstrategias)) {
      for (const estr of estrategiasNuevas) {
        dinamicos.estrategias.push({
          idObjetivo: propId,    // aquí propId es el id de la propuesta estática
          id: estr.id,
          nombre: estr.nombre
        });

        // Líneas dinámicas dentro de estas estrategias nuevas
        for (const lin of estr.lineas || []) {
          dinamicos.lineas.push({
            idObjetivo: propId,
            idEstrategia: estr.id,
            id: lin.id,
            text: lin.text
          });
        }
      }
    }

    // Líneas dinámicas agregadas sobre estrategias estáticas o nuevas
    for (const [propId, estrategias] of Object.entries(nuevasLineas)) {
      for (const [estrId, lineas] of Object.entries(estrategias)) {
        for (const lin of lineas) {
          dinamicos.lineas.push({
            idObjetivo: propId,   // id de propuesta estática o dinámica
            idEstrategia: estrId, // id de estrategia estática o dinámica
            id: lin.id,
            text: lin.text
          });
        }
      }
    }

    return dinamicos;
  };

  // --- Render principal (estructura original + bloque BD al inicio) ---
  return (
    <div className={styles.container}>
      <div className={styles.containerReview}>
        <h2>
          <span className="spanDoarado">Revisión</span> de la{' '}
          <span className="spanVino">Plataforma Estratégica</span>
        </h2>

        {/* render: propuestas estáticas, nuevas, etc */}
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
          <button className={styles.slideButton} onClick={handleEnviarNuevosElementos}>Enviar nuevos elementos</button>
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
