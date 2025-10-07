// app/api/send-cert/route.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const form = await req.formData();

    const to = form.get("to");
    const subject = form.get("subject") || "Reconocimiento de Participación";
    const body = form.get("body") || "";
    const filename = form.get("filename") || "certificado.pdf";
    const file = form.get("file"); // File (PDF)

    if (!to || !file) {
      return NextResponse.json({ error: "Faltan campos: 'to' o 'file'." }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from,
      to,
      subject,
      text: body,
      attachments: [
        {
          filename,
          content: buf,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-cert error:", err);
    return NextResponse.json({ error: "Error enviando el correo." }, { status: 500 });
  }
}

