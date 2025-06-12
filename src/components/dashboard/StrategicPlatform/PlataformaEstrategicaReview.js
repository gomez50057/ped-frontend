"use client";

import React, { useState, useMemo } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { dataObjetivoEG01, dataObjetivoEG02, dataObjetivoEG03, dataObjetivoEG04, dataObjetivoEG05, dataObjetivoEG06, dataObjetivoEG07, dataObjetivoEG08, dataObjetivoEG09, dataObjetivoET01, dataObjetivoET02, dataObjetivoET03 } from "@/utils/plataformaEstrategicaData";
import { usePlatform } from "@/context/PlatformContext";
import { useFeedback } from "@/hooks/useFeedback";
import { v4 as uuidv4 } from "uuid";
import styles from "./PlataformaEstrategicaReview.module.css";

const allData = [
  { id: "EG01", data: dataObjetivoEG01 }, { id: "EG02", data: dataObjetivoEG02 },
  { id: "EG03", data: dataObjetivoEG03 }, { id: "EG04", data: dataObjetivoEG04 },
  { id: "EG05", data: dataObjetivoEG05 }, { id: "EG06", data: dataObjetivoEG06 },
  { id: "EG07", data: dataObjetivoEG07 }, { id: "EG08", data: dataObjetivoEG08 },
  { id: "EG09", data: dataObjetivoEG09 }, { id: "ET01", data: dataObjetivoET01 },
  { id: "ET02", data: dataObjetivoET02 }, { id: "ET03", data: dataObjetivoET03 }
];

function FeedbackSection({ id, acuerdo, comentarios, onAcuerdoChange, onComentarioChange }) {
  return (
    <div className={styles.feedbackSection}>
      <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
      <div className={styles.radioGroup}>
        <label>
          <input type="radio" name={`${id}-acuerdo`} value="yes" checked={acuerdo === "yes"} onChange={() => onAcuerdoChange(id, "yes")} /> Sí
        </label>
        <label className={styles.radioSpacing}>
          <input type="radio" name={`${id}-acuerdo`} value="no" checked={acuerdo === "no"} onChange={() => onAcuerdoChange(id, "no")} /> No
        </label>
      </div>
      {acuerdo === "no" && (
        <div className={styles.commentArea}>
          <textarea placeholder="Cómo debería decir..." value={comentarios?.comoDecir || ""} onChange={e => onComentarioChange(id, "comoDecir", e.target.value)} />
          <textarea placeholder="Justificación..." value={comentarios?.justificacion || ""} onChange={e => onComentarioChange(id, "justificacion", e.target.value)} />
        </div>
      )}
    </div>
  );
}

