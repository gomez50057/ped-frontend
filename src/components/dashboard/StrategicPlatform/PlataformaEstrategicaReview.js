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

export default function PlataformaEstrategicaReview() {
  const { selectedEjes } = usePlatform();
  const [comentarios, setComentarios] = useState({});
  const [acuerdo, setAcuerdo] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [nuevoContenido, setNuevoContenido] = useState({ propuestas: [] });

  const handleComentarioChange = (id, campo, valor) => {
    setComentarios((prev) => ({ ...prev, [id]: { ...prev[id], [campo]: valor } }));
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
      const lineaId = `${estrategiaId}-linea-${index}`;
      return (
        <li key={lineaId} className={styles.lineaAccion}>
          <p>{linea}</p>
          <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
          <div>
            <label>
              <input
                type="radio"
                name={`${lineaId}-acuerdo`}
                value="yes"
                checked={acuerdo[lineaId] === "yes"}
                onChange={() => setAcuerdo({ ...acuerdo, [lineaId]: "yes" })}
              />
              Sí
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name={`${lineaId}-acuerdo`}
                value="no"
                checked={acuerdo[lineaId] === "no"}
                onChange={() => setAcuerdo({ ...acuerdo, [lineaId]: "no" })}
              />
              No
            </label>
          </div>
          {acuerdo[lineaId] === "no" && (
            <>
              <textarea
                placeholder="Cómo debería decir..."
                value={comentarios[lineaId]?.comoDecir || ""}
                onChange={(e) =>
                  handleComentarioChange(lineaId, "comoDecir", e.target.value)
                }
              />
              <textarea
                placeholder="Justificación..."
                value={comentarios[lineaId]?.justificacion || ""}
                onChange={(e) =>
                  handleComentarioChange(lineaId, "justificacion", e.target.value)
                }
              />
            </>
          )}
        </li>
      );
    });

  const renderEstrategias = (propuestaId, estrategias) =>
    estrategias.map((estrategia, index) => {
      const estrategiaId = `${propuestaId}-estrategia-${index}`;
      return (
        <div key={estrategiaId} className={styles.estrategia}>
          <h4>{estrategia.Estrategia}</h4>
          <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
          <div>
            <label>
              <input
                type="radio"
                name={`${estrategiaId}-acuerdo`}
                value="yes"
                checked={acuerdo[estrategiaId] === "yes"}
                onChange={() => setAcuerdo({ ...acuerdo, [estrategiaId]: "yes" })}
              />
              Sí
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name={`${estrategiaId}-acuerdo`}
                value="no"
                checked={acuerdo[estrategiaId] === "no"}
                onChange={() => setAcuerdo({ ...acuerdo, [estrategiaId]: "no" })}
              />
              No
            </label>
          </div>
          {acuerdo[estrategiaId] === "no" && (
            <>
              <textarea
                placeholder="Cómo debería decir..."
                value={comentarios[estrategiaId]?.comoDecir || ""}
                onChange={(e) =>
                  handleComentarioChange(estrategiaId, "comoDecir", e.target.value)
                }
              />
              <textarea
                placeholder="Justificación..."
                value={comentarios[estrategiaId]?.justificacion || ""}
                onChange={(e) =>
                  handleComentarioChange(estrategiaId, "justificacion", e.target.value)
                }
              />
            </>
          )}
          <ul>{renderLineasAccion(estrategiaId, estrategia["Lineas de acción"])}</ul>
        </div>
      );
    });

  const renderPropuestas = (ejeId, propuestas) =>
    propuestas.map((propuesta, index) => {
      const propuestaId = `${ejeId}-propuesta-${index}`;
      return (
        <div key={propuestaId} className={styles.propuesta}>
          <h3>{propuesta["Propuesta Objetivo"]}</h3>
          <p>¿Estás de acuerdo con la estructura del texto anterior?</p>
          <div>
            <label>
              <input
                type="radio"
                name={`${propuestaId}-acuerdo`}
                value="yes"
                checked={acuerdo[propuestaId] === "yes"}
                onChange={() => setAcuerdo({ ...acuerdo, [propuestaId]: "yes" })}
              />
              Sí
            </label>
            <label style={{ marginLeft: "1rem" }}>
              <input
                type="radio"
                name={`${propuestaId}-acuerdo`}
                value="no"
                checked={acuerdo[propuestaId] === "no"}
                onChange={() => setAcuerdo({ ...acuerdo, [propuestaId]: "no" })}
              />
              No
            </label>
          </div>
          {acuerdo[propuestaId] === "no" && (
            <>
              <textarea
                placeholder="Cómo debería decir..."
                value={comentarios[propuestaId]?.comoDecir || ""}
                onChange={(e) =>
                  handleComentarioChange(propuestaId, "comoDecir", e.target.value)
                }
              />
              <textarea
                placeholder="Justificación..."
                value={comentarios[propuestaId]?.justificacion || ""}
                onChange={(e) =>
                  handleComentarioChange(propuestaId, "justificacion", e.target.value)
                }
              />
            </>
          )}
          {renderEstrategias(propuestaId, propuesta.Estrategias)}
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
