"use client";

import React, { useState } from "react";
import { dataObjetivoEG01, dataObjetivoEG02, dataObjetivoEG03, dataObjetivoEG04, dataObjetivoEG05, dataObjetivoEG06, dataObjetivoEG07, dataObjetivoEG08, dataObjetivoEG09, dataObjetivoET01, dataObjetivoET02, dataObjetivoET03 } from "@/utils/plataformaEstrategicaData";
import { usePlatform } from "@/context/PlatformContext";
import styles from "./PlataformaEstrategicaReview.module.css";

export default function PlataformaEstrategicaReview() {
  const { selectedEjes } = usePlatform();

  const [comentarios, setComentarios] = useState({});

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

  const dataObjetivosEjes = allData
    .filter((item) => selectedEjes.includes(item.id))
    .flatMap((item) => item.data);

  const handleComentarioChange = (id, campo, valor) => {
    setComentarios((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  return (
    <div className={styles.container}>
      <h2>Revisión de la Plataforma Estratégica</h2>
      <h3 className={styles.ejeActivo}>
        Ejes seleccionados: {selectedEjes.join(", ")}
      </h3>

      {dataObjetivosEjes.length === 0 ? (
        <p>No hay datos disponibles para este eje.</p>
      ) : (
        dataObjetivosEjes.map((propuesta, index) => {
          const propuestaId = `propuesta-${index}`;
          return (
            <div key={propuestaId} className={styles.propuesta}>
              <h3>{propuesta["Propuesta Objetivo"]}</h3>
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

              {propuesta.Estrategias.map((estrategia, estrIndex) => {
                const estrategiaId = `${propuestaId}-estrategia-${estrIndex}`;
                return (
                  <div key={estrategiaId} className={styles.estrategia}>
                    <h4>{estrategia.Estrategia}</h4>
                    <textarea
                      placeholder="Cómo debería decir..."
                      value={comentarios[estrategiaId]?.comoDecir || ""}
                      onChange={(e) =>
                        handleComentarioChange(
                          estrategiaId,
                          "comoDecir",
                          e.target.value
                        )
                      }
                    />
                    <textarea
                      placeholder="Justificación..."
                      value={comentarios[estrategiaId]?.justificacion || ""}
                      onChange={(e) =>
                        handleComentarioChange(
                          estrategiaId,
                          "justificacion",
                          e.target.value
                        )
                      }
                    />

                    <ul>
                      {estrategia["Lineas de acción"].map((linea, lineaIndex) => {
                        const lineaId = `${estrategiaId}-linea-${lineaIndex}`;
                        return (
                          <li key={lineaId} className={styles.lineaAccion}>
                            <p>{linea}</p>
                            <textarea
                              placeholder="Cómo debería decir..."
                              value={comentarios[lineaId]?.comoDecir || ""}
                              onChange={(e) =>
                                handleComentarioChange(
                                  lineaId,
                                  "comoDecir",
                                  e.target.value
                                )
                              }
                            />
                            <textarea
                              placeholder="Justificación..."
                              value={comentarios[lineaId]?.justificacion || ""}
                              onChange={(e) =>
                                handleComentarioChange(
                                  lineaId,
                                  "justificacion",
                                  e.target.value
                                )
                              }
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          );
        })
      )}
      <button
        onClick={() => console.log("Comentarios enviados:", comentarios)}
        className={styles.saveButton}
      >
        Guardar comentarios
      </button>
    </div>
  );
}