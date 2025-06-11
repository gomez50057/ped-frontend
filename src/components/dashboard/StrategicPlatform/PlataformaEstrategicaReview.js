"use client";

import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {
  dataObjetivoEG01,
  dataObjetivoEG02,
  dataObjetivoEG03,
  dataObjetivoEG04,
  dataObjetivoEG05,
  dataObjetivoEG06,
  dataObjetivoEG07,
  dataObjetivoEG08,
  dataObjetivoEG09,
  dataObjetivoET01,
  dataObjetivoET02,
  dataObjetivoET03
} from "@/utils/plataformaEstrategicaData";
import { usePlatform } from "@/context/PlatformContext";
import styles from "./PlataformaEstrategicaReview.module.css";

const allData = [
  { id: "EG01", data: dataObjetivoEG01 },
  { id: "EG02", data: dataObjetivoEG02 },
  { id: "EG03", data: dataObjetivoEG03 },
  { id: "EG04", data: dataObjetivoEG04 },
  { id: "EG05", data: dataObjetivoEG05 },
  { id: "EG06", data: dataObjetivoEG06 },
  { id: "EG07", data: dataObjetivoEG07 },
  { id: "EG08", data: dataObjetivoEG08 },
  { id: "EG09", data: dataObjetivoEG09 },
  { id: "ET01", data: dataObjetivoET01 },
  { id: "ET02", data: dataObjetivoET02 },
  { id: "ET03", data: dataObjetivoET03 }
];

