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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleComentarioChange = (id, campo, valor) => {
    setComentarios((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor }
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleGuardarAvance = () => {
    console.log("Avance guardado:", comentarios);
    setSnackbar({
      open: true,
      message: "¡Avance guardado con éxito!",
      severity: "info"
    });
  };

  const handleGuardarComentarios = () => {
    console.log("Comentarios enviados:", comentarios);
    setSnackbar({
      open: true,
      message: "¡Comentarios enviados con éxito!",
      severity: "success"
    });
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
              <h3 className={styles.ejeActivo}>
                Observación de eje a revisar: {eje}
              </h3>
              {ejeData?.data.length ? (
                renderPropuestas(eje, ejeData.data)
              ) : (
                <p>No hay datos disponibles para este eje.</p>
              )}
            </div>
          );
        })
      )}
      <div className={styles.buttonsContainer}>
        <button onClick={handleGuardarAvance} className={styles.saveButton}>
          Guardar avance
        </button>
        <button onClick={handleGuardarComentarios} className={styles.saveButton}>
          Enviar comentarios
        </button>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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
