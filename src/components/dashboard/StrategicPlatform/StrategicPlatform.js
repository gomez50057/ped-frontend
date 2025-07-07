"use client";

import React, { useEffect, useState } from "react";
import styles from "./StrategicPlatform.module.css";
import { fetchWithAuth } from '@/utils/auth';

const ITEMS = [
  { id: 1, code: "EG01", label: "Eje 1. Estado Planificado, Ordenado y Democrático" },
  { id: 2, code: "EG02", label: "Eje 2. Estado Eficiente y Disciplinado con sus Finanzas" },
  { id: 3, code: "EG03", label: "Eje 3. Estado Seguro y Justo" },
  { id: 4, code: "EG04", label: "Eje 4. Estado para el Bienestar de Todas y Todos y Fraterno con los Pueblos y Comunidades Indígenas" },
  { id: 5, code: "EG05", label: "Eje 5. Estado Educado y Humanista" },
  { id: 6, code: "EG06", label: "Eje 6. Estado Próspero y de Oportunidades" },
  { id: 7, code: "EG07", label: "Eje 7. Estado Orgulloso de su Cultura y Turismo" },
  { id: 8, code: "EG08", label: "Eje 8. Estado Conectado y con Infraestructura para el Desarrollo" },
  { id: 9, code: "EG09", label: "Eje 9. Estado Sustentable y Productivo" },
  { id: 10, code: "ET01", label: "Eje Transversal 1. Estado Transparente y de Rendición de Cuentas" },
  { id: 11, code: "ET02", label: "Eje Transversal 2. Estado Tecnológico, Científico e Innovador" },
  { id: 12, code: "ET03", label: "Eje Transversal 3. Estado de Igualdad Sustantiva y de Derechos Humanos" }
];

export default function StrategicPlatform({ onNext }) {
  const [checkedItems, setCheckedItems] = useState({}); // { [id]: boolean }
  const [loading, setLoading] = useState(true);
  const [selectionId, setSelectionId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Al montar, carga la selección previa del usuario
  useEffect(() => {
    setLoading(true);
    async function loadAxes() {
      try {
        const response = await fetchWithAuth("/api/plataforma/user-axis-selection/");
        if (!response.ok) throw new Error("No se pudo cargar");
        const resData = await response.json();

        if (Array.isArray(resData) && resData.length > 0) {
          const sel = resData[0];
          setSelectionId(sel.id);

          let selectedAxesIds = [];
          if (Array.isArray(sel.axes)) {
            selectedAxesIds = sel.axes;
          }
          const checked = {};
          ITEMS.forEach(item => {
            checked[item.id] = selectedAxesIds.includes(item.id);
          });
          setCheckedItems(checked);
        } else {
          const checked = {};
          ITEMS.forEach(item => { checked[item.id] = false; });
          setCheckedItems(checked);
        }
      } catch {
        setError("No se pudo cargar la selección previa");
      } finally {
        setLoading(false);
      }
    }
    loadAxes();
  }, []);

  const handleToggle = id => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleGuardar = async () => {
    setSaving(true);
    setError("");
    const selectedIds = Object.entries(checkedItems)
      .filter(([, checked]) => checked)
      .map(([id]) => Number(id));
    try {
      let response;
      if (selectionId) {
        // PUT si ya existe selección
        response = await fetchWithAuth(
          `/api/plataforma/user-axis-selection/${selectionId}/`,
          {
            method: "PUT",
            body: JSON.stringify({ axes: selectedIds })
          }
        );
      } else {
        // POST si no existe selección
        response = await fetchWithAuth(
          "/api/plataforma/user-axis-selection/",
          {
            method: "POST",
            body: JSON.stringify({ axes: selectedIds })
          }
        );
      }

      if (!response.ok) throw new Error("No se pudo guardar tu selección.");

      // Si es POST y regresa el id, guárdalo
      if (!selectionId) {
        const data = await response.json();
        if (data.id) setSelectionId(data.id);
      }
      if (onNext) onNext();
    } catch (err) {
      setError("No se pudo guardar tu selección.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <section className={styles.containerStrategicPlatform}>
      <div className={styles.StrategicPlatform}>
        <h2 className={styles.titule}>
          <span className="spanDoarado">Plataforma </span>
          <span className="spanVino">Estratégica</span>
        </h2>
        <p className={styles.description}>
          Revisa la siguiente lista de ejes, ve seleccionando aquellos de tu interés para revisar. Tu participación es clave para construir un futuro mejor.
          <br />
          <span className={styles.descriptionBold}> ¡Tu voz cuenta!</span>
        </p>
        <ul>
          {ITEMS.map((item) => (
            <li key={item.id} className={styles.item}>
              <label className={styles.container}>
                <input
                  type="checkbox"
                  checked={checkedItems[item.id] ?? false}
                  onChange={() => handleToggle(item.id)}
                  disabled={loading}
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
              <span className={styles.labelText}>{item.label}</span>
            </li>
          ))}
        </ul>
        <div className={styles.buttonWrapper}>
          <button
            className={styles.slideButton}
            onClick={handleGuardar}
            disabled={loading || saving}
          >
            {saving ? "Guardando..." : "Guardar elección"}
          </button>
        </div>
        {error && (
          <div style={{ color: "red", marginTop: 12 }}>{error}</div>
        )}
      </div>

      {/* <div className={styles.containerAdvertising}>
        <h3>Impulsamos el Futuro</h3>
        <ul className={styles.adList}>
          <li>🌱 Desarrollo Sustentable</li>
          <li>🚀 Innovación y Tecnología</li>
          <li>📚 Educación y Cultura</li>
        </ul>
        <p>Únete a la transformación: juntos construimos el cambio.</p>
        <h3>Comprometidos con el Progreso</h3>
        <blockquote className={styles.adQuote}>
          &ldquo;El futuro lo construimos con disciplina, equidad y compromiso. Los Ejes
          Estratégicos son nuestra guía para un estado próspero y justo.&rdquo;
        </blockquote>
        <p>— Gobierno Estatal 2025</p>
      </div> */}

      <div className={styles.containerAdvertising}>
        <img src="/img/dashboard/bg/plataforma.webp" alt="Publicidad" className={styles.adImage} />
      </div>
    </section>
  );
}