export default function PlataformaEstrategicaReview() {
  const { selectedEjes } = usePlatform();
  const { feedback, setAcuerdo, setComentario } = useFeedback();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [nuevoContenido, setNuevoContenido] = useState({ propuestas: [] });

  const staticWithId = useMemo(() => allData.map(({ id: eje, data }) => ({
    eje,
    propuestas: data.map(prop => ({
      ...prop,
      id: uuidv4(),
      Estrategias: (prop.Estrategias || []).map(estr => ({
        ...estr,
        id: uuidv4(),
        lineas: (estr["Lineas de acción"] || []).map(lin => ({ id: uuidv4(), text: lin }))
      }))
    }))
  })), []);

  const handleAcuerdoChange = (id, valor) => setAcuerdo(id, valor);
  const handleComentarioChange = (id, campo, valor) => setComentario(id, campo, valor);
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));
  const handleGuardarAvance = () => setSnackbar({ open: true, message: "¡Avance guardado con éxito!", severity: "info" });
  const handleGuardarComentarios = () => setSnackbar({ open: true, message: "¡Comentarios enviados con éxito!", severity: "success" });

  const handleAgregarPropuesta = () => {
    const nueva = prompt("Nueva Propuesta Objetivo");
    if (nueva) setNuevoContenido(prev => ({ ...prev, propuestas: [...prev.propuestas, { id: uuidv4(), nombre: nueva, estrategias: [] }] }));
  };
  const handleAgregarEstrategia = propuestaId => {
    const nueva = prompt("Nueva Estrategia");
    if (nueva) setNuevoContenido(prev => ({
      ...prev,
      propuestas: prev.propuestas.map(p => p.id === propuestaId ? { ...p, estrategias: [...p.estrategias, { id: uuidv4(), nombre: nueva, lineas: [] }] } : p)
    }));
  };
  const handleAgregarLinea = (propuestaId, estrategiaId) => {
    const nueva = prompt("Nueva Línea de Acción");
    if (nueva) setNuevoContenido(prev => ({
      ...prev,
      propuestas: prev.propuestas.map(p => p.id === propuestaId ? {
        ...p, estrategias: p.estrategias.map(e => e.id === estrategiaId ? { ...e, lineas: [...e.lineas, { id: uuidv4(), text: nueva }] } : e)
      } : p)
    }));
  };

  const renderLineasAccion = (estrategiaId, lineas) => lineas.map(linea => {
    const feedbackId = `${estrategiaId}-linea-${linea.id}`;
    return (
      <li key={linea.id} className={styles.lineaAccion}>
        <p>{linea.text}</p>
        <FeedbackSection id={feedbackId} acuerdo={feedback[feedbackId]?.acuerdo} comentarios={feedback[feedbackId]?.comentarios} onAcuerdoChange={handleAcuerdoChange} onComentarioChange={handleComentarioChange} />
      </li>
    );
  });

  const renderEstrategias = (propuestaId, estrategias) => estrategias.map(estrategia => {
    const feedbackId = `${propuestaId}-estrategia-${estrategia.id}`;
    return (
      <div key={estrategia.id} className={styles.estrategia}>
        <h4>{estrategia.Estrategia}</h4>
        <FeedbackSection id={feedbackId} acuerdo={feedback[feedbackId]?.acuerdo} comentarios={feedback[feedbackId]?.comentarios} onAcuerdoChange={handleAcuerdoChange} onComentarioChange={handleComentarioChange} />
        <ul>{renderLineasAccion(feedbackId, estrategia.lineas)}</ul>
      </div>
    );
  });

  const renderPropuestas = (ejeId, propuestas) => propuestas.map(propuesta => {
    const feedbackId = `${ejeId}-propuesta-${propuesta.id}`;
    return (
      <div key={propuesta.id} className={styles.propuesta}>
        <h3>{propuesta["Propuesta Objetivo"]}</h3>
        <FeedbackSection id={feedbackId} acuerdo={feedback[feedbackId]?.acuerdo} comentarios={feedback[feedbackId]?.comentarios} onAcuerdoChange={handleAcuerdoChange} onComentarioChange={handleComentarioChange} />
        {renderEstrategias(feedbackId, propuesta.Estrategias)}
      </div>
    );
  });

  const renderNuevasPropuestas = () => nuevoContenido.propuestas.map(p => (
    <div key={p.id} className={styles.propuesta}>
      <h3>
        {p.nombre}
        <button onClick={() => {
          const nuevo = prompt("Editar propuesta", p.nombre);
          if (nuevo !== null) setNuevoContenido(prev => ({ ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? { ...item, nombre: nuevo } : item) }));
        }}>✏️</button>
        <button onClick={() => setNuevoContenido(prev => ({ ...prev, propuestas: prev.propuestas.filter(item => item.id !== p.id) }))}>❌</button>
      </h3>
      <button onClick={() => handleAgregarEstrategia(p.id)}>Agregar Estrategia</button>
      {p.estrategias.map(e => (
        <div key={e.id} className={styles.estrategia}>
          <h4>
            {e.nombre}
            <button onClick={() => {
              const nuevo = prompt("Editar estrategia", e.nombre);
              if (nuevo !== null) setNuevoContenido(prev => ({
                ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? {
                  ...item, estrategias: item.estrategias.map(et => et.id === e.id ? { ...et, nombre: nuevo } : et)
                } : item)
              }));
            }}>✏️</button>
            <button onClick={() => setNuevoContenido(prev => ({
              ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? {
                ...item, estrategias: item.estrategias.filter(et => et.id !== e.id)
              } : item)
            }))}>❌</button>
          </h4>
          <button onClick={() => handleAgregarLinea(p.id, e.id)}>Agregar Línea de Acción</button>
          <ul>
            {e.lineas.map(l => (
              <li key={l.id} className={styles.lineaAccion}>
                {l.text}
                <button onClick={() => {
                  const nuevo = prompt("Editar línea", l.text);
                  if (nuevo !== null) setNuevoContenido(prev => ({
                    ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? {
                      ...item, estrategias: item.estrategias.map(et => et.id === e.id ? {
                        ...et, lineas: et.lineas.map(li => li.id === l.id ? { ...li, text: nuevo } : li)
                      } : et)
                    } : item)
                  }));
                }}>✏️</button>
                <button onClick={() => setNuevoContenido(prev => ({
                  ...prev, propuestas: prev.propuestas.map(item => item.id === p.id ? {
                    ...item, estrategias: item.estrategias.map(et => et.id === e.id ? {
                      ...et, lineas: et.lineas.filter(li => li.id !== l.id)
                    } : et)
                  } : item)
                }))}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ));

  return (
    <div className={styles.container}>
      <h2>Revisión de la Plataforma Estratégica</h2>
      {selectedEjes.length === 0
        ? <p>No hay ejes seleccionados para revisión.</p>
        : selectedEjes.map(eje => {
          const block = staticWithId.find(b => b.eje === eje);
          return (
            <div key={eje} className={styles.propuesta}>
              <h3 className={styles.ejeActivo}>Observación de eje a revisar: {eje}</h3>
              {block?.propuestas.length ? renderPropuestas(eje, block.propuestas) : <p>No hay datos disponibles para este eje.</p>}
            </div>
          );
        })
      }
      {renderNuevasPropuestas()}
      <div className={styles.buttonsContainer}>
        <button onClick={handleGuardarAvance} className={styles.saveButton}>Guardar avance</button>
        <button onClick={handleGuardarComentarios} className={styles.saveButton}>Guardar comentarios</button>
        <button onClick={handleAgregarPropuesta} className={styles.saveButton}>Agregar nueva propuesta</button>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
