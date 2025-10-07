export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // evita caché de RSC/ruta

// Utilidades 
const MAX_FILE_BYTES = Number(process.env.MAX_FILE_BYTES || 20 * 1024 * 1024); // 20MB por defecto

function headerHas(h, needle) {
  return (h || "").toLowerCase().includes(needle);
}

function splitList(value = "") {
  return String(value)
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function boolFromEnv(v, fallback = undefined) {
  if (v === undefined) return fallback;
  const s = String(v).trim().toLowerCase();
  return s === "1" || s === "true" || s === "yes";
}

async function getAttachmentFromFormData(form) {
  const file = form.get("file");
  if (!file || !file.arrayBuffer) return null;
  const buf = Buffer.from(await file.arrayBuffer());
  return {
    filename: file.name || "reconocimiento.pdf",
    content: buf,
    contentType: file.type || "application/pdf",
    size: buf.length,
  };
}

function getAttachmentFromJson(payload = {}) {
  const base64 = payload.pdfBase64?.replace?.(/^data:.*;base64,/, "");
  if (!base64) return null;
  const buf = Buffer.from(base64, "base64");
  return {
    filename: payload.pdfName || "reconocimiento.pdf",
    content: buf,
    contentType: "application/pdf",
    size: buf.length,
  };
}

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

// Handler principal 
export async function POST(req) {
  // Carga nodemailer sólo en Node runtime
  let nodemailer;
  try {
    ({ default: nodemailer } = await import("nodemailer"));
  } catch {
    return jsonResponse({ error: "Servidor sin nodemailer instalado." }, 500);
  }

  // Variables requeridas para Gmail + App Password (Opción 2)
  const required = ["SMTP_USER", "SMTP_PASS"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    return jsonResponse(
      { error: `Faltan variables de entorno: ${missing.join(", ")}` },
      500
    );
  }

  // Config Gmail: defaults a smtp.gmail.com:465 (TLS implícito)
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    boolFromEnv(process.env.SMTP_SECURE, undefined) ?? port === 465;

  // === Transporter Gmail con App Password ===
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure, // true para 465; false para 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: Number(process.env.SMTP_CONN_TIMEOUT || 10000),
    greetingTimeout: Number(process.env.SMTP_GREET_TIMEOUT || 10000),
    socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT || 20000),
    tls: {
      rejectUnauthorized: !boolFromEnv(
        process.env.SMTP_TLS_ALLOW_SELF_SIGNED,
        false
      ),
    },
    // Pool opcional para varios envíos (habilitar vía env)
    pool: boolFromEnv(process.env.SMTP_POOL, false),
    maxConnections: Number(process.env.SMTP_MAX_CONN || 3),
    maxMessages: Number(process.env.SMTP_MAX_MSG || 50),
  });

  // verify (algunos servidores lo rechazan; si falla, seguimos)
  try {
    await transporter.verify();
  } catch (e) {
    console.warn("SMTP verify warning:", e?.message || e);
  }

  // Parseo del body (JSON o FormData)
  const ct = req.headers.get("content-type") || "";
  let payload = {};
  let attachment = null;

  try {
    if (headerHas(ct, "application/json")) {
      payload = await req.json(); // { to, subject, body, html?, pdfBase64?, pdfName? }
      attachment = getAttachmentFromJson(payload);
    } else if (headerHas(ct, "multipart/form-data")) {
      const form = await req.formData();
      payload = {
        to: form.get("to"),
        cc: form.get("cc"),
        bcc: form.get("bcc"),
        replyTo: form.get("replyTo"),
        subject: form.get("subject"),
        body: form.get("body"),
        html: form.get("html"),
      };
      attachment = await getAttachmentFromFormData(form);
    } else if (headerHas(ct, "application/x-www-form-urlencoded")) {
      const text = await req.text();
      const p = Object.fromEntries(new URLSearchParams(text).entries());
      payload = p;
      attachment = null; // sin adjunto aquí
    } else {
      return jsonResponse(
        {
          error:
            'Unsupported Content-Type. Usa "multipart/form-data" o "application/json".',
        },
        415
      );
    }
  } catch (e) {
    return jsonResponse({ error: "Body inválido", detail: String(e) }, 400);
  }

  // Normalización y validaciones
  const to = splitList(payload.to);
  const cc = splitList(payload.cc);
  const bcc = splitList(payload.bcc);
  const replyTo = String(payload.replyTo || "").trim() || undefined;

  if (!to.length) {
    return jsonResponse({ error: "Campo 'to' es obligatorio." }, 400);
  }
  const subject = String(payload.subject || "").trim();
  if (!subject) {
    return jsonResponse({ error: "Campo 'subject' es obligatorio." }, 400);
  }

  // Valida adjunto si viene
  if (attachment) {
    if (attachment.size > MAX_FILE_BYTES) {
      return jsonResponse(
        {
          error: "Adjunto supera el límite permitido",
          maxBytes: MAX_FILE_BYTES,
          gotBytes: attachment.size,
        },
        413
      );
    }
  }

  // Remitente: por defecto la propia cuenta; o alias permitido ("Send mail as")
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "";
  const from = fromName ? `"${fromName}" <${fromEmail}>` : fromEmail;

  // Cuerpo del correo
  const mailOptions = {
    from,
    to,
    cc: cc.length ? cc : undefined,
    bcc: bcc.length ? bcc : undefined,
    replyTo,
    subject,
    text: payload.body && !payload.html ? String(payload.body) : undefined,
    html: payload.html ? String(payload.html) : undefined,
    attachments: attachment
      ? [
        {
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType || "application/octet-stream",
        },
      ]
      : undefined,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return jsonResponse(
      {
        ok: true,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        envelope: info.envelope,
        envelopeTime: info.envelopeTime,
        messageSize: info.messageSize,
        // response: info.response, // opcional
      },
      200
    );
  } catch (err) {
    const details = {
      message: err?.message,
      code: err?.code,
      command: err?.command,
      response: err?.response,
    };
    console.error("send-recognition error:", details);
    return jsonResponse({ error: "MailerError", ...details }, 500);
  }
}

// OPTIONS (preflight) 
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}
