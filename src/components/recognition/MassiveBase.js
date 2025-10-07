"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import styles from "@/styles/recognition/Recognition.module.css";
import SendPdfButtonsMassive from "@/components/recognition/SendPdfButtonsMassive";


/* ==================== Utils de fecha ==================== */
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

export default function MassiveBase({
  backgroundSrc = "",
  minFontPx = 8,
  maxFontPx = 96,
  defaultFontPx = 56,
  aspectRatio = 11 / 8.5,

  /* Fecha (puedes pasar días o ISO completas) */
  dateOptions = [],            // [17,18] o ["2025-10-17","2025-10-18"]
  dateBaseYM,                  // "yyyy-mm" si usas días
  tz = "America/Mexico_City",

  /* Lugar */
  municipioOptions = [],       // lista de municipios válidos para elegir
  locationPrefix,              // si lo pasas (string no vacío), se usa igual para todos
}) {
  // =========== Personas desde Excel ===========
  const [people, setPeople] = useState([]); // [{ name, email }]
  const [uploadError, setUploadError] = useState("");

  // === Modo sincronizar fechas a todos ===
  const [syncAllDates, setSyncAllDates] = useState(false);

  // Índice actual y mapa de tamaños por persona
  const [index, setIndex] = useState(0);
  const [fontMap, setFontMap] = useState(() => []);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef(null);

  const currentName = people[index]?.name || "";
  const total = people.length;
  const currentFont = fontMap[index] ?? defaultFontPx;

  // Fondo/canvas
  const bgStyle = useMemo(
    () => ({ backgroundImage: `url(${backgroundSrc})`, aspectRatio }),
    [backgroundSrc, aspectRatio]
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

  /* ==================== FECHA por persona ==================== */
  const options = useMemo(
    () => normalizeDateOptions({ options: dateOptions, baseYM: dateBaseYM, tz }),
    [dateOptions, dateBaseYM, tz]
  );
  const allowed = useMemo(() => new Set(options.map((o) => o.iso)), [options]);

  // Fecha seleccionada por persona (sin bloqueos)
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

  // Fecha actual a todos si está activado
  const applyCurrentDateToAll = () => {
    if (!currentDateISO) return;
    setDateISOMap((prev) => (prev.length ? Array(prev.length).fill(currentDateISO) : prev));
  };

  /* ==================== LUGAR por persona ==================== */
  const [municipioMap, setMunicipioMap] = useState([]); // municipio por persona

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

  // Prefijo de lugar compuesto (por persona o global si pasas locationPrefix)
  const composedLocationPrefix = useMemo(() => {
    if (typeof locationPrefix === "string" && locationPrefix.trim()) {
      // Override global: si se provee, se usa igual para todos
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

      // Normaliza encabezados (acentos, mayúsculas, espacios)
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

      // Fallback a primera/segunda columna si no detecta encabezados
      if (!nameKey) nameKey = firstRowKeys[0];
      if (!emailKey) emailKey = firstRowKeys[1] ?? firstRowKeys[0];

      const parsed = rows
        .map((r) => ({
          name: String(r?.[nameKey] ?? "").trim(),
          email: String(r?.[emailKey] ?? "").trim(),
        }))
        .filter((p) => p.name);

      if (!parsed.length) throw new Error("No se encontraron nombres válidos en el archivo.");

      // Dedup por (name,email)
      const seen = new Set();
      const unique = parsed.filter((p) => {
        const key = `${p.name.toLowerCase()}|${p.email.toLowerCase()}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      setPeople(unique);
      setIndex(0);
      e.target.value = ""; // permitir reimportar el mismo archivo
    } catch (err) {
      console.error(err);
      setUploadError(
        err?.message ||
        'No se pudo leer el archivo. Usa .xlsx/.xls/.csv (UTF-8) con columnas "Nombre" y "Correo".'
      );
    }
  };

  /* ==================== Exportaciones ==================== */
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

  // Cambia temporalmente el índice visible, espera un frame, rasteriza y devuelve Blob.
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

      // Generación compacta (calidad buena, peso razonable)
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
      // vuelve al índice anterior en UI
      if (prev !== i) {
        setIndex(prev);
        await nextFrame();
      }
    }
  };

  // Render del canvas: persona, fecha y lugar (por persona)
  const ready =
    Boolean(currentName) && Boolean(currentDateISO) && Boolean(composedLocationPrefix);

  return (
    <section className={styles.section} aria-labelledby="batch-cert-title">
      <div className={styles.controls}>
        <h2 id="batch-cert-title" className={styles.title}>
          Previa del reconocimiento (lote)
        </h2>

        {/* Carga de Excel/CSV */}
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
                {p.name}
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

        {/* Lugar por persona */}
        {municipioOptions.length === 0 ? (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.noticeBody}>
              Configura <code>municipioOptions</code> para habilitar el lugar.
            </p>
          </div>
        ) : (
          <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto" }}>
            <label htmlFor="munSelectPer" className={styles.sliderLabel}>Lugar (por reconocimiento):</label>
            <select
              id="munSelectPer"
              className={styles.slider}
              value={currentMunicipio}
              onChange={(e) =>
                setMunicipioMap((prev) => {
                  const next = [...prev];
                  next[index] = e.target.value;
                  return next;
                })
              }
            >
              {municipioOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <span className={styles.sliderValue}>{currentMunicipio || "—"}</span>
          </div>
        )}

        {/* Fecha por persona */}
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
                    // Si está activo, se aplica a todos
                    return prev.length ? Array(prev.length).fill(value) : prev;
                  }
                  // Comportamiento normal: sólo el actual
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
        
        {/* === Controles de fecha masiva === */}
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


        {/* Slider de tamaño de letra (por persona) */}
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
          <p>1) Carga tu lista y, para cada reconocimiento, elige <strong>Lugar</strong> y <strong>Fecha</strong> en sus desplegables.</p>
          <p>2) Ajusta el tamaño hasta que el nombre sea <strong>legible</strong>, idealmente en <strong>una sola línea</strong> y <strong>sin sobreponerse</strong>.</p>
          <p>3) Usa <strong>Descargar PDF</strong> para el actual, o <strong>Descargar todos</strong>.</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={handleDownloadCurrent}
            disabled={isDownloading || !ready}
            title={!ready ? "Selecciona lugar y fecha para habilitar la descarga" : "Descargar PDF"}
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

        {uploadError && (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.noticeBody}>{uploadError}</p>
          </div>
        )}
      </div>

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
