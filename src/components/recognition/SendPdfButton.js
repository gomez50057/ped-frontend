"use client";

import { useState } from "react";
import styles from "@/styles/recognition/Recognition.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SendPdfButton({
  name = "",
  getPdfBlob,        // () => Promise<Blob>
  disabled = false,
}) {
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!name?.trim()) {
      alert("No hay un nombre confirmado aún.");
      return;
    }

    const to = window.prompt("Escribe el correo electrónico del destinatario:");
    if (to === null) return; // canceló
    if (!EMAIL_RE.test(String(to).trim())) {
      alert("Correo no válido. Intenta nuevamente (ej. usuario@dominio.com).");
      return;
    }

    try {
      setSending(true);

      // 1) Generar/obtener PDF como Blob
      const pdfBlob = await getPdfBlob();
      if (!pdfBlob) {
        alert("No se pudo generar el PDF.");
        return;
      }

      // Bloquear adjuntos > 17 MB (para no rebotar en Gmail por base64)
      const maxAttachBytes = 17 * 1024 * 1024;
      if (pdfBlob.size > maxAttachBytes) {
        const mb = (pdfBlob.size / (1024 * 1024)).toFixed(2);
        alert(`El PDF pesa ${mb} MB y podría rebotar en Gmail.\nIntenta de nuevo o reduce el tamaño del fondo.`);
        return;
      }

      // 2) Armar asunto, cuerpo y adjunto
      const subject = `Reconocimiento de Participación – ${name}`;

      const body =
        `¡Felicidades, ${name}!\n\n` +
        `Queremos agradecer tu participación en los Foros de Consulta Diálogos Ciudadanos para la Actualización del Plan Estatal de Desarrollo 2025-2028.\n\n` +
        `Estos foros no son únicamente un espacio de consulta, sino una plataforma de diálogo abierto donde la ciudadanía aporta su visión y compromiso para trazar, junto con el gobierno, la ruta de desarrollo que guiará a Hidalgo en los próximos años. Tu voz contribuyó a darle fuerza y sentido ciudadano a este proceso.\n\n` + 
        `Como muestra de reconocimiento a tu contribución, te compartimos tu Constancia de Participación en un archivo adjunto en formato pdf.\n\n`;

      const safeName = String(name)
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/(^-|-$)/g, "")
        .toLowerCase();
      const filename = `certificado-${safeName || "participante"}.pdf`;

      const form = new FormData();
      form.append("to", to);
      form.append("subject", subject);
      form.append("body", body);
      form.append("file", pdfBlob, filename);

      // 3) Enviar al endpoint
      const res = await fetch("/api/send-recognition", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Error HTTP ${res.status}`);
      }

      alert("¡Enviado! Revisa la bandeja del destinatario (y su carpeta de spam).");
      // Limpieza de sesión
      sessionStorage.removeItem("cert:name");
      sessionStorage.removeItem("cert:dateISO");
      sessionStorage.removeItem("cert:municipio");
    } catch (err) {
      console.error(err);
      alert(`No se pudo enviar el correo.\n\n${err.message || ""}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <button
      type="button"
      className={styles.downloadBtn}
      onClick={handleSend}
      disabled={disabled || sending}
      title="Enviar reconocimiento por correo"
    >
      {sending ? "Enviando..." : "Enviar por correo"}
    </button>
  );
}
