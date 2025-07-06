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
import { fetchWithAuth } from '@/utils/auth';
import { useSelectedAxes } from '@/hooks/StrategicPlatform/useSelectedAxes';
import { useStaticWithId } from '@/hooks/StrategicPlatform/useStaticWithId';

// --- Component principal ---
export default function PlataformaEstrategicaReview() {
  const { selectedCodes, loading } = useSelectedAxes();
  // Memo de los datos estáticosF
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

  const cargarDatosUsuario = async () => {
    try {
      const response = await fetchWithAuth("/api/objetivos/mis-objetivos/");
      if (!response.ok) return;
      const data = await response.json();
      const objetivos = data.objetivos || [];

      // Armado de estados:
      // 1. propuestas dinámicas completas (con estrategias y líneas anidadas)
      const propuestas = [];
      // 2. nuevasEstrategias sobre objetivos estáticos
      const estrategiasStatic = {};
      // 3. nuevasLineas sobre estrategias estáticas
      const lineasStatic = {};

      for (const obj of objetivos) {
        // Si el objetivo tiene nombre (es dinámico) => va a propuestas (nuevoContenido)
        if (obj.nombre && obj.nombre.trim() !== "") {
          propuestas.push({
            id: obj.id,
            nombre: obj.nombre,
            estrategias: (obj.estrategias || []).map(estr => ({
              id: estr.id,
              nombre: estr.nombre,
              lineas: (estr.lineas || []).map(lin => ({
                id: lin.id,
                text: lin.text
              }))
            }))
          });
        } else {
          // Es estrategia dinámica sobre objetivo estático
          if (obj.estrategias) {
            for (const estr of obj.estrategias) {
              // Si tiene nombre (dinámica sobre estático)
              if (estr.nombre && estr.nombre.trim() !== "") {
                if (!estrategiasStatic[obj.id]) estrategiasStatic[obj.id] = [];
                estrategiasStatic[obj.id].push({
                  id: estr.id,
                  nombre: estr.nombre,
                  lineas: (estr.lineas || []).map(lin => ({
                    id: lin.id,
                    text: lin.text
                  }))
                });
              } else {
                // Línea dinámica sobre estrategia estática
                if (estr.lineas && estr.lineas.length) {
                  if (!lineasStatic[obj.id]) lineasStatic[obj.id] = {};
                  if (!lineasStatic[obj.id][estr.id]) lineasStatic[obj.id][estr.id] = [];
                  for (const lin of estr.lineas) {
                    lineasStatic[obj.id][estr.id].push({
                      id: lin.id,
                      text: lin.text
                    });
                  }
                }
              }
            }
          }
        }
      }

      setNuevoContenido({ propuestas });
      setNuevasEstrategias(estrategiasStatic);
      setNuevasLineas(lineasStatic);
    } catch (e) {
      // Opcional: mostrar mensaje de error
    }
  };

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleGuardarAvance = async () => {
    const dinamicos = extraerTextoDinamicoJerarquico();
    try {
      // Intenta primero con POST
      let response = await fetchWithAuth("/api/objetivos/mis-objetivos/", {
        method: "POST",
        body: JSON.stringify(dinamicos),
      });

      // Si el backend responde con error de "usa PUT", haz el PUT automáticamente
      if (!response.ok) {
        let errorText = await response.text();
        let isPutNeeded = false;

        try {
          const errorData = JSON.parse(errorText);
          if (
            response.status === 400 &&
            errorData.detail &&
            errorData.detail.includes("usa PUT")
          ) {
            isPutNeeded = true;
          }
        } catch {
          // No es JSON, no hace nada
        }

        if (isPutNeeded) {
          response = await fetchWithAuth("/api/objetivos/mis-objetivos/", {
            method: "PUT",
            body: JSON.stringify(dinamicos),
          });

          // Checa si el PUT fue exitoso
          if (!response.ok) {
            const putError = await response.text();
            setSnackbar({
              open: true,
              message: "Error al actualizar avance: " + putError,
              severity: "error",
            });
            return;
          }

          setSnackbar({
            open: true,
            message: "¡Avance actualizado exitosamente!",
            severity: "success",
          });
          // await cargarDesdeBD();
          return;
        } else {
          // No fue error de PUT, muestra el error normal
          setSnackbar({
            open: true,
            message: "Error al guardar avance: " + errorText,
            severity: "error",
          });
          return;
        }
      }

      // Si el POST fue exitoso
      setSnackbar({
        open: true,
        message: "¡Avance guardado exitosamente!",
        severity: "success",
      });
      // await cargarDesdeBD();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar avance: " + (error.message || error),
        severity: "error",
      });
    }
  };

  const handleGuardarComentarios = async () => {
    // 1. Arma el arreglo listo para el backend
    const feedbackArr = Object.entries(feedback)
      .filter(
        ([, val]) =>
          val.acuerdo ||
          (val.comentarios && (val.comentarios.comoDecir || val.comentarios.justificacion))
      )
      .map(([clave, val]) => ({
        clave,
        acuerdo: val.acuerdo || "",
        comoDecir: val.acuerdo === "yes" ? "No Aplica" : (val.comentarios?.comoDecir || ""),
        justificacion: val.acuerdo === "yes" ? "No Aplica" : (val.comentarios?.justificacion || "")
      }));

    if (feedbackArr.length === 0 || feedbackArr.some(
      obj => !obj.clave || !obj.acuerdo || !obj.comoDecir || !obj.justificacion
    )) {
      setSnackbar({ open: true, message: 'Faltan campos requeridos.', severity: 'error' });
      return;
    }

    // 2. Intenta POST masivo
    try {
      let res = await fetchWithAuth("/api/objetivos/feedback-avance/", {
        method: "POST",
        body: JSON.stringify(feedbackArr)
      });

      // 3. Si backend pide PUT, lo intenta de nuevo
      if (!res.ok) {
        let errorText = await res.text();
        let needPut = false;
        try {
          const errData = JSON.parse(errorText);
          // Aquí podrías ajustar la lógica según cómo te responde tu backend, por ejemplo error de unique o instrucciones de usar PUT
          if (
            (res.status === 400 || res.status === 409) && // Conflict o Bad Request
            (Array.isArray(errData) || errData.detail || errData.clave)
          ) {
            // Asumimos que si ya existen, se puede hacer PUT masivo
            needPut = true;
          }
        } catch { }
        if (needPut) {
          // PUT masivo (puede variar, a veces tu backend podría esperar uno por uno, ajústalo según tu API)
          res = await fetchWithAuth("/api/objetivos/feedback-avance/", {
            method: "PUT",
            body: JSON.stringify(feedbackArr)
          });
        }
        if (!res.ok) {
          setSnackbar({
            open: true,
            message: "Error al enviar comentarios: " + (await res.text()),
            severity: "error"
          });
          return;
        }
      }

      setSnackbar({
        open: true,
        message: '¡Comentarios enviados!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al enviar comentarios: " + (error.message || error),
        severity: "error"
      });
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

  const extraerTextoDinamicoJerarquico = () => {
    // Solo propuestas dinámicas
    const objetivos = (nuevoContenido.propuestas || []).map(prop => ({
      id: prop.id,
      nombre: prop.nombre,
      estrategias: (prop.estrategias || []).map(estr => ({
        id: estr.id,
        nombre: estr.nombre,
        lineas: (estr.lineas || []).map(lin => ({
          id: lin.id,
          text: lin.text
        }))
      }))
    }));

    // Estrategias nuevas agregadas sobre propuestas estáticas
    for (const [propId, estrategiasNuevas] of Object.entries(nuevasEstrategias)) {
      // Busca si ya existe el objetivo en objetivos dinámicos
      let objetivo = objetivos.find(o => o.id === propId);
      if (!objetivo) {
        // Si no existe, crea un objetivo vacío solo con el id
        objetivo = {
          id: propId,
          nombre: '', // Podrías buscar el nombre en staticWithId si lo necesitas
          estrategias: []
        };
        objetivos.push(objetivo);
      }
      for (const estr of estrategiasNuevas) {
        objetivo.estrategias.push({
          id: estr.id,
          nombre: estr.nombre,
          lineas: (estr.lineas || []).map(lin => ({
            id: lin.id,
            text: lin.text
          }))
        });
      }
    }

    // Líneas nuevas agregadas sobre estrategias estáticas
    for (const [propId, estrategias] of Object.entries(nuevasLineas)) {
      let objetivo = objetivos.find(o => o.id === propId);
      if (!objetivo) {
        objetivo = {
          id: propId,
          nombre: '',
          estrategias: []
        };
        objetivos.push(objetivo);
      }
      for (const [estrId, lineas] of Object.entries(estrategias)) {
        let estrategia = objetivo.estrategias.find(e => e.id === estrId);
        if (!estrategia) {
          estrategia = {
            id: estrId,
            nombre: '',
            lineas: []
          };
          objetivo.estrategias.push(estrategia);
        }
        for (const lin of lineas) {
          // Evita duplicados
          if (!estrategia.lineas.some(l => l.id === lin.id)) {
            estrategia.lineas.push({
              id: lin.id,
              text: lin.text
            });
          }
        }
      }
    }

    return { objetivos };
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleGuardarTodo = async () => {
    setIsSaving(true);
    try {
      // Primero guarda avance (await porque es async)
      await handleGuardarAvance();
      // Después guarda comentarios (puede ser sync)
      handleGuardarComentarios();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error al guardar.', severity: 'error' });
      console.error(err);
    } finally {
      setIsSaving(false);
    }
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
            <button className={styles.slideButton} onClick={handleGuardarTodo} disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar avance'}
            </button>
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
