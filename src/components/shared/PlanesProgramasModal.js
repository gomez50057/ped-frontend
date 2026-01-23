"use client";

import React, { useEffect, useMemo, useRef, useState, useDeferredValue, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./PlanesProgramasModal.module.css";

function normalizeText(str = "") {
  // Normaliza acentos y casing para búsquedas consistentes
  try {
    return str
      .toString()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();
  } catch {
    // Fallback (por si el motor no soporta \p{Diacritic})
    return str.toString().toLowerCase().trim();
  }
}

function extractMunicipio(label = "", href = "") {
  // 1) Intenta desde el label: "Plan Municipal de Desarrollo de X"
  const m1 = label.match(/Plan Municipal de Desarrollo de\s+(.+)$/i);
  if (m1?.[1]) return m1[1].trim();

  // 2) Intenta desde la URL: .../INSTRUMENTOS POR MUNICIPIOS/<MUNICIPIO>/...
  const decoded = (() => {
    try {
      return decodeURIComponent(href);
    } catch {
      return href;
    }
  })();

  const m2 = decoded.match(/INSTRUMENTOS\s*POR\s*MUNICIPIOS\/([^/]+)\//i);
  if (m2?.[1]) return m2[1].replace(/%20/g, " ").trim();

  return "";
}

function isExternalHref(href = "") {
  return /^https?:\/\//i.test(href);
}

export default function PlanesProgramasModal({ open, onClose, groups = [] }) {
  const [mounted, setMounted] = useState(false);

  // UI state
  const [groupFilter, setGroupFilter] = useState("Todos");
  const [municipioFilter, setMunicipioFilter] = useState("Todos");
  const [query, setQuery] = useState("");

  const deferredQuery = useDeferredValue(query);
  const closeBtnRef = useRef(null);
  const lastActiveElRef = useRef(null);

  useEffect(() => setMounted(true), []);

  // Lock scroll + ESC close + foco accesible
  useEffect(() => {
    if (!open) return;

    lastActiveElRef.current = document.activeElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);

    // Foco al botón cerrar
    setTimeout(() => closeBtnRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);

      // Restaura foco
      const el = lastActiveElRef.current;
      if (el && typeof el.focus === "function") el.focus();
    };
  }, [open, onClose]);

  // Reset de filtros al abrir (para UX más clara)
  useEffect(() => {
    if (!open) return;
    setGroupFilter("Todos");
    setMunicipioFilter("Todos");
    setQuery("");
  }, [open]);

  const flatDocs = useMemo(() => {
    const docs = [];
    for (const g of groups) {
      const groupLabel = g.label;
      const submenu = Array.isArray(g.submenu) ? g.submenu : [];
      for (const item of submenu) {
        const municipio = groupLabel === "Planes Municipales de Desarrollo"
          ? extractMunicipio(item.label, item.href)
          : "";

        docs.push({
          id: `${groupLabel}::${item.href}::${item.label}`,
          group: groupLabel,
          label: item.label,
          href: item.href,
          municipio,
          _q: normalizeText(`${item.label} ${municipio} ${groupLabel}`),
        });
      }
    }
    return docs;
  }, [groups]);

  const municipios = useMemo(() => {
    const set = new Set();
    for (const d of flatDocs) {
      if (d.group === "Planes Municipales de Desarrollo" && d.municipio) set.add(d.municipio);
    }
    return ["Todos", ...Array.from(set).sort((a, b) => a.localeCompare(b, "es"))];
  }, [flatDocs]);

  const filtered = useMemo(() => {
    const q = normalizeText(deferredQuery);

    return flatDocs.filter((d) => {
      if (groupFilter !== "Todos" && d.group !== groupFilter) return false;

      if (
        (groupFilter === "Planes Municipales de Desarrollo" || (groupFilter === "Todos" && d.group === "Planes Municipales de Desarrollo")) &&
        municipioFilter !== "Todos" &&
        d.group === "Planes Municipales de Desarrollo" &&
        d.municipio !== municipioFilter
      ) {
        return false;
      }

      if (q && !d._q.includes(q)) return false;
      return true;
    });
  }, [flatDocs, groupFilter, municipioFilter, deferredQuery]);

  const groupedResults = useMemo(() => {
    // Para "Todos": agrupamos para mostrar secciones
    const map = new Map();
    for (const g of groups) map.set(g.label, []);
    for (const d of filtered) {
      if (!map.has(d.group)) map.set(d.group, []);
      map.get(d.group).push(d);
    }
    // Ordena internamente
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => a.label.localeCompare(b.label, "es"));
      map.set(k, arr);
    }
    return map;
  }, [filtered, groups]);

  const showMunicipioFilter =
    groupFilter === "Planes Municipales de Desarrollo";

  const handleOverlayClick = useCallback(
    (e) => {
      // Cerrar solo si se clickea el overlay, no el contenido
      if (e.target === e.currentTarget) onClose?.();
    },
    [onClose]
  );

  if (!open || !mounted) return null;

  return createPortal(
    <div className={styles.overlay} onMouseDown={handleOverlayClick} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Planes y Programas"
      >
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>Planes y Programas</h2>
            <p className={styles.subtitle}>
              Busca, filtra y consulta documentos en una nueva pestaña.
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <input
              className={styles.search}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar documento (nombre, municipio, grupo)…"
              aria-label="Buscar"
            />
            <div className={styles.counter}>
              {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className={styles.filters}>
            <label className={styles.filterItem}>
              <span>Grupo</span>
              <select
                className={styles.select}
                value={groupFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setGroupFilter(val);
                  setMunicipioFilter("Todos");
                }}
              >
                <option value="Todos">Todos</option>
                {groups.map((g) => (
                  <option key={g.label} value={g.label}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.filterItem}>
              <span>Municipio</span>
              <select
                className={styles.select}
                value={municipioFilter}
                onChange={(e) => setMunicipioFilter(e.target.value)}
                disabled={!showMunicipioFilter}
                title={!showMunicipioFilter ? "Disponible al seleccionar Planes Municipales de Desarrollo" : ""}
              >
                {municipios.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setQuery("");
                setGroupFilter("Todos");
                setMunicipioFilter("Todos");
              }}
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className={styles.body}>
          {groupFilter === "Todos" ? (
            <div className={styles.groupList}>
              {groups.map((g) => {
                const docs = groupedResults.get(g.label) || [];
                return (
                  <section key={g.label} className={styles.groupSection}>
                    <div className={styles.groupHeader}>
                      <h3 className={styles.groupTitle}>{g.label}</h3>
                      <span className={styles.groupCount}>{docs.length}</span>
                    </div>

                    {docs.length === 0 ? (
                      <div className={styles.emptyGroup}>Sin resultados en este grupo.</div>
                    ) : (
                      <ul className={styles.docsList}>
                        {docs.map((d) => (
                          <li key={d.id} className={styles.docRow}>
                            <div className={styles.docInfo}>
                              <div className={styles.docName}>{d.label}</div>
                              {d.municipio ? (
                                <div className={styles.docMeta}>Municipio: {d.municipio}</div>
                              ) : null}
                            </div>

                            <a
                              className={styles.cta}
                              href={d.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Consulta
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <ul className={styles.docsList}>
              {filtered
                .filter((d) => d.group === groupFilter)
                .sort((a, b) => a.label.localeCompare(b.label, "es"))
                .map((d) => (
                  <li key={d.id} className={styles.docRow}>
                    <div className={styles.docInfo}>
                      <div className={styles.docName}>{d.label}</div>
                      {d.municipio ? (
                        <div className={styles.docMeta}>Municipio: {d.municipio}</div>
                      ) : null}
                    </div>

                    <a
                      className={styles.cta}
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Consulta
                    </a>
                  </li>
                ))}

              {filtered.filter((d) => d.group === groupFilter).length === 0 ? (
                <div className={styles.emptyGlobal}>No hay resultados con esos filtros.</div>
              ) : null}
            </ul>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerNote}>
            Sugerencia: usa la búsqueda para localizar rápido por palabra clave (por ejemplo: “Pachuca”, “Contraloría”, “Turismo”).
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
