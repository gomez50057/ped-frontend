"use client";

import { useState } from "react";
import styles from "@/styles/recognition/Recognition.module.css";

function buildEmailContent(name) {
  const subject = `Reconocimiento de Participación – ${name}`;
  const body =
    `¡Felicidades, ${name}!\n\n` +
    `Queremos agradecer tu participación en los Foros de Consulta Diálogos Ciudadanos para la Actualización del Plan Estatal de Desarrollo 2025-2028.\n\n` +
    `Estos foros no son únicamente un espacio de consulta, sino una plataforma de diálogo abierto donde la ciudadanía aporta su visión y compromiso para trazar, junto con el gobierno, la ruta de desarrollo que guiará a Hidalgo en los próximos años. Tu voz contribuyó a darle fuerza y sentido ciudadano a este proceso.\n\n` +
    `Como muestra de reconocimiento a tu contribución, te compartimos tu Constancia de Participación en un archivo adjunto en formato PDF.\n\n`;
  return { subject, body };
}

async function sendOne({ api = "/api/send-cert", to, name, blob }) {
  const { subject, body } = buildEmailContent(name);
  const file = new File(
    [blob],
    `certificado-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`,
    { type: "application/pdf" }
  );

  const form = new FormData();
  form.append("to", to);
  form.append("subject", subject);
  form.append("body", body);
  form.append("filename", file.name);
  form.append("file", file);

  const res = await fetch(api, { method: "POST", body: form });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || "Fallo al enviar el correo.");
  }
}

export default function SendPdfButtonsMassive({
  people,                 // [{name, email}]
  index,                  // índice actual
  getPdfBlobForIndex,     // (i:number)=> Promise<Blob>
  disabled = false,
}) {
  const [sendingOne, setSendingOne] = useState(false);
  const [sendingAll, setSendingAll] = useState(false);

  const sendCurrent = async () => {
    const person = people[index];
    if (!person) return alert("No hay registro activo.");
    const { name, email } = person;
    if (!email) return alert(`El registro "${name}" no tiene correo.`);

    try {
      setSendingOne(true);
      const blob = await getPdfBlobForIndex(index);
      if (!blob) throw new Error("No se pudo generar el PDF.");
      await sendOne({ to: email, name, blob });
      alert(`Enviado a ${email}`);
    } catch (e) {
      console.error(e);
      alert(`Error enviando a ${person.email || "correo"}: ${e.message}`);
    } finally {
      setSendingOne(false);
    }
  };

  const sendAll = async () => {
    if (!people?.length) return;
    let ok = 0, fail = 0, skipped = 0;
    const failedNames = [];

    try {
      setSendingAll(true);
      for (let i = 0; i < people.length; i++) {
        const p = people[i];
        if (!p?.email || !p?.name) { skipped++; continue; }
        try {
          const blob = await getPdfBlobForIndex(i);
          if (!blob) {
            fail++;
            failedNames.push(p.name);
            continue;
          }
          await sendOne({ to: p.email, name: p.name, blob });
          ok++;
          // pequeño respiro para no saturar SMTP
          await new Promise(r => setTimeout(r, 250));
        } catch (e) {
          console.error("sendAll item error:", e);
          fail++;
          failedNames.push(p.name);
        }
      }

      const summary =
        `Envío terminado.\n` +
        `Exitosos: ${ok}\n` +
        `Fallidos: ${fail}\n` +
        `Sin correo: ${skipped}` +
        (failedNames.length
          ? `\n\nNombres de los fallidos (${failedNames.length}):\n- ${failedNames.join("\n- ")}`
          : "");

      alert(summary);
    } finally {
      setSendingAll(false);
    }
  };

  return (
    <div className={styles.actions} style={{ gap: 8 }}>
      <button
        type="button"
        className={styles.downloadBtn}
        onClick={sendCurrent}
        disabled={disabled || sendingOne || sendingAll}
        title="Enviar el reconocimiento visible por correo"
      >
        {sendingOne ? "Enviando actual..." : "Enviar por correo (actual)"}
      </button>

      <button
        type="button"
        className={styles.downloadBtn}
        onClick={sendAll}
        disabled={disabled || sendingAll || sendingOne || !people?.length}
        title="Enviar todos los reconocimientos por correo"
      >
        {sendingAll ? "Enviando todos..." : "Enviar por correo (todos)"}
      </button>
    </div>
  );
}
