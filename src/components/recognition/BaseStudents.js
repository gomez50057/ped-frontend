"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "@/styles/recognition/Recognition.module.css";
import SendPdfButton from "@/components/recognition/SendPdfButton";

/* Utils */
const pad2 = (n) => String(n).padStart(2, "0");
function isISODate(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s); }

/** Normaliza opciones (ISO completo o solo día) a {iso,label} */
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

export default function BaseStudents({
  backgroundSrc = "",
  minFontPx = 8,
  maxFontPx = 96,
  defaultFontPx = 56,
  aspectRatio = 11 / 8.5,

  /* Fecha */
  dateOptions = [],
  dateBaseYM,
  tz = "America/Mexico_City",
  autoConfirmSingleOption = true,

  /* Lugar */
  municipioOptions = [],                // ← NUEVO: lista desde utils
  autoConfirmSingleMunicipio = true,    // ← NUEVO: si hay 1 opción, confirmar automáticamente
  locationPrefix,                       // ← OPCIONAL: si lo pasas, se usa tal cual (override)
}) {
  const [name, setName] = useState("");
  const [fontPx, setFontPx] = useState(defaultFontPx);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fecha
  const [dateISO, setDateISO] = useState("");
  const [candidateISO, setCandidateISO] = useState("");
  const [dateLocked, setDateLocked] = useState(false);

  // Municipio (Lugar)
  const [municipio, setMunicipio] = useState("");
  const [candidateMunicipio, setCandidateMunicipio] = useState("");
  const [municipioLocked, setMunicipioLocked] = useState(false);

  const canvasRef = useRef(null);


  // Reutilizable: genera PDF y devuelve un Blob
  // Dentro de BaseStudents.js
  const MB = 1024 * 1024;

  const generatePdfBlob = async () => {
    if (!canvasRef.current) return null;
    const node = canvasRef.current;
    const rect = node.getBoundingClientRect();

    // import dinámico
    const { toJpeg } = await import("html-to-image");
    const { jsPDF } = await import("jspdf");

    const makeOnce = async ({ maxW, quality }) => {
      // Calcula alto según relación real del nodo
      const targetW = Math.min(maxW, Math.round(rect.width)); // no crecer sobre el tamaño visible
      const targetH = Math.round(targetW * (rect.height / rect.width));

      const dataUrl = await toJpeg(node, {
        quality,                 // 0.1
        pixelRatio: 1,           // usamos canvasWidth/Height, no sobredimensionar
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
      pdf.addImage(dataUrl, "JPEG", 0, 0, pageW, pageH, undefined, "SLOW"); // compresión más agresiva

      return pdf.output("blob");
    };

    // Intento 1: calidad alta
    let blob = await makeOnce({ maxW: 2200, quality: 0.85 });
    if (blob.size <= 12 * MB) return blob;

    // Intento 2: medio
    blob = await makeOnce({ maxW: 2000, quality: 0.80 });
    if (blob.size <= 12 * MB) return blob;

    // Intento 3: más compacto
    blob = await makeOnce({ maxW: 1800, quality: 0.75 });
    return blob; // debería quedar <10–12 MB en la mayoría de casos
  };


  // Normaliza opciones de fecha
  const options = useMemo(
    () => normalizeDateOptions({ options: dateOptions, baseYM: dateBaseYM, tz }),
    [dateOptions, dateBaseYM, tz]
  );
  const allowed = useMemo(() => new Set(options.map((o) => o.iso)), [options]);

  const selectedLabel = useMemo(() => {
    const o = options.find((o) => o.iso === dateISO);
    return o?.label || "";
  }, [options, dateISO]);

  // Etiqueta de lugar compuesta (solo si no se pasa locationPrefix por props)
  const composedLocationPrefix = useMemo(() => {
    if (typeof locationPrefix === "string" && locationPrefix.trim()) return locationPrefix;
    return municipio ? `${municipio}, Hgo.,` : "";
  }, [locationPrefix, municipio]);

  /* Captura y bloqueo del NOMBRE */
  useEffect(() => {
    const saved = sessionStorage.getItem("cert:name");
    if (saved) { setName(saved); return; }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const input = window.prompt(
        "Escribe tu nombre completo.\nSe reflejará tal cual en el reconocimiento."
      );
      if (input === null) { alert("Para continuar, necesitas capturar un nombre."); continue; }
      if (!input.trim()) { alert("El nombre no puede estar vacío. Intenta de nuevo."); continue; }
      const confirmado = window.confirm(
        `¿Confirmas usar y mostrar este nombre exactamente así?\n\n"${input}"\n\n` +
        "No podrás modificarlo después; se reflejará tal cual en el reconocimiento."
      );
      if (confirmado) {
        sessionStorage.setItem("cert:name", input);
        setName(input);
        alert("Nombre confirmado. Verás ahora la vista previa.");
        break;
      }
    }
  }, []);

  /* Inicializa selección de FECHA */
  useEffect(() => {
    if (options.length === 0) return;
    const saved = sessionStorage.getItem("cert:dateISO");
    if (saved && allowed.has(saved)) {
      setDateISO(saved);
      setCandidateISO(saved);
      setDateLocked(true);
      return;
    }
    if (options.length === 1) {
      setCandidateISO(options[0].iso);
      if (autoConfirmSingleOption) {
        const ok = window.confirm(
          `¿Confirmas usar la siguiente fecha?\n\n${options[0].label}\n\n` +
          "Se mostrará tal cual en el reconocimiento."
        );
        if (ok) {
          sessionStorage.setItem("cert:dateISO", options[0].iso);
          setDateISO(options[0].iso);
          setDateLocked(true);
        }
      }
      return;
    }
    setCandidateISO(options[0].iso);
  }, [options, allowed, autoConfirmSingleOption]);

  /* Inicializa selección de MUNICIPIO */
  useEffect(() => {
    if (!municipioOptions || municipioOptions.length === 0) return;
    const saved = sessionStorage.getItem("cert:municipio");
    if (saved && municipioOptions.includes(saved)) {
      setMunicipio(saved);
      setCandidateMunicipio(saved);
      setMunicipioLocked(true);
      return;
    }
    if (municipioOptions.length === 1) {
      setCandidateMunicipio(municipioOptions[0]);
      if (autoConfirmSingleMunicipio) {
        const ok = window.confirm(
          `¿Confirmas usar el siguiente lugar?\n\n${municipioOptions[0]}, Hgo.\n\n` +
          "Se mostrará tal cual en el reconocimiento."
        );
        if (ok) {
          sessionStorage.setItem("cert:municipio", municipioOptions[0]);
          setMunicipio(municipioOptions[0]);
          setMunicipioLocked(true);
        }
      }
      return;
    }
    setCandidateMunicipio(municipioOptions[0]);
  }, [municipioOptions, autoConfirmSingleMunicipio]);

  const confirmDate = () => {
    if (!candidateISO || !allowed.has(candidateISO)) {
      alert("Selecciona una fecha válida.");
      return;
    }
    const label = options.find((o) => o.iso === candidateISO)?.label || candidateISO;
    const ok = window.confirm(
      `¿Confirmas usar la siguiente fecha?\n\n${label}\n\n` +
      "Se mostrará tal cual en el reconocimiento y quedará bloqueada durante la sesión."
    );
    if (!ok) return;
    sessionStorage.setItem("cert:dateISO", candidateISO);
    setDateISO(candidateISO);
    setDateLocked(true);
  };

  const confirmMunicipio = () => {
    if (!candidateMunicipio || !municipioOptions.includes(candidateMunicipio)) {
      alert("Selecciona un lugar válido.");
      return;
    }
    const ok = window.confirm(
      `¿Confirmas usar el siguiente lugar?\n\n${candidateMunicipio}, Hgo.\n\n` +
      "Se mostrará tal cual en el reconocimiento y quedará bloqueado durante la sesión."
    );
    if (!ok) return;
    sessionStorage.setItem("cert:municipio", candidateMunicipio);
    setMunicipio(candidateMunicipio);
    setMunicipioLocked(true);
  };

  const bgStyle = useMemo(
    () => ({ backgroundImage: `url(${backgroundSrc})`, aspectRatio }),
    [backgroundSrc, aspectRatio]
  );

  // Exporta SOLO el certificado como PDF carta horizontal
  const handleDownloadPdf = async () => {
    if (!canvasRef.current) return;
    try {
      setIsDownloading(true);
      const pdfBlob = await generatePdfBlob();
      if (!pdfBlob) throw new Error("No se pudo generar el PDF");
      const arrayBuf = await pdfBlob.arrayBuffer();

      const safeName = String(name).replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "").toLowerCase();
      // Descargar
      const url = URL.createObjectURL(new Blob([arrayBuf], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-${safeName || "participante"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Limpieza de sesión
      sessionStorage.removeItem("cert:name");
      sessionStorage.removeItem("cert:dateISO");
      sessionStorage.removeItem("cert:municipio");

      alert("Descarga en curso. Gracias por tu participación. Con estrategia, cercanía y la colaboración de todas y todos los hidalguenses, crecemos juntos y construimos el Hidalgo que soñamos.");
    } catch (err) {
      console.error(err);
      alert("No se pudo generar el PDF. Verifica tu conexión e inténtalo nuevamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Reglas de render: necesitamos nombre, fecha y municipio bloqueados
  const ready = Boolean(name) && Boolean(dateISO) && dateLocked && Boolean(composedLocationPrefix) && municipioLocked;

  return (
    <section className={styles.section} aria-labelledby="cert-title">
      <div className={styles.controls}>
        <h2 id="cert-title" className={styles.title}>Previa del reconocimiento</h2>

        {/* Selección de lugar (municipio) */}
        {(!municipioOptions || municipioOptions.length === 0) ? (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.noticeBody}>
              Configura <code>municipioOptions</code> para habilitar el lugar.
            </p>
          </div>
        ) : !municipioLocked ? (
          <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto" }}>
            <label htmlFor="munSelect" className={styles.sliderLabel}>
              Lugar:
            </label>
            <select
              id="munSelect"
              className={styles.slider}
              value={candidateMunicipio}
              onChange={(e) => setCandidateMunicipio(e.target.value)}
            >
              {municipioOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button type="button" className={styles.downloadBtn} onClick={confirmMunicipio}>
              Confirmar
            </button>
          </div>
        ) : (
          <p className={styles.helper}>
            Lugar bloqueado: <strong>{composedLocationPrefix.replace(/,\s*$/, "")}</strong>
          </p>
        )}

        {/* Selección de fecha */}
        {options.length === 0 ? (
          <div className={styles.noticeCard} role="alert">
            <p className={styles.noticeBody}>
              Configura <code>dateOptions</code> (y opcional <code>dateBaseYM</code>) para habilitar la fecha del foro.
            </p>
          </div>
        ) : !dateLocked ? (
          <div className={styles.sliderRow} style={{ gridTemplateColumns: "auto 1fr auto" }}>
            <label htmlFor="dateSelect" className={styles.sliderLabel}>
              Fecha del foro:
            </label>
            <select
              id="dateSelect"
              className={styles.slider}
              value={candidateISO}
              onChange={(e) => setCandidateISO(e.target.value)}
            >
              {options.map(({ iso, label }) => (
                <option key={iso} value={iso}>{label}</option>
              ))}
            </select>
            <button type="button" className={styles.downloadBtn} onClick={confirmDate}>
              Confirmar
            </button>
          </div>
        ) : (
          <p className={styles.helper}>
            Fecha bloqueada: <strong>{selectedLabel}</strong>
          </p>
        )}

        {/* Slider de tamaño de letra */}
        <div className={styles.sliderRow}>
          <label htmlFor="fontSize" className={styles.sliderLabel}>Tamaño de letra:</label>
          <input
            id="fontSize"
            type="range"
            min={minFontPx}
            max={maxFontPx}
            value={fontPx}
            onChange={(e) => setFontPx(parseInt(e.target.value, 10))}
            className={styles.slider}
            aria-valuemin={minFontPx}
            aria-valuemax={maxFontPx}
            aria-valuenow={fontPx}
            aria-describedby="font-help"
          />
          <span className={styles.sliderValue} aria-live="polite">{fontPx}px</span>
        </div>

        <div id="font-help" className={styles.instructions} role="note">
          <p>1) Elige el <strong>Lugar</strong> y la <strong>Fecha del foro</strong>, luego confirma ambos.</p>
          <p>2) Ajusta el tamaño hasta que tu nombre sea <strong>legible</strong>, en <strong>una sola línea</strong> y <strong>sin sobreponerse</strong> a los bordes.</p>
          <p>3) Haz clic en <strong>Descargar PDF</strong> y espera a que finalice el proceso.</p>
        </div>

        <p className={styles.helper}>
          El nombre, el lugar y la fecha quedan <strong>bloqueados</strong> durante la sesión para preservar la validez del reconocimiento.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.downloadBtn}
            onClick={handleDownloadPdf}
            disabled={isDownloading || !ready}
            title={!ready ? "Confirma nombre, lugar y fecha para habilitar la descarga" : "Descargar PDF"}
          >
            {isDownloading ? "Generando..." : "Descargar PDF"}
          </button>
          <SendPdfButton
            name={name}
            getPdfBlob={generatePdfBlob}
            disabled={isDownloading || !ready}
          />
        </div>
      </div>

      {/* SOLO este bloque se rasteriza al PDF */}
      {Boolean(name) && Boolean(dateISO) && dateLocked && municipioLocked && (
        <div
          ref={canvasRef}
          className={styles.canvas}
          style={bgStyle}
          role="img"
          aria-label="Previa del certificado"
        >
          <div className={styles.overlay} aria-hidden="true" />

          <div className={styles.name} style={{ fontSize: `${fontPx}px` }}>
            {name}
          </div>

          {/* Lugar + Fecha */}
          <p className={styles.date}>{composedLocationPrefix}<time dateTime={dateISO}>{selectedLabel}</time>.</p>

          {/* Excluido en exportación */}
          <div className={styles.lockBadge} data-export="hide" title="Campos bloqueados">🔒</div>
        </div>
      )}
    </section>
  );
}