function FeedbackSection({ id, acuerdo, comentarios, onAcuerdoChange, onComentarioChange }) {
  return (
    <div className={styles.feedbackSection}>
      <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="yes"
            checked={acuerdo[id] === "yes"}
            onChange={() => onAcuerdoChange(id, "yes")}
          />
          Sí
        </label>
        <label className={styles.radioSpacing}>
          <input
            type="radio"
            name={`${id}-acuerdo`}
            value="no"
            checked={acuerdo[id] === "no"}
            onChange={() => onAcuerdoChange(id, "no")}
          />
          No
        </label>
      </div>
      {acuerdo[id] === "no" && (
        <div className={styles.commentArea}>
          <textarea
            placeholder="Cómo debería decir..."
            value={comentarios[id]?.comoDecir || ""}
            onChange={(e) => onComentarioChange(id, "comoDecir", e.target.value)}
          />
          <textarea
            placeholder="Justificación..."
            value={comentarios[id]?.justificacion || ""}
            onChange={(e) => onComentarioChange(id, "justificacion", e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default function PlataformaEstrategicaReview() {
  const { selectedEjes } = usePlatform();
  const [comentarios, setComentarios] = useState({});
  const [acuerdo, setAcuerdo] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [nuevoContenido, setNuevoContenido] = useState({ propuestas: [] });

  const handleComentarioChange = (id, campo, valor) => {
    setComentarios((prev) => ({ ...prev, [id]: { ...prev[id], [campo]: valor } }));
  };


  const handleAcuerdoChange = (id, valor) => {
    setAcuerdo((prev) => ({ ...prev, [id]: valor }));
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const handleGuardarAvance = () => {
    console.log("Avance guardado:", comentarios);
    setSnackbar({ open: true, message: "¡Avance guardado con éxito!", severity: "info" });
  };

  const handleGuardarComentarios = () => {
    console.log("Comentarios enviados:", comentarios);
    setSnackbar({ open: true, message: "¡Comentarios enviados con éxito!", severity: "success" });
  };

  const renderLineasAccion = (estrategiaId, lineas) =>
    lineas.map((linea, index) => {
      const id = `${estrategiaId}-linea-${index}`;
      return (
        <li key={id} className={styles.lineaAccion}>
          <p>{linea}</p>
          <FeedbackSection
            id={id}
            acuerdo={acuerdo}
            comentarios={comentarios}
            onAcuerdoChange={handleAcuerdoChange}
            onComentarioChange={handleComentarioChange}
          />
        </li>
      );
    });

  const renderEstrategias = (propuestaId, estrategias) =>
    estrategias.map((estrategia, index) => {
      const id = `${propuestaId}-estrategia-${index}`;
      return (
        <div key={id} className={styles.estrategia}>
          <h4>{estrategia.Estrategia}</h4>
          <FeedbackSection
            id={id}
            acuerdo={acuerdo}
            comentarios={comentarios}
            onAcuerdoChange={handleAcuerdoChange}
            onComentarioChange={handleComentarioChange}
          />
          <ul>{renderLineasAccion(id, estrategia["Lineas de acción"] || [])}</ul>
        </div>
      );
    });

  const renderPropuestas = (ejeId, propuestas) =>
    propuestas.map((propuesta, index) => {
      const id = `${ejeId}-propuesta-${index}`;
      return (
        <div key={id} className={styles.propuesta}>
          <h3>{propuesta["Propuesta Objetivo"]}</h3>
          <FeedbackSection
            id={id}
            acuerdo={acuerdo}
            comentarios={comentarios}
            onAcuerdoChange={handleAcuerdoChange}
            onComentarioChange={handleComentarioChange}
          />
          {renderEstrategias(id, propuesta.Estrategias || [])}
        </div>
      );
    });

  const handleAgregar = (tipo, idxs = []) => {
    const label = tipo === 'propuesta' ? 'Nueva Propuesta Objetivo' : tipo === 'estrategia' ? 'Nueva Estrategia' : 'Nueva Línea de Acción';
    const nueva = prompt(label);
    if (!nueva) return;

    setNuevoContenido((prev) => {
      const propuestas = [...prev.propuestas];
      if (tipo === 'propuesta') {
        propuestas.push({ nombre: nueva, estrategias: [] });
      } else if (tipo === 'estrategia') {
        if (!propuestas[idxs[0]].estrategias) propuestas[idxs[0]].estrategias = [];
        propuestas[idxs[0]].estrategias.push({ nombre: nueva, lineas: [] });
      } else if (tipo === 'linea') {
        if (!propuestas[idxs[0]].estrategias[idxs[1]].lineas) propuestas[idxs[0]].estrategias[idxs[1]].lineas = [];
        propuestas[idxs[0]].estrategias[idxs[1]].lineas.push(nueva);
      }
      return { ...prev, propuestas };
    });
  };

  const handleEditar = (updateFn, valorActual) => {
    const nuevoValor = prompt("Editar", valorActual);
    if (nuevoValor !== null) updateFn(nuevoValor);
  };


  const renderNuevasPropuestas = () => nuevoContenido.propuestas.map((p, i) => (
    <div key={`new-propuesta-${i}`} className={styles.propuesta}>
      <h3>
        {p.nombre}
        <button onClick={() => handleEditar((nuevo) => setNuevoContenido((prev) => {
          const propuestas = [...prev.propuestas];
          propuestas[i].nombre = nuevo;
          return { ...prev, propuestas };
        }), p.nombre)}>✏️</button>
        <button onClick={() => setNuevoContenido((prev) => ({
          ...prev,
          propuestas: prev.propuestas.filter((_, idx) => idx !== i)
        }))}>❌</button>
      </h3>
      <button onClick={() => handleAgregar('estrategia', [i])}>Agregar Estrategia</button>
      {p.estrategias.map((e, j) => (
        <div key={`new-estrategia-${i}-${j}`} className={styles.estrategia}>
          <h4>
            {e.nombre}
            <button onClick={() => handleEditar((nuevo) => setNuevoContenido((prev) => {
              const propuestas = [...prev.propuestas];
              propuestas[i].estrategias[j].nombre = nuevo;
              return { ...prev, propuestas };
            }), e.nombre)}>✏️</button>
            <button onClick={() => setNuevoContenido((prev) => {
              const propuestas = [...prev.propuestas];
              propuestas[i].estrategias = propuestas[i].estrategias.filter((_, idx) => idx !== j);
              return { ...prev, propuestas };
            })}>❌</button>
          </h4>
          <button onClick={() => handleAgregar('linea', [i, j])}>Agregar Línea de Acción</button>
          <ul>
            {e.lineas.map((l, k) => (
              <li key={`new-linea-${i}-${j}-${k}`} className={styles.lineaAccion}>
                {l}
                <button onClick={() => handleEditar((nuevo) => setNuevoContenido((prev) => {
                  const propuestas = [...prev.propuestas];
                  propuestas[i].estrategias[j].lineas[k] = nuevo;
                  return { ...prev, propuestas };
                }), l)}>✏️</button>
                <button onClick={() => setNuevoContenido((prev) => {
                  const propuestas = [...prev.propuestas];
                  propuestas[i].estrategias[j].lineas = propuestas[i].estrategias[j].lineas.filter((_, idx) => idx !== k);
                  return { ...prev, propuestas };
                })}>❌</button>
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
      {selectedEjes.length === 0 ? (
        <p>No hay ejes seleccionados para revisión.</p>
      ) : (
        selectedEjes.map((eje) => {
          const ejeData = allData.find((item) => item.id === eje);
          return (
            <div key={eje} className={styles.propuesta}>
              <h3 className={styles.ejeActivo}>Observación de eje a revisar: {eje}</h3>
              {ejeData?.data.length ? renderPropuestas(eje, ejeData.data) : <p>No hay datos disponibles para este eje.</p>}
            </div>
          );
        })
      )}
      {renderNuevasPropuestas()}
      <div className={styles.buttonsContainer}>
        <button onClick={handleGuardarAvance} className={styles.saveButton}>Guardar avance</button>
        <button onClick={handleGuardarComentarios} className={styles.saveButton}>Guardar comentarios</button>
        <button onClick={() => handleAgregar('propuesta')} className={styles.saveButton}>Agregar nueva propuesta</button>
      </div>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
