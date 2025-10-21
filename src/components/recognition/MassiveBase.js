"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import styles from "@/styles/recognition/Recognition.module.css";
import SendPdfButtonsMassive from "@/components/recognition/SendPdfButtonsMassive";

/* ==================== Utils ==================== */
const pad2 = (n) => String(n).padStart(2, "0");
const isISODate = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

/** Normaliza opciones (ISO completo o solo día) a {iso, label} */
function normalizeDateOptions({ options, baseYM, tz }) {
  const out = [];
  for (const opt of options || []) {
    let iso = null;
    if (typeof opt === "number" || (typeof opt === "string" && /^\d{1,2}$/.test(opt))) {
      if (!baseYM || !/^\d{4}-\d{2}$/.test(baseYM)) continue;
      const day = pad2(parseInt(opt, 10));
      iso = `${baseYM}-${day}`;
    } else if (isISODate(opt)) {
      iso = opt;
    }
    if (!iso) continue;

    const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
    const date = new Date(y, (m || 1) - 1, d || 1);
    const label = new Intl.DateTimeFormat("es-MX", {
      timeZone: tz || "America/Mexico_City",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);

    out.push({ iso, label });
  }
  const seen = new Set();
  return out.filter(({ iso }) => (seen.has(iso) ? false : seen.add(iso)));
}

/* Normaliza opciones de fondo a {label, src} */
function normalizeBgOptions(backgroundOptions = [], backgroundBasePath = "") {
  const list = [];
  for (const item of backgroundOptions) {
    if (!item) continue;
    if (typeof item === "string") {
      const label = item.replace(/\.[a-z0-9]+$/i, "");
      const src = backgroundBasePath ? backgroundBasePath + item : item;
      list.push({ label, src });
    } else if (Array.isArray(item) && item.length >= 2) {
      const [label, fileOrSrc] = item;
      const src = backgroundBasePath ? backgroundBasePath + fileOrSrc : fileOrSrc;
      list.push({ label: String(label), src });
    } else if (typeof item === "object" && item.src) {
      const label = item.label || item.src.replace(/\.[a-z0-9]+$/i, "");
      const src = backgroundBasePath ? backgroundBasePath + item.src : item.src;
      list.push({ label: String(label), src });
    }
  }
  const seen = new Set();
  return list.filter(({ src }) => (seen.has(src) ? false : seen.add(src)));
}

export default function MassiveBase({
  backgroundOptions = [],
  backgroundBasePath = "",
  /* Fallback si no hay opciones */
  backgroundSrc = "",
  minFontPx = 8,
  maxFontPx = 96,
  defaultFontPx = 56,
  aspectRatio = 11 / 8.5,

  /* Fecha */
  dateOptions = [],
  dateBaseYM,
  tz = "America/Mexico_City",

  /* Lugar */
  municipioOptions = [],
  locationPrefix,
}) {
  // ====== Personas ======
  const [people, setPeople] = useState([]); // [{name,email}]
  const [uploadError, setUploadError] = useState("");
  const [manualError, setManualError] = useState("");

  // Campos para alta manual
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  // Sincronizaciones masivas
  const [syncAllDates, setSyncAllDates] = useState(false);
  const [syncAllBackgrounds, setSyncAllBackgrounds] = useState(false);
  const [syncAllMunicipios, setSyncAllMunicipios] = useState(false); // NEW

  // Índice y mapas
  const [index, setIndex] = useState(0);
  const [fontMap, setFontMap] = useState(() => []);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef(null);

  const currentName = people[index]?.name || "";
  const total = people.length;
  const currentFont = fontMap[index] ?? defaultFontPx;

  // === Opciones de fondo normalizadas ===
  const bgOptions = useMemo(() => {
    const normalized = normalizeBgOptions(backgroundOptions, backgroundBasePath);
    if (!normalized.length && backgroundSrc) {
      return [{ label: "Fondo por defecto", src: backgroundSrc }];
    }
    return normalized;
  }, [backgroundOptions, backgroundBasePath, backgroundSrc]);

  // Mapa de fondo por persona (src)
  const [backgroundMap, setBackgroundMap] = useState([]);
  useEffect(() => {
    const def = bgOptions[0]?.src || backgroundSrc || "";
    setBackgroundMap((prev) => {
      const next = Array(people.length).fill(def);
      for (let i = 0; i < Math.min(prev.length, next.length); i++) {
        const keep = prev[i] && (prev[i] === def || bgOptions.some((o) => o.src === prev[i]));
        next[i] = keep ? prev[i] : def;
      }
      const same = prev.length === next.length && prev.every((v, i) => v === next[i]);
      return same ? prev : next;
    });
  }, [people.length, bgOptions, backgroundSrc]);

  const currentBgSrc = backgroundMap[index] || (bgOptions[0]?.src || backgroundSrc || "");

  // Estilo canvas: usa el fondo seleccionado por persona
  const bgStyle = useMemo(
    () => ({ backgroundImage: `url(${currentBgSrc})`, aspectRatio }),
    [currentBgSrc, aspectRatio]
  );

  const sanitize = (s = "") =>
    String(s).replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "").toLowerCase();

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

  // Ajusta fontMap al cambiar total
  useEffect(() => {
    setFontMap((prev) => {
      const next = Array(people.length).fill(defaultFontPx);
      for (let i = 0; i < Math.min(prev.length, next.length); i++) next[i] = prev[i];
      return next;
    });
    if (index >= people.length) setIndex(people.length ? 0 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people.length, defaultFontPx]);

  /* ==================== FECHA ==================== */
  const options = useMemo(
    () => normalizeDateOptions({ options: dateOptions, baseYM: dateBaseYM, tz }),
    [dateOptions, dateBaseYM, tz]
  );
  const allowed = useMemo(() => new Set(options.map((o) => o.iso)), [options]);
  const [dateISOMap, setDateISOMap] = useState([]);
  useEffect(() => {
    const def = options[0]?.iso || "";
    setDateISOMap((prev) => {
      const next = Array(people.length).fill(def);
      for (let i = 0; i < Math.min(prev.length, next.length); i++) {
        next[i] = allowed.has(prev[i]) ? prev[i] : def;
      }
      const same = prev.length === next.length && prev.every((v, i) => v === next[i]);
      return same ? prev : next;
    });
  }, [people.length, options, allowed]);

  const currentDateISO = dateISOMap[index] || "";
  const selectedLabel = useMemo(() => {
    const o = options.find((o) => o.iso === currentDateISO);
    return o?.label || "";
  }, [options, currentDateISO]);

  const applyCurrentDateToAll = () => {
    if (!currentDateISO) return;
    setDateISOMap((prev) => (prev.length ? Array(prev.length).fill(currentDateISO) : prev));
  };

  /* ==================== LUGAR ==================== */
  const [municipioMap, setMunicipioMap] = useState([]);
  useEffect(() => {
    const def = municipioOptions?.[0] || "";
    setMunicipioMap((prev) => {
      const next = Array(people.length).fill(def);
      for (let i = 0; i < Math.min(prev.length, next.length); i++) {
        next[i] = municipioOptions.includes(prev[i]) ? prev[i] : def;
      }
      const same = prev.length === next.length && prev.every((v, i) => v === next[i]);
      return same ? prev : next;
    });
  }, [people.length, municipioOptions]);
  const currentMunicipio = municipioMap[index] || "";

  const composedLocationPrefix = useMemo(() => {
    if (typeof locationPrefix === "string" && locationPrefix.trim()) {
      return locationPrefix.trim().replace(/[,.]\s*$/, ", ") + (/, $/.test(locationPrefix) ? "" : "");
    }
    return currentMunicipio ? `${currentMunicipio}, Hgo., ` : "";
  }, [locationPrefix, currentMunicipio]);

  /* ==================== Importar Excel/CSV ==================== */
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    try {
      const XLSX = await import("xlsx");
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data, { type: "array" });
      const sheetName = wb.SheetNames?.[0];
      if (!sheetName) throw new Error("El archivo no contiene hojas.");
      const ws = wb.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });
      if (!Array.isArray(rows) || rows.length === 0) {
        throw new Error("La hoja está vacía o no tiene encabezados.");
      }

      const normalize = (s) =>
        String(s)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9_]/g, "");

      const firstRowKeys = Object.keys(rows[0] || {});
      let nameKey = "";
      let emailKey = "";

      for (const k of firstRowKeys) {
        const n = normalize(k);
        if (!nameKey && /^(nombre|name|nombres|participante)$/.test(n)) nameKey = k;
        if (!emailKey && /^(correo|correoelectronico|email|e?mail|e-mail)$/.test(n)) emailKey = k;
      }

      if (!nameKey) nameKey = firstRowKeys[0];
      if (!emailKey) emailKey = firstRowKeys[1] ?? firstRowKeys[0];

      const parsed = rows
        .map((r) => ({
          name: String(r?.[nameKey] ?? "").trim(),
          email: String(r?.[emailKey] ?? "").trim(),
        }))
        .filter((p) => p.name);

      if (!parsed.length) throw new Error("No se encontraron nombres válidos en el archivo.");

      const seen = new Set();
      const unique = parsed.filter((p) => {
        const key = `${p.name.toLowerCase()}|${p.email.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setPeople(unique);
      setIndex(0);
      e.target.value = "";
    } catch (err) {
      console.error(err);
      setUploadError(
        err?.message ||
        'No se pudo leer el archivo. Usa .xlsx/.xls/.csv (UTF-8) con columnas "Nombre" y "Correo".'
      );
    }
  };

  /* ==================== Alta manual (Nombre + Correo) ==================== */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

  const handleAddManual = () => {
    setManualError("");
    const name = manualName.trim();
    const email = manualEmail.trim();

    if (!name) {
      setManualError("Escribe el nombre.");
      return;
    }
    if (!email) {
      setManualError("Escribe el correo.");
      return;
    }
    if (!emailRegex.test(email)) {
      setManualError("El correo no es válido.");
      return;
    }

    const key = `${name.toLowerCase()}|${email.toLowerCase()}`;
    const exists = people.some(
      (p) => `${p.name.toLowerCase()}|${(p.email || "").toLowerCase()}` === key
    );
    if (exists) {
      setManualError("Ese nombre/correo ya está en la lista.");
      return;
    }

    const next = [...people, { name, email }];
    setPeople(next);
    setIndex(next.length - 1); // seleccionar el recién agregado
    setManualName("");
    setManualEmail("");
  };

  /* ==================== Exportación ==================== */
  const exportAsPdf = async (nameToPrint) => {
    const node = canvasRef.current;
    if (!node) return;
    const { toPng } = await import("html-to-image");
    const { jsPDF } = await import("jspdf");

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 3,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;
        if (node.dataset?.export === "hide") return false;
        return !node.classList?.contains(styles.lockBadge);
      },
    });

    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    pdf.addImage(dataUrl, "PNG", 0, 0, pageW, pageH);
    pdf.save(`certificado-${sanitize(nameToPrint) || "participante"}.pdf`);
  };

  const handleDownloadCurrent = async () => {
    if (!currentName || !currentDateISO || !composedLocationPrefix) return;
    try {
      setIsDownloading(true);
      await exportAsPdf(currentName);
    } catch (e) {
      console.error(e);
      alert("No se pudo generar el PDF actual. Verifica recursos y reintenta.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!total) return;
    const hasLocationFor = (i) =>
      (typeof locationPrefix === "string" && locationPrefix.trim()) || Boolean(municipioMap[i]);

    try {
      setIsDownloading(true);
      for (let i = 0; i < total; i++) {
        if (!dateISOMap[i] || !hasLocationFor(i)) continue;
        setIndex(i);
        await nextFrame();
        await sleep(40);
        await exportAsPdf(people[i].name);
      }
    } catch (e) {
      console.error(e);
      alert("No se pudieron generar todos los PDFs. Intenta nuevamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Para envío por correo (API existente)
  const generatePdfBlobForIndex = async (i) => {
    if (!people[i]) return null;
    const prev = index;
    try {
      setIndex(i);
      await nextFrame();
      await sleep(40);

      const node = canvasRef.current;
      if (!node) return null;

      const rect = node.getBoundingClientRect();
      const { toJpeg } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const targetW = Math.min(2200, Math.round(rect.width));
      const targetH = Math.round(targetW * (rect.height / rect.width));

      const dataUrl = await toJpeg(node, {
        quality: 0.86,
        pixelRatio: 1,
        canvasWidth: targetW,
        canvasHeight: targetH,
        cacheBust: true,
        filter: (n) => {
          if (!(n instanceof HTMLElement)) return true;
          if (n.dataset?.export === "hide") return false;
          return !n.classList?.contains(styles.lockBadge);
        },
      });

      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter", compress: true });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, "JPEG", 0, 0, pageW, pageH, undefined, "SLOW");

      return pdf.output("blob");
    } catch (e) {
      console.error("generatePdfBlobForIndex error:", e);
      return null;
    } finally {
      if (prev !== i) {
        setIndex(prev);
        await nextFrame();
      }
    }
  };

  const ready =
    Boolean(currentName) && Boolean(currentDateISO) && Boolean(composedLocationPrefix);

  return (
    <section className={styles.section} aria-labelledby="batch-cert-title">
      <div className={styles.controls}>
        <h2 id="batch-cert-title" className={styles.title}>
          Previa del reconocimiento (lote)
        </h2>

        {/* ============ Carga por archivo ============ */}
        <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto auto" }}>
          <label htmlFor="xlsxInput" className={styles.sliderLabel}>
            Lista (Excel/CSV):
          </label>
          <input
            id="xlsxInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            className={styles.slider}
            onChange={handleFile}
          />
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={() => setPeople([])}
            title="Borrar lista"
          >
            Borrar lista
          </button>
          <span className={styles.sliderValue}>{total} registros</span>
        </div>

        {/* ============ Alta manual ============ */}
        <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto 1fr auto" }}>
          <label className={styles.sliderLabel} htmlFor="manualName">Alta manual:</label>
          <input
            id="manualName"
            type="text"
            placeholder="Nombre completo"
            className={styles.slider}
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
          />
          <span style={{ alignSelf: "center", opacity: 0.6, padding: "0 .25rem" }}>Correo:</span>
          <input
            id="manualEmail"
            type="email"
            placeholder="correo@ejemplo.com"
            className={styles.slider}
            value={manualEmail}
            onChange={(e) => setManualEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
          />
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={handleAddManual}
            title="Agregar a la lista"
          >
            Agregar
          </button>
        </div>

        {(uploadError || manualError) && (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.noticeBody}>{uploadError || manualError}</p>
          </div>
        )}

        {/* Selector de persona actual */}
        <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto auto" }}>
          <label htmlFor="nameSelect" className={styles.sliderLabel}>Nombre:</label>
          <select
            id="nameSelect"
            className={styles.slider}
            value={index}
            onChange={(e) => setIndex(parseInt(e.target.value, 10))}
          >
            {people.map((p, i) => (
              <option key={`${p.email || p.name}-${i}`} value={i}>
                {p.name} {p.email ? `— ${p.email}` : ""}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0 || isDownloading}
            title="Anterior"
          >
            ◀
          </button>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            disabled={index === total - 1 || isDownloading}
            title="Siguiente"
          >
            ▶
          </button>
        </div>

        {/* Fondo por reconocimiento */}
        {bgOptions.length === 0 ? (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.noticeBody}>
              No hay <code>backgroundOptions</code>. Se usará <code>backgroundSrc</code> si está definido.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto" }}>
              <label htmlFor="bgSelectPer" className={styles.sliderLabel}>Plantilla (fondo):</label>
              <select
                id="bgSelectPer"
                className={styles.slider}
                value={currentBgSrc}
                onChange={(e) => {
                  const value = e.target.value;
                  setBackgroundMap((prev) => {
                    if (syncAllBackgrounds) {
                      return prev.length ? Array(prev.length).fill(value) : prev;
                    }
                    const next = [...prev];
                    next[index] = value;
                    return next;
                  });
                }}
              >
                {bgOptions.map(({ label, src }) => (
                  <option key={src} value={src}>{label}</option>
                ))}
              </select>
              <span className={styles.sliderValue}>
                {bgOptions.find((o) => o.src === currentBgSrc)?.label || "—"}
              </span>
            </div>

            <div className={styles.sliderRow} style={{ gridTemplateColumns: "1fr auto" }}>
              <label className={styles.sliderLabel} style={{ gridColumn: "1 / span 1" }}>
                <input
                  type="checkbox"
                  checked={syncAllBackgrounds}
                  onChange={(e) => setSyncAllBackgrounds(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Al cambiar la plantilla aquí, aplicarla a todos
              </label>
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={() =>
                  setBackgroundMap((prev) =>
                    prev.length ? Array(prev.length).fill(currentBgSrc) : prev
                  )
                }
                disabled={!currentBgSrc || total === 0}
                title="Clonar la plantilla actual a todos los reconocimientos"
              >
                Aplicar la plantilla actual a todos
              </button>
            </div>
          </>
        )}

        {/* Lugar */}
        {municipioOptions.length === 0 ? (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.noticeBody}>
              Configura <code>municipioOptions</code> para habilitar el lugar.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto" }}>
              <label htmlFor="munSelectPer" className={styles.sliderLabel}>Lugar (por reconocimiento):</label>
              <select
                id="munSelectPer"
                className={styles.slider}
                value={currentMunicipio}
                onChange={(e) => {
                  const value = e.target.value;
                  setMunicipioMap((prev) => {
                    if (syncAllMunicipios) { // NEW
                      return prev.length ? Array(prev.length).fill(value) : prev;
                    }
                    const next = [...prev];
                    next[index] = value;
                    return next;
                  });
                }}
              >
                {municipioOptions.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span className={styles.sliderValue}>{currentMunicipio || "—"}</span>
            </div>

            {/* Controles masivos: lugar */}
            <div className={styles.sliderRow} style={{ gridTemplateColumns: "1fr auto" }}>
              <label className={styles.sliderLabel} style={{ gridColumn: "1 / span 1" }}>
                <input
                  type="checkbox"
                  checked={syncAllMunicipios}
                  onChange={(e) => setSyncAllMunicipios(e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Al cambiar el lugar aquí, aplicarla a todos
              </label>
              <button
                type="button"
                className={styles.downloadBtn}
                onClick={() =>
                  setMunicipioMap((prev) =>
                    prev.length ? Array(prev.length).fill(currentMunicipio) : prev
                  )
                }
                disabled={!currentMunicipio || total === 0}
                title="Clonar el lugar actual a todos los reconocimientos"
              >
                Aplicar el lugar actual a todos
              </button>
            </div>
          </>
        )}

        {/* Fecha */}
        {options.length === 0 ? (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.noticeBody}>
              Configura <code>dateOptions</code> (y opcional <code>dateBaseYM</code>) para habilitar la fecha.
            </p>
          </div>
        ) : (
          <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto" }}>
            <label htmlFor="dateSelectPer" className={styles.sliderLabel}>Fecha (por reconocimiento):</label>
            <select
              id="dateSelectPer"
              className={styles.slider}
              value={currentDateISO || options[0]?.iso || ""}
              onChange={(e) =>
                setDateISOMap((prev) => {
                  const value = e.target.value;
                  if (syncAllDates) {
                    return prev.length ? Array(prev.length).fill(value) : prev;
                  }
                  const next = [...prev];
                  next[index] = value;
                  return next;
                })
              }
            >
              {options.map(({ iso, label }) => (
                <option key={iso} value={iso}>{label}</option>
              ))}
            </select>
            <span className={styles.sliderValue}>{selectedLabel || "—"}</span>
          </div>
        )}

        {/* Controles masivos: fecha */}
        <div className={styles.sliderRow} style={{ gridTemplateColumns: "1fr auto" }}>
          <label className={styles.sliderLabel} style={{ gridColumn: "1 / span 1" }}>
            <input
              type="checkbox"
              checked={syncAllDates}
              onChange={(e) => setSyncAllDates(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Al cambiar la fecha aquí, aplicarla a todos
          </label>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={applyCurrentDateToAll}
            disabled={!currentDateISO || options.length === 0 || total === 0}
            title="Clonar la fecha actual a todos los reconocimientos"
          >
            Aplicar la fecha actual a todos
          </button>
        </div>

        {/* Tamaño de letra */}
        <div className={styles.sliderRow}>
          <label htmlFor="fontSize" className={styles.sliderLabel}>Tamaño de letra:</label>
          <input
            id="fontSize"
            type="range"
            min={minFontPx}
            max={maxFontPx}
            value={currentFont}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setFontMap((prev) => {
                const next = [...prev];
                next[index] = Number.isFinite(val) ? val : defaultFontPx;
                return next;
              });
            }}
            className={styles.slider}
            aria-valuemin={minFontPx}
            aria-valuemax={maxFontPx}
            aria-valuenow={currentFont}
            aria-describedby="batch-font-help"
          />
          <span className={styles.sliderValue} aria-live="polite">{currentFont}px</span>
        </div>

        <div id="batch-font-help" className={styles.instructions} role="note">
          <p>1) Carga tu lista (Excel/CSV) o usa <strong>Alta manual</strong>. Luego, para cada reconocimiento, elige <strong>Plantilla</strong>, <strong>Lugar</strong> y <strong>Fecha</strong>.</p>
          <p>2) Ajusta el tamaño hasta que el nombre sea <strong>legible</strong> y no se sobreponga.</p>
          <p>3) Usa <strong>Descargar PDF</strong> (actual) o <strong>Descargar todos</strong>.</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={handleDownloadCurrent}
            disabled={isDownloading || !ready}
            title={!ready ? "Selecciona plantilla, lugar y fecha para habilitar la descarga" : "Descargar PDF"}
          >
            {isDownloading ? "Generando..." : "Descargar PDF (actual)"}
          </button>

          <button
            type="button"
            className={styles.downloadBtn}
            onClick={handleDownloadAll}
            disabled={isDownloading || options.length === 0}
            title={options.length === 0 ? "Configura dateOptions" : "Generar todos"}
          >
            {isDownloading ? "Generando todos..." : "Descargar todos"}
          </button>

          <SendPdfButtonsMassive
            people={people}
            index={index}
            getPdfBlobForIndex={generatePdfBlobForIndex}
            disabled={!ready || isDownloading}
          />
        </div>
      </div>

      {/* Canvas */}
      {ready && (
        <div
          ref={canvasRef}
          className={styles.canvas}
          style={bgStyle}
          role="img"
          aria-label={`Previa del certificado para ${currentName}`}
        >
          <div className={styles.overlay} aria-hidden="true" />
          <div className={styles.name} style={{ fontSize: `${currentFont}px` }}>
            {currentName}
          </div>

          <p className={styles.date}>
            {composedLocationPrefix}
            <time dateTime={currentDateISO}>{selectedLabel}</time>.
          </p>

          <div className={styles.lockBadge} data-export="hide" title="Campos bloqueados">
            🔒
          </div>
        </div>
      )}
    </section>
  );
}
